// File: SolverPanel.js
// Author: Johnny CW
// Date: March 26, 2025
// Description: Custom modal to display stats

import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #1f2833;
  color: #e4faf8;
  border-radius: 10px;
  box-shadow: 4px 4px rgba(255, 255, 255, 0.2), 5px 5px 5px rgba(255, 255, 255, 0.3);
  padding: 20px;
  width: 90%;
  max-width: 400px;
  position: relative;
  animation: modal 0.5s ease;

  @keyframes modal {
    from {
      opacity: 0;
      transform: translateY(-100px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #e4faf8;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #45a29d;
    scale: 1.1;
  }
`;

const StatsTitle = styled.h2`
  margin: 0 0 15px;
  font-size: 1.5em;
  text-align: center;
`;

const StatItem = styled.p`
  margin: 5px 0;
  font-size: 1.1em;
  display: flex;
  justify-content: space-between;
`;

function StatsModal({ isOpen, onClose, solution }) {
  if (!isOpen) return null;

  // Guard clause: If solution or solution.stats is undefined, show a loading message
  if (!solution || !solution.stats) {
    return (
      <ModalOverlay isOpen={isOpen}>
        <ModalContent>
          <CloseButton onClick={onClose}>×</CloseButton>
          <StatsTitle>Solution Stats</StatsTitle>
          <StatItem>Loading stats...</StatItem>
        </ModalContent>
      </ModalOverlay>
    );
  }

  // Ensure stats properties exist, provide fallback values if undefined
  const { path, stats } = solution;
  const expansions = stats.expansions ?? 0;
  const maxQLength = stats.maxQLength ?? 0;
  const pathLength = stats.pathLength ?? 0;
  const time = stats.time ?? 0;

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <StatsTitle>Solution Stats</StatsTitle>
        {path ? (
          <>
            <StatItem>
              <strong>Solution Found:</strong> Yes
            </StatItem>
            <StatItem>
              <strong>Path:</strong> {path}
            </StatItem>
            <StatItem>
              <strong>Length:</strong> {pathLength}
            </StatItem>
            <StatItem>
              <strong>Expansions:</strong> {expansions.toLocaleString()}
            </StatItem>
            <StatItem>
              <strong>Max Queue:</strong> {maxQLength.toLocaleString()}
            </StatItem>
            <StatItem>
              <strong>Time:</strong> {(time / 1000).toFixed(3)} seconds
            </StatItem>
          </>
        ) : (
          <>
            <StatItem>
              <strong>Solution Found:</strong> No
            </StatItem>
            <StatItem>No solution exists for this puzzle state.</StatItem>
            <StatItem>
              <strong>Expansions:</strong> {expansions.toLocaleString()}
            </StatItem>
            <StatItem>
              <strong>Max Queue:</strong> {maxQLength.toLocaleString()}
            </StatItem>
            <StatItem>
              <strong>Time:</strong> {(time / 1000).toFixed(3)} seconds
            </StatItem>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}

export default StatsModal;