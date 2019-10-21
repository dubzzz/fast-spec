import { Arbitrary, check, property, genericTuple } from 'fast-check';
import isEqual = require('lodash.isequal');

export function combinationCheck(
  arbs: Arbitrary<any>[],
  builder1: (d: any[]) => any,
  builder2: (d: any[]) => any,
  numFuzz?: number
): boolean {
  if (arbs.length === 0) {
    // Combination only rely on constants
    try {
      return isEqual(builder1([]), builder2([]));
    } catch (_err) {
      return false;
    }
  } else {
    // Combination rely on non-constant values
    const out = check(
      property(genericTuple(arbs), t => {
        return isEqual(builder1(t), builder2(t));
      }),
      { numRuns: numFuzz, endOnFailure: true }
    );
    return !out.failed;
  }
}
