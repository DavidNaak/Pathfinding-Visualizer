import React, { useState } from "react";
import "./Node.css";

export default function Node({
  isStart,
  isFinish,
  col,
  row,
  isWall,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) {
  //console.log(isFinish);
  const extraClassName = isFinish
    ? "node-finish"
    : isStart
    ? "node-start"
    : isWall
    ? "node-wall"
    : "";
  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    ></div>
  );
}
