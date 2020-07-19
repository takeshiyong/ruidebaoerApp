import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, TextInput} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';

import Toast from '../../components/toast';
import Header from '../../components/header';
import ConfirmModal from '../../components/confirmModal';
import AppendixUpload from '../../components/AppendixUpload/appendixUpload';
import troubleService from '../../service/troubleService';
import CameraUpload from '../../components/ImageAbout/CameraUpload';
import { handlePhotoToJs } from '../../utils/handlePhoto';

const {width, height} = Dimensions.get('window');
class RectificationResult extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });

    state = {
        showModal: false,
        detail: {},
        picArr: [],
        remark: '',
        appendixArr: []
    }

    componentDidMount() {
        // 获取上一个页面的数据 请求详情接口
        if (this.props.navigation.state.params && this.props.navigation.state.params.item) {
            this.setState({
                detail: this.props.navigation.state.params.item
            })
        }
    }

    // 提交整改结果
    handleAudit = async () => {
        const { appendixArr, picArr, remark, detail} = this.state;
        const { goBack, state } = this.props.navigation;
        let finishImg = [];
        let finishFile = [];
        for (let obj of picArr) {
            if (obj.status == 'success') {
                finishImg.push({
                    fFileName: obj.fileName,
                    fFileLocationUrl: obj.path,
                    fType: obj.type
                })
            } else if (obj.status == 'uploading') {
                Toast.show('上传中，请稍后');
                return;
            }
        }
        for (let obj of appendixArr) {
            if (obj.status == 'success') {
                finishFile.push({
                    fFileName: obj.fileName,
                    fFileLocationUrl: obj.path,
                    fType: obj.type
                })
            } else if (obj.status == 'uploading') {
                Toast.show('上传中，请稍后');
                return;
            }
        }
        if (finishImg.length == 0) {
            Toast.show('整改后照片/视频不能为空');
            return;
        }
        global.loading.show();
        const res = await troubleService.finishHiddenTrouble({
            fId: detail.fId,
            fRemark: remark.trim(),
            finishFile,
            finishImg
        });
        global.loading.hide();
        if (res.success) {
            Toast.show(res.msg);
            goBack();
            state.params.refresh && state.params.refresh();
        } else {
            Toast.show(res.msg);
        }
    }
    
    render() {
        const { showModal, detail } = this.state;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="整改结果提交"
                    hidePlus={false} 
                />
                <ScrollView>
                    <View style={styles.content}>
                        <View style={styles.item}>
                            <View style={{flexDirection: "row",alignItems: "center",marginTop: 22,marginBottom: 13}}>
                                <Image source={require("../../image/troubleIssue/mapMarker.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>
                                <Text style={{color: 'red'}}>*</Text>整改后照片/视频</Text>
                            </View>
                            <View style={{flexDirection: "row",marginTop: 5,marginBottom: 10,flexWrap: "wrap",justifyContent: "space-between"}}>
                                <CameraUpload
                                    value={this.state.picArr}
                                    onChange={(picArr)=>this.setState({picArr})}
                                    imgStyle={{width: width*0.26, height: width*0.26}}
                                />
                            </View>
                        </View>
                        <View style={styles.item}>
                            <View style={{flexDirection: "row",alignItems: "center",marginTop: 22,marginBottom: 5}}>
                                <Image source={require("../../image/troubleDetails/filePencil.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>备注</Text>
                            </View>
                            <TextInput
                                style={{height: 70,textAlignVertical: "top",marginBottom: 10}}
                                onChangeText={(text) => this.setState({remark: text})}
                                placeholder="请输入备注"
                                multiline={true}
                                value={this.state.remark}
                            />
                            
                        </View>
                        <View style={[styles.item, {paddingBottom: 10, flexDirection: 'row', alignItems: 'flex-start'}]}>
                            <View style={{flexDirection: "row",alignItems: "center",marginTop: 22,marginBottom: 5, flex: 2}}>
                                <Image source={require("../../image/TroubleCallBack/paperclipCircle.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>附件</Text>
                            </View>
                            <View style={{flex: 3,marginTop: 20}}>
                                <AppendixUpload value={this.state.appendixArr} onChange={(arr)=>this.setState({appendixArr:arr})}/>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.bottomRight} onPress={this.handleAudit}>
                        <Text style={{color: "#fff", fontSize: 14}}>提交</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    troubleLevelParam: state.troubleReducer.troubleLevelParam,
    troubleTypeParam: state.troubleReducer.troubleTypeParam
});

export default connect(mapStateToProps)(RectificationResult);

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
        height: 45,
        borderRadius: 4,
        marginRight: 15,
        marginLeft: 15,
        marginTop: 10
    }
    
});
