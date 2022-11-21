import { getDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { NaverMap, Marker } from 'react-naver-maps';
import { RenderAfterNavermapsLoaded } from 'react-naver-maps';
import { Crosswalk } from './database/data';
import { getPosition, getData } from './database/firebase';

export class Map extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            center:{
                lat: props.mapLat,
                lng: props.mapLng,
            },
            time: 40,
        }
    }
    componentDidMount(){ // 홈페이지가 구동될 때
        this.timer = setInterval(()=> this.upTime(),1000)
    }
    componentWillUnmount(){
        clearInterval(this.timer)
    }

    upTime(){ // time을 1씩 증가시킴
        this.setState({
            time: this.state.time+1
        })
    }
    makeMarker(){ //마크 찍기
        const position ={
            lat:37.236067,
            lng:127.18915,
        }
        // console.log(doc.position);
        const content = {
            content: [
                '<div class="cs_mapbridge">',
                    '<div class="map_group _map_group">',
                        '<div class="map_marker _marker tvhp tvhp_big">',
                            '<span class="ico _icon"></span>',
                            '<span class="shd">',this.state.time,'</span>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join(''),}
        return(
            <Marker
                // position={doc.position}
                position={position}
                icon={content}
            />
        )
    }

    // getFromFirebase(document){
    //     const db = getData("crosswalk", document, Crosswalk)
    //     db.then((doc)=>{
    //         console.log(doc.position);
            
    //         for(let i=0;i<doc.position.length;i++){
    //             console.log("test");
    //             this.makeMarker(doc)
    //         }
    //     })
    // }

    render() {
        return (
          <div>
            <p>lat: {this.state.center.y || this.state.center.lat}</p>
            <p>lng: {this.state.center.x || this.state.center.lng}</p>
            <NaverMap 
              id="react-naver-maps-introduction"
              style={{width: '100%', height: '400px'}}
    
              center={this.state.center}
              onCenterChanged={center => this.setState({ center })}
            >
                
            {/* {this.getFromFirebase("mjuIntersection")} */}
            {this.makeMarker()}
            </NaverMap>
            
          </div>
        )
      }
}

// const NaverMapView = ({ mapLat, mapLng }) => {

//     const db = getData("crosswalk", "frontStation", Crosswalk);
//     // const doc = getDocs("crosswalk")
//     // const [posArray, setPosArray] = useState([]);
//     // const [posX, setPosX] = useState();
//     // const [posY, setPosY] = useState();

//     getPosition("crosswalk", "frontStation").then((querySnapshot) => {
//         console.log(querySnapshot);
//     })
//     db.then((doc) => {
//         console.log(doc.position);
//     })

    
//     const test = new NaverMap.
//     return (
//         <>
//             <RenderAfterNavermapsLoaded	   // render 후 지도 호출(비동기 랜더링)
//                 ncpClientId={'w4msaekuxw'} // 지도서비스 Client ID
//                 error={<p>error</p>}
//                 loading={<p>Maps Loading</p>}
//                 submodules={["geocoder"]} //추가로 사용할 서브모듈이 있는경우
//             >
//                 <NaverMap
//                     id="react-naver-maps"
//                     style={{ width: '100%', height: '100vh' }}
//                     center={{ lat: mapLat, lng: mapLng }}
//                     defaultZoom={16}
//                 >
//                     <Marker
//                         position={{ lat: mapLat, lng: mapLng }}
//                         onClick={() => { alert('여기는 입구입니다'); }}

//                     // clickable={true}
//                     />
//                     {makeMarker(map, new naver.maps.LatLng('37.236067', '127.18915'), 0)}
//                     <Marker
//                         key={1}
//                         position={{ lat: "37.22569444285153", lng: "127.18782971740504" }}
//                         onClick={() => { alert('여기는 출구입니다'); }}
//                         clickable={true} />
//                     <Marker
//                         key={2}
//                         position={{ lat: "37.22571198084671", lng: "127.18813399309757" }} />
//                     <Marker
//                         key={3}
//                         position={{ lat: "37.225964335559695", lng: "127.1880951823308" }} />
//                     <Marker
//                         key={4}
//                         position={{ lat: "37.22569277635071", lng: "127.18887762390214" }} />
//                     <Marker
//                         key={5}
//                         position={{ lat: "37.22589549307626", lng: "127.18888939734437" }} />
//                     <Marker
//                         key={6}
//                         position={{ lat: "37.22753769618638", lng: "127.1874427214351" }} />
//                     <Marker
//                         key={7}
//                         position={{ lat: "37.22771113356646", lng: "127.18745160183114" }} />
//                     <Marker
//                         key={8}
//                         position={{ lat: "37.22783728848431", lng: "127.1874462800085" }} />
//                     <Marker
//                         key={9}
//                         position={{ lat: "37.227408811214595", lng: "127.18774945847515" }} />
//                     <Marker
//                         key={10}
//                         position={{ lat: "37.227602553297714", lng: "127.18773867065251" }} />
//                     <Marker
//                         key={11}
//                         position={{ lat: "37.22773316878744", lng: "127.18776153077239" }} />
//                 </NaverMap>
//             </RenderAfterNavermapsLoaded>
//         </>
//     )
// }

// export default NaverMapView;

// function makeMarker(map, position, index) {

//     var ICON_GAP = 31;
//     var iconSpritePositionX = (index * ICON_GAP) + 1;
//     var iconSpritePositionY = 1;

//     let marker = new naver.maps.Marker({
//         map: map,
//         position: position,
//         icon: {
//             size: new naver.maps.Size(26, 36), // 이미지 크기
//             origin: new naver.maps.Point(iconSpritePositionX, iconSpritePositionY), // 스프라이트 이미지에서 클리핑 위치
//             anchor: new naver.maps.Point(13, 36), // 지도상 위치에서 이미지 위치의 offset
//             scaledSize: new naver.maps.Size(395, 79)
//         }
//     });

//     return marker;
// }

