import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Modal, ScrollView, Image, TextInput, Switch,} from 'react-native';
import DatePicker from 'react-native-datepicker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Picker from 'react-native-wheel-picker';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import moment from 'moment';

import Toast from '../../components/toast';
import Header from '../../components/header';
import troubleService from '../../service/troubleService';
import CameraUpload from '../../components/ImageAbout/CameraUpload';
import { handlePhotoToJs, parseDate } from '../../utils/handlePhoto';
import ConfirmModal from '../../components/confirmModal';
import SelectPeople from '../../components/selectPeople';

const {width, height} = Dimensions.get('window');
const PickerItem = Picker.Item;
class TroubleDetails extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
        date: null,
        value: false,
        detail: {},
        picArr: [],
        showPicker: false,
        levelData: {
            index: 0,
            fId: '',
            fName: ''
        },
        typeData: {
            index: 0,
            fId: '',
            fName: ''
        },
        changeData: {},
        pickerList: [],
        pickerType: 0, // 0：是级别 1：是类型
        itemList: [],
        selectDep: {
            fId: '',
            fName: ''
        },
        rectDate: null, // 责令整改期限
        idea: '', // 整改意见
        isFront: true, // 是否前端显示
        repeatTrouble: false, // 是否重复隐患
        showModal: false,
        integralRule: '', //积分规则
        peopleArr: []
    }

    componentDidMount() {
        if (this.props.navigation.state.params && this.props.navigation.state.params.item) {
            // this.chooseItem(this.props.navigation.state.params.depId);
            this.getTrounbleDetail(this.props.navigation.state.params.item);
        }
    }

    // 通过fid获取详情数据
    getTrounbleDetail = async (item) => {
        console.log('this.props.troubleTypeParam', this.props.troubleTypeParam)
        global.loading.show();
        const res = await troubleService.getTroubleDetailById(item.fId);
        console.log('res', res);
        global.loading.hide();
        if (res.success) {
            if (res.obj.fState == 7 || res.obj.fState == 5 || res.obj.fState == 8 || res.obj.fState == 10) {
                console.log(' 走了这里')
                this.setState({
                    detail: res.obj,
                    picArr: handlePhotoToJs(res.obj.reportImg),
                    typeData: {
                        fId: res.obj.fTypeId,
                        index: 0,
                        fName: this.props.troubleTypeParam[res.obj.fTypeId]
                    },
                    levelData: {
                        fId: res.obj.fLevelId,
                        index: 0,
                        fName: this.props.troubleLevelParam[res.obj.fLevelId]
                    },
                    selectDep: {
                        fId: res.obj.fDutyDepId,
                        fName: res.obj.fDutyDepName
                    },
                    idea: res.obj.fMeasures,
                    isFront: res.obj.fIsRelease == null || res.obj.fIsRelease ? true : false,
                    repeatTrouble: false,
                    rectDate: parseDate(res.obj.fPlanFinishTime, 'YYYY-MM-DD HH:mm'),
                    peopleArr: res.obj.fCopyUsers ? res.obj.fCopyUsers.map((data)=>({fId: data.fUserId, fUserName: data.fUserName})): []
                });
            } else {
                this.setState({
                    detail: res.obj,
                    picArr: handlePhotoToJs(res.obj.reportImg),
                    typeData: {
                        fId: res.obj.fTypeId,
                        index: 0,
                        fName: this.props.troubleTypeParam[res.obj.fTypeId]
                    }
                })
            }
        } else {
            Toast.show(res.msg);
        }
    }

    //picker确认改值
    onPickerSelect = () => {
        const { levelData, typeData, pickerType, itemList, changeData } = this.state;
        const data = changeData;
		this.setState({
            showPicker: false,
            levelData: {
                index: levelData.index,
                fName: pickerType ? data.fName : levelData.fName,
                fId: pickerType ? data.fId : levelData.fId,
            },
            typeData: {
                index: typeData.index,
                fName: !pickerType ? data.fName : typeData.fName,
                fId: !pickerType ? data.fId : typeData.fId,
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
            pickerType: 1
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
            pickerType: 0
        })
    }

    // 选择隐患上报单位
    chooseReportDept = () => {
        this.props.navigation.navigate('SelectDep',{sureDepId: this.getReportDept})
    }

    // 获取选中上报单位数据
    getReportDept = (dept) => {
        console.log('dept', dept);
        this.setState({
            selectDep: {fId: dept.fId, fName: dept.fName}
        });
    }

    // 提交研判
    commitJudged = () => {
        const { detail, repeatTrouble,  levelData, typeData, selectDep, rectDate, idea} = this.state;
        if (typeData.fId.length == 0) {
            Toast.show('请选择隐患类型');
            return;
        }
        if (levelData.fId.length == 0) {
            Toast.show('请选择隐患级别');
            return;
        }
        
        if (detail.fSite.trim().length == 0) {
            Toast.show('请输入隐患地点');
            return;
        }
        if (detail.fContent.trim().length == 0) {
            Toast.show('请输入隐患内容');
            return;
        }
        if (selectDep.fId.length == 0) {
            Toast.show('请选择隐患部门');
            return;
        }
        if (!rectDate) {
            Toast.show('请选择整改期限');
            return;
        }
        if (new Date(rectDate.replace(/-/g, '/')).getTime() < new Date().getTime()) {
            Toast.show('整改期限不能早于当前时间');
            return;
        }
        if (idea.trim().length == 0) {
            Toast.show('请输入整改措施');
            return;
        }
        if (repeatTrouble) {
            this.getintegralRule(levelData.fId);
            return;
        }
        this.ajaxJudged();
    }

    // 根据级别获取积分值
    getintegralRule = async (levelId) => {
        global.loading.show();
        const res = await troubleService.repeatTroubleRule({
            fLevelId: levelId,
            fType: 1
        });
        global.loading.hide();
        console.log('res', res);
        if (res.success) {
            this.setState({ 
                showModal: true,
                integralRule: res.obj.fIntegralNumber
            });
        } else {
            Toast.show(res.msg);
        }
    }

    // 获取重复研判积分
    rejectOk = (text) => {
        console.log('text', text);
        if (!text) {
            Toast.show('请输入奖励积分');
            return
        }
        if (isNaN(text*1)) {
            Toast.show('奖励积分只能输入数字');
            return;
        }
        console.log('this.state.integralRule', this.state.integralRule);
        if ((text*1 < 0 || text*1 > this.state.integralRule)) {
            Toast.show(`只能输入0-${this.state.integralRule}之间的值`);
            return;
        }
        this.setState({
            showModal: false
        }, ()=> this.ajaxJudged(text))
    }

    // 研判数据提交 text: 重复奖励积分值
    ajaxJudged = async (text) => {
        const { detail, repeatTrouble,  levelData, typeData, selectDep, rectDate, idea, isFront, peopleArr} = this.state;
        const { navigate, goBack, state, replace } = this.props.navigation;
        let arr = [];
        for (let obj of peopleArr) {
            arr.push({fUserId: obj.fId})
        }
        
        global.loading.show();
        const res = await troubleService.troubleHiddenTrouble({
            fId: detail.fId,
            fLevelId: levelData.fId,
            fTypeId: typeData.fId,
            fContent: detail.fContent.trim(),
            fDutyDepId: selectDep.fId,
            fPlanFinishTime: new Date(rectDate.replace(/-/g, '/')).getTime(),
            fMeasures: idea.trim(),
            fIsRepeat: repeatTrouble,
            fIsRelease: isFront,
            fIntegralNumber: text == null ? null : text*1,
            fSite: detail.fSite.trim(),
            fDisposeUsers: arr
        }); 
        global.loading.hide();
        console.log('res', res);
        if (res.success) {
            if (state.params.refresh) {
                state.params.refresh();
                goBack();
            } else {
                const popAction = StackActions.pop({
                    n: 1,
                });
                this.props.navigation.dispatch(popAction);
                setTimeout(()=>{
                    replace({routeName: 'ExamineMain',params: {examine: true}});
                }, 0);
            }
        } else {
            Toast.show(res.msg);
        }
    }

    render() {
        const { detail, showModal } = this.state;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="隐患研判"
                    hidePlus={false} 
                    props={this.props}
                />
                <ConfirmModal 
                    showModal={showModal}
                    onClose={()=>this.setState({showModal: !showModal})}
                    onCancel={()=>this.setState({showModal: false})}
                    onOk={this.rejectOk}
                    title="请输入该隐患上报者的奖励积分"
                    placeHolder={`0~${this.state.integralRule}`}
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
                                <TouchableOpacity onPress={this.onPickerSelect}>
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
                        <TouchableOpacity style={[styles.item,styles.itemAn]} onPress={this.showTroubleType}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleDetails/appsBig.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                    隐患类型
                                </Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text style={{color: "#999",fontSize: 14,marginLeft: 64}}>{this.state.typeData.fName}</Text>
                                <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 13 }}/>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.item}>
                            <View style={{flexDirection: "row",alignItems: "center",marginTop: 22,marginBottom: 5}}>
                                <Image source={require("../../image/troubleDetails/filePencil.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>隐患照片/视频</Text>
                            </View>
                            <View style={{flexDirection: "row",marginTop: 12,flexWrap: "wrap",justifyContent: "space-between"}}>
                                <CameraUpload
                                    value={this.state.picArr}
                                    disabled={true}
                                    onChange={(picArr)=>this.setState({picArr})}
                                    imgStyle={{width: width*0.26, height: width*0.26}}
                                />
                            </View>
                        </View>
                        <View style={[styles.item,{marginTop:10,paddingTop: 22}]}>
                            <View style={{flexDirection: "row",alignItems: "center",borderBottomColor: "rgba(51, 51, 51, 0.2)"}}>
                                <Image source={require("../../image/troubleDetails/local.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                    隐患地点</Text>
                            </View>
                            <TextInput
                                style={{height: 70,textAlignVertical: "top",fontSize: 14,marginTop: 5,marginBottom: 14,width: width-32,lineHeight: 20, color: '#999'}}
                                onChangeText={(text) => this.setState({detail: {...detail,fSite: text}})}
                                multiline={true}
                                value={detail.fSite}
                            />
                        </View>
                        <View style={[styles.item,{marginTop:10,paddingTop: 22}]}>
                            <View style={{flexDirection: "row",alignItems: "center",borderBottomColor: "rgba(51, 51, 51, 0.2)"}}>
                                <Image source={require("../../image/troubleDetails/filePencil.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                    隐患内容</Text>
                            </View>
                            <TextInput
                                style={{height: 70,textAlignVertical: "top",fontSize: 14,marginTop: 5,marginBottom: 14,width: width-32,lineHeight: 20, color: '#999'}}
                                onChangeText={(text) => this.setState({detail: {...detail,fContent: text}})}
                                multiline={true}
                                value={detail.fContent}
                            />
                        </View>
                            
                        <TouchableOpacity style={[styles.item,styles.itemAn]} onPress={this.showTroubleLevel}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleDetails/leavel.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>
                                <Text style={{color: 'red'}}>*</Text>隐患级别</Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text style={{color: "#999",fontSize: 14,marginLeft: 64}}>{this.state.levelData.fName ? this.state.levelData.fName : '请选择隐患级别'}</Text>
                                <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 13 }}/>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.item,styles.itemAn, {marginTop: 0}]} onPress={this.chooseReportDept}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleIssue/userGroup.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>
                                <Text style={{color: 'red'}}>*</Text>隐患部门</Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text style={{color: "#999",fontSize: 14,marginLeft: 64}}>
                                    {this.state.selectDep.fId ? this.state.selectDep.fName: '请选择隐患部门'}
                                </Text>
                                <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 13 }}/>
                            </View>
                        </TouchableOpacity>
                        
                        <View style={[styles.item,{marginTop:10,paddingTop: 22}]}>
                            <View style={{flexDirection: "row",alignItems: "center",borderBottomColor: "rgba(51, 51, 51, 0.2)"}}>
                                <Image source={require("../../image/troubleIssue/bubblesDots.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>
                                <Text style={{color: 'red'}}>*</Text>整改措施</Text>
                            </View>
                            <TextInput
                                style={{height: 80,textAlignVertical: "top",fontSize: 14,marginTop: 5,marginBottom: 14,width: width-32,lineHeight: 20, color: '#999'}}
                                onChangeText={(text) => this.setState({idea: text})}
                                placeholder="请输入整改措施"
                                multiline={true}
                                value={this.state.idea}
                            />
                        </View>
                        
                        <View style={[styles.item,styles.itemAn]}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleDetails/calendar.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>
                                <Text style={{color: 'red'}}>*</Text>整改期限</Text>
                            </View>
                            <View style={{alignItems: "center",marginTop: 2,marginRight: 5}}>
                                <DatePicker
                                    style={{width:180}}
                                    date={this.state.rectDate}
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
                                            marginLeft: 10,
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
                                    iconComponent={<AntDesign name="right" size={14} style={{ color: '#C1C1C1', marginLeft: 10}}/>}
                                    onDateChange={(date) => {this.setState({ rectDate: date})}}
                                />
                            </View>
                        </View>
                        {detail.fState == 7 || detail.fState == 8 || detail.fState == 10 ? null : 
                        <View style={[styles.item,styles.itemAn, {marginTop: 0}]}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleDetails/appsBig.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>
                                <Text style={{color: 'red'}}>*</Text>重复隐患</Text>
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <TouchableOpacity onPress={()=>this.setState({repeatTrouble: true})} style={{flexDirection: "row",marginRight: 20,alignContent:"center", alignItems: "center"}}>
                                    <Text>是</Text>
                                    <View style={styles.radio}>
                                        <View style={[this.state.repeatTrouble ? styles.smallRadio: {}]}></View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>this.setState({repeatTrouble: false})} style={{flexDirection: "row",alignContent:"center", alignItems: "center",marginRight: 16}}>
                                    <Text>否</Text>
                                    <View style={styles.radio}>
                                        <View style={[!this.state.repeatTrouble ? styles.smallRadio: {}]}></View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>}

                        {detail.fState == 7 || detail.fState == 8 || detail.fState == 10 ? null : 
                        <View style={[styles.item,styles.itemAn, {marginTop: 0}]}>
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
                        </View> }
                        <View style={{padding: 15,width: '100%',backgroundColor: '#fff'}}>
                            <SelectPeople title="抄送人" value={this.state.peopleArr} onChange={arr=>this.setState({peopleArr: arr})}/>
                        </View>
                        <TouchableOpacity onPress={this.commitJudged} style={[styles.item,{backgroundColor: "#F4F4F8",marginBottom: 10}]}>
                            <View style={styles.button}>
                                <Text style={{fontSize: 16, color: "#fff",fontWeight: "600"}}>提交</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    troubleLevelParam: state.troubleReducer.troubleLevelParam,
    troubleTypeParam: state.troubleReducer.troubleTypeParam,
    troubleLevel: state.troubleReducer.troubleLevel,
    troubleType: state.troubleReducer.troubleType,
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
    itemAn: {
        alignItems: "center", 
        flexDirection: "row",
        height: 57,
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
    checkItem: {
        backgroundColor: "#F4F4F8",
        height: 30
    },
    button: {
        backgroundColor: "#5970FE",
        height: 42,
        borderRadius: 4,
        alignItems: "center", 
        justifyContent: "center"
    },
    radio: {
        width: 16,
        height: 16,
        borderColor: "#5970FE",
        borderWidth: 1,
        borderRadius: 8,
        marginLeft: 4,
        alignItems: "center",
        justifyContent: "center"
    },
    smallRadio: {
        width: 12,
        height: 12,
        backgroundColor: "#5970FE",
        borderRadius: 6,
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
