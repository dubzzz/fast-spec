import * as fc from "fast-check";
import { funcDef, instDef, varDef, findSpecs } from "./fast-spec";

console.log(
  findSpecs([
    funcDef("concat", 2, (a: any[], b: any[]) => [...a, ...b]),
    funcDef("reverse", 1, (a: any[]) => [...a].reverse()),
    instDef("[]", []),
    varDef("x", fc.array(fc.char()))
  ])
);

console.log(
  findSpecs([
    funcDef("concat", 2, (a: any[], b: any[]) => [...a, ...b]),
    funcDef("reverse", 1, (a: any[]) => [...a].reverse()),
    funcDef("length", 1, (a: any[]) => a.length),
    funcDef("map", 1, (a: any[]) => a.map(s => s + s)),
    instDef("[]", []),
    varDef("x", fc.array(fc.char()))
  ])
);

console.log(
  findSpecs([
    funcDef("concat", 2, (a: any[], b: any[]) => [...a, ...b]),
    instDef("[]", []),
    varDef("x", fc.array(fc.char()))
  ])
);

console.log(
  findSpecs([
    funcDef("mul", 2, (a: number, b: number) => a * b),
    funcDef("div", 2, (a: number, b: number) => a / b),
    funcDef("plus", 2, (a: number, b: number) => a + b),
    funcDef("minus", 2, (a: number, b: number) => a - b),
    instDef("1", 1),
    instDef("0", 0),
    varDef("x", fc.integer())
  ])
);
