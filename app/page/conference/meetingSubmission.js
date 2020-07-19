import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Modal, TextInput, Switch} from 'react-native';
import DatePicker from 'react-native-datepicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import splash from 'react-native-splash-screen';
import { connect } from 'react-redux';
import Picker from 'react-native-wheel-picker';
import moment from 'moment';

import troubleService from '../../service/troubleService';
import Header from '../../components/header';
import CameraUpload from '../../components/ImageAbout/CameraUpload';
import Toast from '../../components/toast';
import SelectAnotherPeople from '../../components/selectAnotherPeople';
import AppendixUpload from '../../components/AppendixUpload/appendixUpload';
import meetingServer from '../../service/meetingServer';
import Entypo from 'react-native-vector-icons/Entypo';

const {width, height} = Dimensions.get('window');
const PickerItem = Picker.Item;
class TroubleIssue extends Component {
    state = {
        showPicker: false,
        picArr: [],
        appendixArr: [],
        obj : {},
        value: [],
        currentType: 1
    }
    //设置头部
    static navigationOptions = () => ({
        header: null
    });

    componentDidMount() {
        let people = [];
        const {mettingDetails} = this.props.navigation.state.params.objs;
        for(item of this.props.navigation.state.params.objs.mettingPeople){
            people.push({
                fActualState: item.fActualState,
                fDeedbackState: item.fDeedbackState,
                fEmployeeId: item.fEmployeeId,
                fEmpoloyeeName: item.fEmpoloyeeName,
                fId: item.fId,
                fIsDelete: item.fIsDelete,
                fMettingId: item.fMettingId,
                fRefuseReason: item.fRefuseReason,
                position: item.fEmployeeId == mettingDetails.fMeetingRecordId ? '记录人' : (item.fEmployeeId == mettingDetails.fMeetingInitiatorId? '创建人': "参会人")
            })
        }
        console.log(people)
        this.setState({
            value: people
        })
        if(this.props.navigation.state.params.objs.mettingDetails.fState == 4){
            let appendixArr= [];
            let picArr = [];
            for( item of this.props.navigation.state.params.objs.mettingFiles){
                if(item.fType == 3&&item.fFileType==5){
                    appendixArr.push({
                        fileName: item.fFileName,
                        path: item.fFileLocationUrl,
                        type: item.fType,
                        status: 'success',
                        fCoursewareTitle: item.fCoursewareTitle
                    })
                }else if(item.fType == 1&&item.fFileType==6){
                    picArr.push({
                        fileName: item.fFileName,
                        path: item.fFileLocationUrl,
                        type: item.fType,
                        status: 'success',
                        fCoursewareTitle: item.fCoursewareTitle
                    })
                }
            }
            this.setState({
                picArr,
                currentType: 2,
                appendixArr
            })
        }else{
            this.setState({
                currentType: 1
            })
        }
    }
    
