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
  allArray,
  roadArray,
  crossArray,
  currentRoad,
  rememberRoute,
  startRoad,
  endRoad,
  times,
  myMinute,
  mySecond
) {
  // if (times > lasttime) return

  if (currentRoad === endRoad) {
    // console.log(rememberRoute)
    if (lasttime > times) {
      console.log(rememberRoute, times);
      lastRoute = [];
      rememberRoute.forEach((doc) => {
        lastRoute.push(allArray[doc].startPoint, allArray[doc].endPoint);
      });
      lastRoute.push(
        allArray[currentRoad].startPoint,
        allArray[currentRoad].endPoint
      );
      lasttime = times;
      return;
    }
  }

  if (times > lasttime) return;

  if (allArray[currentRoad].visit === true) {
    return;
  }

  allArray[currentRoad].visit = true;
  rememberRoute.push(currentRoad);

  if (crossArray[currentRoad] == undefined) {
    //길이다

    for (let i = 0; i < roadArray[currentRoad].connect.length; i++) {
      const nextRoad = allArray[currentRoad].connect[i];
      if (nextRoad != endRoad) {
        if (
          CheckRight(startRoad, endRoad, currentRoad, nextRoad, allArray) ==
          false
        )
          continue;
      }

      dfs(
        allArray,
        roadArray,
        crossArray,
        nextRoad,
        rememberRoute,
        startRoad,
        endRoad,
        times + roadArray[currentRoad].time,
        myMinute,
        mySecond
      );
    }
  } else {
    //횡단보도임
    const timeResult = CheckGreen(
      crossArray[currentRoad].measureTime,
      crossArray[currentRoad].greenTime,
      0,
      myMinute,
      mySecond + times
    );

    const walkTIme = crossArray[currentRoad].greenTime - 7;

    for (let i = 0; i < crossArray[currentRoad].connect.length; i++) {
      const nextRoad = allArray[currentRoad].connect[i];

      if (nextRoad != endRoad) {
        if (
          CheckRight(startRoad, endRoad, currentRoad, nextRoad, allArray) ==
          false
        )
          continue;
      }

      if (timeResult.currentSign === "빨간불") {
        dfs(
          allArray,
          roadArray,
          crossArray,
          nextRoad,
          rememberRoute,
          startRoad,
          endRoad,
          times + timeResult.leftTime + walkTIme,
          myMinute,
          mySecond
        );
      } else {
        if (timeResult.leftTime < walkTIme - 5) {
          dfs(
            allArray,
            roadArray,
            crossArray,
            nextRoad,
            rememberRoute,
            startRoad,
            endRoad,
            times +
              (180 - crossArray[currentRoad].greenTime) +
              timeResult.leftTime +
              walkTIme,
            myMinute,
            mySecond
          );
        } else {
          dfs(
            allArray,
            roadArray,
            crossArray,
            nextRoad,
            rememberRoute,
            startRoad,
            endRoad,
            times + walkTIme,
            myMinute,
            mySecond
          );
        }
      }
    }
  }

  rememberRoute.pop();
  allArray[currentRoad].visit = false;
}

async function FindFastRoute(crossWalkCollection, startPoint, endPoint) {
  if (crossWalkCollection.length === 0) return;

  let crossArray = [];
  let crossNameArray = [];
  let roadArray = [];
  let allArray = [];
  let roadNameArray = [];
  let rememberRoute = [];

  console.log("FindFastRoute", crossWalkCollection, startPoint, endPoint);
  await crossWalkCollection[0].then((결과) => {
    결과.forEach((doc) => {
      allArray[doc.data().name] = doc.data();
      crossArray[doc.data().name] = doc.data();
      crossNameArray.push(doc.data().name);
    });
  });

  await crossWalkCollection[1].then((결과2) => {
    결과2.forEach((doc) => {
      allArray[doc.data().name] = doc.data();
      roadArray[doc.data().name] = doc.data();
      roadNameArray.push(doc.data().name);
    });
    //여기서 lastRoute를 호출하면 안들어잇다고 나옴
  });

  const date = new Date();

  dfs(
    allArray,
    roadArray,
    crossArray,
    startPoint,
    rememberRoute,
    startPoint,
    endPoint,
    0,
    date.getMinutes(),
    date.getSeconds()
  );

  console.log(lastRoute, lasttime);
  return new AlgorithmData(lastRoute, lasttime);
}

function CheckRight(startPoint, endPoint, currentRoad, nextRoad, allArray) {
  // console.log(startPoint, endPoint, currentRoad, nextRoad)
  if (allArray[startPoint].endPoint._lat < allArray[endPoint].startPoint._lat) {
    //내려가는 길
    if (
      allArray[nextRoad].startPoint._lat >
      allArray[endPoint].startPoint._lat + 0.001
    ) {
      return false;
    }
    if (
      allArray[nextRoad].startPoint._lat <
      allArray[startPoint].startPoint._lat - 0.001
    ) {
      return false;
    }

    // if(
    //   allArray[nextRoad].startPoint._lat < allArray[currentRoad].startPoint._lat
    // )return false;

    return true;
  } else {
    //올라가는길
    if (
      allArray[nextRoad].startPoint._lat <
      allArray[endPoint].startPoint._lat - 0.001
    ) {
      return false;
    }
    if (
      allArray[nextRoad].startPoint._lat >
      allArray[startPoint].startPoint._lat + 0.001
    ) {
      return false;
    }

    // if (allArray[currentRoad].endPoint._lat < allArray[nextRoad].startPoint._lat
    // ) return false

    return true;
  }
}

export default FindFastRoute;
