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
import SelectPeople from '../../components/selectPeople';


const {width, height} = Dimensions.get('window');
const PickerItem = Picker.Item;
class TroubleIssue extends Component {
    state = {
        showPicker: false,
        levelData: {
            index: 0,
            fId: '',
            fName: '请选择隐患级别'
        },
        typeData: {
            index: 0,
            fId: '',
            fName: '请选择隐患类型'
        },
        pickerList: [],
        pickerType: 0, // 0：是级别 1：是类型
        changeData: {},
        itemList: [],
        picArr: [],
        selectDep: null,
        reformContent: '',
        troubleText: '',
        date: null,
        site: '',
        discoveryTime: null,
        peopleArr: [],
        isFront: true,
    }
    //设置头部
    static navigationOptions = () => ({
        header: null
    });

    componentDidMount() {

    }

    //picker确认改值
    onPickerSelect = () => {
        const { levelData, typeData, pickerType, itemList, changeData } = this.state;
        const data = changeData;
		this.setState({
            showPicker: false,
            levelData: {
                index: levelData.index,
                fName: !pickerType ? data.fName : levelData.fName,
                fId: !pickerType ? data.fId : levelData.fId,
            },
            typeData: {
                index:  typeData.index,
                fName: pickerType ? data.fName : typeData.fName,
                fId: pickerType ? data.fId : typeData.fId,
            },
		})
    }

    // picker滚动的时候改值
    onPickerChange = (index) => {
        const { changeData, itemList } = this.state;
        this.setState({
            changeData: itemList[index]
        });
    }
    
    // 展开选择隐患类型
    showTroubleLevel = () => {
        const { levelData } = this.state;
        const selectList = this.props.troubleLevel.map((data, index)=>{
            return {
                index: index,
                fId: data.fId,
                fName: data.fLevelName
            }
        });
        this.setState({
            itemList: selectList,
            pickerList: selectList.map((data)=>(data.fName)),
            changeData: selectList[levelData.index],
            showPicker: true,
            pickerType: 0
        });
    }

    // 展开选择隐患级别
    showTroubleType = () => {
        const { typeData } = this.state;
        const selectList = this.props.troubleType.map((data, index)=>{
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
            pickerType: 1
        })
        
    }
    
    // 选择隐患上报单位
    chooseReportDept = () => {
        this.props.navigation.navigate('SelectDep',{sureDepId: this.getReportDept})
    }

    // 获取选中上报单位数据
    getReportDept = (dept) => {
        this.setState({
            selectDep: {fId: dept.fId, fName: dept.fName}
        });
    }

