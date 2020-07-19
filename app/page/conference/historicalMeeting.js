import React, { Component } from 'react';
import { StyleSheet, BackHandler, Text, View,Modal, TouchableOpacity, Dimensions, TouchableHighlight,Linking, Platform, StatusBar, ImageBackground, Image, ScrollView,RefreshControl, FlatList, ActivityIndicator } from 'react-native';
import DatePicker from 'react-native-datepicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import splash from 'react-native-splash-screen';
import { connect } from 'react-redux';
import Picker from 'react-native-wheel-picker';
import moment from 'moment';
import {parseDate,parseTime} from '../../utils/handlePhoto';

import meetingService from '../../service/meetingServer';
import Header from '../../components/header';
import Toast from '../../components/toast';

const {width, height} = Dimensions.get('window');
const PickerItem = Picker.Item;
const PAGESIZE = 10;
class App extends Component {
    state = {
        showPicker: false,
        typeData: {
            index: 0,
            fId: '',
            fName: '不限'
        },
        changeData: {},
        itemList:[],
        pickerList: [],
        currentData: 1,
        selectDep: {fId: '', fName: '不限'},
        current: 0,
        currentPage: 1,
        // 列表数据结构
        dataSource: [],
        // 下拉刷新
        refreshing: false,
        // 加载更多
        isLoadMore: false,
        canLoadMore: true,
        pageSize: PAGESIZE,
        startTime: null, 
        endTime: null, 
        employeeId: null,
        meetingRangeId: null,
        meetingTypeId: null,
        roleType: {
            index: 0,
            fId: 0,
            fName: '全部'
        }, 
        roleUser: [{fId: 0,fName: '全部'},{fId: 1,fName: '会议发起人'},{fId:2,fName:'会议记录人'},{fId:3,fName:'会议参与人'}],
        selectType: 1, // 1.选择会议类型  2.选择会议角色
    }
    //设置头部
    static navigationOptions = () => ({
        header: null
    });

    componentDidMount() {
        if(this.props.navigation.state.params.type){
            this.setState({
                roleType: {fId: 0,fName: '全部'}
            },() => {
                this.historyPage()
            })  
        } else {
            this.setState({
                roleType: {fId: 4,fName: '抄送我的'}
            },() =>{
                this.historyPage()
            })
        }
    }
    
    // picker确认改值
    onPickerSelect = () => {
        const {typeData, changeData, selectType } = this.state;
        this.setState({
            showPicker: false,
            typeData: selectType == 1 ? {
                index: changeData.index,
                fName:  changeData.fName,
                fId: changeData.fId,
            }: {...this.state.typeData} ,
            roleType: selectType == 2 ? {
                index: changeData.index,
                fName:  changeData.fName,
                fId: changeData.fId,
            }: {...this.state.roleType}
        },() => {this._onRefresh()})
    }

    // picker滚动的时候改值
    onPickerChange = (index) => {
        const { changeData, itemList, selectType, roleUser } = this.state;
        this.setState({
            changeData: selectType == 1 ? itemList[index] : roleUser[index]
        });
    }
    
    
    // 选择会议范围单位
    chooseReportDept = () => {
        this.props.navigation.navigate('SelectDep',{sureDepId: this.getReportDept})
    }

    // 获取选中上报单位数据
    getReportDept = (dept) => {
        console.log('sssssss',dept)
        this.setState({
            selectDep: {fId: dept.fId, fName: dept.fName}
            
        },() => {
            this._onRefresh()
        });
    }
    
    /**
     * 下啦刷新
     * 
     */
    
