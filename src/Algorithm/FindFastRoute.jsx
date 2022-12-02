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
    console.log(lastRoute, lasttime)
    // console.log(rememberRoute, lasttime, times)
    if (lasttime > times) {
      lastRoute = [];
      rememberRoute.forEach((doc) => {
        lastRoute.push(doc);
      });
      lasttime = times;
      //여기서 전역변수인 lastRoute를 변경해도 마지막에 변경이 안됨 93번쨰를 보세요
      return
    }
  }

  //현재 길과 이어진 횡단보도를 계산해서 그 시간을 더하고 그 횡단보도에서 갈수 잇는
  //길로 이동하여 함수를 준다
  for (let i = 0; i < roadArray[currentRoad].connect.length; i++) {
    
    if(crossArray[roadArray[currentRoad].connect[i]]==undefined){
      // console.log(roadArray.includes(roadArray[currentRoad].connect[i]))
      dfs(
        roadArray,
        crossArray,
        roadArray[currentRoad].connect[i],
        rememberRoute,
        endRoad,
        times
      );
      continue;
    }//여기 수정함

    if(crossArray[roadArray[currentRoad].connect[i]]==undefined)return

    // console.log(crossArray[roadArray[currentRoad].connect[i]])
    const timeResult = CheckGreen(
      crossArray[roadArray[currentRoad].connect[i]].measureTime,
      crossArray[roadArray[currentRoad].connect[i]].greenTime,
      0
    )
    const walkTIme =
      crossArray[roadArray[currentRoad].connect[i]].greenTime - 7;

    rememberRoute.push(crossArray[roadArray[currentRoad].connect[i]].name);

    for(let k = 0; k<crossArray[roadArray[currentRoad].connect[i]].connect.length; k++){
      let nextRoad = crossArray[roadArray[currentRoad].connect[i]].connect[k];

      // console.log(endRoad)
      if(roadArray[nextRoad].startPoint._lat > roadArray[endRoad].endPoint._lat) continue

      if (nextRoad == currentRoad) {
        continue
      }
      if (timeResult.currentSign == "빨간불") {
        dfs(
          roadArray,
          crossArray,
          nextRoad,
          rememberRoute,
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
            endRoad,
            times + timeResult.leftTime
          );
        }
      }
    }
    // let nextRoad = crossArray[roadArray[currentRoad].connect[i]].connect[0];
    // if (nextRoad === currentRoad) {
    //   nextRoad = crossArray[roadArray[currentRoad].connect[i]].connect[1];
    // }

    // if (timeResult.currentSign == "빨간불") {
    //   dfs(
    //     roadArray,
    //     crossArray,
    //     nextRoad,
    //     rememberRoute,
    //     endRoad,
    //     times + timeResult.leftTime
    //   );
    // } else {
    //   if (timeResult.leftTime < walkTIme) {
    //     dfs(
    //       roadArray,
    //       crossArray,
    //       nextRoad,
    //       rememberRoute,
    //       endRoad,
    //       times +
    //       3 -
    //       crossArray[roadArray[currentRoad].connect[i]].greenTime +
    //       timeResult.leftTime
    //     );
    //   } else {
    //     dfs(
    //       roadArray,
    //       crossArray,
    //       nextRoad,
    //       rememberRoute,
    //       endRoad,
    //       times + timeResult.leftTime
    //     );
    //   }
    // }
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
    endPoint,
    0
  );

  console.log(lastRoute, lasttime)
  return new AlgorithmData(lastRoute, lasttime);
}
export default FindFastRoute;
