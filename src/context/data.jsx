import jsonp from "jsonp";

// subtitles in all sections change according to the someitem url. If there is no corresponsing subtitle for the section, then subtitle is the name of the channel
// SFM: title changes according to Schedule
// MFM: title changes according to Schedule
// CHM: title changes according to the Schedule

// const onAirPlayAPI = "//sminiplay.imbc.com/boraplay.ashx?rtype=jsonp";
// const onAirSecurePlayAPI = "//sminiplay.imbc.com/aacplay.ashx";

// const onAirPlayAPIForPC = "//miniplay.imbc.com/HLSLive.ashx?rtype=jsonp";

const onAirScheduleAPI = "//miniunit.imbc.com/Schedule?rtype=jsonp&";
// const onAirVodScheduleAPI =
//   "//miniunit.imbc.com/schedule/BoraSchedule?rtype=jsonp";

// const onAirVodScheduleCurrentAPI =
//   "//miniunit.imbc.com/schedule/BoraRecentInfo&rtype=jsonp";
// const onAirVodScheduleWeekAPI =
//   "//miniunit.imbc.com/schedule/BorascheduleWeekList?rtype=jsonp";
// const onAirVodScheduleTableAPI =
//   "//miniunit.imbc.com/schedule/BorascheduleTable?rtype=jsonp";

// const programListAPI = "//miniunit.imbc.com/list/programList";
// const noticeAPI = "//miniunit.imbc.com/Notice"; //rtype=jsonp&callback=notice
const podcastListApi =
  "http://miniunit.imbc.com/list/podcastprogramlist?rtype=jsonp";

// const programKey = "MenuList";

export function getPodcastList() {
  return getData(podcastListApi);
}

export function getSchedule() {
  return getData(onAirScheduleAPI);
}

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
