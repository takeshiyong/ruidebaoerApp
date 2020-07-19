import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, PermissionsAndroid,Modal, PanResponder, TouchableOpacity, Image, TouchableHighlight, RefreshControl, Platform, ScrollView} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import SplashScreen from 'react-native-splash-screen';
import Picker from 'react-native-wheel-picker';
import { connect } from 'react-redux';

import {clientHeight, navHeight,isIphoneX} from '../../utils/screen';
import deviceServer from '../../service/deviceServer';
import Header from '../../components/header';
import Toast from '../../components/toast';
import TipModal from '../../components/tipModal';
const navStyle = navHeight();
const isAndroid = Platform.OS === 'android';
const {width, height} = Dimensions.get('window');
const PickerItem = Picker.Item;
class DeviceRecodsMap extends Component {
    state = {
        showPicker: false,
        panelShow: true,
        showType: 0,
        typeLever: true, //true地图, false路线页面,
        changeData: {},
        typeData: {
            index: 0,
            fId: '',
            fName: '请选择巡检路线'
        },
        pickerList: [],
        itemList: [],
        refreshing: false,
        taskDetail: {},
        taskStatus: {},
        tempTitShow: false,
        routeData: {
            fId: '',
            fName: ''
        },
        fromWork: false,
        single: false,
    };
    
    static navigationOptions = ({ navigation }) => ({
        header: null
    });

    componentDidMount() {
        SplashScreen.hide();
        if (this.props.navigation.state.params && this.props.navigation.state.params.fromWork != null) {
            this.setState({
                fromWork: this.props.navigation.state.params.fromWork,
                single: this.props.navigation.state.params.single,
            })
        }
        if (this.props.navigation.state.params && this.props.navigation.state.params.item) {
            this.selectRouteTask(this.props.navigation.state.params.item, this.props.navigation.state.params.fromWork);
            console.log('this.props.navigation.state.params.item', this.props.navigation.state.params.item);
            return;
        }
        this.selectRouteTask();
    }

    // 获取路线任务数据
    selectRouteTask = async (item, fromWork) => {
        global.loading.show();
        const res = await deviceServer.selectCheckUpList({
            fUserIdList: item && !fromWork ? [] : [this.props.fEmployeeId]
        });
        global.loading.hide();
        console.log('获取路线任务数据', res);
        if (res.success) {
            this.setState({
                pickerList: res.obj.map((data)=>(`${data.fPatrolTaskTitle}-${data.fPatrolRouteName}`)),
                itemList: res.obj
            });
            if (item) {
                for (let obj of res.obj) {
                    // 页面跳转选中的任务 默认查询
                    if (item.fPatrolTaskId == obj.fPatrolTaskId) {
                        this.setState({
                            typeData: {
                                fId: obj.fPatrolTaskId,
                                fName: `${obj.fPatrolTaskTitle}-${obj.fPatrolRouteName}`
                            }
                        },() => this.onRefresh());
                        return;
                    }
                }
            }
        } else {
            Toast.show(res.msg);
        }
    }

    // 通过巡检id查详情
    selectTaskList = async () => {
        const { typeData, typeLever } = this.state; 
        this.setState({ refreshing: true });
        typeLever && global.loading.show();
        const res = await deviceServer.selectCheckUpDetailById(typeData.fId);
        typeLever && global.loading.hide();
        this.setState({ refreshing: false });
        console.log('通过巡检id查详情', res);
        if (res.success) {
            this.setState({
                taskDetail: res.obj
            });
        } else {    
            Toast.show(res.msg);
        }
    }

    // 获取任务当前状态
    getTaskStatus = async () => {
        const { typeData, typeLever } = this.state; 
        const res = await deviceServer.selectCheckUpTaskStatus(typeData.fId);
        console.log('获取任务当前状态', res);
        if (res.success) {
            this.setState({
                taskStatus: res.obj
            })
        }
    }

    onRefresh = () => {
        const { typeData } = this.state;
        if (!typeData.fId) return 
        this.selectTaskList();
        this.getTaskStatus();
        if (this.props.navigation.state.params && this.props.navigation.state.params.onRefresh) {
            this.props.navigation.state.params.onRefresh();
        }
    }

    //picker确认改值
    onPickerSelect = () => {
        const {typeData, changeData} = this.state;
        this.setState({
            showPicker: false,
            typeData: {
                fName: `${changeData.fPatrolTaskTitle}-${changeData.fPatrolRouteName}`,
                fId: changeData.fPatrolTaskId
            },
            routeData: {
                fId: changeData.fPatrolRouteId,
                fName: changeData.fPatrolRouteName
            }
        }, () => {
            this.selectTaskList();
            this.getTaskStatus();
        });
    }

