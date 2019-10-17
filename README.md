# fast-spec

Discover laws in your code like with QuickSpec

## In a nutshell

Have you ever wonder what could be the laws that rule your code? The complex relations there might be between two distinct functions?

`fast-spec` is able to help you discovering them.

## Example

Let's find the laws that link `concat`, `reverse` and `[]` together.

```js
import * as fc from "fast-check";
import { funcDef, instDef, varDef, findSpecs } from "fast-spec";
// const fc = require("fast-check");
// const { funcDef, instDef, varDef, findSpecs } = require("fast-spec");

findSpecs([
  // declare functions to be considered
  funcDef("concat", 2, (a, b) => [...a, ...b]),
  funcDef("reverse", 1, (a) => [...a].reverse()),
  // declare basic root values (of special interest)
  instDef("[]", []),
  // declare complex values that can be consumed by your functions
  varDef("x", fc.array(fc.char()))
], { // optional settings
  // number of combinations to try - default: 100
  numSamples: 100,
  // complexity of the combinations - default: 2
  complexity: 2,
  // number of inputs to try to confirm a combination - default: 100
  numFuzz: 100
})
```

`fast-spec` will be able to find relationships like:
- concat([], []) = []
- concat([], x0) == x0
- concat(x0, []) == x0
- concat(concat(x0, x1), x2) == concat(x0, concat(x1, x2))
- concat(reverse(x0), reverse(x1)) == reverse(concat(x1, x0))
- reverse([]) = []
- reverse(reverse(x0)) == x0
- ...

*Live example available at https://runkit.com/dubzzz/hello-world-fast-spec-v2*