import { getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { NaverMap, Marker } from "react-naver-maps";
import { RenderAfterNavermapsLoaded } from "react-naver-maps";
import FindFastRoute from "../Algorithm/FindFastRoute";
import { Crosswalk } from "../database/data";
import { getPosition, getData, db, getDocs } from "../database/firebase";

const Map = ({ mapLat, mapLng }) => {
  let index = 0;
  
  FindFastRoute("shortRoute","road1","road5")

  const YOUR_CLIENT_ID = "w4msaekuxw";
  const [result, setResult] = useState([]);
  const [totalDB, setTotalDB] = useState([]);
  const [isLoad, setLoad] = useState(false);
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
      const marker = MakeMarker(value);
      console.log(marker);
      setResult((prevResult) => [...prevResult, marker]);
    });
    setLoad(true);
  }, []);

  const MakeMarker = (db) => {
    if (!db) {
      console.log("Not db!");
      return;
    }
    const content = {
      content: [
        '<div class="cs_mapbridge">',
        '<div class="map_group _map_group">',
        '<div class="map_marker _marker tvhp tvhp_big">',
        '<span class="ico _icon"></span>',
        '<span class="shd">',
        db.cycle,
        "</span>",
        "</div>",
        "</div>",
        "</div>",
      ].join(""),
    };

    const markers = [];
    for (let i = 0; i < db.position.length; i++) {
      const pos = {
        // 이새끼 절때 for문 밖으로 내보내지말것
        lat: 0,
        lng: 0,
      };
      pos.lat = db.position[i]._lat;
      pos.lng = db.position[i]._long;
      markers.push(
        <Marker
          key={index++}
          position={pos}
          onClick={() => {
            alert(pos);
          }}
        />
      );
    }
    return markers;
  };
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
          center={{ lat: mapLat, lng: mapLng }}
          defaultZoom={16}
        >
          {result}
          <Marker
            position={{ lat: mapLat, lng: mapLng }}
            onClick={() => {
              alert("여기는 입구입니다");
            }}

            // clickable={true}
          />
        </NaverMap>
      </RenderAfterNavermapsLoaded>
    </>
  ) : (
    "Loading..."
  );
};

export default Map;
