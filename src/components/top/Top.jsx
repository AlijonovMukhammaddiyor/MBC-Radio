import React, { useState } from "react";
import "../../styles/top/top.css";
import Navbar from "../navbar/Navbar";
import Channels from "../channels/Channels";
import Player from "../player/Player";
import Time from "../time/Time";
import Img from "../img/Img";

export default function Top() {
  const [progs, setProgs] = useState({});
  const [duration, setDuration] = useState(0);

  function getProgImg(url) {
    setProgs(url);
    // console.log("sdsd", progs);
  }

  function getDuration(d) {
    setDuration(d);
  }

  return (
    <div className="mini__topbar__container">
      <Navbar />
      <hr className="line" />
      <Channels />
      <hr className="line" />
      <Player getImg={getProgImg} getDur={getDuration} />
      <Time progs={progs} dur={duration} />
      <Img progs={progs} />
    </div>
  );
}
