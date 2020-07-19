import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, RefreshControl, StatusBar, Platform} from 'react-native';
import Header from '../../../components/header';
import DatePicker from 'react-native-datepicker';
import splash from 'react-native-splash-screen'
import Webview from 'react-native-webview';
import {ECharts} from 'react-native-echarts-wrapper';
import moment from 'moment';
import Environment from '../../../service/environmental';
import Toast from '../../../components/toast';
import { parseDate } from '../../../utils/handlePhoto';
import config from '../../../config/index';

const {width, height} = Dimensions.get('window');
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            manage:[],
            current: 0,
            isRefresh: false,
            obj: {},
            pm: {},
            temp: {},
            paramValue: {}
        };
      }

    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    componentDidMount = () => {
        splash.hide();
        this.getSelectByPage()
        console.log('weatherUrl',config);
    }
    //分页查询监测点
    getSelectByPage = async () => {
        global.loading.show();
        const res = await Environment.getSelectByPage({
            currentPage: 1,
            pageSize: 10
        });
        global.loading.hide();
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
                this.getStatistics(this.state.manage[0].fId)
            })
        }else{
            console.log('分页查询监测点',res.msg)
            Toast.show(res.msg);
        }
    }
    //监测点监测数据
    getControllerData = async (id) => {
        global.loading.show();
        const res = await Environment.getControllerData(id);
        global.loading.hide();
            if(res.success){
               this.setState({
                   obj: res.obj,
                   paramValue: res.obj.paramValue
               })
            }else{
                console.log('监测点监测数据',res.msg)
                Toast.show(res.msg);
            }
    }
    //获取时间
    getTime = () => {

    }
    //统计监测点数据
    getStatistics = async (id) => {
        const res = await Environment.getStatistics({
            hours: 24,
            monitorId: id
        })
        if(res.success){
            let data = {};
            let time = [];
            let pmF = [];
            let pmT = [];
            let measure=[];
            let temp = [];
            for(let item of res.obj){
                if (!data[item.fReportTime]) {
                    data[item.fReportTime] = {};
                }
                if(item.fParamName =="温度"){
                    data[item.fReportTime][item.fParamName] = {value: item.fValue, limit: item.fUpperLimit}
                }
                if(item.fParamName =="pm10"){
                    data[item.fReportTime][item.fParamName] = {value: item.fValue, limit: item.fUpperLimit}
                }
                if(item.fParamName =="pm2.5"){
                    data[item.fReportTime][item.fParamName] = {value: item.fValue, limit: item.fUpperLimit}
                }
                if(item.fParamName =="湿度"){
                    data[item.fReportTime][item.fParamName] = {value: item.fValue, limit: item.fUpperLimit}
                }
            }
            console.log(data)
            for(let  key in data) {
                time.push(parseDate(key, 'HH:mm'));
                for(let keys in data[key]){
                    if(keys == 'pm2.5'){
                        if(data[key][keys].value > data[key][keys].limit){
                            pmF.push({
                                value: data[key][keys].value,
                                itemStyle: {color: "#FF6E36"},
                                symbolSize: 7
                            })
                        }else{
                            pmF.push({
                                value: data[key][keys].value,
                                
                            })
                        }
                    }else if(keys == 'pm10'){
                        if(data[key][keys].value > data[key][keys].limit){
                            pmT.push({
                                value: data[key][keys].value,
                                itemStyle: {color: "#FF6E36"},
                                symbolSize: 7
                            })
                        }else{
                            pmT.push({
                                value: data[key][keys].value,
                                
                            })
                        }
                    }else if(keys == '湿度'){
                        if(data[key][keys].value > data[key][keys].limit){
                            measure.push(data[key][keys].value,)
                        }else{
                            measure.push(data[key][keys].value,)
                        }
                    }else{
                        if(data[key][keys].value > data[key][keys].limit){
                            temp.push( data[key][keys].value)
                        }else{
                            temp.push( data[key][keys].value)
                        }
                    }
                }
            }
            this.setState({
                pm: {
                    backgroundColor: 'transparent',
                    tooltip: {
                        backgroundColor: 'rgba(75,116,255,0.5)',
                        padding: [10,10, 15,0],
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
                            showHtm+= `<i style="padding-left: 5px">`+title+`</i>` + '<br>';
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
                                if (value > 100) {
                                    color = "#FF6E36";
                                }
                                showHtm+= '<i style="width:8px;height:8px;border-radius:50%;border: 1px solid #fff;background-color: '+ color +';display:inline-block;margin-bottom: 1px;margin-right: 5px;margin-left: 5px"></i>' + name + "：" + value+'<br>'
                            }
                            return showHtm;
                        },
                    },
                    grid: {
                        x: 50,
                        width: '76%'
                    },
                    legend: {
                        data:['PM2.5','PM1 0','超标数据'],
                        bottom: 0,
                        icon: 'circle'
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: time,
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
                            name: '单位：方',
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
                            name:'PM2.5',
                            type:'line',
                            silent: true,
                            symbol: 'circle',
                            symbolSize: 6,
                            data:pmF,
                            itemStyle: {
                                normal: {
                                    color: "#38D5B5"
                                },
                                
                            }
                        },
                        {
                            name:'超标数据',
                            type:'line',
                            silent: true,
                            symbol: 'circle',
                            symbolSize: 6,
                            data:[
                                
                            ],
                            itemStyle: {
                                normal: {
                
                                    color: '#FF6E36'
                                },
                                
                            }
                        },
                        {
                            name:'PM1 0',
                            type:'line',
                            silent: true,
                            data:pmT,
                            symbol: 'circle',
                            symbolSize: 6,
                            itemStyle: {
                                normal: {
                                    color: "#4B74FF"
                                }
                            }
                        },
                    ]
                },
                temp: {
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
                            showHtm+= title + '<br>';
                            for(var i=0;i<params.length;i++){
                                //名称
                                var name = params[i].seriesName;
                                var value = params[i].data;
                                //值
                                var color = "";
                                if (i == 0) {
                                    color = "#F74747";
                                } else if (i == 1) {
                                    color = "#35C9FF";    
                                }
                                var pre = "";
                                if (i == 0) {
                                    pre = "℃";
                                } else if (i == 1) {
                                    pre = "%";
                                }
                                showHtm+= '<i style="width:8px;height:8px;border-radius:50%;border: 1px solid #fff;background-color: '+ color +';display:inline-block;margin-bottom: 1px;margin-right: 5px"></i>' + name + "：" + value+pre+'<br>'
                            }
                            return showHtm;
                        },
                    },
                    grid: {
                        x: 50,
                        width: '66%'
                    },
                    legend: {
                        data:['温度','湿度'],
                        bottom: 0,
                        icon: 'circle'
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: time,
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
                            name: '单位：℃', 
                            interval:10,
                            max: 120,
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
                        {
                            type: 'value',
                            name: '单位：%',
                            interval:10,
                            max: 120,
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
                            name:'温度',
                            type:'line',
                            silent: true,
                            symbol: 'circle',
                            symbolSize: 6,
                            data:temp,
                            itemStyle: {
                                normal: {
                                    color: "#F74747"
                                },
                                
                            }
                        },
                        {
                            name:'湿度',
                            yAxisIndex:'1',
                            type:'line',
                            silent: true,
                            data:measure,
                            symbol: 'circle',
                            symbolSize: 6,
                            itemStyle: {
                                normal: {
                                    color: "#35C9FF"
                                }
                            }
                        },
                    ]
                }
            },() => {
                if(this.onRef && this.onRef1 ){
                    this.onRef.setOption(this.state.pm)
                    this.onRef1.setOption(this.state.temp)
                }
            })
        }else{
            console.log('统计监测点数据',res.msg)
            Toast.show(res.msg);
        }
    }
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
    /**
     * 下啦刷新
     * 
     */
    
    _onRefresh = () => {
        // 不处于 下拉刷新
        if (!this.state.isRefresh) {
            this.getSelectByPage()
        }
    };
    
    render() {
        const { pop } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header
                    backBtn={true}
                    titleText="环境监控"
                    isMine={true}
                />
                <ScrollView
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
                >
                    <View style={{height: 200}}>
                    <Webview
                        style={styles.webView}
                        source={{uri: config.weatherUrl}}
                    />
                </View>
                    <View style={{flexDirection: "row", height: 44,width: "100%", backgroundColor: "#fff"}}>
                        
                            {
                                this.state.manage.length <= 4 ?
                                    this.state.manage.map((item,index) => {
                                        return <TouchableOpacity index={index} onPress={() => {this.setState({current: index},() => {this.getControllerData(item.fId);this.getStatistics(item.fId)})}} style={{flex: 1}}>
                                                <View style={[styles.barView,index == this.state.current ? {borderBottomColor: "#4B74FF"}:{borderBottomColor: "#fff"}]}>
                                                    <Text style={[styles.barText,index == this.state.current ? {color: "#4B74FF"}:{color: "#333"}]}>{item.fName}</Text>
                                                </View>
                                            </TouchableOpacity>
                                    })
                                : <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                { this.state.manage.map((item,index) => {
                                        return <TouchableOpacity index={index} onPress={() => {this.setState({current: index}),() => {this.getControllerData(item.fId);this.getStatistics(item.fId)}}}>
                                                <View style={[styles.barView,index == this.state.current ? {borderBottomColor: "#4B74FF"}:{borderBottomColor: "#fff"},{paddingLeft: 40,paddingRight: 40,}]}>
                                                    <Text style={[styles.barText,index == this.state.current ? {color: "#4B74FF"}:{color: "#333"}]}>{item.fName}</Text>
                                                </View>
                                            </TouchableOpacity>
                                    })}
                                </ScrollView>
                            }
                        
                    </View>
                    <View style={{paddingRight: 16,paddingLeft: 16,}}>
                    <View style={[styles.myPanel, {marginTop: 10}]}>
                            <View style={styles.panelTitle}>
                                <Text style={styles.panelTitleText}>环境</Text>
                                <Text style={{color: "#666666", fontSize: 12}}>更新时间：{this.state.obj.recentReportTime ? parseDate(this.state.obj.recentReportTime, 'YYYY.MM.DD HH:mm'): '--'}</Text>
                            </View>
                            {
                                this.state.paramValue ? 
                                    <View style={{width: '100%'}}>
                                        <View style={{width: "100%",paddingTop: 13,paddingBottom: 13, flexDirection: "row",backgroundColor: "#F6F6F6",borderRadius: 5,marginTop: 10}}>
                                        <View style={{alignItems: "center", justifyContent: "center",flex: 1,borderRightColor: "#FEFEFE",borderRightWidth: 1}}>
                                            <Text style={{color : this.getColor(45), fontSize: 18, fontWeight: "600"}}>{this.state.paramValue[`pm2.5`] ? this.state.paramValue[`pm2.5`].value: '--'}</Text>
                                            <Text style={{marginTop:8, color: "#666666",fontSize: 12}}>PM2.5</Text>
                                        </View>
                                        <View style={{alignItems: "center", justifyContent: "center",flex: 1}}>
                                            <Text style={{color : this.getColor(72) , fontSize: 18, fontWeight: "600"}}>{this.state.paramValue[`pm10`] ? this.state.paramValue[`pm10`].value: '--'}</Text>
                                            <Text style={{marginTop:8,color: "#666666" ,fontSize: 12}}>PM10</Text>
                                        </View>
                                    </View>
                                        <View style={{height: 40,flexDirection: "row", alignItems: "center",marginTop: 16}}>
                                        <View style={{flex: 1,alignItems: "center",justifyContent: "center",borderRightWidth:1,borderRightColor: "#F6F6F6"}}>
                                            <View style={{flexDirection: "row",marginBottom: 8, alignItems:"center",}}>
                                                <Text style={styles.envirTxtNum}>{this.state.paramValue[`噪音`] ? this.state.paramValue[`噪音`].value: '--'}</Text>
                                                <Text style={styles.envirTxtD}>dB</Text>
                                            </View>
                                            <Text style={styles.envirTxtNumW}>噪音</Text>
                                        </View>
                                        <View style={{flex: 1,alignItems: "center",justifyContent: "center",borderRightWidth:1,borderRightColor: "#F6F6F6"}}>
                                            <View style={{flexDirection: "row",marginBottom: 8, alignItems:"center"}}>
                                                <Text style={styles.envirTxtNum}>{this.state.paramValue[`温度`] ? this.state.paramValue[`温度`].value: '--'}</Text>
                                                <Text style={styles.envirTxtD}>℃</Text>
                                            </View>
                                            <Text style={styles.envirTxtNumW}>温度</Text>
                                        </View>
                                        
                                        <View style={{flex: 1,alignItems: "center",justifyContent: "center",borderRightWidth:1,borderRightColor: "#F6F6F6"}}>
                                            <View style={{flexDirection: "row",marginBottom: 8, alignItems:"center"}}>
                                                <Text style={styles.envirTxtNum}>{this.state.paramValue[`湿度`] ? this.state.paramValue[`湿度`].value: '--'}</Text>
                                                <Text style={styles.envirTxtD}>%</Text>
                                            </View>
                                            <Text style={styles.envirTxtNumW}>湿度</Text>
                                        </View>
                                        
                                        <View style={{flex: 1,alignItems: "center",justifyContent: "center"}}>
                                            <View style={{flexDirection: "row",marginBottom: 8, alignItems:"center"}}>
                                                <Text style={styles.envirTxtNum}>{this.state.paramValue[`风力`] ? this.state.paramValue[`风力`].value: '--'}</Text>
                                                <Text style={styles.envirTxtD}>级</Text>
                                            </View>
                                            <Text style={styles.envirTxtNumW}>风力</Text>
                                        </View>

                                    </View>
                                    </View>
                                : null
                            }
                            
                    </View>
                    
                    <View style={[styles.myPanel, {marginTop: 10,marginBottom: 10}]}>
                            <View style={styles.panelTitle}>
                                <Text style={styles.panelTitleText}>近24小时数据统计</Text>
                            </View>
                            <View style={{backgroundColor: "#F6F6F6", alignItems: "center",justifyContent: "center",marginTop: 10,height: 44}}>
                                <Text style={{fontSize: 14,color: "#333"}}>PM2.5/PM10</Text>
                            </View>  
                            <View style={{width: '100%',height: 340}}>
                                <ECharts option={this.state.pm} ref={ref => this.onRef = ref}/>
                            </View>
                            <View style={{backgroundColor: "#F6F6F6", alignItems: "center",justifyContent: "center",marginTop: 10,height: 44}}>
                                <Text style={{fontSize: 14,color: "#333"}}>温度/湿度</Text>
                            </View> 
                            <View style={{width: '100%',height: 430}}>
                                <ECharts option={this.state.temp} ref={ref => this.onRef1 = ref}/>
                            </View>
                    </View>
                    
                </View>
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
    barView: {
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1
    },
    barText: {
        lineHeight: 44,
        fontSize: 14,
        color: "#333"
    },
    myPanel: {
        backgroundColor:'#fff',
        borderRadius: 4,
        padding: 15
    },
    panelTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    panelTitleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000'
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
    webView: {
        width: '100%'
    }
});
