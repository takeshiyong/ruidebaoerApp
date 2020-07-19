import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, TextInput, Linking} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SplashScreen from 'react-native-splash-screen';
import moment from 'moment';
import { connect } from 'react-redux';

import Header from '../../components/header';
import Toast from '../../components/toast';
import LevelShow from '../../components/levelShow';
import ConfirmModal from '../../components/confirmModal';
import AppendixUpload from '../../components/AppendixUpload/appendixUpload';
import troubleService from '../../service/troubleService';
import CameraUpload from '../../components/ImageAbout/CameraUpload';
import { handlePhotoToJs, parseDate } from '../../utils/handlePhoto';
import config from '../../config/index';
import SelectPeople from '../../components/selectPeople';

const {width, height} = Dimensions.get('window');
class TroubleSafeNotify extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null,
        
    });

    state = {
      type: 1,
      value: [],
      picArr: [],
      detail: {},
      confirmOperation: 0, // 不显示
      showModal: false,
      selectPeople: null,
      handleArr: [],
      fileArr: [],
      selectPeopleArr: [], // 数据结构 [{fId: , fUserName}]
      userArr: [],
      showMarkBtn: false
    }

    componentDidMount() {
      SplashScreen.hide();
      if (this.props.navigation.state.params && this.props.navigation.state.params.item) {
        // this.chooseItem(this.props.navigation.state.params.depId);
        this.getTrounbleDetail(this.props.navigation.state.params.item);
      }
      // 操作整改
      if (this.props.navigation.state.params && this.props.navigation.state.params.confirmOperation) {
        this.setState({
          confirmOperation: 1, // 显示整改确认
        });
      }
      // 确认完成
      if (this.props.navigation.state.params && this.props.navigation.state.params.markOperation) {
        this.setState({
          confirmOperation: 2, // 显示整改确认
        });
      }
      // 销号
      if (this.props.navigation.state.params && this.props.navigation.state.params.success) {
        this.setState({
            confirmOperation: 3, // 显示销号
        })
      }
      if (this.props.navigation.state.params && this.props.navigation.state.params.showOperating) {
        this.setState({
            confirmOperation: 5, // 显示撤回
        })
      }
    }

    // 通过fid获取详情数据
    getTrounbleDetail = async (item) => {
        const { detail } = this.state;
      global.loading.show();
      const res = await troubleService.getTroubleDetailById(item.fId);
      console.log('res', res);
      global.loading.hide();
      if (res.success) {
          this.setState({
              detail: res.obj,
              picArr: handlePhotoToJs(res.obj.reportImg),
              handleArr: res.obj.finishImg ? handlePhotoToJs(res.obj.finishImg) : [],
              fileArr: res.obj.finishFile ? handlePhotoToJs(res.obj.finishFile) : [],
              userArr: res.obj.fCopyUsers ? res.obj.fCopyUsers.map((data)=>({fId: data.fUserId, fUserName: data.fUserName})): [],
              selectPeopleArr: res.obj.fDisposeUsers ? res.obj.fDisposeUsers.map((data)=>({fId: data.fUserId, fUserName: data.fUserName})) : []
          },() => {
              console.log('dsadsadsa')
              if (this.state.detail.fState == 4) {
                  console.log('1231231');
                this.getLeadByList()
              }
          });
      } else {
          Toast.show(res.msg);
      }
    }

    // 获取责任部门负责人比对是否有整改完成按钮
     getLeadByList = async () => {
        const { detail } = this.state;
        const currentDepId = this.state.detail.fDutyDepId;
        const res = await troubleService.selectLeadByList(currentDepId);
        if (res.success) {
            for (let obj of res.obj) {
                if (obj.fId == this.props.userInfo.fEmployeeId) {
                    this.setState({
                        showMarkBtn: true
                    });
                    break;
                }
            }
        }
    }

    // 拒绝整改
    refuseRectification = () => {
      const { selectPeopleArr } = this.state;
    //   if (selectPeopleArr.length == 0) {W
    //     Toast.show('隐患整改人不能为空');
    //     return;
    //   } 
      this.setState({
        showModal: true
      })
    }

    // 拒绝状态选择了确认事件
    rejectOk = (text) => {
      console.log(text);
      if (text.trim().length == 0) {
        Toast.show('拒绝原因不能为空');
        return;
      }
      this.setState({ showModal: false }, ()=>this.refuseRectificationAjax(text));
    }

    // 拒绝状态选择了取消事件
    rejectCancel = () => {
      const { navigate,goBack,state } = this.props.navigation;
      
      this.setState({showModal: false});
    }

    // 调用确认整改接口
    confirmRectification = async () => {
      const { selectPeopleArr, detail} = this.state;
      const { goBack, state } = this.props.navigation;
      if (selectPeopleArr.length == 0) {
        Toast.show('隐患整改人不能为空');
        return;
      } 
      global.loading.show();
      const res = await troubleService.confirmHiddenTrouble({
        fDisposeUsers: selectPeopleArr.map((data)=>({fUserId: data.fId})),
        fId: detail.fId
      })
      global.loading.hide();
      if (res.success) {
        Toast.show(res.msg);
        this.getTrounbleDetail(detail);
        this.setState({
          confirmOperation: 2
        })
      } else {
        Toast.show(res.msg);
      }
    }

    // 整改完成
    markComplete = () => {
      const { detail,  } = this.state;
      const { goBack, state, navigate, replace } = this.props.navigation;
      replace({routeName: 'RectificationResult', params: {item: detail, refresh: state.params.refresh}})
    }

    // 调用拒绝整改接口
    refuseRectificationAjax = async (text) => {
      const { detail } = this.state;
      const { goBack, state } = this.props.navigation;
      global.loading.show();
      const res = await troubleService.rejectHiddenTrouble({
        fId: detail.fId,
        fRejectCount: text.trim()
      })
      global.loading.hide();
      if (res.success) {
        Toast.show(res.msg);
        goBack();
        state.params.refresh && state.params.refresh();
      } else {
        Toast.show(res.msg);
      }
    } 

    // header标题显示
    titleReturn = () => {
        const { detail } = this.state;
        if (detail.fState == 6) {
            return '销号隐患信息';
        } else if (detail.fState == 1 || detail.fState == 2) {
            return '隐患信息';
        } else {
            return '安全整改通知单';
        }
    }

    // 跳转查看隐患操作相关人
    jumpAboutPeoplePage = () => {
        const { navigate } = this.props.navigation;
        const { detail } = this.state;
        navigate('TroublePeople', {item: detail});
    }

    // 撤回
    markWithdraw = async () => {
        const { detail } = this.state;
        const { goBack, state, replace } = this.props.navigation;
        global.loading.show();
        const res = await troubleService.revocationTrouble(detail.fId);
        global.loading.hide();
        if (res.success) {
            Toast.show(res.msg);
            // goBack();
            // state.params.refresh && state.params.refresh();
            replace({routeName: 'TroubleJudgment', params: {item: detail, refresh: state.params.refresh}})
        } else {
            Toast.show(res.msg);
        }
    }
    
    // 跳转研判页面
    toJudgmentPage = () => {
        const { navigate, goBack, state, replace } = this.props.navigation;
        const { detail } = this.state;
        replace({routeName: 'TroubleJudgment', params: {item: detail, refresh: state.params.refresh}})
    }

    render() {
        const { detail, showModal } = this.state;
        const { navigate, goBack, state, replace } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText={this.titleReturn()}
                    hidePlus={false} 
                    props={this.props}
                />
                <ConfirmModal 
                    showModal={showModal}
                    onClose={()=>this.setState({showModal: !showModal})}
                    onCancel={this.rejectCancel}
                    onOk={this.rejectOk}
                    title="请输入拒绝整改原因"
                    placeHolder="请填写拒绝整改原因"
                />
                <ScrollView style={{position: 'relative'}}>
                    <View style={styles.content}>
                        <TouchableOpacity style={[styles.item,{alignItems: "center", flexDirection: "row",height: 48,justifyContent: "space-between"}]}>
                            <View style={{flexDirection: "row",alignItems: "center", flex: 2}}>
                                <Image source={require("../../image/TroubleCallBack/info.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>编&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号</Text>
                            </View>
                            <View style={{flexDirection: "row", fontWeight: "600", alignItems: "center", flex: 3}}>
                                <Text style={{fontSize: 14, color: "#666"}}>{detail.fNo ? detail.fNo: '--'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.content]}>
                        <View style={styles.itemUnit}>
                            <View style={{flexDirection: "row",alignItems: "center",flex: 2}}>
                                <Image source={require("../../image/TroubleCallBack/userGroup.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>主送单位</Text>
                            </View>
                            <Text style={{color: "#666",fontSize: 14,flex: 3}}>{detail.fDutyDepName}</Text>
                        </View>
                        <View style={{marginTop: 10,borderBottomWidth: 1,borderBottomColor: '#E0E0E0',paddingBottom: 10}}>
                            <SelectPeople disabled={true} value={this.state.userArr} title={'抄送人'}/>
                        </View>
                        <View style={styles.itemUnit}>
                            <View style={{flexDirection: "row",alignItems: "center",flex: 2}}>
                                <Image source={require("../../image/troubleDetails/leavel.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>隐患级别</Text>
                            </View>
                            <View style={{flex: 3}}>
                                { detail.fLevelId ? 
                                    <LevelShow level={this.props.troubleLevelParam[detail.fLevelId]}/> : null
                                }
                            </View>
                        </View>
                        <View style={styles.itemUnit}>
                            <View style={{flexDirection: "row",alignItems: "center",flex: 2}}>
                                <Image source={require("../../image/troubleDetails/appsBig.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>隐患类型</Text>
                            </View>
                            <View style={{flex: 3}}>
                              <Text style={{color: "#666", fontSize: 14}}>{this.props.troubleTypeParam[detail.fTypeId]}</Text>
                            </View>
                        </View>
                        <View style={[styles.itemUnit,{borderBottomWidth: 0}]}>
                            <View style={{flexDirection: "row",alignItems: "center",flex: 2}}>
                                <Image source={require("../../image/troubleDetails/calendar.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>整改期限</Text>
                            </View>
                            <View style={{flex: 3}}>
                              <Text style={{color: "#666", fontSize: 14}}>
                                {detail.fPlanFinishTime ? parseDate(detail.fPlanFinishTime, 'YYYY-MM-DD HH:mm') : '--'}
                              </Text>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.content,{marginBottom: 18}]}>
                        <View style={{borderBottomColor: "#E0E0E0", borderBottomWidth: 1,paddingBottom: 15}}>
                            <View style={{flexDirection: "row",alignItems: "center",marginTop: 22,marginBottom: 13}}>
                                <Image source={require("../../image/TroubleCallBack/filePencil.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>隐患照片/视频</Text>
                            </View>
                            <View style={{flexDirection: "row",flexWrap: "wrap",justifyContent: "space-between"}}>
                                <CameraUpload
                                    value={this.state.picArr}
                                    disabled={true}
                                    onChange={(picArr)=>this.setState({picArr})}
                                    imgStyle={{width: width*0.26, height: width*0.26}}
                                />
                            </View>
                        </View>
                        <View style={{borderBottomColor: "#E0E0E0", borderBottomWidth: 1, paddingBottom: 15}}>
                          <View style={{flexDirection: "row",alignItems: "center",marginTop: 15,marginBottom: 13}}>
                              <Image source={require("../../image/TroubleCallBack/filePencil.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                              <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>隐患地点</Text>
                          </View>
                          <View style={{flexDirection: "row",flexWrap: "wrap",justifyContent: "space-between"}}>
                            <Text style={{fontSize: 14, color: "#666666"}}>{detail.fSite||'--'}</Text>
                          </View>
                        </View>
                      <View style={{borderBottomColor: "#E0E0E0", borderBottomWidth: 1,paddingBottom: 15}}>
                          <View style={{flexDirection: "row",alignItems: "center",marginTop: 22,marginBottom: 13}}>
                              <Image source={require("../../image/TroubleCallBack/filePencil.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                              <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>存在问题</Text>
                          </View>
                          <View style={{flexDirection: "row",flexWrap: "wrap",justifyContent: "space-between"}}>
                            <Text style={{fontSize: 14, color: "#666666"}}>{detail.fContent||'--'}</Text>
                          </View>
                      </View>
                      <View style={{borderBottomColor: "#E0E0E0", borderBottomWidth: this.state.confirmOperation == 3 ? 1 : 0, marginBottom: 10,paddingBottom: 10}}>
                          <View style={{flexDirection: "row",alignItems: "center",marginTop: 22,marginBottom: 13}}>
                              <Image source={require("../../image/troubleDetails/msg.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                              <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>整改措施</Text>
                          </View>
                          <View style={{flexDirection: "row",flexWrap: "wrap",justifyContent: "space-between"}}>
                            <Text style={{fontSize: 14, color: "#666666"}}>{detail.fMeasures||'--'}</Text>
                          </View>
                      </View>
                      { this.state.confirmOperation == 3 ?
                        <View style={[styles.item,{alignItems: "center", flexDirection: "row",height: 48,justifyContent: "space-between",borderBottomColor: "#E0E0E0", borderBottomWidth: 1}]}>
                            <View style={{flexDirection: "row",alignItems: "center", flex: 2}}>
                                <Image source={require("../../image/troubleDetails/user.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>负责人</Text>
                            </View>
                            <Text style={{fontSize: 14, color: "#666666",flex: 3}}>
                              {detail.fDisposeUserName || '--'}
                            </Text>
                        </View>: null }
                        { this.state.confirmOperation == 3 ?
                            <View style={{borderBottomColor: "#E0E0E0", borderBottomWidth: 1,paddingBottom: 15}}>
                                <View style={{flexDirection: "row",alignItems: "center",marginTop: 22,marginBottom: 13}}>
                                    <Image source={require("../../image/troubleDetails/msg.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                    <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>整改备注</Text>
                                </View>
                                <View style={{flexDirection: "row",flexWrap: "wrap",justifyContent: "space-between",marginBottom: 10}}>
                                    <Text style={{fontSize: 14, color: "#666666"}}>{detail.fRemark||'--'}</Text>
                                </View>
                                <View style={{flexDirection: "row",flexWrap: "wrap",justifyContent: "space-between"}}>
                                    <CameraUpload
                                        value={this.state.handleArr}
                                        disabled={true}
                                        onChange={(picArr)=>this.setState({handleArr: picArr})}
                                        imgStyle={{width: width*0.26, height: width*0.26}}
                                    />
                                </View>
                            </View>
                        : null }
                        { this.state.confirmOperation == 3 ?
                        <View style={[styles.item, {paddingBottom: 10, flexDirection: 'row', alignItems: 'flex-start'}]}>
                            <View style={{flexDirection: "row",alignItems: "center",marginTop: 22,marginBottom: 5, flex: 2}}>
                                <Image source={require("../../image/TroubleCallBack/paperclipCircle.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>附件</Text>
                            </View>
                            <View style={{flex: 3,marginTop: 20}}>
                                <AppendixUpload disabled={true} value={this.state.fileArr} onChange={(arr)=>this.setState({fileArr:arr})}/>
                            </View>
                        </View> : null}
                    </View>
                    <TouchableOpacity onPress={this.jumpAboutPeoplePage} style={{flexDirection: 'row',alignItems:'center',justifyContent: 'space-between',backgroundColor: '#fff',padding: 15}}>
                        <View style={{flexDirection: "row",alignItems: "center", flex: 2}}>
                            <Image source={require("../../image/TroubleCallBack/userGroup.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                            <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>查看隐患操作相关人</Text>
                        </View>
                        <AntDesign name="right" color="#666666"/>
                    </TouchableOpacity>
                    {this.state.confirmOperation != 1 && this.state.confirmOperation != 2 && this.state.confirmOperation != 4 ? null :
                    <View style={[styles.content,{marginBottom: 18,paddingTop: 15,marginTop: 0}]}>
                        { this.state.confirmOperation == 1 || this.state.confirmOperation == 4 ?
                          <SelectPeople title="隐患整改人" required={true} detail={detail} value={this.state.selectPeopleArr} onChange={(data)=>this.setState({selectPeopleArr: data}, ()=>console.log('this.state.selectPeopleArr', this.state.selectPeopleArr))}/>
                        : null}
                        
                        { this.state.confirmOperation == 2 ?
                          <SelectPeople title="隐患整改人" disabled={true} detail={detail} value={this.state.selectPeopleArr} onChange={(data)=>this.setState({selectPeopleArr: data})}/>
                        : null }
                    </View>}
                </ScrollView>
                { this.state.confirmOperation == 1 ?
                   <View style={styles.botton}>
                   {
                        detail.fRefusedNumber > 0 ? null :
                        <TouchableOpacity style={styles.bottomLeft} onPress={this.refuseRectification}>
                            <Text style={{color: "#333", fontSize: 14}}>拒绝整改</Text>
                        </TouchableOpacity>
                   }
                   <TouchableOpacity style={styles.bottomRight} onPress={this.confirmRectification}>
                       <Text style={{color: "#fff", fontSize: 14}}>确认整改</Text>
                   </TouchableOpacity>
                 </View>
                  : null }
                { this.state.confirmOperation == 2 && this.state.showMarkBtn ?
                   <View style={styles.botton}>
                   <TouchableOpacity style={styles.bottomRight} onPress={this.markComplete}>
                       <Text style={{color: "#fff", fontSize: 14}}>整改完成</Text>
                   </TouchableOpacity>
                 </View>
                  : null }
                { detail.fState == 3 && this.state.confirmOperation == 5 ?
                    <View style={styles.botton}>
                        <TouchableOpacity style={styles.bottomRight} onPress={this.markWithdraw}>
                            <Text style={{color: "#fff", fontSize: 14}}>撤回</Text>
                        </TouchableOpacity>
                    </View>
                  : null }
                { (detail.fState == 7 || detail.fState == 8 || detail.fState == 10) && !this.props.showOperating ?
                    <View style={styles.botton}>
                        <TouchableOpacity style={styles.bottomRight} onPress={this.toJudgmentPage}>
                            <Text style={{color: "#fff", fontSize: 14}}>去研判</Text>
                        </TouchableOpacity>
                    </View>
                  : null }
            </View>
        );
    }
}

const mapStateToProps = state => ({
  troubleLevelParam: state.troubleReducer.troubleLevelParam,
  troubleTypeParam: state.troubleReducer.troubleTypeParam,
  userInfo: state.userReducer.userInfo
});

export default connect(mapStateToProps)(TroubleSafeNotify);

const styles = StyleSheet.create({
        
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        display: "flex"
    },
    content: {
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: "#fff",
        marginTop:10
    },
    itemImage: {
        alignItems: "center",
        width: (width-64)/3,
        height: (width-64)/3,
        backgroundColor: "#F0F1F6",
        borderRadius: 5,
        justifyContent: "center",
        marginBottom: 16,
    },
    itemUnit: {
        flexDirection: "row",
        height: 48,
        alignItems: "center",
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1,
        justifyContent: "space-between"
    },
    botton: {
        borderTopColor: "#E0E0E0",
        borderTopWidth: 1,
        height: 59,
        alignItems: "center", 
        paddingLeft: 16, 
        paddingRight: 16, 
        flexDirection: "row", 
        justifyContent: "space-between",
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: "#fff"
    },
    bottomLeft: {
        flex: 2,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 13,
        height: "100%",
        borderRadius: 5
    },
    bottomRight: {
        flex: 3,
        backgroundColor: "#4058FD", 
        alignItems: "center", 
        justifyContent: "center",
        height: "100%",
        borderRadius: 5
    }
    
});
