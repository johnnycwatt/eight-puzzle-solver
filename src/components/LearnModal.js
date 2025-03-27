// File: LearnModal.js
// Author: Johnny CW
// Date: March 27, 2025
// Description: A Custom Modal displaying informatione explaining UCS and A* Search
import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #1f2833;
  color: #e4faf8;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  padding: 20px;
  width: 95%;
  max-width: 1000px;
  height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modal 0.5s ease;

  @keyframes modal {
    from { opacity: 0; transform: translateY(-100px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #e4faf8;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover { color: #c5c6c7; scale: 1.1; }
`;

const Section = styled.section`margin-bottom: 30px;`;
const Heading = styled.h2`font-size: 2em; margin-bottom: 15px; color: #e4faf8; text-shadow: 0 0 4px #093b3f;`;
const SubHeading = styled.h3`font-size: 1.5em; margin-bottom: 10px; color: #c5c6c7;`;
const Paragraph = styled.p`font-size: 1.2em; line-height: 1.6; color: #c5c6c7;`;

const CodeBlockWrapper = styled.div`
  position: relative;
  background: #2d3748;
  border: 1px solid #4a5568;
  border-radius: 8px;
  margin: 10px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  font-family: 'Courier New', monospace;
  font-size: 1.1em;
`;

const CodeBlockHeader = styled.div`
  background: #4a5568;
  padding: 5px 10px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9em;
  color: #e4faf8;
`;

const CopyButton = styled.button`
  background: #4a5568;
  border: none;
  color: #e4faf8;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover { background: #718096; }
`;

const CodeBlock = styled.pre`
  margin: 0;
  padding: 15px;
  overflow-x: auto;
  color: #e4faf8;
  line-height: 1.5;
  background: transparent;

  /* Basic syntax highlighting */
  .keyword { color: #ff79c6; } /* Keywords like if,  for */
  .string { color: #f1fa8c; }
  .comment { color: #6272a4; font-style: italic; }
  .function { color: #50fa7b; }
  .variable { color: #8be9fd; }
`;

function LearnModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState({});

  const handleCopy = (code, index) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied((prev) => ({ ...prev, [index]: true }));
      setTimeout(() => setCopied((prev) => ({ ...prev, [index]: false })), 2000);
    });
  };

  const highlightCode = (code) => {
    return code
      .replace(/\b(if|for|while|return|case|break)\b/g, '<span class="keyword">$1</span>')
      .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
      .replace(/\/\/.*/g, '<span class="comment">$&</span>')
      .replace(/\b(push_heap|pop_heap|goalMatch)\b/g, '<span class="function">$1</span>')
      .replace(/\b(heap|currentNode|successors|nextState|newPath)\b/g, '<span class="variable">$1</span>');
  };

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>

        {/* Section 1: 8-Puzzle Problem */}
        <Section>
          <Heading>1. The 8-Puzzle Problem</Heading>
          <Paragraph>
            The 8-puzzle is a sliding puzzle on a 3x3 grid with tiles numbered 1 to 8 and one blank space (represented as 0). The objective is to move the tiles from an initial configuration to a goal configuration (e.g., "123456780") by sliding them into the blank space using up, down, left, or right moves.
          </Paragraph>
          <Paragraph>
            It’s a classic problem in artificial intelligence to study search algorithms like Uniform Cost Search (UCS) and A*, as it has a well-defined state space and clear rules for movement.
          </Paragraph>
        </Section>

        {/* Section 2: Uniform Cost Search */}
        <Section>
          <Heading>2. Uniform Cost Search (UCS)</Heading>
          <Paragraph>
            UCS is an uninformed search algorithm that explores nodes based on the lowest cumulative path cost from the start state. It uses a priority queue to prioritize nodes with the smallest cost.
          </Paragraph>

          <SubHeading>Step by Step</SubHeading>
          <Paragraph>
            <strong>1.Initialize a priority queue with the initial state (cost = 0, path = ""):</strong>
          </Paragraph>
          <CodeBlockWrapper>
            <CodeBlockHeader>
              <span>C++</span>
              <CopyButton onClick={() => handleCopy(`vector<Node> heap;
Puzzle initialPuzzle(initialState, goalState);
Node startNode = {initialPuzzle, 0, ""};
heap.push_back(startNode);
push_heap(heap.begin(), heap.end(), greater<Node>());`, 'ucs-1')}>
                {copied['ucs-1'] ? 'Copied!' : 'Copy'}
              </CopyButton>
            </CodeBlockHeader>
            <CodeBlock dangerouslySetInnerHTML={{ __html: highlightCode(`vector<Node> heap;
Puzzle initialPuzzle(initialState, goalState);
Node startNode = {initialPuzzle, 0, ""};
heap.push_back(startNode);
push_heap(heap.begin(), heap.end(), greater<Node>());`) }} />
          </CodeBlockWrapper>
          <Paragraph>
            This sets up the starting point with a cost of 0 and an empty path, using a min-heap to prioritize lower costs.
          </Paragraph>

          <Paragraph>
            <strong>2. While the queue is not empty:</strong>
          </Paragraph>
          <Paragraph>
            - <strong>Dequeue the node with the lowest cost:</strong>
          </Paragraph>
          <CodeBlockWrapper>
            <CodeBlockHeader>
              <span>C++</span>
              <CopyButton onClick={() => handleCopy(`pop_heap(heap.begin(), heap.end(), greater<Node>());
Node currentNode = heap.back();
heap.pop_back();`, 'ucs-2')}>
                {copied['ucs-2'] ? 'Copied!' : 'Copy'}
              </CopyButton>
            </CodeBlockHeader>
            <CodeBlock dangerouslySetInnerHTML={{ __html: highlightCode(`pop_heap(heap.begin(), heap.end(), greater<Node>());
Node currentNode = heap.back();
heap.pop_back();`) }} />
          </CodeBlockWrapper>
          <Paragraph>
            The node with the smallest cost is removed from the priority queue for exploration.
          </Paragraph>

          <Paragraph>
            - <strong>If it’s the goal, return the path:</strong>
          </Paragraph>
          <CodeBlockWrapper>
            <CodeBlockHeader>
              <span>C++</span>
              <CopyButton onClick={() => handleCopy(`if (currentNode.state.goalMatch()) {
    pathLength = currentNode.gCost;
    return currentNode.path;
}`, 'ucs-3')}>
                {copied['ucs-3'] ? 'Copied!' : 'Copy'}
              </CopyButton>
            </CodeBlockHeader>
            <CodeBlock dangerouslySetInnerHTML={{ __html: highlightCode(`if (currentNode.state.goalMatch()) {
    pathLength = currentNode.gCost;
    return currentNode.path;
}`) }} />
          </CodeBlockWrapper>
          <Paragraph>
            If the current state matches the goal, the algorithm stops and returns the solution path.
          </Paragraph>

          <Paragraph>
            - <strong>Otherwise, expand the node (generate successors):</strong>
          </Paragraph>
          <CodeBlockWrapper>
            <CodeBlockHeader>
              <span>C++</span>
              <CopyButton onClick={() => handleCopy(`vector<Puzzle> successors;
if (currentNode.state.canMoveUp()) successors.push_back(*currentNode.state.moveUp());
if (currentNode.state.canMoveRight()) successors.push_back(*currentNode.state.moveRight());
if (currentNode.state.canMoveDown()) successors.push_back(*currentNode.state.moveDown());
if (currentNode.state.canMoveLeft()) successors.push_back(*currentNode.state.moveLeft());`, 'ucs-4')}>
                {copied['ucs-4'] ? 'Copied!' : 'Copy'}
              </CopyButton>
            </CodeBlockHeader>
            <CodeBlock dangerouslySetInnerHTML={{ __html: highlightCode(`vector<Puzzle> successors;
if (currentNode.state.canMoveUp()) successors.push_back(*currentNode.state.moveUp());
if (currentNode.state.canMoveRight()) successors.push_back(*currentNode.state.moveRight());
if (currentNode.state.canMoveDown()) successors.push_back(*currentNode.state.moveDown());
if (currentNode.state.canMoveLeft()) successors.push_back(*currentNode.state.moveLeft());`) }} />
          </CodeBlockWrapper>
          <Paragraph>
            Successors are generated by moving the blank tile in all possible directions (up, right, down, left).
          </Paragraph>

          <Paragraph>
            - <strong>Add unexpanded successors to the queue:</strong>
          </Paragraph>
          <CodeBlockWrapper>
            <CodeBlockHeader>
              <span>C++</span>
              <CopyButton onClick={() => handleCopy(`for (Puzzle& nextState : successors) {
    if (expandedList.find(nextState.toString()) == expandedList.end()) {
        string newPath = currentNode.path + /* Move direction (U, R, D, L) */;
        Node successorNode = {nextState, currentNode.gCost + 1, newPath};
        heap.push_back(successorNode);
        push_heap(heap.begin(), heap.end(), greater<Node>());
    }
}`, 'ucs-5')}>
                {copied['ucs-5'] ? 'Copied!' : 'Copy'}
              </CopyButton>
            </CodeBlockHeader>
            <CodeBlock dangerouslySetInnerHTML={{ __html: highlightCode(`for (Puzzle& nextState : successors) {
    if (expandedList.find(nextState.toString()) == expandedList.end()) {
        string newPath = currentNode.path + /* Move direction (U, R, D, L) */;
        Node successorNode = {nextState, currentNode.gCost + 1, newPath};
        heap.push_back(successorNode);
        push_heap(heap.begin(), heap.end(), greater<Node>());
    }
}`) }} />
          </CodeBlockWrapper>
          <Paragraph>
            New states are added to the queue with an incremented cost, avoiding duplicates using an expanded list.
          </Paragraph>

          <Paragraph>
            <strong>3. If the queue empties without finding the goal, return no solution.</strong>
          </Paragraph>
          <Paragraph>
            If no solution is found, an empty string is returned.
          </Paragraph>

          <SubHeading>Advantages</SubHeading>
          <Paragraph>- Finds the optimal solution if costs are non-negative and non-decreasing.<br />- Straightforward to implement.</Paragraph>

          <SubHeading>Disadvantages</SubHeading>
          <Paragraph>- Inefficient for large search spaces due to lack of heuristic guidance.<br />- May explore many unnecessary paths.</Paragraph>

          <SubHeading>Time Complexity</SubHeading>
          <Paragraph>O(b^d), where `b` is the branching factor (up to 4 in 8-puzzle) and `d` is the depth of the solution.</Paragraph>

          <SubHeading>Space Complexity</SubHeading>
          <Paragraph>O(b^d), as it stores all generated nodes in the priority queue.</Paragraph>
        </Section>

        {/* Section 3: A* Search */}
        <Section>
          <Heading>3. A* Search</Heading>
          <Paragraph>
            A* Search is an informed search algorithm that uses a heuristic to estimate the cost to the goal, combining path cost (g) and heuristic cost (h) into a total cost (f = g + h).
          </Paragraph>

          <SubHeading>Step By Step</SubHeading>
          <Paragraph>
            <strong>1. Initialize a priority queue with the initial state (f = g + h, g = 0):</strong>
          </Paragraph>
          <CodeBlockWrapper>
            <CodeBlockHeader>
              <span>C++</span>
              <CopyButton onClick={() => handleCopy(`vector<AStarNode> heap;
Puzzle initialPuzzle(initialState, goalState);
int hCost = initialPuzzle.h(heuristic);
AStarNode startNode = {initialPuzzle, 0, hCost, ""};
heap.push_back(startNode);
push_heap(heap.begin(), heap.end(), greater<AStarNode>());`, 'astar-1')}>
                {copied['astar-1'] ? 'Copied!' : 'Copy'}
              </CopyButton>
            </CodeBlockHeader>
            <CodeBlock dangerouslySetInnerHTML={{ __html: highlightCode(`vector<AStarNode> heap;
Puzzle initialPuzzle(initialState, goalState);
int hCost = initialPuzzle.h(heuristic);
AStarNode startNode = {initialPuzzle, 0, hCost, ""};
heap.push_back(startNode);
push_heap(heap.begin(), heap.end(), greater<AStarNode>());`) }} />
          </CodeBlockWrapper>
          <Paragraph>
            The initial state is added with its heuristic cost, prioritizing nodes by `f` (g + h).
          </Paragraph>

          <Paragraph>
            <strong>2. While the queue is not empty:</strong>
          </Paragraph>
          <Paragraph>
            - <strong>Dequeue the node with the lowest f:</strong>
          </Paragraph>
          <CodeBlockWrapper>
            <CodeBlockHeader>
              <span>C++</span>
              <CopyButton onClick={() => handleCopy(`pop_heap(heap.begin(), heap.end(), greater<AStarNode>());
AStarNode currentNode = heap.back();
heap.pop_back();`, 'astar-2')}>
                {copied['astar-2'] ? 'Copied!' : 'Copy'}
              </CopyButton>
            </CodeBlockHeader>
            <CodeBlock dangerouslySetInnerHTML={{ __html: highlightCode(`pop_heap(heap.begin(), heap.end(), greater<AStarNode>());
AStarNode currentNode = heap.back();
heap.pop_back();`) }} />
          </CodeBlockWrapper>
          <Paragraph>
            The node with the smallest `f` value is selected for exploration.
          </Paragraph>

          <Paragraph>
            - <strong>If it’s the goal, return the path:</strong>
          </Paragraph>
          <CodeBlockWrapper>
            <CodeBlockHeader>
              <span>C++</span>
              <CopyButton onClick={() => handleCopy(`if (currentNode.state.goalMatch()) {
    pathLength = currentNode.gCost;
    return currentNode.path;
}`, 'astar-3')}>
                {copied['astar-3'] ? 'Copied!' : 'Copy'}
              </CopyButton>
            </CodeBlockHeader>
            <CodeBlock dangerouslySetInnerHTML={{ __html: highlightCode(`if (currentNode.state.goalMatch()) {
    pathLength = currentNode.gCost;
    return currentNode.path;
}`) }} />
          </CodeBlockWrapper>
          <Paragraph>
            If the goal is reached, the path is returned.
          </Paragraph>

          <Paragraph>
            - <strong>Otherwise, expand the node and calculate f for successors:</strong>
          </Paragraph>
          <CodeBlockWrapper>
            <CodeBlockHeader>
              <span>C++</span>
              <CopyButton onClick={() => handleCopy(`if (currentNode.state.canMoveUp()) {
    Puzzle nextState = *currentNode.state.moveUp();
    int newGCost = currentNode.gCost + 1;
    int newHCost = nextState.h(heuristic);
    string newPath = currentNode.path + "U";
    AStarNode successorNode = {nextState, newGCost, newGCost + newHCost, newPath};
    if (expandedList.find(nextState.toString()) == expandedList.end()) {
        heap.push_back(successorNode);
        push_heap(heap.begin(), heap.end(), greater<AStarNode>());
    }
}
// Similar logic for Right, Down, Left moves`, 'astar-4')}>
                {copied['astar-4'] ? 'Copied!' : 'Copy'}
              </CopyButton>
            </CodeBlockHeader>
            <CodeBlock dangerouslySetInnerHTML={{ __html: highlightCode(`if (currentNode.state.canMoveUp()) {
    Puzzle nextState = *currentNode.state.moveUp();
    int newGCost = currentNode.gCost + 1;
    int newHCost = nextState.h(heuristic);
    string newPath = currentNode.path + "U";
    AStarNode successorNode = {nextState, newGCost, newGCost + newHCost, newPath};
    if (expandedList.find(nextState.toString()) == expandedList.end()) {
        heap.push_back(successorNode);
        push_heap(heap.begin(), heap.end(), greater<AStarNode>());
    }
}
// Similar logic for Right, Down, Left moves`) }} />
          </CodeBlockWrapper>
          <Paragraph>
            Successors are generated, and their `f` values are computed before adding them to the queue, skipping duplicates.
          </Paragraph>

          <Paragraph>
            <strong>3. If the queue empties, return no solution.</strong>
          </Paragraph>
          <Paragraph>
            An empty string indicates no solution was found.
          </Paragraph>

          <SubHeading>Advantages</SubHeading>
          <Paragraph>- Optimal if the heuristic is admissible.<br />- More efficient than UCS due to heuristic guidance.</Paragraph>

          <SubHeading>Disadvantages</SubHeading>
          <Paragraph>- Still expensive for large spaces.<br />- Efficiency depends on heuristic quality.</Paragraph>

          <SubHeading>Time Complexity</SubHeading>
          <Paragraph>O(b^d), but explores fewer nodes than UCS with a good heuristic.</Paragraph>

          <SubHeading>Space Complexity</SubHeading>
          <Paragraph>O(b^d), storing all nodes in the priority queue.</Paragraph>
        </Section>

        {/* Section 4: Heuristics Used */}
        <Section>
          <Heading>4. Heuristics Used</Heading>
          <Paragraph>
            Heuristics estimate the cost from a state to the goal, guiding informed search algorithms like A*. Two common heuristics for the 8-puzzle are:
          </Paragraph>

          <SubHeading>Misplaced Tiles</SubHeading>
          <Paragraph>
            Counts the number of tiles not in their goal positions. It’s admissible but less informative than Manhattan Distance.

            For example, in "123804765" compared to "123456780", tiles 4, 5, 6, and 8 are misplaced, yielding an hCost of 4
          </Paragraph>
          <CodeBlockWrapper>
            <CodeBlockHeader>
              <span>C++</span>
              <CopyButton onClick={() => handleCopy(`case misplacedTiles:
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            if (board[i][j] != 0 && board[i][j] != goalBoard[i][j]) {
                h++;
            }
        }
    }
    break;`, 'heuristic-1')}>
                {copied['heuristic-1'] ? 'Copied!' : 'Copy'}
              </CopyButton>
            </CodeBlockHeader>
            <CodeBlock dangerouslySetInnerHTML={{ __html: highlightCode(`case misplacedTiles:
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            if (board[i][j] != 0 && board[i][j] != goalBoard[i][j]) {
                h++;
            }
        }
    }
    break;`) }} />
          </CodeBlockWrapper>
          <Paragraph>
            <strong>How it works:</strong> For each tile, if it’s not the blank (0) and not in its goal position, increment the heuristic value `h`.
          </Paragraph>

          <SubHeading>Manhattan Distance</SubHeading>
          <Paragraph>
            This heuristic calculates the sum of the absolute distances (in rows and columns) of each tile from its goal position, excluding the blank. It’s admissible and more accurate.

            For "123804765" versus "123456780", the hCost might be 6 (e.g. tile 8 is 2 steps away, tile 4 is 1 step away, etc.). I
          </Paragraph>
          <CodeBlockWrapper>
            <CodeBlockHeader>
              <span>C++</span>
              <CopyButton onClick={() => handleCopy(`case manhattanDistance:
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            if (board[i][j] != 0) {
                for (int m = 0; m < 3; m++) {
                    for (int n = 0; n < 3; n++) {
                        if (board[i][j] == goalBoard[m][n]) {
                            h += abs(i - m) + abs(j - n);
                        }
                    }
                }
            }
        }
    }
    break;`, 'heuristic-2')}>
                {copied['heuristic-2'] ? 'Copied!' : 'Copy'}
              </CopyButton>
            </CodeBlockHeader>
            <CodeBlock dangerouslySetInnerHTML={{ __html: highlightCode(`case manhattanDistance:
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            if (board[i][j] != 0) {
                for (int m = 0; m < 3; m++) {
                    for (int n = 0; n < 3; n++) {
                        if (board[i][j] == goalBoard[m][n]) {
                            h += abs(i - m) + abs(j - n);
                        }
                    }
                }
            }
        }
    }
    break;`) }} />
          </CodeBlockWrapper>
          <Paragraph>
            <strong>How it works:</strong> For each tile (except the blank), find its goal position and add the absolute differences in row and column indices to `h`.
          </Paragraph>
        </Section>
        {/* Section 5: Importance of Expanded Lists */}
        <Section>
          <Heading>5. Importance of Expanded Lists</Heading>
          <Paragraph>
            The expanded list in both UCS and A* ensures that each state is expanded at most once, preventing redundant explorations in the state space. This is crucial for problems like the 8-puzzle, where the state space is a graph with cycles (e.g., moving the blank tile up and then down returns to the same state).
          </Paragraph>

          <SubHeading>Role in Graph Search</SubHeading>
          <Paragraph>
            - <strong>Prevents Cycles:</strong> Without the expanded list, the algorithms would treat the state space as a tree, re-exploring the same state multiple times via different paths. For example, in the 8-puzzle, a state at depth 5 might be reached via ( 3^5 = 243 \ different paths, each explored separately.<br />
            - <strong>Ensures Efficiency:</strong> By storing expanded states, the algorithms perform a graph search, ensuring each of the 181,440 reachable states in the 8-puzzle is expanded at most once.
          </Paragraph>

          <SubHeading>What if we did not have the Expanded List?</SubHeading>
          <Paragraph>

            - <strong>UCS: </strong> Without the expanded list, UCS explores exponentially more nodes (from 181,440 to 3^31), making it infeasible for the 8-puzzle. <br /><br />
            - <strong>A* Search:</strong> benefits from the heuristic, but without the expanded list, it still re-explores states, increasing the number of nodes by a factor of 10–100, depending on the heuristic.

          </Paragraph>
        </Section>
      </ModalContent>
    </ModalOverlay>
  );
}

export default LearnModal;