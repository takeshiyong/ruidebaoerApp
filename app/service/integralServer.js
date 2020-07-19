import request from '../utils/request';

export default  {
    //根据用户id分页查询积分明细
  getIntegralRules: (params) => request.post(`/user-service/integralDetail/selectPageByUserId`, params),
  //查询所有的商品类型信息
  getTCommCategory: () => request.post(`/integral-mall-service/TCommCategory/selctAll`),
  //新增商品信息
  addTCommodity: (params) => request.post(`/integral-mall-service/TCommodity/addTCommodity`, params),
  //移动端分页查询商品信息（根据商品状态和商品类型）
  selectCommMobeilByPage: (params) => request.post(`/integral-mall-service/TCommodity/selectCommMobeilByPageRes`, params),
  //订单页查询
  selectOrderPage: (params) => request.post(`/integral-mall-service/order/orderPage`, params),
  //兑换页记录时间分页查询
  selectRedemptionRecord: (params) => request.post(`/integral-mall-service/order/redemptionRecord`, params),
  //兑换页记录详情查询
  selectForDetails: (params) => request.post(`/integral-mall-service/order/forDetails`, params),
  //核销确认页核销信息
  getForDetails: (fId) => request.get(`/integral-mall-service/order/writeOffInformation/${fId}`),
  //商品核销
  writeOffStatus: (fId) => request.get(`/integral-mall-service/order/writeOffStatus/${fId}`),
  //核销记录页
  getWriteOffRecordPage: (params) => request.post(`/integral-mall-service/order/writeOffRecordPage`, params),
  //修改商品信息
  updateTCommodity: (params) => request.post(`/integral-mall-service/TCommodity/updateTCommodity`,params),
  //兑换商品
  insertOrder: (params) => request.post(`/integral-mall-service/order/insertOrder`,params),
  
  //商品管理查询
  seleMobileCommByPage: (params) => request.post(`/integral-mall-service/TCommodity/seleMobileCommByPage`,params),
  //主键fId删除商品信息
  delById: (fId) => request.get(`/integral-mall-service/TCommodity/delById/${fId}`),
  //上架
  insertTCommDetai: (params) => request.post(`/integral-mall-service/TCommDetai/insertTCommDetai`,params),
  //查询单个商品上架记录
  selectCommDetailByCommId: (fId) => request.get(`/integral-mall-service/TCommodity/selectCommDetailByCommId/${fId}`),
  //下架商品
  ShellOffComm: (fId) => request.get(`/integral-mall-service/TCommodity/ShellOffComm/${fId}`),
  //修改上下架记录
  updateShellOnRecord: (params) => request.post(`/integral-mall-service/TCommodity/updateShellOnRecord`,params),
  //删除商品上架记录
  delShellByFId: (fId) => request.post(`/integral-mall-service/TCommodity/delShellByFId/${fId}`),
  //根据类型查询值
  selectByType: (type) => request.get(`/integral-mall-service/configuration/selectByType/${type}`),


};
