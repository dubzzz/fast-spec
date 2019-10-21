import * as fc from 'fast-check';
import { funcDef, instDef, varDef, findSpecs, FindSpecSettings } from '../src/fast-spec';
// replace by: from 'fast-spec'

export function arraySpecs(settings: FindSpecSettings) {
  return findSpecs(
    [
      funcDef('concat', 2, (a: any[], b: any[]) => [...a, ...b]),
      funcDef('reverse', 1, (a: any[]) => [...a].reverse()),
      instDef('[]', []),
      varDef('x', fc.array(fc.char()))
    ],
    settings
  );
}
