import React, { useState, useContext } from "react";
import "../../styles/channels/channels.css";
import { Context } from "../../context/context";
import { Link } from "react-router-dom";

export default function Channels(props) {
  const { radio_state, dispatch, autoplay } = useContext(Context);
  const [channel, setChannel] = useState(radio_state.channel || "mfm");

  function changeChannel(ch) {
    if (ch !== "podcast") {
      // console.log("ch", autoplay);
      setChannel(ch);
      dispatch({ type: "CHANGE_CHANNEL", payload: ch, autoplay: true });
      dispatch({ type: "PODCAST_OFF" });
    } else {
      dispatch({ type: "PODCAST_ON" });
    }

    dispatch({
      type: "SET_BROADCAST",
      broadcast: null,
      autoplay: ch === "podcast" ? autoplay : true,
    });
  }

  return (
    <div className="mini__channels__container">
      <div className="channel__pointer"></div>
      <div
        className={
          radio_state.isPodcast
            ? "channel__navi podcast"
            : `channel__navi ${channel}`
        }
      >
        <Link to={"/"}>
          <button
            onClick={() => changeChannel("sfm")}
            className="navi__btn mfm"
          >
            표준FM
          </button>
        </Link>
        <Link to={"/"}>
          <button
            onClick={() => changeChannel("mfm")}
            className="navi__btn sfm"
          >
            FM4U
          </button>
        </Link>
        <Link to={"/"}>
          <button
            onClick={() => changeChannel("chm")}
            className="navi__btn mfm"
          >
            올댓뮤직
          </button>
        </Link>
        <Link to={"/"}>
          <button
            onClick={() => changeChannel("podcast")}
            className="navi__btn"
          >
            PodcastM
          </button>
        </Link>
      </div>
    </div>
  );
}
