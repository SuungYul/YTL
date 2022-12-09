import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import "./modal.css";
import { useNavigate } from "react-router-dom";

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

const HelpStyles = {
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    height: "50%",
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
          <p>{"선택하신 횡단보도는 "} </p>
          <p className="YTL-state">
            {data.currentSign === "red" ? (
              <p className="red">"빨간불"</p>
            ) : (
              <p className="green">"초록불"</p>
            )}{" "}
          </p>
          <p>{"신호 변경까지 " + data.leftTime + "초 남았습니다."}</p>
        </div>
        <div>{drawTable(isModalOpen, data)}</div>
      </Modal>
    </>
  );
}

function pickPoint() {
  return "road1";
}

export function FindWay({
  isFindOpen,
  setFindOpen,
  setPoint,
  point,
  setCRVisible,
  setStart,
  setEnd,
  isStart,
  isEnd,
}) {
  const navigate = useNavigate();

  const [startPoint, setStartPoint] = useState("출발 지점");
  const [endPoint, setEndPoint] = useState("도착 지점");
  useEffect(() => {
    console.log("point", point, "isStart", isStart, "isEnd", isEnd);
    if (isStart) {
      setStartPoint(point);
      setStart(false);
    } else if (isEnd) {
      setEndPoint(point);
      setEnd(false);
    }
  }, [point]);

  return (
    <>
      <Modal
        isOpen={isFindOpen}
        onRequestClose={() => setFindOpen(false)}
        style={findWayStyles}
      >
        <div>
          <div>
            <span>{startPoint}</span>
            <button
              onClick={() => {
                setStart(true);
                setCRVisible(false);
                setFindOpen(false);
              }}
            >
              출발
            </button>
          </div>

          <div>
            <span>{endPoint}</span>
            <button
              onClick={() => {
                setEnd(true);
                setCRVisible(false);
                setFindOpen(false);
              }}
            >
              도착
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                if (startPoint !== "출발 지점" && endPoint !== "도착 지점") {
                  navigate("/result", {
                    state: {
                      startPoint: startPoint,
                      endPoint: endPoint,
                    },
                  });
                } else {
                  alert("출발 도착을 선택하세요!");
                }
              }}
            >
              결과 보기
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export function Help({ isHelpOpen, setHelpOpen }) {
  return (
    <>
      <button onClick={() => setHelpOpen(true)}>Help Open</button>
      <Modal
        isOpen={isHelpOpen}
        onRequestClose={() => setHelpOpen(false)}
        style={HelpStyles}
      >
        <div>
          <span className="title">도움말</span>
          <div className="information">
            <li className="subtitle">정보</li>
            <p>
              {" "}
              이 웹사이트는 <p className="projc">YTL 프로젝트</p>로, 명지대학교
              자연캠퍼스 근처의 신호등 정보를 제공하는 곳입니다.
            </p>
            <li className="subtitle">사용 방법</li>
            <ul>
              <li>
                상단 중앙 로고에는 프로젝트 이름 YTL과 현재 시간이 표시되어
                있습니다.
              </li>
              <li>지도는 일반 네이버 지도와 같습니다.</li>
              <li>
                숫자가 표시된 빨간색 또는 초록색 원형은 그 위치의 횡단보도
                신호와 시간을 표시해줍니다.
              </li>
              <li>
                <div className="redstate">숫자</div> 또는{" "}
                <div className="greenstate">숫자</div>를 클릭하시면 남은 시간과
                앞으로의 신호에 대한 시간표를 확인할 수 있습니다.
              </li>
              <li>
                로고 우측의 길 찾기 버튼을 통해 원하는 출발, 도착 마커를
                지정하여 최단 시간이 걸리는 경로를 확인할 수 있습니다.
              </li>
            </ul>
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
  now.setSeconds(second);

  for (let t = 0; t < 3; t++) {
    //현재 시간 이후 주기에 맞는 시간을 찾음
    if ((now.getMinutes() + t) % 3 === minute) {
      now.setMinutes(now.getMinutes() + t);
      break;
    }
  }

  for (let i = 0; i < 50; i++) {
    // 향후 50개만 보여줌
    result.push(
      <tr>
        <td>{index++}</td>
        <td>{now.toLocaleString()}</td>
      </tr>
    );
    now.setMinutes(now.getMinutes() + 3);
  }
  return (
    <table className="timetable">
      <caption className="name">시간표</caption>
      <thead>
        <tr>
          <th>번호</th>
          <th>시간</th>
        </tr>
      </thead>
      <tbody>{result}</tbody>
    </table>
  );
}
