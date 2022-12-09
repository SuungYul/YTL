import { NaverMap, Marker, Polyline, Rectangle } from "react-naver-maps";
import { RenderAfterNavermapsLoaded } from "react-naver-maps";
import { useState, useEffect } from "react";
import { getDocs } from "../database/firebase";
import { displayMarker, showRoute } from "./map";
import calculatedData from "../database/calculatedData";
import { useLocation } from "react-router-dom";
import FindFastRoute from "../Algorithm/FindFastRoute";

const Result = ({ mapLat, mapLng }) => {
  const pointInfo = useLocation();
  const startPoint = pointInfo.state.startPoint;
  const endPoint = pointInfo.state.endPoint;
  const [totalPromise, setPromise] = useState([]);
  const YOUR_CLIENT_ID = "w4msaekuxw";
  const [poly, setPoly] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
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
    // setPromise(tP);
    let loaded = false;

    crosswalkPromise.then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (!totalDB.includes(doc.data())) {
          totalDB.push(doc.data());
        }
      });
    });
    FindFastRoute(tP, "LeftRoad3", "RightRoad10")
    // crosswalkPromise.then((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     if (!totalDB.includes(doc.data())) {
    //       totalDB.push(doc.data());
    //     }
    //     loaded = true;
    //   });
    // });
    // let loaded2 = false;
    // const totalDB2 = [];
    // const totalDB3 = [];
    // roadPromise.then((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     totalDB3.push(doc.data());
    //     if (!totalDB2.includes(doc.data())) {
    //       totalDB2.push(
    //         doc.data().startPoint._lat,
    //         doc.data().startPoint._long
    //       );
    //     }
    //     totalDB3.push(doc.data());
    //     loaded2 = true;
    //   });
    // });
    console.log("result", totalPromise, startPoint, endPoint);
    showRoute(tP, setPoly, startPoint, endPoint);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      showRoute(totalPromise, setPoly, startPoint, endPoint);
    }, 500);

    console.log("result", totalPromise, startPoint, endPoint, poly);
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
          경로 새로고침
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
        </NaverMap>
      </div>
    </RenderAfterNavermapsLoaded>
  );
};

export default Result;
