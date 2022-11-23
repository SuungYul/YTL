import Map from "./Map/map";
import { RenderAfterNavermapsLoaded } from "react-naver-maps";
const App = () => {
  let mapLat = "37.23229";
  let mapLng = "127.188205";

  return (
    <div className="row mt-1">
      <Map mapLat={mapLat} mapLng={mapLng} />
    </div>
  );
};

export default App;
