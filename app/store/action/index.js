import types from './type';

export default {
  saveNotifyId: (params) => ({type: types.SAVE_NOTIFY_ID, notifyId: params}),
  saveUserInfo: (userData) => ({type: types.SAVE_USER_INFO, userData}),
  getMessageInterface : (info) => ({type: types.GET_MESSAGE_INFO, info }),
  getUserName: (userAllInfo) => ({type: types.GET_PEOPLE_INFO, userAllInfo}),
  exitLoginClear: () => ({type: types.CLEAR}),
  userIntegral: (userData) => ({type: types.GET_USER_INTEGRAL, userData})
}

