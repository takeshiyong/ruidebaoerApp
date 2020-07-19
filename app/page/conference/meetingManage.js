import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image,ActivityIndicator,TextInput, RefreshControl, FlatList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Agenda} from 'react-native-calendars';
import moment from 'moment';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import Header from '../../components/header';
import Toast from '../../components/toast';
import {parseDate,parseTime,isDot} from '../../utils/handlePhoto';
import meetingServer from '../../service/meetingServer';
const {width, height} = Dimensions.get('window');
    class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
        showModal: false,
        dateNum: new Date().getTime(),
        dataSeting : [],
        selectDate :new Date().getDate(),
        defaultDate: new Date().getTime(),
        currentData: parseDate(new Date().getTime(),'YYYY-MM-DD'),
        array: [],
        currentPage: 1,
        // 列表数据结构
        dataSource: [],
        // 下拉刷新
        isRefresh: false,
        // 加载更多
        isLoadMore: false,
        pageSize: 10,
        // 控制foot  1：正在加载   2 ：无更多数据
        showFoot: 1,
        num: 0
    }

    componentDidMount(){
        this.setPeriodTime();
        this.meetingHomepage();
        this.meetingHomepageTime()
        this.sendToMeUnread();
    }
    //获取会议状态
    getState = (value) => {
        switch (value){
            case 1: 
                return '未开始';
            case 2: 
                return '进行中';
            case 3: 
                return '待归档';
            case 4:
                return '已归档';
            case 5:
                return '已取消';
            default:
                return null;
        } 

    }
    //抄送我的未读信息
    sendToMeUnread =  async () => {
        const res = await meetingServer.sendToMeUnread();
        console.log('抄送我的未读信息res', res);
        if(res.success){
            this.setState({
                num: res.obj
            })
        }else{
            console.log('抄送我的未读信息',res.msg);
        }
    }
    //获取会议列表
    meetingHomepage =  async () => {
        global.loading.show();
        this.setState({ refreshing: true });
        const res = await meetingServer.meetingHomepage({
            date: parseTime(this.state.currentData),
        })
        this.setState({ refreshing: false });
        console.log('获取会议列表', res);
        global.loading.hide();
        if(res.success){
            this.setState({
                dataSource: res.obj.meetingList
            })
        }else{
            console.log('获取会议列表',res.msg)
        }
    }
    //会议主页管理会议时间
    meetingHomepageTime = async () => {
        const { dateNum,currentData } = this.state
        const res = await meetingServer.meetingHomepageTime({
            startTime: parseTime(parseDate(dateNum,'YYYY-MM-DD')),
            endTime: parseTime(parseDate(dateNum,'YYYY-MM-DD'))+7*86400000
        })
        if(res.success){
            let arr =[];
            for( item of res.obj){
                arr.push( new Date(parseTime(item)).getDate())
            }
            var array = [];
            for (var i = 0; i < arr.length; i++) {
                if (array.indexOf(arr[i]) === -1) {
                    array.push(arr[i])
                }
            }
            this.setState({
                array
            })
        }else{
            
            Toast.show(res.msg)
        }
    }
    
    //设置周转换，数字转文字
    changeMon = (value) => {
        switch (value){
            case 0:
                return '日';
            case 1: 
                return '一';
            case 2: 
                return '二';
            case 3: 
                return '三';
            case 4:
                return '四';
            case 5:
                return '五';
            case 6:  
                return '六';  
            default:
                return null;
        } 

    }
    //点击切换时间
    changeDate = (selectDate) => {
        let selectDate1 = new Date(selectDate).getDate()
        let currentData = parseDate(selectDate,'YYYY-MM-DD')
        this.setState({
            selectDate: selectDate1,
            currentData
        },() => {
            this.meetingHomepage()
        })
    }
    //左右点击相关操作
    changeNum = (data) => {
        let {dateNum} =this.state;
        if(data == 'add'){
            dateNum = new Date(dateNum+7*86400000).getTime()
        }else{
            dateNum = new Date(dateNum-7*86400000).getTime()
        }
        this.setState({
            dateNum
        },() => {
            this.setPeriodTime()
            this.meetingHomepageTime()
        })
    }
    //callBack 
    callBack = () => {
        this.setState({
            dateNum: this.state.defaultDate,
            selectDate :new Date().getDate(),
            currentData:  parseDate(new Date(),'YYYY-MM-DD')
        },() => {
            this.setPeriodTime();
            this.meetingHomepage();
            this.meetingHomepageTime()
        })
    }
    //设置一周时间
    setPeriodTime = () => {
        let dataSeting = [];
        for(let i = 0;i< 7; i++){
            dataSeting.push({
                n: new Date(this.state.dateNum+i*86400000).getTime(),
                m: this.changeMon(new Date(this.state.dateNum+i*86400000).getDay())
            });
        }
        this.setState({
            dataSeting
        })
    }
    /**
     * 下啦刷新
     * 
     */
    
    _onRefresh = () => {
        // 不处于 下拉刷新
        this.meetingHomepage();
        this.meetingHomepageTime();
    };

    _createListHeader = () => {
        const {selectDate, defaultDate, currentData,dataSource} =this.state;
        return(<View>
                <View style={{width: width, backgroundColor: "#fff",paddingLeft: 16,paddingRight: 16,paddingBottom: 10}}>
                    <View style={styles.timeBox}>
                        <View style={styles.itemTime}>
                            <Text style={styles.timeText}>{dataSource.length > 0 && dataSource[0] ? parseDate(dataSource[0].fBeginTime,'HH:mm'): '--'}</Text>
                            <Text style={styles.timeAboutText}>开始时间</Text>
                        </View>
                        <View style={[styles.itemTime,{marginTop: 40}]}>
                            <Image source={require("../../image/meeting/left.png")} style={{width: 12, height: 3,marginBottom: 15}}/>
                            <View style={{width: 44,height: 20,backgroundColor: "#FEEAEA",alignItems: "center",justifyContent: "center"}}>
                                <Text style={[styles.timeAboutText,{color: '#F74747'}]}>{dataSource.length > 0 && dataSource[0] ? this.getState(dataSource[0].fState): '--'}</Text>
                            </View>
                        </View>
                        <View style={styles.itemTime}>
                            <Text style={styles.timeText}>{dataSource.length > 0 && dataSource[0] ? parseDate(dataSource[0].fEndTime,'HH:mm'): '--'}</Text>
                            <Text style={styles.timeAboutText}>结束时间</Text>
                        </View>
                    </View>
                    <View style={styles.centerBox}>
                        <View style={{flexDirection: "row",alignItems: "center"}}>
                            <Image source={require("../../image/meeting/title.png")} style={{width: 22, height: 22}}/>
                            <Text style={{color: "#333",fontSize: 14,fontWeight: "500",marginLeft: 12}}>{dataSource.length > 0 && dataSource[0] ? dataSource[0].fName: '--'}</Text>
                        </View>
                        
                        <View style={{width: 64,height: 16,backgroundColor: "#50A93F",alignItems: "center",justifyContent: "center",borderRadius: 3}}>
                            <Text style={{color: "#fff",fontSize: 10}}>{dataSource.length > 0 && dataSource[0] ? dataSource[0].fTypeName: '--'}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: "row",justifyContent: "space-between"}}>
                        <View style={styles.itemLine}>
                            <Image source={require("../../image/meeting/clock.png")} style={{width: 10, height: 10}}/>
                            <Text style={styles.itemLineText}>{dataSource.length > 0 && dataSource[0] ? parseDate(dataSource[0].fBeginTime,'YYYY-MM-DD'): '--'}</Text>
                        </View>
                        <View style={styles.itemLine}>
                            <Image source={require("../../image/meeting/home.png")} style={{width: 10, height: 10}}/>
                            <Text style={styles.itemLineText}>{dataSource.length > 0 && dataSource[0] ? dataSource[0].fRoomName : '--'}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.topBar}>
                    <TouchableOpacity style={{alignItems: "center"}} onPress={() => this.props.navigation.push('NewMeeting',{meetingHomepage:  ()=>{this.meetingHomepage();this.meetingHomepageTime()}})}>
                        <Image source={require("../../image/meeting/new.png")} style={{width: 44, height: 44}}/>
                        <Text style={{color: "#333",fontSize: 12,fontWeight: "500",marginTop: 12}}>发起会议</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{alignItems: "center",position: 'relative'}} onPress={() => this.props.navigation.push('HistoricalMeeting',{type: 0, sendToMeUnread:this.sendToMeUnread,meetingHomepage: this.meetingHomepage})}>
                        {
                            this.state.num ? 
                            <View style={{position: "absolute",zIndex: 999,right: 5,top: 0}}>
                                <View style={styles.circleView}></View>
                            </View>: null
                        }
                        <Image source={require("../../image/meeting/toMe.png")} style={{width: 44, height: 44}} />
                        <Text style={{color: "#333",fontSize: 12,fontWeight: "500",marginTop: 12}}>抄送我的</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{alignItems: "center"}} onPress={() => this.props.navigation.push('HistoricalMeeting',{type: 1, sendToMeUnread:this.sendToMeUnread,meetingHomepage: this.meetingHomepage})}>
                        <Image source={require("../../image/meeting/history.png")} style={{width: 44, height: 44}}/>
                        <Text style={{color: "#333",fontSize: 12,fontWeight: "500",marginTop: 12}}>历史会议</Text>
                    </TouchableOpacity>
                </View>
                <View style={{backgroundColor: "#fff",marginTop: 12,borderBottomColor: "#E0E0E0",borderBottomWidth: 1}}>
                    <View style={{paddingLeft: 16,paddingRight: 16}}>
                        <View style={styles.timeTop}>
                            <Text style={{color: "#333",fontSize: 14,fontWeight: "500"}}>{currentData}</Text>
                            <TouchableOpacity onPress={() => this.callBack()}>
                                <Text style={{fontSize: 14,color: "#4B74FF"}}>回到今天</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{paddingLeft: 20,paddingRight: 20,}}>
                            <TouchableOpacity style={{position: "absolute",left: 0,top: '30%'}} onPress={() => this.changeNum('press')}>
                                <Image source={require("../../image/meeting/pressLeft.png")} style={{width: 25, height: 25}}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={{position: "absolute",right: 0,top: '30%'}} onPress={() => this.changeNum('add')}>
                                <Image source={require("../../image/meeting/pressRight.png")} style={{width: 25, height: 25}}/>
                            </TouchableOpacity>
                            <View style={styles.itemsBox}>
                                {
                                    this.state.dataSeting.length !== 0 ? this.state.dataSeting.map((item,index) => {
                                        return(<View style={{alignItems: "center",justifyContent: "center"}} index={index}>
                                            <Text style={{fontSize: 14,color: "#999"}} >{item.m}</Text>
                                            <TouchableOpacity style={[styles.pressColor,{backgroundColor:  selectDate == new Date(item.n).getDate() ?  "#4B74FF": "#fff"}]} onPress={() => {this.changeDate(item.n)}}>
                                                <Text style={{fontSize: 14,color: new Date(item.n).getDate()==selectDate? '#fff':(parseDate(defaultDate,'YYYY-MM-DD') == parseDate(item.n,'YYYY-MM-DD') ? "#4B74FF":"#333"),}}>{new Date(item.n).getDate()}</Text>
                                            </TouchableOpacity>
                                            <View style={[styles.huiyiTips,{backgroundColor: this.state.array.indexOf(new Date(item.n).getDate()) != -1 ? "#4B74FF": "#fff"}]}></View>
                                        </View>)
                                    }): null
                                }
                                
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#fff' }} />;
    }

    renderItem = ({item,index}) => {
        return(
            <TouchableOpacity 
                style={{paddingRight: 15,borderBottomColor: "#E0E0E0",borderBottomWidth: 1,backgroundColor: "#fff"}} 
                onPress={() => this.props.navigation.navigate('MeetingDetails',{id: item.fId,meetingHomepage: this.meetingHomepage})}>
                <View style={{flexDirection: "row",alignItems:"center",justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row",alignItems:"center"}}>
                        <View style={{height: 72,width: 4,backgroundColor: "#4B74FF"}}></View>
                        <View style={{borderRightColor: "#E0E0E0",borderRightWidth: 1,width: 70,alignItems: "center"}}>
                            <Text style={{color: "#333",fontWeight: "500",marginBottom: 9}}>{parseDate(item.fBeginTime,'HH:mm')}</Text>
                            <Text>{isDot((parseTime(item.fEndTime)-parseTime(item.fBeginTime))/60000)}分钟</Text>
                        </View>
                        <View style={{marginLeft: 16}}>
                            <Text style={{color: "#333",fontSize: 14,fontWeight: "500"}}>{item.fName}</Text>
                            <View style={{flexDirection: "row",justifyContent: "space-between"}}>
                                <View style={styles.bottomItemLine}>
                                    <Image source={require("../../image/meeting/clock.png")} style={{width: 12, height: 12}}/>
                                    <Text style={styles.bottomItemLineText}>{parseDate(item.fBeginTime,'YYYY-MM-DD')}</Text>
                                </View>
                                <View style={[styles.bottomItemLine,{marginLeft: 11}]}>
                                    <Image source={require("../../image/meeting/home.png")} style={{width: 12, height: 12}}/>
                                    <Text style={styles.bottomItemLineText}>{item.fRoomName}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{alignItems: "center"}}>
                        <LinearGradient start={{x: 0.0, y: 1}} end={{x: 1.0, y:0}} colors={['#50A93F', '#8CEC7B']} style={styles.linearGradient} style={{width: 64,height: 20,borderRadius: 4,alignItems: "center",justifyContent: "center"}}>
                            <Text style={{color: "#fff",fontSize: 10}}>{item.fTypeName}</Text>
                        </LinearGradient>
                        <Text style={{color: "#999",fontSize: 10,marginTop: 12}}>{item.fState? this.getState(item.fState) :'--'}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    
    render() {
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="会议管理"
                    hidePlus={false} 
                    props={this.props}
                />
                <View style={{flex: 1}}>
                    <FlatList
                        data={this.state.dataSource}
                        refreshControl={
                            <RefreshControl
                                title={'Loading'}
                                colors={['#000']}
                                refreshing={this.state.isRefresh}
                                onRefresh={() => {
                                    this._onRefresh();
                                }}
                            />
                        }
                        renderItem={this.renderItem}
                        refreshing={this.state.isRefresh}
                        //加载更多
                        ListHeaderComponent={this._createListHeader.bind(this)}
                        ItemSeparatorComponent={()=>this._separator()}
                    /> 
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => {
    return {
      messageInfo: state.userReducer.messageInfo,
      fEmployeeId: state.userReducer.userInfo.fEmployeeId
    }
}
export default connect(mapStateToProps)(App);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        backgroundColor: '#F6F6F6',
    },
    topBar:{
        width: width, 
        height: 108,
        backgroundColor: "#fff",
        paddingLeft: 16,
        paddingRight: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        marginTop: 15
    },
    circleView: {
        width: 8,
        height: 8,
        borderRadius: 50,
        backgroundColor: 'red'
    },  
    timeText: {
        color: "#333",
        fontSize:  24,
        fontWeight: "600"
    },
    itemTime: {
        alignItems: "center",
        marginTop: 28,
        marginBottom: 12
    },
    timeAboutText: {
        fontSize: 12,
        color: "#999"
    },
    timeBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        borderBottomColor: "#E0E0E0",
        paddingBottom: 12,
        borderBottomWidth: 1
    },
    centerBox: {
        flexDirection: "row",
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 13,
        paddingBottom: 13
    },
    itemLine: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
        marginBottom: 10
    },
    itemLineText: {
        marginLeft: 13,
        color: "#999",
        fontSize: 14
    },
    bottomItemLine: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12
    },
    bottomItemLineText: {
        marginLeft: 7,
        color: "#999",
        fontSize: 14
    },
    huiyiTips:{
        width: 4,
        height:4,
        backgroundColor:"#fff",
        borderRadius: 2,
        marginTop: 4
    },
    pressColor:{
        width: 28,
        height: 28,
        backgroundColor: "#fff",
        borderRadius: 14,
        marginTop: 9,
        alignItems: "center",
        justifyContent: "center"
    },
    itemsBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop:9,
        paddingBottom: 6,
        paddingLeft: 20,
        paddingRight: 20
    },
    footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 10,
        paddingBottom: 55
      },
    timeTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 27,
        paddingBottom: 19,
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1
    }
});