    // 发布隐患
    commitIssue = async () => {   
        const { levelData, typeData,discoveryTime,  picArr, selectDep, reformContent, site, troubleText, date } = this.state;
        const { goBack } = this.props.navigation;
        let fileManagementDTOS = [];
        if (levelData.fId.length == 0) {
            Toast.show('隐患级别不能为空');
            return;
        }
        if (typeData.fId.length == 0) {
            Toast.show('隐患类型不能为空');
            return;
        }
        if (site.trim().length == 0) {
            Toast.show('隐患地点不能为空');
            return;
        }
        if (troubleText.trim().length == 0) {
            Toast.show('隐患内容不能为空');
            return;
        }
        if (reformContent.trim().length == 0) {
            Toast.show('整改措施不能为空');
            return;
        }
        
        if (!discoveryTime) {
            Toast.show('整改期限不能为空');
            return;
        }
        if (!selectDep) {
            Toast.show('责任部门不能为空');
            return;
        }
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
        if (fileManagementDTOS.length == 0) {
            Toast.show('隐患图片,视频信息不能为空');
            return;
        }
        if (new Date(discoveryTime.replace(/-/g, '/')).getTime() < new Date().getTime()) {
            Toast.show('整改期限不能早于当前时间');
            return;
        }
        global.loading.show();
        const res = await troubleService.releaseHiddenTrouble({
            fileManagementDTOS,
            fTypeId: typeData.fId,
            fContent: troubleText,
            fPlanFinishTime: new Date(discoveryTime.replace(/-/g, '/')).getTime(),
            fSite: site,
            fLevelId: levelData.fId,
            fMeasures: reformContent,
            fDutyDepId: selectDep.fId,
            fReportTime: new Date().getTime() + 5000,
            fDisposeUsers: this.state.peopleArr.map((data)=>({fUserId: data.fId})),
            fIsRelease: this.state.isFront
        });
        global.loading.hide();
        if (res.success) {
            Toast.show(res.msg);
            goBack();
        } else {
            Toast.show(res.msg);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="隐患发布"
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
                        <TouchableOpacity style={[styles.item,{height: 50}]} onPress={this.showTroubleLevel}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleQuery/info.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                    隐患级别
                                </Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                            <Text style={{fontSize: 14, color: "#999999"}}>{this.state.levelData.fName}</Text>
                                <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 13 }}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item,{height: 50}]} onPress={this.showTroubleType}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleQuery/appsBig.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                    隐患类型
                                </Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text style={{fontSize: 14, color: "#999999"}}>{this.state.typeData.fName}</Text>
                                <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 13 }}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item,{height: 47}]}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleIssue/calendar.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                    整改期限
                                </Text>
                            </View>
                            <View style={{alignItems: "flex-end",flex: 1,justifyContent: 'center'}}>
                                <DatePicker
                                        style={{width: '100%'}}
                                        date={this.state.discoveryTime}
                                        mode="datetime"
                                        placeholder="请选择整改期限"
                                        format="YYYY-MM-DD HH:mm"
                                        minDate={moment().format('YYYY-MM-DD HH:mm')}
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
                                                color: '#999'
                                            },
                                            placeholderText: {
                                                color: '#999'
                                            }
                                        }}
                                        iconComponent={<AntDesign name="right" size={12} style={{ color: '#C1C1C1',marginLeft: 10 }}/>}
                                        onDateChange={(date) => {this.setState({discoveryTime: date})}}
                                    />
                            </View>
                        </TouchableOpacity>
                        <View style={{borderBottomColor: "#F0F1F6",borderBottomWidth: 1,}}>
                            <View style={{flexDirection: "row",alignItems: "center",marginTop: 20}}>
                                <Image source={require("../../image/troubleIssue/mapMarker.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                    隐患地点
                                </Text>
                            </View>
                            <TextInput
                                style={{height: 70,textAlignVertical: "top"}}
                                onChangeText={(text) => this.setState({site: text.trim()})}
                                placeholder="请输入隐患地点"
                                multiline={true}
                                value={this.state.site}
                            />
                        </View>
                        <View style={{borderBottomColor: "#F0F1F6",borderBottomWidth: 1,}}>
                            <View style={{flexDirection: "row",alignItems: "center",marginTop: 20}}>
                                <Image source={require("../../image/troubleIssue/mapMarker.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                    隐患内容
                                </Text>
                            </View>
                            <TextInput
                                style={{height: 70,textAlignVertical: "top"}}
                                onChangeText={(text) => this.setState({troubleText: text.trim()})}
                                placeholder="请输入隐患内容"
                                multiline={true}
                                value={this.state.troubleText}
                            />
                            <View style={{flexDirection: "row",marginTop: 5,flexWrap: "wrap"}}>
                                <CameraUpload
                                    value={this.state.picArr}
                                    onChange={(picArr)=>this.setState({picArr})}
                                    imgStyle={{width: width*0.26, height: width*0.26}}
                                />
                            </View>
                        </View>
                        <View style={{borderBottomColor: "#F0F1F6",borderBottomWidth: 1,}}>
                            <View style={{flexDirection: "row",alignItems: "center",marginTop: 20}}>
                                <Image source={require("../../image/troubleIssue/filePencil.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                    整改措施
                                </Text>
                            </View>
                            <TextInput
                                style={{height: 70,textAlignVertical: "top"}}
                                onChangeText={(text) => this.setState({reformContent: text.trim()})}
                                placeholder="请输入整改措施"
                                multiline={true}
                                value={this.state.reformContent}
                            />
                        </View>
                        <View style={[styles.item,styles.itemAn, {marginTop: 0,paddingBottom: 10,paddingTop: 10}]}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/TroubleCallBack/appsSelect.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>
                                <Text style={{color: 'red'}}>*</Text>前端显示</Text>
                            </View>
                            <Switch
                                style={{width: 30,marginRight: 5}}
                                //动态改变value
                                value={this.state.isFront}
                                //当切换开关室回调此方法
                                onValueChange={(value)=>{this.setState({isFront: value})}}
                                thumbColor = "#5970FE"
                            />
                        </View>
                        <View style={{borderBottomColor: "#F6F6F6",borderBottomWidth: 1,paddingBottom: 20}}>
                            <TouchableOpacity onPress={this.chooseReportDept} style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center",marginTop: 20}}>
                                <View style={{flexDirection: "row",alignItems: "center"}}>
                                    <Image source={require("../../image/troubleIssue/userGroup.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                    <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                        <Text style={{color: 'red'}}>*</Text>
                                        责任部门
                                    </Text>
                                </View>
                                <View style={{flexDirection: "row",alignItems: "center"}}>
                                    <Text style={{fontSize: 14, color: "#666"}}>{this.state.selectDep ? this.state.selectDep.fName : '请选择责任部门'}</Text>
                                    <AntDesign name={'right'} size={12} style={{ color: '#666',marginLeft: 13 }}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginTop: 10}}>
                            <SelectPeople title="抄送人" value={this.state.peopleArr} onChange={(arr)=>this.setState({peopleArr: arr})}/>
                        </View>
                    </View>
                    <View style={{width, alignItems: "center",justifyContent: "center",marginBottom: 20}}>
                        <TouchableOpacity onPress={this.commitIssue} style={{width: width-32,height:44,backgroundColor: "#4058FD",borderRadius: 5,marginTop: 17,alignItems: "center",justifyContent: "center"}}>
                            <Text style={{color: "#fff", fontSize: 16}}>发布</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    troubleLevel: state.troubleReducer.troubleLevel,
    troubleType: state.troubleReducer.troubleType
});

export default connect(mapStateToProps)(TroubleIssue);

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
});
