// File: PuzzleGrid.js
// Author: Johnny CW
// Date: March 24, 2025
// Description: React component to render the 8-puzzle grid with animated tiles.

import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  gap: 5px;
  width: 520px;
  height: 520px;
  margin: 20px auto;
  background: #f0f0f0;
  padding: 5px;
  border: 2px solid #333;
  border-radius: 10px;
`;

const Tile = styled(motion.div)`
  width: 100px;
  height: 100px;
  background: ${(props) => (props.isBlank ? 'transparent' : '#61dafb')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: white;
  border-radius: 10px;
  border: ${(props) => (props.isBlank ? 'none' : '1px solid #333')};
`;

/**
 * Displays puzzle tiles with animated transitions.
 * @param {string} state - Current puzzle state (e.g., "123456780")
 */
function PuzzleGrid({ state }) {
  const tiles = state.split('').map(Number);

  return (
    <Grid>
      {tiles.map((tile, idx) => (
        <Tile
          key={tile}
          isBlank={tile === 0}
          animate={{
            x: (idx % 3) * 105,
            y: Math.floor(idx / 3) * 105,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {tile !== 0 ? tile : ''} {/* Show empty space for blank tile */}
        </Tile>
      ))}
    </Grid>
  );
}

export default PuzzleGrid;