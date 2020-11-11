import React, { useState, useEffect } from "react";
import appleSong from "./applePenSong.mp3";

function Song() {
  const [audio, setAudio] = useState(new Audio(appleSong));

  const [soundOn, setSoundOn] = useState(true);

  const soundOnHandler = () => {
    if (soundOn) {
      audio.pause();
      setSoundOn(false);
    } else {
      audio.play();
      setSoundOn(true);
    }
  };

  // play song when entered
  // useEffect(() => {
  //   console.log("check1");
  //   audio.play();
  // }, []);

  return (
    <div>
      <button onClick={soundOnHandler}>
        {soundOn ? "Stop" : "Play apple pen"}
      </button>
    </div>
  );
}

export default Song;
