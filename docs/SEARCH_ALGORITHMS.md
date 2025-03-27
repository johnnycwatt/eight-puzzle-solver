# Search Algorithms used in the 8-Puzzle Solver: UCS and A*

This document serves as an educational resource for users of the 8-Puzzle Solver Web Application. It explores the search algorithms powering the solver—Uniform Cost Search (UCS) and A* Search—offering insights into their mechanics, implementation, and applications. Whether you're new to search algorithms or seeking a deeper understanding of their role in solving puzzles, this guide provides a clear and comprehensive overview.

## 1. Overview of Search Algorithms

Search algorithms are foundational tools in artificial intelligence (AI) for solving problems that involve finding a path or solution within a large space of possibilities. They can be broadly divided into two categories:

- **Uninformed Search**: These algorithms explore the problem space without any additional knowledge beyond the problem's structure (e.g. a graph or tree) and the cost of actions. Examples include Breadth-First Search (BFS), Depth-First Search (DFS), and **Uniform Cost Search (UCS)**.
- **Informed Search**: These algorithms leverage domain-specific knowledge, called **heuristics**, to estimate how close a state is to the goal, making the search more efficient. Examples include Best-First Search and **A\* Search**.

This 8-Puzzle Solver application employs the use of **UCS** and **A\* Search**

- **UCS:** ensures an optimal solution by systematically exploring paths based on their cost, making it ideal for problems like the 8-puzzle where each move has a uniform cost of 1.
- **A\* Search:** enhances efficiency by using heuristics to guide the search toward the goal, reducing the number of states explored while still guaranteeing optimality.

---
## 2. Uniform Cost Search (UCS)

### 2.1 General Overview
Uniform Cost Search (UCS) is an uninformed search algorithm that explores the search space by always expanding the node with the lowest cumulative path cost from the starting point. As a variant of Dijkstra’s algorithm, UCS is designed for problems where actions may have varying costs, though it adapts seamlessly to uniform-cost scenarios like the 8-puzzle.

**Key Features**:
- **Priority Queue**: UCS uses a priority queue to manage nodes, prioritizing those with the smallest path cost.
- **Path Cost (gCost)**: The total cost from the start node to the current node.
- **Optimal**: By expanding nodes in order of increasing cost, UCS ensures the first time it reaches the goal, it has found the optimal (least-cost) path.

### 2.2 Implementation in the 8-Puzzle Solver
In the 8-Puzzle Solver, UCS finds the shortest sequence of moves from an initial state (e.g "123804765") to the goal state ("123456780"), where each move costs 1. The implementation is in the `uc_explist` function:

```cpp
// Represents a state in Uniform Cost Search with cost and path.
struct Node {
    Puzzle state;  // Current puzzle configuration
    int gCost;     // Cost to reach this node
    string path;   // Path taken to reach this node
    bool operator>(const Node& other) const {
        return gCost > other.gCost;  // For min-heap priority queue
    }
};

string uc_explist(string const initialState, string const goalState, int& pathLength, int &numOfStateExpansions, int& maxQLength,
                  float &actualRunningTime, int &numOfDeletionsFromMiddleOfHeap, int &numOfLocalLoopsAvoided, int &numOfAttemptedNodeReExpansions) {
    vector<Node> heap;  // Priority queue as a min-heap
    set<string> expandedList;  // Tracks visited states

    Puzzle initialPuzzle(initialState, goalState);
    Node startNode = {initialPuzzle, 0, ""};
    heap.push_back(startNode);
    push_heap(heap.begin(), heap.end(), greater<Node>());

    while (!heap.empty()) {
        pop_heap(heap.begin(), heap.end(), greater<Node>());
        Node currentNode = heap.back();
        heap.pop_back();

        if (currentNode.state.goalMatch()) {
            pathLength = currentNode.gCost;
            actualRunningTime = ((float)(clock() - startTime) / CLOCKS_PER_SEC);
            return currentNode.path;  // Optimal path found
        }

        expandedList.insert(currentNode.state.toString());
        numOfStateExpansions++;

        // Generate successors (Up, Right, Down, Left)
        vector<Puzzle> successors;
        if (currentNode.state.canMoveUp()) {
            Puzzle nextState = *currentNode.state.moveUp();
            successors.push_back(nextState);
        }
        // Similar checks for Right, Down, Left...

        for (Puzzle& nextState : successors) {
            if (expandedList.find(nextState.toString()) == expandedList.end()) {
                string newPath = currentNode.path;
                if (nextState.toString() == currentNode.state.moveUp()->toString()) {
                    newPath += "U";
                } // Similar checks for R, D, L...

                Node successorNode = {nextState, currentNode.gCost + 1, newPath};
                heap.push_back(successorNode);
                push_heap(heap.begin(), heap.end(), greater<Node>());
            }
        }
    }
    return "";  // No solution found
}
```
**How It Works:**

