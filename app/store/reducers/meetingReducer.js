import types from '../action/type';

const initState = {
    meetingType : [],
    meetingRoom: [],
    meetingid: ''
}
export const meetingReducer = (state = initState, action) => {
    let data = {};
    console.log(action)
    switch(action.type){
        case types.SAVE_MEETING_TYPE:
            return {
                ...state,
                meetingType: action.meetingType 
            };
        case types.SAVE_MEETING_ROOM:
            return {
                ...state,
                meetingRoom: action.meetingRoom 
            };
        case types.SAVE_MEETING_ID:
            return {
                ...state,
                meetingid: action.id 
            };
        default:
            return state
    }
}