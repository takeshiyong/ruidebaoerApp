import React, { Component } from 'react';
import { StyleSheet, Text, View, BackHandler, TouchableOpacity,ImageBackground, Dimensions, TouchableHighlight, Platform, StatusBar, ScrollView, Image,Modal} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {ECharts} from 'react-native-echarts-wrapper';
import Picker from 'react-native-wheel-picker';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import JPushModule from 'jpush-react-native';
import SplashScreen from 'react-native-splash-screen';
import config from '../../config';
import {sH, sW, sT, barHeight, navHeight} from '../../utils/screen';
import Header from '../../components/header';
import ModalDropdown from '../../components/modalDropdown';
import ShadowSelector from '../../components/shadowSelector';
import { getAllTroubleLevel, getAllTroubleType, getMessageInfo, getAllUser, getAllUserName, getSortname, getUserIntegral, getMeetingType,getMeetingRoom} from '../../store/thunk/systemVariable';
import troubleServer from '../../service/troubleService';
import Toast from '../../components/toast'
import userService from '../../service/messageServer';
const navStyle = navHeight();
const isAndroid = Platform.OS === 'android';
const {width, height} = Dimensions.get('window');
import energyServer from '../../service/energyServer';
import Environment from '../../service/environmental';
import {isDot} from '../../utils/handlePhoto';
import { parseDate } from '../../utils/handlePhoto';

