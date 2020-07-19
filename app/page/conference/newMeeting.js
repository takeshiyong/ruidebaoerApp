import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Modal, TextInput, Switch} from 'react-native';
import DatePicker from 'react-native-datepicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import splash from 'react-native-splash-screen';
import { connect } from 'react-redux';
import Picker from 'react-native-wheel-picker';
import moment from 'moment';

import meetingServer from '../../service/meetingServer';
import Header from '../../components/header';
import CameraUpload from '../../components/ImageAbout/CameraUpload';
import Toast from '../../components/toast';
import SelectPeople from '../../components/selectPeople';
import AppendixUpload from '../../components/AppendixUpload/appendixUpload';
import SelectReportPeople from './peopleList/selectReportPeople';
import { throwStatement, returnStatement } from '@babel/types';
import { parseDate, parseTime } from '../../utils/handlePhoto'

const {width, height} = Dimensions.get('window');
const PickerItem = Picker.Item;
class MeetingIssue extends Component {
    state = {
        showPicker: false,
        typeData: {
            index: 0,
            fId: '',
            fName: '请选择会议类型'
        },
        addressData: {
            index: 0,
            fId: '',
            fName: '请选择会议会议室'
        },
        pickerType: 0, //0 代表会议类型，1代表会议会议室 
        pickerList: [],
        changeData: {},
        itemList: [],
        picArr: [],
        selectDep: null,
        content: '',
        titleContent: '',
        startTime: null,
        endTime: null,
        peopleArr: [],
        participationArr: [],
        recordArr: [],
        appendixArr: [],
        dataSourse: {},
        subType: 1, //1: 新建 2.编辑
        fId: '',
        fState: 1,
        fCreateTime: '',
        fActualBeginTime: null,
        fActualEndTime: null,
        fCancelReason: null,
        fRepeatRuleId:null
    }
    //设置头部
    static navigationOptions = () => ({
        header: null
    });

    componentDidMount() {
        if(this.props.navigation.state.params && this.props.navigation.state.params.data ){
            let dataSourse = this.props.navigation.state.params.data ? this.props.navigation.state.params.data: {}
            this.setData(dataSourse);
        }else{
            this.setState({
                subType: 1
            })
        }
    }
    //当详情页面点击后赋予数据
    setData = (dataSourse) => {
        let arr = dataSourse.mettingPeople.map((item) => ({
            'fUserName': item.fEmpoloyeeName,
            'fActualState': item.fActualState,
            'fDeedbackState': item.fDeedbackState,
            'fEmployeeId': item.fId,
            'fId': item.fEmployeeId,
            'fIsDelete': item.fIsDelete,
            'fMettingId': item.fMettingId,
            'fRefuseReason': item.fRefuseReason,
        }))
        let carbonArr = dataSourse.mettingCopiers.map((item) => ({
            'fUserName': item.fEmployeeName,
            'fEmployeeId': item.fId,
            'fId': item.fEmployeeId,
            'fIsDelete': item.fIsDelete,
            'fMettingId': item.fMettingId,
            'fIsRead': item.fIsRead,
        }))
        let recordArray = [
            {
                fId:dataSourse.mettingDetails.fMeetingRecordId,
                fUserName: dataSourse.mettingDetails.fMeetingRecordName
            }
        ]
        let appendixArr= [];
        let picArr = [];
        for( item of dataSourse.mettingFiles){
            if(item.fType == 3){
                appendixArr.push({
                    fileName: item.fFileName,
                    path: item.fFileLocationUrl,
                    type: item.fType,
                    status: 'success',
                    fCoursewareTitle: item.fCoursewareTitle
                })
            }else if(item.fType == 1){
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
            fId: dataSourse.mettingDetails.fId,
            participationArr: arr,
            recordArr: recordArray,
            titleContent: dataSourse.mettingDetails.fName,
            content: dataSourse.mettingDetails.fContent,
            peopleArr: carbonArr,
            startTime: parseDate(dataSourse.mettingDetails.fBeginTime,"YYYY-MM-DD HH:mm"),
            endTime: parseDate(dataSourse.mettingDetails.fEndTime,"YYYY-MM-DD HH:mm"),
            addressData: { index: 0,fId: dataSourse.mettingDetails.fMettingRoomId,fName: dataSourse.mettingDetails.fMeetingRoomName},
            typeData: {index: 0,fId: dataSourse.mettingDetails.fMettingTypeId,fName: dataSourse.mettingDetails.fMeetingTypeName},
            selectDep: {
                fId: dataSourse.listRange[0].fDeptId, 
                fName: dataSourse.listRange[0].fDeptName,
                fDeptId: dataSourse.listRange[0].fId,
                fIsDelete: dataSourse.listRange[0].fIsDelete,
                fMettingId: dataSourse.listRange[0].fMettingId
            },
            appendixArr,
            picArr,
            subType: 2,
            fState:dataSourse.mettingDetails.fState,
            fCreateTime: dataSourse.mettingDetails.fCreateTime,
            fIsDelete: dataSourse.mettingDetails.fIsDelete,
            fActualBeginTime: dataSourse.mettingDetails.fActualBeginTime,
            fActualEndTime: dataSourse.mettingDetails.fActualEndTime,
            fCancelReason: dataSourse.mettingDetails.fCancelReason,
            fRepeatRuleId: dataSourse.mettingDetails.fRepeatRuleId
        })
    }
    //picker确认改值
    onPickerSelect = () => {
        const {typeData, changeData, pickerType,addressData} = this.state;
        this.setState({
            showPicker: false,
            typeData: {
                index: typeData.index,
                fName: !pickerType ?changeData.fName: typeData.fName,
                fId: !pickerType ?changeData.fId: typeData.fId,
            },
            addressData: {
                index: addressData.index,
                fName: pickerType ?changeData.fName: addressData.fName,
                fId: pickerType ?changeData.fId: addressData.fId,
            }
        })
        
    }

