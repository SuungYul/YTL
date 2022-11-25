import calculatedData from "../database/calculatedData";

// 현재 초록불인지 아닌지 확인해주는 함수
function CheckGreen(time, term, waitTime) {
  let greenMinutesStart = Number(time[0] + time[1]);
  let greenSecondStart = Number(time[3] + time[4]);

  greenSecondStart = greenSecondStart + waitTime;
  greenMinutesStart += (greenSecondStart / 60).toFixed();
  greenMinutesStart = greenMinutesStart % 3;
  greenSecondStart = greenSecondStart % 60;

  let greenMinutesEnd = greenMinutesStart;
  let greenSecondEnd = greenSecondStart + term;
  console.log(greenMinutesStart, greenMinutesEnd);

  greenMinutesEnd += (greenSecondEnd / 60).toFixed();
  greenMinutesEnd = Number(greenMinutesEnd);
  greenSecondEnd = greenSecondEnd % 60;

  const date = new Date();
  let minutes = date.getMinutes();
  minutes = minutes % 3;
  const second = date.getSeconds();
  console.log(
    minutes,
    greenMinutesStart,
    greenMinutesEnd,
    second,
    greenSecondStart,
    greenSecondEnd
  );
  if (
    minutes >= greenMinutesStart &&
    minutes <= greenMinutesEnd &&
    second >= greenSecondStart &&
    second <= greenSecondEnd
  ) {
    const greenLeft =
      greenMinutesEnd * 60 - minutes * 60 + (greenSecondEnd - second);
    // return `초록불, 초록불 남은 시간 ${greenLeft}초`
    console.log("초록", greenLeft);
    return new calculatedData("green", greenLeft);
  } else {
    const leftSecond = second + minutes * 60;
    const greenTime = greenMinutesStart * 60 + greenSecondStart;
    let returnTime = 0;

    if (leftSecond < greenTime) {
      returnTime = greenTime - leftSecond;
    } else {
      returnTime = 180 - leftSecond + greenTime;
    }

    // return `빨간불, 초록불까지 남은 시간 ${returnTime}초`
    console.log("빨간", returnTime);
    return new calculatedData("red", returnTime);
  }
}

export default CheckGreen;
