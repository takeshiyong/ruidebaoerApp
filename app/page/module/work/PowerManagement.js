import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, ImageBackground, Modal} from 'react-native';
import Header from '../../../components/header';
import DatePicker from 'react-native-datepicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import energyServer from '../../../service/energyServer';
import {ECharts} from 'react-native-echarts-wrapper';
import moment from 'moment';
import Toast from '../../../components/toast';
import { parseTime,isDot } from '../../../utils/handlePhoto';

var nameList  = ["防尘粉", "细粉","细沙", "AB料", "头破" , "成品渣" , "精05石" , "精12石","13石" , "24石" , "37石" , "05石" , "机制砂" , "12石"];
var valueList = [124500, 114500, 154500, 134500, 121500, 124300, 121500,111500,113500,100500,124500,124500,124500,124500];
 
const {width, height} = Dimensions.get('window');
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameList : ["防尘粉", "细粉","细沙", "AB料", "头破" , "成品渣" , "精05石" , "精12石","13石" , "24石" , "37石" , "05石" , "机制砂" , "12石"],
            valueList : [124500, 114500, 154500, 134500, 121500, 124300, 121500,111500,113500,100500,124500,124500,124500,124500],
            showPicker: false,
            currentDate1: moment(new Date().getTime()-2592000000).format("YYYY-MM-DD"),
            currentDate2: moment(new Date().getTime()).format("YYYY-MM-DD"),
            date1: moment(new Date().getTime()-2592000000).format("YYYY-MM-DD"),
            date2: moment(new Date().getTime()).format("YYYY-MM-DD"),
            obj: {},
            allNum: 0,
            option:{},
            option1: {},
            pm: {}
        };
      }

    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    componentDidMount(){
        this.getThroughput();
        this.getOutPutStatistics();

    }
    //扇形图所需数据修改
    genData = (workshop,num) => {
        workshop.length !== 0 ? workshop : [0,0,0,0]
        num.length !==0 ? num : [0,0,0,0]
        var seriesData = [];
        for (var i = 0; i < workshop.length; i++) {
            seriesData.push({
                name: workshop[i],
                value: num[i]
            });
        }
        return seriesData;
    }
    //耗电概览接口
    getThroughput =  async () => {
            global.loading.show();
            const res = await energyServer.getEnergy();
            global.loading.hide();
            if(res.success){
                this.setState({
                    obj: res.obj,
                })
            }else{
                console.log('耗电概览',res.msg)
                Toast.show(res.msg);
            }
    }
    dataChangeNum = (num) => {
        console.log(111111111111111111111111111111,num)
        if(num.length > 8){
            let arr1 = num.slice(0,8);
            let arr2 = num.slice(8);
            let number = 0;
            for(let i = 0; i<arr2.length; i++){
                number += arr2[i]
            }
            arr1.push(number);
            return arr1;
        }else{
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
    dataChangeDate = (data) => {
        let arr = [];
        for(let i = 0; i< data.length; i++){
            arr.push(data[i].date)
        }
        return arr;
    }
    dataChangeNum = (data) => {
        let num = []
        for(let i = 0; i< data.length; i++){
            num.push({
                'value': data[i].num
            })
        }
        return num
    }
    changeDataToFixed = (data) =>{
        let num = []
        for(let i = 0; i< data.length; i++){
            num.push(data[i])
        }
        return num
    }
    getOutPutStatistics = async () => {
        global.loading.show();
        Promise.all([
            energyServer.getConsume({code:1,startTime: new Date( this.state.date1.replace(/-/g, '/')).getTime(),endTime: new Date( this.state.date2.replace(/-/g, '/')).getTime()}),
            energyServer.getConsumeByTime({code:1,startTime: new Date( this.state.date1.replace(/-/g, '/')).getTime(),endTime: new Date( this.state.date2.replace(/-/g, '/')).getTime()})
        ]).then((result) => {
            global.loading.hide();
            console.log(result)
            if(result[0].success){
                let workshop = result[0].obj.workshop;
                let num = result[0].obj.num;
                let allNum = result[0].obj.allNum;
                this.setState({
                    option:{
                        tooltip : {
                            backgroundColor: 'rgba(75,116,255,0.5)',
                            trigger: 'item',
                            formatter: "{a} <br/>{b}: {c}"+"kw.h ({d}%)",
                            position: ['30%', '50%'],
                        },
                        legend: {
                            orient: 'horizontal',
                            bottom: 0,
                            data: workshop
                        },
                        
                        series : [
                            {
                                name: '耗电量',
                                type: 'pie',
                                radius : '40%',
                                center: ['50%', '50%'],
                                label: { 
                                    normal: { show: true,
                                    formatter: "{d}% \n {b}" } 
                            
                                },
                                labelLine:{
                                    length: 5,
                                    length2:5
                                },
                                data: this.genData(workshop,num),
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
                    option1:{
                        color: ['#3398DB'],
                        tooltip : {
                            position: ['30%', '50%'],
                            backgroundColor: 'rgba(75,116,255,0.5)',
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            },
                            formatter: "{a} <br/>{b} : {c} "+"kw.h"

                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis : [
                            {
                                type : 'category',
                                data : workshop,
                                axisPointer: {
                                    type: 'line',
                                    lineStyle: {
                                        color: '#4B74FF'
                                    }
                                },
                                splitLine: {
                                    show: true,
                                    lineStyle: {
                                        color: '#E7E7E7'
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
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                splitLine: {
                                    show: true,
                                    lineStyle: {
                                        color: '#E7E7E7'
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
                            
                        ],
                        series : [
                            {
                                name:'耗电量',
                                type:'bar',
                                barWidth: '60%',
                                data:  this.changeDataToFixed(num)
                            }
                        ]
                    },
                    allNum: allNum
                },() => {
                    if (this.onRef && this.onRef1) {
                        this.onRef.setOption(this.state.option)
                        this.onRef1.setOption(this.state.option1)
                    }
                })
            }else{
                console.log('饼图',result[0].msg)
                Toast.show(result[0].msg);
            }
            if(result[1].success){
                let arr = [];
                for(let i = 0; i< result[1].obj.length; i++){
                    arr.push({
                        date: result[1].obj[i].date,
                        num: (isDot(result[1].obj[i].num))
                    })
                }
                console.log(222222222222222222222222,this.dataChangeNum(arr));
                this.setState({
                    pm: {
                        backgroundColor: 'transparent',
                        tooltip: {
                            backgroundColor: 'rgba(75,116,255,0.5)',
                            padding: [10,10, 15,10],
                            trigger: 'axis',
                            position: ['30%', '50%'],
                            formatter: function (params, ticket, callback) {
                                var showHtm="";
                                let a = 0;
                                var title = params[a].name;
                                showHtm+= title + '<br>';
                                for(var i=0;i<params.length;i++){
                                    //名称
                                    var name = params[i].seriesName;
                                    //值
                                    var color = "";
                                    if (i == 0) {
                                        color = "#83EDD7";
                                    } else if (i == 1) {
                                        color = "#4B74FF";    
                                    }
                                    var value = params[i].data.value;
                                    if (value > 100000) {
                                        color = "#FF6E36";
                                    }
                                    showHtm+= '<i style="width:8px;height:8px;border-radius:50%;border: 1px solid #fff;background-color: '+ color +';display:inline-block;margin-bottom: 1px;margin-right: 5px"></i>' + name + ":" + value +'Kw.h'+'<br>'
                                }
                                return showHtm;
                            },
                        },
                        grid: {
                            x: 50,
                            width: '76%',
                            left: 45
                        },
                        legend: {
                            data:['耗电量'],
                            bottom: 0,
                            selectedMode: false,
                            icon: 'circle'
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: this.dataChangeDate(result[1].obj),
                                axisPointer: {
                                    type: 'shadow'
                                },
                                splitLine: {
                                    show: true,
                                    lineStyle: {
                                        color: '#E7E7E7'
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
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                name: '单位：kw.h',
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
                                        color: '#E7E7E7'
                                    }
                                },
                            },
                        ],
                        series: [
                            {
                                name:'耗电量',
                                type:'line',
                                silent: true,
                                symbol: 'circle',
                                symbolSize: 6,
                                data: this.dataChangeNum(arr),
                                itemStyle: {
                                    normal: {
                                        color: "#38D5B5"
                                    },
                                    
                                }
                            },
                          
            
                        ]
                    }
                },() => {
                    if (this.onRefPm) {
                        this.onRefPm.setOption(this.state.pm)
                    }
                })
            }else{
                console.log('柱状图',result[1].msg)
                Toast.show(result[1].msg);
            }
            
        }).catch((error) => {

            // Toast.show(error);
        })

    }
    
    //点击时间确定不同的接口
    handleChangeGetStatistics = () => {
            this.getOutPutStatistics()
    }
    render() {
        const { pop } = this.props.navigation;
        const {obj} = this.state;
        return (
            <View style={styles.container}>
                <Header
                    backBtn={true}
                    titleText="耗电管理"
                    props={this.props}
                    isMine={true}
                />
                <ScrollView style={{paddingRight: 16,paddingLeft: 16,}}>
                    <View>
                        <View style={styles.content}>
                            <Text style={{fontSize: 16,color: "#333", fontWeight: "600",marginTop: 22,marginBottom: 15}}>昨日耗电</Text>
                            <View style={styles.conBox}>
                                <View style={styles.conBoxItem}>
                                    <Text style={[styles.conBoxBText,{color: obj.growy > 1 ? "#1ACFAA" : "#FF632E"}]}>{obj.growy ? isDot(obj.growy) : '--'}%</Text>
                                    <Text style={styles.conBoxSText}>同比增长</Text>
                                </View>
                                <View style={styles.conBoxItem}>
                                    <View style={{flexDirection: "row",alignItems: "center"}}>
                                        <Text style={[styles.conBoxBText,{color: "#333333"}]}>{obj.yesterdayNumber ? isDot(obj.yesterdayNumber) : '--'}</Text><Text style={{fontSize: 12,color: "#333333",marginLeft: 4}}>kw.h</Text>
                                    </View>
                                    <Text style={styles.conBoxSText}>昨日耗电</Text>
                                </View>
                                <View style={styles.conBoxItem}> 
                                    <Text style={[styles.conBoxBText]}>{obj.electricityConsumptionPerTon ? isDot(obj.electricityConsumptionPerTon) : "--"}</Text>
                                    <Text style={styles.conBoxSText}>每吨耗电 kw.h</Text>
                                </View>
                            </View>
                            <View style={{justifyContent: "space-between", flexDirection: "row", marginTop: 18,marginBottom: 24}}>
                            <View style={[styles.conBoxItem,{height: 40,borderRightWidth: 1,borderColor: "#E0E0E0"}]}>
                                <View style={{flexDirection: "row",alignItems: "center"}}>
                                    <Text style={styles.conBoxBText}>{obj.cumulativePowerConsumption ? isDot(obj.cumulativePowerConsumption/10000) : '--'}万kw.h</Text>
                                </View>
                                <Text style={[styles.conBoxSText]}>累计耗电量</Text>
                            </View>
                            <View style={[styles.conBoxItem,{height: 40}]}>
                                <View style={{flexDirection: "row",alignItems: "center"}}>
                                    <Text style={styles.conBoxBText}>{obj.averageDailyPowerConsumption ? isDot(obj.averageDailyPowerConsumption) : '--'}kw.h</Text>
                                </View>
                                <Text style={[styles.conBoxSText]}>日均耗电</Text>
                            </View>
                        </View>
                    </View>
                        <View style={styles.content}>
                        <View style={{marginTop: 15,marginBottom: 15,flexDirection: "row",alignItems: "center",justifyContent: "space-between"}}>
                            <Text style={{fontSize: 16,color: "#333", fontWeight: "600"}}>耗电统计</Text>
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
                            <Text style={{fontSize: 14,color: "#333"}}>总耗电量: {this.state.allNum} kw.h</Text>
                        </View>
                        <View style={{width: '100%',height: 340}}>
                            <ECharts option={this.state.pm} ref={ref => this.onRefPm = ref}/>
                        </View>
                        <View style={{width: '100%',height: 300}}>
                            <ECharts option={this.state.option1} ref={ref => this.onRef1 = ref}/>
                        </View>
                        <View style={{width: '100%',height: 350,marginBottom: 10}}>
                            <ECharts option={this.state.option} ref={ref => this.onRef = ref}/>
                        </View>
                        
                    </View>
                       
                </View>
                    
                    
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
                                        if(this.state.currentDate1< this.state.currentDate2){
                                            this.setState({showPicker: false,date1: this.state.currentDate1,date2: this.state.currentDate2},
                                                () => {this.handleChangeGetStatistics()})
                                        }else{
                                            Toast.show('开始日期不能大于结束日期');
                                        }   
                                        
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
                                            maxDate={this.state.currentDate2}
                                            placeholder="请选择开始时间"
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
        paddingLeft: 39,
        paddingRight: 39,
        justifyContent: "space-between"
    },
    barView: {
        height: 44,
        borderBottomWidth: 1,
        
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
        
        width: 40,
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
