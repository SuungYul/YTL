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
    height: "30%",
    width: "20%",
    transform: "translate(-40%, -10%)",
  },
};

const findWayStyles = {
  content: {
    top: "20%",
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
          {data.name + "\n선택하신 횡단보도는 "}{" "}
          {data.currentSign === "red" ? "빨간불" : "초록불"}{" "}
          {", " + data.leftTime + "초 남았습니다."}
        </div>
        <div>
          <p>시간표</p>
          {drawTable(isModalOpen, data)}
        </div>
      </Modal>
    </>
  );
}

export function FindWay({ isFindOpen, setFindOpen }) {
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
          </div>

          <div>
            <span>도착 내용</span>
            <button>도착</button>
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
              "시 " +
              i +
              "분 " +
              second +
              "초"}
          </td>
        </tr>
      );
    }
    i++;
  }
  return <table>{result}</table>;
}
