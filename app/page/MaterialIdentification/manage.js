import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, RefreshControl} from 'react-native';
import Header from '../../components/header';
import Toast from '../../components/toast';
import {ECharts} from 'react-native-echarts-wrapper';
import cameraServer from '../../service/cameraServer';
import { parseTime, parseDate } from '../../utils/handlePhoto';
import moment from 'moment';
import config from '../../config/index';



const {width, height} = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
        option : {},
        obj: []
    }
    componentDidMount() {
        this.getNearAlarmInfo();
        this.getNearAlarmStatistical();
    }
    //获取最近报警列表(fHours为空时全查)
    getNearAlarmInfo = async () => {
        const res = await cameraServer.getNearAlarmInfo(24,'');
        if(res.success){
            this.setState({
                obj:res.obj
            })
        }else{
            console.log(res.msg);
        }
    }
    //获取最近报警统计
    getNearAlarmStatistical = async () => {
        const res = await cameraServer.getNearAlarmStatistical('');
        if(res.success){
            let time = [];
            res.obj.fHours.map((item) => {
                time.push((item+":00"))
            })
            
            let largeNums = res.obj.largeNums;
            let foreignNums = res.obj.foreignNums

            this.setState({
                option:{
                    backgroundColor: 'transparent',
                    tooltip: {
                        backgroundColor: 'rgba(75,116,255,0.5)',
                        padding: [10,10, 15,10],
                        trigger: 'axis',
                    },
                    grid: {
                        x: 50,
                        width: '76%',
                        left: 45
                    },
                    legend: {
                        data:['大块','异物'],
                        bottom: 0,
                        selectedMode: false,
                        icon: 'circle'
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: time,
                            // maxInterval: 8,
                            axisPointer: {
                                type: 'line',
                                lineStyle: {
                                    color: '#4B74FF'
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
                                showMinLabel: true,
                                showMaxLabel: true,
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
                            name: '报警总数:',
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
                            name:'大块',
                            type:'line',
                            silent: true,
                            symbol: 'circle',
                            symbolSize: 6,
                            data: largeNums,
                            itemStyle: {
                                normal: {
                                    color: "#20D0AC"
                                },
                                
                            }
                        },
                        {
                            name:'异物',
                            type:'line',
                            silent: true,
                            symbol: 'circle',
                            symbolSize: 6,
                            data: foreignNums,
                            itemStyle: {
                                normal: {
                                    color: "#FF6E36"
                                },
                                
                            }
                        }
            
                    ]
                }
            })
        }else{
            console.log(res.msg);
        }
    }
    render() {

        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="料径识别"
                    hidePlus={false} 
                    props={this.props}
                />
                
                    <View style={styles.items}>
                        <TouchableOpacity style={[styles.item,{backgroundColor: "#1ACFAA"}]} onPress={() => this.props.navigation.navigate('DevicesCamera',{type: 1})}>
                            <Image source={require('../../image/maintain/list.png')} style={styles.itemImg}/>
                            <Text style={styles.itemText}>设备列表</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item,{backgroundColor: "#F74747"}]} onPress={()=>this.props.navigation.push('AlarmRecord',{type: 2})}>
                            <Image source={require('../../image/maintain/point.png')} style={styles.itemImg}/>
                            <Text style={styles.itemText}>报警记录</Text>
                        </TouchableOpacity>
                    </View>
                <ScrollView>
                    <View style={{width: width,height: 400,marginTop: 10,webkitTapHighlightColor:'transparent',backgroundColor: "#fff"}}>
                        <Text style={{paddingLeft: 15,color: "#333",fontSize: 16,fontWeight: '500',paddingTop: 18,paddingBottom: 20}}>近24小时异常报警统计</Text>
                        <ECharts option={this.state.option} />
                    </View>    
                    <View style={{width: width,marginTop: 10,marginBottom: 20,webkitTapHighlightColor:'transparent',backgroundColor: "#fff"}}>
                        <Text style={{paddingLeft: 15,color: "#333",fontSize: 16,fontWeight: '500',paddingTop: 18,paddingBottom: 20}}>近24小时异常报警列表</Text>
                        {
                            this.state.obj.length > 0 ? this.state.obj.map((item) => {
                                return(<TouchableOpacity style={[styles.recordDetail, {borderBottomColor: '#f1f1f1',borderBottomWidth: 1}]} onPress={() => {this.props.navigation.navigate('ItemDetail',{item})}}>
                                <View style={{flexDirection: "row",backgroundColor: "#fff",padding: 10}}>
                                    <View style={styles.imgBox}>
                                        <Image source={{uri: (config.imgUrl+item.fPaths)}} style={{width: 28,height: 28}}/>
                                    </View>
                                    <View style={{flex: 1}}>
                                        <View style={{flexDirection: "row",flex: 1,justifyContent: "space-between"}}>
                                            <Text style={{color: "#333",fontSize: 16}}>{item.fVideoName?item.fVideoName: '--'}</Text>
                                            <Text style={styles.smallTitle}>{item.fRecordTime ?moment(item.fRecordTime).format('HH:mm:ss'): '--'}</Text>
                                        </View>
                                        <View style={{flexDirection: "row"}}>
                                            <Text style={[styles.smallTitle,{marginRight: 30}]}>{item.fType?'大块砂石': "异物"} : {item.fQuantity != null ?item.fQuantity: '--'}</Text>
                                            {/* <Text style={styles.smallTitle}>异物: 0</Text> */}
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>)
                            }): <Text style={{width,height: 30,alignContent: "center",textAlign: "center",color: "#999",fontWeight: "500"}}>暂无异常报警</Text>
                        }
                        
                        
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
        display: "flex"
    },
    items: {
        position:"relative",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingTop: 17,
        paddingBottom: 17,
        backgroundColor: "#fff",
        paddingLeft: 16,
        paddingRight: 16
    },
    item: {
        width: (width-50)/2,
        height: 74,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    itemImg: {
        width: 28,
        height: 28
    },
    itemText: {
        color: "#FFFFFF",
        fontSize: 14,
        marginLeft: 10
    },
    content: {
        marginTop: 12,
        paddingLeft: 16,
        paddingRight: 16
    },
    conHeader: {
        color: "#333333",
        fontSize: 14,
        paddingTop: 26,
        paddingBottom: 18,
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1,
        paddingLeft: 16
    },
    conCenter:{
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 16,
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1,
        flexDirection: "row"
    },
    detail: {
        width: 90,
        height: 24,
        borderColor: "#4058FD",
        borderWidth: 1,
        borderRadius: 3,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12
    },
    create: {
        width: 90,
        height: 24,
        borderRadius: 3,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
        backgroundColor: "#4058FD"
    },
    recordDetail: {
        paddingLeft: 10,
        paddingRight: 10
    },
    imgBox: {
        width: 44,
        height: 44,
        marginRight: 13,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E0E0E0",
        borderRadius: 5
    },
    smallTitle: {
        color: "#999"
    }
});
