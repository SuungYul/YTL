import { Map } from "./map";
import { RenderAfterNavermapsLoaded } from 'react-naver-maps';
const App = () => {
    let mapLat = "37.23229";
    let mapLng = "127.188205";
    const YOUR_CLIENT_ID = "w4msaekuxw"
    return (
        <div className="row mt-1" style={{ height: "300px;" }}>
            <RenderAfterNavermapsLoaded ncpClientId={YOUR_CLIENT_ID}>
                <Map mapLat={mapLat} mapLng={mapLng} />
            </RenderAfterNavermapsLoaded>
        </div>
    );
}

export default App;








