// File: PuzzleGrid.js
// Author: Johnny CW
// Date: March 24, 2025
// Description: React component to render the 8-puzzle grid with animated tiles.

import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  max-width: 410px;
  max-height: 410px;
  width: 40%;
  height: 35%;
  min-width: 300px;
  min-height: 300px;
  margin: 20px auto;
  background: #1f283372;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  padding: 5%;
`;

const Tile = styled(motion.div)`
  margin: 5%;
  width: auto;
  height: auto;
  aspect-ratio: 1 / 1;
  background: ${(props) => (props.isBlank ? 'transparent' : '#61dafb')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  color: white;
  border-radius: 10px;
  border: ${(props) => (props.isBlank ? 'none' : '1px solid #333')};
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => (props.isBlank ? 'transparent' : '#21a1f1')};
    color: white;
  }
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
          key={idx}
          isBlank={tile === 0}
          animate={{
            x: 0,
            y: 0,
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