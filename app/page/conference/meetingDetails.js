import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Modal, TextInput, Switch} from 'react-native';
import { connect } from 'react-redux';
import Picker from 'react-native-wheel-picker';
import Header from '../../components/header';
import ShowModal from '../../components/showShopModal';
import Toast from '../../components/toast';
import SelectAnotherPeople from '../../components/selectAnotherPeople';
import SelectPeople from '../../components/selectPeople';
import meetingServer from '../../service/meetingServer';
import { parseDate } from '../../utils/handlePhoto';
import config from '../../config/index';
import { messageGetDetail } from '../../store/thunk/systemVariable';
import SelectAgainPeople from '../../components/selectAgainPeople';
import CameraUpload from '../../components/ImageAbout/CameraUpload';

const {width, height} = Dimensions.get('window');

class mettingDetail extends Component {
    state = {
        currentStatus: 0,
        currentType: 1, //1: 初次进入 2: 其他页面跳入
        showType: '',
        cancelContent: "",
        carbonArr: [],
        affirmContent: '请确认参会人已到达【一车间会议室】,开始会议后,摄像设备将切换至录像状态，保存至会议影像，直至会议结束',
        obj: {},
        mettingPeople: [],
        meetingId: '',
        objs: {},
        mettingFiles: [],
        fDeedbackState: null,
        qPicture : [],
        hPicture : [],
    }
    //设置头部
    static navigationOptions = () => ({
        header: null
    });

