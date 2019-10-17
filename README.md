# fast-spec

Discover laws in your code like with QuickSpec

## In a nutshell

Have you ever wonder what could be the laws that rule your code? The complex relations there might be between two distinct functions?

`fast-spec` is able to help you discovering them.

## Example

Let's find the laws that link `concat`, `reverse` and `[]` together.

```ts
import * as fc from "fast-check";
import { funcDef, instDef, varDef, findSpecs } from "fast-spec";

findSpecs([
  // declare functions to be considered
  funcDef("concat", 2, (a: any[], b: any[]) => [...a, ...b]),
  funcDef("reverse", 1, (a: any[]) => [...a].reverse()),
  // declare basic root values (of special interest)
  instDef("[]", []),
  // declare complex values that can be consumed by your functions
  varDef("x", fc.array(fc.char()))
])
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
