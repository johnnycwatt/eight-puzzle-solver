// File: algorithm.cpp
// Author: Johnny CW
// Date: March 24, 2025
// Description: Implements 8-puzzle solvers (Uniform Cost and A*) with strict expanded list for WebAssembly integration.

#include "algorithm.h"
#include <set>
#include <vector>
#include <algorithm>
#include <ctime>
#include <cstdlib>
#include <functional>
#include <emscripten.h>

using namespace std;


//Represents a state in Uniform Cost Search with cost and path.
struct Node {
    Puzzle state;
    int gCost; // Cost to reach this node
    string path; // Path taken to reach this node

    bool operator>(const Node& other) const {
        return gCost > other.gCost; // Compare based on total cost for priority queue
    }
};

//Represents a state in A* search with total cost (fCost = gCost + hCost).
struct AStarNode {
    Puzzle state;
    int gCost; // Cost to reach this node
    int fCost; // Total cost (gCost + hCost)
    string path; // Path taken to reach this node

    bool operator>(const AStarNode& other) const {
        return fCost > other.fCost; // Compare based on total cost for priority queue
    }
};


///////////////////////////////////////////////////////////////////////////////////////////
//
// Search Algorithm:  UC with Strict Expanded List
//
// Params:
//   - initialState: Starting puzzle state (string, e.g., "123804765")
//   - goalState: Target state (string, e.g., "123456780")
//   - pathLength: Output for length of solution path
//   - numOfStateExpansions: Output for number of states explored
//   - maxQLength: Output for maximum size of priority queue
//   - actualRunningTime: Output for execution time in seconds
//   - numOfDeletionsFromMiddleOfHeap: Unused (for heap optimization stats)
//   - numOfLocalLoopsAvoided: Unused (for loop avoidance stats)
//   - numOfAttemptedNodeReExpansions: Unused (for re-expansion stats)
//
// Returns: String of moves (e.g., "UDLR") or empty if unsolvable
//
////////////////////////////////////////////////////////////////////////////////////////////
string uc_explist(string const initialState, string const goalState, int& pathLength, int &numOfStateExpansions, int& maxQLength,
                               float &actualRunningTime, int &numOfDeletionsFromMiddleOfHeap, int &numOfLocalLoopsAvoided, int &numOfAttemptedNodeReExpansions){

    string path;
    clock_t startTime;

    numOfDeletionsFromMiddleOfHeap = 0;
    numOfLocalLoopsAvoided = 0;
    numOfAttemptedNodeReExpansions = 0;

    actualRunningTime = 0.0;
    startTime = clock();

    vector<Node> heap;
    set<string> expandedList;

    Puzzle initialPuzzle(initialState, goalState);
    Node startNode = {initialPuzzle, 0, ""};

    heap.push_back(startNode);
    push_heap(heap.begin(), heap.end(), greater<Node>());

    maxQLength = heap.size();

    emscripten_log(EM_LOG_CONSOLE, "UC Solver started with initial state: %s", initialState.c_str());
    while (!heap.empty()) {
        pop_heap(heap.begin(), heap.end(), greater<Node>());
        Node currentNode = heap.back();
        heap.pop_back();

        // Goal check
        if (currentNode.state.goalMatch()) {
            pathLength = currentNode.gCost;
            actualRunningTime = ((float)(clock() - startTime) / CLOCKS_PER_SEC);

            emscripten_log(EM_LOG_CONSOLE, "Solution found! Path: %s, Length: %d, Expansions: %d, Max Queue: %d, Time: %.3f s",
                                       currentNode.path.c_str(), pathLength, numOfStateExpansions, maxQLength, actualRunningTime);
            return currentNode.path; // Immediate return upon goal match
        }

        expandedList.insert(currentNode.state.toString());
        numOfStateExpansions++;

        // Generate successors
        vector<Puzzle> successors;
        if (currentNode.state.canMoveUp()) {
            Puzzle nextState = *currentNode.state.moveUp();
            successors.push_back(nextState);
            path = currentNode.path + "U";
        }
        if (currentNode.state.canMoveRight()) {
            Puzzle nextState = *currentNode.state.moveRight();
            successors.push_back(nextState);
            path = currentNode.path + "R";
        }
        if (currentNode.state.canMoveDown()) {
            Puzzle nextState = *currentNode.state.moveDown();
            successors.push_back(nextState);
            path = currentNode.path + "D";
        }
        if (currentNode.state.canMoveLeft()) {
            Puzzle nextState = *currentNode.state.moveLeft();
            successors.push_back(nextState);
            path = currentNode.path + "L";
        }

        for (Puzzle& nextState : successors) {
            if (expandedList.find(nextState.toString()) == expandedList.end()) {
            	string newPath = currentNode.path;  // Keep the current path
            	if (nextState.toString() == currentNode.state.moveUp()->toString()) {
           			newPath += "U";  // Append 'U' to the path if it is an 'Up' move
        		} else if (nextState.toString() == currentNode.state.moveRight()->toString()) {
            		newPath += "R";  // Append 'R' to the path if it is a 'Right' move
        		} else if (nextState.toString() == currentNode.state.moveDown()->toString()) {
            		newPath += "D";  // Append 'D' to the path if it is a 'Down' move
    		    } else if (nextState.toString() == currentNode.state.moveLeft()->toString()) {
           			newPath += "L";  // Append 'L' to the path if it is a 'Left' move
       			}

                Node successorNode = {
                    nextState,
                    currentNode.gCost + 1,
                    newPath
                };

                heap.push_back(successorNode);
                push_heap(heap.begin(), heap.end(), greater<Node>());
                maxQLength = max(maxQLength, (int)heap.size());
            }
        }
    }

//***********************************************************************************************************
	actualRunningTime = ((float)(clock() - startTime)/CLOCKS_PER_SEC);
	emscripten_log(EM_LOG_CONSOLE, "No solution found. Expansions: %d, Max Queue: %d, Time: %.3f s",
                       numOfStateExpansions, maxQLength, actualRunningTime);
	return ""; // Return empty string if no solution found

}


