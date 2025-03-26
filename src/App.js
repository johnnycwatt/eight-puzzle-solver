// File: App.js
// Author: Johnny CW
// Date: March 24, 2025
// Description: Main component for the 8 Puzzle Solver, integrating WebAssembly solver with UI.

import React, { useState, useEffect } from 'react';
import './App.css';
import PuzzleGrid from './components/PuzzleGrid';
import SolverPanel from './components/SolverPanel';
import { isSolvable, generateRandomState } from './utils/puzzleUtils';

function App() {
  const [wasmModule, setWasmModule] = useState(null);
  const [puzzleState, setPuzzleState] = useState('208135467');
  const [customState, setCustomState] = useState('208135467');
  const [goalState] = useState('123456780');
  const [solution, setSolution] = useState({ path: '', stats: null });
  const [isSolving, setIsSolving] = useState(false);
  const [error, setError] = useState(null);
  const [inputValid, setInputValid] = useState(true);
  const [inputFeedback, setInputFeedback] = useState('');

  useEffect(() => {
    console.log('Loading WebAssembly module...');
    window.createModule().then((module) => {
      const solveUC = module.cwrap('solveUC', 'number', ['string', 'string', 'number']);
      const solveAStar = module.cwrap('solveAStar', 'number', ['string', 'string', 'number', 'number']);
      const freeMemory = module.cwrap('freeMemory', null, ['number']);
      const malloc = module.cwrap('malloc', 'number', ['number']);
      const free = module.cwrap('free', null, ['number']);
      setWasmModule({
        solveUC,
        solveAStar,
        freeMemory,
        malloc,
        free,
        HEAP32: module.HEAP32,
        UTF8ToString: module.UTF8ToString
      });
      console.log('Module initialized successfully');
    }).catch((err) => {
      console.error('Failed to initialize module:', err);
      setError('Failed to initialize WebAssembly module.');
    });
  }, []);

  /**
   * Check if a puzzle state is solvable by counting inversions
   */
  const solvePuzzle = async (method, heuristic) => {
    if (!wasmModule) {
      setError('WebAssembly module not loaded yet.');
      return;
    }
    console.log('Solving with method:', method, 'heuristic:', heuristic);
    console.log('Puzzle state:', puzzleState, 'Goal state:', goalState);
    setIsSolving(true);
    setError(null);
    setSolution({ path: '', stats: null });
    try {
      const statsPtr = wasmModule.malloc(4 * 4);
      let pathPtr = method === 'uc'
        ? wasmModule.solveUC(puzzleState, goalState, statsPtr)
        : wasmModule.solveAStar(puzzleState, goalState, statsPtr, heuristic);
      const path = wasmModule.UTF8ToString(pathPtr);

      const statsValues = [];
      for (let i = 0; i < 4; i++) {
        statsValues.push(wasmModule.HEAP32[statsPtr / 4 + i]);
      }

      wasmModule.free(statsPtr);
      wasmModule.freeMemory(pathPtr);

      setSolution({
        path,
        stats: {
          pathLength: statsValues[0],
          expansions: statsValues[1],
          maxQLength: statsValues[2],
          time: statsValues[3]
        }
      });

      if (path) {
        let current = puzzleState;
        path.split('').forEach((move, idx) => {
          setTimeout(() => {
            setPuzzleState(prevState => {
              let blankIdx = prevState.indexOf('0');
              let newIdx;
              if (move === 'U') newIdx = blankIdx - 3;
              else if (move === 'D') newIdx = blankIdx + 3;
              else if (move === 'L') newIdx = blankIdx - 1;
              else if (move === 'R') newIdx = blankIdx + 1;
              if (newIdx < 0 || newIdx > 8 || (move === 'R' && blankIdx % 3 === 2) || (move === 'L' && blankIdx % 3 === 0)) {
                return prevState;
              }
              const arr = prevState.split('');
              [arr[blankIdx], arr[newIdx]] = [arr[newIdx], arr[blankIdx]];
              return arr.join('');
            });
          }, idx * 500);
        });
      }
    } catch (err) {
      setError('Error solving puzzle: ' + err.message);
    } finally {
      setIsSolving(false);
    }
  };


  const handleRandomize = () => {
    const newState = generateRandomState();
    setCustomState(newState);
    setPuzzleState(newState);
    setInputValid(true);
    setInputFeedback('');
    setError(null);
  }



  const handleCustomState = () => {
    if (inputValid && customState.length === 9) {
        setPuzzleState(customState);
        setError(null);
    }else{
        setError('Invalid input. Use digits 0-8 exactly once (e.g., "208135467").');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCustomState(value);

    if(value.length === 0){
        setInputValid(false);
        setInputFeedback('Please enter a puzzle state.');
    }else if(!/^[0-8]*$/.test(value)){
        setInputValid(false);
        setInputFeedback('Only digits 0-8 are allowed.');
    }else if(value.length === 9){
        const digitSet = new Set(value);
        if(digitSet.size === 9){
            setInputValid(true);
            setInputFeedback('');
        }else{
            setInputValid(false);
            setInputFeedback('Digits must be unique (0-8 used exactly once!). e.g., 208135467 ');
        }
    }else{
        setInputValid(false);
        setInputFeedback('Enter exactly 9 digits.');
    }
  };

  return (
    <div className="App">
      <h1>8 Puzzle Solver</h1>
      <p>Enter a puzzle state using digits 0-8, select a method, and click Solve to find a solution.</p>
      {error && (
        <div className="error">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      <div className="input-section">
        <label>
          Initial State:
          <input
            type="text"
            value={customState}
            onChange={handleInputChange}
            maxLength="9"
            placeholder="e.g., 208135467"
            className={inputValid ? 'valid' : 'invalid'}
          />
        </label>
        <button onClick={handleCustomState} disabled={!inputValid}>Set State</button>
        <button onClick={handleRandomize}>Randomize</button>
        <div className={`input-feedback ${inputValid ? 'valid' : 'invalid'}`}>
            {inputFeedback}
        </div>
      </div>
      <PuzzleGrid state={puzzleState} />
      <div className="solver-controls">
        <SolverPanel onSolve={solvePuzzle} solution={solution} isSolving={isSolving} />
      </div>
    </div>
  );
}

export default App;