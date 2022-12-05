import { getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { NaverMap, Marker, Polyline, Rectangle } from "react-naver-maps";
import { RenderAfterNavermapsLoaded } from "react-naver-maps";
import CheckGreen from "../Algorithm/CheckGreen";
import FindFastRoute from "../Algorithm/FindFastRoute";
import calculatedData from "../database/calculatedData";
import { Crosswalk } from "../database/data";
import { getPosition, getData, db, getDocs } from "../database/firebase";
import { FindWay, PopUp } from "./modal";
import "./map.css";
import AlgorithmData from "../database/AlgorithmData";


const tp = [];

const Map = ({ mapLat, mapLng }) => {
  const YOUR_CLIENT_ID = "w4msaekuxw"
  const [poly, setpoly] = useState([])
  const [startPoint, setstartPoint] = useState([])

  const [route, setroute] = useState({
    lat: 0,
    lng: 0,
  })
  const [route2, setroute2] = useState({
    lat: 0,
    lng: 0,
  })

  const [isModalOpen, setModalOpen] = useState(false);
  const [isFindOpen, setFindOpen] = useState(false);
  const [result, setResult] = useState([]);
  const [isLoaded, setLoad] = useState(false);
  const [data, setData] = useState(new calculatedData());
  const [center, setCenter] = useState({
    lat: mapLat,
    lng: mapLng,
  });
  const [now, setNow] = useState(new Date());
  let interval;

  //FindFastRoute("shortRoute", "road1", "road5");
  useEffect(() => {
    const totalDBPromise = getDocs("crosswalk");
    const roadPromise = getDocs("Road");
    const shortRoutePromise = getDocs("shortRoute");

    tp.push(shortRoutePromise, roadPromise);

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

    let loaded2 = false;
    const totalDB2 = [];
    roadPromise.then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (!totalDB2.includes(doc.data())) {
          totalDB2.push(doc.data().startPoint._lat,doc.data().startPoint._long);
        }
        loaded2 = true;
      });
      setstartPoint(totalDB2)
    });
    console.log(totalDB2)

    interval = setInterval(() => {
      if (loaded) setResult(displayMarker(totalDB));
      setNow(new Date());
    }, 1000);
  }, []);

  useEffect(() => {
    setLoad(true);
    return () => {
      console.log(">>>>>>>>>>>>>>>>>before clear interval");

      clearInterval(interval);
    };
  }, []);

  async function s() {
    let shortRoute = []
    let shortTime = 0
    let out = []
    await setpoly([])
    // useEffect(async () => {

    await FindFastRoute(tp, "RightRoad3", "LeftRoad9").then((resolvedData) =>
      shortRoute = resolvedData
    );
    shortTime = shortRoute.time
    shortRoute = shortRoute.visit

    // setroute({ lng: shortRoute[0]._long, lat: shortRoute[0]._lat })
    // setroute2({ lng: shortRoute[1]._long, lat: shortRoute[1]._lat })

    for (let temp = 0; temp < shortRoute.length; temp+=2) {

      out.push(
        <Polyline
          path={[
            { lat: shortRoute[temp]._lat, lng: shortRoute[temp]._long },
            { lat: shortRoute[temp + 1]._lat, lng: shortRoute[temp + 1]._long },
          ]}
          strokeColor={"#5347AA"}
          strokeStyle={"solid"}
          strokeOpacity={0.5}
          strokeWeight={5}
        />
      )
      
      // console.log(out)
    }
    console.log(out)
    await setpoly(out)
    console.log(poly)
    return out
    // }, []);

  }

  function displayMarker(totalDB) {
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

  // console.log(result);
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
              if (!isModalOpen) {
                // 팝업창이 띄워졌으면 클릭 안되게
                setFindOpen(true);

                setpoly([])
              }

              s()

              // await setpoly(s())

              console.log(startPoint)

            }}
          >
            <p className="direction">↱</p>
            <p className="findWay">길찾기</p>
          </button>
          <NaverMap
            id="react-naver-maps"
            style={{ width: "100%", height: "100vh" }}
            center={center}
            //onCenterChanged={(center) => setCenter({ center })}
            defaultZoom={17}
            zIndex={0}
          >
            {result}

            {poly}

            <PopUp
              isModalOpen={isModalOpen}
              setModalOpen={setModalOpen}
              data={data}
            ></PopUp>
            <FindWay isFindOpen={isFindOpen} setFindOpen={setFindOpen} />;
          </NaverMap>
        </div>
      </RenderAfterNavermapsLoaded>
    </div>
  ) : (
    "Loading...."
  );
};

export default Map;
