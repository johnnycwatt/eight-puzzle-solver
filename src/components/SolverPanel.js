// File: SolverPanel.js
// Author: Johnny CW
// Date: March 24, 2025
// Description: React component for solver controls and solution display.

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import StatsModal from './StatsModal';

const Panel = styled.div`
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 10px 20px;
  width: 120px;
  margin: 0 10px;
  background: #1f2833;
  color: #c5c6c7;
  border: none;
  border-radius: 15px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  &:hover {
    background: #3a4446;
    color: #c5c6c7;
    scale: 1.05;
  }
  &:disabled {
    background: #1f2833;
    color: #c5c6c7;
    opacity: 0.5;
    cursor: not-allowed;
    scale: 1;
  }
`;

const Select = styled.select`
  margin: 0 10px;
  padding: 10px;
  height: 40px;
  width: 150px;
  background: #1f2833;
  color: #c5c6c7;
  border: none;
  border-radius: 15px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23c5c6c7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  transition: all 0.3s ease;

  &:hover {
    background: #3a4446;
    color: #c5c6c7;
  }

  &:focus {
    outline: none;
    background: #3a4446;
  }

  option {
    background: #1f2833;
    color: #c5c6c7;
  }
`;

function SolverPanel({ onSolve, solution, isSolving, hasStats }) {
  const [method, setMethod] = useState('uc');
  const [heuristic, setHeuristic] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowStats = () => {
    console.log('Solution state before opening modal:', solution);
    setIsModalOpen(true);
  };

  useEffect(() => {
    console.log('Solution updated in SolverPanel:', solution);
  }, [solution]);

  return (
    <>
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
              <option value={1}>Manhattan</option>
            </Select>
          </label>
        )}
        <Button onClick={() => onSolve(method, heuristic)} disabled={isSolving}>
          {isSolving ? 'Solving...' : 'Solve'}
        </Button>
        <Button onClick={handleShowStats} disabled={!hasStats}>
          Stats
        </Button>
      </Panel>
        <StatsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          solution={solution}
        />
    </>
  );
}

export default SolverPanel;