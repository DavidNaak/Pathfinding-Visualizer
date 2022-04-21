import React, { useState } from "react";
import "./Node.css";

export default function Node({ isStart, isFinish, col, row }) {
  //console.log(isFinish);

  const extraClassName = isFinish ? "node-finish" : isStart ? "node-start" : "";
  return (
    <div id={`node-${row}-${col}`} className={`node ${extraClassName}`}></div>
  );
}