///////////////////////////////////////////////////////////////////////////////////////////
//
// Search Algorithm:  A* with the Strict Expanded List
//
// Params:
//   - initialState: Starting puzzle state (string, e.g., "123804765")
//   - goalState: Target state (string, e.g., "123456780")
//   - pathLength: Output for length of solution path
//   - numOfStateExpansions: Output for number of states explored
//   - maxQLength: Output for maximum size of priority queue
//   - actualRunningTime: Output for execution time in seconds
//   - numOfDeletionsFromMiddleOfHeap: Unused (for heap optimization stats)
//   - numOfLocalLoopsAvoided: Unused (for loop avoidance stats)
//   - numOfAttemptedNodeReExpansions: Unused (for re-expansion stats)
//   - heuristic: Heuristic function (misplacedTiles or manhattanDistance)
//
// Returns: String of moves (e.g., "UDLR") or empty if unsolvable
//
////////////////////////////////////////////////////////////////////////////////////////////
string aStar_ExpandedList(string const initialState, string const goalState, int& pathLength, int &numOfStateExpansions, int& maxQLength,
                               float &actualRunningTime, int &numOfDeletionsFromMiddleOfHeap, int &numOfLocalLoopsAvoided, int &numOfAttemptedNodeReExpansions, heuristicFunction heuristic){

   string path;
   clock_t startTime;

   numOfDeletionsFromMiddleOfHeap=0;
   numOfLocalLoopsAvoided=0;
   numOfAttemptedNodeReExpansions=0;


	actualRunningTime=0.0;
	startTime = clock();

	vector<AStarNode> heap;
    set<string> expandedList;

    Puzzle initialPuzzle(initialState, goalState);
    int hCost = initialPuzzle.h(heuristic);
    AStarNode startNode = {initialPuzzle, 0, hCost, ""};

    heap.push_back(startNode);
    push_heap(heap.begin(), heap.end(), greater<AStarNode>());
    maxQLength = heap.size();

    emscripten_log(EM_LOG_CONSOLE, "A* Solver started with initial state: %s, heuristic: %d", initialState.c_str(), heuristic);

    while (!heap.empty()) {
        pop_heap(heap.begin(), heap.end(), greater<AStarNode>());
        AStarNode currentNode = heap.back();
        heap.pop_back();

        // Goal check
        if (currentNode.state.goalMatch()) {
            cout << "Goal state reached: " << currentNode.state.toString() << endl;
            pathLength = currentNode.gCost;
            actualRunningTime = ((float)(clock() - startTime) / CLOCKS_PER_SEC);

            emscripten_log(EM_LOG_CONSOLE, "Solution found! Path: %s, Length: %d, Expansions: %d, Max Queue: %d, Time: %.3f s",
                                       currentNode.path.c_str(), pathLength, numOfStateExpansions, maxQLength, actualRunningTime);

            return currentNode.path; // Immediate return upon goal match
        }

        expandedList.insert(currentNode.state.toString());
        numOfStateExpansions++;

        // Generate successors
        vector<Puzzle> successors;
        if (currentNode.state.canMoveUp()) {
            Puzzle nextState = *currentNode.state.moveUp();
            int newGCost = currentNode.gCost + 1;
            int newHCost = nextState.h(heuristic);
            string newPath = currentNode.path + "U";
            AStarNode successorNode = {nextState, newGCost, newGCost + newHCost, newPath};

            if (expandedList.find(nextState.toString()) == expandedList.end()) {
                heap.push_back(successorNode);
                push_heap(heap.begin(), heap.end(), greater<AStarNode>());
                maxQLength = max(maxQLength, (int)heap.size());
            }
        }
        if (currentNode.state.canMoveRight()) {
            Puzzle nextState = *currentNode.state.moveRight();
            int newGCost = currentNode.gCost + 1;
            int newHCost = nextState.h(heuristic);
            string newPath = currentNode.path + "R";
            AStarNode successorNode = {nextState, newGCost, newGCost + newHCost, newPath};

            if (expandedList.find(nextState.toString()) == expandedList.end()) {
                heap.push_back(successorNode);
                push_heap(heap.begin(), heap.end(), greater<AStarNode>());
                maxQLength = max(maxQLength, (int)heap.size());
            }
        }
        if (currentNode.state.canMoveDown()) {
            Puzzle nextState = *currentNode.state.moveDown();
            int newGCost = currentNode.gCost + 1;
            int newHCost = nextState.h(heuristic);
            string newPath = currentNode.path + "D";
            AStarNode successorNode = {nextState, newGCost, newGCost + newHCost, newPath};

            if (expandedList.find(nextState.toString()) == expandedList.end()) {
                heap.push_back(successorNode);
                push_heap(heap.begin(), heap.end(), greater<AStarNode>());
                maxQLength = max(maxQLength, (int)heap.size());
            }
        }
        if (currentNode.state.canMoveLeft()) {
            Puzzle nextState = *currentNode.state.moveLeft();
            int newGCost = currentNode.gCost + 1;
            int newHCost = nextState.h(heuristic);
            string newPath = currentNode.path + "L";
            AStarNode successorNode = {nextState, newGCost, newGCost + newHCost, newPath};

            if (expandedList.find(nextState.toString()) == expandedList.end()) {
                heap.push_back(successorNode);
                push_heap(heap.begin(), heap.end(), greater<AStarNode>());
                maxQLength = max(maxQLength, (int)heap.size());
            }
        }
    }

//***********************************************************************************************************
	actualRunningTime = ((float)(clock() - startTime)/CLOCKS_PER_SEC);

	emscripten_log(EM_LOG_CONSOLE, "No solution found. Expansions: %d, Max Queue: %d, Time: %.3f s",
                       numOfStateExpansions, maxQLength, actualRunningTime);

	return "";

}
