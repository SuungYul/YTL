import NaverMapView from "./map";

const App =()=>{ 
	let mapLat = "37.23229";
	let mapLng = "127.188205";
    return(
        <div className="row mt-1" style={{height: "300px;"}}>
            <NaverMapView mapLat={mapLat} mapLng={mapLng}></NaverMapView>
        </div>       
    );    
}
    
export default App;








