import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions,BackHandler, ScrollView, TouchableOpacity, FlatList,Image, RefreshControl, ActivityIndicator } from 'react-native';
import {Calendar} from 'react-native-calendars';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ActionButton from 'react-native-action-button';
import moment from 'moment';
import {connect} from 'react-redux';

import Header from '../../components/header';
import Toast from '../../components/toast';
import workServer from '../../service/workServer';
import troubleService from '../../service/troubleService';
import deviceServer from '../../service/deviceServer';
import { handlePhotoToJs, parseDate,parseTime } from '../../utils/handlePhoto';

const {width, height} = Dimensions.get('window');
class Task extends Component {
    static navigationOptions = () => ({
        header: ()=> {
            return  null;
        }
    });

    state = {
        actions: [
            {text: '任务', icon: this.iconElem},
            {text: '便签', icon: this.iconElem},
            {text: '学习', icon: this.iconElem},
        ],
        chooseDate: moment().format('YYYY-MM-DD'),
        markDates: {
            [`${moment().format('YYYY-MM-DD')}`]: {dots: [{color: 'black'}]},
        },
        pageSize: 10,
        pageCurrent: 1,
        dataSource: [],
        canLoadMore: true,
        loadingMore: false,
        refreshing: false,
        dots: {color: 'black'},
        chooseMouth: ''
        
    };
    componentDidMount(){
        this.getInitData(moment().format('YYYY-MM-DD'))
        this.getDataByDate();
        this.onRefresh()
        // this.viewDidAppear = this.props.navigation.addListener(
        //     'didFocus',
        //     (obj)=>{
        //         BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        //     }
        // )
        // this.didBlurSubscription = this.props.navigation.addListener(
        //     'willBlur',
        //     (obj)=>{
        //         BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        //     }
        // )
    }

