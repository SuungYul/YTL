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
          <button>출발</button>
          <button>도착</button>
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
