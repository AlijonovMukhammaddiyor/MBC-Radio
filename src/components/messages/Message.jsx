import React, { useState, useContext } from "react";
import { Context } from "../../context/context";
import "../../styles/message/message.css";
import { Link } from "react-router-dom";

export default function Message() {
  const { radio_state } = useContext(Context);
  // console.log(radio_state.podcasts);
  return (
    <div className="mini__message__container">
      {radio_state.isPodcast && (
        <div className="mini__podcast__container">
          {radio_state.podcasts.map((podcast, idx) => {
            return (
              <Link
                to={`podcast?q=${podcast.BroadCastID}`}
                style={{ textDecoration: "none" }}
                key={idx}
              >
                <div className="each__podcast" key={idx}>
                  <img src={podcast.HDPicture} alt="" />
                  <div className="text__area">
                    <p className="title">{podcast.Title}</p>
                    <p className="subtitle">{podcast.SubTitle}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
