import types from '../action/type';

const initState = {
  notifyId: '',
    userInfo: {
    "fId": "",
    "fLoginName": "",
    "fPassword": null,
    "fEmployeeId": "41eebce8bb3b4625988a65687c21f3ea",
    "fRegisterTime": "",
    "fLastLoginIp": "",
    "fLastLoginTime": "",
    "fLoginCount": 0,
    "fIsEnable": null,
    "fIsDelete": null,
    "webtoken": "",
    "fUserName": ""
    },
  
//   userInfo: null, 
  messageInfo: false,
  troubleName: {},
  userAllInfo: [],
  userIntegral: {
    "fId": "845fa1adfc224fd59a67ae1530ed01a6",
    "fCardNumber": "2019080510027",
    "fAllIntegral": 0,
    "fUseIntegral": 0,
    "fIsDelete": false,
    "fIsEnable": true,
    "fAllMoney": 0,
    "fUseMoney": 0
  }
};

/**
 * @param {*} state 初始状态 
 * @param {*} action 每一个redux传过来的事件，包括时间描述和传递的值
 */
export const userReducer = (state = initState, action) => {
    let data = {};
    console.log('action.type', action.type, action.userData )
    switch (action.type) {
        case types.CLEAR: 
            return initState;
        case types.SAVE_NOTIFY_ID:
            return {
                ...state,
                notifyId: action.notifyId 
            };
        case types.SAVE_USER_INFO:
            return {
                ...state,
                userInfo: action.userData 
            };  
        case types.GET_MESSAGE_INFO:
            return {
                ...state,
                messageInfo: action.info
            }
        case types.GET_USER_INTEGRAL: 
            return {
                ...state,
                userIntegral: action.userData
            }
        case types.GET_PEOPLE_INFO: 
            for (let obj of action.userAllInfo) {
                data[obj.fId] = obj.fUserName;
            }
            return {
                ...state,
                userAllInfo: action.userAllInfo,
                troubleName: data
            };
        default:
            return state
  }
}