    // 开启新一轮
    openNewTask = async () => {
        const { typeData, typeLever, taskDetail, taskStatus } = this.state;
        if (taskDetail.fPatrolTaskRecordNum == taskDetail.fPatrolRecordNum) {
            this.onRefresh();
            return;
        }
        if (!taskStatus.nowRecordNum) {
            this.openNewTaskAjax();
            return;
        }  
        global.loading.show();
        const ress = await deviceServer.getTaskTempList(taskDetail.fPatrolTaskId);
        console.log('res',ress);
        if (ress.success) {
            if (ress.obj.length > 0) {
                global.loading.hide();
                this.setState({tempTitShow: true});
                return;
            } else {
                this.openNewTaskAjax();
            }
        } else {
            global.loading.hide();
            Toast.show(ress.msg);
        }
    }
    
    // 开启新一轮接口调用
    openNewTaskAjax = async () => {
        const { typeData, typeLever, taskDetail } = this.state; 
        const res = await deviceServer.openNewTask(typeData.fId);
        global.loading.hide();
        if (res.success) {
            Toast.show(res.msg);
            this.onRefresh();
        } else {
            Toast.show(res.msg);
        }
    }


    // picker滚动的时候改值
    onPickerChange = (index) => {
        const { itemList } = this.state;
        this.setState({
            changeData: itemList[index]
        });
    }

    // 跳转入扫码巡检页面
    startCheck = (item) => {
        const { taskStatus, taskDetail } = this.state;
        if (!taskStatus.nowRecordNum) {
            Toast.show('请开启巡检');
            return;
        }
        this.props.navigation.push('DeviceDetail', {type: 1, item: {
            ...item,
            fPatrolTaskId: taskDetail.fPatrolTaskId,
        }, onRefresh: this.onRefresh});
    }

    // 获取当前任务暂存数据
    getCurrentPosition = async () => {
        const { taskDetail, routeData } = this.state;
        global.loading.show();
        const res = await deviceServer.getTaskTempList(taskDetail.fPatrolTaskId);
        global.loading.hide();
        console.log('获取当前任务暂存数据', res);
        if (res.success) {
            if (res.obj && res.obj.length > 0) {
                this.props.navigation.push('TempSaveList', {taskDetail, routeData});
            } else {
                Toast.show('该任务暂无暂存数据');
            }
        } else {
            Toast.show(res.msg);
        }

    }
    
