import types from '../action/type';
const initState = {
    deviceTypes: [],
    deviceTypeParam: {}
};
/**
 * @param {*} state 初始状态 
 * @param {*} action 每一个redux传过来的事件，包括时间描述和传递的值
 */
export const deviceReducer = (state = initState, action) => {
    switch (action.type) {
        case types.SAVE_DEVICE_TYPE: 
            let data = {}
            for (let obj of action.typeList) {
                data[obj.fId] = obj.fTypeName;
            }
            return {
                ...state,
                deviceTypes: action.typeList,
                deviceTypeParam: data
            };
        default:
            return state
  }
}