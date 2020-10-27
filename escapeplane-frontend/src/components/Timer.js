import React, { useState, useEffect } from "react";

function Timer() {
  const [timer, setTimer] = useState(0);

  const tick = () => {
    setTimer((prevTimer) => prevTimer + 1);
  };

  useEffect(() => {
    setInterval(tick, 1000);

    return () => {
      clearInterval();
    };
  }, []);

  return <div>{timer}</div>;
}

export default Timer;
