import types from './type';

export default {
    //会议类型
    saveMeetingType: (params) => ({type: types.SAVE_MEETING_TYPE, meetingType: params}),
    //会议室
    saveMeetingRoom: (params) => ({type: types.SAVE_MEETING_ROOM, meetingRoom: params}),
    //获取会议id
    getMeetingId: (params) => ({type: types.SAVE_MEETING_ID, id: params}),
}