import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, Image, TouchableHighlight, RefreshControl, Platform, ScrollView} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import SplashScreen from 'react-native-splash-screen';
import CameraUpload from '../../components/ImageAbout/CameraUpload';
import Radio from '../../components/radio';
import ConfirmModal from '../../components/confirmModal';
import deviceServer from '../../service/deviceServer';

import {clientHeight, navHeight,isIphoneX} from '../../utils/screen';
import Header from '../../components/header';
import Toast from '../../components/toast';
import { handlePhotoToJs } from '../../utils/handlePhoto';
const navStyle = navHeight();
const isAndroid = Platform.OS === 'android';
const {width, height} = Dimensions.get('window');
export default class App extends Component {
    state = {
        content: '',
        picArr: [],
        choose2: true,
        showModal: false,
        unContent: '',
        detail: {},
        items: [],
        fromTask: false,
        fFinishedCause: null,
        mainDetail: {},
        finish: true
    };
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
   

    componentDidMount() {
        SplashScreen.hide();
        if (this.props.navigation.state.params && this.props.navigation.state.params.item) {
            console.log('this.props.navigation.state.params.item', this.props.navigation.state.params);
            this.setState({
                detail: this.props.navigation.state.params.item,
                fromTask: this.props.navigation.state.params.item.fromTask ?  true : false,
                mainDetail: this.props.navigation.state.params.detail,
                fFinishedCause: this.props.navigation.state.params.item.fFinishedCause,
                fState: this.props.navigation.state.params.item.fState,
                finish: this.props.navigation.state.params.item.fState === 2 ? false : true,
            }, ()=>{
                console.log(this.state.fromTask, 'this.props.navigation.state.params.fromTask')
                this.getRecordEquipment();
            });
        }
    }

    // 获取保养详情数据
    getRecordEquipment = async () => {
        const { detail } = this.state;
        global.loading.show();
        const res = await deviceServer.getEquipmentMaintains({
            maintainRecordEquipmentId: detail.fMaintainRecordEquipmentId,
            maintainLevel: detail.maintainLevel
        });
        global.loading.hide();
        console.log('res', res);
        if (res.success) {
            console.log('handlePhotoToJs(res.obj.fileManagementList)', handlePhotoToJs(res.obj.fileManagementList));
            this.setState({
                picArr: handlePhotoToJs(res.obj.fileManagementList),
                items: res.obj.itemsList,
                choose2: res.obj.fState == 1 ? false : true,
                content: res.obj.fMaintainRecordContent
            });
        } else {
            Toast.show(res.msg);
        }
    }

    rejectCancel = () => {
        this.setState({
            showModal: false,
            choose2: true,
        })
    }
    rejectOk = (text) => {
        if(text == ""){
            Toast.show("请填写未完成原因")
        }else{
            this.setState({
                showModal: false
            }, ()=>{
                this.commitRecordAjax(text);
            })
        }
        
    }
    // 提交保养记录
    commitRecord = async () => {
        const { choose2 } = this.state;
        if (!choose2) {
            this.setState({showModal: true});
            return;
        }
        this.commitRecordAjax();
    }

