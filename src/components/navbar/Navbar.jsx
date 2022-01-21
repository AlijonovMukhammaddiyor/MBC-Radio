import React, { useContext } from "react";
import "../../styles/navbar/navbar.css";
import { Context } from "../../context/context";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { radio_state } = useContext(Context);

  return (
    <div className="mini__navbar__container">
      <div className="mini__navbar__logo">
        <Link to={"/"}>
          <button className="logo__icon"></button>
        </Link>
      </div>
      <div className="mini__navbar__page-control">
        <div
          className={
            !radio_state.isPodcast && radio_state.channel === "sfm"
              ? "page-point dot"
              : "page-point"
          }
        ></div>
        <div
          className={
            !radio_state.isPodcast && radio_state.channel === "mfm"
              ? "page-point dot"
              : "page-point"
          }
        ></div>
        <div
          className={
            !radio_state.isPodcast && radio_state.channel === "chm"
              ? "page-point dot"
              : "page-point"
          }
        ></div>
        <div
          className={radio_state.isPodcast ? "page-point dot" : "page-point"}
        ></div>
      </div>
      <div className="mini__navbar__equalizer">
        <button className="nav__btn btn-fb"></button>
        <button className="nav__btn btn-tw"></button>
        <div className="nav__btn equalizer"></div>
      </div>
    </div>
  );
};

export default Navbar;
