import firebase from "firebase/app";
import "firebase/firestore";
import { ForFirebase, User } from "../database/data";
import { mergeSort } from "../algorithm/algorithm";

const firebaseConfig = require("../token.json");

//파이어베이스 초기화
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

/** 
 * 파이어베이스 연결 테스트를 위한 함수
 * @param {string} collection Firestore에 저장된 collection 이름
 *  
 */
function testFunction(collection){
    db.collection(collection).get().then((querySnapshot) => {
        querySnapshot.forEach((doc)=> {
            console.log(`${doc.id} => ${doc.data()}`);
        });
    });
}
// function countUser(){
//   db.collection(userList).
// }

/** 
 * 파이어베이스 스토리지에 데이터를 추가하는 함수
 * @param {string} collection Firestore에 저장된 collection 이름
 * @param {string} document Firestore에 위치한 document 이름
 * @param {ForFirebase} data collection에 추가할 데이터
 */
function addData(collection, document, data){ 
    db.collection(collection)
      .doc(document)
      .withConverter(data.getConvertor)
      .set(data)
      .then((docRef)=>{
        console.log(`성공적으로 작성했습니다.`);
      })
      .catch((error)=>{
        console.log(`실패\n${error}`)
      });
}
/** 
 * 파이어베이스 스토리지에 문서생성과 함께 데이터를 추가하는 함수
 * @param {string} collection Firestore에 저장된 collection 이름
 * @param {string} document Firestore에 위치한 document 이름
 * @param {ForFirebase} data collection에 추가할 데이터
 */
 function addDataCreateDoc(collection, data){ 
  return new Promise(function(resolve, reject){
      const newDocRef = db.collection(collection).doc();
      newDocRef
      .withConverter(data.getConvertor)
      .set(data)
      .then((docRef)=>{
        console.log(`성공적으로 작성했습니다 ${newDocRef}`);
        resolve(newDocRef);
      })
      .catch((error)=>{
        console.log(`실패\n${error}`)
      });
    }
  )
 }

 function fieldUpdateConvertor(collection, document, updateObj){ //문서내에 필드를 업데이트
  db.collection(collection)
  .doc(document)
  .withConverter(updateObj.getConvertor)
  .update(updateObj)
  .then(() =>{
    console.log("성공적으로 업데이트 하였습니다.")
  })
  .catch((error) => {
    console.error("Error updating document: ", error);
  })
}

function fieldUpdate(collection, document, updateObj){ //문서내에 필드를 업데이트
  db.collection(collection)
  .doc(document)
  .withConverter(updateObj)
  .update(updateObj)
  .then(() =>{
    console.log("성공적으로 업데이트 하였습니다.")
  })
  .catch((error) => {
    console.error("Error updating document: ", error);
  })
}
/** 
 * 파이어베이스 스토리지에 데이터를 추가하는 함수
 * @param {string} collection Firestore에 저장된 collection 이름
 * @param {string} key Firestore에 위치한 document의 key값
 * @param {string} filter value 의 조건 비교 문자열만 가능("==", ">", "<")
 */


async function getFilteredDocs(collection, key, filter, value ){
    return db.collection(collection).where(key, filter, value)
    .get()
    .then((querySnapshot) => {
      console.log(querySnapshot);
        return querySnapshot.docs;
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}


async function getDocs(collection){
  return db.collection(collection)
    .get()
    .then((querySnapshot) => {
        return querySnapshot.docs;
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}

async function getDocsByOrder(collection, compare){
  return db.collection(collection)
    .get()
    .then((querySnapshot) => {
        return mergeSort(querySnapshot.docs, compare);
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}

async function getDocsByOrderKey(collection, key, reverse = false){
  return db.collection(collection)
  .get()
  .then((querySnapshot) => {
      let result = new Array();
      querySnapshot.docs.forEach((doc)=>{
        result.push(doc.data());
      })

      return mergeSort(result, (x, y) => {
        if(reverse) return x[key] > y[key];
        return x[key] < y[key];
      });
  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });
}

async function getReserveOrder(collection, day, time, key, reverse = false){
  return db.collection(collection)
  .where("day", "==", day)
  .where("time", "==", time)
  .get()
  .then((querySnapshot) => {
      let result = new Array();
      querySnapshot.docs.forEach((doc)=>{
        result.push(doc.data());
      })

      return mergeSort(result, (x, y) => {
        if(reverse) return x[key] > y[key];
        return x[key] < y[key];
      });
  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });
}


async function checkDocConflict(collection, document){ //컬렉션의 문서명이 원래 있는지 체크
  return db.collection(collection)
      .doc(document)
      .get()
      .then((doc) => {
        if(doc.exists){
            return true;
        }
        else {
          return false;
        }
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      })
 }


/** 
 * 파이어베이스 스토리지에 데이터를 조회하는 함수
 * @param {string} collection Firestore에 저장된 collection 이름
 * @param {string} document Firestore에 위치한 document 이름
 * @param {ForFirebase} type collection에 추가할 데이터
 * 
 * 사용예
 * getData("collecion", "document", new User())
 * .then((result) => {
 *   result로 하는 무언가
 * })
 * .catch((error) => {
 *   error 핸들링
 * })
 */
function getData(collection, document, type){
  return new Promise((resolve, reject) =>{
    db.collection(collection)
      .doc(document)
      .withConverter(type.getConvertor)
      .get()
      .then((doc) => {
        if(doc.exists){
            let data = doc.data();
            resolve(data);
        }
        else {
          reject(new Error(`${document} 문서를 찾을 수 없음`));
        }
      })
      .catch((error) => {
        reject(error);
      })
  })
};

/** 
 * 파이어베이스 스토리지에 데이터를 삭제하는 함수
 * @param {string} collection Firestore에 저장된 collection 이름
 * @param {string} document Firestore에 위치한 document 이름
 * 
 * 사용예
 * deleteData("collecion", "document")
 * .then((result) => {
 *   result로 하는 무언가
 * })
 * .catch((error) => {
 *   error 핸들링
 * })
 */
 function deleteData(collection, document){
  return new Promise((resolve, reject) =>{
    db.collection(collection)
      .doc(document)
      .delete()
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        reject(error);
      })
  })
};

function playCountIncrement(collection, user){
  return new Promise((resolve, reject) => {
      let userRef = db.collection(collection).doc(user);

      userRef.update({
        playcount: firebase.firestore.FieldValue.increment(1)
      });

      resolve(true);
  });
};


function playCountDecrement(collection, user){
  return new Promise((resolve, reject) => {
      let userRef = db.collection(collection).doc(user);
      userRef.update({
        playcount: firebase.firestore.FieldValue.increment(-1)
      });

      resolve(true);
  });
};

function badPointIncrement(collection, user, point){
  return new Promise((resolve, reject) => {
      let userRef = db.collection(collection).doc(user);

      userRef.update({
        badPoint: firebase.firestore.FieldValue.increment(point)
      });

      resolve(true);
  });
};


function badPointDecrement(collection, user, point){
  return new Promise((resolve, reject) => {
      let userRef = db.collection(collection).doc(user);
      userRef.update({
        badPoint: firebase.firestore.FieldValue.increment(-1*point)
      });

      resolve(true);
  });
};


export const authService = firebase.auth();
export {testFunction, addData, getData, deleteData, playCountIncrement, badPointIncrement, badPointDecrement,
  getFilteredDocs, playCountDecrement, getDocs, fieldUpdate, checkDocConflict, addDataCreateDoc, 
  getDocsByOrder, getDocsByOrderKey, getReserveOrder, fieldUpdateConvertor };
