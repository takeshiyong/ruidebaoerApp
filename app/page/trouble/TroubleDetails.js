import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, TextInput} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import { connect } from 'react-redux';

import Toast from '../../components/toast';
import Header from '../../components/header';
import ConfirmModal from '../../components/confirmModal';
import troubleService from '../../service/troubleService';
import CameraUpload from '../../components/ImageAbout/CameraUpload';
import { handlePhotoToJs, parseDate } from '../../utils/handlePhoto';

const {width, height} = Dimensions.get('window');
class TroubleDetails extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });

    state = {
        showModal: false,
        detail: {},
        picArr: []
    }

    componentDidMount() {
        // 获取上一个页面的数据 请求详情接口
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
                picArr: handlePhotoToJs(res.obj.reportImg)
            })
        } else {
            Toast.show(res.msg);
        }
    }

    // 拒绝状态选择了取消事件
    rejectCancel = () => {
        const { navigate,goBack,state } = this.props.navigation;
        this.setState({showModal: false});
    }



    // 拒绝状态选择了确认事件
    rejectOk = (text) => {
        this.setState({ showModal: false }, ()=>this.handleAudit(text, false));
        // 返回到审核列表页面
        
    }

    // 处理审核 逻辑
    handleAudit = async (text, flag) => {
        const { navigate, goBack, state } = this.props.navigation;
        const { detail } = this.state;
        global.loading.show();
        const res = await troubleService.troubleAudit({
            fId: detail.fId,
            fIsThrough: flag,
            fAuditCause: text
        });
        console.log('res', res);
        global.loading.hide();
        if (res.success) {
            if (flag) {
                navigate('TroubleJudgment',{item: detail});
            } else {
                state.params.refresh();
                goBack();
            }
        } else {
           Toast.show(res.msg);
        }
    }


    
    render() {
        const { showModal, detail } = this.state;
        const { navigate, goBack, state } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText={this.state.detail.fState ==1 ? '隐患审核': '隐患详情'}
                    hidePlus={false} 
                />
                <ConfirmModal 
                    showModal={showModal}
                    onClose={()=>this.setState({showModal: !showModal})}
                    onCancel={this.rejectCancel}
                    onOk={this.rejectOk}
                    title="隐患审核未通过"
                    placeHolder="请填写未通过原因 (选填)"
                />
                <ScrollView>
                    <View style={styles.content}>
                        <View style={[styles.item,{alignItems: "center", flexDirection: "row",height: 48}]}>
                            <View style={{flexDirection: "row",alignItems: "center", flex: 2}}>
                                <Image source={require("../../image/troubleDetails/appsBig.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>隐患类型</Text>
                            </View>
                            <Text style={{color: "#666",fontSize: 14,flex: 3}}>
                                { detail.fTypeId ? this.props.troubleTypeParam[detail.fTypeId] : '--'}
                            </Text>
                        </View>
                        <View style={styles.item}>
                            <View style={{flexDirection: "row",alignItems: "center",marginTop: 22,marginBottom: 13}}>
                                <Image source={require("../../image/troubleIssue/mapMarker.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>隐患地点</Text>
                            </View>
                            <Text style={{fontSize: 14,color: "#666",width: width-32,lineHeight: 20,paddingBottom: 20}}>
                                {detail.fSite||'--'}
                            </Text>
                        </View>
                        <View style={styles.item}>
                            <View style={{flexDirection: "row",alignItems: "center",marginTop: 22,marginBottom: 13}}>
                                <Image source={require("../../image/troubleDetails/filePencil.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>隐患内容</Text>
                            </View>
                            <Text style={{fontSize: 14,color: "#666",width: width-32,lineHeight: 20}}>
                                {detail.fContent||'--'}
                            </Text>
                            <View style={{flexDirection: "row",marginTop: 22,flexWrap: "wrap",justifyContent: "space-between"}}>
                                <CameraUpload
                                    value={this.state.picArr}
                                    disabled={true}
                                    onChange={(picArr)=>this.setState({picArr})}
                                    imgStyle={{width: width*0.26, height: width*0.26}}
                                />
                            </View>
                        </View>
                        <View style={[styles.item,{flexDirection: "row",height: 48,alignItems: "center",borderBottomColor: "#F6F6F6",borderBottomWidth: 1}]}>
                            <View style={{flexDirection: "row",alignItems: "center",flex: 2}}>
                                <Image source={require("../../image/troubleDetails/calendar.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>发现时间</Text>
                            </View>
                            <Text style={{color: "#666",fontSize: 14,flex: 3}}>
                                {detail.fReportTime ? parseDate(detail.fReportTime, 'YYYY-MM-DD HH:mm'): '--'}
                            </Text>
                        </View>
                        <View style={[styles.item,this.state.detail.fState == 0 ? {paddingBottom: 18} : {marginBottom: 22,paddingBottom: 18}]}>
                            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center",marginTop: 20}}>
                                <View style={{flexDirection: "row",alignItems: "center",flex: 2}}>
                                    <Image source={require("../../image/troubleDetails/user.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                    <Text style={{color: "#333333", fontSize: 14,fontWeight: '600'}}>上报人</Text>
                                </View>
                                <Text style={{flex: 3}}>{detail.fReportUserName||'--'}</Text>
                            </View>
                        </View>
                        {this.state.detail.fState == 0 ? 
                        <View style={[styles.item, {paddingBottom: 18}]}>
                            <View style={{flexDirection: "row",alignItems: "center",marginTop: 22,marginBottom: 13}}>
                                <Image source={require("../../image/troubleDetails/filePencil.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>未通过原因</Text>
                            </View>
                            <Text style={{fontSize: 14,color: "#666",width: width-32,lineHeight: 20}}>
                                {detail.fAuditCause||'--'}
                            </Text>
                        </View>: null}
                    </View>
                </ScrollView>
                {
                    state.params.noBtn || detail.fState == 0 ? null : 
                    <View style={styles.botton}>
                        <TouchableOpacity style={styles.bottomLeft} onPress={()=>this.setState({showModal: true})}>
                            <Text style={{color: "#333", fontSize: 14}}>审核不通过</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bottomRight} onPress={()=>this.handleAudit('', true)}>
                            <Text style={{color: "#fff", fontSize: 14}}>审核通过</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    }
}

const mapStateToProps = state => ({
    troubleLevelParam: state.troubleReducer.troubleLevelParam,
    troubleTypeParam: state.troubleReducer.troubleTypeParam
});

export default connect(mapStateToProps)(TroubleDetails);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        display: "flex"
    },
    item: {
        marginTop: 12,
        backgroundColor: "#fff",
        paddingLeft: 16,
        paddingRight: 16
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
