import React, { useContext } from "react";
import { Context } from "../../context/context";
import "../../styles/img/img.css";

export default function Img(props) {
  const { radio_state } = useContext(Context);
  return (
    <div className="program__image">
      {props.progs.chm && !radio_state.isPodcast && (
        <img src={props.progs[radio_state.channel].HDPicture} alt="" />
      )}
    </div>
  );
}
