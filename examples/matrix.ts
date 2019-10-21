import * as fc from 'fast-check';
import { funcDef, instDef, varDef, findSpecs, FindSpecSettings } from '../src/fast-spec';
// replace by: from 'fast-spec'

export function matrixSpecs(settings: FindSpecSettings) {
  return findSpecs(
    [
      funcDef('add', 2, add),
      funcDef('mul', 2, mul),
      funcDef('transpose', 1, transpose),
      funcDef('neg', 1, neg),
      funcDef('diag', 1, diag),
      funcDef('com', 1, com),
      funcDef('inv', 1, inv),
      funcDef('det', 1, det),
      instDef('Id', [[1, 0], [0, 1]]),
      instDef('0', 0),
      varDef('mi', invertibleMatrixArb),
      varDef('mn', nonInvertibleMatrixArb)
    ],
    settings
  );
}

// Matrix internal

// [
//   [ m[0][0], m[0][1] ],
//   [ m[1][0], m[1][1] ],
// ]
type Matrix = [[number, number], [number, number]];

const matrixArb = fc.array(fc.integer(-100, 100), 4, 4).map(vs => [[vs[0], vs[1]], [vs[2], vs[3]]]);
const invertibleMatrixArb = matrixArb.filter((m: Matrix) => det(m) !== 0);
const nonInvertibleMatrixArb = fc
  .tuple(fc.array(fc.integer(-100, 100), 2, 2), fc.integer(-10, 10))
  .map(([vs, f]) => [[vs[0], vs[1]], [f * vs[0], f * vs[1]]]);

function add(ma: Matrix, mb: Matrix): Matrix {
  // prettier-ignore
  return [
    [ ma[0][0] + mb[0][0], ma[0][1] + mb[0][1] ],
    [ ma[1][0] + mb[1][0], ma[1][1] + mb[1][1] ]
  ];
}
function mul(ma: Matrix, mb: Matrix): Matrix {
  // prettier-ignore
  return [
    [ ma[0][0] * mb[0][0] + ma[0][1] * mb[1][0], ma[0][0] * mb[0][1] + ma[0][1] * mb[1][1] ],
    [ ma[1][0] * mb[0][0] + ma[1][1] * mb[1][0], ma[1][0] * mb[0][1] + ma[1][1] * mb[1][1] ],
  ];
}
function transpose(m: Matrix): Matrix {
  // prettier-ignore
  return [
    [ m[0][0], m[1][0] ],
    [ m[0][1], m[1][1] ]
  ];
}
function neg(m: Matrix): Matrix {
  // prettier-ignore
  return [
    [ -m[0][0], -m[0][1] ],
    [ -m[1][0], -m[1][1] ]
  ];
}
function diag(m: Matrix): Matrix {
  // prettier-ignore
  return [
    [ m[0][0],    0    ],
    [    0   , m[1][1] ]
  ];
}
function com(m: Matrix): Matrix {
  // prettier-ignore
  return [
    [  m[1][1], -m[0][1] ],
    [ -m[1][0],  m[0][0] ]
  ];
}
function inv(m: Matrix): Matrix {
  const d = m[0][0] * m[1][1] - m[0][1] * m[1][0];
  if (d === 0) {
    throw new Error(`This matrix is not inversible`);
  }
  // prettier-ignore
  return [
    [  m[1][1] / d, -m[0][1] / d ],
    [ -m[1][0] / d,  m[0][0] / d ]
  ];
}
function det(m: Matrix): number {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}
