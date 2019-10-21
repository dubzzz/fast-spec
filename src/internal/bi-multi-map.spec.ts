import { BiMultiMap } from './bi-multi-map';

test('should not detect links between non existing nodes', () => {
  // Arrange
  const biMulti = new BiMultiMap();

  // Act
  biMulti.add('a', 'b');

  // Assert
  expect(biMulti.has('c', 'd')).toBe(false);
});

test('should not detect links between unrelated nodes', () => {
  // Arrange
  const biMulti = new BiMultiMap();

  // Act
  biMulti.add('a', 'b');
  biMulti.add('c', 'd');

  // Assert
  expect(biMulti.has('a', 'd')).toBe(false);
});

test('should detect links between related nodes', () => {
  // Arrange
  const biMulti = new BiMultiMap();

  // Act
  biMulti.add('a', 'b');

  // Assert
  expect(biMulti.has('a', 'b')).toBe(true);
});

test('should detect links between related nodes declared in the opposite order', () => {
  // Arrange
  const biMulti = new BiMultiMap();

  // Act
  biMulti.add('a', 'b');

  // Assert
  expect(biMulti.has('b', 'a')).toBe(true);
});
