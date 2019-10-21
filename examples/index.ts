import { FindSpecSettings } from '../src/fast-spec';
import { matrixSpecs } from './matrix';
import { numberSpecs } from './number';
import { arraySpecs } from './array';
import { squareSpecs } from './square';

const settings: FindSpecSettings = { numSamples: 10000 };
const exec = (label: string, extractSpecs: (settings: FindSpecSettings) => string[]) => {
  console.log(`>>> ${label} <<<`);
  console.log(extractSpecs(settings));
};

exec('array', arraySpecs);
exec('matrix', matrixSpecs);
exec('number', numberSpecs);
exec('square', squareSpecs);
