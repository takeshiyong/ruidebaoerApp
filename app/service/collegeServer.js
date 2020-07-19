import request from '../utils/request';

export default  {
  // 查询侧边栏的目录名
  getSortname: () => request.post(`/college-service/courseType/selectListByCondition`),  
  //分页查询课程信息
  getSelectListByCon: (params) => request.post(`/college-service/courseManagement/page/selectListByCondition`, params),
  //查询课程详情(关联查询) 
  getSelectDetails: (fCourseId) => request.get(`/college-service/courseManagement/selectDetails/${fCourseId}`),
  //查询文件路径
  openCoursewareFile: (fCoursewareId) => request.get(`/college-service/coursewareManagement/openCoursewareFile/${fCoursewareId}`),
  //首页推荐课程
  getSelectList: (params) => request.post(`/college-service/courseRecommend/page/selectList`, params),
  // 查询考试列表
  getTestList: (params) => request.post(`/college-service/examinationPaper/select`, params),
  //查询第一个未答题目信息
  selectSubjectDetail: (params) => request.post(`/college-service/examinationPaper/selectSubjectDetail`, params),
  //新增答题信息
  answerSubject: (params) => request.post(`/college-service/examinationPaper/answerSubject`, params),
  //查询答卷信息
  selectUserExam: (examPaperId) => request.get(`/college-service/examinationPaper/selectUserExam/${examPaperId}`),
  //查询试卷关联的题目
  selectExamSubjects: (examPaperId) => request.get(`/college-service/examinationPaper/selectExamSubjects/${examPaperId}`),
  //重置答题信息
  restartExam: (examPaperId) => request.get(`/college-service/examinationPaper/restartExam/${examPaperId}`),
  //分页查询培训计划
  trainplanSelectByPage: (params) => request.post(`/college-service/trainplan/selectByPage`, params),
  //查询所有培训类型名称
  TTrainTypeSelectAll: () => request.get(`/college-service/TTrainType/selectAll`),
  //移动端人员培训进度展示
  selectTrainProgressByPlaneId: (fTrainPlanId) => request.get(`/college-service/TrainProgress/selectTrainProgressByPlaneId/${fTrainPlanId}`),
  //查询培训计划详情
  selectTrainDetail: (trainPlanId) => request.get(`/college-service/trainplan/selectTrainDetail/${trainPlanId}`),
  //开始课程培训
  trainplanBeginTrain: (params) => request.post(`/college-service/trainplan/beginTrain`, params),
  //培训计划新增
  trainplanAdd: (params) => request.post(`/college-service/trainplan/add`, params),
  //培训计划修改
  trainplanUpdate: (params) => request.post(`/college-service/trainplan/update`, params),
  //删除培训计划
  trainplanDeleteById: (trainPlanId) => request.get(`/college-service/trainplan/deleteById/${trainPlanId}`),
  //统计培训学习情况
  statisticsLearnCondition: () => request.get(`/college-service/trainplan/statisticsLearnCondition`),
  //学习课件
  learnCourseWare: (params) => request.post(`/college-service/trainplan/learnCourseWare`, params),
  //查询最近学习课件所属课程
  selectLearnedCourseWare: () => request.get(`/college-service/trainplan/selectLearnedCourseWare`),

};

