import React, { useState, useEffect } from "react";

function Timer() {
  const [timer, setTimer] = useState(10);

  const tick = () => {
    setTimer((prevTimer) => {
      if (prevTimer === 0) {
        return 10;
      }
      return prevTimer - 1;
    });
  };

  useEffect(() => {
    setInterval(tick, 1000);

    // return () => {
    //   clearInterval();
    // };
  }, []);

  return <div>{timer}</div>;
}

export default Timer;
