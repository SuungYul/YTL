import { getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { NaverMap, Marker } from "react-naver-maps";
import { RenderAfterNavermapsLoaded } from "react-naver-maps";
import { Crosswalk } from "../database/data";
import { getPosition, getData, db, getDocs } from "../database/firebase";

const Map = ({ mapLat, mapLng }) => {
  let index = 0;
  const YOUR_CLIENT_ID = "w4msaekuxw";
  const [result, setResult] = useState([]);
  const [totalDB, setTotalDB] = useState([]);
  const [totalPos, setTotalPos] = useState([]);
  const [totalTime, setTotalTime] = useState([]);
  const [isLoad, setLoad] = useState(false);
  const [center, setCenter] = useState({
    lat: mapLat,
    lng: mapLng,
  });
  useEffect(() => {
    index = 0;
    const totalDBPromise = getDocs("crosswalk");
    totalDBPromise.then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (!totalDB.includes(doc.data())) {
          setTotalDB((prevList) => [...prevList, doc.data()]);
        }
      });
    });

    totalDB.forEach((value) => {
      for (let i = 0; i < value.position.length; i++) {
        setTotalPos((prevPos) => [...prevPos, value.position[i]]);
        setTotalTime((prevTime) => [...prevTime, value.duration[i]]);
      }

      // const marker = MakeMarker(value);
      // console.log(marker);
    });
    for (let i = 0; i < totalPos.length; i++, index++) {
      const pos = {
        lat: totalPos[i]._lat,
        lng: totalPos[i]._long,
      };
      const content = {
        content: [
          '<div class="cs_mapbridge">',
          '<div class="map_group _map_group">',
          '<div class="map_marker _marker tvhp tvhp_big">',
          '<span class="ico _icon"></span>',
          '<span class="shd">',
          totalTime[i],
          "</span>",
          "</div>",
          "</div>",
          "</div>",
        ].join(""),
      };
      setResult((prevRes) => [
        ...prevRes,
        <Marker key={index} position={pos} icon={content} />,
      ]);
    }
    console.log(totalPos);
    console.log(totalTime);
    const interval = setInterval(() => {
      setTotalTime(
        totalTime.map((value) => {
          //시발 모르겠다
          return value === 0 ? 180 - value : value - 1;
        })
      );
    }, 1000);
    setLoad(true);

    return () => {
      clearInterval(interval);
    };
  }, []);

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
          defaultZoom={16}
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
