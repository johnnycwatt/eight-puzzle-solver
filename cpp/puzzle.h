// File: puzzle.h
// Author: Johnny CW
// Date: March 24, 2025
// Description: Header file defining the Puzzle class for 8-puzzle state management.

#include <string>
#include <iostream>

using namespace std;


enum heuristicFunction{misplacedTiles, manhattanDistance};


class Puzzle{

private:

    string path;
    int pathLength;
    int hCost;
    int fCost;
    int depth;

    int goalBoard[3][3];

    int x0, y0;

    int board[3][3];

public:

    string strBoard;


    Puzzle(const Puzzle &p);
    Puzzle(string const elements, string const goal);

    void printBoard();

    int h(heuristicFunction hFunction);
    void updateFCost();
    void updateHCost(heuristicFunction hFunction);
    void updateDepth(){
         depth++;
    }


    bool goalMatch();
     string toString();

    string getString(){
        return strBoard;
     }

    bool canMoveLeft();
    bool canMoveRight();
    bool canMoveUp();
    bool canMoveDown();

     bool canMoveLeft(int maxDepth);
     bool canMoveDown(int maxDepth);
     bool canMoveRight(int maxDepth);
     bool canMoveUp(int maxDepth);

    Puzzle * moveUp();
    Puzzle * moveRight();
    Puzzle * moveDown();
    Puzzle * moveLeft();


    const string getPath();

    void setDepth(int d);
    int getDepth();

    int getPathLength();
    int getFCost();
    int getHCost();
    int getGCost();

};
