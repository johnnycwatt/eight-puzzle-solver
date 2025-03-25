// File: puzzle.cpp
// Author: Johnny CW
// Date: March 24, 2025
// Description: Implements the Puzzle class for 8-puzzle state management and transitions.

#include "puzzle.h"
#include  <cmath>
#include  <assert.h>
#include <emscripten.h>

using namespace std;

//////////////////////////////////////////////////////////////
//Constructor: Creates a deep copy of an existing Puzzle object.
//////////////////////////////////////////////////////////////
Puzzle::Puzzle(const Puzzle &p) : path(p.path){

	for(int i=0; i < 3; i++){
		for(int j=0; j < 3; j++){
		    board[i][j] = p.board[i][j];
		    goalBoard[i][j] = p.goalBoard[i][j];
		}
	}

	x0 = p.x0;
	y0 = p.y0;
	//path = p.path;
	pathLength = p.pathLength;
	hCost = p.hCost;
	fCost = p.fCost;
	strBoard = toString(); //uses the board contents to generate the string equivalent
	depth = p.depth;

}

//////////////////////////////////////////////////////////////
//Constructor: Puzzle
//Purpose: Initializes a new Puzzle from initial and goal state strings.
// Params:
//   - elements: Initial state (e.g., "123804765")
//   - goal: Goal state (e.g., "123456780")
//////////////////////////////////////////////////////////////
Puzzle::Puzzle(string const elements, string const goal){
    emscripten_log(EM_LOG_CONSOLE, "Constructing Puzzle with elements: %s, goal: %s", elements.c_str(), goal.c_str());
	int n;

	n = 0;
	for(int i=0; i < 3; i++){
		for(int j=0; j < 3; j++){
		    board[i][j] = elements[n] - '0';
		    if(board[i][j] == 0){
			    x0 = j;
			    y0 = i;
			 }
		    n++;
		}
	}

	///////////////////////
	n = 0;
	for(int i=0; i < 3; i++){
		for(int j=0; j < 3; j++){
		    goalBoard[i][j] = goal[n] - '0';
		    n++;
		}
	}
	///////////////////////
	path = "";
	pathLength=0;
	hCost = 0;
	fCost = 0;
	depth = 0;
	strBoard = toString();
}


void Puzzle::setDepth(int d){
	depth = d;
}

int Puzzle::getDepth(){
	return depth;
}

void Puzzle::updateHCost(heuristicFunction hFunction){
	hCost = h(hFunction);
}

void Puzzle::updateFCost(){
	//fCost = ?
}

int Puzzle::getFCost(){
	return fCost;
}

int Puzzle::getHCost(){
	return hCost;
}

int Puzzle::getGCost(){
	return pathLength;
}


// Computes heuristic cost for A* based on specified function.
// Params:
//   - hFunction: Heuristic type (misplacedTiles or manhattanDistance)
// Returns: Heuristic cost as an integer
int Puzzle::h(heuristicFunction hFunction){

	int h=0;

	switch(hFunction){
		case misplacedTiles:
            for (int i = 0; i < 3; i++) {
                for (int j= 0; j < 3; j++) {
                    if (board[i][j] != 0 && board[i][j] != goalBoard[i][j]) {
                        h++;
                    }
                }
            }
            break;


		case manhattanDistance:
		        for (int i = 0; i < 3; i++) {
                for (int j = 0; j< 3; j++) {
                    if (board[i][j] != 0) {
                        for (int m =0; m< 3; m++) {
                            for (int n =0; n < 3; n++) {
                                if (board[i][j] == goalBoard[m][n]) {
                                    h += abs(i - m) + abs(j- n);
                                }
                            }
                        }
                    }
                }
            }
		        break;

	};

	return h;

}


//Converts current board state to a string for comparison.
// Returns: 9-digit string (e.g., "123456780")
string Puzzle::toString(){
  int n;
  string stringPath;

  n=0;
  for(int i=0; i < 3; i++){
		for(int j=0; j < 3; j++){
		    stringPath.insert(stringPath.end(), board[i][j] + '0');
		    n++;
		}
  }

//  cout << "toString = " << stringPath << endl;

  return stringPath;
}

bool Puzzle::goalMatch() {
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            if (board[i][j] != goalBoard[i][j]) {
                return false;
            }
        }
    }
    return true;
}

bool Puzzle::canMoveLeft(){
   return (x0 > 0);

}

const string Puzzle::getPath(){
	return path;
}

bool Puzzle::canMoveRight(){

   return (x0 < 2);

}


bool Puzzle::canMoveUp(){

   return (y0 > 0);

}

bool Puzzle::canMoveDown(){

   return (y0 < 2);

}

///////////////////////////////////////////////
//these functions will be useful for Progressive Deepening Search

bool Puzzle::canMoveLeft(int maxDepth){

  	bool m=false;
  	//put implementations here
  	return m;
}
bool Puzzle::canMoveRight(int maxDepth){

  	bool m=false;
  	//put implementations here
  	return m;
}


bool Puzzle::canMoveUp(int maxDepth){

  	bool m=false;
  	//put implementations here
  	return m;
}

bool Puzzle::canMoveDown(int maxDepth){

  	bool m=false;
  	//put implementations here
  	return m;
}

///////////////////////////////////////////////

Puzzle *Puzzle::moveLeft(){

	Puzzle *p = new Puzzle(*this);


   if(x0 > 0){

		p->board[y0][x0] = p->board[y0][x0-1];
		p->board[y0][x0-1] = 0;

		p->x0--;

		p->path = path + "L";
		p->pathLength = pathLength + 1;
		p->depth = depth + 1;


	}
	p->strBoard = p->toString();

	return p;

}


Puzzle *Puzzle::moveRight(){

   Puzzle *p = new Puzzle(*this);


   if(x0 < 2){

		p->board[y0][x0] = p->board[y0][x0+1];
		p->board[y0][x0+1] = 0;

		p->x0++;

		p->path = path + "R";
		p->pathLength = pathLength + 1;

		p->depth = depth + 1;

	}

	p->strBoard = p->toString();

	return p;

}


Puzzle *Puzzle::moveUp(){

   Puzzle *p = new Puzzle(*this);


   if(y0 > 0){

		p->board[y0][x0] = p->board[y0-1][x0];
		p->board[y0-1][x0] = 0;

		p->y0--;

		p->path = path + "U";
		p->pathLength = pathLength + 1;

		p->depth = depth + 1;

	}
	p->strBoard = p->toString();

	return p;

}

Puzzle *Puzzle::moveDown(){

   Puzzle *p = new Puzzle(*this);


   if(y0 < 2){

		p->board[y0][x0] = p->board[y0+1][x0];
		p->board[y0+1][x0] = 0;

		p->y0++;

		p->path = path + "D";
		p->pathLength = pathLength + 1;

		p->depth = depth + 1;

	}
	p->strBoard = p->toString();

	return p;

}

/////////////////////////////////////////////////////


void Puzzle::printBoard(){
	cout << "board: "<< endl;
	for(int i=0; i < 3; i++){
		for(int j=0; j < 3; j++){
		  cout << endl << "board[" << i << "][" << j << "] = " << board[i][j];
		}
	}
	cout << endl;

}

int Puzzle::getPathLength(){
	return pathLength;
}