export class App extends Component {
    static navigationOptions = () => ({
        header: ()=> {
            return  null;
        }
    });
    state = {
        showMenu: false,
        modalVisible: true,
        showPicker: false,
        fAllNum: 0,
        current: 0,
        yesterdayYield: 0,
        yesterdaySales: 0,
        manage: [],
        obj: {},
        option1: {},
        option2: {},
        key2: 1,
        key3: 1,
        option3: {
            legend: {
                orient: 'vertical',
                right: 0,
                top: '20%',
                data: ['重大', '较大', '一般', '低'],
                formatter: function(name) {
                    if (name == '重大') {
                        return '重大 0%';
                    }
                    if (name == '较大') {
                        return '较大 4%';
                    }
                    if (name == '一般') {
                        return '一般 20%';
                    }
                    if (name == '低') {
                        return '低  76%';
                    }
                },
                textStyle: {
                    rich: {
                        title: {
                            color: '#333',
                            align: 'left',
                        },
                        value: {
                            align: 'right',
                            width: 50
                        }
                    }
                }
            },
            series: [{
                name: '风险数量',
                type: 'pie',
                radius: [0, 45],
                center: ['35%', '45%'],
                silent: true,
                data: [{
                    value: 0,
                    name: "重大",
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 0,
                            colorStops: [{
                                offset: 0,
                                color: '#FC666C' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#FC9FA3' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        }
                    }
                }, {
                    value: 18,
                    name: "较大",
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 0,
                            colorStops: [{
                                offset: 0,
                                color: '#FF632E' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#FF8949' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        }

                    }
                }, {
                    value: 85,
                    name: "一般",
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 0,
                            colorStops: [{
                                offset: 0,
                                color: '#35C9FF' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#5FEBFF' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        }
                    },
                    labelLine: {
                        length: 1,
                        height2: 1
                    },
                }, {
                    value: 327,
                    name: "低",
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 0,
                            colorStops: [{
                                offset: 0,
                                color: '#82F3DC' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#1ACFAA' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        }
                    }
                }],
                roseType: 'radius',
                label: {
                    formatter: function(item, names) {
                        return item.data.value + "件";
                    },
                    color: '#666666',
                    padding: [5,6], //[0, -26, 10, -10]
                    borderRadius: 10,
                    backgroundColor: '#F4F4F4'
                },
                labelLine: {//设置延长线的长度
                    normal: {
                        length: 5,//设置延长线的长度
                        length2: 8,//设置第二段延长线的长度
                    }
                },
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                }
            }]
        },
        option4: {
            tooltip: {//设置提示
                backgroundColor: 'rgba(75,116,255,0.5)',
                padding: [15, 15],
                trigger: 'axis',
                alwaysShowContent: true,
                enterable: true,
                extraCssText: 'z-index: 9999;',
                position: function(point){
                    let a = point[0]-160;
                    let b = point[1]-100;
                    if ((point[0]-160) < 0) {
                        a = -(point[0]-160);
                    }
                    if ((point[1]-100) < 0) {
                        b = -(point[1]-100);
                    }
                    //其中params为当前鼠标的位置
                    return [a,b];
                },
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'line', // 默认为直线，可选为：'line' | 'shadow'
                    lineStyle: {
                        color: '#4B74FF'
                    }
                },
                formatter: function (params) {
                    let html = '';
                    html +='<div style="color:#fff;">2019.06 - 2019.07</div>'
                    for(var i=0;i<params.length;i++){
                        //名称
                        var name = params[i].name;
                        //值
                        var value = params[i].data;
                        html+= name + '：' + value+'<br>'
                    }
                    html +='<a href="javascript:void(0)" onclick="detail()" style="color:#4B74FF;text-decoration:none;">查看详情</a>'
                    return html;
                },
                textStyle: {      //提示文本的样式
                    color: '#fff',
                    fontsize: 12
                }
            },
            grid: {
                height: '90%',
                left: '2%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                interval: 1,
                min: 0,
                max: 7,
                scale: true,
                splitLine: {
                    lineStyle: {
                        color: '#E0E0E0'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#E0E0E0'
                    }
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#999999'
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: ['一般事故','较大事故','重大事故','特别重大事故'],
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#999999'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#E0E0E0'
                    }
                }
            },
            series: [
                {
                    type: 'bar',
                    barWidth: 16,
                    silent: true,
                    data: [1,0,0,0],
                    itemStyle: {
                        normal: {
                            barBorderRadius: [0, 10, 10, 0],
                            //颜色渐变
                            color: {
                                type: 'linear',
                                x: 1,
                                y: 0,
                                x2: 0,
                                y2: 0,
                                colorStops: [{
                                    offset: 0,
                                    color: '#1ACFAA' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#82F3DC' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
                        }
                    }
                },
            ]
        },
        option5: {
            legend: {
                data: ['正常', '违规'],
                top: 0,
                right: 0
            },
            grid: {
                width: '86%',
                top: '15%',
                left: '10%',
                bottom: '15%',
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(75,116,255,0.5)',
                padding: [10, 15],
                enterable: true,
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'line', // 默认为直线，可选为：'line' | 'shadow'
                    lineStyle: {
                        color: '#4B74FF'
                    }
                },
                position: function(point){
                    let a = point[0]-110;
                    let b = point[1]-100;
                    if ((point[0]-110) < 0) {
                        a = -(point[0]-110);
                    }
                    if ((point[1]-100) < 0) {
                        b = -(point[1]-100);
                    }
                    //其中params为当前鼠标的位置
                    return [a,b];
                },
                formatter: function(parms) {
                    let str = '<span>部门：</span>';
                    for(var i=0;i<parms.length;i++){
                        if (i == 0){
                            str += parms[i].name + '</br><i style="width:8px;height:8px;border-radius:50%;border: 1px solid #fff;background:linear-gradient(0deg,rgba(130,243,220,1) 0%,rgba(26,207,170,1) 100%);display:inline-block;"></i> ' + parms[i].seriesName + '：' + Math.abs(parms[i].data) + '</br>';
                        } else {
                            str += '<i style="width:8px;height:8px;border-radius:50%;border: 1px solid #fff;background:linear-gradient(180deg,rgba(255,99,46,1) 0%,rgba(255,137,73,1) 100%);display:inline-block;"></i> ' + parms[i].seriesName + '：' + Math.abs(parms[i].data) + '</br>';
                        }
                    }
                    str +='<a href="javascript:void(0)" onclick="detail()" style="color:#4B74FF;text-decoration:none;">查看详情</a>';
                    return str;
                }
            },
            xAxis: [{
                    type: 'category',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        interval: 0,
                        textStyle: {
                            color: '#999999'
                        }
                    },
                    data: ['加工部', '开采部', '移动破', '机电车间', '磅房',]
                },
                {
                    show: false,
                    type: 'category',
                    axisLabel: {
                        interval: 0
                    },
                    data: ['加工部', '开采部', '移动破', '机电车间', '磅房']
                }
            ],
            yAxis: [{
                type: 'value',
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#999999'
                    }
                },
                nameTextStyle: {
                    color: '#666'
                },
                splitLine: {
                    lineStyle: {
                        color: '#E0E0E0'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    formatter: function(value, index) {
                        var val = Math.abs(value)
                        return val;
                    }
                }
            }],
            series: [{
                    id: "topchart",
                    name: "正常",
                    type: 'bar',
                    silent: true,
                    stack: '合并',
                    itemStyle: {
                        normal: {
                            barBorderRadius: [10, 10, 0, 0],
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 1,
                                    color: '#82F3DC' // 0% 处的颜色
                                }, {
                                    offset: 0,
                                    color: '#1ACFAA' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
                        }
                    },
                    xAxisIndex: 0,
                    barWidth: 15,
                    data: [167, 60, 12, 8, 10],
                }, {
                    id: "leftchart",
                    name: "违规",
                    type: 'bar',
                    silent: true,
                    stack: '合并',
                    barGap: "-100%",
                    itemStyle: {
                        normal: {
                            barBorderRadius: [0, 0, 10, 10],
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 1,
                                    color: '#FF632E' // 0% 处的颜色
                                }, {
                                    offset: 0,
                                    color: '#FF8949' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
                        }
                    },
                    xAxisIndex: 1,
                    barWidth: 15,
                    data: [-1, -1, -0, -0, -0],
                },
            ]
        },
        option6: {
            backgroundColor: 'transparent',
            tooltip: {
                backgroundColor: 'rgba(75,116,255,0.5)',
                padding: [10, 15],
                trigger: 'axis',
                position: function(point){
                    let a = point[0]-100;
                    let b = point[1]-120;
                    if ((point[0]-100) < 0) {
                        a = -(point[0]-100);
                    }
                    if ((point[1]-120) < 0) {
                        b = -(point[1]-120);
                    }
                    //其中params为当前鼠标的位置
                    return [a,b];
                },
                formatter: function (params, ticket, callback) {
                    console.log(params);
                    var showHtm="";
                    let a = 0;
                    var title = params[a].name;
                    showHtm+= '<i style="width:8px;height:8px;border-radius:50%;border: 1px solid #fff;background-color: #4B74FF;display:inline-block;"></i> '+ title + '<br>';
                    for(var i=0;i<params.length;i++){
                        //名称
                        var name = params[i].seriesName;
                        //值
                        var value = params[i].data.value;
                        var name2 = '';
                        if (name == '在线设备') {
                            name = '在线';
                            name2 = '在线率：' + params[i].data.onlineRate + '%'
                        } else if (name == '故障设备') {
                            name = '故障';
                            name2 = '故障率：' + params[i].data.onlineRate + '%'
                        }
                        if (name == '工作时长') {
                            showHtm+= name + "：" + value+'h<br>'+name2
                        }
                        if (name != '离线设备' && name != '工作时长') {
                            showHtm+= name + "：" + value+'<br>'+name2+'<br>'
                        }
                        
                    }
                    return showHtm;
                },
            },
            grid: {
                x: 50,
                width: '70%'
            },
            legend: {
                data:['在线设备','离线设备','故障设备','工作时长'],
                bottom: 0,
                textStyle: {
                    fontSize: 10
                },
                width: width - 40,
                itemWidth: 20
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['06-29','06-30','07-01','07-02','07-03','07-04','07-05'],
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            color: '#4B74FF'
                        }
                    },
                    splitLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#E0E0E0'
                        }
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#999999'
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '单位：台　　　',
                    axisLabel: {
                        formatter: '{value}'
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#999999'
                        }
                    },
                    nameTextStyle: {
                        color: '#666'
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#E0E0E0'
                        }
                    },
                },
                {
                    type: 'value',
                    name: '　　　单位：h',
                    interval: 4,
                    max: 20,
                    axisLabel: {
                        formatter: '{value}'
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#999999'
                        }
                    },
                    nameTextStyle: {
                        color: '#666'
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#E0E0E0'
                        }
                    },
                }
            ],
            series: [
                {
                    name:'在线设备',
                    type:'bar',
                    silent: true,
                    data:[{value: 130, onlineRate: 65},{value: 129, onlineRate: 64.5},{value: 150, onlineRate: 75},{value: 138, onlineRate: 69},{value: 130, onlineRate: 65},{value: 129, onlineRate: 64.5},{value: 130, onlineRate: 65},],
                    itemStyle: {
                        normal: {
                            barBorderRadius: [10, 10, 0, 0],
                            //颜色渐变
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: '#1ACFAA' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#82F3DC' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
                        }
                    }
                },
                {
                    name:'故障设备',
                    stack: '不在线',
                    type:'bar',
                    silent: true,
                    data:[{value: 3, onlineRate: 1.5},{value: 1, onlineRate: 0.5},{value: 3, onlineRate: 1.5},{value: 4, onlineRate: 2},{value: 6, onlineRate: 3},{value: 8, onlineRate: 4},{value: 2, onlineRate: 1},],
                    itemStyle: {
                        normal: {
                            
                            //颜色渐变
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: '#E24329' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#FDB451' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
                        }
                    }
                },
                {
                    name:'离线设备',
                    type:'bar',
                    stack: '不在线',
                    silent: true,
                    data:[{value: 67, onlineRate: 1.5},{value: 70, onlineRate: 0.5},{value: 47, onlineRate: 1.5},{value: 58, onlineRate: 2},{value: 54, onlineRate: 3},{value: 63, onlineRate: 4},{value: 68, onlineRate: 1},],
                    itemStyle: {
                        normal: {
                            barBorderRadius: [10, 10, 0, 0],
                            //颜色渐变
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: '#566CF9' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#7A95F7' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
                        }
                    }
                },
                {
                    name:'工作时长',
                    type:'line',
                    yAxisIndex: 1,
                    silent: true,
                    data:[{value: 5.9}, {value: 4},{value: 10},{value: 12},{value: 8}, {value: 7}, {value: 10}],
                    symbol: 'circle',//折线点设置为实心点
                    symbolSize: 6,   //折线点的大小
                    itemStyle: {
                        normal: {
                            color: '#FF6E36',
                            borderWidth: 1,
                            borderColor: '#FFFFFF',
                            lineStyle: {
                                color: "#FF6E36"//折线的颜色
                            }
                        }
                    }
                },
                
              ]
        }
    }

    componentDidMount() {
        SplashScreen.hide();
        this.initData();
        JPushModule.addReceiveNotificationListener(this.receviceNotify)
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            this.selectByLevel();
            this.selectNumByState();
        });
        this.openNotificationListener = map => {
            console.log('Opening notification!')
            console.log('map.extra: ' + map.extras)
            let data  = map.extras ? JSON.parse(map.extras) : null;
            this.jumpSecondActivity(data);
            
        }
        JPushModule.addReceiveOpenNotificationListener(this.openNotificationListener);
        // 启动监听该页面
        // this.viewDidAppear = this.props.navigation.addListener(
        //     'didFocus',
        //     (obj)=>{
        //         BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        //     }
        // )
        // this.didBlurSubscription = this.props.navigation.addListener(
        //     'willBlur',
        //     (obj)=>{
        //         console.log('销毁页面')
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
        JPushModule.removeReceiveNotificationListener(this.receviceNotify);
        if (this._navListener) {
            this._navListener.remove();
        }
        JPushModule.removeReceiveOpenNotificationListener(this.openNotificationListener)
    }

    // 监听通知消息
    jumpSecondActivity(data) {
        const { navigate } = this.props.navigation;
        // 跳转会议详情页面
        if (data && data.fType == 5) {
            navigate('MeetingDetails',{id: data.fRelevantInfo})
        }
    }

    // 监听通知消息
    receviceNotify = event => {
        this.props.dispatch(getMessageInfo(this.props.fEmployeeId));
    }
    //设置隐患format数据
    changeDataForm = (arr,allname) => {
        for(let i = 0; i< arr.length; i++){
            if (name == arr.fLevelName) {
                return (arr.fLevelName+(arr.num/allname).toFixed(2)*100+'%');
            }
        }
    }
     //分页查询监测点
    getSelectByPage = async () => {
        const res = await Environment.getSelectByPage({
            currentPage: 1,
            pageSize: 10
        });
        if(res.success){
            let arr = [];
            for(item of res.obj.items){
                arr.push({
                    fName: item.fName,
                    fId: item.fId
                })
            }
            this.setState({
                manage: arr
            },() => {
                this.getControllerData(this.state.manage[0].fId);
            })
        }
    }
    //监测点监测数据
    getControllerData = async (id) => {
        const res = await Environment.getControllerData(id);
            if(res.success){
               this.setState({
                   obj: res.obj,
               })
            }else{
                console.log('监测点监测数据',res.msg)
            }
    }
      
    //根据隐患级别查询饼状图占比
    selectByLevel = async () => {
        const res = await troubleServer.selectByLevel();
        const color = ['#FC666C','#FF632E','#35C9FF','#82F3DC'];
        if(res.success){
            let arr = [];
            let dataArr = [];
            for(let i = 0; i<res.obj.httpSelectByLevelRes.length; i++){
                arr.push(res.obj.httpSelectByLevelRes[i].fLevelName);
                dataArr.push({
                    value: res.obj.httpSelectByLevelRes[i].num,
                    name: res.obj.httpSelectByLevelRes[i].fLevelName,
                    label: {
                        formatter: function(item, name) {
                            return item.data.name+': '+item.data.value + '件'
                        },
                        color: '#666666',
                        padding: [5, 6],
                        borderRadius: 10,
                        backgroundColor: '#F4F4F4'
                    },
                    labelLine: {
                        height2: 3
                    },
                    itemStyle:{
                        normal: {
                            color: color[i]
                        }
                    }
                })
            }
            this.setState({
                key2: this.state.key2 + 1,
                option2: {
                    legend: {
                        orient: 'horizontal',
                        bottom: 0,
                        data: arr,
                        formatter: function(name) {
                            return name;
                        },
                        textStyle: {
                            rich: {
                                title: {
                                    color: '#333',
                                    align: 'left',
                                },
                                value: {
                                    align: 'right',
                                    width: 50
                                }
                            }
                        }
                    },
                    series: [{
                        name: '隐患数量',
                        type: 'pie',
                        clockWise: false,
                        radius: [50, 60],
                        hoverAnimation: false,
                        center: ['50%', '45%'],
                        silent: true,
                        data: dataArr,
                        
                    }]
                }
            });
        }
    }
    //根据隐患状态集合查询隐患数量
    selectNumByState = async () => {
        const res = await troubleServer.selectNumByState({
            fStateList: [3,4,5,7,8,10]
        });
        if(res.success){
            this.setState({
                fAllNum: res.obj
            })
        }else{
            console.log('根据隐患状态集合查询隐患数量',res.msg)
        }
    }
   
    //查询昨日销量,昨日产量
    getYesterdayData = async () => {
        Promise.all([energyServer.getSurvey(),energyServer.getVolume()]).then((result) => {
            if(result[0].success && result[1].success){
                this.setState({
                    yesterdayYield: isDot(result[0].obj.yesterdayYield/10000),
                    yesterdaySales: isDot(result[1].obj.yesterdaySales/10000),
                })
            }else{
            }
        })
    }
    //查询昨产能数据
    getSelectAll = async () => {
        const res = await energyServer.getSelectAll({
            startTime: ( new Date().getTime()-518400000),
            endTime: (new Date().getTime())
        });
        if(res.success){
            let dateArr = [];
            let type1 = [];
            let type2 = [];
            let type3 = [];
            for(let i = 0; i< res.obj.length; i++) {
                dateArr.push(parseDate(res.obj[i].date,'MM-DD'));
                for(let j = 0; j< res.obj[i].nameAndNum.length; j++){
                    if(res.obj[i].nameAndNum[j].type == 1){
                        type1.push(res.obj[i].nameAndNum[j].num)
                    }
                    if(res.obj[i].nameAndNum[j].type == 2){
                        type2.push(res.obj[i].nameAndNum[j].num)
                    }
                    if(res.obj[i].nameAndNum[j].type == 3){
                        type3.push(res.obj[i].nameAndNum[j].num)
                    }
                }
            }
            this.setState({
                key3: this.state.key3 + 1,
                option1:{
                        backgroundColor: 'transparent',
                        tooltip: {
                            backgroundColor: 'rgba(75,116,255,0.5)',
                            padding: [10, 15],
                            trigger: 'axis',
                            position: function(point){
                                let a = point[0]-100;
                                let b = point[1]-120;
                                if ((point[0]-100) < 0) {
                                    a = -(point[0]-100);
                                }
                                if ((point[1]-120) < 0) {
                                    b = -(point[1]-120);
                                }
                                //其中params为当前鼠标的位置
                                return [a,b];
                            },
                            formatter: function (params, ticket, callback) {
                                console.log(params);
                                var showHtm="";
                                let a = 0;
                                var title = params[a].name;
                                showHtm+= '<i style="width:8px;height:8px;border-radius:50%;border: 1px solid #fff;background-color: #4B74FF;display:inline-block;"></i> '+ title + '产能' + '<br>';
                                for(var i=0;i<params.length;i++){
                                    //名称
                                    var name = params[i].seriesName;
                                    //值
                                    var value = params[i].data;
                                    showHtm+= name + "：" + value+'<br>'
                                }
                                return showHtm;
                            },
                        },
                        grid: {
                            x: 50,
                            width: '66%'
                        },
                        legend: {
                            data:['销量','产量','耗电'],
                            bottom: 0,
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: dateArr,
                                axisPointer: {
                                    type: 'line',
                                    lineStyle: {
                                        color: '#4B74FF'
                                    }
                                },
                                splitLine: {
                                    show: false,
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: '#E0E0E0'
                                    }
                                },
                                axisLabel: {
                                    showMinLabel: true,
                                    showMaxLabel: true,
                                    show: true,
                                    // interval: 0,
                                    // rotate: 30,
                                    textStyle: {
                                        color: '#999999'
                                    }
                                },
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                name: '单位：吨',
                                axisLabel: {
                                    formatter: '{value}'
                                },
                                axisLine: {
                                    show: false,
                                    lineStyle: {
                                        color: '#999999'
                                    }
                                },
                                nameTextStyle: {
                                    color: '#666'
                                },
                                splitLine: {
                                    lineStyle: {
                                        color: '#E0E0E0'
                                    }
                                },
                            },
                            {
                                type: 'value',
                                name: '　　　单位：Kw/h',
                                axisLabel: {
                                    formatter: '{value}'
                                },
                                axisLine: {
                                    show: false,
                                    lineStyle: {
                                        color: '#999999'
                                    }
                                },
                                nameTextStyle: {
                                    color: '#666'
                                },
                                splitLine: {
                                    lineStyle: {
                                        color: '#E0E0E0'
                                    }
                                },
                            }
                        ],
                        series: [
                            {
                                name:'销量',
                                type:'bar',
                                silent: true,
                                data: type2,
                                itemStyle: {
                                    normal: {
                                        barBorderRadius: [10, 10, 0, 0],
                                        //颜色渐变
                                        color: {
                                            type: 'linear',
                                            x: 0,
                                            y: 0,
                                            x2: 0,
                                            y2: 1,
                                            colorStops: [{
                                                offset: 0,
                                                color: '#1ACFAA' // 0% 处的颜色
                                            }, {
                                                offset: 1,
                                                color: '#82F3DC' // 100% 处的颜色
                                            }],
                                            globalCoord: false // 缺省为 false
                                        }
                                    }
                                }
                            },
                            {
                                name:'产量',
                                type:'bar',
                                silent: true,
                                data: type1,
                                itemStyle: {
                                    normal: {
                                        barBorderRadius: [10, 10, 0, 0],
                                        //颜色渐变
                                        color: {
                                            type: 'linear',
                                            x: 0,
                                            y: 0,
                                            x2: 0,
                                            y2: 1,
                                            colorStops: [{
                                                offset: 0,
                                                color: '#566CF9' // 0% 处的颜色
                                            }, {
                                                offset: 1,
                                                color: '#7A95F7' // 100% 处的颜色
                                            }],
                                            globalCoord: false // 缺省为 false
                                        }
                                    }
                                }
                            },
                            {
                                name:'耗电',
                                type:'line',
                                yAxisIndex: 1,
                                silent: true,
                                data: type3,
                                symbol: 'circle',//折线点设置为实心点
                                symbolSize: 6,   //折线点的大小
                                itemStyle: {
                                    normal: {
                                        color: '#FF6E36',
                                        borderWidth: 1,
                                        borderColor: '#FFFFFF',
                                        lineStyle: {
                                            color: "#FF6E36"//折线的颜色
                                        }
                                    }
                                }
                            }
                        ]
                    }
            })
        }else{
            console.log('产能接口 ',res.msg)
        }
    }
    // 初次进入页面获取一些基础数据
    initData = () => {
        this.props.dispatch(getAllTroubleLevel());
        this.props.dispatch(getAllTroubleType());
        this.props.dispatch(getMessageInfo(this.props.fEmployeeId));
        this.props.dispatch(getAllUserName());
        this.props.dispatch(getSortname());
        this.props.dispatch(getUserIntegral());
        this.props.dispatch(getMeetingType());
        this.props.dispatch(getMeetingRoom());
        this.getYesterdayData();
        this.getSelectByPage();
        this.getSelectAll();
    }
    additionalCodePersonal = `
        window.detail = function() {
            var obj = {
            type: 'event_clicked',
            };
            sendData(JSON.stringify(obj));
        };
        // chart.on('legendunselected',function(selected){
        //     // this.chart.hideLoading();
        //     alert("111")
        //     legend = [];
        //     for ( name in selected) {
        //         if (selected.hasOwnProperty(name)) {
        //             legend.push({name: name});
        //         }
        //     }
        //     chart.dispatchAction({
        //         type: 'legendunselected',
        //         batch: legend
        //     });
        // });
    `;
    additionalCodeAccount = `
        window.detail = function() {
            var obj = {
            type: 'event_clicked',
            };
            sendData(JSON.stringify(obj));
        };
    `;

    onDataAccount = param => {
      const obj = JSON.parse(param);
      console.log('param1', param)
      if (obj.type === "event_clicked") {
        // this.props.navigation.push('WorkStatus');
      }
    };

    onDataPersonal = param => {
      const obj = JSON.parse(param);
      console.log('param', param)
      if (obj.type === "event_clicked") {
        this.props.navigation.push('WorkStatus');
      }
    };
    getColor =(num) => {
            
        if( num>=0&&num <=50 ) {
            return  '#1acfaa'
        }else if(num<=51&&num<=100){
            return  '#ff8747'
        }else if(num<=101&&num<=150){
            return  '#f63f0e'
        }else if(num<=151&&num<=200){
            return  '#f74747'
        }else if(num<=201&&num<=300){
            return  '#7338ed'
        }else{
            return  '#a91616'
        }
        
    }
    changePoint = () => {
        this.setState({
            modalVisible: true,
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <Header
                    leftBtn={
                        <TouchableOpacity style={[{marginLeft: 13,position: 'relative'}]} onPress={()=>this.props.navigation.navigate('Message')}>
                            <Image source={require('../../image/index/notification.png')}></Image>
                            {this.props.messageInfo ? <View style={styles.tipMsg}/> : null}
                            
                        </TouchableOpacity>
                    }
                    title={
                        // <ModalDropdown
                        //     options={[{text:'黄柏峪建筑石料矿',value: 1},{text: '朱辉砂石厂',value: 2},{text: '泸县飞洋砂石厂', value: 3}, {text: '水城县通运砂石厂', value: 4}]}
                        //     dropdownStyle={{borderWidth: 1,height: 100,marginTop: -12,marginLeft: -(width/3)}}
                        //     renderRow={(option,index,isSelected)=>{
                        //         return (
                        //             <TouchableOpacity style={styles.dropDownItem}>
                        //                 <Text>{option.text}</Text>
                        //             </TouchableOpacity>
                        //         )
                        //     }}
                        // >
                            <View style={[styles.headerTitle, {width: '100%',alignItems: 'center',justifyContent: 'center'}]}>
                                <Text style={[styles.fontText, {marginRight: 0}]}>黄柏峪建筑石料矿</Text>
                                <Image source={require('../../image/index/arrow-up.png')}></Image>
                            </View>
                        // </ModalDropdown>
                    }
                    centerStyle={{width: width/2}}
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
                                        this.setState({showPicker: false})
                                    }}
                                >
                                    <Text style={{ fontSize: 14, color: '#508DCE' ,marginLeft: 8}}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({showPicker: false})
                                    }}
                                >
                                <Text style={{ fontSize: 14, color: '#508DCE' ,marginRight: 8 }}>确定</Text>
                                </TouchableOpacity>
                            </View>
                            <Picker
                                style={{ width: width, height: 180 }}
                                itemStyle={{ color: 'black', fontSize: 16 }}
                            >
                                <Picker.Item label={'三号顶测点'} value={1}/>
                                <Picker.Item label={'中控测点'} value={2}/>
                                <Picker.Item label={'一号监测点'} value={3}/>
                            </Picker>
                        </View>
                    </View>
                </Modal>
                <ScrollView>
                    <View>
                    <View style={styles.topImage}>
                    </View>
                    <View style={styles.containers}>
                        <View style={[styles.myPanel, {marginTop: 15}]}>
                            <View style={styles.panelView}>
                                <TouchableOpacity style={[styles.panelDetail]} onPress={() => {this.props.navigation.push('ProductionManage')}}>
                                    <View style={styles.panelValue}>
                                        <Text style={[styles.textValue, {color: '#4B74FF',marginBottom: 5}]}>{this.state.yesterdayYield ? this.state.yesterdayYield : 0}</Text>
                                        <Text style={[styles.panelUnit, {color: '#4B74FF'}]}>万吨</Text>
                                    </View>
                                    <Text style={[styles.textKey]}>昨日产量</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.panelDetail} onPress={() => {this.props.navigation.push('ProductionManage'),{type: 1}}}>
                                    <View style={styles.panelValue}>
                                        <Text style={[styles.textValue, {color: '#1ACFAA',marginBottom: 5}]}>{this.state.yesterdaySales? this.state.yesterdaySales: 0}</Text>
                                        <Text style={[styles.panelUnit, {color: '#1ACFAA'}]}>万吨</Text>
                                    </View>
                                    <Text style={[styles.textKey]}>昨日销量</Text>
                                </TouchableOpacity>
                                <View style={styles.panelDetail}>
                                    <View style={styles.panelValue}>
                                        <Text style={[styles.textValue, {color: '#FC666C',marginBottom: 5}]}>0</Text>
                                        <Text style={[styles.panelUnit, {color: '#FC666C'}]}>起</Text>
                                    </View>
                                    <Text style={[styles.textKey]}>安全事故</Text>
                                </View>
                                <TouchableOpacity style={[styles.panelDetail,{borderRightWidth: 0}]} onPress={() => {this.props.navigation.push('Trouble')}}>
                                    <View style={styles.panelValue}>
                                        <Text style={[styles.textValue, {color: '#FF8747',marginBottom: 5}]}>{this.state.fAllNum?this.state.fAllNum:0}</Text>
                                        <Text style={[styles.panelUnit, {color: '#FF8747'}]}>件</Text>
                                    </View>
                                    <Text style={[styles.textKey]}>隐患</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.myPanel, {marginTop: 10}]}>
                            <View style={styles.panelTitle}>
                                <Text style={styles.panelTitleText}>产能</Text>
                                <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {this.props.navigation.push('ProductionManage')}}>
                                    <View style={[styles.selctView, {borderRadius: 5, borderWidth:0}]}>
                                        <Text style={{color: '#4B74FF'}}>详情</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{width: '100%',height: 300,webkitTapHighlightColor:'transparent'}}>
                                <ECharts key={this.state.key3} option={this.state.option1} style={{webkitTapHighlightColor:'transparent'}}/>
                            </View>
                        </View>
                        <View style={[styles.myPanel, {marginTop: 10}]}>
                            <View style={styles.panelTitle}>
                                <Text style={styles.panelTitleText}>设备</Text>
                                <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {this.props.navigation.push('DeviceManage')}}>
                                    <View style={[styles.selctView, {borderRadius: 5, borderWidth:0}]}>
                                        <Text style={{color: '#4B74FF'}}>详情</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{width: '100%',height: 300,webkitTapHighlightColor:'transparent'}}>
                                <ECharts option={this.state.option6} style={{webkitTapHighlightColor:'transparent'}}/>
                            </View>
                        </View>
                            {
                              this.state.obj.paramValue?
                                <View style={[styles.myPanel, {marginTop: 10}]}>
                                    <View style={styles.panelTitle}>
                                        <Text style={styles.panelTitleText}>环境</Text>
                                        <View style={{flexDirection: 'row'}}>  
                                                {this.state.manage.map((item,index) => {
                                                    return (<TouchableOpacity index={index}  style={{flexDirection: 'row',alignItems: "center", marginRight: 10}} onPress={()=>{this.setState({current: index});this.getControllerData(item.fId)}}>
                                                        <View style={[styles.changeBottom, index == this.state.current ?{backgroundColor:  "#1ACFAA" } : {backgroundColor:  "#c9c9c9" }]}>
                                                            <View style={{width: 4,height: 4,alignitems: "center",backgroundColor: "white",borderRadius:2}}></View>
                                                        </View>
                                                        <Text style={{color: index == this.state.current ? '#4B74FF' : '#c9c9c9',fontSize: 13}}>{item.fName}</Text>
                                                    </TouchableOpacity> )
                                                })} 
                                        </View>
                                    </View>
                                    <TouchableOpacity style={{width: '100%'}} onPress={() => {this.props.navigation.push('Environmental')}}>
                                        <View style={{width: "100%",paddingTop: 13,paddingBottom: 13, flexDirection: "row",backgroundColor: "#F6F6F6",borderRadius: 5,marginTop: 10}}>
                                            <View style={{alignItems: "center", justifyContent: "center",flex: 1,borderRightColor: "#FEFEFE",borderRightWidth: 1}}>
                                                <Text style={{color : this.getColor(45), fontSize: 18, fontWeight: "600"}}>{this.state.obj.paramValue[`pm2.5`] ? this.state.obj.paramValue[`pm2.5`].value: '--'}</Text>
                                                <Text style={{marginTop:8, color: "#666666",fontSize: 12}}>PM2.5</Text>
                                            </View>
                                            <View style={{alignItems: "center", justifyContent: "center",flex: 1}}>
                                                <Text style={{color : this.getColor(72) , fontSize: 18, fontWeight: "600"}}>{this.state.obj.paramValue[`pm10`] ? this.state.obj.paramValue[`pm10`].value: '--'}</Text>
                                                <Text style={{marginTop:8,color: "#666666" ,fontSize: 12}}>PM10</Text>
                                            </View>
                                        </View>
                                        <View style={{height: 40,flexDirection: "row", alignItems: "center",marginTop: 16}}>
                                            <View style={{flex: 1,alignItems: "center",justifyContent: "center",borderRightWidth:1,borderRightColor: "#F6F6F6"}}>
                                                <View style={{flexDirection: "row",marginBottom: 8, alignItems:"center",}}>
                                                    <Text style={styles.envirTxtNum}>{this.state.obj.paramValue[`噪音`] ? this.state.obj.paramValue[`噪音`].value: '--'}</Text>
                                                    <Text style={styles.envirTxtD}>dB</Text>
                                                </View>
                                                <Text style={styles.envirTxtNumW}>噪音</Text>
                                            </View>
                                            <View style={{flex: 1,alignItems: "center",justifyContent: "center",borderRightWidth:1,borderRightColor: "#F6F6F6"}}>
                                                <View style={{flexDirection: "row",marginBottom: 8, alignItems:"center"}}>
                                                    <Text style={styles.envirTxtNum}>{this.state.obj.paramValue[`温度`] ? this.state.obj.paramValue[`温度`].value: '--'}</Text>
                                                    <Text style={styles.envirTxtD}>℃</Text>
                                                </View>
                                                <Text style={styles.envirTxtNumW}>温度</Text>
                                            </View>
                                            
                                            <View style={{flex: 1,alignItems: "center",justifyContent: "center",borderRightWidth:1,borderRightColor: "#F6F6F6"}}>
                                                <View style={{flexDirection: "row",marginBottom: 8, alignItems:"center"}}>
                                                    <Text style={styles.envirTxtNum}>{this.state.obj.paramValue[`湿度`] ? this.state.obj.paramValue[`湿度`].value: '--'}</Text>
                                                    <Text style={styles.envirTxtD}>%</Text>
                                                </View>
                                                <Text style={styles.envirTxtNumW}>湿度</Text>
                                            </View>
                                            
                                            <View style={{flex: 1,alignItems: "center",justifyContent: "center"}}>
                                                <View style={{flexDirection: "row",marginBottom: 8, alignItems:"center"}}>
                                                    <Text style={styles.envirTxtNum}>{this.state.obj.paramValue[`风力`] ? this.state.obj.paramValue[`风力`].value: '--'}</Text>
                                                    <Text style={styles.envirTxtD}>级</Text>
                                                </View>
                                                <Text style={styles.envirTxtNumW}>风力</Text>
                                            </View>
                                        </View>
                                        <Text style={{color: "#666666", fontSize: 12,marginTop: 20,marginBottom:2}}>更新时间：{this.state.obj.recentReportTime ? parseDate(this.state.obj.recentReportTime, 'YYYY.MM.DD HH:mm'): '--'}</Text>
                                    </TouchableOpacity>
                                </View>
                              : null
                            }
                        

                        <View style={{marginTop: 10,backgroundColor:'#fff',borderRadius: 4}}>
                            <View style={[styles.panelTitle,{marginLeft: 15,marginRight: 15,marginTop: 15}]}>
                                <Text style={styles.panelTitleText}>隐患</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <View style={[styles.selctView, {borderBottomLeftRadius: 5,borderTopLeftRadius: 5,backgroundColor: '#4B74FF'}]}>
                                        <Text style={{color: '#fff'}}>统计</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.selctView, {borderBottomRightRadius: 5,borderTopRightRadius: 5,borderLeftWidth: 0}]}
                                        onPress={()=>{this.props.navigation.push('Map')}}
                                    >
                                        <Text style={{color: '#4B74FF'}}>区域</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <TouchableOpacity style={{width: "100%",height: 280,paddingBottom: 10}} onPress={() => {this.props.navigation.push('TroubleList')}}>
                                <View style={{position: "absolute",top: "38%",zIndex: 999,width: width - 30,alignItems: 'center'}}>
                                    <Text style={{fontSize: 10,color: '#999999'}}>隐患总数</Text>
                                    <View style={{flexDirection: "row",alignItems: "flex-end"}}>
                                        <Text style={{fontSize: 16,color: '#666666', fontWeight: "600"}}>{this.state.fAllNum? this.state.fAllNum: 0}</Text>
                                        <Text style={{fontSize: 10,color: '#666666'}}>件</Text>
                                    </View>
                                </View>
                                <ECharts key={this.state.key2} ref={ref=> this.charts2 = ref} option={this.state.option2}/>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.myPanel, {marginTop: 10}]}>
                            <View style={styles.panelTitle}>
                                <Text style={styles.panelTitleText}>风险</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <View style={[styles.selctView, {borderBottomLeftRadius: 5,borderTopLeftRadius: 5,backgroundColor: '#4B74FF'}]}>
                                        <Text style={{color: '#fff'}}>统计</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.selctView, {borderBottomRightRadius: 5,borderTopRightRadius: 5,borderLeftWidth: 0}]}
                                        onPress={()=>{this.props.navigation.push('Map')}}
                                    >
                                        <Text style={{color: '#4B74FF'}}>区域</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{width: '100%',height: 200}}>
                                <ECharts option={this.state.option3}/>
                            </View>
                        </View>

                        <View style={[styles.myPanel, {marginTop: 10}]}>
                            <View style={styles.panelTitle}>
                                <Text style={styles.panelTitleText}>事故</Text>
                                <View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{color: '#666666',fontSize: 13}}>今日无事故</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{width: '100%',height: 200}}>
                                <ECharts option={this.state.option4} additionalCode={this.additionalCodeAccount} onData={this.onDataAccount}/>
                            </View>
                        </View>
                        
                        <View style={[styles.myPanel, {marginTop: 10}]}>
                            <View style={styles.panelTitle}>
                                <Text style={styles.panelTitleText}>人员检查</Text>
                                <View>

                                </View>
                            </View>
                            <View style={{width: '100%',height: 200,tapHighlightColor: 'transparent',}}>
                                <ECharts option={this.state.option5} additionalCode={this.additionalCodePersonal} onData={this.onDataPersonal}/>
                            </View>
                        </View>
                    </View>
                    </View>
                </ScrollView>
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
export default connect(
    mapStateToProps,
)(App);
const styles = StyleSheet.create({
    staticView: {
        width: width - 20,
        height: 220,
        backgroundColor: '#fff'
      },
      titleTextWeight: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 16,
      },
      statisView: {
        flexDirection: 'row',
        borderRadius: 4
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
    modalStyle: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center'
      },
    selctView: {
        borderWidth: 1,
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 5,
        paddingRight: 3,
        borderColor: '#4B74FF',
        width: 40,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelView: {
        alignItems: 'center',
        flex: 1
    },
    panelTitleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000'
    },
    panelTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textValue: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textKey: {
        fontSize: 13,
        color: '#666'
    },
    line: {
        borderRightWidth: 1,
        borderRightColor: '#E9F4F7',
        height: 45
    },
    panelView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 70
    },
    panelValue: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    topImage: {
        width: '100%',
        height: 80,
        position: 'absolute',
        backgroundColor: '#486FFD'
    },
    panelUnit: {
        marginLeft: 2,
        marginBottom: 4,
        fontSize: 16,
        fontWeight: 'normal'
    },
    panelDetail: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    myPanel: {
        backgroundColor:'#fff',
        borderRadius: 4,
        padding: 15
    },
    containers: {
        width,
        padding: 15,
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
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
    dropDownItem: {
        paddingTop: 5,
        paddingBottom: 5,
        width,
        paddingRight: 10,
        paddingLeft: 10
    },
    fontText: {
        color: '#fff',
        fontSize: 15
    },
    headers: {
        backgroundColor: config.mainColor,
        paddingTop: isAndroid ? StatusBar.currentHeight : navStyle.paddingTop,
        borderBottomWidth: 2,
        borderBottomColor: '#c9c9c9',
        height: navStyle.height,
        display: 'flex',
        flexDirection: "row",
        width,
    },
    headerView: {
        width,
        borderWidth: 1,
        borderColor: 'red',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    envirTxtNum: {
        color: "#333",
        fontSize: 16,
        fontWeight: "600"
    },
    envirTxtD:{
        color: "#333",
        fontSize: 12
    },
    envirTxtNumW:{
        color: "#666666",
        fontSize: 12
    },
    changeBottom: {
        width: 10,
        height: 10,
        alignItems: "center",
        borderRadius:5,
        marginRight:5,
        justifyContent: "center"
    }
});
