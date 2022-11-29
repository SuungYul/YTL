import Modal from "react-modal";
import React, { useState } from "react";
import "./modal.css";

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
