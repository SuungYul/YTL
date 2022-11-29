import { getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { NaverMap, Marker, Polyline, Rectangle } from "react-naver-maps";
import { RenderAfterNavermapsLoaded } from "react-naver-maps";
import CheckGreen from "../Algorithm/CheckGreen";
import FindFastRoute from "../Algorithm/FindFastRoute";
import { Crosswalk } from "../database/data";
import { getPosition, getData, db, getDocs } from "../database/firebase";
import {PopUp} from "./modal";

function hi(){
  return(
    <h1>111</h1>
    
   )
}
function ControlBtn({
  controlOn = false,

}) {
  let style = {
    margin: 0,
    color: '#555',
    padding: '2px 6px',
    background: '#fff',
    border: 'solid 1px #333',
    cursor: 'pointer',
    borderRadius: '5px',
    outline: '0 none',
    boxShadow: '2px 2px 1px 1px rgba(0, 0, 0, 0.5)',
    fontSize: '14px',
    margin: '0 5px 5px 0',
  }

  if (controlOn) {
    style = {
      ...style,
      background: '#2780E3',
      color: '#FFF',
    }
  }

  return <button style={style}  />
}

/**
 * Buttons
 * 예시에서는 생략되어있다. .buttons 에 해당한다.
 */
function Buttons() {
  return (
    <div 
      style={{ 
        zIndex: 1000, 
        position: 'absolute', 
        display: 'inline-block',
      }}
    />
  )
}




const Map = ({ mapLat, mapLng }) => {

  const YOUR_CLIENT_ID = "w4msaekuxw"

  const [isModalOpen, setModalOpen] = useState(false);
  const [result, setResult] = useState([]);
  const [isLoaded, setLoad] = useState(false);
  const [center, setCenter] = useState({
    lat: mapLat,
    lng: mapLng,
  });
  let interval;

  
  //FindFastRoute("shortRoute", "road1", "road5");
  useEffect(() => {

    const totalDBPromise = getDocs("crosswalk");
    let loaded = false;
    const totalDB = [];
    totalDBPromise.then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (!totalDB.includes(doc.data())) {
          totalDB.push(doc.data());
        }
        loaded = true;
      });
    });





    interval = setInterval(() => {
      if (loaded) setResult(displayMarker(totalDB));
    }, 1000);

  
  }, []);
  
  useEffect(() => {
    
    setLoad(true);
    return () => {
      console.log(">>>>>>>>>>>>>>>>>before clear interval");
      
      clearInterval(interval);
    };
  }, []);



  function displayMarker(totalDB) {
    let index = 0;
    let p = []; // db doc안에 모든 position 좌표
    let t = []; // db doc안에 모든 duration 시간 근데 얘는 변화가 될수도?
    let time = []; // 일단 임시로 두개 받음
    let isGreen = []; // 지금 초록불인지 이것도 필요없을듯
    let mt = []; //measureTime 가져옴
    let wt = []; //waitingTime 가져옴
  
    totalDB.forEach((value) => {
      for (let i = 0; i < value.position.length; i++) {
        p.push(value.position[i]);
  
        t.push(value.duration[i]);
        time.push(value.duration[i]);
        isGreen.push(true);
        mt.push(value.measureTime);
        wt.push(value.waitingTime[i]);
      }
    });
  
    
  
    const r = [];
    for (let i = 0; i < t.length; i++) {
      const check = CheckGreen(mt[i], t[i], wt[i]);
      r.push(
        
        <Marker
          key={index++}
          position={{
            lat: p[i]._lat,
            lng: p[i]._long,
          }}
          icon={{
            content:
              '<div class="cs_mapbridge" style="background-color:' +
              check.currentSign +
              ';">' +
              '<div class="map_group _map_group">' +
              '<div class="map_marker _marker tvhp tvhp_big">' +
              '<span class="ico _icon"></span>' +
              '<span class="shd">' +
              check.leftTime +
              "</span>" +
              "</div>" +
              "</div>" +
              "</div>",
          }}
                 
          onClick={() => {
            setModalOpen(true)
          }}
        />
        
      );
    }
  
    return r;
  }
  
  // console.log(result);
  return isLoaded ? (
    <>
      <RenderAfterNavermapsLoaded
        ncpClientId={YOUR_CLIENT_ID}
        error={<p>Maps Load Error</p>}
        loading={<p>Maps Loading...</p>}
      >
        <NaverMap
          id="react-naver-maps"
          style={{ width: "100%", height: "100vh" }}
          center={center}
          //onCenterChanged={(center) => setCenter({ center })}
          defaultZoom={17}
        >
          {result}          
          <Marker
            position={{ lat: mapLat, lng: mapLng }}
            onClick={() => {
              setModalOpen(true)
            }}
            
          />
          <Marker
            position={{  lat: "37.230598234139315", lng: "127.18792639494912"  }}
            onClick={() => {
              setModalOpen(true)
            }}
          />
          <Marker
            onClick={() => {
              alert("여기는 입구입니다");
            }}
          />

          <Polyline 
            path={[
              {  lat: mapLat, lng: mapLng  },
              {  lat: "37.230598234139315", lng: "127.18792639494912"  },
              
            ]}
            strokeColor={'#5347AA'}
            strokeStyle={'longdash'}
            strokeOpacity={0.5}
            strokeWeight={5}               
          />
          <PopUp isModalOpen={isModalOpen} setModalOpen={setModalOpen} ></PopUp>  
        </NaverMap>
        <Buttons>
            <ControlBtn
              controlOn={true}
            >길잧기</ControlBtn>
          </Buttons>
      </RenderAfterNavermapsLoaded>
    </>
  ) : (
    "Loading...."
  );
};


export default Map;


function displayMarker(totalDB) {
  let index = 0;
  let p = []; // db doc안에 모든 position 좌표
  let t = []; // db doc안에 모든 duration 시간 근데 얘는 변화가 될수도?
  let time = []; // 일단 임시로 두개 받음
  let isGreen = []; // 지금 초록불인지 이것도 필요없을듯
  let mt = []; //measureTime 가져옴
  let wt = []; //waitingTime 가져옴


  totalDB.forEach((value) => {
    for (let i = 0; i < value.position.length; i++) {
      p.push(value.position[i]);
      t.push(value.duration[i]);
      time.push(value.duration[i]);
      isGreen.push(true);
      mt.push(value.measureTime);
      wt.push(value.waitingTime[i]);
    }
  });
  
  const r = [];
  for (let i = 0; i < t.length; i++) {
    const check = CheckGreen(mt[i], t[i], wt[i]);
    r.push(
      <Marker
        key={index++}
        position={{
          lat: p[i]._lat,
          lng: p[i]._long,
        }}
        icon={{
          content:
            '<div class="cs_mapbridge" style="background-color:' +
            check.currentSign +
            ';">' +
            '<div class="map_group _map_group">' +
            '<div class="map_marker _marker tvhp tvhp_big">' +
            '<span class="ico _icon"></span>' +
            '<span class="shd">' +
            check.leftTime +
            "</span>" +
            "</div>" +
            "</div>" +
            "</div>",
        }}
        onClick={() => {
          alert("click");
        }}
      />
    );
  }

  return r;
}
