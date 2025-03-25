// File: algorithm.h
// Author: Johnny CW
// Date: March 24, 2025
// Description: Header file declaring 8-puzzle solver functions for Uniform Cost and A* algorithms.

#ifndef __ALGORITHM_H__
#define __ALGORITHM_H__

#include <ctime>
#include <string>
#include <iostream>
#include <algorithm>
#include <cstdlib>
#include <cstring>
#include <vector>

#include "puzzle.h"

// Purpose: Declares Uniform Cost Search solver for the 8-puzzle.
// Params: See algorithm.cpp for details
// Returns: String of moves or empty if unsolvable
string uc_explist(string const initialState, string const goalState, int& pathLength, int &numOfStateExpansions, int& maxQLength,
                          float &actualRunningTime, int &numOfDeletionsFromMiddleOfHeap, int &numOfLocalLoopsAvoided, int &numOfAttemptedNodeReExpansions);

// Purpose: Declares A* solver for the 8-puzzle with a specified heuristic.
// Params: See algorithm.cpp for details
// Returns: String of moves or empty if unsolvable
string aStar_ExpandedList(string const initialState, string const goalState, int& pathLength, int &numOfStateExpansions, int& maxQLength,
                          float &actualRunningTime, int &numOfDeletionsFromMiddleOfHeap, int &numOfLocalLoopsAvoided, int &numOfAttemptedNodeReExpansions, heuristicFunction heuristic);



#endif