import { combinationCheck } from './combination-checker';
import { nat } from 'fast-check';

test('should detect valid static combinations', () => {
  // Arrange
  const builder1 = () => [1, 2, 3];
  const builder2 = () => [1, 2, 3];

  // Act
  const out = combinationCheck([], builder1, builder2);

  // Act
  expect(out).toBe(true);
});

test('should detect invalid static combinations', () => {
  // Arrange
  const builder1 = () => [1, 2, 3];
  const builder2 = () => [1, 2, 4];

  // Act
  const out = combinationCheck([], builder1, builder2);

  // Act
  expect(out).toBe(false);
});

test('should detect valid static combinations', () => {
  // Arrange
  const arbs = [nat(), nat()];
  const builder1 = ([a, b]: [number, number]) => a * b;
  const builder2 = ([a, b]: [number, number]) => b * a;

  // Act
  const out = combinationCheck(arbs, builder1, builder2);

  // Act
  expect(out).toBe(true);
});

test('should detect invalid static combinations', () => {
  // Arrange
  const arbs = [nat(), nat()];
  const builder1 = ([a, b]: [number, number]) => a * b;
  const builder2 = ([a, b]: [number, number]) => a + b;

  // Act
  const out = combinationCheck(arbs, builder1, builder2);

  // Act
  expect(out).toBe(false);
});
