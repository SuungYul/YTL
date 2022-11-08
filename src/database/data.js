import { toHaveDisplayValue } from "@testing-library/jest-dom/dist/matchers";
import { forwardRef } from "react";

/**
 * 파이어베이스를 위한 클래스
 * 
 * get getConvertor:
 *  Firebase 에서 convertor를 사용하기 위해서 자동화한 함수
 * 
 * get getObject:
 *  ForFirebase의 속성을 제외한 오브젝트 내부의 있는 property를 가져옴
 */
 class ForFirebase{
    //getObject에서 무시할 속성의 이름과 타입
    ignoreProperty;
    ignoreType;
    
    //ForFirebase 기본속성
    toFirestore;
    fromFirestore;

    constructor(){
        this.ignoreKeyword = new Array("ignoreKeyword", "ignoreType", "toFirestore", "fromFirestore");
        this.ignoreType = new Array("function");

        this.toFirestore = (obj) => { return this.getObject; };
        this.fromFirestore = (snapshot, options) => {
            const args = snapshot.data(options);
            return this.buildObject(args);
        };
    }

    /**
     * buildObject({...}) 형태의 클래스 생성자
     * @param {object} args 해당 클래스를 생성하기 위한 변수를 가진 {키: 값} 쌍의 오브젝트 
     * @returns {ForFirebase}
     */
    buildObject(args){
        let result = new this.constructor();
        for(const [key, value] of Object.entries(args)){
            result[key] = value;
        } 
        return result;
    }

    //디버그용 출력을 위한 toString
    toString(){
        let result = `===${typeof this}===\n`;
        for(const [key, value] of Object.entries(this)){
            if(this.checkIgnore(key)) continue;
            if(this.checkIgnore(value)) continue;

            result += `${key}: ${value}\n`;
        } 

        return result;
    }

    checkIgnore(key){
        return this.ignoreKeyword.includes(key) || this.ignoreType.includes(key);
    }

    get getConvertor(){
        return {
            toFirestore: this.toFirestore,
            fromFirestore: this.fromFirestore
        };

    }

    get getObject(){
        let result = {};
        for(const [key, value] of Object.entries(this)){
            if(this.checkIgnore(key)) continue;
            if(this.checkIgnore(value)) continue;
            
            result[key] = value;
        }

        return result;
    }
};

/**
 * User 클래스
 * 
 * 임시적으로 User 클래스를 작성함
 */
class User extends ForFirebase{
    constructor(id, pw, name, team, userID, 
                playCount, badPoint, userKey, history,
                currentReserve){
        super();
        this.id = id;
        this.pw = pw;
        this.name = name;
        this.team = team;
        this.userID = userID;
        this.playCount = playCount;
        this.badPoint = badPoint;
        this.userKey = userKey;
        this.history = history;
        this.currentReserve = currentReserve;
    }
};

class Team extends ForFirebase{
    constructor(leader, member, teamName){
        super();
        this.leader = leader;
        this.member = member;
        this.teamName = teamName;
    }
};

class ReserveTeam extends ForFirebase{
    constructor(teamInfo, playerArray, playCount, day, time, order, withOther=false){
        super();
        this.playerArray = playerArray;
        this.playCount = playCount;
        this.teamInfo = teamInfo;
        this.day = day;
        this.time = time;
        this.order = order;
        this.withOther = withOther
    }
    get countArray(){
        return this.playerArray.length;
    }
    get hasTeam(){
        return this.teamInfo != -1? this.teamInfo: null;
    }
};

class MatchInfo extends ForFirebase{
    constructor(team1, team2 , allPlayerArray, day, time){
        super();
        this.allPlayerArray = allPlayerArray;
        this.team1 = team1;
        this.team2 = team2;
        this.day = day;
        this.time = time;
    }
};

export {ForFirebase, User, Team, ReserveTeam, MatchInfo};
