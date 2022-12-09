import { getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { NaverMap, Marker, Polyline, Rectangle } from "react-naver-maps";
import { RenderAfterNavermapsLoaded } from "react-naver-maps";
import CheckGreen from "../Algorithm/CheckGreen";
import FindFastRoute from "../Algorithm/FindFastRoute";
import calculatedData from "../database/calculatedData";
import { Crosswalk } from "../database/data";
import { getPosition, getData, db, getDocs } from "../database/firebase";
import { FindWay, PopUp, Help } from "./modal";
import "./map.css";
import AlgorithmData from "../database/AlgorithmData";
import { log } from "react-modal/lib/helpers/ariaAppHider";

const Map = ({ mapLat, mapLng }) => {
  const YOUR_CLIENT_ID = "w4msaekuxw";

  const [isStart, setStart] = useState(false);
  const [isEnd, setEnd] = useState(false);
  const [point, setPoint] = useState(null);

  const [crMarkerVisible, setCRVisible] = useState(true);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isFindOpen, setFindOpen] = useState(false);
  const [isHelpOpen, setHelpOpen] = useState(false);
  const [result, setResult] = useState([]);
  const [lightResult, setLight] = useState([]);
  const [lightLoad, setLightLoad] = useState(false);

  const [isLoaded, setLoad] = useState(false);
  const [data, setData] = useState(new calculatedData());
  const [center, setCenter] = useState({
    lat: mapLat,
    lng: mapLng,
  });
  const [now, setNow] = useState(new Date());
  let interval;
  let totalDB = [];
  //FindFastRoute("shortRoute", "road1", "road5");
  useEffect(() => {
    totalDB = [];
    const crosswalkPromise = getDocs("crosswalk");
    const roadPromise = getDocs("Road");

    crosswalkPromise.then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (!totalDB.includes(doc.data())) {
          totalDB.push(doc.data());
        }
      });
    });
    const totalDB2 = [];
    roadPromise.then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        totalDB2.push(doc.data());
      });
    });
    console.log(totalDB2);
    if (!crMarkerVisible) {
      setResult(displayMarker(totalDB, setModalOpen, setData, crMarkerVisible));
      lightMarker(
        totalDB2,
        !crMarkerVisible,
        setLight,
        setFindOpen,
        setPoint,
        isStart,
        isEnd,
        setLightLoad
      );
      console.log("lightResult", lightResult);
    }
    console.log("crMarkerVisible", crMarkerVisible);
  }, [crMarkerVisible, lightLoad]);

  useEffect(() => {
    interval = setInterval(() => {
      if (crMarkerVisible)
        setResult(
          displayMarker(totalDB, setModalOpen, setData, crMarkerVisible)
        );

      setNow(new Date());
    }, 1000);
    setLoad(true);
    return () => {
      console.log(">>>>>>>>>>>>>>>>>before clear interval");

      clearInterval(interval);
    };
  }, [crMarkerVisible]);

  return isLoaded ? (
    <div className="naverMap">
      <RenderAfterNavermapsLoaded
        ncpClientId={YOUR_CLIENT_ID}
        error={<p>Maps Load Error</p>}
        loading={<p>Maps Loading...</p>}
      >
        <div className="map">
          <div className="info">
            <p className="info-project">YTL Project</p>
            <p className="info-time">{now.toLocaleString()}</p>
          </div>
          <button
            className="findWayBtn"
            onClick={async () => {
              if (!isFindOpen) {
                // 팝업창이 띄워졌으면 클릭 안되게
                setFindOpen(true);
              }
            }}
          >
            <p className="direction">↱</p>
            <p className="findWay">길찾기</p>
          </button>
          <button
            className="helpBtn"
            onClick={async () => {
              if (!isFindOpen) {
                // 팝업창이 띄워졌으면 클릭 안되게
                setHelpOpen(true);
              }
            }}
          >
            <p className="qMark">?</p>
            <p>도움말</p>
          </button>
          <NaverMap
            id="react-naver-maps"
            style={{ width: "100%", height: "100vh" }}
            center={center}
            //onCenterChanged={(center) => setCenter({ center })}
            defaultZoom={17}
            zIndex={0}
          >
            {crMarkerVisible && result}
            {!crMarkerVisible && lightResult}
            <PopUp
              isModalOpen={isModalOpen}
              setModalOpen={setModalOpen}
              data={data}
            ></PopUp>
            <FindWay
              isFindOpen={isFindOpen}
              setFindOpen={setFindOpen}
              setPoint={setPoint}
              point={point}
              setCRVisible={setCRVisible}
              setStart={setStart}
              setEnd={setEnd}
              isStart={isStart}
              isEnd={isEnd}
            />
            <Help isHelpOpen={isHelpOpen} setHelpOpen={setHelpOpen} />;
          </NaverMap>
        </div>
      </RenderAfterNavermapsLoaded>
    </div>
  ) : (
    "Loading...."
  );
};

