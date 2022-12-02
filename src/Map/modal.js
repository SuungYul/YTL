import Modal from "react-modal";
import React, { useState } from "react";
import "./modal.css";

Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: "35%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    height: "50%",
    width: "20%",
    transform: "translate(-40%, -10%)",
  },
};

const findWayStyles = {
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    height: "10%",
    width: "20%",
    transform: "translate(-40%, -10%)",
  },
};

export function PopUp({ isModalOpen, setModalOpen, data }) {
  return (
    <>
      <button onClick={() => setModalOpen(true)}>Modal Open</button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={customStyles}
      >
        <div>
          <p className="name">{data.name + "\n"}</p>
          <p>{"선택하신 횡단보도는 "}{" "}</p>
          <p className="YTL-state">{data.currentSign === "red" ? <p className="red">"빨간불"</p> : <p className="green">"초록불"</p>}{" "}</p>
          <p>{"신호 변경까지 "+data.leftTime + "초 남았습니다."}</p>
        </div>
        <div>
          {drawTable(isModalOpen, data)}
        </div>
      </Modal>
    </>
  );
}

function  pickPoint(){
  return "road1"
}

export function FindWay({ isFindOpen, setFindOpen }) {
  const [startPoint, setstartPoint] = useState("출발 지점");
  const [endPoint, setendPoint] = useState("도착 지점");

  return (
    <>
      <Modal
        isOpen={isFindOpen}
        onRequestClose={() => setFindOpen(false)}
        style={findWayStyles}
      >
        <div>
          <div>
            <span>출발 내용</span>
            <button onClick={() => {}}>출발</button>
            <span>{startPoint}</span>
            <button onClick={()=>{
              setstartPoint(pickPoint())
              }}>출발</button>
          </div>

          <div>
            <span>{endPoint}</span>
            <button onClick={()=>{
              setendPoint(pickPoint())
              }}>도착</button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function drawTable(isModalOpen, data) {
  if (!isModalOpen) return;
  console.log(data);
  let minute = data.minute;
  const second = data.second;
  const now = new Date();
  console.log(now.getHours());
  const result = [];
  let index = 1;

  let m = now.getMinutes();
  let i = m;
  let hour = now.getHours();
  let month = now.getMonth() + 1;
  let date = now.getDate();
  let hourCount = 0;
  while (hourCount < 6) {
    if (i >= 60) {
      i %= 60;
      hourCount++;
      hour++;
      if (hour > 24) {
        date++;
        hour %= 24;
      }
    }
    if (i % 3 === minute) {
      result.push(
        <tr>
          <td>{index++}</td>
          <td>
            {month +
              "월 " +
              date +
              "일 " +
              hour +
              ":" +
              i +
              ":" +
              second +
              ""}
          </td>
        </tr>
      );
    }
    i++;
  }
  return <table className="timetable">
    <caption className="name">시간표</caption>
      <thead>
        <tr>
          <th>번호</th>
          <th>시간</th>
        </tr>
      </thead>
      <tbody>
        {result}
      </tbody>
    </table>;
}
