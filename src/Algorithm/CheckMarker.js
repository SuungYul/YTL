// import { getPosition, getData, db, getDocs } from "../database/firebase";

// function checkMarker() {
//     useEffect(() => {
//         const totalDBPromise = getDocs("crosswalk");
//         const roadPromise = getDocs("Road");
//         const shortRoutePromise = getDocs("shortRoute");
//         const tP = [];
//         tP.push(shortRoutePromise, roadPromise);
//         let loaded = false;
//         const totalDB = [];
//         totalDBPromise.then((querySnapshot) => {
//           querySnapshot.forEach((doc) => {
//             if (!totalDB.includes(doc.data())) {
//               totalDB.push(doc.data());
//             }
//             loaded = true;
//           });
//         });
//     }, []);

    

//     return null;

// }