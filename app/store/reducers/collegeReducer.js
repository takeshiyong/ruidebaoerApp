import types from '../action/type';
const initState = {
    courseSort: []
};
/**
 * @param {*} state 初始状态 
 * @param {*} action 每一个redux传过来的事件，包括时间描述和传递的值
 */
export const collegeReducer = (state = initState, action) => {
    switch (action.type) {
        case types.SAVE_COURSE_INFO: 
            return {
                ...state,
                courseSort: action.obj,
            };
        default:
            return state
  }
}