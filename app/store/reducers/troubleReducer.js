import types from '../action/type';

const initState = {
  troubleLevel: [],
  troubleType: [],
  troubleLevelParam: {},
  troubleTypeParam: {},
};

/**
 * @param {*} state 初始状态 
 * @param {*} action 每一个redux传过来的事件，包括时间描述和传递的值
 */
export const troubleReducer = (state = initState, action) => {
    let data = {};
    switch (action.type) {
        case types.CLEAR: 
            return initState;
        case types.SAVE_TROUBLE_LEVEL:
            for (let obj of action.troubleLevel) {
                data[obj.fId] = obj.fLevelName;
            }
            return {
                ...state,
                troubleLevel: action.troubleLevel,
                troubleLevelParam: data
            };
        case types.SAVE_TROUBLE_TYPE: 
            let typeImg = {};
            for (let obj of action.troubleType) {
                data[obj.fId] = obj.fTypeName;
                typeImg[obj.fId] = obj.tFileManagementDTO.fFileLocationUrl;
            }
            return {
                ...state,
                troubleType: action.troubleType,
                troubleTypeParam: data,
                troubleImgParam: typeImg
            };
        default:
            return state
  }
}