    render() {
        const {  typeData, taskStatus, tempTitShow, taskDetail, routeData } = this.state;
        return (
            <View style={styles.container}>
                <TipModal 
                    showModal={this.state.tempTitShow}
                    tipText="请先提交暂存信息"
                    onCancel={()=>this.setState({tempTitShow: false})}
                    onOk={()=>{
                        this.setState({tempTitShow: false});
                        this.props.navigation.push('TempSaveList', {taskDetail, routeData});
                    }}
                />
                <Header
                    backBtn={true}
                    titleText="设备巡检"
                    hidePlus={true}
                    rightBtn={
                        typeData.fId ? 
                        <TouchableOpacity style={{marginRight: 10}} onPress={()=>this.getCurrentPosition()}>
                            <Text style={{ color: '#fff', fontSize: 16 }}>暂存</Text>
                        </TouchableOpacity> : null
                    }
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
                                    <PickerItem label={value} value={i} key={i}/>
                                ))}
                            </Picker>
                        </View>
                    </View>
                </Modal>
                    <View style={styles.inforTopPanel}>
                        <View style={styles.TopLeftBtn}>
                            <View style={styles.topLeftLeftBtn}>
                                <Image source={require('../../image/equiement/line.png')} style={{width: 16,height: 16,marginRight:11}}/>
                                <Text style={{marginRight: 11,color: "#666666",fontSize: 14}}>路线</Text>
                            </View>
                            {
                                this.state.pickerList.length == 0 ? 
                                <View style={{flexDirection: "row",alignItems:"flex-end"}}>
                                    <Text style={{color: "#4B74FF",fontSize: 14,marginLeft: 13, maxWidth: width/2 }} numberOfLines={1}>
                                        暂无执行中的巡检任务
                                    </Text>
                                </View>
                                 :
                                this.state.fromWork && this.state.single ? 
                                <View style={{flexDirection: "row",alignItems:"flex-end"}}>
                                    <Text style={{color: "#4B74FF",fontSize: 14,marginLeft: 13, maxWidth: width/1.7 }} numberOfLines={1}>{this.state.typeData.fName}</Text>
                                </View>
                                :
                                <TouchableOpacity style={{flexDirection: "row",alignItems:"flex-end"}} onPress={() => this.setState({showPicker: true})}>
                                    <Text style={{color: "#4B74FF",fontSize: 14,marginLeft: 13, maxWidth: width/2 }} numberOfLines={1}>{this.state.typeData.fName}</Text>
                                    <Entypo name="controller-volume" color="#4B74FF" style={{marginLeft: 5}}/>
                                </TouchableOpacity>
                            }
                        </View>
                        
                    </View>
                    <View style={{height: 70}}/>
                    
                    
                        <View style={{position: 'relative',width: width, flex: 1}}>
                            <ScrollView 
                                style={[{flex: 1}]}
                                refreshControl={
                                    <RefreshControl
                                        title={'Loading'}
                                        colors={['#000']}
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                    />
                                } 
                            >
                                <View style={{paddingRight: 15,paddingLeft: 15}}>
                                {
                                    this.state.taskDetail.patrolTaskEquipmentList && this.state.taskDetail.patrolTaskEquipmentList.length > 0 ? 
                                    this.state.taskDetail.patrolTaskEquipmentList.map((item, index)=>{
                                        return (
                                            <View key={index} style={styles.item}>
                                                <View style={{flexDirection: "row",alignItems: "center",marginBottom: 8}}>
                                                    {
                                                        !item.nowEquipmentRecordState ?
                                                        <Image source={require('../../image/equiement/anotherRound.png')} style={{width: 28,height: 28,marginRight: 12}}/>
                                                        : 
                                                        <Image source={require('../../image/equiement/round.png')} style={{width: 28,height: 28,marginRight: 12}}/>
                                                    }
                                                    <Text style={{color: '#333333',fontSize: 14,fontWeight: "500"}}>{item.fEquipmentName}</Text>
                                                </View>
                                                <View style={{flexDirection: "row",height: 86,}}>
                                                    {
                                                        this.state.taskDetail.patrolTaskEquipmentList.length == index + 1 ? 
                                                        <View style={{width: 1,height: "100%",backgroundColor: "#fff",marginLeft: 14,marginRight: 25}} /> :
                                                        <View style={{width: 1,height: "100%",backgroundColor: "#E0E0E0",marginLeft: 14,marginRight: 25}} />
                                                    }
                                                    <View style={{flex: 1,backgroundColor:"#F6F6F6",flexDirection: "row"}}>
                                                        <View style={{flex:1,justifyContent: "center"}}>
                                                            <View style={styles.leftItem}>
                                                                <View style={{flexDirection: "row"}}>
                                                                    <Text style={styles.leftText}>
                                                                        {
                                                                            !item.nowEquipmentRecordState ?
                                                                            (this.state.taskStatus.nowRecordNum - 1) < 0 ? 0 : this.state.taskStatus.nowRecordNum - 1 :
                                                                            this.state.taskStatus.nowRecordNum
                                                                        }
                                                                    </Text>
                                                                    <Text style={styles.rightText}>/{this.state.taskDetail.fPatrolTaskRecordNum}</Text>
                                                                </View>
                                                                <Text style={styles.bottomText}>巡检次数</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{flex:1,justifyContent: "center",alignItems: "center"}}>
                                                            <Text style={styles.rightText}>
                                                                {item.tEquipmentPatrolItemsList.length}
                                                            </Text>
                                                            <Text style={styles.bottomText}>巡检项</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    })
                                    :
                                    <View style={{width: '100%', alignItems: 'center'}}>
                                        <Text>暂无数据</Text>
                                    </View>
                                }
                                </View>
                            </ScrollView>
                            {
                                typeData.fId && this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.fromWork? 
                                <View style={styles.botton}>
                                    <TouchableOpacity style={styles.bottomLeft} onPress={()=>this.props.navigation.push('DeviceRecord', {type: 4})}>
                                        <Text style={{color: "#333", fontSize: 14}}>巡检记录</Text>
                                    </TouchableOpacity>
                                    {
                                        this.state.taskDetail.fPatrolTaskState != 1 ? taskStatus.openNewRecord ? 
                                        <TouchableOpacity style={styles.bottomRight} onPress={this.openNewTask}>
                                            <Text style={{color: "#fff", fontSize: 14}}>{ !taskStatus.nowRecordNum ? '开启巡检' : taskDetail.fPatrolTaskRecordNum == taskDetail.fPatrolRecordNum ? '提交巡检记录' : '开启下一轮' }</Text>
                                        </TouchableOpacity> : 
                                        <TouchableOpacity style={styles.bottomRight} onPress={()=>{this.props.navigation.push('ScanQRcode', {fromDevice: true, taskId: taskDetail.fPatrolTaskId, onRefresh: this.onRefresh})}}>
                                            <Image  source={require('../../image/equiement/scran.png')} style={{width: 16,height: 16,marginRight: 8}}/>
                                            <Text style={{color: "#fff", fontSize: 14}}>扫码巡检</Text>
                                        </TouchableOpacity> : 
                                        <View style={styles.bottomRight}>
                                            <Text style={{color: "#fff", fontSize: 14}}>{'已完成'}</Text>
                                        </View> 
                                    }
                                </View> : null
                            }
                        </View>
                </View>
        );
    }
}

