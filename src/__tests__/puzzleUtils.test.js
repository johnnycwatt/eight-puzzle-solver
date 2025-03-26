// File: src/__tests__/puzzleUtils.test.js
// Author: Johnny CW
// Date: March 26, 2025
// Description: Unit tests for puzzleUtils.js using Jest.

import { isSolvable, generateRandomState } from '../utils/puzzleUtils';

describe('isSolvable', () => {
  test('returns true for the solved state "123456780" (0 inversions)', () => {
    expect(isSolvable('123456780')).toBe(true);
  });

  test('returns true for a solvable state "208135467" (6 inversions)', () => {
    expect(isSolvable('208135467')).toBe(true);
  });

  test('handles state with blank tile at start "102345678"', () => {
    expect(isSolvable('102345678')).toBe(true);
  });

  test('throws an error for non-string input', () => {
    expect(() => isSolvable(123456780)).toThrow('Invalid puzzle state: must be a 9-digit string with 0-8');
  });

  test('throws an error for invalid length (less than 9 digits)', () => {
    expect(() => isSolvable('123')).toThrow('Invalid puzzle state: must be a 9-digit string with 0-8');
  });

  test('throws an error for invalid characters', () => {
    expect(() => isSolvable('12345abc0')).toThrow('Invalid puzzle state: must be a 9-digit string with 0-8');
  });
});

describe('generateRandomState', () => {
  test('returns a string of 9 unique digits (0-8)', () => {
    const state = generateRandomState();
    expect(state).toHaveLength(9);
    const digitSet = new Set(state);
    expect(digitSet.size).toBe(9);
    expect([...digitSet].every(d => d >= '0' && d <= '8')).toBe(true);
  });

  test('returns a solvable state', () => {
    const state = generateRandomState();
    expect(isSolvable(state)).toBe(true);
  });

  test('generates different states on multiple calls', () => {
    const state1 = generateRandomState();
    const state2 = generateRandomState();
    expect(state1).not.toBe(state2);
  });
});