import calculatedData from "../database/calculatedData";

// 현재 초록불인지 아닌지 확인해주는 함수
function CheckGreen(time, term, waitTime) {
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

    let greenMinutesEnd = greenMinutesStart;
    let greenSecondEnd = greenSecondStart + term;
    // console.log(greenMinutesStart,greenMinutesEnd)

    if (greenSecondEnd >= 60) {
        greenMinutesEnd = greenMinutesEnd + (greenSecondEnd / 60).toFixed()
        greenMinutesEnd = Number(greenMinutesEnd)
        greenSecondEnd = greenSecondEnd % 60;
    }

    const date = new Date();
    let minutes = date.getMinutes();
    minutes = minutes % 3
    let second = date.getSeconds();
    console.log(minutes,greenMinutesStart,greenMinutesEnd,second,greenSecondStart,greenSecondEnd)
    let leftSecond = (minutes * 60) + second
    let greenTimeStart = (greenMinutesStart * 60) + greenSecondStart;
    let greenTimeEnd = (greenMinutesEnd * 60) + greenSecondEnd;
    

    if (
        (greenTimeStart <= leftSecond) &&
        (leftSecond <= greenTimeEnd)
    ) {
        console.log(leftSecond,greenTimeStart,greenTimeEnd)
        let greenLeft = greenTimeEnd - leftSecond
        // // return `초록불, 초록불 남은 시간 ${greenLeft}초`
        // console.log("초록", greenLeft)
        return new calculatedData("초록불", greenLeft);
    } else {

        let returnTime = 0;

        if (leftSecond < greenTimeStart) {
            returnTime = greenTimeStart - leftSecond;
        } else {
            returnTime = 180 - leftSecond + greenTimeStart;
        }

        // return `빨간불, 초록불까지 남은 시간 ${returnTime}초`
        // console.log("빨간", returnTime)
        return new calculatedData("빨간불", returnTime);
    }

}


export default CheckGreen;
