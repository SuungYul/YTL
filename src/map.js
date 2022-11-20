import { NaverMap, Marker } from 'react-naver-maps';
import { RenderAfterNavermapsLoaded } from 'react-naver-maps'; 

const NaverMapView =({mapLat, mapLng})=> {
        return (
        <>
            <RenderAfterNavermapsLoaded	   // render 후 지도 호출(비동기 랜더링)
                ncpClientId={''} // 지도서비스 Client ID
                error={<p>error</p>}
                loading={<p>Maps Loading</p>}
                submodules={["geocoder"]} //추가로 사용할 서브모듈이 있는경우
            >
                <NaverMap
                    id="react-naver-maps"
                    style={{ width: '100%', height: '100vh' }}
                    center={{ lat: mapLat, lng: mapLng }}
                >
                    <Marker 
                        position={{ lat: mapLat, lng: mapLng }}
                        onClick={() => {alert('여기는 입구입니다');}}/>
                    <Marker
                        key={1} 
                        position={{ lat: "37.22569444285153", lng: "127.18782971740504" }}
                        onClick={() => {alert('여기는 출구입니다');}}/>
                    <Marker
                        key={2} 
                        position={{ lat:  "37.22571198084671", lng: "127.18813399309757" }}/>
                    <Marker 
                        key={3} 
                        position={{ lat: "37.225964335559695", lng: "127.1880951823308" }}/>
                    <Marker
                        key={4} 
                        position={{ lat: "37.22569277635071", lng: "127.18887762390214" }}/>
                    <Marker
                        key={5} 
                        position={{ lat:  "37.22589549307626", lng: "127.18888939734437" }}/>
                    <Marker
                        key={6} 
                        position={{ lat: "37.22753769618638", lng: "127.1874427214351"  }}/>
                    <Marker
                        key={7} 
                        position={{ lat:  "37.22771113356646", lng: "127.18745160183114"  }}/>
                    <Marker
                        key={8} 
                        position={{ lat: "37.22783728848431", lng: "127.1874462800085" }}/>
                    <Marker
                        key={9} 
                        position={{ lat:  "37.227408811214595", lng: "127.18774945847515"   }}/>
                    <Marker
                        key={10} 
                        position={{ lat:   "37.227602553297714", lng: "127.18773867065251"  }}/>
                    <Marker
                        key={11} 
                        position={{ lat: "37.22773316878744", lng: "127.18776153077239"  }}/>                    
                </NaverMap>
            </RenderAfterNavermapsLoaded>
        </>
    )
}

export default NaverMapView;