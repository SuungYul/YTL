import { Crosswalk } from "../database/data";
import firebase from "firebase/app";
import "firebase/firestore";
import CheckGreen from "./CheckGreen";

let lasttime = 10000000;
let lastRoute = [];

function dfs(
  roadArray,
  crossArray,
  roadNameArray,
  crossNameArray,
  currentRoad,
  rememberRoute,
  endRoad,
  time
) {
  time += roadArray[currentRoad].time;

  if (roadArray[currentRoad].visit) {
    return;
  }

  roadArray[currentRoad].visit = true;
  rememberRoute.push(currentRoad);

  if (currentRoad == endRoad) {
    if (lasttime > time) {
      // lastRoute = JSON.parse(JSON.stringify(rememberRoute));
      // lastRoute = _.cloneDeep(objects);
      lastRoute = [];
      rememberRoute.forEach((doc) => {
        lastRoute.push(doc);
      });
      lasttime = time;
      //여기서 전역변수인 lastRoute를 변경해도 마지막에 변경이 안됨 93번쨰를 보세요
    }
  }

  //현재 길과 이어진 횡단보도를 계산해서 그 시간을 더하고 그 횡단보도에서 갈수 잇는
  //길로 이동하여 함수를 준다
  for (let i = 0; i < roadArray[currentRoad].connect.length; i++) {
    const timeResult = CheckGreen(
      crossArray[roadArray[currentRoad].connect[i]].measureTime,
      crossArray[roadArray[currentRoad].connect[i]].greenTime
    );
    const walkTIme =
      crossArray[roadArray[currentRoad].connect[i]].greenTime - 7;
    rememberRoute.push(crossArray[roadArray[currentRoad].connect[i]].name);

    let nextRoad = crossArray[roadArray[currentRoad].connect[i]].connect[0];
    if (nextRoad === currentRoad) {
      nextRoad = crossArray[roadArray[currentRoad].connect[i]].connect[1];
    }

    if (timeResult.now == "빨간불") {
      dfs(
        roadArray,
        crossArray,
        roadNameArray,
        crossNameArray,
        nextRoad,
        rememberRoute,
        endRoad,
        time + timeResult.time
      );
    } else {
      if (timeResult.time < walkTIme) {
        dfs(
          roadArray,
          crossArray,
          roadNameArray,
          crossNameArray,
          nextRoad,
          rememberRoute,
          endRoad,
          time +
            3 -
            crossArray[roadArray[currentRoad].connect[i]].greenTime +
            timeResult.time
        );
      } else {
        dfs(
          roadArray,
          crossArray,
          roadNameArray,
          crossNameArray,
          nextRoad,
          rememberRoute,
          endRoad,
          time + timeResult.time
        );
      }
    }
    // dfs(roadArray,crossArray,roadNameArray,crossNameArray, currentRoad, rememberRoute, endRoad, time)
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

  await crossWalkCollection[0].then((결과) => {
    결과.forEach((doc) => {
      crossArray[doc.data().name] = doc.data();
      crossNameArray.push(doc.data().name);
    });
  });

  console.log(crossNameArray[0]);
  await crossWalkCollection[1].then((결과2) => {
    결과2.forEach((doc) => {
      roadArray[doc.data().name] = doc.data();
      roadNameArray.push(doc.data().name);
    });

    dfs(
      roadArray,
      crossArray,
      roadNameArray,
      crossNameArray,
      startPoint,
      rememberRoute,
      endPoint,
      0
    );
    console.log(lastRoute, lasttime);
    //여기서 lastRoute를 호출하면 안들어잇다고 나옴
  });
}
export default FindFastRoute;
