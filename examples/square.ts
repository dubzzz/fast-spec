import * as fc from 'fast-check';
import { funcDef, varDef, findSpecs, FindSpecSettings } from '../src/fast-spec';
// replace by: from 'fast-spec'

export function squareSpecs(settings: FindSpecSettings) {
  return findSpecs(
    [
      funcDef('mul', 2, (a: number, b: number) => a * b),
      funcDef('square', 1, (a: number) => a * a),
      varDef('x', fc.integer())
    ],
    settings
  );
}
