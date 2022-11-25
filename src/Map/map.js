import { getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { NaverMap, Marker } from "react-naver-maps";
import { RenderAfterNavermapsLoaded } from "react-naver-maps";
import CheckGreen from "../Algorithm/CheckGreen";
import FindFastRoute from "../Algorithm/FindFastRoute";
import { Crosswalk } from "../database/data";
import { getPosition, getData, db, getDocs } from "../database/firebase";

const Map = ({ mapLat, mapLng }) => {
  //FindFastRoute("shortRoute", "road1", "road5");

  const YOUR_CLIENT_ID = "w4msaekuxw";
  const [result, setResult] = useState([]);
  const [totalDB, setTotalDB] = useState([]);

  const [isLoad, setLoad] = useState(false);
  const [center, setCenter] = useState({
    lat: mapLat,
    lng: mapLng,
  });
  useEffect(() => {
    let index = 0;
    let p = []; // db doc안에 모든 position 좌표
    let t = []; // db doc안에 모든 duration 시간 근데 얘는 변화가 될수도?
    let time = []; // 일단 임시로 두개 받음
    let isGreen = []; // 지금 초록불인지 이것도 필요없을듯
    let mt = []; //measureTime 가져옴
    let wt = []; //waitingTime 가져옴
    setTimeout(() => {
      const totalDBPromise = getDocs("crosswalk");

      totalDBPromise.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (!totalDB.includes(doc.data())) {
            setTotalDB((prevList) => [...prevList, doc.data()]);
          }
        });
      });
      console.log(totalDB);
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
    }, 500); //0.5초 기다려서 db 받는거 기다림 이렇게 해도 컴파일시 실행안되는거는 똑같은듯

    const interval = setInterval(() => {
      const r = [];
      for (let i = 0; i < t.length; i++) {
        console.log(mt[i], t[i], wt[i]);
        const check = CheckGreen(mt[i], t[i], wt[i]);
        console.log(check.currentSign, check.leftTime)
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
          />
        );
      }
      setResult(r);
      console.log(t);
    }, 1000); //1초씩 마커 변화
    setLoad(true);

    return () => {
      clearInterval(interval);
    };
  }, []);
  // console.log(result);
  return isLoad ? (
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
              alert("여기는 입구입니다");
            }}
          />
        </NaverMap>
      </RenderAfterNavermapsLoaded>
    </>
  ) : (
    "Loading...."
  );
};

export default Map;
