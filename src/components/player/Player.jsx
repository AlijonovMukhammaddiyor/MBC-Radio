import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context/context";
import "../../styles/player/player.css";
import HLs from "hls.js";
import jsonp from "jsonp";

export default function Player(props) {
  const [volume, setVolume] = useState(5);
  const [prevVolume, setPrevVolume] = useState(5);
  const [player, setPlayer] = useState(null);
  const [pause, setPause] = useState(true);
  const [programs, setPrograms] = useState({});
  const [songs, setSongs] = useState({
    sfm: ["표준FM"],
    mfm: ["FM4U"],
    chm: ["올댓뮤직"],
  });
  const { radio_state, autoplay } = useContext(Context);
  const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

  const sec = new Date().getSeconds();
  const minute = new Date().getMinutes();

  useEffect(() => {
    const currentSongAPI = "https://miniapi.imbc.com/music/somitem?rtype=jsonp";
    function getCurrentSong() {
      function getData(url) {
        const promise = new Promise((resolve, reject) => {
          jsonp(url, {}, function (err, data) {
            if (err) reject(err);
            else {
              resolve(data);
            }
          });
        });
        return promise;
      }
      return getData(currentSongAPI);
    }

    try {
      const data = getCurrentSong();
      data.then((res, err) => {
        //do something here
        let temp = songs;
        for (let i = 0; i < res.length; i++) {
          if (res[i].Channel === "STFM") {
            temp["sfm"].push(res[i].SomItem);
          } else if (res[i].Channel === "FM4U") {
            temp["mfm"].push(res[i].SomItem);
          } else if (res[i].Channel === "CHAM") {
            temp["chm"].push(res[i].SomItem);
          }
        }
        setSongs(temp);
        console.log(res);
      });
    } catch (e) {
      console.log(e);
    }

    const Somtimer = window.setInterval(() => {
      try {
        const data = getCurrentSong();
        data.then((res, err) => {
          //do something here
          let temp = songs;
          for (let i = 0; i < res.length; i++) {
            if (res[i].Channel === "STFM") {
              temp["sfm"].push(res[i].SomItem);
            } else if (res[i].Channel === "FM4U") {
              temp["mfm"].push(res[i].SomItem);
            } else if (res[i].Channel === "CHAM") {
              temp["chm"].push(res[i].SomItem);
            }
          }
          setSongs(temp);
          console.log(res);
        });
      } catch (e) {
        console.log(e);
      }
    }, 3000);
    return () => window.clearInterval(Somtimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function getCurrentProgramName() {
      const date = new Date();
      let hour = date.getHours();
      let minutes = date.getMinutes();

      const now = {
        day: weekdays[(date.getDay() - 1 + 7) % 7],
        time: hour * 60 + minutes,
      };

      let res = {};
      // console.log(now);
      const tempA = radio_state.schedule.Programs;
      for (let i = 0; i < tempA.length; i++) {
        if (tempA[i].LiveDays === now.day) {
          const pTime =
            parseInt(tempA[i].StartTime.substring(0, 2)) * 60 +
            parseInt(tempA[i].StartTime.substring(2, 4));
          if (pTime <= now.time && now.time - pTime < tempA[i].RunningTime) {
            if (tempA[i].Channel === "STFM") {
              res["sfm"] = tempA[i];
            } else if (tempA[i].Channel === "FM4U") {
              res["mfm"] = tempA[i];
            } else if (tempA[i].Channel === "CHAM") {
              res["chm"] = tempA[i];
            }
          }
        }
      }
      props.getImg(res);
      setPrograms(res);
    }
    if (radio_state.schedule) {
      getCurrentProgramName();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minute]);

  const style = {
    "--val": volume,
    "--min": 0,
    "--max": 10,
  };

  useEffect(() => {
    async function getUrl() {
      const promise = new Promise((resolve, reject) => {
        const rand = Math.random();
        const urlFM = `http://sminiplay.imbc.com/aacplay.ashx?channel=${radio_state.channel}&protocol=M3U8&agent=webapp&nocash=${rand}`;

        jsonp(urlFM, {}, function (err, data) {
          if (err) reject(err);
          else {
            resolve(data.AACLiveURL);
          }
        });
      });
      return promise;
    }
    if (radio_state && !radio_state.broadcast) {
      const data = getUrl();

      data.then((data, err) => {
        if (err) {
          console.log(err);
        } else {
          const config = { autoStartLoad: true, debug: false };
          if (HLs.isSupported()) {
            if (window.hls) window.hls.destroy();
            if (player) player.destroy();
            window.hls = new HLs(config);

            window.hls.loadSource(data);
            const audio = document.getElementById("audio");
            window.hls.attachMedia(audio);
            if (autoplay)
              window.hls.on(HLs.Events.MANIFEST_PARSED, function () {
                audio.volume = volume / 10;
                setPause(false);
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                  playPromise
                    .then((_) => {})
                    .catch((error) => {
                      console.log(error);
                    });
                }
              });

            window.hls.on(HLs.Events.ERROR, function (event, data) {
              let errorType = data.type;
              let errorDetails = data.details;
              let errorFatal = data.fatal;
              console.log("error", data.err, data);
              console.log("errorType", errorType);
              console.log("errorDetails", errorDetails);
              console.log("errorFatal", errorFatal);
            });

            setPlayer(window.hls);
          }
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radio_state.channel, autoplay, radio_state.broadcast]);

  useEffect(() => {
    if (radio_state && radio_state.broadcast) {
      if (player) player.destroy();
      const audio = document.getElementById("audio");
      audio.addEventListener("loadedmetadata", function () {
        props.getDur(Math.ceil(audio.duration));
      });
      audio.pause();
      audio.src = radio_state.broadcast.EncloserURL;
      if (autoplay) {
        const playPromise = audio.play();
        setPause(false);
        if (playPromise !== undefined) {
          playPromise
            .then((_) => {})
            .catch((error) => {
              console.log(error);
            });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radio_state.broadcast, radio_state.resetBrodcast]);

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

    const audio = document.getElementById("audio");
    audio.volume = volume / 10;
  }, [volume]);

  function changeVolume(e) {
    setVolume(e.target.valueAsNumber);
  }

  function toggleSound(e) {
    if (volume === 0) {
      setVolume(prevVolume);
    } else {
      setPrevVolume(volume);
      setVolume(0);
    }
  }

  function play_audio() {
    const audio = document.getElementById("audio");
    if (!pause) {
      audio.pause();
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then((_) => {})
          .catch((error) => {
            console.log(error);
          });
      }
    }

    setPause(!pause);
  }

  // console.log(songs, songs[radio_state.channel], radio_state.channel);

  return (
    <div className="mini__player__container">
      <div className="audio__controls">
        <div className="left">
          <div className="play__pause">
            <button
              className={pause ? "play__btn pause" : "play__btn"}
              onClick={play_audio}
            ></button>
          </div>

          <div className="live__sign">
            <div className="live"></div>
            <div className="music"></div>
          </div>

          <div className="audio__details">
            {programs[radio_state.channel] && (
              <>
                <div className="podcast__title">
                  {radio_state && radio_state.broadcast
                    ? radio_state.broadcast.ProgramTitle
                    : programs[radio_state.channel].ProgramTitle}
                </div>
                <div className="song__name">
                  {radio_state && radio_state.broadcast
                    ? radio_state.broadcast.BroadDate
                    : songs &&
                      radio_state.channel &&
                      songs[radio_state.channel] &&
                      songs[radio_state.channel].length > 1
                    ? songs[radio_state.channel][1]
                    : songs[radio_state.channel][0]}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="right">
          <div className="sound">
            <button
              className={volume === 0 ? "sound__btn off" : "sound__btn"}
              onClick={toggleSound}
            ></button>
            <div className="volume__slider">
              <input
                type="range"
                min={0}
                max={10}
                value={volume}
                onChange={changeVolume}
                style={style}
              ></input>
            </div>
          </div>
        </div>
      </div>
      <div className="audio">
        <audio preload="metadata" id="audio" controls />
      </div>
      {/* <div className="program__picture">
        <img src={programs[radio_state.channel].Picture} alt="" />
      </div> */}
    </div>
  );
}
