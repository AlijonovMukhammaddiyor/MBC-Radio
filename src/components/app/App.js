import React from "react";
import Top from "../top/Top";
import Message from "../messages/Message";
import Podcast from "../podcast/Podcast";
import { Route, Routes, HashRouter } from "react-router-dom";

function App() {
  return (
    <HashRouter>
      <Top />
      <Routes>
        <Route exact path="/" element={<Message />} />
        <Route exact path="/podcast" element={<Podcast />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