    // picker滚动的时候改值
    onPickerChange = (index) => {
        const { changeData, itemList } = this.state;
        this.setState({
            changeData: itemList[index]
        });
    }
    
    // 展开选择会议类型
    showMeetingType = () => {
        const { typeData } = this.state;
        const { meetingType } = this.props;
        if(meetingType.length > 0){
            const selectList = meetingType.map((data, index)=>{
                return {
                    index: index,
                    fId: data.fId,
                    fName: data.fTypeName
                }
            });
            
            this.setState({
                itemList: selectList,
                pickerList: selectList.map((data)=>(data.fName)),
                changeData: selectList[typeData.index],
                showPicker: true,
                pickerType: 0
            });
        } 
        
    }
    //展开选择会议室地址
    showMeetingAddress = () => {
        const {addressData} = this.state;
        const { meetingRoom } = this.props;
        if(meetingRoom.length > 0){
            const selectList = meetingRoom.map((data,index) => {
                if(data.fState == 1&& data.fIsUse == true){
                    return {
                        index: index,
                        fId: data.fId,
                        fName: data.fRoomName
                    }
                }
            })
            console.log(meetingRoom)
            this.setState({
                itemList: selectList,
                pickerList: selectList.map((data)=>(data.fName)),
                changeData: selectList[addressData.index],
                showPicker: true,
                pickerType: 1
            });
        }
        
    }
    // 选择会议范围单位
    chooseReportDept = () => {
        this.props.navigation.navigate('SelectDep',{sureDepId: this.getReportDept})
    }

    // 获取选中上报单位数据
    getReportDept = (dept) => {
        this.setState({
            selectDep: {fId: dept.fId, fName: dept.fName}
            
        });
    }
    //发布会议
    publishIssue = () => {

        const { subType } =this.state;
        if(subType == 1){
            this.commitIssue();
        }else{
            this.editIssue();
        }
    }