    componentDidMount() {
        this.props.dispatch(messageGetDetail(this.props.navigation.state.params.id));
        this.messageGetDetail()
    }
    getCancelContent = (value) => {
        this.setState({
            cancelContent: value
        },() => {
            this.meetingCancel()
        })
    }
    getParticipate= (value) => {
        this.goToMeeting(3,value)
    }
    pushType = (value) => {
        if(value == '结束会议'){
            this.messageEnd();
        }else if(value == '开始会议'){
            this.messageBegin()
        }else if( value == '取消会议'){
            this.meetingCancel()
        }
        
    }
    //会议详情展示（移动端）
    messageGetDetail =  async () => {
        const res = await meetingServer.messageGetDetail(this.props.navigation.state.params.id)
        if(res.success){
            //获取职位
            getParam = (value) => {
                if(value == res.obj.mettingDetails.fMeetingInitiatorId){
                    return '创建人'
                }else if(value == res.obj.mettingDetails.fMeetingRecordId){
                    return '记录人'
                }else {
                    return '参与人'
                }
            }
            let arr = res.obj.mettingPeople.map((item) => ({
                'fUserName': item.fEmpoloyeeName,
                'fActualState': item.fActualState,
                'fDeedbackState': item.fDeedbackState,
                'fEmployeeId': item.fEmployeeId,
                'fId': item.fId,
                'fIsDelete': item.fIsDelete,
                'fMettingId': item.fMettingId,
                'fRefuseReason': item.fRefuseReason,
                'position': getParam(item.fEmployeeId)
            }))
            let initiator = {};
            let record = null;
            let another = []
            let anothers = [];
            arr.map((item) => {
                if (item.fEmployeeId == res.obj.mettingDetails.fMeetingRecordId){
                    record = item
                } else {
                    another.push(item)
                }
            });
            arr.map((item) => {
                if (item.fEmployeeId == this.props.fEmployeeId){
                    console.log(item)
                    this.setState({
                        fDeedbackState: item.fDeedbackState
                    })
                }
            })
            if (record) {
                anothers=[record,...another];
            } else {
                anothers=[...another];
            }
           
            let carbonArr = res.obj.mettingCopiers.map((item) => ({
                'fUserName': item.fEmployeeName,
                'fActualState': item.fActualState,
                'fDeedbackState': item.fDeedbackState,
                'fEmployeeId': item.fEmployeeId,
                'fId': item.fId,
                'fIsDelete': item.fIsDelete,
                'fMettingId': item.fMettingId,
                'fRefuseReason': item.fRefuseReason
            }))
            let qPicture = [];
            let hPicture = []; 
            res.obj.mettingFiles.map((item) => {
                if(item.fType == 1){
                    if(item.fFileType == 3){
                        qPicture.push({
                            id: item.fId,
                            path: item.fFileLocationUrl,
                            status:'success',
                            type: 1
                        })
                    }else if(item.fFileType == 6){
                        hPicture.push({
                            id: item.fId,
                            path: item.fFileLocationUrl,
                            status:'success',
                            type: 1
                        })
                    }
                }else if(item.fType == 2){
                    if(item.fFileType == 3){
                        qPicture.push({
                            id: item.fId,
                            path: item.fFileLocationUrl,
                            status:'success',
                            type: 2
                        })
                    }else if(item.fFileType == 6){
                        hPicture.push({
                            id: item.fId,
                            path: item.fFileLocationUrl,
                            status:'success',
                            type: 2
                        })
                    }
                }
            })
           this.setState({
               obj: res.obj.mettingDetails,
               mettingPeople: anothers,
               carbonArr:carbonArr,
               mettingFiles: res.obj.mettingFiles,
               meetingId: res.obj.mettingDetails.fId,
               objs: res.obj,
               qPicture,
               hPicture
           })
            console.log(res.obj.mettingDetails.fMeetingInitiatorId,this.props.fEmployeeId,res.obj.mettingDetails.fState,res.obj.mettingDetails.fMeetingRecordId,'人员章台',this.state.fDeedbackState)
            this.seetingMeetingRoot(res.obj.mettingDetails.fMeetingInitiatorId,this.props.fEmployeeId,res.obj.mettingDetails.fState,res.obj.mettingDetails.fMeetingRecordId,this.state.fDeedbackState)
        }else{
            console.log('会议详情展示（移动端）',res.msg)
        }
    }
    seetingMeetingRoot = (fMeetingInitiatorId,fEmployeeId,fState,fMeetingRecordId,fDeedbackState) =>{
        if(fState == 1){ // 未开始状态
            if(fEmployeeId == fMeetingInitiatorId){ //登陆人id == 创建人id
                this.setState({
                    currentStatus: 1
                })
            }else if(fEmployeeId !== fMeetingInitiatorId && fDeedbackState == 1){ //登陆人id ！== 创建人id 当前人员状态是1
                this.setState({
                    currentStatus: 11
                })
            }
        }else if(fState == 2){ // 进行中状态
            if(fEmployeeId == fMeetingInitiatorId){ //登陆人id == 创建人id 
                this.setState({
                    currentStatus: 2
                })
            }
        }else if(fState == 3){ // 待归档状态
            if(fEmployeeId == fMeetingRecordId){ //登陆人id == 记录人人id
                this.setState({
                    currentStatus: 13
                })
            }
        }else if(fState == 4){ // 已归档状态
            if(fEmployeeId == fMeetingRecordId){ //登陆人id == 记录人人id
                this.setState({
                    currentStatus: 15
                })
            }
        }
    }   
    //开始会议
    messageBegin = async () => {
        let arr = this.state.objs.mettingPeople.filter((item) => {
            return item.fEmployeeId == this.state.objs.mettingDetails.fMeetingRecordId&& item.fDeedbackState !== 3
        })
        if(arr.length>0){
            const res = await meetingServer.messageBegin(this.state.meetingId);
            if(res.success){
                this.messageGetDetail();
                Toast.show('已经开始会议,摄像已开启')
            }else{
                Toast.show(res.msg);
            }
        }else{
            Toast.show('记录人未参加会议,请重新指派记录人');
        }
    }
    //结束会议
    messageEnd = async () => {
        const res = await meetingServer.messageEnd(this.state.meetingId);
        if(res.success){
            const { meetingHomepage } = this.props.navigation.state.params;
            Toast.show('已经结束会议,摄像已关闭')
            meetingHomepage && meetingHomepage();
            this.props.navigation.pop();
            this.messageGetDetail();
        }else{
            Toast.show(res.msg);
        }
    }
    //取消会议
    meetingCancel = async () => {
        const res = await meetingServer.meetingCancel({
            meetingId:this.state.meetingId,
            cancelReason: this.state.cancelContent
        });
        if(res.success){
            const { meetingHomepage } = this.props.navigation.state.params;
            meetingHomepage && meetingHomepage();
            this.props.navigation.pop();
            Toast.show("您已取消会议")
        }else{
            Toast.show(res.msg);
        }
    }
    //是否参加
    goToMeeting = async(value,con) => {
        const res = await meetingServer.sendDeedback({
            mettingId:this.state.meetingId,
            deedBackState: value,
            refuseReason: con == null ? '' : con 
        })
        if(res.success){
            const { meetingHomepage } = this.props.navigation.state.params;
            if(value == 3){
                Toast.show('你已拒接参加会议!');
            }else{
                Toast.show('你已确定参加此会议，请按时参加!');
            }
            meetingHomepage && meetingHomepage();
            this.props.navigation.pop();
        }else{
            Toast.show(res.msg);
        }
    }
    //获取会议状态
    getState = (value) => {
        switch (value){
            case 1: 
                return '未开始';
            case 2: 
                return '进行中';
            case 3: 
                return '待归档';
            case 4:
                return '已归档';
            case 5:
                return '已取消';
            default:
                return null;
        } 

    }
    render() { 
        
        const { mettingPeople,obj,objs,carbonArr,mettingFiles,currentStatus,qPicture,hPicture} = this.state
        const { meetingHomepage, historyPage } = this.props.navigation.state.params
        console.log('aaaaa',this.props.navigation.state.params)
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="会议详情页"
                    hidePlus={false} 
                    props={this.props}
                />
                <ScrollView>
                { this.state.currentStatus == 1 ? //取消开始会议
                    <TouchableOpacity style={{width: "100%",height: 45,justifyContent: "center"}} onPress={()=>this.props.navigation.navigate('NewMeeting',{data: this.state.objs,meetingHomepage:meetingHomepage})}>
                        <Text style={{color: "#4058FD",fontSize:16,marginLeft: 15}}>编辑</Text>
                    </TouchableOpacity>
                : null}
                    
                    <View style={{width: width, backgroundColor: "#fff",paddingLeft: 16,paddingRight: 16}}>
                        <View style={styles.timeBox}>
                            <View style={styles.itemTime}>
                                <Text style={styles.timeText}>{parseDate(obj.fBeginTime,'HH:mm')}</Text>
                                <Text style={styles.timeAboutText}>开始时间</Text>
                            </View>
                            <View style={[styles.itemTime,{marginTop: 40}]}>
                                <Image source={require("../../image/meeting/left.png")} style={{width: 12, height: 3,marginBottom: 15}}/>
                            </View>
                            <View style={styles.itemTime}>
                                <Text style={styles.timeText}>{parseDate(obj.fEndTime,'HH:mm')}</Text>
                                <Text style={styles.timeAboutText}>结束时间</Text>
                            </View>
                        </View>
                        <View style={{marginTop: 25}}>
                            <View style={{marginBottom: 12,flexDirection: "row"}}>
                                <Text style={styles.leftText}>会议日期:</Text>
                                <Text style={styles.rightText}>{parseDate(obj.fBeginTime,'YYYY-MM-DD')}</Text>
                            </View>
                            <View style={{marginBottom: 12,flexDirection: "row"}}>
                                <Text style={styles.leftText}>创  建  人:</Text>
                                <Text style={styles.rightText}>{obj.fMeetingInitiatorName?obj.fMeetingInitiatorName: '--'}</Text>
                            </View>
                            <View style={{marginBottom: 12,flexDirection: "row"}}>
                                <Text style={styles.leftText}>记  录  人:</Text>
                                <Text style={styles.rightText}>{obj.fMeetingRecordName?obj.fMeetingRecordName: '--'}</Text>
                            </View>
                            <View style={{marginBottom: 12,flexDirection: "row"}}>
                                <Text style={styles.leftText}>会议类型:</Text>
                                <Text style={styles.rightText}>{obj.fMeetingTypeName?obj.fMeetingTypeName: '--'}</Text>
                            </View>
                            <View style={{marginBottom: 12,flexDirection: "row"}}>
                                <Text style={styles.leftText}>会议标题:</Text>
                                <Text style={styles.rightText}>{obj.fName?obj.fName:'--'}</Text>
                            </View>
                            <View style={{marginBottom: 12,flexDirection: "row"}}>
                                <Text style={styles.leftText}>会议内容:</Text>
                                <Text style={styles.rightText}>{obj.fContent?obj.fContent:'--'}</Text>
                            </View>
                            <View style={{marginBottom: 12,flexDirection: "row"}}>
                                <Text style={styles.leftText}>会  议  室:</Text>
                                <Text style={styles.rightText}>{obj.fMeetingRoomName}</Text>
                            </View>
                            <View style={{marginBottom: 12,flexDirection: "row"}}>
                                <Text style={styles.leftText}>会议状态:</Text>
                                <Text style={styles.rightText}>{obj.fState?this.getState(obj.fState): '--'}</Text>
                            </View>
                            
                            <View style={{marginBottom: 12}}>
                                <View style={{flexDirection: "row",marginTop: 5}}>
                                    <Text style={styles.leftText}>会前附件:</Text>
                                    {
                                        mettingFiles.filter(function(x){return x.fType == 3&&x.fFileType==2}).length != 0? mettingFiles.map((item) => {
                                            return item.fType == 3 && item.fFileType == 2?
                                                    
                                                        <Text style={styles.rightText}>{item.fFileName? item.fFileName: '--'}</Text>
                                                : null
                                            
                                        }): <Text>没有附件</Text>
                                    }
                                </View>
                                <View style={{flexDirection: "row",marginTop: 15}}>
                                    <Text style={styles.leftText}>会前图片:</Text>
                                    <View style={{flexWrap: "wrap",flexDirection: "row",flex:1}}>
                                        {
                                            qPicture.length == 0 ?
                                                <Text>没有图片</Text>
                                            :
                                                <CameraUpload
                                                    disabled = {true}
                                                    value={this.state.qPicture}
                                                    imgStyle={{width: 106,height:106}}
                                                /> 
                                        }
                                    </View>
                                </View>
                                
                            </View>
                            <View style={{paddingBottom: 24}}>
                                <View style={{flexDirection: "row",marginTop: 5}}>
                                    <Text style={styles.leftText}>会后附件:</Text>
                                    {
                                        mettingFiles.filter(function(x){return x.fType == 3 && x.fFileType == 5}).length != 0? mettingFiles.map((item) => {
                                            return item.fType == 3 && item.fFileType == 5?
                                                    
                                                        <Text style={styles.rightText}>{item.fFileName? item.fFileName: '--'}</Text>
                                                : null
                                            
                                        }): <Text>没有附件</Text>
                                    }
                                </View>
                                <View style={{flexDirection: "row",marginTop: 15}}>
                                    <Text style={styles.leftText}>会后图片:</Text>
                                    <View style={{flexWrap: "wrap",flexDirection: "row",flex:1}}>
                                        {
                                            hPicture.length == 0 ?
                                                <Text>没有图片</Text>
                                            :
                                                <CameraUpload
                                                    disabled = {true}
                                                    value={this.state.qPicture}
                                                    imgStyle={{width: 106,height:106}}
                                                /> 
                                        }
                                    </View>
                                    
                                </View>
                                    
                            </View>
                        </View>
                    </View>
                    <View style={styles.selectPeople}>
                        <View style={{borderBottomColor: "#fff",borderBottomWidth: 1}} >
                            {
                                currentStatus == 1 ? 
                                    <SelectAnotherPeople disabled={false} id = {objs.mettingDetails?objs.mettingDetails.fMeetingInitiatorId: ''} fState ={objs.mettingDetails ? objs.mettingDetails.fState: null} againDisable={true} title="参会人" currentStatus = {currentStatus}  showRight={true}  showPeople={true} required={true} value={mettingPeople} onChange={(arr)=>this.setState({mettingPeople: arr})} messageGetDetail={this.messageGetDetail}/>
                                : 
                                    <SelectAgainPeople title="参会人" id = {objs.mettingDetails?objs.mettingDetails.fMeetingInitiatorId: ''} fState ={objs.mettingDetails ?  objs.mettingDetails.fState: null} currentStatus = {currentStatus}  showRight={true}  showPeople={true} required={true} value={mettingPeople} onChange={(arr)=>this.setState({mettingPeople: arr})}/>
                            }
                        </View>
                    </View>
                    <View style={styles.selectPeople}>
                    <View style={{marginTop: 10,borderBottomColor: "#fff",borderBottomWidth: 1}}>
                        <SelectAnotherPeople title="抄送人" disabled={currentStatus !== 1? true:false} againDisable={true} showRight={false}  showPeople={true} required={true} value={carbonArr} onChange={(arr)=>this.setState({carbonArr: arr})}/>
                    </View>
                </View>
                </ScrollView>
                    { this.state.currentStatus == 1? //取消开始会议
                    <View style={styles.botton}>
                        <TouchableOpacity style={styles.bottomLeft} onPress={()=>this.setState({showType: 'cancel'},() => {this.ShowModal.show()})}>
                            <Text style={{color: "#333", fontSize: 14}}>取消会议</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bottomRight} onPress={()=>this.setState({showType: 'affirm'},() => {this.ShowModal.show()})}>
                            <Text style={{color: "#fff", fontSize: 14}}>开始会议</Text>
                        </TouchableOpacity>
                    </View> 
                    : null}
                    { this.state.currentStatus == 2? //结束会议
                    <View style={styles.botton}>
                        <TouchableOpacity style={styles.bottomLeft} onPress={()=>this.setState({showType: 'dismiss'},() => {this.ShowModal.show()})}>
                            <Text style={{color: "#333", fontSize: 14}}>结束会议</Text>
                        </TouchableOpacity>
                        <View style={styles.bottomRight}>
                            <Text style={{color: "#fff", fontSize: 14}}>会议进行中</Text>
                        </View>
                    </View> 
                    : null}
                    { this.state.currentStatus == 11?  //参加会议
                    <View style={styles.botton}>
                        <TouchableOpacity style={styles.bottomLeft} onPress={()=>this.setState({showType: 'participate'},() => {this.ShowModal.show()})}>
                            <Text style={{color: "#333", fontSize: 14}}>不方便参加</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bottomRight} onPress={() => {this.goToMeeting(2)}}>
                            <Text style={{color: "#fff", fontSize: 14}}>确认参加</Text>
                        </TouchableOpacity>
                    </View> 
                    : null}
                    {this.state.currentStatus == 13? //上传资料
                    <TouchableOpacity style={{width: width, height: 59,alignItems: "center",justifyContent: "center",backgroundColor: "#4058FD", }} onPress={ () => this.props.navigation.navigate('MeetingSubmission',{objs:objs,meetingHomepage: meetingHomepage})}>
                            <Text style={{color: "#fff", fontSize: 16}}>上传会议资料</Text>
                    </TouchableOpacity> 
                    : null}
                    
                    {this.state.currentStatus == 15? //上传资料
                    <TouchableOpacity style={{width: width, height: 59,alignItems: "center",justifyContent: "center",backgroundColor: "#4058FD", }} onPress={ () => this.props.navigation.navigate('MeetingSubmission',{objs:objs,meetingHomepage: meetingHomepage,historyPage: historyPage})}>
                            <Text style={{color: "#fff", fontSize: 16}}>已归档--编辑</Text>
                    </TouchableOpacity> 
                    : null}
                    <ShowModal 
                        ref={(ref)=>this.ShowModal = ref} 
                        type={this.state.showType} 
                        affirmContent={this.state.affirmContent} 
                        getCancelContent = {(value => this.getCancelContent(value))}
                        getParticipate = {(value) => {this.getParticipate(value)}}
                        pushType = {(value) => this.pushType(value)}
                    />
            </View>
        );
    }
}
const mapStateToProps = state => {
    
    return {
      messageInfo: state.userReducer.messageInfo,
      fEmployeeId: state.userReducer.userInfo.fEmployeeId
    }
  
}
export default connect(
    mapStateToProps,
)(mettingDetail);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        display: "flex"
    },
    content: {
        backgroundColor: '#FFF',
        paddingLeft: 15,
        paddingRight: 16,
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
    },
    itemTime: {
        alignItems: "center",
        marginTop: 27,
        marginBottom: 12
    },
    timeAboutText: {
        fontSize: 12,
        color: "#999"
    },
    timeBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1
    },
    timeText: {
        color: "#333",
        fontSize:  24,
        fontWeight: "600"
    },
    leftText: {
        marginRight: 10,
        fontSize: 14,
        color: "#999",
        fontWeight: "500"
    },
    rightText: {
        color: "#333",
        fontSize: 14,
        fontWeight: "500",
        width: width - 80,
        
        lineHeight: 20,
        paddingRight: 5
    },
    selectPeople: {
        paddingTop: 23,
        backgroundColor: "#fff",
        paddingLeft: 16,
        paddingRight: 16,
        marginTop: 12,
        paddingBottom: 8
    }
});
