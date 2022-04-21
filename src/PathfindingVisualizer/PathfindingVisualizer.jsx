import React, { Component, useState, useEffect } from "react";
import "./PathfindingVisualizer.css";
import Node from "./Node/Node";

export default function PathfindingVisualizer() {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    const nodes = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        const currentNode = {
          col,
          row,
          isStart: row == 10 && col == 5,
          isFinish: row == 10 && col == 45,
        };
        currentRow.push(currentNode);
      }
      nodes.push(currentRow);
    }
    setNodes(nodes);
  });

  return (
    <div className="grid">
      {nodes.map((row, rowIdx) => {
        return (
          <div key={rowIdx.toString()}>
            {row.map((node, nodeIdx) => {
              const { isStart, isFinish } = node;
              //console.log(isStart);
              return (
                <Node
                  key={nodeIdx}
                  isStart={isStart}
                  isFinish={isFinish}
                ></Node>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
