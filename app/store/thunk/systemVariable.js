import Trouble from '../../service/troubleService';
import TroubleAction from '../action/trouble';
import Message from '../../service/messageServer';
import MessageAction from '../action/index';
import User from '../../service/userService';
import UserAction from '../action/index';
import College from '../../service/collegeServer';
import CollegeAction from '../action/college';
import Meeting from '../../service/meetingServer';
import MeetingAction from '../action/meeting';
import Device from '../../service/deviceServer';
import DeviceAction from '../action/device';
/**
 * 该js是直接调取接口数据，存入redux的文件
 * 调取方法为页面交由redux管理之后(connect)
 * 使用this.props.dispatch()直接调用
 */


 /**
  * 通过接口获取所有隐患级别信息
  */
export function getAllTroubleLevel() {
  return dispatch => {
    Trouble.getTroubleLevel()
      .then((data)=>{
        console.log('获取隐患级别信息：', data);
        if (data.success) {
          dispatch(TroubleAction.saveToubleLevel(data.obj));
        }
      })
  }
}

/**
 * 通过接口获取所有隐患类型信息
 */
export function getAllTroubleType() {
  return dispatch => {
    Trouble.getTroubleType()
      .then((data)=>{
        console.log('获取隐患类型：', data);
        if (data.success) {
          dispatch(TroubleAction.saveToubleType(data.obj))
        }
      })
  }
}

/**
 * 通过接口查询是否有未读消息
 */
export function getMessageInfo(userid) {
  return dispatch => {
    Message.messageIsReaded(userid)
      .then((data)=>{
        console.log('是否有未读消息：', data);
        if (data.success) {
          dispatch(MessageAction.getMessageInterface(data.obj.existNotice))
        }
      })
  }
}

/**
 * 通过接口查询全部人员信息
 */
export function getAllUserName(userid) {
  return dispatch => {
    User.getPeopleInfo()
      .then((data)=>{
        console.log('获取全部人员信息：', data);
        if (data.success) {
          dispatch(UserAction.getUserName(data.obj))
        }
      })
  }
}

//获取课程所有类型
export function getSortname() {
  return dispatch => {
    College.getSortname()
    .then((data) => {
      console.log('获取课程类型信息: ', data);
      if(data.success){
        dispatch(CollegeAction.saveCourseInfo(data.obj))
      }
    })
  }
}

// 查询积分数量
export function getUserIntegral() {
  return dispatch => {
    User.getUserIntegral()
    .then((data)=>{
      console.log('查询积分数量：', data);
      if (data.success) {
        dispatch(UserAction.userIntegral(data.obj))
      }
    })
  }
}

// 获取会议所有类型

export function getMeetingType() {
  return dispatch => {
    Meeting.getMeetingType()
    .then((data) => {
      console.log('会议类型:', data);
      if(data.success){
        dispatch(MeetingAction.saveMeetingType(data.obj))
      }
    })
  }
  
  
}

// 获取会议所有会议室
export function getMeetingRoom() {
  return dispatch => {
    Meeting.getMeetingRoom()
    .then((data) => {
      console.log('会议室:', data);
      if(data.success){
        dispatch(MeetingAction.saveMeetingRoom(data.obj))
      }
    })
  }
}
//获取会议id
export function messageGetDetail(req) {
  return dispatch => {
    Meeting.messageGetDetail(req)
    .then((data) => {
      console.log('会议数据:', data);
      if(data.success){
        dispatch(MeetingAction.getMeetingId(data.obj.mettingDetails.fId))
      }
    })
  }
}

// 获取设备大类型
export function getDeviceTypes() {
  return dispatch => {
    Device.getDeviceType()
    .then((data) => {
      console.log('设备大类型:', data);
      if(data.success){
        dispatch(DeviceAction.saveDeviceType(data.obj))
      }
    })
  }
}