    onBackAndroid = () => {  
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            return false;
        }
        this.lastBackPressed = Date.now();
        Toast.show('再按一次退出应用');
        return true;
    }
    
    componentWillUnmount() {
        if (this.viewDidAppear) {
            this.viewDidAppear.remove();
        }
        if (this.didBlurSubscription) {
            this.didBlurSubscription.remove();
        }
    }

    iconElem = () => {
        return (
            <View>123</View>
        )
    }
    //初始获取页面
    getInitData = async (date) => {
        let currentMonth = moment(new Date(date.replace(/-/g, '/'))).format('YYYY-MM');
        this.setState({chooseMouth: date});
        const res = await workServer.queryHasTask(currentMonth,this.props.fEmployeeId);
        if(res.success) {
            let  markDates = {...this.state.markDates};
            for(key in res.obj){
               markDates[key]= {...markDates[key],selected: true, selectedColor: res.obj[key] == 1? "#F24343" : (res.obj[key] == 2 ? '#00ADF5': "#FFCE5C")}
            }
            console.log(markDates);
            this.setState({
                markDates: markDates
            })
        }
        
    }
    //点击更换月份更改请求
    handleChangeMonth = (value) => {
        this.getInitData(value.dateString);
        console.log(value)
    }
    // 点击日历获取时间 
    topCalendar = (day) => {
        const { chooseDate, markDates, dots} = this.state;
        markDates[chooseDate] = {...markDates[chooseDate], dots: []};
        this.setState({
            chooseDate: day.dateString,
            pageCurrent: 1,
            markDates: {
                ...markDates,
                [`${day.dateString}`]: markDates[`${day.dateString}`] ? {...markDates[`${day.dateString}`], dots: [dots]} : {dots: [dots]}
            },
        }, ()=>this.getDataByDate());
    }
    
    // 根据日期获取数据
    getDataByDate = async () => {
        const { chooseDate, pageCurrent, pageSize, dataSource } = this.state;
        if (pageCurrent == 1) {
            this.setState({refreshing: true});
        }
        const res = await workServer.getTaskByDate({
            fExecuter: this.props.fEmployeeId || '41eebce8bb3b4625988a65687c21f3ea',
            fState: 0,
            fType: 0,
            pageSize: pageSize,
            searchTime: parseTime(chooseDate),
            currentPage: pageCurrent 
        });
        console.log('通过日期获取当天任务', res);
        this.setState({refreshing: false, loadingMore: false})
        if (res.success) {
            let dataArr = [];
            if (pageCurrent == 1) {
                // 如果当前页是第一页则直接拿传过来的数据
                dataArr = res.obj.items;
            } else {
                // 如果当前页不是第一页则需要拼接
                dataArr = dataSource.concat(res.obj.items);
            }
            // 判断是否可以加载更多
            let canLoadMore = true;
            if (dataArr.length >= res.obj.itemTotal) {
                canLoadMore = false;
            }
            this.setState({
                dataSource: dataArr,
                canLoadMore: canLoadMore 
            });
        } else {
            Toast.show(res.msg);
        }
    }

    // 加载更多
    loadMore = () => {
        const { refreshing, loadingMore, canLoadMore, pageCurrent} = this.state;
        // 当正在刷新 正在加载更多 不能加载更多的时候不能 触发加载更多
        if (refreshing || loadingMore || !canLoadMore) {
            return;
        }
        this.setState({
            loadingMore: true,
            pageCurrent: pageCurrent + 1
        }, () => this.getDataByDate())
    }

    // 刷新列表数据
    onRefresh = () => {
        const { refreshing } = this.state;
        if (refreshing) return;
        this.setState({pageCurrent: 1 }, ()=>{this.getDataByDate();this.getInitData(this.state.chooseMouth)});
    }

    // 加载更多时脚部组件
    footerComponent = () => {
        const { loadingMore, dataSource, canLoadMore } = this.state;
        if (dataSource.length == 0) {
            return null;
        }
        let moreText = '上拉加载更多数据';
        if (loadingMore) {
            moreText = '正在加载更多数据'
        } else {
            if (!canLoadMore) {
                moreText = '暂无更多数据' 
            }
        }
        return (
            <View style={styles.footerView}>
                {loadingMore ? <ActivityIndicator color="#000"/> : null}
                <Text style={{ color: '#999' }}>
                    {moreText}
                </Text>
            </View>
        )
    }

    // 判断跳转页面
    jumpPage = async (item) => {
        const { navigation } = this.props;
        const res = await troubleService.getTroubleDetailById(item.tTask.fRelevantInfo);
        console.log('通过id查状态', res.obj);
        if (res.success) {
            let fState = res.obj.fState;
            if (fState == 3) {
                navigation.navigate('TroubleSafeNotify',{refresh: this.onRefresh, item: {fId: item.tTask.fRelevantInfo}, confirmOperation: true});
            } else if (fState == 4) {
                navigation.navigate('TroubleSafeNotify',{refresh: this.onRefresh, item: {fId: item.tTask.fRelevantInfo}, markOperation: true});
            } else if (fState == 5) {
                navigation.navigate('TroubleSafeNotify',{refresh: this.onRefresh, item: {fId: item.tTask.fRelevantInfo}});
            } else if (fState == 6) {
                navigation.navigate('TroubleCallBack',{refresh: this.onRefresh, item: {fId: item.tTask.fRelevantInfo}});
            } else if (fState == 7) {
                navigation.navigate('TroubleCallBack',{refresh: this.onRefresh, item: {fId: item.tTask.fRelevantInfo}, noBtn: true})
            } else if (fState == 8) {
                navigation.navigate('TroubleCallBack',{refresh: this.onRefresh, item: {fId: item.tTask.fRelevantInfo}})
            } else if (fState == 10) {
                navigation.navigate('TroubleCallBack',{refresh: this.onRefresh, item: {fId: item.tTask.fRelevantInfo}});
            }
        } else {
            Toast.show(res.msg);
        }
    }

    // 跳转会议页面
    jumpMettingPage = (item) => {
        const { navigation } = this.props;
        this.props.navigation.navigate('MeetingDetails',{id: item.tTask.fRelevantInfo,meetingHomepage: this.onRefresh})
    }

    // 判断显示颜色
    jugdeColor = (item) => {
        console.log('item', item)
        if (item.tTask.fTaskState == 3) {    
            return '#A7E0A3'; // 绿
        }
        console.log('', Math.floor(parseTime(item.tTask.fPlanBeginTime) / 100000000), Math.floor(new Date().getTime() / 100000000))
        if (parseTime(item.tTask.fPlanEndTime) < new Date().getTime()) {
            return '#F24343'; // 红
        }
        if (parseTime(item.tTask.fPlanBeginTime) > new Date().getTime()) {
            return '#FFCE5C'; // 黄
        }
        return '#00ADF5'; // 蓝色
        // if (Math.floor(parseTime(item.tTask.fPlanBeginTime) / 100000000) < Math.floor(new Date().getTime() / 100000000)) {
        //     return '#F24343';
        // } else if (Math.floor(parseTime(item.tTask.fPlanBeginTime) / 100000000) == Math.floor(new Date().getTime() / 100000000)) {
        //     return ;
        // } else if (Math.floor(parseTime(item.tTask.fPlanBeginTime) / 100000000) > Math.floor(new Date().getTime() / 100000000)) {
        //     return '#FFCE5C'
        // }
    }

    // 工作
    taskNote = (fType) => {
        let labelText = '';
        let backgroundColor = ''
        if (fType == 1) {
            backgroundColor = '#FE7665';
            labelText = '隐患';
        } else if (fType == 3) {
            backgroundColor = '#51D292';
            labelText = '会议';
        } else if (fType == 2) {
            backgroundColor = '#51D292';
            labelText = '巡检';
        } else if (fType == 4) {
            backgroundColor = '#51D292';
            labelText = '保养';
        }else if (fType == 5) {
            backgroundColor = '#51D292';
            labelText = '培训';
        }
        return (
            <View style={[{marginLeft: 8,borderTopLeftRadius: 4, borderBottomRightRadius: 4,paddingRight: 8,paddingLeft: 8,},{backgroundColor: `${backgroundColor}`}]}>
                <Text style={styles.tipView}>{labelText}</Text>
            </View>
        )
    }

    // 跳转巡检页面
    jumpOnSite = (item) => {
        this.props.navigation.navigate('DeviceRecodsMap',{onRefresh: this.onRefresh, item: {fPatrolTaskId: item.tTask.fRelevantInfo}, fromWork: true, single: true})
    }

    // 跳转保养详情页面
    jumpMaintainPage = (item) => {
        this.props.navigation.push('CarshopsDetail',{id: item.tTask.fRelevantInfo, onRefresh: this.getDataByDate, fromTask: true,type: 1})
    }
    // 跳转培训详情页面
    jumpCultivatePage = (item) => {
        console.log(item);
        this.props.navigation.push('CultivateDetail',{item: item,peopleType: 2,onRefresh: this.getDataByDate,showType: 2,})
    }
    renderItem = ({item, index}) => {
        let timeDesc = '';
        if (item.tTask.fRelevantState == '待确认') {
            timeDesc = '下发时间';
        } else if (item.tTask.fRelevantState == '整改中') {
            timeDesc = '整改期限';
        }
        let str = '';
        if (item.tTask.fType == 2) {
            let data = JSON.parse(item.tTask.fContent);
            str = `设备${data['设备']}台,检测项${data['检项']}项,轮数${data['轮数']}`
        }
        return (
            <TouchableOpacity 
                style={styles.contentView} 
                onPress={()=>{
                    switch(item.tTask.fType) {
                        case 1:
                            // 隐患跳转页面
                            this.jumpPage(item);
                            break;
                        case 2:
                            // 跳转巡检页面
                            this.jumpOnSite(item);
                            break;
                        case 3:
                            // 跳转会议页面
                            this.jumpMettingPage(item);
                            break;
                        case 4:
                            // 跳转保养页面
                            this.jumpMaintainPage(item);
                            break;
                        case 5:
                            // 跳转培训页面
                            this.jumpCultivatePage(item);
                            break;
                    }
                }}
            >
                <View style={[styles.rowStyle]}>
                    <View style={[styles.circleItem,{backgroundColor: `${this.jugdeColor(item)}`}]}/>
                    <Text style={{color: '#000', marginLeft: 8}}>{item.tTask.fTitle}</Text>
                    {this.taskNote(item.tTask.fType)}
                </View>
                <Text style={{fontSize: 12,marginTop: 6,lineHeight: 16,marginBottom: 5}}>
                    { item.tTask.fType == 2 ? str : (item.tTask.fContent || '--') }
                </Text>
                <View style={[styles.rowStyle, {justifyContent: 'space-between'}]}>
                    <Text style={{color: '#A5A5A5',fontSize: 12}}>
                    {parseDate(item.tTask.fPlanBeginTime, 'YYYY.MM.DD HH:mm')}{item.tTask.fType == 4 ? null : '~'+ parseDate(item.tTask.fPlanEndTime, 'YYYY.MM.DD HH:mm')} | {item.tTask.fOriginatorName}</Text>
                    <Text style={{color: '#84C4FD',fontSize: 12}}>{item.tTask.fRelevantState || '--'}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const { currentDate, markDates } = this.state;
        return (
            <View style={styles.container}>
                <Header
                leftBtn={
                    <TouchableOpacity style={[{marginLeft: 13,position: 'relative'}]} onPress={()=>this.props.navigation.navigate('Message')}>
                        <Image source={require('../../image/index/notification.png')}></Image>
                        {this.props.messageInfo ? <View style={styles.tipMsg}/> : null}
                        
                    </TouchableOpacity>
                }
                    titleText="任务"
                    props={this.props}
                />
                <FlatList
                    ListHeaderComponent={
                        <View style={{marginBottom: 10}}>
                            <Calendar
                                style={{width}}
                                // current={moment().format('YYYY-MM-DD')}
                                markedDates={markDates}
                                onDayPress={this.topCalendar}
                                // Handler which gets executed on day long press. Default = undefined
                                onDayLongPress={this.topCalendar}
                                onMonthChange = {this.handleChangeMonth}
                                markingType={'multi-dot'}
                            />
                        </View>
                    }
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            colors={['#000']}
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />
                    } 
                    ListFooterComponent={this.footerComponent}
                    refreshing={this.state.refreshing}
                    data={this.state.dataSource}
                    renderItem={this.renderItem}
                    ListEmptyComponent={<Text style={{width, textAlign: 'center',marginTop: 10,color: '#c9c9c9'}}>暂无任务数据</Text>}
                    onEndReachedThreshold={0.1}
                    onEndReached={this.loadMore}
                />
                
                {/* <ActionButton buttonColor="rgba(60,173,251,0.8)" size={32}>
                    <ActionButton.Item buttonColor='#00ADF5' textContainerStyle={{backgroundColor: '#00ADF5'}} textStyle={{color: '#fff'}} title="任务" onPress={() => console.log("notes tapped!")}>
                        <AntDesign name="profile" color="#fff" size={16}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#FF9800' textContainerStyle={{backgroundColor: '#FF9800'}} textStyle={{color: '#fff'}} title="便签" onPress={() => {}}>
                        <AntDesign name="book" color="#fff" size={16}/>
                    </ActionButton.Item>
                </ActionButton> */}
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
      fEmployeeId: state.userReducer.userInfo.fEmployeeId,
      messageInfo: state.userReducer.messageInfo,
    }
  }
export default connect(
    mapStateToProps,
)(Task);
const styles = StyleSheet.create({
    contentView: {
        padding: 10,
        paddingRight: 20,
        paddingLeft: 20,
        backgroundColor: '#fff',
        marginBottom: 1
    },
    footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 10
    },
    tipView: {
        lineHeight: 16,
        fontSize: 10,
        color: '#fff'
    },
    tipMsg: {
        width: 8,
        height: 8,
        borderRadius: 50,
        backgroundColor: 'red',
        position: 'absolute',
        bottom: 2,
        left: 14
    },
    taskDetail: {
        flex: 1,
        marginLeft: 10
    },
    circleItem: {
        width: 14,
        height: 14,
        borderRadius: 100,
    },
    btnView: {
        width: 70,
        flexDirection: 'row',
        alignItems: 'center'
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 10,
        paddingLeft: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F4F4F4',
        backgroundColor: '#fff'
    },
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    rowStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});
