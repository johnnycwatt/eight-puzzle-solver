// File: SolverPanel.js
// Author: Johnny CW
// Date: March 24, 2025
// Description: React component for solver controls and solution display.

import React, { useState } from 'react';
import styled from 'styled-components';

const Panel = styled.div`
  margin: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 0 10px;
  background: #61dafb;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: #21a1f1;
  }
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  margin: 0 10px;
  padding: 5px;
`;

const SolutionDetails = styled.div`
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  p {
    margin: 5px 0;
  }
  strong {
    color: #333;
  }
`;

/**
 * Provides controls to solve the puzzle and displays results.
 * @param {function} onSolve - Callback to trigger solver (method, heuristic)
 * @param {object} solution - Solution data { path, stats }
 * @param {boolean} isSolving - Indicates if solver is currently running
 */
function SolverPanel({ onSolve, solution, isSolving }) {
  const [method, setMethod] = useState('uc');
  const [heuristic, setHeuristic] = useState(0);

  return (
    <Panel>
      <label>
        Method:
        <Select value={method} onChange={(e) => setMethod(e.target.value)} disabled={isSolving}>
          <option value="uc">Uniform Cost</option>
          <option value="astar">A*</option>
        </Select>
      </label>
      {method === 'astar' && (
        <label>
          Heuristic:
          <Select value={heuristic} onChange={(e) => setHeuristic(Number(e.target.value))} disabled={isSolving}>
            <option value={0}>Misplaced Tiles</option>
            <option value={1}>Manhattan Distance</option>
          </Select>
        </label>
      )}
      <Button onClick={() => onSolve(method, heuristic)} disabled={isSolving}>
        {isSolving ? 'Solving...' : 'Solve'}
      </Button>
      {solution.stats && (
        <SolutionDetails>
          <h2>Solution</h2>
          {solution.path ? (
            <>
              <p><strong>Solution Found:</strong> Yes</p>
              <p><strong>Path:</strong> {solution.path}</p>
              <p><strong>Length:</strong> {solution.stats.pathLength}</p>
              <p><strong>Expansions:</strong> {solution.stats.expansions}</p>
              <p><strong>Max Queue:</strong> {solution.stats.maxQLength}</p>
              <p><strong>Time:</strong> {(solution.stats.time / 1000).toFixed(3)} seconds</p>
            </>
          ) : (
            <>
              <p><strong>Solution Found:</strong> No</p>
              <p>No solution exists for this puzzle state.</p>
              <p><strong>Expansions:</strong> {solution.stats.expansions}</p>
              <p><strong>Max Queue:</strong> {solution.stats.maxQLength}</p>
              <p><strong>Time:</strong> {(solution.stats.time / 1000).toFixed(3)} seconds</p>
            </>
          )}
        </SolutionDetails>
      )}
    </Panel>
  );
}

export default SolverPanel;