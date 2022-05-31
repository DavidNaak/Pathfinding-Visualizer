import React, { Component, useState, useEffect } from "react";
import "./PathfindingVisualizer.css";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../Algorithms/dijkstra";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

export default function PathfindingVisualizer() {
  const [nodes, setNodes] = useState([]);
  const [mouseisPressed, setMouseIsPressed] = useState(false);

  const [startNodeRow, setStartNodeRow] = useState(10);
  const [startNodeCol, setStartNodeCol] = useState(15);
  const [finishNodeRow, setFinishNodeRow] = useState(10);
  const [finishNodeCol, setFinishNodeCol] = useState(25);

  const [changingStart, setChangingStart] = useState(false);
  const [changingFinish, setChangingFinish] = useState(true);

  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    const grid = getInitialGrid();
    setNodes(grid);
  }, []);

  const handleMouseDown = (row, col) => {
    if (row === startNodeRow && col === startNodeCol) {
      setChangingStart(true);
    } else if (row === finishNodeRow && col === finishNodeCol) {
      setChangingFinish(true);
    } else {
      const newGrid = getNewGridWithWallToggled(nodes, row, col);
      setNodes(newGrid);
    }
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseisPressed) return;
    if (changingStart && !(row === finishNodeRow && col === finishNodeCol)) {
      const start = document.getElementById(
        `node-${startNodeRow}-${startNodeCol}`
      );
      if (start) {
        start.className = "node";
        start.isStart = false;
        nodes[startNodeRow][startNodeCol].isStart = false;
      }
      const newStart = document.getElementById(`node-${row}-${col}`);
      if (newStart) {
        newStart.isStart = true;
        newStart.className = "node node-start";
        nodes[row][col].isStart = true;
      }
      setStartNodeRow(row);
      setStartNodeCol(col);
      clearVisitedAndPath();
    } else if (
      changingFinish &&
      !(row === startNodeRow && col === startNodeCol)
    ) {
      const finish = document.getElementById(
        `node-${startNodeRow}-${startNodeCol}`
      );
      if (finish) {
        finish.className = "node";
        finish.isFinish = false;
        nodes[finishNodeRow][finishNodeCol].isFinish = false;
      }
      const newFinish = document.getElementById(`node-${row}-${col}`);
      if (newFinish) {
        newFinish.isStart = true;
        newFinish.className = "node node-finish";
        nodes[row][col].isFinish = true;
      }
      setFinishNodeRow(row);
      setFinishNodeCol(col);
      clearVisitedAndPath();
    } else {
      const newGrid = getNewGridWithWallToggled(nodes, row, col);
      setNodes(newGrid);
    }
  };

  const handleMouseUp = () => {
    setChangingStart(false);
    setChangingFinish(false);
    setMouseIsPressed(false);
  };

  const visualizeDijkstra = () => {
    const startNode = nodes[startNodeRow][startNodeCol];
    const finishNode = nodes[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = dijkstra(nodes, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  };

  const clearBoard = () => {
    console.log(nodes);
    for (let row of nodes) {
      for (let nod of row) {
        nod.distance = Infinity;
        nod.isVisited = false;
        nod.isWall = false;
        nod.previousNode = null;
        document.getElementById(`node-${nod.row}-${nod.col}`).className =
          "node";
      }
    }
    setStartFunc();
    setFinishFunc();
    //setNodes(nodes);
  };

  const setStartFunc = () => {
    let n = document.getElementById(`node-${startNodeRow}-${startNodeCol}`);
    n.className = "node node-start";
  };

  const setFinishFunc = () => {
    let n = document.getElementById(`node-${finishNodeRow}-${finishNodeCol}`);
    n.className = "node node-finish";
  };

  const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  const createNode = (col, row) => {
    return {
      col,
      row,
      isStart: row === startNodeRow && col === startNodeCol,
      isFinish: row === finishNodeRow && col === finishNodeCol,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };

  const clearVisitedAndPath = () => {
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 50; col++) {
        let n = document.getElementById(`node-${row}-${col}`);
        //console.log(n);
        if (
          n &&
          (n.className === "node node-visited" ||
            n.className === "node node-shortest-path" ||
            n.className === "node node-start" ||
            n.className === "node node-finish")
        ) {
          n.className = "node";
        }
      }
    }
    setStartFunc();
    setFinishFunc();
  };

  return (
    <>
      <div className="awesomebuttons">
        <span className="firstawesomebutton">
          <AwesomeButton onPress={visualizeDijkstra} type="facebook">
            Visualize
          </AwesomeButton>
        </span>
        <AwesomeButton onPress={clearBoard} type="twitter">
          Clear
        </AwesomeButton>
      </div>

      <div className="grid">
        {nodes.map((row, rowIdx) => {
          return (
            <div key={rowIdx.toString()}>
              {row.map((node, nodeIdx) => {
                const { row, col, isStart, isFinish, isWall } = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    row={row}
                    isStart={isStart}
                    isFinish={isFinish}
                    isWall={isWall}
                    mouseisPressed={mouseisPressed}
                    onMouseDown={(row, col) => handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                    onMouseUp={() => handleMouseUp()}
                  ></Node>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

//let s = dijkstra([], createNode(1, 2), createNode(1, 2));