    commitIssue = async () => {   
        const { typeData, addressData, content, selectDep, titleContent, picArr,peopleArr,participationArr,startTime,endTime,appendixArr,recordArr} = this.state;
        const { goBack } = this.props.navigation;
        const { meetingHomepage } = this.props.navigation.state.params;

        let fileManagementDTOS = [];
        let finishFile = [];
        if (typeData.fId.length == 0) {
            Toast.show('会议类型不能为空');
            return;
        }
        if (addressData.fId.length == 0) {
            Toast.show('会议室选择不能为空');
            return;
        }
        if (content.trim().length == 0) {
            Toast.show('会议内容不能为空');
            return;
        }
        if (titleContent.trim().length == 0) {
            Toast.show('会议标题不能为空');
            return;
        }
        if (!selectDep) {
            Toast.show('会议部门不能为空');
            return;
        }
        for (let obj of picArr) {
            if (obj.status == 'success') {
                finishFile.push({
                    fFileName: obj.fileName,
                    fFileLocationUrl: obj.path,
                    fType: obj.type,
                    fFileType: 3
                })
            } else if (obj.status == 'uploading') {
                Toast.show('图片上传中，请稍后');
                return;
            }
        }
    
        // if (new Date(discoveryTime.replace(/-/g, '/')).getTime() < new Date().getTime()) {
        //     Toast.show('整改期限不能早于当前时间');
        //     return;
        // }
        for (let obj of appendixArr) {
            if (obj.status == 'success') {
                finishFile.push({
                    fFileName: obj.fileName,
                    fFileLocationUrl: obj.path,
                    fType: obj.type,
                    fFileType: 2
                })
            } else if (obj.status == 'uploading') {
                Toast.show('附件上传中，请稍后');
                return;
            }
        }
        if(new Date(startTime.replace(/-/g, '/')).getTime() <= new Date().getTime()){
            Toast.show('开始时间不能小于等于当前时间，请核对');
            return;
        }
        if(new Date(startTime.replace(/-/g, '/')).getTime() >= new Date(endTime.replace(/-/g, '/')).getTime()){
            Toast.show('开始时间不能大于等于结束时间，请核对');
            return;
        }
        global.loading.show();
        const res = await meetingServer.createMeeting({
                'copierList': peopleArr.map((data)=>({fEmployeeId: data.fId})),//抄送人
                'participantPersonList': participationArr.map((data)=>({fEmployeeId: data.fId})), //参会人
                'tMettingRangeList': [{fDeptId:selectDep.fId}],
                'tMettingFileList': finishFile,
                'tMetting': {
                    'fMettingTypeId': typeData.fId,
                    'fName': titleContent,
                    'fBeginTime': new Date(startTime.replace(/-/g, '/')).getTime(),
                    'fEndTime': new Date(endTime.replace(/-/g, '/')).getTime(),
                    'fContent': content,
                    'fMettingRoomId': addressData.fId,
                    'fMeetingRecordId': recordArr[0].fId
                }
        })
        global.loading.hide();
        if (res.success) {
            Toast.show(res.msg);
            meetingHomepage && meetingHomepage()
            this.props.navigation.pop()
        } else {
            Toast.show(res.msg);
        }
    }
    
