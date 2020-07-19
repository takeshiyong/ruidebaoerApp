import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Modal, TextInput} from 'react-native';
import DatePicker from 'react-native-datepicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Picker from 'react-native-wheel-picker';
import { connect } from 'react-redux';

import Header from '../../components/header';
import Toast from '../../components/toast';
import { parseTime } from '../../utils/handlePhoto';
import troubleService from '../../service/troubleService';

var PickerItem = Picker.Item;
const {width, height} = Dimensions.get('window');
class TroubleQuery extends Component {
    state = {
        showPicker: false,
        levelData: {
            index: 0,
            fId: '',
            fName: '全部'
        },
        typeData: {
            index: 0,
            fId: '',
            fName: '全部'
        },
        changeData: {},
        pickerList: [],
        pickerType: 0, // 0：是级别 1：是类型
        itemList: [],
        selectDep: null,
        selectPeople: null,
        startDate: null,
        stopDate: null,
        groupClassArr: [{
            fId: '',
            fName: '全部'
        }],
        groupClassIndex: ['全部'],
        groupClassObj: {
            index: 0,
            fId: '',
            fName: '全部'
        },
        showGroup: false,
        changeDataIndex: 0
    }
    //设置头部
    static navigationOptions = () => ({
        header: null
    });

    componentDidMount() { 
        // 获取页面初始数据
        this.initLoad();
    }

