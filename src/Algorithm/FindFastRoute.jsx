import { Crosswalk } from "../database/data";
import firebase from "firebase/app";
import "firebase/firestore";
import CheckGreen from "./CheckGreen";
import { getDocs } from "../database/firebase";
import { useEffect } from "react";
import AlgorithmData from "../database/AlgorithmData";

let lasttime = 10000000;
let lastRoute = [];
let count = 0

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
  // count++
  // if(count>10000000)return

  // if (allArray[currentRoad].startPoint._lat > allArray[endRoad].startPoint._lat) return
  // if (allArray[currentRoad].startPoint._lat < allArray[startRoad].startPoint._lat) return
 
  
  if (allArray[currentRoad].visit == true) {
    return;
  }
  allArray[currentRoad].visit = true;
  rememberRoute.push(currentRoad);

  if (currentRoad == endRoad) {
    if (lasttime > times) {
      lastRoute = [];
      rememberRoute.forEach((doc) => {
        lastRoute.push(allArray[doc].startPoint, allArray[doc].endPoint);
      });
      lasttime = times;
      return
    }
  }

  if(crossArray[currentRoad] == undefined){//길이다
    times += roadArray[currentRoad].time;
    for (let i = 0; i < roadArray[currentRoad].connect.length; i++) {
      const nextRoad = allArray[currentRoad].connect[i]
      if (allArray[nextRoad].startPoint._lat > allArray[endRoad].startPoint._lat) continue
      if (allArray[nextRoad].startPoint._lat < allArray[startRoad].startPoint._lat) continue
      if (allArray[nextRoad].startPoint._lat < allArray[currentRoad].endPoint._lat) continue
      if (nextRoad == currentRoad) {
        continue
      }

      dfs(
        allArray,
        roadArray,
        crossArray,
        nextRoad,
        rememberRoute,
        startRoad,
        endRoad,
        times,
        myMinute,
        mySecond
      );
    }
  }else{//횡단보도임
    const timeResult = CheckGreen(
      crossArray[currentRoad].measureTime,
      crossArray[currentRoad].greenTime,
      0,
      myMinute,
      mySecond + times
    )

    const walkTIme =
    crossArray[currentRoad].greenTime - 7;

    for (let i = 0; i < crossArray[currentRoad].connect.length; i++) {
      const nextRoad = allArray[currentRoad].connect[i]
      if (allArray[nextRoad].startPoint._lat > allArray[endRoad].startPoint._lat) continue
      if (allArray[nextRoad].startPoint._lat < allArray[startRoad].startPoint._lat) continue
      if (allArray[nextRoad].startPoint._lat < allArray[currentRoad].endPoint._lat) continue
     
      if (nextRoad == currentRoad) {
        continue
      }
      // if (allArray[currentRoad].name.includes('Middle')) {
      //   if (allArray[currentRoad].name[0] == allArray[nextRoad].name[0]) {
      //     continue
      //   }
      // }

      if (timeResult.currentSign == "빨간불") {
        dfs(
          allArray,
          roadArray,
          crossArray,
          nextRoad,
          rememberRoute,
          startRoad,
          endRoad,
          times + timeResult.leftTime,
          myMinute,
          mySecond
        );
      } else {
        if (timeResult.leftTime < walkTIme) {
          dfs(
            allArray,
            roadArray,
            crossArray,
            nextRoad,
            rememberRoute,
            startRoad,
            endRoad,
            times +
            3 -
            crossArray[currentRoad].greenTime +
            timeResult.leftTime,
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













  // // console.log(currentRoad,times)
  // // console.log(rememberRoute)

  // // console.log(22,roadArray[currentRoad])
  // if (roadArray[currentRoad].visit == true) {
  //   return;
  // }

  // roadArray[currentRoad].visit = true;
  // rememberRoute.push(currentRoad);
  // times += roadArray[currentRoad].time;
  // if (currentRoad == endRoad) {

  //   if (lasttime > times) {
  //     lastRoute = [];

  //     rememberRoute.forEach((doc) => {
  //       // console.log(roadArray[doc])
  //       if (roadArray[doc] != undefined) {
  //         // lastRoute.push(roadArray[doc].name)
  //         lastRoute.push(roadArray[doc].startPoint, roadArray[doc].endPoint);
  //       } else {
  //         // lastRoute.push(crossArray[doc].name)
  //         lastRoute.push(crossArray[doc].startPoint, crossArray[doc].endPoint);
  //       }

  //     });
  //     // console.log(lastRoute, lasttime)
  //     lasttime = times;
  //     return
  //   }
  // }

  // //현재 길과 이어진 횡단보도를 계산해서 그 시간을 더하고 그 횡단보도에서 갈수 잇는
  // //길로 이동하여 함수를 준다
  // for (let i = 0; i < roadArray[currentRoad].connect.length; i++) {

  //   if (crossArray[roadArray[currentRoad].connect[i]] == undefined) {
  //     // console.log(roadArray.includes(roadArray[currentRoad].connect[i]))
  //     dfs(
  //       allArray,
  //       roadArray,
  //       crossArray,
  //       roadArray[currentRoad].connect[i],
  //       rememberRoute,
  //       startRoad,
  //       endRoad,
  //       times,
  //       myMinute,
  //       mySecond + times
  //     );
  //     continue;
  //   }//여기 수정함

  //   if (crossArray[roadArray[currentRoad].connect[i]] == undefined) continue

  //   if (crossArray[roadArray[currentRoad].connect[i]].visit == true) continue;
  //   // crossArray[roadArray[currentRoad].connect[i]].visit = true

  //   // console.log(crossArray[roadArray[currentRoad].connect[i]])



    

  //   for (let k = 0; k < crossArray[roadArray[currentRoad].connect[i]].connect.length; k++) {
  //     let nextRoad = crossArray[roadArray[currentRoad].connect[i]].connect[k];
  //     if (nextRoad == currentRoad) {
  //       continue
  //     }
  //     //  console.log(roadArray[endRoad])
  //     if (roadArray[nextRoad].startPoint._lat > roadArray[endRoad].startPoint._lat) continue
  //     if (roadArray[nextRoad].startPoint._lat < roadArray[startRoad].startPoint._lat) continue
  //     // if (roadArray[currentRoad].name[0] == roadArray[nextRoad].name[0] && roadArray[currentRoad].connect.includes(nextRoad) == true) continue
  //     // // if(roadArray[nextRoad].endPoint._lang > roadArray[endRoad].startPoint._lang + 0.002) continue
  //     // console.log(crossArray[roadArray[currentRoad].connect[i]].name.includes('Middle'))
  //     if(crossArray[roadArray[currentRoad].connect[i]].name.includes('Middle')){
  //       if (roadArray[currentRoad].name[0] == roadArray[nextRoad].name[0]) {
  //         continue
  //       }
  //     }

  //     const timeResult = CheckGreen(
  //       crossArray[roadArray[currentRoad].connect[i]].measureTime,
  //       crossArray[roadArray[currentRoad].connect[i]].greenTime,
  //       0,
  //       myMinute,
  //       mySecond + times
  //     )

  //     const walkTIme =
  //     crossArray[roadArray[currentRoad].connect[i]].greenTime - 7;


  //     if (timeResult.currentSign == "빨간불") {
  //       crossArray[roadArray[currentRoad].connect[i]].visit = true
  //       rememberRoute.push(crossArray[roadArray[currentRoad].connect[i]].name);
  //       dfs(
  //         allArray,
  //         roadArray,
  //         crossArray,
  //         nextRoad,
  //         rememberRoute,
  //         startRoad,
  //         endRoad,
  //         times + timeResult.leftTime,
  //         myMinute,
  //         mySecond
  //       );
  //       crossArray[roadArray[currentRoad].connect[i]].visit = false
  //       rememberRoute.pop();
  //     } else {
  //       if (timeResult.leftTime < walkTIme) {
  //         crossArray[roadArray[currentRoad].connect[i]].visit = true
  //         rememberRoute.push(crossArray[roadArray[currentRoad].connect[i]].name);
  //         dfs(
  //           allArray,
  //           roadArray,
  //           crossArray,
  //           nextRoad,
  //           rememberRoute,
  //           startRoad,
  //           endRoad,
  //           times +
  //           3 -
  //           crossArray[roadArray[currentRoad].connect[i]].greenTime +
  //           timeResult.leftTime,
  //           myMinute,
  //           mySecond
  //         );
  //         crossArray[roadArray[currentRoad].connect[i]].visit = false
  //         rememberRoute.pop();
  //       } else {
  //         crossArray[roadArray[currentRoad].connect[i]].visit = true
  //         rememberRoute.push(crossArray[roadArray[currentRoad].connect[i]].name);
  //         dfs(
  //           allArray,
  //           roadArray,
  //           crossArray,
  //           nextRoad,
  //           rememberRoute,
  //           startRoad,
  //           endRoad,
  //           times + walkTIme,
  //           myMinute,
  //           mySecond
  //         );
  //         crossArray[roadArray[currentRoad].connect[i]].visit = false
  //         rememberRoute.pop();
  //       }
  //     }
  //   }

  //   // crossArray[roadArray[currentRoad].connect[i]].visit = false
  //   // rememberRoute.pop();
  // }

  // rememberRoute.pop();
  // roadArray[currentRoad].visit = false;
}

async function FindFastRoute(crossWalkCollection, startPoint, endPoint) {
  //const db = firebase.firestore();
  let crossArray = [];
  let crossNameArray = [];
  let roadArray = [];
  let allArray = []
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
  

  // console.log(roadArray[startPoint]);

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

  console.log(lastRoute, lasttime)
  return new AlgorithmData(lastRoute, lasttime);
}
export default FindFastRoute;