1. Start: Initialize with `gCost = 0` and an empty path.
2. Expand: Pop the node with the smallest `gCost` from the heap.
3. Generate Successors: Create new states by moving the blank tile.
4. Update Queue: Add unexpanded successors with `gCost + 1.`
5. Check Goal: Return the path if the goal is reached.

**Lets provide an example:**
Imagine solving the 8-puzzle from "123804765" to "123456780":

* Initial State: "123804765", gCost = 0.
* First Expansion: Generate successors:
  * "123084765" (move 0 up), gCost = 1.
  * "123840765" (move 8 right), gCost = 1.
* Next Steps: Expand nodes by increasing gCost, systematically reaching "123456780" with the shortest path.

### 2.3 Advantages and Disadvantages

**Advantages:**
* **Optimal**: Guarantees the shortest path.
* **Complete**: Finds a solution if one exists.
* **Versatile**: Works for any non-negative cost problem.

**Disadvantages:**
* **Inefficient:** Explores many nodes unnecessarily.
* **Memory-Intensive:** Large priority queue size.

## 3. A* Search
### 3.1 General Overview

A* Search is an informed search algorithm that enhances UCS with a heuristic function, prioritizing nodes by `fCost = gCost + hCost`. It’s efficient and optimal with an admissible heuristic.

**Key Features:**
* **Heuristic Function:** Estimates remaining cost (e.g Manhattan distance).
* **Priority Queue:** Sorts by fCost.
* **Optimal:** Ensured with an admissible heuristic.

```cpp
// Represents a state in A* search with total cost (fCost = gCost + hCost).
struct AStarNode {
    Puzzle state;
    int gCost;  // Cost to reach this node
    int fCost;  // Total cost (gCost + hCost)
    string path;
    bool operator>(const AStarNode& other) const {
        return fCost > other.fCost;  // For min-heap
    }
};

string aStar_ExpandedList(string const initialState, string const goalState, int& pathLength, int &numOfStateExpansions, int& maxQLength,
                          float &actualRunningTime, int &numOfDeletionsFromMiddleOfHeap, int &numOfLocalLoopsAvoided, int &numOfAttemptedNodeReExpansions, heuristicFunction heuristic) {
    vector<AStarNode> heap;
    set<string> expandedList;

    Puzzle initialPuzzle(initialState, goalState);
    int hCost = initialPuzzle.h(heuristic);
    AStarNode startNode = {initialPuzzle, 0, hCost, ""};
    heap.push_back(startNode);
    push_heap(heap.begin(), heap.end(), greater<AStarNode>());

    while (!heap.empty()) {
        pop_heap(heap.begin(), heap.end(), greater<AStarNode>());
        AStarNode currentNode = heap.back();
        heap.pop_back();

        if (currentNode.state.goalMatch()) {
            pathLength = currentNode.gCost;
            actualRunningTime = ((float)(clock() - startTime) / CLOCKS_PER_SEC);
            return currentNode.path;
        }

        expandedList.insert(currentNode.state.toString());
        numOfStateExpansions++;

        // Generate successors (example: Up move)
        if (currentNode.state.canMoveUp()) {
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
        // Similar blocks for Right, Down, Left...
    }
    return "";
}
```

**How It Works**:
1. **Start**: Begin with the initial state, setting the cost to reach it (`gCost`) to 0, calculating the heuristic cost (`hCost`), and determining the total cost (`fCost = hCost`).
2. **Expand**: Select and expand the node with the smallest `fCost`.
3. **Generate Successors**: Create new states by moving the blank tile up, down, left, or right.
4. **Update Queue**: For each successor, compute its `gCost` (previous `gCost + 1`), `hCost` (using the chosen heuristic), and `fCost`, adding unexpanded successors to the queue.
5. **Check Goal**: If the expanded node matches the goal, return the path.