    // 提交数据保养记录
    commitRecordAjax = async (text) => {
        const { choose2, picArr, content, detail } = this.state;
        let fileManagementDTOS = [];
        global.loading.show();
        for (let obj of picArr) {
            if (obj.status == 'success') {
                fileManagementDTOS.push({
                    fFileName: obj.fileName,
                    fFileLocationUrl: obj.path,
                    fType: obj.type
                })
            } else if (obj.status == 'uploading') {
                Toast.show('上传中，请稍后');
                return;
            }
        }
        
        const res = await deviceServer.updateMaintainRecord({
            fileManagements: fileManagementDTOS,
            maintainRecordContent: content,
            maintainEquipmentId: detail.fMaintainRecordEquipmentId,
            equipmentId: detail.fEquipmentId,
            state: choose2 ? 2 : 1, // 1未完成 2已完成
            fFinishedCause: text || null
        });
        global.loading.hide();
        if (res.success) {
            const { goBack, state } = this.props.navigation;
            goBack();
            state && state.params && state.params.onRefresh();
            Toast.show(res.msg);
        } else {
            Toast.show(res.msg);
        }
    }
    render() {
        console.log(this.state.picArr, 'picArr', this.state.mainDetail)
        const {  typeData, taskStatus, detail } = this.state;
        return (
            <View style={styles.container}>
                <Header
                    backBtn={true}
                    titleText="保养详情"
                    hidePlus={true}
                    rightBtn={
                        <TouchableOpacity style={{marginRight: 10}} onPress={()=>this.props.navigation.push('CarshopsNotis',{id: this.state.detail.fEquipmentId,Level: this.state.detail.maintainLevel})}>
                            <Text style={{ color: '#fff', fontSize: 16 }}>注意</Text>
                        </TouchableOpacity>
                    }
                />
                <ConfirmModal 
                    showModal={this.state.showModal}
                    onClose={()=>this.setState({showModal: !this.state.showModal})}
                    onCancel={this.rejectCancel}
                    onOk={this.rejectOk}
                    title="请填写未完成原因"
                    placeHolder="请填写未完成原因 (必填)"
                />
                <ScrollView>
                    <View style={styles.common}>
                        <View style={{flexDirection: "row",justifyContent: "space-between",alignItems: "center"}}>
                            <Text style={styles.topTitle}>{detail.fEquipmentName}</Text>
                            {
                                this.state.fromTask?
                                <Text style={{color: "#4058FD",fontSize: 14,marginRight: 36}}>{this.state.fState != null? (this.state.fState == 0? '待保养': (this.state.fState == 1? "待保养": '已保养')): '--'}</Text>
                                :
                                <Text style={{color: "#4058FD",fontSize: 14,marginRight: 36}}>{this.state.fState != null? (this.state.fState == 0? '未开始': (this.state.fState == 1? "待完成": '已完成')): '--'}</Text>
                            }
                        </View>
                        <View style={{padding: 10,backgroundColor: "#fff",borderRadius: 5}}>
                            <Text style={styles.conText}>保养项</Text>
                            {this.state.items.map((data, index)=>{
                                return (
                                    <View style={styles.inContent}>
                                        <Text style={{color: "#333",fontSize: 14}}>{index + 1}.</Text>
                                        <View style={{flex: 1}}>
                                            <Text style={{fontSize: 14,color: "#333"}}>{data.fMaintainItemsTitle}</Text>
                                            <View style={{flexDirection: "row",marginTop: 5}}>
                                                <Text style={{fontSize: 14,color: "#666"}}>如有必要: </Text>
                                                <Text style={{fontSize: 14,color: "#666",flex: 1}}>{data.fMaintainItemsOperate||'--'}</Text>
                                            </View>
                                            <View style={{flexDirection: "row",marginTop: 5}}>
                                                <Text style={{fontSize: 14,color: "#666"}}>保养备注: </Text>
                                                <Text style={{fontSize: 14,color: "#666",flex: 1}}>{data.fMaintainItemsRemarks||'--'}</Text>
                                            </View>
                                        </View>
                                    </View> 
                                )
                            })}
                        </View>
                    </View>
                    <View style={[styles.common,{marginTop:10}]}>
                        <View style={{backgroundColor: "#fff",padding: 15,borderRadius: 5}}>
                            <Text style={styles.conText}>保养内容记录</Text>
                            <View style={{height: 90,borderWidth: 1,borderColor: "#E0E0E0",borderRadius: 5}}>
                                {
                                    this.state.mainDetail.fMaintainTaskState == 2 ? 
                                    <TextInput
                                        editable={false}
                                        style={{height: 90,textAlignVertical: "top",flex: 1,color: "#333",paddingLeft: 10,paddingRight: 10}}
                                        onChangeText={(text) => this.setState({content: text})}
                                        placeholder="请输入保养内容记录(选填)"
                                        multiline={true}
                                        value={this.state.content}
                                    />
                                     : 
                                    <TextInput
                                        editable={this.state.fromTask&&this.state.finish}
                                        style={{height: 90,textAlignVertical: "top",flex: 1,color: "#333",paddingLeft: 10,paddingRight: 10}}
                                        onChangeText={(text) => this.setState({content: text})}
                                        placeholder="请输入保养内容记录(选填)"
                                        multiline={true}
                                        value={this.state.content}
                                    />
                                }
                                
                            </View>
                        </View>
                        <View style={{backgroundColor: "#fff",paddingLeft: 15,paddingRight: 15}}>
                            <Text style={styles.conText}>设备照片</Text>
                            {
                                this.state.mainDetail.fMaintainTaskState == 2 ? 
                                <CameraUpload
                                    disabled={true}
                                    value={this.state.picArr}
                                    onChange={(picArr)=>this.setState({picArr})}
                                    imgStyle={{width: width*0.23, height: width*0.23}}
                                /> : 
                                <CameraUpload
                                    disabled={!this.state.fromTask || !this.state.finish}
                                    value={this.state.picArr}
                                    onChange={(picArr)=>this.setState({picArr})}
                                    imgStyle={{width: width*0.23, height: width*0.23}}
                                />
                            }
                            
                        </View>
                    </View>
                    <View style={[styles.common,{marginTop:10,marginBottom: 40}]}>
                        <View style={{backgroundColor: "#fff",padding: 15,borderRadius: 5}}>
                            <Text style={styles.conText}>保养结果</Text>
                            <View style={[styles.rowStyle, {marginTop: 10,paddingLeft: 10,flexDirection: "row", position: 'relative'}]}>
                                {this.state.fromTask&&this.state.finish ? this.state.mainDetail.fMaintainTaskState == 2 ? <View style={{position: 'absolute', width: 150,height: 30,backgroundColor: 'transparent',zIndex: 999}}></View> : null: 
                              <View style={{position: 'absolute', width: 150,height: 30,backgroundColor: 'transparent',zIndex: 999}}></View>}

                                <Radio label="完成" value={this.state.choose2} onChange={()=>this.setState({choose2: !this.state.choose2})}/>
                                <Radio style={{marginLeft: 15}} label="未完成" value={!this.state.choose2} onChange={()=>this.setState({choose2: !this.state.choose2})}/>
                            </View>
                        </View>
                        {
                        this.state.fState !== 2&&this.state.fFinishedCause != null ? 
                            <View style={{padding: 10}}>
                                <Text style={{color: "#333"}}>未完成原因: {this.state.fFinishedCause}</Text>
                            </View>
                        : null
                        }
                    </View>
                    
                    
                </ScrollView>
                {this.state.fromTask&&this.state.finish ? this.state.mainDetail.fMaintainTaskState == 2 ? null :
                <View style={{bottom: 0,paddingLeft: 16,paddingRight: 16, backgroundColor: '#fff',paddingTop: 10,paddingBottom: 10}}>
                    <TouchableOpacity style={styles.bottom} onPress={this.commitRecord}>
                      <Text style={{color: '#fff',fontSize: 16}}>提交</Text>
                    </TouchableOpacity>
                </View> : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6'
    },
    topTitle:{
        paddingLeft: 16,
        color: "#333",
        fontWeight: "500",
        paddingLeft: 15,
        marginTop: 15,
        marginBottom: 15
    },
    conText: {
        paddingTop: 10,
        color: "#333",
        fontSize: 14,
        paddingBottom: 10,
        paddingLeft: 5,
        fontWeight: "500"
    },
    inContent:{
        padding: 10,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: "#F6F6F6",
        borderRadius: 5,
        flexDirection: "row",
        marginBottom: 10,
    },
    common: {
        paddingLeft: 16,
        paddingRight: 16
    },
    bottom: {
        height: 44,
        backgroundColor: '#4058FD',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4 
    }
});   
