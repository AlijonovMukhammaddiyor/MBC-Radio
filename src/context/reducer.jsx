const Reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_CHANNEL":
      return {
        radio_state: { ...state.radio_state, channel: action.payload },
        error: false,
        autoplay: action.autoplay,
      };
    case "PODCAST_ON":
      return {
        radio_state: { ...state.radio_state, isPodcast: true },
        error: false,
        autoplay: state.autoplay,
      };
    case "PODCAST_OFF":
      return {
        radio_state: { ...state.radio_state, isPodcast: false },
        error: false,
        autoplay: state.autoplay,
      };
    case "SET_BROADCAST":
      return {
        radio_state: {
          ...state.radio_state,
          broadcast: action.broadcast,
          resetBrodcast: action.reset,
        },
        error: false,
        autoplay: action.autoplay,
      };
    default:
      return state;
  }
};

export default Reducer;
