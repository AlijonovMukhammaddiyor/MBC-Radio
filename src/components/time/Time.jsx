import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context/context";
import "../../styles/time/time.css";

export default function Time(props) {
  const [progress, setProgress] = useState(50);
  const [broProgress, setBroProgress] = useState(0);
  const { radio_state } = useContext(Context);
  const [playedTime, setPlayedTime] = useState(0);
  const minute = new Date().getMinutes();

  const style = {
    "--min": 0,
    "--max": 100,
    "--val": radio_state && radio_state.broadcast ? broProgress : progress,
  };

  useEffect(() => {
    const _R = document.querySelector("input[type=range]");
    document.documentElement.classList.add("js");

    _R.addEventListener(
      "input",
      (e) => {
        _R.style.setProperty("--val", +_R.value);
      },
      false
    );
  }, [progress]);

  useEffect(() => {
    function changeProgress() {
      const st =
        parseInt(props.progs[radio_state.channel].StartTime.substring(0, 2)) *
          60 +
        parseInt(props.progs[radio_state.channel].StartTime.substring(2, 4));
      const date = new Date();
      const curr = date.getHours() * 60 + date.getMinutes();

      const runn = parseInt(props.progs[radio_state.channel].RunningTime);
      // console.log(runn);
      setProgress((100 * (curr - st)) / runn);
    }

    if (props.progs[radio_state.channel]) {
      changeProgress();
      const timer = window.setInterval(() => {
        changeProgress();
      }, 500);
      return () => window.clearInterval(timer);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.progs, radio_state.channel]);

  function getEndTime(startTime, runningTime) {
    function format(time) {
      if (time < 10) {
        return "0" + time;
      }
      return `${time}`;
    }

    const sHour = parseInt(startTime.substring(0, 2));
    const sMinutes = parseInt(startTime.substring(2, 4));

    const hour = Math.floor(parseInt(runningTime) / 60);
    let eHours = sHour + hour;
    let eMinutes = sMinutes + parseInt(runningTime) - hour * 60;
    if (eMinutes >= 60) {
      eHours += 1;
      eMinutes -= 60;
    }

    return format(eHours) + ":" + format(eMinutes);
  }

  function formatDuration(time) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - 3600 * hours) / 60);
    const seconds = time - 3600 * hours - 60 * minutes;
    let ans = "";
    [hours, minutes, seconds].forEach((num) => {
      let formattedNumber = num.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
      ans += formattedNumber + ":";
    });
    return ans.substring(0, ans.length - 1);
  }

  useEffect(() => {
    if (radio_state.broadcast) {
      const prog = window.setInterval(() => {
        if (props.dur && props.dur > 0) {
          const audio = document.getElementById("audio");
          setPlayedTime(audio.currentTime);
          setBroProgress((100 * audio.currentTime) / props.dur);
        }
      }, 1000);
      return () => window.clearInterval(prog);
    }
  }, [props.dur, radio_state.broadcast, radio_state.resetBrodcast]);

  return (
    <div className="program__time__container">
      <div className="progress__bar">
        {props.progs[radio_state.channel] && (
          <p>
            {radio_state && radio_state.broadcast
              ? formatDuration(Math.ceil(playedTime))
              : `${props.progs[radio_state.channel].StartTime.substring(
                  0,
                  2
                )}:${props.progs[radio_state.channel].StartTime.substring(
                  2,
                  4
                )}`}
          </p>
        )}

        <input
          type="range"
          min={0}
          max={100}
          value={radio_state && radio_state.broadcast ? broProgress : progress}
          readOnly
          style={style}
        />
        {props.progs[radio_state.channel] && (
          <p>
            {radio_state && radio_state.broadcast
              ? formatDuration(props.dur)
              : getEndTime(
                  props.progs[radio_state.channel].StartTime,
                  props.progs[radio_state.channel].RunningTime
                )}
          </p>
        )}
      </div>
      {/* <div className="program__image">
        <img src={} alt="" />
      </div> */}
    </div>
  );
}
