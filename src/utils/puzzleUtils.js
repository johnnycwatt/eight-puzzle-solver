// File: src/utils/puzzleUtils.js
// Author: Johnny CW
// Date: March 26, 2025
// Description: Utility functions for 8 Puzzle Solver logic.

/**
 * Check if a puzzle state is solvable by counting inversions.
 * @param {string} state - Puzzle state as a string (e.g., "123456780")
 * @returns {boolean} - True if solvable, false otherwise
 */

export const isSolvable = (state) => {
  if(typeof state !== 'string' || state.length !== 9 || !/^[0-8]{9}$/.test(state)){
    throw new Error('Invalid puzzle state: must be a 9-digit string with 0-8');
  }
  const tiles = state.split('').map(Number).filter(n => n !== 0);
  let inversions = 0;
  for (let i = 0; i < tiles.length - 1; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] > tiles[j]) inversions++;
    }
  }
  return inversions % 2 === 0;
};


/**
 * Generates a random solvable puzzle state.
 * @returns {string} - A solvable puzzle state (e.g., "102345678")
 */
export const generateRandomState = () => {
  let state;
  do {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    // Fisher-Yates shuffle
    for (let i = digits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [digits[i], digits[j]] = [digits[j], digits[i]];
    }
    state = digits.join('');
  } while (!isSolvable(state));
  return state;
};


