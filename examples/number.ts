import * as fc from 'fast-check';
import { funcDef, instDef, varDef, findSpecs, FindSpecSettings } from '../src/fast-spec';
// replace by: from 'fast-spec'

export function numberSpecs(settings: FindSpecSettings) {
  return findSpecs(
    [
      funcDef('mul', 2, (a: number, b: number) => a * b),
      funcDef('div', 2, (a: number, b: number) => a / b),
      funcDef('plus', 2, (a: number, b: number) => a + b),
      funcDef('minus', 2, (a: number, b: number) => a - b),
      instDef('1', 1),
      instDef('0', 0),
      varDef('x', fc.integer())
    ],
    settings
  );
}
