import { Crosswalk } from "../database/data";
import firebase from "firebase/app";
import "firebase/firestore";
import CheckGreen from "./CheckGreen";
import { getDocs } from "../database/firebase";
import { useEffect } from "react";
import AlgorithmData from "../database/AlgorithmData";

let lasttime = 10000000;
let lastRoute = [];

function dfs(
  roadArray,
  crossArray,
  currentRoad,
  rememberRoute,
  startRoad,
  endRoad,
  times
) {
  // console.log(currentRoad,times)
  // console.log(rememberRoute)
  times += roadArray[currentRoad].time;
  // console.log(22,roadArray[currentRoad])
  if (roadArray[currentRoad].visit) {
    return;
  }

  roadArray[currentRoad].visit = true;
  rememberRoute.push(currentRoad);

  if (currentRoad == endRoad) {

    // console.log(lasttime, times)
    if (lasttime > times) {
      lastRoute = [];

      rememberRoute.forEach((doc) => {
        // console.log(roadArray[doc])
        if (roadArray[doc] != undefined) {
          lastRoute.push(roadArray[doc].startPoint, roadArray[doc].endPoint);
        } else {
          lastRoute.push(crossArray[doc].startPoint, crossArray[doc].endPoint);
        }

      });
      // console.log(lastRoute, lasttime)
      lasttime = times;
      return
    }
  }

  //현재 길과 이어진 횡단보도를 계산해서 그 시간을 더하고 그 횡단보도에서 갈수 잇는
  //길로 이동하여 함수를 준다
  for (let i = 0; i < roadArray[currentRoad].connect.length; i++) {

    if (crossArray[roadArray[currentRoad].connect[i]] == undefined) {
      // console.log(roadArray.includes(roadArray[currentRoad].connect[i]))
      dfs(
        roadArray,
        crossArray,
        roadArray[currentRoad].connect[i],
        rememberRoute,
        startRoad,
        endRoad,
        times
      );
      continue;
    }//여기 수정함

    if (crossArray[roadArray[currentRoad].connect[i]] == undefined) return

    if (crossArray[roadArray[currentRoad].connect[i]].visit == true) continue;
    crossArray[roadArray[currentRoad].connect[i]].visit = true

    // console.log(crossArray[roadArray[currentRoad].connect[i]])
    const timeResult = CheckGreen(
      crossArray[roadArray[currentRoad].connect[i]].measureTime,
      crossArray[roadArray[currentRoad].connect[i]].greenTime,
      0
    )
    const walkTIme =
      crossArray[roadArray[currentRoad].connect[i]].greenTime - 7;

    rememberRoute.push(crossArray[roadArray[currentRoad].connect[i]].name);

    for (let k = 0; k < crossArray[roadArray[currentRoad].connect[i]].connect.length; k++) {
      let nextRoad = crossArray[roadArray[currentRoad].connect[i]].connect[k];

      //  console.log(roadArray[endRoad])
      if (roadArray[nextRoad].startPoint._lat > roadArray[endRoad].startPoint._lat) continue
      if (roadArray[nextRoad].startPoint._lat < roadArray[startRoad].startPoint._lat) continue
      if (roadArray[currentRoad].name[0] == roadArray[nextRoad].name[0] && roadArray[currentRoad].connect.includes(nextRoad) == true) continue
      // if(roadArray[nextRoad].endPoint._lang > roadArray[endRoad].startPoint._lang + 0.002) continue



      if (nextRoad == currentRoad) {
        continue
      }
      if (timeResult.currentSign == "빨간불") {
        dfs(
          roadArray,
          crossArray,
          nextRoad,
          rememberRoute,
          startRoad,
          endRoad,
          times + timeResult.leftTime
        );
      } else {
        if (timeResult.leftTime < walkTIme) {
          dfs(
            roadArray,
            crossArray,
            nextRoad,
            rememberRoute,
            startRoad,
            endRoad,
            times +
            3 -
            crossArray[roadArray[currentRoad].connect[i]].greenTime +
            timeResult.leftTime
          );
        } else {
          dfs(
            roadArray,
            crossArray,
            nextRoad,
            rememberRoute,
            startRoad,
            endRoad,
            times + timeResult.leftTime
          );
        }
      }
    }
    crossArray[roadArray[currentRoad].connect[i]].visit = false
    rememberRoute.pop();
  }

  rememberRoute.pop();
  roadArray[currentRoad].visit = false;
}

async function FindFastRoute(crossWalkCollection, startPoint, endPoint) {
  //const db = firebase.firestore();
  let crossArray = [];
  let crossNameArray = [];
  let roadArray = [];
  let roadNameArray = [];
  let rememberRoute = [];
  // const totalDB = [];
  // const totalDBPromise = getDocs("shortRoute");
  // let loaded = false;
  // totalDBPromise.then((querySnapshot) => {
  //   querySnapshot.forEach((doc) => {
  //     if (!totalDB.includes(doc.data())) {
  //       totalDB.push(doc.data());
  //     }
  //     loaded = true;
  //   });
  // });

  await crossWalkCollection[0].then((결과) => {
    결과.forEach((doc) => {
      crossArray[doc.data().name] = doc.data();
      crossNameArray.push(doc.data().name);
    });
  });



  await crossWalkCollection[1].then((결과2) => {
    결과2.forEach((doc) => {
      roadArray[doc.data().name] = doc.data();
      roadNameArray.push(doc.data().name);
    });
    //여기서 lastRoute를 호출하면 안들어잇다고 나옴
  });

  // console.log(roadArray[startPoint]);

  dfs(
    roadArray,
    crossArray,
    startPoint,
    rememberRoute,
    startPoint,
    endPoint,
    0
  );

  console.log(lastRoute, lasttime)
  return new AlgorithmData(lastRoute, lasttime);
}
export default FindFastRoute;
