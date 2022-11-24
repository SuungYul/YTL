import { Crosswalk } from "../database/data";
import firebase from "firebase/app";
import "firebase/firestore";
import calculatedData from "../dto/calculatedData";
import CheckGreen from "./CheckGreen";
import PriorityQueue from "./PriorityQueue";


let lasttime = 10000000
let lastRoute = []

function dfs(roadArray, crossArray, roadNameArray, crossNameArray, currentRoad, rememberRoute, endRoad, time) {
  time += roadArray[currentRoad].time
  // console.log(currentRoad, rememberRoute, endRoad, time)


  if (roadArray[currentRoad].visit) {
    return;
  }

  roadArray[currentRoad].visit = true
  rememberRoute.push(currentRoad)

  if (currentRoad == endRoad) {
    // console.log(rememberRoute)
    // console.log(lasttime, time)

    if (lasttime > time) {
      lastRoute = rememberRoute
      lasttime = time
      console.log(rememberRoute)
    }
  }


  for (let i = 0; i < roadArray[currentRoad].connect.length; i++) {

    const timeResult = CheckGreen(crossArray[roadArray[currentRoad].connect[i]].measureTime, crossArray[roadArray[currentRoad].connect[i]].greenTime)
    const walkTIme = crossArray[roadArray[currentRoad].connect[i]].greenTime - 7
    rememberRoute.push(crossArray[roadArray[currentRoad].connect[i]].name)

    let nextRoad = crossArray[roadArray[currentRoad].connect[i]].connect[0]
      if (nextRoad === currentRoad) {
        nextRoad = crossArray[roadArray[currentRoad].connect[i]].connect[1]
      }
    
    if (timeResult.now == '빨간불') {
      dfs(roadArray, crossArray, roadNameArray, crossNameArray, nextRoad, rememberRoute, endRoad, time + timeResult.time)
    } else {
      if (timeResult.time < walkTIme) {
        dfs(roadArray, crossArray, roadNameArray, crossNameArray, nextRoad, rememberRoute, endRoad, time + 3 - crossArray[roadArray[currentRoad].connect[i]].greenTime + timeResult.time)
      } else {
        dfs(roadArray, crossArray, roadNameArray, crossNameArray, nextRoad, rememberRoute, endRoad, time + timeResult.time)
      }

    }
    // dfs(roadArray,crossArray,roadNameArray,crossNameArray, currentRoad, rememberRoute, endRoad, time)
    rememberRoute.pop()

  }

  rememberRoute.pop()
  roadArray[currentRoad].visit = false

}

function FindFastRoute(crossWalkCollection, startPoint, endPoint) {

  const db = firebase.firestore();
  let crossArray = []
  let crossNameArray = []
  let roadArray = []
  let roadNameArray = []
  let rememberRoute = []


  db.collection(crossWalkCollection).get().then((결과) => {
    결과.forEach((doc) => {
      crossArray[doc.data().name] = doc.data()
      crossNameArray.push(doc.data().name)
    })

  })



  db.collection('Road').get().then((결과2) => {
    결과2.forEach((doc) => {
      roadArray[doc.data().name] = doc.data()
      roadNameArray.push(doc.data().name)
    })


    dfs(roadArray, crossArray, roadNameArray, crossNameArray, startPoint, rememberRoute, endPoint, 0)
    console.log(lastRoute, lasttime)
  })


  




}
export default FindFastRoute;