import { createContext, useReducer, useEffect } from "react";
import Reducer from "./reducer";
import { getSchedule, getPodcastList } from "./data";

const data = getSchedule();
const podcasts = getPodcastList();

const INITIAL_STATE = {
  radio_state: JSON.parse(localStorage.getItem("radio_state")) || {
    channel: "mfm",
    promgramList: [],
    isPodcast: false,
    broadcast: null,
    resetBrodcast: true,
  },
  autoplay: false,
  error: false,
};

// console.log(INITIAL_STATE);

data.then((res, err) => {
  if (err) {
    throw Error("Could not load Schedule.");
  } else {
    // res - weekly program of three channels
    INITIAL_STATE.radio_state["schedule"] = res;
  }
});

podcasts.then((res, err) => {
  if (err) console.log(err);
  else {
    INITIAL_STATE.radio_state["podcasts"] = res;
  }
});

export const Context = createContext(INITIAL_STATE);

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem(
      "radio_state",
      JSON.stringify({ ...state.radio_state, broadcast: null })
    );
  });

  return (
    <Context.Provider
      value={{
        radio_state: state.radio_state,
        error: state.error,
        autoplay: state.autoplay,
        dispatch,
      }}
    >
      {children}
    </Context.Provider>
  );
};
