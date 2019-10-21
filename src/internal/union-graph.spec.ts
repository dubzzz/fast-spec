import { UnionGraph } from './union-graph';

test('should be able to declare an empty graph', () => {
  // Arrange / Act
  const union = new UnionGraph();

  // Act
  expect(reorder(union.values())).toEqual([]);
});

test('should be able to declare a first link', () => {
  // Arrange
  const union = new UnionGraph();

  // Act
  union.addLink('a', 'b');

  // Assert
  expect(reorder(union.values())).toEqual([['a', 'b']]);
});

test('should be able to add nodes without any of them from the tree', () => {
  // Arrange
  const union = new UnionGraph();

  // Act
  union.addLink('a', 'b');
  union.addLink('c', 'd');

  // Assert
  expect(reorder(union.values())).toEqual([['a', 'b'], ['c', 'd']]);
});

test('should be able to add a new node to an existing tree', () => {
  // Arrange
  const union = new UnionGraph();

  // Act
  union.addLink('a', 'b');
  union.addLink('a', 'c');

  // Assert
  expect(reorder(union.values())).toEqual([['a', 'b', 'c']]);
});

test('should be able to add a new node to an existing tree by referencing the other node', () => {
  // Arrange
  const union = new UnionGraph();

  // Act
  union.addLink('a', 'b');
  union.addLink('b', 'c');

  // Assert
  expect(reorder(union.values())).toEqual([['a', 'b', 'c']]);
});

test('should be able to merge two trees together', () => {
  // Arrange
  const union = new UnionGraph();

  // Act
  union.addLink('a', 'b');
  union.addLink('c', 'd');
  union.addLink('b', 'd');

  // Assert
  expect(reorder(union.values())).toEqual([['a', 'b', 'c', 'd']]);
});

test('should be able to add new nodes on merged trees', () => {
  // Arrange
  const union = new UnionGraph();

  // Act
  union.addLink('a', 'b');
  union.addLink('c', 'd');
  union.addLink('b', 'd');
  union.addLink('b', 'e');
  union.addLink('c', 'f');

  // Assert
  expect(reorder(union.values())).toEqual([['a', 'b', 'c', 'd', 'e', 'f']]);
});

test('should not find a link between non existing nodes', () => {
  // Arrange
  const union = new UnionGraph();

  // Act
  union.addLink('a', 'b');

  // Assert
  expect(union.hasLink('c', 'd')).toBe(false);
});

test('should not find a link if one of the node is missing', () => {
  // Arrange
  const union = new UnionGraph();

  // Act
  union.addLink('a', 'b');

  // Assert
  expect(union.hasLink('b', 'c')).toBe(false);
  expect(union.hasLink('c', 'b')).toBe(false);
});

test('should not find a link between unrelated nodes', () => {
  // Arrange
  const union = new UnionGraph();

  // Act
  union.addLink('a', 'b');
  union.addLink('c', 'd');

  // Assert
  expect(union.hasLink('b', 'c')).toBe(false);
});

test('should find a link between directly linked nodes', () => {
  // Arrange
  const union = new UnionGraph();

  // Act
  union.addLink('a', 'b');

  // Assert
  expect(union.hasLink('a', 'b')).toBe(true);
  expect(union.hasLink('b', 'a')).toBe(true);
});

test('should find a link between indirectly linked nodes', () => {
  // Arrange
  const union = new UnionGraph();

  // Act
  union.addLink('a', 'b');
  union.addLink('b', 'c');

  // Assert
  expect(union.hasLink('a', 'c')).toBe(true);
  expect(union.hasLink('c', 'a')).toBe(true);
});

// Helper

function reorder(values: string[][]): string[][] {
  return values.map(vs => vs.sort()).sort((vsA, vsB) => vsA[0].localeCompare(vsB[0]));
}
