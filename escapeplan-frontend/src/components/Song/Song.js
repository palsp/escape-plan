import React, { useState, useEffect } from "react";
import appleSong from "./applePenSong.mp3";
import gamesong from "./gamesong.mp3"

function Song() {
  const [audio, setAudio] = useState(new Audio(gamesong));

  const [soundOn, setSoundOn] = useState(true);

   // play song when entered
   useEffect(() => {
    audio.play();
  }, []);

  const soundOnHandler = () => {
    if (soundOn) {
      audio.pause();
      setSoundOn(false);
    } else {
      audio.play();
      setSoundOn(true);
    }
  };

 

  return (
    <div>
      <button className="myButton3" onClick={soundOnHandler}>{soundOn ? "🔊  " : "🔇  "}</button>
    </div>
  );
}

export default Song;
