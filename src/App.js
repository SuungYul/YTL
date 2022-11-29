import Map from "./Map/map";
import { RenderAfterNavermapsLoaded } from "react-naver-maps";
import FindFastRoute from "./Algorithm/FindFastRoute";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const App = () => {
  let mapLat = "37.23229";
  let mapLng = "127.188205";
  const [isLoad, setLoad] = useState(false);
  FindFastRoute('q','road1','road5')
  useEffect(() => {
    setLoad(true);
  });

  return isLoad ? (
    <div className="row mt-1">
      <Router>
        <Routes>
          <Route path="/" element={<Map mapLat={mapLat} mapLng={mapLng} />} />
        </Routes>
      </Router>
    </div>
  ) : (
    "Loading..."
  );
};

export default App;