    initLoad = async () => {
        const res = await troubleService.selectGroupClass();
        console.log('加载数据', res);
        if (res.success) {
            if (res.obj) {
                let arr = [{fId: '', fName: '全部'}];
                for (let obj of res.obj) {
                    arr.push({fId: obj.fId, fName: obj.fName});
                }
                this.setState({
                    groupClassArr: arr,
                    groupClassIndex: arr.map((data)=>(data.fName))
                });
            }
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
                fName: !pickerType ? data.fName : levelData.fName,
                fId: !pickerType ? data.fId : levelData.fId,
            },
            typeData: {
                index: typeData.index,
                fName: pickerType ? data.fName : typeData.fName,
                fId: pickerType ? data.fId : typeData.fId,
            },
		})
    }

    onPickerSelects = () => {
        const { changeDataIndex, groupClassArr} = this.state;
        this.setState({
            groupClassObj: groupClassArr[changeDataIndex],
            showGroup: false
        })
    }

    // picker滚动的时候改值
    onPickerChange = (index) => {
        const { changeData, itemList } = this.state;
        this.setState({
            changeData: itemList[index]
        });
    }

    onPickerChanges = (index) => {
        const { changeData, itemList } = this.state;
        this.setState({
            changeDataIndex: index
        });
    }
    
    // 展开选择隐患类型
    showTroubleLevel = () => {
        const { levelData } = this.state;
        const selectList = this.props.troubleLevel.map((data, index)=>{
            return {
                index: index + 1,
                fId: data.fId,
                fName: data.fLevelName
            }
        });
        selectList.unshift({index: 0, fId: '', fName: '全部'});
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
                index: index + 1,
                fId: data.fId,
                fName: data.fTypeName
            }
        });
        selectList.unshift({index: 0, fId: '', fName: '全部'});
        this.setState({
            itemList: selectList,
            pickerList: selectList.map((data)=>(data.fName)),
            changeData: selectList[typeData.index],
            showPicker: true,
            pickerType: 1
        })
    }

    // 日历组件后缀icon
    iconComponent = (keyName) => {
        if (this.state[keyName]) {
            return (
                <TouchableOpacity onPress={()=>this.deletDate(keyName)}>
                    <AntDesign name="closecircleo" size={12} style={{ color: '#C1C1C1',marginLeft: 10 }} />
                </TouchableOpacity>
            )
        } else {
            return <AntDesign name="right" size={12} style={{ color: '#C1C1C1',marginLeft: 10 }}/>
        }
    }

    // 选择隐患上报人
    chooseReportPerson = () => {
        this.props.navigation.navigate('selectPeopleByDep',{surePeople: this.getReportPeople})
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

    // 获取选中上报人员数据
    getReportPeople = (data) => {
        console.log('people', data);
        this.setState({
            selectPeople: {fId: data.fId, fName: data.fUserName}
        });
    }

    // 清空时间
    deletDate = (keyName) => {
        this.setState({
            [keyName]: null
        });
    }

    // 根据条件查询隐患
    toSearch = () => {
        const { levelData, typeData, selectDep, selectPeople, startDate, stopDate, groupClassObj } = this.state;
        if (startDate && stopDate) {
            const startTime = new Date(startDate.replace(/-/g, '/')).getTime();
            const stopTime = new Date(stopDate.replace(/-/g, '/')).getTime();
            if (startTime > stopTime ) {
                Toast.show('结束时间不能晚于上报时间');
                return;
            }
        }
        let searchParam = {
            fDutyDepId: selectDep ? selectDep.fId : null,
            fLevelId: levelData.fId,
            fReportBeginTime: startDate ? parseTime(startDate) : startDate,
            fReportEndTime: stopDate ? parseTime(stopDate) : stopDate,
            fReportUserId: selectPeople? selectPeople.fId: null,
            fTypeId: typeData.fId,
            fSchedulingId: groupClassObj.fId
        };
        this.props.navigation.navigate('TroubleQueryResult',{searchParam})
    }

    render() {
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="隐患查询"
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
                <Modal
                    animationType={'fade'}
                    transparent
                    visible={this.state.showGroup}
                    onRequestClose={() => {}}
                >
                    <View style={styles.modalStyle}>
                        <View style={styles.selectModalTop}>
                            <View style={styles.selectModalBody}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            showGroup: false,
                                            changeData: {}
                                        })
                                    }}
                                >
                                    <Text style={{ fontSize: 14, color: '#508DCE' ,marginLeft: 8}}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.onPickerSelects}
                                >
                                    <Text style={{ fontSize: 14, color: '#508DCE' ,marginRight: 8 }}>确定</Text>
                                </TouchableOpacity>
                            </View>
                            <Picker
                                style={{ width: width, height: 180 }}
                                itemStyle={{ color: 'black', fontSize: 22 }}
                                selectedValue={this.state.selectedItem}
                                onValueChange={(index) => this.onPickerChanges(index)}>
                                    {this.state.groupClassIndex.map((value, i) => (
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
                                <Image source={require("../../image/troubleQuery/info.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14}}>隐患级别</Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                            <Text style={{fontSize: 14, color: "#999999"}}>{this.state.levelData.fName}</Text>
                                <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 13 }}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item,{height: 50}]} onPress={this.showTroubleType}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleQuery/appsBig.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14}}>隐患类型</Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text style={{fontSize: 14, color: "#999999"}}>{this.state.typeData.fName}</Text>
                                <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 13 }}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item,{height: 50}]}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleQuery/start.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14}}>开始时间</Text>
                            </View>
                            <View style={{alignItems: "center",marginTop: 3}}>
                                <DatePicker
                                    style={{width:160}}
                                    date={this.state.startDate}
                                    mode="date"
                                    placeholder="不限"
                                    format="YYYY-MM-DD"
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
                                    iconComponent={this.iconComponent('startDate')}
                                    onDateChange={(date) => {this.setState({startDate: date})}}
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item,{height: 50}]}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleQuery/stop.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14}}>结束时间</Text>
                            </View>
                            <View style={{alignItems: "center",marginTop: 3}}>
                                <DatePicker
                                        style={{width:160}}
                                        date={this.state.stopDate}
                                        mode="date"
                                        placeholder="不限"
                                        format="YYYY-MM-DD"
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
                                        iconComponent={this.iconComponent('stopDate')}
                                        onDateChange={(date) => {this.setState({stopDate: date})}}
                                    />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item,{height: 50}]} onPress={this.chooseReportPerson}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleQuery/user.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14}}>隐患上报人</Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text style={{fontSize: 14, color: "#999999"}}>{this.state.selectPeople ? this.state.selectPeople.fName : '不限'}</Text>
                                {
                                    this.state.selectPeople ? 
                                    <TouchableOpacity onPress={()=>this.setState({ selectPeople: null })}>
                                        <AntDesign name="closecircleo" size={12} style={{ color: '#C1C1C1',marginLeft: 10 }} />
                                    </TouchableOpacity>
                                    :
                                    <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 13 }}/>
                                }
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item,{height: 50}]} onPress={this.chooseReportDept}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleIssue/userGroup.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14}}>隐患单位</Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text style={{fontSize: 14, color: "#999999"}}>{this.state.selectDep ? this.state.selectDep.fName: '不限'}</Text>
                                {
                                    this.state.selectDep ? 
                                    <TouchableOpacity onPress={()=>this.setState({ selectDep: null })}>
                                        <AntDesign name="closecircleo" size={12} style={{ color: '#C1C1C1',marginLeft: 10 }} />
                                    </TouchableOpacity>
                                    :
                                    <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 13 }}/>
                                }
                                
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item,{height: 50}]} onPress={()=>this.setState({showGroup: true})}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleQuery/appsBig.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14}}>班组</Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text style={{fontSize: 14, color: "#999999"}}>{this.state.groupClassObj.fName}</Text>
                                <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 13 }}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={this.toSearch} style={{alignItems: "center", justifyContent: "center",width: width-32,backgroundColor: "#4058FD",borderRadius: 5,height: 44,marginTop: 16}}>
                        <Text style={{color: "#fff", fontSize: 16}}>查询</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    troubleLevel: state.troubleReducer.troubleLevel,
    troubleType: state.troubleReducer.troubleType
});

export default connect(mapStateToProps)(TroubleQuery);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    content: {
        marginTop: 16,
        backgroundColor: '#FFF',
        paddingLeft: 17,
        paddingRight: 17,
        width: width-32
    },
    item: {
        borderBottomColor: "#F6F6F6",
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between"
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