    changeData = () => {
        this.props.navigation.navigate('ReportParticipantList',
            {surePeople: this.getReportPeople, initArr: this.state.value}
        );
    }
    // 获取上一个页面选中的数据
    getReportPeople = (data) => {
        this.setState({
            value: data
        })
    }
    //上传分开接口
    publishMeeting = () => {
        if(this.state.currentType == 1){
            this.commitIssue()
            
        }else{
            this.minutesOfMettingUpload()
            
        }
    }
    // 会议记录提交
    commitIssue = async () => {  
        let finishFile = []
        const { picArr, appendixArr, value } = this.state
        for (let obj of picArr) {
            if (obj.status == 'success') {
                finishFile.push({
                    fFileName: obj.fileName,
                    fFileLocationUrl: obj.path,
                    fType: obj.type,
                    fFileType: 6
                })
            } else if (obj.status == 'uploading') {
                Toast.show('图片上传中，请稍后');
                return;
            }
        }
        for (let obj of appendixArr) {
            if (obj.status == 'success') {
                finishFile.push({
                    fFileName: obj.fileName,
                    fFileLocationUrl: obj.path,
                    fType: obj.type,
                    fFileType: 5
                })
            } else if (obj.status == 'uploading') {
                Toast.show('附件上传中，请稍后');
                return;
            }
        }
        const res = await meetingServer.minutesOfMetting({
            mettingFileDtoList: finishFile,
            mettingId: this.props.navigation.state.params.objs.mettingDetails.fId,
            mettingPersonList: value
        })
        if (res.success) {
            Toast.show('上传成功');
            this.props.navigation.state.params.meetingHomepage();
            this.props.navigation.pop(2)
           this.setState({
               currentType: 2
           })
        } else {
            Toast.show(res.msg);
        }
    }
    //修改会议纪要
    minutesOfMettingUpload= async () => { 
        let finishFile = []
        const { picArr, appendixArr, value } = this.state
        for (let obj of picArr) {
            if (obj.status == 'success') {
                finishFile.push({
                    fFileName: obj.fileName,
                    fFileLocationUrl: obj.path,
                    fType: obj.type,
                    fFileType: 6
                })
            } else if (obj.status == 'uploading') {
                Toast.show('图片上传中，请稍后');
                return;
            }
        }
        for (let obj of appendixArr) {
            if (obj.status == 'success') {
                finishFile.push({
                    fFileName: obj.fileName,
                    fFileLocationUrl: obj.path,
                    fType: obj.type,
                    fFileType: 5
                })
            } else if (obj.status == 'uploading') {
                Toast.show('附件上传中，请稍后');
                return;
            }
        }
        const res = await meetingServer.minutesOfMettingUpload({
            mettingFileDtoList: finishFile,
            mettingId: this.props.navigation.state.params.objs.mettingDetails.fId,
            mettingPersonList: value
        })
        if (res.success) {
            Toast.show('上传成功');
            this.props.navigation.state.params.historyPage();
            this.props.navigation.pop(2)
           this.setState({
               currentType: 2
           })
        } else {
            Toast.show(res.msg);
        }
    }
    render() {
        
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="会议记录提交"
                    hidePlus={false} 
                    props={this.props}
                />
                <ScrollView>
                    <View style={styles.content}>
                        <View style={{borderBottomColor: "#F0F1F6",borderBottomWidth: 1,paddingBottom: 20,paddingTop: 20}}>
                            <View style={{flexDirection: "row",marginBottom: 10}}>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>参会视频: </Text>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>  --</Text>
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>        时长: </Text>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>  --</Text>
                            </View>
                        </View>
                        <View style={{marginTop: 20,borderBottomColor: "#F0F1F6",borderBottomWidth: 1,}}>
                            <TouchableOpacity style={{flexDirection: "row",justifyContent: "space-between"}} onPress={() => {this.changeData()}}>
                                <View style={{flexDirection: "row"}}>
                                    <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>参会人</Text>
                                    <Text style={{marginLeft: 5, fontWeight: "500",color: "#333",fontSize: 14}}>{this.state.value.length? ": "+this.state.value.length + '人': ''}</Text>
                                </View>
                                <AntDesign name={'right'} size={12} style={{ color: '#666666', marginLeft: 13 }}/>
                            </TouchableOpacity>
                            <View style={{marginTop: 20,paddingBottom: 10}}>
                                {this.state.value.length == 0 ? <Text style={{color: '#666'}}>--</Text>: 
                                   ( this.state.value.length >= 4? 
                                   <View style={{flexDirection: 'row',alignItems: "center"}}>
                                        { this.state.value.slice(0,4).map((item) => {
                                            return(<View style={styles.userIcon} key={item.fId}>
                                                            <View style={styles.userImgs}>
                                                                <View style={styles.userImg}>
                                                                    <Text style={{fontSize: 14,color: "white"}}>
                                                                        {item.fEmpoloyeeName ? item.fEmpoloyeeName.substr(item.fEmpoloyeeName.length-2,2) : ''}
                                                                    </Text>
                                                                </View> 
                                                            </View>
                                                        <Text style={{width: '100%',textAlign: 'center',fontSize: 13}} numberOfLines={1}>{item.fEmpoloyeeName}</Text>
                                                    </View>)
                                        }) }
                                        <TouchableOpacity onPress={() => {this.changeData()}} style={{marginLeft: 20,marginTop: -10}}>
                                            <Entypo name="dots-three-horizontal" size={18} color="#666"></Entypo>
                                        </TouchableOpacity>
                                   </View>: 
                                    <View style={{flexDirection: 'row'}}>
                                       { this.state.value.map((item) => {
                                        return(<View style={styles.userIcon} key={item.fId}>
                                                        <View style={styles.userImgs}>
                                                            <View style={styles.userImg}>
                                                                <Text style={{fontSize: 14,color: "white"}}>
                                                                    {item.fEmpoloyeeName ? item.fEmpoloyeeName.substr(item.fEmpoloyeeName.length-2,2) : ''}
                                                                </Text>
                                                            </View> 
                                                        </View>
                                                    <Text style={{width: '100%',textAlign: 'center',fontSize: 13}} numberOfLines={1}>{item.fEmpoloyeeName}</Text>
                                                </View>)
                                    })}
                                    </View>)
                                }
                            </View>
                        </View>
                        
                        <View style={{borderBottomColor: "#F0F1F6",borderBottomWidth: 1,paddingBottom: 15}}>
                            <View style={{flexDirection: "row",alignItems: "center",marginTop: 20}}>
                                <Image source={require("../../image/troubleIssue/mapMarker.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    附件
                                </Text>
                            </View>
                            <View style={{paddingTop: 10,paddingBottom: 10}}>
                                <AppendixUpload value={this.state.appendixArr} onChange={(arr)=>this.setState({appendixArr:arr})}/>
                            </View>
                        </View>
                        <View style={{borderBottomColor: "#F0F1F6",borderBottomWidth: 1,}}>
                            <View style={{flexDirection: "row",alignItems: "center",marginTop: 20}}>
                                <Image source={require("../../image/troubleIssue/mapMarker.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                <Text style={{color: 'red'}}>*</Text>
                                    图片
                                </Text>
                            </View>
                            <View style={{flexDirection: "row",marginTop: 5,flexWrap: "wrap"}}>
                                <CameraUpload
                                    value={this.state.picArr}
                                    onChange={(picArr)=>this.setState({picArr})}
                                    imgStyle={{width: width*0.26, height: width*0.26}}
                                />
                            </View>
                        </View>
                    </View>
                   
                </ScrollView>
                        <View style={{width, alignItems: "center",justifyContent: "center",marginBottom: 20}}>
                            <TouchableOpacity onPress={this.commitIssue} style={styles.publishButton} onPress={() => {this.publishMeeting()}}>
                                <Text style={{color: "#fff", fontSize: 16}}>提交</Text>
                            </TouchableOpacity>
                        </View>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    
});

export default connect(mapStateToProps)(TroubleIssue);

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
    item: {
        borderBottomColor: "#F6F6F6",
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    itemImage: {
        alignItems: "center",
        width: (width-64)/3,
        height: (width-64)/3,
        backgroundColor: "#F0F1F6",
        borderRadius: 5,
        justifyContent: "center",
        marginBottom: 16,
        marginRight: 12
    },
    //picker
    modalStyle: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center'
    },
    selectModalTop: {
        width: width,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0
      },
    selectModalBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 5,
        paddingTop: 8,
        paddingBottom: 8,
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1
    },
    publishButton: {
        width: width-32,
        height:44,
        backgroundColor: "#4058FD",
        borderRadius: 5,
        marginTop: 17,
        alignItems: "center",
        justifyContent: "center"
    },
    userIcon: {
        alignItems: 'center',
        width: 75,
        height: 70,
        position: 'relative',
        marginBottom: 5,
    },
    userImgs:{
        width: 48,
        height: 48,
        backgroundColor: "#D9DEFF",
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
      },
    userImg:{
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#4058FD",
        alignItems: "center",
        justifyContent: "center"
    },
});
