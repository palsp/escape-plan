import React from "react";
import Music from "./Musics";
import Chat from "./Chat";

function Song() {
  return (
    <div>
      <Music
        urls={[
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
        ]}
      />
      <Chat></Chat>
    </div>
  );
}

export default Song;
