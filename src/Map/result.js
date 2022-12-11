import { NaverMap, Marker, Polyline, Rectangle } from "react-naver-maps";
import { RenderAfterNavermapsLoaded } from "react-naver-maps";
import { useState, useEffect } from "react";
import { getDocs } from "../database/firebase";
import { displayMarker, showMark, showRoute } from "./map";
import calculatedData from "../database/calculatedData";
import { useLocation } from "react-router-dom";

import "./result.css";

const Result = ({ mapLat, mapLng }) => {
  const pointInfo = useLocation();
  const startPoint = pointInfo.state.startPoint;
  const endPoint = pointInfo.state.endPoint;
  const [totalPromise, setPromise] = useState([]);
  const YOUR_CLIENT_ID = "w4msaekuxw";
  const [poly, setPoly] = useState([]);
  const [mark, setMark] = useState([]);
  const [shortTime, setShortTime] = useState();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpen2, setModalOpen2] = useState(false);
  const [now, setNow] = useState(new Date());

  const [result, setResult] = useState([]);

  const [data, setData] = useState(new calculatedData());
  const [center, setCenter] = useState({
    lat: mapLat,
    lng: mapLng,
  });
  let interval;
  let totalDB = [];

  useEffect(() => {
    totalDB = [];
    const crosswalkPromise = getDocs("crosswalk");
    const roadPromise = getDocs("Road");
    const shortRoutePromise = getDocs("shortRoute");
    const tP = [];
    tP.push(shortRoutePromise, roadPromise);

    setPromise(tP);

    crosswalkPromise.then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (!totalDB.includes(doc.data())) {
          totalDB.push(doc.data());
        }
      });
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      showRoute(
        totalPromise,
        setPoly,
        startPoint,
        endPoint,
        setShortTime,
        setModalOpen2
      );
      showMark(totalPromise, setMark, startPoint, endPoint);
    }, 1000);
    console.log("result", totalPromise, startPoint, endPoint, poly, shortTime);
  }, [totalPromise]);

  useEffect(() => {
    interval = setInterval(() => {
      // console.log(crMarkerVisible);
      setResult(displayMarker(totalDB, setModalOpen, setData, true));

      setNow(new Date());
    }, 1000);
    return () => {
      console.log(">>>>>>>>>>>>>>>>>before clear interval");

      clearInterval(interval);
    };
  }, []);

  return (
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
          className="toMainBtn"
          onClick={() => {
            window.location.replace("/");
          }}
        >
          메인으로
        </button>
        <button
          className="refreshBtn"
          onClick={() => {
            window.location.replace("/result");
          }}
        >
          {"경로\n새로고침"}
        </button>
        <div className="routueinfo">
          <p className="routetime">
            {shortTime !== undefined
              ? "소요 시간 " +
                parseInt(shortTime / 60) +
                "분 " +
                parseInt(shortTime % 60) +
                "초"
              : "계산 중 입니다..."}
          </p>
        </div>
        <NaverMap
          id="react-naver-maps"
          style={{ width: "100%", height: "100vh" }}
          center={center}
          //onCenterChanged={(center) => setCenter({ center })}
          defaultZoom={17}
          zIndex={0}
        >
          <div className="routueinfo">
            <p className="routetime">
              {shortTime !== undefined
                ? "소요 시간 " +
                  parseInt(shortTime / 60) +
                  "분 " +
                  parseInt(shortTime % 60) +
                  "초"
                : "계산 중 입니다..."}
            </p>
          </div>
          {result}
          {mark}
          {poly}
        </NaverMap>
      </div>
    </RenderAfterNavermapsLoaded>
  );
};

export default Result;
