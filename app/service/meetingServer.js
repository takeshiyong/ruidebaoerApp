import request from '../utils/request';

export default  {
    //查询所有会议类型
    getMeetingType: () => request.get(`/production-security-service/TMettingType/selectAll`),
    //查询所有会议类型
    getMeetingRoom: () => request.get(`/production-security-service/TMettingRoom/selectAll`),
    //创建会议
    createMeeting: (params) => request.post(`/production-security-service/meeting/create`,params),
    //获取消息内容
    meetingHomepage: (params) => request.post(`/production-security-service/meeting/meetingHomepage`,params),
    //新增删除人员接口
    meetingOperation: (params) => request.post(`/production-security-service/meeting/mettingPerson/operation`,params),
    //会议主页管理会议时间
    meetingHomepageTime: (params) => request.post(`/production-security-service/meeting/homepageTime`,params),
    //会议详情展示（移动端）
    messageGetDetail: (req) => request.get(`/production-security-service/meeting/details/${req}`),
    //上传会议纪要
    minutesOfMetting: (params) => request.post(`/production-security-service/meeting/minutesOfMetting/add`,params),
    //将某一个参与人设置为记录人
    changeParterToRecord: (params) => request.post(`/production-security-service/meeting/changeParterToRecord`,params),
    //开始会议
    messageBegin: (meetingId) => request.get(`/production-security-service/meeting/begin/${meetingId}`),
    //结束会议
    messageEnd: (meetingId) => request.get(`/production-security-service/meeting/end/${meetingId}`),
    //取消会议
    meetingCancel: (params) => request.post(`/production-security-service/meeting/cancel`,params),
    //编辑会议
    meetingUpdate: (params) => request.post(`/production-security-service/meeting/update`,params),
    //抄送我的未读信息
    sendToMeUnread : () => request.get(`/production-security-service/meeting/sendToMeUnread`),
    //抄送我的页面，历史会议页面
    historyPage: (params) => request.post(`/production-security-service/meeting/historyPage`,params),
    //是否参加会议
    sendDeedback: (params) => request.post(`/production-security-service/meeting/deedback`,params),
    //参会人列表(移动端)
    getEchartsData : (fId) => request.get(`/production-security-service/meeting/attendIntention/${fId}`),
    //会议抄送变为已读
    changeReaded: (meetingId) => request.get(`/production-security-service/meeting/changeReaded/${meetingId}`),
    //修改会议纪要
    minutesOfMettingUpload: (params) => request.post(`/production-security-service/meeting/minutesOfMetting/update`,params),

}   