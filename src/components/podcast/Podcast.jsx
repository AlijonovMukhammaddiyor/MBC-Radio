import React, { useEffect, useState, useContext } from "react";
import jsonp from "jsonp";
import "../../styles/podcast/podcast.css";
import { BiArrowBack } from "react-icons/bi";
import { Context } from "../../context/context";

export default function Podcast(props) {
  const [broadcast, setBroadcast] = useState([]);
  const index = window.location.href.indexOf("q=");
  const id = window.location.href.substring(index + 2, index + 21);
  const { dispatch, radio_state } = useContext(Context);

  useEffect(() => {
    const currentSongAPI = `http://miniunit.imbc.com/List/podcastitemlist?rtype=jsonp&bid=${id}&gid=0&page=1&pageSize=50`;

    function get(data) {
      console.log(data);
    }
    function getCurrentSong() {
      function getData(url) {
        const promise = new Promise((resolve, reject) => {
          jsonp(url, { name: "get" }, function (err, data) {
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
      if (id) {
        const data = getCurrentSong();
        data.then((res, err) => {
          setBroadcast(res.PodCastItems);
        });
      }
    } catch (e) {
      console.log(e);
    }
  }, []);
  function playBroadcast(file) {
    dispatch({
      type: "SET_BROADCAST",
      broadcast: file,
      autoplay: true,
      reset: !radio_state.resetBrodcast,
    });
  }

  return (
    <div className="podcast__container">
      <div className="back__info">
        <p>
          이 서비스는 음악 저작권 문제로 인해 방송 중에 나온 음악들은 제공되지
          않는 점 양해 부탁드리며, 더불어 상업적인 용도로 RSS Feed 연결을
          할수없습니다
        </p>
        <a href="/" className="back__icon">
          <BiArrowBack className="icon" />
        </a>
      </div>

      {broadcast.length > 0 &&
        broadcast.map((file, idx) => {
          return (
            <div
              onClick={() => {
                playBroadcast(file);
              }}
              className="each__file"
              key={idx}
            >
              <p className="title">{file.ContentTitle}</p>
              <p className="date">{file.BroadDate}</p>
            </div>
          );
        })}
    </div>
  );
}