const mapStateToProps = state => ({
    fEmployeeId: state.userReducer.userInfo.fEmployeeId
});

export default connect(mapStateToProps)(DeviceRecodsMap);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    map: {
        height: height- navHeight().height - 20,
        width
    },
    positionView: {
        position: 'absolute',
        right: 20,
        top: 20,
        zIndex: 99,
    },
    panelView: {
        height: 200,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderColor: '#C1C6D6',
        borderWidth: 1
    },
    micView: {
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderColor: '#C1C6D6',
        borderWidth: 1,
        paddingLeft: 11,
        paddingRight: 11,
        paddingTop: 11,
        paddingBottom: 11,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    panelItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        marginLeft: 8,
        paddingLeft: 3,
        paddingRight: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    inforPanel: {
        position: 'absolute',
        left: 20,
        bottom: 0,
        zIndex: 99,
        width: width - 40,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        borderWidth: 1,
        borderColor: '#C1C6D6',
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingRight: 15,
        paddingLeft: 15
    },
    backBtn: {
        width: width - 70,
        height: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tipBtn: {
        width: 40,
        borderRadius: 3,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderColor: '#E0E0E0'
    },
    panelTitle: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        alignItems: 'center',
        paddingLeft: 5
    },
    bottomBtn: {
        width: width - 70,
        height: 40,
        backgroundColor: '#4B74FF',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        flexDirection: 'row'
    },
    panelItems: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',

    },
    TopLeftBtn: {
        width: '100%',
        height: 44,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.9)',
        flexDirection: "row",
        alignItems: "center",
        shadowOffset: { width: 2, height: 2 }, 
        shadowOpacity: 0.5, 
        shadowRadius: 3, 
        elevation: 1 
    },
    topLeftLeftBtn: {
        borderRightWidth: 1,
        borderRightColor: "#E0E0E0",
        height: 20,
        alignItems: "center",
        flexDirection: "row",
        paddingLeft: 12
    },
    TopRightBtn: {
        height: 44,
        borderRadius: 4,
        width: 44,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: "center",
        justifyContent: "center",
        // shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 }, 
        shadowOpacity: 0.5, 
        shadowRadius: 3, 
        elevation: 1 
    },
    inforTopPanel: {
        position: 'absolute',
        left: 20,
        top: isAndroid ? navStyle.height+15 : (isIphoneX() ? navStyle.height+65 : navStyle.height+35),
        zIndex: 99,
        width: width - 40,
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    ToPoint: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(255,255,255,0.9)',
        zIndex: 99,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        position: 'absolute',
        right: 20,
        bottom: isAndroid ? 108 : (isIphoneX() ? 183 : 138),
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
        backgroundColor: "#fff",
        width,
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
        borderRadius: 5,
        flexDirection: "row"
    },
    
    item: {
        marginBottom: 8
    },
    leftItem: {
        height: 44,
        justifyContent: "center",
        alignItems: "center",
        borderRightColor: "#E0E0E0",
        borderRightWidth: 1
    },
    rightText: {
        fontSize: 16,
        color: '#666666',
        fontWeight: "500"
    },
    leftText: {
        fontSize: 16,
        color: '#FF632E',
        fontWeight: "500"
    },
    bottomText: {
        color: "#999",
        fontSize: 12,
        marginTop: 10
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