export default Map;

export function displayMarker(totalDB, setModalOpen, setData, crMarkerVisible) {
  let index = 0;
  let p = []; // db doc안에 모든 position 좌표
  let t = []; // db doc안에 모든 duration 시간 근데 얘는 변화가 될수도?
  let time = []; // 일단 임시로 두개 받음
  let isGreen = []; // 지금 초록불인지 이것도 필요없을듯
  let mt = []; //measureTime 가져옴
  let wt = []; //waitingTime 가져옴
  let name = [];

  totalDB.forEach((value) => {
    for (let i = 0; i < value.position.length; i++) {
      p.push(value.position[i]);

      t.push(value.duration[i]);
      time.push(value.duration[i]);
      isGreen.push(true);
      mt.push(value.measureTime);
      wt.push(value.waitingTime[i]);
      name.push(value.name);
    }
  });

  const r = [];
  for (let i = 0; i < t.length; i++) {
    const check = CheckGreen(mt[i], t[i], wt[i], 0, 0);
    check.name = name[i];
    check.measureTime = mt[i];
    r.push(
      <Marker
        key={index++}
        visible={crMarkerVisible}
        position={{
          lat: p[i]._lat,
          lng: p[i]._long,
        }}
        icon={{
          content:
            '<div class="cs_mapbridge" style="background-color:' +
            check.currentSign +
            "; border-radius: 50%; width: 30px; height: 30px; text-align: center; justify-content: center; align-items: center; display: flex;" +
            ' border: 1.5px solid black">' +
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
          setModalOpen(true);
          setData(check);
        }}
      />
    );
  }

  return r;
}

function lightMarker( //신호등 마커 근데 사실 길 시작과 끝이라서 길 마커임
  totalDB3,
  crMarkerVisible,
  setLight,
  setFindOpen,
  setPoint,
  isStart,
  isEnd,
  setLightLoad
) {
  let index = 0;
  let pos = []; // db doc안에 모든 position 좌표
  let name = [];
  const r = [];
  console.log("here is light marker");
  console.log("totalDB3", totalDB3);
  setTimeout(() => {
    totalDB3.forEach((value) => {
      // console.log("----------", value);
      // console.log(value.startPoint, value.endPoint);
      pos.push(value.startPoint, value.endPoint);
      name.push(value.name, value.name);
    });
    console.log("pos", pos);
    console.log("visible", crMarkerVisible);

    for (let i = 0; i < pos.length; i++) {
      r.push(
        <Marker
          key={index++}
          visible={crMarkerVisible}
          position={{
            lat: pos[i]._lat,
            lng: pos[i]._long,
          }}
          onClick={() => {
            alert(name[i]);

            if (isStart) {
              setPoint(name[i]);
            } else if (isEnd) {
              setPoint(name[i]);
            } else {
              alert("Error! 출발 또는 목적 버튼을 클릭 후 선택해주세요");
            }
            setFindOpen(true);
          }}
        />
      );
    }
    console.log("r", r);
    setLight(r);
    setLightLoad(true);
  }, 500);
}

export async function showRoute(totalPromise, setPoly, startPoint, endPoint) {
  if (totalPromise.length === 0) return;
  let shortRoute = [];
  let shortTime = 0;
  let out = [];
  setPoly([]);
  console.log(totalPromise);
  shortRoute = await FindFastRoute(totalPromise, startPoint, endPoint);

  shortTime = shortRoute.time;
  shortRoute = shortRoute.visit;
  console.log("showRoute", shortRoute);
  // setroute({ lng: shortRoute[0]._long, lat: shortRoute[0]._lat })
  // setroute2({ lng: shortRoute[1]._long, lat: shortRoute[1]._lat })

  for (let temp = 0; temp < shortRoute.length; temp += 2) {
    out.push(
      <Polyline
        key={temp}
        path={[
          { lat: shortRoute[temp]._lat, lng: shortRoute[temp]._long },
          { lat: shortRoute[temp + 1]._lat, lng: shortRoute[temp + 1]._long },
        ]}
        strokeColor={"#5347AA"}
        strokeStyle={"solid"}
        strokeOpacity={0.5}
        strokeWeight={5}
      />
    );

    // console.log(out)
  }
  console.log(out);
  setPoly(out);
}
