import isEqual from "lodash.isequal";
import {
  array,
  memo,
  constant,
  constantFrom,
  genericTuple,
  shuffledSubarray,
  oneof,
  tuple,
  sample,
  check,
  property,
  Arbitrary
} from "fast-check";

export enum SpecDefType {
  Function = "function",
  Instance = "instance",
  Variable = "variable"
}

export type SpecDefFunction = {
  type: SpecDefType.Function;
  name: string;
  numParameters: number;
  value: (...args: any[]) => any;
};
export function funcDef(
  name: string,
  numParameters: number,
  value: (...args: any[]) => any
): SpecDefFunction {
  return { name, type: SpecDefType.Function, value, numParameters };
}

export type SpecDefInstance = {
  type: SpecDefType.Instance;
  name: string;
  value: any;
};
export function instDef(name: string, value: any): SpecDefInstance {
  return { name, type: SpecDefType.Instance, value };
}

export type SpecDefVariable = {
  type: SpecDefType.Variable;
  name: string;
  value: Arbitrary<any>;
};
export function varDef(name: string, value: Arbitrary<any>): SpecDefVariable {
  return { name, type: SpecDefType.Variable, value };
}

export type FindSpecElement =
  | SpecDefFunction
  | SpecDefInstance
  | SpecDefVariable;

type FindSpecsInternal = {
  numArbs: number;
  build: (ins: any[], offset: number) => { value: any; nextOffset: number };
  repr: (
    ins: string[],
    offset: number
  ) => { value: string; nextOffset: number };
};
type FindSpecsInternalBuilder = (n?: number) => Arbitrary<FindSpecsInternal>;

export function findSpecs(def: FindSpecElement[]): string[] {
  const baseArbs: { name: string; arb: Arbitrary<any> }[] = [];
  const specTermArbBuilder: FindSpecsInternalBuilder[] = [];

  for (const el of def) {
    switch (el.type) {
      case SpecDefType.Variable: {
        baseArbs.push({ name: el.name, arb: el.value });
        specTermArbBuilder.push(
          memo(() =>
            constant({
              numArbs: 1,
              build: (vs: any[], offset: number) => {
                return { value: vs[offset], nextOffset: offset + 1 };
              },
              repr: (xn: string[], offset: number) => {
                return { value: xn[offset], nextOffset: offset + 1 };
              }
            })
          )
        );
        break;
      }
      case SpecDefType.Instance: {
        specTermArbBuilder.push(
          memo(() =>
            constant({
              numArbs: 0,
              build: (vs: any[], offset: number) => {
                return { value: el.value, nextOffset: offset };
              },
              repr: (xn: string[], offset: number) => {
                return { value: el.name, nextOffset: offset };
              }
            })
          )
        );
        break;
      }
      case SpecDefType.Function: {
        const elArb = memo(n =>
          n <= 1 || el.numParameters === 0
            ? constant({
                numArbs: el.numParameters,
                build: (vs: any[], offset: number) => {
                  const nextOffset = offset + el.numParameters;
                  return {
                    value: el.value(...vs.slice(offset, nextOffset)),
                    nextOffset
                  };
                },
                repr: (xn: string[], offset: number) => {
                  const nextOffset = offset + el.numParameters;
                  return {
                    value: `${el.name}(${xn
                      .slice(offset, nextOffset)
                      .join(", ")})`,
                    nextOffset
                  };
                }
              })
            : genericTuple(
                [...Array(el.numParameters)].map(() =>
                  oneof(...specTermArbBuilder.map(a => a()))
                )
              ).map(t => {
                return {
                  numArbs: t.reduce((acc, cur) => acc + cur.numArbs, 0),
                  build: (ins: any[], offset: number) => {
                    let nextOffset = offset;
                    const vs: any = [];
                    for (let idx = 0; idx !== el.numParameters; ++idx) {
                      const tmp = t[idx].build(ins, nextOffset);
                      nextOffset = tmp.nextOffset;
                      vs.push(tmp.value);
                    }
                    return {
                      value: el.value(...vs),
                      nextOffset
                    };
                  },
                  repr: (xn: string[], offset: number) => {
                    let nextOffset = offset;
                    const vs: string[] = [];
                    for (let idx = 0; idx !== el.numParameters; ++idx) {
                      const tmp = t[idx].repr(xn, nextOffset);
                      nextOffset = tmp.nextOffset;
                      vs.push(tmp.value);
                    }
                    return {
                      value: `${el.name}(${vs.join(", ")})`,
                      nextOffset
                    };
                  }
                };
              })
        );
        specTermArbBuilder.push(elArb);
        break;
      }
    }
  }
  const maxDepth = 2;
  const specTermArb = oneof(...specTermArbBuilder.map(a => a(maxDepth)));
  const specArb = tuple(specTermArb, specTermArb)
    .chain(([t1, t2]) => {
      const numArbs = t1.numArbs > t2.numArbs ? t1.numArbs : t2.numArbs;
      const variableIndexes = [...Array(numArbs)].map((_, i) => i);

      return tuple(
        oneof(
          constant(variableIndexes),
          shuffledSubarray(variableIndexes, numArbs, numArbs)
        ),
        numArbs > 0
          ? array(constantFrom(...baseArbs), numArbs, numArbs) // throw if no baseArbs
          : constant([])
      ).map(([reindex, inputsDef]) => {
        const applyReindex = (ins: any[]) => {
          return reindex.map(ri => ins[ri]);
        };
        const variableNames = inputsDef.map(
          (inputDef, i) => `${inputDef.name}${i}`
        );
        return {
          inputArbs: inputsDef.map(inputDef => inputDef.arb),
          build1: (ins: any[]) => t1.build(ins, 0).value,
          build2: (ins: any[]) => t2.build(applyReindex(ins), 0).value,
          spec1: `${t1.repr(variableNames, 0).value}`,
          spec2: `${t2.repr(applyReindex(variableNames), 0).value}`
        };
      });
    })
    .map(d =>
      d.spec1 < d.spec2
        ? d
        : {
            inputArbs: d.inputArbs,
            build1: d.build2,
            build2: d.build1,
            spec1: d.spec2,
            spec2: d.spec1
          }
    )
    .noShrink();

  const validSpecs: string[] = [];
  const alreadyTried = new Set<string>();
  for (const spec of sample(specArb, 1000)) {
    const specLabel = `${spec.spec1} == ${spec.spec2}`;
    if (alreadyTried.has(specLabel)) {
      continue;
    }
    alreadyTried.add(specLabel);

    if (spec.inputArbs.length === 0) {
      if (isEqual(spec.build1([]), spec.build2([]))) {
        validSpecs.push(specLabel);
      }
    } else {
      const out = check(
        property(genericTuple(spec.inputArbs), t => {
          return isEqual(spec.build1(t), spec.build2(t));
        })
      );
      if (!out.failed) validSpecs.push(specLabel);
    }
  }
  return [...new Set(validSpecs)].sort();
}
