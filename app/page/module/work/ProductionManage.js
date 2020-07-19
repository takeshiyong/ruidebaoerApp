import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, ImageBackground, Modal} from 'react-native';
import Header from '../../../components/header';
import DatePicker from 'react-native-datepicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import energyServer from '../../../service/energyServer';
import {ECharts} from 'react-native-echarts-wrapper';
import moment from 'moment';
import SplashScreen from 'react-native-splash-screen';
import Toast from '../../../components/toast';
import { parseTime,isDot } from '../../../utils/handlePhoto';

let data = [];
let num = [];
const {width, height} = Dimensions.get('window');
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            manage:["产量","销量"],//,"库存"
            manageS:["部门","规格"],
            nameList : ["防尘粉", "细粉","细沙", "AB料", "头破" , "成品渣" , "精05石" , "精12石","13石" , "24石" , "37石" , "05石" , "机制砂" , "12石"],
            valueList : [124500, 114500, 154500, 134500, 121500, 124300, 121500,111500,113500,100500,124500,124500,124500,124500],
            current: 0,
            currentMana: 1,
            showPicker: false,
            showPage1: false,
            showPage2: false,
            showPage3: false,
            currentDate1: moment(new Date().getTime()-2592000000).format("YYYY-MM-DD"),
            currentDate2: moment(new Date().getTime()).format("YYYY-MM-DD"),
            date1: moment(new Date().getTime()-2592000000).format("YYYY-MM-DD"),
            date2: moment(new Date().getTime()).format("YYYY-MM-DD"),
            obj: {},
            obj1:{},
            obj2: {},
            option : {},
            option1 : {},
            option2: {},
            option3: {},
            allNum: 0,
            allChanNum: 0
        };
      }

    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    componentDidMount(){
        SplashScreen.hide();
        this.getThroughput();
        this.salesVolume();
        this.getSalesVolumeStatistics();
        this.getOutPutStatistics();
        this.handleChangeGetStatistics();
        this.handleChange();
    }
    //柱状图图数据修改
    setEchersData = (res) => {
        let percentdata =[];
        for(let j=0; j< res.length;j++){
            percentdata.push((res[j] == null ? 0 : res[j]));
        }
        return percentdata
    }
    //扇形图所需数据修改
    genData = (nameList,valueList) => {
        let seriesData = [];
        for (let i = 0; i < nameList.length; i++) {
            seriesData.push({
                name: nameList[i],
                value: (valueList[i] == null ? 0 : valueList[i])
            });
        }
        
        return seriesData;
    }
    //产量概览接口
    getThroughput =  async () => {
        const res = await energyServer.getSurvey();
        if(res.success){
            this.setState({
                obj: res.obj,
            })
        }else{
            console.log('产量概览',res.msg)
            Toast.show(res.msg);
        }
    }
    //销量概览接口
    salesVolume = async () => {
        const res = await energyServer.getVolume();
        if(res.success){
            if (res.obj) {
                this.setState({
                    obj1: res.obj,
                });
            }
        }else{
            console.log('销量概览',res.msg);
            Toast.show(res.msg);
        }
    }
    dataChangeNum = (num) => {
        if (num.length > 8) {
            let arr1 = num.slice(0,8);
            let arr2 = num.slice(8);
            let number = 0;
            for(let i = 0; i<arr2.length; i++){
                number += arr2[i]
            }
            arr1.push(number);
            return arr1;
        } else {
            return num
        }
    }
    dataChangeType = (type) => {
        if(type.length > 8){
            let arr1 = type.slice(0,8);
            arr1.push("其他")
            return arr1;
        }else{
            return type
        }
    }
    //销量统计接口
    getSalesVolumeStatistics = async () => {
        const res = await energyServer.getSalesVolumeStatistics({
            code: this.state.currentMana+1,
            startTime:new Date( this.state.date1.replace(/-/g, '/')+ ' 00:00:00').getTime(),
            endTime: new Date( this.state.date2.replace(/-/g, '/')+ ' 23:59:59').getTime(),
        })
        if(res.success){
            if(res.obj.num.length !== 0&& res.obj.type.length !==0 ){
                let data = this.dataChangeType(res.obj.type);
                let num = this.dataChangeNum(res.obj.num);
                let seriesData =this.genData(data, num)
                let echersDate =this.setEchersData(num)
                
                
                this.setState({
                    showPage2 : true,
                    option2 : {
                        tooltip : {
                            trigger: 'item',
                            position: ['30%', '50%'],
                            backgroundColor: 'rgba(75,116,255,0.5)',
                            formatter: "{a} <br/>{b} : {c}"+"吨"+" ({d}%)"
                        },
                        legend: {
                            orient: 'horizontal',
                            bottom: 0,
                            data: data
                        },
                        
                        series : [
                            {
                                name: '销量',
                                type: 'pie',
                                radius : '43%',
                                center: ['50%', '45%'],
                                label: { 
                                    normal: { show: true,
                                    formatter: "{d}% \n {b}" } 
                            
                                },
                                labelLine:{
                                    length: 5,
                                    length2:5
                                },
                                data: seriesData,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    },
                                    color: function(params) {
                                        var colorList = [
                                            '#3EA3D8','#3DC5E7','skyblue','#9D98F2','#E6BDF2',
                                             '#E492D0','#DE65AD','#F97494','#FD9F82','#FEDA66',
                                            '#A1E5B9','#6CE0E2','#3DC5E7','#3EA3D8','#26C0C0'
                                        ];
                                         return colorList[params.dataIndex]
                                    },
                                }
                            }
                        ]
                    },
                    option3: {
                        color: ['#1c9a4c'],
                        tooltip : {
                            backgroundColor: 'rgba(75,116,255,0.5)',
                            trigger: 'item',
                            formatter: '销量'+"<br/>{b} : {c}"+ '吨',
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
                        },
                        grid: {
                          left: 20,
                          right: 25,
                          top: 30,
                          bottom: 0,
                          containLabel: true
                        },
                        yAxis: {
                          type: 'category',
                          data: data,
                          splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#E7E7E7'
                                }
                            },
                        
                            axisLine: {
                                lineStyle: {
                                    color: '#E0E0E0'
                                }
                            },
                            axisTick: {
                                show: false,
                                interval: 0
                            },
                            axisLabel: {
                                interval: 0,
                                show: true,
                                    textStyle: {
                                        color: '#999999'
                                    }
                            },
                        },
              
                        xAxis: [{
                            type: 'value',
                            splitLine:{
                                show:false
                              },
                            name: "单位:吨",
                            nameLocation: "start",
                            nameTextStyle:{
                              padding: [28,-5,0,0]
                            },
                            axisTick: {
                                show: false
                            },
                            axisLine:{
                                lineStyle:{
                                    color: '#E0E0E0'
                                  }
                            },
                            axisLabel: {

                                interval:'auto',
                                
                                rotate:50,
                                show: true,
                                textStyle: {
                                    color: '#999999'
                                    }
                                },
                        }],
                        series: [{
                          name: '销量',
                          type: 'bar',
                          barWidth: '55%',
                          
                          label: {
                            normal: {
                             
                              show: true,
                              position: 'insideLeft',
                              distance: 20,
                              formatter: '{c}',
                              textStyle: {
                                color: '#333'
                              },
                            },
                          },
                          
                          itemStyle: {
                              normal: {
                                  barBorderRadius: [0, 10, 10, 0],
                                  color: function(params) {
                                      // build a color map as your need.
                                      var colorList = [
                                        '#4B74FF','#98C0FD','#837BE7','#9D98F2','#E6BDF2',
                                         '#E492D0','#DE65AD','#F97494','#FD9F82','#FEDA66',
                                         '#A1E5B9','#6CE0E2','#3DC5E7','#3EA3D8','#26C0C0'
                                      ];
                                      return colorList[params.dataIndex]
                                  },
                              }
                          },
                          data:  echersDate
                        }]
                    },
                    allNum: res.obj.allNum
                },()=>{
                    if (this.onRef2 && this.onRef3) {
                        this.onRef2.setOption(this.state.option2)
                        this.onRef3.setOption(this.state.option3)
                    }
                });
            }else{
                this.setState({
                    showPage1: false})
            }
            
        }else{
            console.log('销量统计',res.msg)
            Toast.show(res.msg);
        }
    }
    //产量统计接口
    getOutPutStatistics = async () => {
        const res = await energyServer.getOutPutStatistics({
            code: this.state.currentMana+1,
            startTime: new Date( this.state.date1.replace(/-/g, '/')+ ' 00:00:00').getTime(),
            endTime: new Date( this.state.date2.replace(/-/g, '/')+' 23:59:59').getTime(),
        })
        
        if(res.success){
            if(res.obj.type.length !==0&& res.obj.num.length !==0){
                let data = this.dataChangeType(res.obj.type);
                let num = this.dataChangeNum(res.obj.num);
                let seriesData =this.genData(data,num)
                let echersDate =this.setEchersData(num)
                this.setState({
                    showPage1: true,
                    option: {
                        tooltip : {
                            trigger: 'item',
                            position: ['30%', '50%'],
                            backgroundColor: 'rgba(75,116,255,0.5)',
                            formatter: "{a} <br/>{b} : {c}"+"吨"+" ({d}%)"
                        },
                        legend: {
                            orient: 'horizontal',
                            bottom: 0,
                            data: data
                        },
                        
                        series : [
                            {
                                name: '产量',
                                type: 'pie',
                                radius : '40%',
                                center: ['50%', '45%'],
                                label: { 
                                    normal: { show: true,
                                    formatter: "{d}% \n {b}" } 
                            
                                },
                                labelLine:{
                                    length: 5,
                                    length2:5
                                },
                                data: seriesData,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    },
                                    color: function(params) {
                                        var colorList = [
                                            '#3EA3D8','#3DC5E7','skyblue','#9D98F2','#E6BDF2',
                                             '#E492D0','#DE65AD','#F97494','#FD9F82','#FEDA66',
                                            '#A1E5B9','#6CE0E2','#3DC5E7','#3EA3D8','#26C0C0'
                                        ];
                                         return colorList[params.dataIndex]
                                    },
                                }
                            }
                        ]
                    },
                    option1: {
                        color: ['#1c9a4c'],
                        grid: {
                          left: 20,
                          right: 20,
                          top: 30,
                          bottom: 0,
                          containLabel: true
                        },
                        tooltip : {
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
                            backgroundColor: 'rgba(75,116,255,0.5)',
                            trigger: 'item',
                            formatter: '产量'+"<br/>{b} : {c}"+ '吨'
                        },
                        yAxis: {
                          type: 'category',
                          data: data,
                          splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#E7E7E7'
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#E0E0E0'
                                }
                            },
                            axisTick: {
                                show: false,
                                interval: 0
                            },
                            axisLabel: {
                                interval: 0,
                                show: true,
                                textStyle: {
                                    color: '#999999'
                                }
                          },
                          splitLine:{
                              show:true
                          },
                          
                        },
              
                        xAxis: [{
                          type: 'value',
                          splitLine:{
                              show:false
                            },
                          name: "单位:吨",
                          nameLocation: "start",
                          nameTextStyle:{
                            padding: [28,-5,0,0]
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
                                interval:'auto',
                                rotate:50,
                                show: true,
                                textStyle: {
                                    color: '#999999'
                                }
                            },
                        }],
                        series: [{
                          name: '销量',
                          type: 'bar',
                          barWidth: '55%',
                          
                          label: {
                            normal: {
                             
                              show: true,
                              position: 'insideLeft',
                              distance: 20,
                              formatter: '{c}',
                              textStyle: {
                                color: '#333'
                              }
                            },
                          },
                          
                          itemStyle: {
                              normal: {
                                  barBorderRadius: [0, 10, 10, 0],
                                  color: function(params) {
                                      // build a color map as your need.
                                      var colorList = [
                                        '#4B74FF','#98C0FD','#837BE7','#9D98F2','#E6BDF2',
                                         '#E492D0','#DE65AD','#F97494','#FD9F82','#FEDA66',
                                         '#A1E5B9','#6CE0E2','#3DC5E7','#3EA3D8','#26C0C0'
                                      ];
                                      return colorList[params.dataIndex]
                                  },
                              }
                          },
                          data: echersDate
                        }]
                      },
                      allChanNum: res.obj.allNum
                },() => {
                        if (this.onRef && this.onRef1) {
                            this.onRef.setOption(this.state.option)
                            this.onRef1.setOption(this.state.option1)
                        }
                })
            }else{
                this.setState({
                    showPage2: false})
            }
            
            
        }else{
            console.log('产量统计',res.msg)
            Toast.show(res.msg);
        }
        
    }
    //产量组件
    chanConponents = () => {
        const {obj} = this.state;
        return <View>
            <View style={styles.content}>
                <Text style={{fontSize: 16,color: "#333", fontWeight: "600",marginTop: 22,marginBottom: 15}}>产量概览</Text>
                <View style={styles.conBox}>
            <View style={styles.conBoxItem}>
                
                <Text style={[styles.conBoxBText,{color: obj.growy > 0 ? "#1ACFAA" : "#FF632E"}]}>{obj.growy ? isDot(obj.growy) : "--"}%</Text>
                <Text style={styles.conBoxSText}>同比增长</Text>
            </View>
            <View style={styles.conBoxItem}>
                <View style={{flexDirection: "row",alignItems: "center"}}>
                    <Text style={[styles.conBoxBText,{color: "#333333"}]}>{obj.yesterdayYield ? isDot(obj.yesterdayYield) : '--'}</Text><Text style={{fontSize: 12,color: "#333333",marginLeft: 4}}>吨</Text>
                </View>
                <Text style={styles.conBoxSText}>昨日产量</Text>
            </View>
            <View style={styles.conBoxItem}> 
                <Text style={[styles.conBoxBText,{color: obj.planningCompletionRate < 100 ? "#FF632E" : "#1ACFAA"}]}>{ obj.planningCompletionRate ? isDot(obj.planningCompletionRate) : "--"}%</Text>
                <Text style={styles.conBoxSText}>计划完成率</Text>
            </View>
        </View>
                <View style={styles.conBoxItems}>
            <View style={[styles.conBoxItem,{height: 40}]}>
                <View style={{flexDirection: "row",alignItems: "center"}}>
                    <Text style={styles.conBoxBText}>{obj.realTimeProduction ? isDot(obj.realTimeProduction) : '--'}</Text>
                    <Text style={styles.conBoxNBText}>吨/h</Text>
                </View>
                <Text style={styles.conBoxSText}>实时产量</Text>
            </View >
            <View style={[styles.conBoxItem,{borderLeftWidth: 1,height: 40,borderRightWidth: 1,borderColor: "#E0E0E0"}]}>
                <View style={{flexDirection: "row",alignItems: "center"}}>
                    <Text style={styles.conBoxBText}>{obj.daysNumber ? isDot(obj.daysNumber) : '--'}</Text>
                    <Text style={styles.conBoxNBText}>天</Text>
                </View>
                <Text style={styles.conBoxSText}>累计生产天数</Text>
            </View>
            <View style={[styles.conBoxItem,{height: 40}]}>
                <View style={{flexDirection: "row",alignItems: "center"}}>
                    <Text style={styles.conBoxBText}>{obj.peopleDailyProduction ? isDot(obj.peopleDailyProduction) : '--'}</Text>
                    <Text style={styles.conBoxNBText}>吨</Text>
                </View>
                <Text style={[styles.conBoxSText]}>人均日产量</Text>
            </View>
        </View>
                <View style={{justifyContent: "space-between", flexDirection: "row", marginTop: 18,marginBottom: 24}}>
            <View style={[styles.conBoxItem,{height: 40,borderRightWidth: 1,borderColor: "#E0E0E0"}]}>
                <View style={{flexDirection: "row",alignItems: "center"}}>
                    <Text style={styles.conBoxBText}>{obj.cumulativeOutput ? isDot(obj.cumulativeOutput/10000) : '--'}</Text>
                    <Text style={styles.conBoxNBText}>万吨</Text>
                </View>
                <Text style={[styles.conBoxSText]}>累计产量</Text>
            </View>
            <View style={[styles.conBoxItem,{height: 40}]}>
                <View style={{flexDirection: "row",alignItems: "center"}}>
                    <Text style={styles.conBoxBText}>{obj.averageDailyYield ? isDot(obj.averageDailyYield) : '--'}</Text>
                    <Text style={styles.conBoxNBText}>吨</Text>
                </View>
                <Text style={[styles.conBoxSText]}>日均产量</Text>
            </View>
        </View>
            </View>
            {this.state.showPage1
                        ?
                        <View style={styles.content}>
                        <View style={{marginTop: 15,marginBottom: 15,flexDirection: "row",alignItems: "center",justifyContent: "space-between"}}>
                            
                            {this.state.current == 0 ? 
                            <Text style={{fontSize: 16,color: "#333", fontWeight: "600"}}>产量统计</Text>: null}
                            {this.state.current == 1 ? 
                            <Text style={{fontSize: 16,color: "#333", fontWeight: "600"}}>销量统计</Text>: null}
                            {this.state.current == 2 ? 
                            <Text style={{fontSize: 16,color: "#333", fontWeight: "600"}}>库存统计</Text>: null}
                            <TouchableOpacity style={{flexDirection: "row",alignItems: "flex-end"}} onPress = {() =>{this.setState({showPicker: true})}}>
                                <View style={{flexDirection: "row",alignItems: "center"}}>
                                    <Text style={{color: "#4B74FF" }}>{this.state.date1}</Text>
                                    <AntDesign name="minus" color="#4B74FF"/>
                                    <Text style={{color: "#4B74FF"}}>{this.state.date2}</Text>
                                </View>
                                <Entypo name="controller-volume" color="#4B74FF" style={{marginLeft: 5}}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection: "row",alignItems: "center",justifyContent: "space-between"}}>
                            <Text style={{fontSize: 14,color: "#333"}}>总产量: {this.state.allChanNum?this.state.allChanNum:0}吨</Text>
                            <View style={{flexDirection: 'row',borderWidth: 1,borderColor: '#4B74FF'}}>
                                {this.state.manageS.map((item,index) => {
                                    return <TouchableOpacity index={index} onPress={() => {this.setState({currentMana: index},() => this.handleChangeGetStatistics())} }>
                                        <View style={[styles.selctView,index == this.state.currentMana ? {backgroundColor: '#4B74FF'}:{backgroundColor: '#fff'}]}>
                                            <Text style={[styles.barText,index == this.state.currentMana ? {color: '#fff'}:{color: '#4B74FF'}]}>{item}</Text>
                                        </View>
                                    </TouchableOpacity>
                                })}
                            </View>
                        </View>
                        <View style={{width: '100%',height: 500}}>
                            <ECharts option={this.state.option1} ref={ref => this.onRef1 = ref}/>
                        </View>
                        <View style={{width: '100%',height: 350,marginBottom: 10}}>
                            <ECharts option={this.state.option} ref={ref => this.onRef = ref}/>
                        </View>
                    </View>
                        :
                        null
                    }
    </View>
    }
    //销量组件
    xiaoConponents = () => {
        const {obj1} = this.state;
        return <View>
                    <View style={styles.content}>
                        <Text style={{fontSize: 16,color: "#333", fontWeight: "600",marginTop: 22,marginBottom: 15}}>销量概览</Text>
                        <View style={styles.conBox}>
            <View style={styles.conBoxItem}>
                
                <Text style={[styles.conBoxBText,{color: obj1.yearOnYearGrowth > 0 ? "#1ACFAA" : "#FF632E"}]}>{obj1.yearOnYearGrowth?isDot(obj1.yearOnYearGrowth): '--'}%</Text>
                <Text style={styles.conBoxSText}>同比增长</Text>
            </View>
            <View style={styles.conBoxItem}>
                <View style={{flexDirection: "row",alignItems: "center"}}>
                    <Text style={[styles.conBoxBText,{color: "#333333"}]}>{obj1.yesterdaySales ? isDot(obj1.yesterdaySales) : '--'}</Text><Text style={{fontSize: 12,color: "#333333",marginLeft: 4}}>吨</Text>
                </View>
                <Text style={styles.conBoxSText}>昨日销量</Text>
            </View>
            <View style={styles.conBoxItem}> 
                <Text style={[styles.conBoxBText,{color: obj1.PlanningCompletionRate < 100 ? "#FF632E" : "#1ACFAA"}]}>{obj1.PlanningCompletionRate?isDot(obj1.PlanningCompletionRate):'--'}%</Text>
                <Text style={styles.conBoxSText}>计划完成率</Text>
            </View>
        </View>
                        <View style={styles.conBoxItems}>
            <View style={[styles.conBoxItem,{height: 40,borderRightWidth: 1,borderColor: "#E0E0E0"}]}>
                <View style={{flexDirection: "row",alignItems: "center"}}>
                    <Text style={styles.conBoxBText}>{obj1.averageDailySales ? isDot(obj1.averageDailySales) : '--'}</Text>
                    <Text style={styles.conBoxNBText}>吨</Text>
                </View>
                <Text style={styles.conBoxSText}>日均销量</Text>
            </View >
            <View style={[styles.conBoxItem,{height: 40}]}>
                <View style={{flexDirection: "row",alignItems: "center"}}>
                    <Text style={styles.conBoxBText}>{obj1.perCapitaDailySales ? isDot(obj1.perCapitaDailySales) : '--'}</Text>
                    <Text style={styles.conBoxNBText}>吨</Text>
                </View>
                <Text style={[styles.conBoxSText]}>人均日销量</Text>
            </View>
        </View>
                        <View style={{justifyContent: "space-between", flexDirection: "row", marginTop: 18,marginBottom: 24}}>
            <View style={[styles.conBoxItem,{height: 40,borderRightWidth: 1,borderColor: "#E0E0E0"}]}>
                <View style={{flexDirection: "row",alignItems: "center"}}>
                    <Text style={styles.conBoxBText}>{obj1.cumulativeSales ? isDot(obj1.cumulativeSales/10000) : '--'}</Text>
                    <Text style={styles.conBoxNBText}>万吨</Text>
                </View>
                <Text style={[styles.conBoxSText]}>累计销量</Text>
            </View>
            <View style={[styles.conBoxItem,{height: 40}]}>
                <View style={{flexDirection: "row",alignItems: "center"}}>
                    <Text style={styles.conBoxBText}>{obj1.weeklySalesToProductionRatio ? obj1.weeklySalesToProductionRatio : '--'}%</Text>
                </View>
                <Text style={[styles.conBoxSText]}>周销产比</Text>
            </View>
        </View>
                    </View>
                {this.state.showPage2
                        ?
                        <View style={styles.content}>
                        <View style={{marginTop: 15,marginBottom: 15,flexDirection: "row",alignItems: "center",justifyContent: "space-between"}}>
                            
                            {this.state.current == 0 ? 
                            <Text style={{fontSize: 16,color: "#333", fontWeight: "600"}}>产量统计</Text>: null}
                            {this.state.current == 1 ? 
                            <Text style={{fontSize: 16,color: "#333", fontWeight: "600"}}>销量统计</Text>: null}
                            {this.state.current == 2 ? 
                            <Text style={{fontSize: 16,color: "#333", fontWeight: "600"}}>库存统计</Text>: null}
                            <TouchableOpacity style={{flexDirection: "row",alignItems: "flex-end"}} onPress = {() =>{this.setState({showPicker: true})}}>
                                <View style={{flexDirection: "row",alignItems: "center"}}>
                                    <Text style={{color: "#4B74FF" }}>{this.state.date1}</Text>
                                    <AntDesign name="minus" color="#4B74FF"/>
                                    <Text style={{color: "#4B74FF"}}>{this.state.date2}</Text>
                                </View>
                                <Entypo name="controller-volume" color="#4B74FF" style={{marginLeft: 5}}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection: "row",alignItems: "center",justifyContent: "space-between"}}>
                            <Text style={{fontSize: 14,color: "#333"}}>总产量: {this.state.allNum ? this.state.allNum : 0}吨</Text>
                            <View style={{flexDirection: 'row',borderWidth: 1,borderColor: '#4B74FF'}}>
                                {this.state.manageS.map((item,index) => {
                                    return <TouchableOpacity index={index} onPress={() => {this.setState({currentMana: index},() => this.handleChangeGetStatistics())} }>
                                        <View style={[styles.selctView,index == this.state.currentMana ? {backgroundColor: '#4B74FF'}:{backgroundColor: '#fff'}]}>
                                            <Text style={[styles.barText,index == this.state.currentMana ? {color: '#fff'}:{color: '#4B74FF'}]}>{item}</Text>
                                        </View>
                                    </TouchableOpacity>
                                })}
                            </View>
                        </View>
                        <View style={{width: '100%',height: 500}}>
                            <ECharts option={this.state.option3} ref={ref => this.onRef3 = ref}/>
                        </View>
                        <View style={{width: '100%',height: 350,marginBottom: 10}}>
                            <ECharts option={this.state.option2} ref={ref => this.onRef2 = ref}/>
                        </View>
                    </View>
                        :
                        null
                    }
    
    </View>
    }
    // //库存组件
    // kuConponents = () => {
    //     const {obj2} = this.state;
    //     return <View>
    //             <View style={styles.content}>
    //                 <Text style={{fontSize: 16,color: "#333", fontWeight: "600",marginTop: 22,marginBottom: 15}}>库存概览</Text>
    //                 <View style={styles.conBox}>
    //         <View style={styles.conBoxItem}>
                
    //             <Text style={[styles.conBoxBText,{color: obj2.rise > 1 ? "#1ACFAA" : "#FF632E"}]}>{obj2.rise ? isDot(obj2.rise) : '--'}%</Text>
    //             <Text style={styles.conBoxSText}>同比增长</Text>
    //         </View>
    //         <View style={styles.conBoxItem}>
    //             <View style={{flexDirection: "row",alignItems: "center"}}>
    //                 <Text style={[styles.conBoxBText,{color: "#333333"}]}>{obj2.yesterday ? isDot(obj2.yesterday/10000) : '--'}</Text><Text style={{fontSize: 12,color: "#333333",marginLeft: 4}}>吨</Text>
    //             </View>
    //             <Text style={styles.conBoxSText}>昨日产量</Text>
    //         </View>
    //         <View style={styles.conBoxItem}> 
    //             <Text style={[styles.conBoxBText,{color: obj2.rate < 100 ? "#FF632E" : "#1ACFAA"}]}>{obj2.rate ? isDot(obj2.rate) : "--"}%</Text>
    //             <Text style={styles.conBoxSText}>计划完成率</Text>
    //         </View>
    //     </View>
    //                 <View style={{justifyContent: "space-between", flexDirection: "row", marginTop: 18,marginBottom: 24}}>
    //         <View style={[styles.conBoxItem,{height: 40,borderRightWidth: 1,borderColor: "#E0E0E0"}]}>
    //             <View style={{flexDirection: "row",alignItems: "center"}}>
    //                 <Text style={styles.conBoxBText}>{obj2.cumulativeOutput ? isDot(obj2.cumulativeOutput) : '--'}</Text>
    //             </View>
    //             <Text style={[styles.conBoxSText]}>周库销比</Text>
    //         </View>
    //         <View style={[styles.conBoxItem,{height: 40}]}>
    //             <View style={{flexDirection: "row",alignItems: "center"}}>
    //                 <Text style={styles.conBoxBText}>{obj2.cumulativeOutput ? isDot(obj2.cumulativeOutput) : '--'}</Text>
    //             </View>
    //             <Text style={[styles.conBoxSText]}>周库产比</Text>
    //         </View>
    //     </View>
    //             </View>
    //         {this.state.showPage3
    //                     ?
    //                     <View style={styles.content}>
    //                     <View style={{marginTop: 15,marginBottom: 15,flexDirection: "row",alignItems: "center",justifyContent: "space-between"}}>
                            
    //                         {this.state.current == 0 ? 
    //                         <Text style={{fontSize: 16,color: "#333", fontWeight: "600"}}>产量统计</Text>: null}
    //                         {this.state.current == 1 ? 
    //                         <Text style={{fontSize: 16,color: "#333", fontWeight: "600"}}>销量统计</Text>: null}
    //                         {this.state.current == 2 ? 
    //                         <Text style={{fontSize: 16,color: "#333", fontWeight: "600"}}>库存统计</Text>: null}
    //                         <TouchableOpacity style={{flexDirection: "row",alignItems: "flex-end"}} onPress = {() =>{this.setState({showPicker: true})}}>
    //                             <View style={{flexDirection: "row",alignItems: "center"}}>
    //                                 <Text style={{color: "#4B74FF" }}>{this.state.date1}</Text>
    //                                 <AntDesign name="minus" color="#4B74FF"/>
    //                                 <Text style={{color: "#4B74FF"}}>{this.state.date2}</Text>
    //                             </View>
    //                             <Entypo name="controller-volume" color="#4B74FF" style={{marginLeft: 5}}/>
    //                         </TouchableOpacity>
    //                     </View>
    //                     <View style={{flexDirection: "row",alignItems: "center",justifyContent: "space-between"}}>
    //                         <Text style={{fontSize: 14,color: "#333"}}>总产量: 17850021吨</Text>
    //                         <View style={{flexDirection: 'row',borderWidth: 1,borderColor: '#4B74FF'}}>
    //                             {this.state.manageS.map((item,index) => {
    //                                 return <TouchableOpacity index={index} onPress={() => {this.setState({currentMana: index},() => this.handleChangeGetStatistics())} }>
    //                                     <View style={[styles.selctView,index == this.state.currentMana ? {backgroundColor: '#4B74FF'}:{backgroundColor: '#fff'}]}>
    //                                         <Text style={[styles.barText,index == this.state.currentMana ? {color: '#fff'}:{color: '#4B74FF'}]}>{item}</Text>
    //                                     </View>
    //                                 </TouchableOpacity>
    //                             })}
    //                         </View>
    //                     </View>
    //                     <View style={{width: '100%',height: 500}}>
    //                         <ECharts option={this.state.option1}/>
    //                     </View>
    //                     <View style={{width: '100%',height: 400,marginBottom: 10}}>
    //                         <ECharts option={this.state.option}/>
    //                     </View>
    //                 </View>
    //                     :
    //                     null
    //                 }
    // </View>
    // }
    //点击调用不同接口
    handleChange = () => {
        if(this.state.current == 0){
            this.getThroughput()
            this.getOutPutStatistics()
        }else if(this.state.current == 1){
            this.salesVolume()
            this.getSalesVolumeStatistics()
        }else {
            return null;
        }
    }
    //点击时间确定不同的接口
    handleChangeGetStatistics = () => {
        if(this.state.current == 0){
            this.getOutPutStatistics()
        }else if(this.state.current == 1){
            this.getSalesVolumeStatistics()
        }else {
            null
        }
    }
    render() {
        const { pop } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header
                    backBtn={true}
                    titleText="产销管理"
                    props={this.props}
                    isMine={true}
                />
                    <View style={styles.tabBar}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={styles.tabBarCon}>
                                {this.state.manage.map((item,index) => {
                                    return <TouchableOpacity style={{flex: 1,justifyContent: "center",alignItems: "center"}} index={index} onPress={() => {this.setState({current: index},() => this.handleChange())} }>
                                        <View style={[styles.barView,index == this.state.current ? {borderBottomColor: "#4058FD"}:{borderBottomColor: "#fff"}]}>
                                            <Text style={[styles.barText,index == this.state.current ? {color: "#333"}:{color: "#999"}]}>{item}</Text>
                                        </View>
                                    </TouchableOpacity>
                                })}
                            </View>
                        </ScrollView>
                    </View>
                <ScrollView style={{paddingRight: 16,paddingLeft: 16,}}>
                    
                    {this.state.current == 0 ? 
                    this.chanConponents(): null}
                    {this.state.current == 1 ? 
                    this.xiaoConponents(): null}
                    
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
                                            this.setState({showPicker: false,date1: this.state.currentDate1,date2: this.state.currentDate2},
                                                () => {this.handleChangeGetStatistics()})
                                    }}
                                    >
                                    <Text style={{ fontSize: 14, color: '#508DCE' ,marginRight: 8 }}>确定</Text>
                                </TouchableOpacity>
                                </View>
                                    <View style={styles.selectModalData}>
                                        <Text style={{color: "black"}}>请选择开始时间</Text>
                                        <DatePicker
                                            style={{width: 160,marginLeft: -35}}
                                            date={this.state.currentDate1}
                                            mode="date"
                                            placeholder="请选择开始时间"
                                            format="YYYY-MM-DD"
                                            confirmBtnText="确定"
                                            cancelBtnText="取消"
                                            maxDate={this.state.currentDate2}
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
                                                    color: '#4B74FF'
                                                },
                                                placeholderText: {
                                                    color: '#4B74FF'
                                                }
                                            }}
                                            iconComponent={<AntDesign name="right" color="#4B74FF"/>}
                                            onDateChange={(date) => {this.setState({currentDate1: date})}}
                                        />
                                    </View>
                                    <View style={styles.selectModalData}>
                                        <Text style={{color: "black"}}>请选择结束时间</Text>
                                        <DatePicker
                                            style={{width: 160,marginLeft: -35}}
                                            date={this.state.currentDate2}
                                            mode="date"
                                            minDate={this.state.currentDate1}
                                            placeholder="请选择结束时间"
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
                                                    color: '#4B74FF'
                                                },
                                                placeholderText: {
                                                    color: '#4B74FF'
                                                }
                                            }}
                                            iconComponent={<AntDesign name="right" color="#4B74FF"/>}
                                            onDateChange={(date) => {this.setState({currentDate2: date})}}
                                        />
                                    </View>
                                </View>
                            </View>
                    </Modal>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
    },
    tabBar: {
        width: "100%",
        height: 44,
        backgroundColor: "#fff",
        
    },
    tabBarCon: {
        display: "flex", 
        width:width,
        
        flexDirection:"row",
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: "space-between"
    },
    barView: {
        height: 44,
        borderBottomWidth: 1,
        width: "100%",
        alignItems: "center"
    },
    barText: { 
        lineHeight: 44, 
        fontSize: 14, 
        height: 44,
        fontWeight: "500",
        width: 48,
        textAlign: "center",
        
    },
    //content
    content: {
        paddingLeft: 12,
        paddingRight: 12,
        marginTop: 10,
        backgroundColor: "#fff",
        borderRadius: 5
    },
    conBox:{
        flexDirection: "row",
        backgroundColor: "#F6F6F6",
        justifyContent: "space-between", 
        height: 72,
        alignItems: "center",
        paddingRight: 12,
        paddingLeft: 12,
        borderRadius: 6,
    },
    conBoxBText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333"
    },
    conBoxNBText:{
        fontSize: 12,
        color: "#333"
    },
    conBoxSText:{
        fontSize: 12,
        color: "#666666",
        marginTop: 8
    },
    conBoxItems: {
        flexDirection: "row",
        marginTop: 16, 
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1,
        justifyContent: "space-between",
        paddingBottom: 20,
    },
    conBoxItem: {
        flex: 1,
        alignItems: "center"
    },
    selctView: {
        
        paddingLeft: 5,
        paddingRight: 3,
        flex: 1,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
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
    selectModalData:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 20, 
        paddingRight: 20
    }
});
