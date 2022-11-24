import calculatedData from "../dto/calculatedData";

// 현재 초록불인지 아닌지 확인해주는 함수
function CheckGreen(time, term) {

    const greenMinutesStart = Number(time[0] + time[1]);
    const greenSecondStart = Number(time[3] + time[4]);
    let greenMinutesEnd = greenMinutesStart;
    let greenSecondEnd = greenSecondStart + term;

    if (greenSecondEnd >= 60) {
        greenMinutesEnd += 1;
        greenSecondEnd = (greenSecondEnd) % 60;
    }

    const date = new Date();
    const minutes = date.getMinutes() % 3;
    const second = date.getSeconds();



    if (minutes >= greenMinutesStart && minutes <= greenMinutesEnd && second >= greenSecondStart && second <= greenSecondEnd) {
        const greenLeft = ((greenMinutesEnd * 60) - (minutes * 60)) + (greenSecondEnd - second)
        // return `초록불, 초록불 남은 시간 ${greenLeft}초`
        return new calculatedData('초록불', greenLeft)
    } else {
        const leftSecond = second + (minutes * 60)
        const greenTime = (greenMinutesStart * 60) + greenSecondStart 
        let returnTime = 0;

        if (leftSecond < greenTime) {
            returnTime = greenTime - leftSecond
        }else{
            returnTime = 180 - leftSecond + greenTime
        }


        // return `빨간불, 초록불까지 남은 시간 ${returnTime}초`
        return new calculatedData('빨간불', returnTime)
    }

}

export default CheckGreen;