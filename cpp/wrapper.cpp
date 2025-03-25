// File: wrapper.cpp
// Author: Johnny CW
// Date: March 24, 2025
// Description: WebAssembly wrapper to expose 8-puzzle solver functions to JavaScript.

#include <emscripten.h>
#include <string>
#include "algorithm.h"

extern "C" { // Ensure C linkage for WebAssembly compatibility


// Purpose: Wrapper for Uniform Cost Search solver, returning path and updating stats.
// Params:
//   - initialState: Starting puzzle state (C-string, e.g., "123804765")
//   - goalState: Target state (C-string, e.g., "123456780")
//   - stats: Array to store [pathLength, numOfStateExpansions, maxQLength, actualRunningTime * 1000]
// Returns: Pointer to solution path string (allocated in WebAssembly memory)
EMSCRIPTEN_KEEPALIVE
char* solveUC(const char* initialState, const char* goalState, int* stats) {
    emscripten_log(EM_LOG_CONSOLE, "Received initialState: %s, goalState: %s", initialState, goalState);
    int pathLength = 0, numOfStateExpansions = 0, maxQLength = 0;
    float actualRunningTime = 0.0;
    int numOfDeletions = 0, numOfLocalLoops = 0, numOfReExpansions = 0;

    string result = uc_explist(
        string(initialState), string(goalState), pathLength, numOfStateExpansions,
        maxQLength, actualRunningTime, numOfDeletions, numOfLocalLoops, numOfReExpansions
    );

    // Populate stats array for JavaScript
    stats[0] = pathLength;
    stats[1] = numOfStateExpansions;
    stats[2] = maxQLength;
    stats[3] = static_cast<int>(actualRunningTime * 1000); // Convert to milliseconds

    // Allocate memory and copy result for JavaScript to access
    char* path = (char*)malloc(result.length() + 1);
    strcpy(path, result.c_str());
    return path;
}

// Purpose: Wrapper for A* solver with heuristic, returning path and updating stats.
// Params:
//   - initialState: Starting puzzle state (C-string, e.g., "123804765")
//   - goalState: Target state (C-string, e.g., "123456780")
//   - stats: Array to store [pathLength, numOfStateExpansions, maxQLength, actualRunningTime * 1000]
//   - heuristic: 0 for misplaced tiles, 1 for Manhattan distance
// Returns: Pointer to solution path string (allocated in WebAssembly memory)
EMSCRIPTEN_KEEPALIVE
char* solveAStar(const char* initialState, const char* goalState, int* stats, int heuristic) {
    int pathLength = 0, numOfStateExpansions = 0, maxQLength = 0;
    float actualRunningTime = 0.0;
    int numOfDeletions = 0, numOfLocalLoops = 0, numOfReExpansions = 0;

    string result = aStar_ExpandedList(
        string(initialState), string(goalState), pathLength, numOfStateExpansions,
        maxQLength, actualRunningTime, numOfDeletions, numOfLocalLoops, numOfReExpansions,
        heuristic == 0 ? misplacedTiles : manhattanDistance
    );

    stats[0] = pathLength;
    stats[1] = numOfStateExpansions;
    stats[2] = maxQLength;
    stats[3] = static_cast<int>(actualRunningTime * 1000);

    char* path = (char*)malloc(result.length() + 1);
    strcpy(path, result.c_str());
    return path;
}

// Purpose: Frees memory allocated by solver functions to prevent leaks.
// Params:
//   - ptr: Pointer to memory allocated in solveUC or solveAStar
EMSCRIPTEN_KEEPALIVE
void freeMemory(char* ptr) {
    free(ptr);
}

} // extern "C"