**Heuristics Used**:
- **Misplaced Tiles**: This heuristic counts the number of tiles (excluding the blank) that are not in their goal positions. For example, in "123804765" compared to "123456780", tiles 4, 5, 6, and 8 are misplaced, yielding an `hCost` of 4. It’s simple and admissible (never overestimates the true cost, as each misplaced tile requires at least one move), but it provides less guidance since it ignores how far tiles are from their goals.
- **Manhattan Distance**: This heuristic calculates the sum of the absolute distances (in rows and columns) of each tile from its goal position, excluding the blank. For "123804765" versus "123456780", the `hCost` might be 6 (e.g. tile 8 is 2 steps away, tile 4 is 1 step away, etc.). It’s also admissible and more informative, as it reflects the actual effort needed to move tiles, guiding A* more effectively toward the goal.

**Example**:
From "123804765" to "123456780" with Manhattan distance:
- **Initial State**: "123804765", `gCost = 0`, `hCost = 6`, `fCost = 6`.
- **First Expansion**: Generate successors:
    - "123084765" (move 0 up), `gCost = 1`, `hCost = 5`, `fCost = 6`.
    - "123840765" (move 8 right), `gCost = 1`, `hCost = 7`, `fCost = 8`.
- **Next Steps**: Prioritize "123084765" (`fCost = 6`), which reduces the Manhattan distance, efficiently reaching "123456780".

Using misplaced tiles, the initial `hCost` might be 4, leading to similar prioritization but with less precise guidance compared to Manhattan distance.

### 3.3 Advantages and Disadvantages
**Advantages**:
- **Efficient**: Heuristics reduce the number of nodes explored, with Manhattan distance being particularly effective.
- **Optimal and Complete**: Both heuristics are admissible, ensuring the shortest path if a solution exists.
- **Flexible**: Supports tailored heuristics for different problem characteristics.

**Disadvantages**:
- **Heuristic-Dependent**: Performance relies on heuristic quality; misplaced tiles may lead to more expansions than Manhattan distance.
- **Memory Usage**: Requires significant memory for large search spaces, though less than UCS.

### 3.4 Other Applications
- **Pathfinding**: Finding optimal routes in video games or robotics, avoiding obstacles.
- **Scheduling**: Optimizing task sequences with time or resource constraints.
- **Natural Language Processing**: Identifying the best parse tree in syntactic analysis.

---

## 4. Comparison of UCS and A*

| **Aspect**             | **UCS**                              | **A\* Search**                                                              |
|-------------------------|--------------------------------------|-----------------------------------------------------------------------------|
| **Search Type**         | Uninformed (blind)                   | Informed (heuristic-guided)                                                 |
| **Prioritization**      | Lowest `gCost`                       | Lowest `fCost = gCost + hCost`                                              |
| **Heuristic**           | None                                 | Requires an admissible heuristic (e.g. misplaced tiles, Manhattan distance) |
| **Efficiency**          | May explore many nodes               | Explores fewer nodes with good heuristics                                   |
| **Optimality**          | Yes                                  | Yes (with admissible heuristic)                                             |
| **Memory Usage**        | High (all unexpanded nodes)          | High, but often fewer nodes                                                 |
| **Implementation**      | Simpler (no heuristic)               | More complex (heuristic computation)                                        |
| **Use Case**            | Uniform-cost problems                | Problems with heuristic guidance                                            |

**Detailed Comparison**:
- **Exploration Strategy**: UCS exhaustively explores all paths by increasing cost, ensuring optimality but potentially expanding many nodes. A* uses heuristics to focus on promising paths, reducing unnecessary exploration.
- **Performance**: UCS might explore thousands of states for deep 8-puzzle solutions, while A* with Manhattan distance typically expands far fewer, with misplaced tiles being less efficient but still better than UCS.
- **Complexity**: UCS is straightforward, tracking only the cost from the start. A* adds complexity by computing heuristic costs but reduces total nodes explored.

**Example Scenario**:
For "123804765" to "123456780":
- **UCS**: Explores states like "123840765" (move 8 right), then "123846075", checking all options at each depth.
- **A\* (Manhattan)**: Prioritizes "123084765" (move 0 up, `fCost = 6`) over "123840765" (`fCost = 8`), efficiently homing in on the goal.

---

## Conclusion
In the 8-Puzzle Solver Web Application, UCS and A* both deliver optimal solutions. UCS offers reliability through exhaustive exploration, while A* enhances efficiency with heuristic guidance. The choice between misplaced tiles and Manhattan distance in A* tailors its performance—Manhattan distance excels in directing the search, making it the preferred heuristic for this puzzle.












