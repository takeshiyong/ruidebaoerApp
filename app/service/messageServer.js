import request from '../utils/request';

export default  {
  //消息列表内容获取
  messageGet: (params) => request.post(`/message-service/notice/selectbypage`, params),
  //消息设为以读
  messageReaded: (noticetargetid) => request.get(`/message-service/notice/read/${noticetargetid}`),
  //查询是否有未读消息
  messageIsReaded: (userid) => request.get(`/message-service/notice/unread/${userid}`)
};