    editIssue = async () => {   
        const { typeData, addressData, content,fActualBeginTime,fRepeatRuleId,fCancelReason, fActualEndTime,fId,selectDep,fIsDelete, titleContent,fCreateTime,fState, picArr,peopleArr,participationArr,startTime,endTime,appendixArr,recordArr} = this.state;
        const { goBack } = this.props.navigation;
        const { meetingHomepage } = this.props.navigation.state.params;

        let fileManagementDTOS = [];
        let finishFile = [];
        if (typeData.fId.length == 0) {
            Toast.show('会议类型不能为空');
            return;
        }
        if (addressData.fId.length == 0) {
            Toast.show('会议室选择不能为空');
            return;
        }
        if (content.trim().length == 0) {
            Toast.show('会议内容不能为空');
            return;
        }
        if (titleContent.trim().length == 0) {
            Toast.show('会议标题不能为空');
            return;
        }
        if (!selectDep) {
            Toast.show('会议部门不能为空');
            return;
        }
        for (let obj of picArr) {
            if (obj.status == 'success') {
                finishFile.push({
                    fFileName: obj.fileName,
                    fFileLocationUrl: obj.path,
                    fType: obj.type,
                    fFileType: 3,
                    fCoursewareTitle: obj.fCoursewareTitle,
                })
                
            } else if (obj.status == 'uploading') {
                Toast.show('图片上传中，请稍后');
                return;
            }
        }
        if(new Date(startTime.replace(/-/g, '/')).getTime() <= new Date().getTime()){
            Toast.show('开始时间不能小于等于当前时间，请核对');
            return;
        }
        if(new Date(startTime.replace(/-/g, '/')).getTime() >= new Date(endTime.replace(/-/g, '/')).getTime()){
            Toast.show('开始时间不能大于等于结束时间，请核对');
            return;
        }
        // if (new Date(discoveryTime.replace(/-/g, '/')).getTime() < new Date().getTime()) {
        //     Toast.show('整改期限不能早于当前时间');
        //     return;
        // }
        for (let obj of appendixArr) {
            if (obj.status == 'success') {
                finishFile.push({
                    fFileName: obj.fileName,
                    fFileLocationUrl: obj.path,
                    fType: obj.type,
                    fFileType: 2,
                    fCoursewareTitle: obj.fCoursewareTitle,
                })
            } else if (obj.status == 'uploading') {
                Toast.show('附件上传中，请稍后');
                return;
            }
        }
        
        global.loading.show();
        const res = await meetingServer.meetingUpdate({
                'copierList': peopleArr.map((data)=>(
                    {
                        'fEmployeeName': data.fUserName,
                        'fEmployeeId': data.fId,
                        'fId': data.fEmployeeId,
                        'fIsDelete': data.fIsDelete,
                        'fMettingId': data.fMettingId,
                        'fIsRead': data.fIsRead,
                    })),//抄送人
                'participantPersonList': participationArr.map((data)=>(
                    {
                        "fActualState": data.fActualState,
                        "fDeedbackState": data.fDeedbackState,
                        "fEmployeeId": data.fId,
                        "fEmpoloyeeName": data.fUserName,
                        "fId": data.fEmployeeId,//???????
                        "fIsDelete": data.fIsDelete,
                        "fMettingId": data.fMettingId,
                        "fRefuseReason": data.fRefuseReason
                    })), //参会人
                'tMettingRangeList': [
                    {
                    "fDeptId": selectDep.fId,
                    "fDeptName": selectDep.fName,
                    'fId': selectDep.fDeptId, 
                    'fIsDelete': selectDep.fIsDelete,
                    'fMettingId': selectDep.fMettingId
                    }
                ],
                'tMettingFileList': finishFile,
                'tMetting': {
                    'fMettingTypeId': typeData.fId,
                    'fMeetingTypeName': typeData.fName,
                    'fName': titleContent,
                    'fBeginTime': new Date(startTime.replace(/-/g, '/')).getTime(),
                    'fEndTime': new Date(endTime.replace(/-/g, '/')).getTime(),
                    'fContent': content,
                    'fMettingRoomId': addressData.fId,
                    'fMeetingRoomName':addressData.fName,
                    'fMeetingRecordId': recordArr[0].fId,
                    'fMeetingRecordName':recordArr[0].fUserName,
                    'fId': fId,
                    'fMeetingInitiatorName': this.props.fUserName,
                    'fMeetingInitiatorId': this.props.fEmployeeId,
                    'fState':fState,
                    'fCreateTime': fCreateTime,
                    'fIsDelete':fIsDelete,
                    'fActualBeginTime': fActualBeginTime,
                    'fActualEndTime': fActualEndTime,
                    'fCancelReason': fCancelReason,
                    'fRepeatRuleId': fRepeatRuleId
                }
        })
        global.loading.hide();
        if (res.success) {
            Toast.show(res.msg);
            meetingHomepage && meetingHomepage();
            this.props.navigation.pop(2)
        } else {
            Toast.show(res.msg);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="新建会议"
                    hidePlus={false} 
                    props={this.props}
                />
                <Modal
                    animationType={'fade'}
                    transparent
                    visible={this.state.showPicker}
                    onRequestClose={() => {}}
                    >
                    <View style={styles.modalStyle}>
                        <View style={styles.selectModalTop}>
                            <View style={styles.selectModalBody}>
                                <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        showPicker: false,
                                        changeData: {}
                                    })
                                }}
                                >
                                <Text style={{ fontSize: 14, color: '#508DCE' ,marginLeft: 8}}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.onPickerSelect}
                                >
                                <Text style={{ fontSize: 14, color: '#508DCE' ,marginRight: 8 }}>确定</Text>
                                </TouchableOpacity>
                            </View>
                            <Picker
                                style={{ width: width, height: 180 }}
                                itemStyle={{ color: 'black', fontSize: 22 }}
                                selectedValue={this.state.selectedItem}
                                onValueChange={(index) => this.onPickerChange(index)}>
                                {this.state.pickerList.map((value, i) => (
                                    <PickerItem label={value} value={i} key={value}/>
                                ))}
                            </Picker>
                        </View>
                    </View>
                </Modal>
                <ScrollView>
                    <View style={styles.content}>
                        <TouchableOpacity style={[styles.item,{height: 50}]} onPress={this.showMeetingType}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleQuery/appsBig.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                    会议类型
                                </Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text style={{fontSize: 14, color: "#666"}}>{this.state.typeData.fName}</Text>
                                <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 13 }}/>
                            </View>
                        </TouchableOpacity>
                        <View style={[styles.item,{height: 47}]}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleIssue/calendar.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                    会议标题
                                </Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <TextInput
                                    style={{height: "100%", borderWidth: 0,color: "#333",textAlign: "right",paddingRight: 23}}
                                    placeholder="请输入会议标题"
                                    multiline={false}
                                    maxLength={18}
                                    placeholderTextColor= "#666"
                                    value={this.state.titleContent}
                                    onChangeText={(text)=>{
                                        this.setState({
                                            titleContent: text.trim()
                                        });
                                    }}
                                />
                            </View>
                        </View>
                        <TouchableOpacity style={[styles.item,{height: 47}]}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleIssue/calendar.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                    开始时间
                                </Text>
                            </View>
                            <View style={{alignItems: "flex-end",flex: 1,justifyContent: 'center'}}>
                                <DatePicker
                                        style={{width: '100%'}}
                                        date={this.state.startTime}
                                        mode="datetime"
                                        placeholder="请选择开始时间"
                                        format="YYYY-MM-DD HH:mm"
                                        minDate={moment(new Date()).format('YYYY-MM-DD HH:mm')}
                                        confirmBtnText="确定"
                                        cancelBtnText="取消"
                                        customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                left: 0,
                                                top: 4,
                                                marginLeft: 0
                                            },
                                            dateTouchBody: {
                                                borderWidth: 0
                                            },
                                            dateInput: {
                                                marginLeft: 36,
                                                borderWidth: 0,
                                                alignItems: 'flex-end',
                                                paddingRight: 2
                                            },
                                            dateText: {
                                                color: '#666'
                                            },
                                            placeholderText: {
                                                color: '#666'
                                            }
                                        }}
                                        iconComponent={<AntDesign name="right" size={12} style={{ color: '#C1C1C1',marginLeft: 10 }}/>}
                                        onDateChange={(date) => {this.setState({startTime: date})}}
                                    />
                            </View>
                        </TouchableOpacity>
                        <View style={[styles.item,{height: 47}]}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleIssue/calendar.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                    结束时间
                                </Text>
                            </View>
                            <View style={{alignItems: "flex-end",flex: 1,justifyContent: 'center'}}>
                                <DatePicker
                                    style={{width: '100%'}}
                                    date={this.state.endTime}
                                    mode="datetime"
                                    placeholder="请选择结束时间"
                                    format="YYYY-MM-DD HH:mm"
                                    minDate={this.state.startTime? moment(parseTime(this.state.startTime)+60000).format('YYYY-MM-DD HH:mm'): moment().format('YYYY-MM-DD HH:mm')}
                                    confirmBtnText="确定"
                                    cancelBtnText="取消"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0
                                        },
                                        dateTouchBody: {
                                            borderWidth: 0
                                        },
                                        dateInput: {
                                            marginLeft: 36,
                                            borderWidth: 0,
                                            alignItems: 'flex-end',
                                            paddingRight: 2
                                        },
                                        dateText: {
                                            color: '#666'
                                        },
                                        placeholderText: {
                                            color: '#666'
                                        }
                                    }}
                                    iconComponent={<AntDesign name="right" size={12} style={{ color: '#C1C1C1',marginLeft: 10 }}/>}
                                    onDateChange={(date) => {this.setState({endTime: date})}}
                                />
                            </View>
                        </View>
                        <View style={{borderBottomColor: "#F0F1F6",borderBottomWidth: 1,}}>
                            <View style={{flexDirection: "row",alignItems: "center",marginTop: 20}}>
                                <Image source={require("../../image/troubleIssue/mapMarker.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                    会议内容
                                </Text>
                            </View>
                            <TextInput
                                style={{height: 80,textAlignVertical: "top",color: "#666"}}
                                onChangeText={(text) => this.setState({content: text.trim()})}
                                placeholder="请输入会议内容"
                                multiline={true}
                                value={this.state.content}
                            />
                        </View>
                        <TouchableOpacity style={[styles.item,{height: 50}]} onPress={this.chooseReportDept}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleQuery/appsBig.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                    会议范围
                                </Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text style={{fontSize: 14, color: "#666"}}>{this.state.selectDep ? this.state.selectDep.fName : '请选择部门'}</Text>
                                <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 13 }}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item,{height: 50}]} onPress={this.showMeetingAddress}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleQuery/appsBig.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                    会议室
                                </Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text style={{fontSize: 14, color: "#666"}}>{this.state.addressData.fName}</Text>
                                <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 13 }}/>
                            </View>
                        </TouchableOpacity>
                        <View style={{marginTop: 10,borderBottomColor: "#F0F1F6",borderBottomWidth: 1,}}>
                            <SelectPeople title="参会人"  showPeople={true} required={true} value={this.state.participationArr} onChange={(arr)=>this.setState({participationArr: arr})}/>
                        </View>
                        <View style={{marginTop: 10,borderBottomColor: "#F0F1F6",borderBottomWidth: 1}}>
                            <SelectReportPeople title="记录人"  showPeople={true} required={true} getValue={this.state.participationArr} value={this.state.recordArr} onChange={(arr)=>this.setState({recordArr: arr})}/>
                        </View>
                        <View style={{marginTop: 10,borderBottomColor: "#F0F1F6",borderBottomWidth: 1}}>
                            <SelectPeople title="抄送人" showPeople={true} required={false} value={this.state.peopleArr} onChange={(arr)=>this.setState({peopleArr: arr})}/>
                        </View>
                        <View>
                            <View style={{flexDirection: "row",alignItems: "center",marginTop: 20}}>
                                <Image source={require("../../image/troubleIssue/mapMarker.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    文件
                                </Text>
                            </View>
                            <View style={{width: "100%",paddingBottom: 10,paddingTop: 5}}>
                                <AppendixUpload value={this.state.appendixArr} onChange={(arr)=>this.setState({appendixArr:arr})}/>
                            </View>
                        </View>
                        <View>
                            <View style={{flexDirection: "row",alignItems: "center",marginTop: 20}}>
                                <Image source={require("../../image/troubleIssue/mapMarker.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
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
                        <TouchableOpacity onPress={() => this.publishIssue()} style={styles.publishButton}>
                            <Text style={{color: "#fff", fontSize: 16}}>发布</Text>
                        </TouchableOpacity>
                    </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        meetingType: state.meetingReducer.meetingType,
        meetingRoom: state.meetingReducer.meetingRoom,
        fEmployeeId: state.userReducer.userInfo.fEmployeeId,
        fUserName: state.userReducer.userInfo.fUserName
    }
}


export default connect(mapStateToProps)(MeetingIssue);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        display: "flex"
    },
    content: {
        marginTop: 12,
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
    }
});
