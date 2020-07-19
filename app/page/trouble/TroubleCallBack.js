import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, TextInput, Linking} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SplashScreen from 'react-native-splash-screen';

import Header from '../../components/header';
import Toast from '../../components/toast';
import SelectPeople from '../../components/selectPeople';
import AppendixUpload from '../../components/AppendixUpload/appendixUpload';
import CameraUpload from '../../components/ImageAbout/CameraUpload';
import config from '../../config/index';
import { handlePhotoToJs, parseDate } from '../../utils/handlePhoto';
import troubleService from '../../service/troubleService';

const {width, height} = Dimensions.get('window');
export default class TroubleSaftNotify extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null,
        
    });
    
    state = {
        type: 2,
        value: [],
        detail: {},
        repairImg: [],
        appendixArr: [],
        fDisposeUserName: [],
        reportImg: []
    }

    componentDidMount() {
        if (this.props.navigation.state.params && this.props.navigation.state.params.item) {
            // this.chooseItem(this.props.navigation.state.params.depId);
            this.getTrounbleDetail(this.props.navigation.state.params.item);
        }
    }

    // 通过fid获取详情数据
    getTrounbleDetail = async (item) => {
        global.loading.show();
        const res = await troubleService.getTroubleDetailById(item.fId);
        console.log('res', res);
        global.loading.hide();
        if (res.success) {
            this.setState({
                detail: res.obj,
                reportImg: handlePhotoToJs(res.obj.reportImg),
                repairImg: handlePhotoToJs(res.obj.finishImg),
                appendixArr: handlePhotoToJs(res.obj.finishFile),
                fDisposeUserName: res.obj.fDisposeUsers ? res.obj.fDisposeUsers.map((data)=>({fId: data.fUserId, fUserName: data.fUserName})) : []
            });
        } else {
            Toast.show(res.msg);
        }
    }

    // 隐患复查
    reviewTrouble = async (flag) => {
        const { detail } = this.state;
        const { goBack, state, replace } = this.props.navigation;
        global.loading.show();
        const res = await troubleService.reviewHiddenTrouble({
            fId: detail.fId,
            fIsPass: flag
        });
        global.loading.hide();
        if (res.success) {
            Toast.show(res.msg);
            if (!flag) {
                replace({routeName: 'TroubleJudgment', params: {item: detail, refresh: state.params.refresh}});
            } else {
                goBack();
                state.params.refresh && state.params.refresh();
            }
        } else {
            Toast.show(res.msg);
        }
    }

    // 撤回
    markWithdraw = async () => {
        const { detail } = this.state;
        const { goBack, state } = this.props.navigation;
        global.loading.show();
        const res = await troubleService.revocationTrouble(detail.fId);
        global.loading.hide();
        if (res.success) {
            Toast.show(res.msg);
            goBack();
            state.params.refresh && state.params.refresh();
        } else {
            Toast.show(res.msg);
        }
    }

    showButton = () => {
        const { detail } = this.state;
        if (detail.fState == 7) {
            return (<View style={styles.botton}>
                <TouchableOpacity style={styles.bottomRight}  onPress={this.reJudged}>
                    <Text style={{color: "#fff", fontSize: 14}}>重新研判</Text>
                </TouchableOpacity>
            </View>)
        } else if (detail.fState == 5) {
            return (<View style={styles.botton}>
                <TouchableOpacity style={styles.bottomLeft} onPress={()=>this.reviewTrouble(false)}>
                    <Text style={{color: "#333", fontSize: 14}}>整改不通过</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomRight} onPress={()=>this.reviewTrouble(true)}>
                    <Text style={{color: "#fff", fontSize: 14}}>整改通过</Text>
                </TouchableOpacity>
        </View>)
        } else if (detail.fState == 4) {
            return (
                <View style={styles.botton}>
                    <TouchableOpacity style={styles.bottomRight} onPress={()=>this.markWithdraw()}>
                        <Text style={{color: "#fff", fontSize: 14}}>撤回</Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return
        }
    }
    changeTitle = () => {
        console.log('detail')
        const { detail } = this.state;
        if (detail.fState == 4){
            return "安全整改反馈单"
        } else if (detail.fState == 5){
            return "安全整改复查单"
        } else if (detail.fState == 6) {
            return "销号隐患信息";
        } else if (detail.fState == 8) {
            return "反馈单";
        } else if (detail.fState == 7 || detail.fState == 10) {
            return "安全整改反馈单";
        }  
        return ''
    }

    // 重新下发
    reIssue = () => {
        const { state, goBack } = this.props.navigation;

        goBack();
        state.params.refresh && state.params.refresh();
    }

    // 重新研判
    reJudged = () => {
        const { navigate, goBack, state, replace } = this.props.navigation;
        const { detail } = this.state;
        replace({routeName: 'TroubleJudgment', params: {item: detail, refresh: state.params.refresh}})
    }

    // 跳转整改通知单页面
    toNotifyPage = () => {
        const { navigate, goBack, state } = this.props.navigation;
        const { detail } = this.state;
        navigate('TroubleSafeNotify', {item: detail,showOperating: true});
    }

    // 下载文件
    downFile = () => {
        let data = 'group1/M00/00/00/rBEABl05c5uAVUPJAEflDL36MM4752.mp4';
        Linking.openURL(config.imgUrl + data).catch(err => console.error('An error occurred', err));
    }

    // 反馈信息语句
    backInfo = () => {
        const { detail } = this.state;
        if (detail.fState == 4 || detail.fState == 10) {
            return `我单位根据${detail.fAuditTime ? parseDate(detail.fAuditTime,'YYYY年MM月DD日'):''}第${detail.fNo || '--'}号，提出的安全整改通知，已按规定制定了整改计划，特此回复。`
        } else if (detail.fState == 7) {
            return `我单位对${detail.fAuditTime ? parseDate(detail.fAuditTime,'YYYY年MM月DD日'):''}第${detail.fNo || '--'}号，提出的安全整改通知有较大异议，原因为${detail.fRejectCause||'--'}，特此回复。`
        } else if (detail.fState == 5) {
            return `我单位根据${detail.fAuditTime ? parseDate(detail.fAuditTime,'YYYY年MM月DD日'):''}第${detail.fNo || '--'}号，提出的安全整改通知，已按整改计划整改完毕，特此回复。`
        } else if (detail.fState == 6) {
            return `我单位根据${detail.fAuditTime ? parseDate(detail.fAuditTime,'YYYY年MM月DD日'):''}第${detail.fNo || '--'}号，提出的安全整改通知，已按整改计划整改完毕，特此回复。`
        }
    }

    // 跳转查看隐患操作相关人
    jumpAboutPeoplePage = () => {
        const { navigate } = this.props.navigation;
        const { detail } = this.state;
        navigate('TroublePeople', {item: detail});
    }
    
    render() {
        const { detail } = this.state;
        const { state, goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText={this.changeTitle()}
                    hidePlus={false} 
                    props={this.props}
                />
                <ScrollView>
                    <View style={styles.content}>
                        <TouchableOpacity onPress={this.toNotifyPage} style={[styles.item,{alignItems: "center", flexDirection: "row",height: 48,justifyContent: "space-between", borderBottomWidth: 0}]}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/TroubleCallBack/info.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>整改通知单</Text>
                            </View>
                            <View style={{flexDirection: "row", fontWeight: "600", alignItems: "center"}}>
                                <Text style={{fontSize: 14, color: "#4058FD"}}>
                                    {detail.fNo ? detail.fNo: '--'}
                                </Text>
                                <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 8 }}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.content}>
                        { detail.fState == 8 || detail.fState == 5 || detail.fState == 6? null :
                            <View style={{backgroundColor: "#fff",borderBottomColor: "#E0E0E0", borderBottomWidth: 1}}>
                                <View style={{flexDirection: "row",alignItems: "center",marginTop: 22,marginBottom: 10}}>
                                    <Image source={require("../../image/TroubleCallBack/filePencil.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                    <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>反馈描述</Text>
                                </View>
                                <Text style={{fontSize: 14,color: "#666",width: width-32,lineHeight: 20,marginBottom: 20}}>
                                    {this.backInfo()}
                                </Text>  
                                 
                            </View> }
                        {detail.fState == 4 ?
                            <View style={[styles.item, {borderBottomWidth: 1,marginTop: 10,paddingBottom: 10}]}>
                                <SelectPeople title="隐患整改人" value={this.state.fDisposeUserName} disabled={true}/>
                            </View> : null }
                        {   detail.fState == 6 ? 
                                <View style={styles.completeIcon}>
                                    <Image source={require('../../image/TroubleCallBack/img.png')} style={{width: 140, height: 140}}/>
                                    <Text style={styles.completeText}>{parseDate(detail.fReviewTime, 'YYYY-MM-DD')}</Text>
                                </View> : null
                            } 
                        {detail.fState == 5 ||  detail.fState == 6 ||  detail.fState == 4 || detail.fState == 7 || detail.fState == 10 ? null : 
                        <View style={styles.itemUnit}>
                            <View style={{flexDirection: "row",alignItems: "center", flex: 2}}>
                                <Image source={require("../../image/TroubleCallBack/userGroup.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>下发单位</Text>
                            </View>
                            <Text style={{color: "#666",fontSize: 14,flex: 3}}>{detail.fIssueUserDepName||'--'}</Text>
                        </View>}
                        {detail.fState == 5 ||  detail.fState == 6 ||  detail.fState == 4 || detail.fState == 7 || detail.fState == 10 ? null :
                        <View style={[styles.itemUnit, {borderBottomWidth: detail.fState == 7 ? 0 : 1 }]}>
                            <View style={{flexDirection: "row",alignItems: "center",flex: 2}}>
                                <Image source={require("../../image/TroubleCallBack/calendar.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>署名时间</Text>
                            </View>
                            <Text style={{color: "#666",fontSize: 14,flex: 3}}>
                                {detail.fIssueTime ? parseDate(detail.fIssueTime, 'YYYY-MM-DD HH:mm'): '--'}
                            </Text>
                        </View>}
                        {detail.fState == 7 ||  detail.fState == 4 || detail.fState == 10? 
                         null :
                        <View>
                            <View style={styles.item}>
                                <View style={{flexDirection: "row",alignItems: "center",marginTop: 22,marginBottom: 5}}>
                                    <Image source={require("../../image/troubleDetails/filePencil.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                    <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>隐患图片/视频</Text>
                                </View>
                                <View style={{flexDirection: "row",marginTop: 12,flexWrap: "wrap",justifyContent: "space-between"}}>
                                    <CameraUpload
                                        value={this.state.reportImg}
                                        disabled={true}
                                        onChange={(picArr)=>this.setState({reportImg:picArr})}
                                        imgStyle={{width: width*0.26, height: width*0.26}}
                                    />
                                </View>
                            </View>
                            <View style={{backgroundColor: "#fff",borderBottomColor: "#E0E0E0", borderBottomWidth: detail.fState == 5 || detail.fState == 6 ? 0 : 1}}>
                                <View style={{flexDirection: "row",alignItems: "center",marginTop: 22,marginBottom: 10}}>
                                    <Image source={require("../../image/TroubleCallBack/questionCircle.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                    <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>隐患描述</Text>
                                </View>
                                <Text style={{fontSize: 14,color: "#666",width: width-32,lineHeight: 20,marginBottom: 20}}>
                                    {detail.fContent || '--'}
                                </Text>
                            </View>
                            {detail.fState == 5 || detail.fState == 6 ? null : 
                            <View style={{backgroundColor: "#fff",borderBottomColor: "#E0E0E0",borderBottomWidth: 1}}>
                                <View style={{flexDirection: "row",alignItems: "center",marginTop: 22,marginBottom: 10}}>
                                  <Image source={require("../../image/troubleDetails/filePencil.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                  <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>整改措施</Text>
                                </View>
                               <Text style={{fontSize: 14,color: "#666",width: width-32,lineHeight: 20,marginBottom: 20}}>
                                    {detail.fMeasures || '--'}
                               </Text>
                            </View> }
                            
                        </View> }
                    </View>
                    { detail.fState == 7 || detail.fState == 4 || detail.fState == 10 ? null : 
                        <View style={[styles.content,{marginBottom: 18}]}>
                            <View style={styles.item}>
                                <View style={{flexDirection: "row",alignItems: "center",marginTop: 22,marginBottom: 5}}>
                                    <Image source={require("../../image/troubleDetails/filePencil.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                    <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>整改完成照片/视频</Text>
                                </View>
                                <View style={{flexDirection: "row",marginTop: 12,flexWrap: "wrap",justifyContent: "space-between"}}>
                                    <CameraUpload
                                        value={this.state.repairImg}
                                        disabled={true}
                                        onChange={(picArr)=>this.setState({repairImg:picArr})}
                                        imgStyle={{width: width*0.26, height: width*0.26}}
                                    />
                                </View>
                            </View>
                            <View style={styles.item}>
                                <View style={{flexDirection: "row",alignItems: "center",marginTop: 22,marginBottom: 5}}>
                                    <Image source={require("../../image/troubleDetails/filePencil.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                    <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>备注</Text>
                                </View>
                                <Text style={{marginTop: 5,paddingBottom: 10}}>
                                    {detail.fRemark || '--'}
                                </Text>
                            </View>
                            <View style={[styles.item, {borderBottomWidth: 1,marginTop: 10,paddingBottom: 10}]}>
                                <SelectPeople title="隐患整改人" value={this.state.fDisposeUserName} disabled={true}/>
                            </View>
                            <View style={[styles.item, {paddingBottom: 10, flexDirection: 'row', alignItems: 'flex-start',borderBottomWidth: 0}]}>
                                <View style={{flexDirection: "row",alignItems: "center",marginTop: 22,marginBottom: 5, flex: 2}}>
                                    <Image source={require("../../image/TroubleCallBack/paperclipCircle.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                    <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>附件</Text>
                                </View>
                                <View style={{flex: 3,marginTop: 20}}>
                                    <AppendixUpload disabled={true} value={this.state.appendixArr} onChange={(arr)=>this.setState({appendixArr:arr})}/>
                                </View>
                            </View>
                        </View>}
                    <TouchableOpacity onPress={this.jumpAboutPeoplePage} style={{flexDirection: 'row',alignItems:'center',justifyContent: 'space-between',backgroundColor: '#fff',padding: 15, marginBottom: 20}}>
                        <View style={{flexDirection: "row",alignItems: "center", flex: 2}}>
                            <Image source={require("../../image/TroubleCallBack/userGroup.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                            <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>查看隐患操作相关人</Text>
                        </View>
                        <AntDesign name="right" color="#666666"/>
                    </TouchableOpacity>
                </ScrollView>
                { state.params.noBtn ? null : this.showButton()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    completeIcon: {
        position: 'absolute',
        top: 30,
        right: 10,
        zIndex: 999
    },
    item: {
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
    },
    completeText: { 
        color: '#53D8BC',
        position: 'absolute',
        top: 92,
        right: 8,
        fontSize: 12,
        transform: [{rotateZ:'315deg'}]
    },
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        display: "flex"
    },
    content: {
        marginTop: 12,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: "#fff",
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