    _onRefresh = () => {
        // 不处于 下拉刷新
        this.setState({
            pageSize: PAGESIZE
        }, ()=> {
            this.historyPage()
        })
            
    };

    
      /**
     * 加载更多
     * @private
     */
    _onLoadMore() {
        // 不处于正在加载更多 && 有下拉刷新过，因为没数据的时候 会触发加载
        if (!this.state.isLoadMore && this.state.dataSource.length > 0 && this.state.canLoadMore) {
            this.setState({
                pageSize: this.state.pageSize + 10
            }, () => {
                this.historyPage()
            })
        }
    } 
      /**
       * 创建尾部布局
       */
    _createListFooter = () => {
        const { isLoadMore, dataSource, canLoadMore } = this.state;
        if (dataSource.length == 0) {
            return null;
        }
        let moreText = '上拉加载更多数据';
        if (isLoadMore) {
            moreText = '正在加载更多数据'
        } else {
            if (!canLoadMore) {
                moreText = '暂无更多数据' 
            }
        }
        return (
            <View style={styles.footerView}>
                {isLoadMore ? <ActivityIndicator color="#000"/> : null}
                <Text style={{ color: '#999' }}>
                    {moreText}
                </Text>
            </View>
        )
    }

    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#fff' }} />;
    }
    // 跳转详情并且未读变已读
    jumpDetail = async (item) => {
        const { meetingHomepage } = this.props.navigation.state.params
        console.log(meetingHomepage)
        if (!this.props.navigation.state.params.type && !item.fIsRead) {
            meetingService.changeReaded(item.fId)
            .then((res) => {
                if (res.success) {
                    if (this.props.navigation.state.params && this.props.navigation.state.params.sendToMeUnread) {
                        this.props.navigation.state.params.sendToMeUnread();
                    }
                    for (let obj of this.state.dataSource) {
                        if (obj.fId == item.fId) {
                            obj.fIsRead = true;
                            break;
                        }
                    }
                    this.setState({
                        dataSource: this.state.dataSource
                    })
                } else {
                    Toast.show(res.msg);
                }
            });
        }
        this.props.navigation.navigate('MeetingDetails',{id: item.fId,meetingHomepage: meetingHomepage,historyPage: this.historyPage})
    }

    renderItem = ({item,index}) => {
        return(
            <TouchableOpacity style={[styles.content,{marginTop: 10,paddingTop: 15,paddingBottom: 15}]} onPress={ () => this.jumpDetail(item) }>
                <View style={{flexDirection: "row"}}>
                    <Text style={{fontSize: 14,color: "#333",fontWeight: "600",marginRight: 30}}>{item.fName}</Text>
                    <View style={{alignItems: "center",justifyContent: "center",width: 60,height: 20,backgroundColor: "#50A93F",borderRadius: 5}}>
                        <Text style={{color: "#fff"}}>{item.typeName}</Text>
                    </View>
                    {
                        !item.fIsRead && !this.props.navigation.state.params.type ? 
                        <View style={{alignItems: "center",justifyContent: "center",width: 30,height: 20,backgroundColor: "#FC676E",borderRadius: 5,marginLeft: 10}}>
                            <Text style={{color: "#fff"}}>新</Text>
                        </View>:null
                    }
                </View>
                <View>
                    <Text numberOfLines={3} ellipsizeMode="tail" style={{paddingBottom: 10,marginTop: 10}}>{item.fContent}</Text>
                    <View style={{flexDirection: "row"}}>
                        <Text style={{borderRightWidth: 1,borderRightColor: "#E0E0E0",paddingRight: 5,marginRight: 5}}>日期: {item.fBeginTime}</Text>
                        <Text>{item.deptName}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
    // 分页查询会议
    historyPage = async () => { 
        const { roleType, startTime, endTime, pageSize,typeData, selectDep,currentPage,employeeId,meetingRangeId,meetingTypeId} = this.state
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: true,canLoadMore: true});
        } else {
            this.setState({ isLoadMore: true });
        }
        const res = await meetingService.historyPage({
            "currentPage": currentPage,
            "employeeId": employeeId,
            "endTime": endTime ? endTime: null,
            "meetingRangeId": selectDep.fId, //会议范围ID
            "meetingTypeId": typeData.fId, //会议类型ID
            "pageSize": pageSize,
            "roleType": this.props.navigation.state.params.type ? roleType.fId: 4,
            "startTime": startTime ? startTime: null
        });
        console.log('res', res);
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: false });
        } else {
            this.setState({ isLoadMore: false });
        }
        if (res.success) {
            this.setState({
                dataSource: res.obj.items ? res.obj.items : []
            })
            if (this.state.pageSize >= res.obj.itemTotal) {
                this.setState({
                    canLoadMore: false
                })
            }
        } else {
            Toast.show(res.msg);
        }
    }

    // 展开选择会议角色
    showPeople = () => {
        //获取人员数据
        const { typeData, roleUser } = this.state;
        const { meetingType } = this.props;
        this.setState({
            selectType: 2,
            itemList: roleUser,
            pickerList: roleUser.map((data)=>(data.fName)),
            showPicker: true,
        });
    }

    // 展开选择会议类型
    showMeetingType = () => {
        const { typeData } = this.state;
        const { meetingType } = this.props;
        const selectList = meetingType.map((data, index)=>{
            return {
                index: index,
                fId: data.fId,
                fName: data.fTypeName
            }
        });
        selectList.unshift({fId: '', fName: '不限'})
        this.setState({
            selectType: 1,
            itemList: selectList,
            pickerList: selectList.map((data)=>(data.fName)),
            showPicker: true,
        });
    }

    // 清空时间
    deletDate = (keyName) => {
        this.setState({
            [keyName]: null
        }, ()=>{
            this._onRefresh();
        });
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
    
    render() {
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText={this.props.navigation.state.params.type?"历史会议":"抄送我的"}
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
                        <TouchableOpacity style={[styles.item,{height: 47}]}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleIssue/calendar.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    开始时间
                                </Text>
                            </View>
                            <View style={{alignItems: "flex-end",flex: 1,justifyContent: 'center'}}>
                                <DatePicker
                                        style={{width: '100%'}}
                                        date={this.state.startTime}
                                        mode="datetime"
                                        placeholder="不限"
                                        format="YYYY-MM-DD HH:mm"
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
                                        iconComponent={this.iconComponent('startTime')}
                                        onDateChange={(date) => {this.setState({startTime: date},() => {this._onRefresh()})}}
                                    />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item,{height: 47}]}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleIssue/calendar.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    截止时间
                                </Text>
                            </View>
                            <View style={{alignItems: "flex-end",flex: 1,justifyContent: 'center'}}>
                                <DatePicker
                                        style={{width: '100%'}}
                                        date={this.state.endTime}
                                        mode="datetime"
                                        placeholder="不限"
                                        format="YYYY-MM-DD HH:mm"
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
                                        iconComponent={this.iconComponent('endTime')}
                                        onDateChange={(date) => {this.setState({endTime: date},() => {this._onRefresh()})}}
                                    />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item,{height: 50}]} onPress={this.showMeetingType}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleQuery/appsBig.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    会议类型
                                </Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text style={{fontSize: 14, color: "#999999"}}>{this.state.typeData.fName}</Text>
                                <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 13 }}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item,{height: 50}]} onPress={this.chooseReportDept}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleQuery/appsBig.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    会议范围
                                </Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text style={{fontSize: 14, color: "#999999"}}>{this.state.selectDep.fName}</Text>
                                {
                                    this.state.selectDep.fId ? 
                                    <TouchableOpacity onPress={()=>this.setState({ selectDep: {fId: '', fName: '不限'} }, ()=>this._onRefresh())}>
                                        <AntDesign name="closecircleo" size={12} style={{ color: '#C1C1C1',marginLeft: 10 }} />
                                    </TouchableOpacity>
                                    :
                                    <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 13 }}/>
                                }
                            </View>
                        </TouchableOpacity>
                        {this.props.navigation.state.params.type == 1 ? 
                            <TouchableOpacity style={[styles.item,{height: 50}]} onPress={() =>this.showPeople()}>
                                <View style={{flexDirection: "row",alignItems: "center"}}>
                                    <Image source={require("../../image/troubleQuery/appsBig.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                    <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                        会议角色
                                    </Text>
                                </View>
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <Text style={{fontSize: 14, color: "#999999"}}>{this.state.roleType.fName}</Text>
                                    <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 13 }}/>
                                </View>
                            </TouchableOpacity> : null
                        }
                    </View>
                    <FlatList
                        style={{flex: 1}}
                        data={this.state.dataSource}
                        // keyExtractor={(item)=>item.fId}
                        refreshControl={
                            <RefreshControl
                                title={'Loading'}
                                colors={['#000']}
                                refreshing={this.state.refreshing}
                                onRefresh={() => {
                                    this._onRefresh();
                                }}
                            />
                        }
                        renderItem={this.renderItem}
                        refreshing={this.state.refreshing}
                        //加载更多
                        ListFooterComponent={this._createListFooter.bind(this)}
                        ListEmptyComponent={<Text style={{width, textAlign: 'center',marginTop: 10,color: '#c9c9c9', paddingBottom: 50}}>暂无数据</Text>}
                        onEndReached={() => this._onLoadMore()}
                        onEndReachedThreshold={0.1}
                        ItemSeparatorComponent={()=>this._separator()}
                    /> 
                    
                </ScrollView>
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
};

export default connect(mapStateToProps)(App);

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
    footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 20,
    },
});
