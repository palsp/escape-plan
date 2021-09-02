import React, { useState, useEffect } from "react";

function Timer(props) {
  // const checkTime = () => {
  //   if (timer === 0) {
  //     // setTurn(!turn);
  //     setTimer(10);
  //   }
  // };

  // useEffect(() => {
  //   checkTime();
  // });

  // const tick = () => {
  //   setTimer((prevTimer) => prevTimer - 1);
  // };

  // useEffect(() => {
  //   setInterval(tick, 1000);

  //   return () => {
  //     clearInterval();
  //   };
  // }, []);

  return (
    <div>
      Time: <b>{props.timer}</b>
    </div>
  );
}

export default Timer;
