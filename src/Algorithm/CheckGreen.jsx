import calculatedData from "../database/calculatedData";

// 현재 초록불인지 아닌지 확인해주는 함수
function CheckGreen(time, term, waitTime, myMinute, mySecond) {
  let greenMinutesStart = Number(time[0] + time[1]);
  let greenSecondStart = Number(time[3] + time[4]);

  if (waitTime !== 0) {
    greenSecondStart = greenSecondStart + waitTime;
    if (greenSecondStart >= 60) {
      greenMinutesStart += (greenSecondStart / 60).toFixed();
      greenMinutesStart = greenMinutesStart % 3;
      greenSecondStart = greenSecondStart % 60;
    }
  }

  let greenMinutesEnd = Number(greenMinutesStart);
  let greenSecondEnd = Number(greenSecondStart + term);
  // console.log(greenMinutesStart,greenMinutesEnd)

  if (greenSecondEnd >= 60) {
    greenMinutesEnd += 1;
    greenSecondEnd = greenSecondEnd % 60;
  }

  const date = new Date();
  let minutes = 0
  let second = 0
  if(myMinute == 0){
    
    minutes = date.getMinutes();
    minutes = minutes % 3;
    second = date.getSeconds();
  }else{
    myMinute = myMinute + mySecond / 60
    myMinute = myMinute % 60
    mySecond = mySecond % 60

    minutes = myMinute
    minutes = minutes % 3;
    second = mySecond
  }

  // console.log(
  //   minutes,
  //   greenMinutesStart,
  //   greenMinutesEnd,
  //   second,
  //   greenSecondStart,
  //   greenSecondEnd
  // );
  let leftSecond = minutes * 60 + second;
  let greenTimeStart = greenMinutesStart * 60 + greenSecondStart;
  let greenTimeEnd = greenMinutesEnd * 60 + greenSecondEnd;

  let data = new calculatedData();
  data.minute = greenMinutesStart;
  data.second = greenSecondStart;

  if (greenTimeStart <= leftSecond && leftSecond <= greenTimeEnd) {
    // console.log(leftSecond, greenTimeStart, greenTimeEnd);
    let greenLeft = greenTimeEnd - leftSecond;
    // // return `초록불, 초록불 남은 시간 ${greenLeft}초`
    data.currentSign = "green";
    data.leftTime = greenLeft;
  } else {
    let returnTime = 0;

    if (leftSecond < greenTimeStart) {
      returnTime = greenTimeStart - leftSecond;
    } else {
      returnTime = 180 - leftSecond + greenTimeStart;
    }

    // return `빨간불, 초록불까지 남은 시간 ${returnTime}초`
    data.currentSign = "red";
    data.leftTime = returnTime;
  }
  return data;
}

export default CheckGreen;
