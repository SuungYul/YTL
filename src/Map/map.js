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


const tp = [];

const Map = ({ mapLat, mapLng }) => {
  const YOUR_CLIENT_ID = "w4msaekuxw"
  const [poly, setpoly] = useState([])

  const [route,setroute]=useState({
    lat: 0,
    lng: 0,
  })
  const [route2,setroute2]=useState({
    lat: 0,
    lng: 0,
  })

  const [isModalOpen, setModalOpen] = useState(false);
  const [isFindOpen, setFindOpen] = useState(false);
  const [isHelpOpen, setHelpOpen] = useState(false);
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

    await FindFastRoute(tp, "LeftRoad3", "RightRoad8").then((resolvedData) =>
      shortRoute = resolvedData
    );
    shortTime = shortRoute.time
    shortRoute = shortRoute.visit

    // setroute({ lng: shortRoute[0]._long, lat: shortRoute[0]._lat })
    // setroute2({ lng: shortRoute[1]._long, lat: shortRoute[1]._lat })

    for (let temp = 0; temp < shortRoute.length; temp++) {

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
      temp++
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

    // totalDB2.forEach((data)=>[
    //   roadArray[data.name] = data
    // ])
    // totalDB3.forEach((data)=>[
    //   routeArray[data.name] = data
    // ])
    // console.log(roadArray)

    // totalDB[0].forEach((data)=>{
    //   shortRoute.push()
    // })

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
      const check = CheckGreen(mt[i], t[i], wt[i]);
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
              if (!isFindOpen) {
                // 팝업창이 띄워졌으면 클릭 안되게
                setFindOpen(true);
                setpoly([])
              }

              // await setpoly(s())
              s()
              console.log(poly)
              
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
            {result}
            {/* <Marker
              position={{ lat: mapLat, lng: mapLng }}
              onClick={() => {
                setModalOpen(true);
              }}
            /> */}
            {/* <Marker
              position={{
                lat: "37.230598234139315",
                lng: "127.18792639494912",
              }}
              onClick={() => {
                setModalOpen(true);
              }}
            /> */}
            {/* <Polyline
              path={[
                { lat: mapLat, lng: mapLng },
                { lat: "37.230598234139315", lng: "127.18792639494912" },
              ]}
              strokeColor={"#5347AA"}
              strokeStyle={"solid"}
              strokeOpacity={0.5}
              strokeWeight={5}
            /> */}
            {poly}
            {/* <Polyline
              path={[
                { lat: route.lat, lng: route.lng },
                { lat: route2.lat, lng: route2.lng },
              ]}
              strokeColor={"#5347AA"}
              strokeStyle={"solid"}
              strokeOpacity={0.5}
              strokeWeight={5}
            /> */}
            <PopUp
              isModalOpen={isModalOpen}
              setModalOpen={setModalOpen}
              data={data}
            ></PopUp>
            <FindWay isFindOpen={isFindOpen} setFindOpen={setFindOpen} />;
            <Help isHelpOpen={isHelpOpen} setHelpOpen={setHelpOpen}/>;
          </NaverMap>
        </div>
      </RenderAfterNavermapsLoaded>
    </div>
  ) : (
    "Loading...."
  );
};

export default Map;
