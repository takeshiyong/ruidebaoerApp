import React, { Component } from 'react';
import { StyleSheet,ScrollView, Text, View, Dimensions, TouchableOpacity, FlatList,Image,RefreshControl,ActivityIndicator,ImageBackground} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import Octicons from 'react-native-vector-icons/Octicons';
import cameraServer from '../../service/cameraServer';
import config from '../../config';
import Header from '../../components/header';
import {ECharts} from 'react-native-echarts-wrapper';

import Toast from '../../components/toast';
const { width, height } = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
      manage:["列表","统计"],
      currentMana: 0,
      option :{},
      obj: [],
      fChannel: '',
      item: {}
    }

    componentDidMount() {
      SplashScreen.hide();
      if (this.props.navigation.state.params && this.props.navigation.state.params.item) {
        
        this.setState({
            item:this.props.navigation.state.params.item,
        },() => {
            this.getNearAlarmInfo(this.state.item.fVideoId);
            this.getNearAlarmStatistical(this.state.item.fVideoId);
        })
      }
    }

    changePage = () => {

    }
    //获取最近报警列表(fHours为空时全查)
    getNearAlarmInfo = async (id) => {
        const res = await cameraServer.getNearAlarmInfo(24,id);
        if(res.success){
            this.setState({
                obj:res.obj
            })
        }else{
            console.log(res.msg);
        }
    }
    //获取最近报警统计
    getNearAlarmStatistical = async (id) => {
        const res = await cameraServer.getNearAlarmStatistical(id);
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
                            axisPointer: {
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
            },() => {
                if (this.onRef) {
                    this.onRef.setOption(this.state.option)
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
              titleText="设备摄像头详情"
              backBtn={true}
              hidePlus={true}
              rightBtn={
                <TouchableOpacity style={{marginRight: 10}} onPress={()=>this.props.navigation.push('AlarmRecord',{type: 1,fVideoId:this.state.item.fVideoId})}>
                    <Text style={{ color: '#fff', fontSize: 16 }}>记录</Text>
                </TouchableOpacity>
              }
            />
            <ScrollView>
                <View style={{backgroundColor: "#fff"}}>
                    <Text style={{paddingLeft: 15,color: "#333",fontSize: 16,fontWeight: '500',paddingTop: 18,paddingBottom: 20}}>{this.state.item.fName?this.state.item.fName: '--'}</Text>
                    <View style={{paddingLeft: 16,paddingRight: 16,marginBottom: 16}}>
                        <TouchableOpacity style={{zIndex: 999,position: "absolute",left: "48%",top: "33%",}} onPress={() => {this.props.navigation.navigate('Live',{fChannel:this.state.item.fChannel})}}>
                            <Octicons name="play" color="rgba(213,213,213,0.5)" size={65}/>
                        </TouchableOpacity>
                        <Image style={{width: '100%',height: 193,backgroundColor: "#E0E0E0"}} source={{uri: config.cameraImg+this.state.item.fChannel}}/>
                    </View>
                </View>
                <View style={{backgroundColor: "#fff",marginTop: 10,paddingRight: 15,paddingBottom: 5}}>
                      <View style={styles.topBox}>
                        <Text style={{paddingLeft: 15,color: "#333",fontSize: 16,fontWeight: '500',}}>{!this.state.currentMana?'近24小时异常报警列表(总数:'+this.state.obj.length+')':'近24小时异常报警统计'}</Text>
                        <View style={{flexDirection: "row"}}>
                            {this.state.manage.map((item,index) => {
                                return <TouchableOpacity index={index} onPress={() => {this.setState({currentMana: index},() => this.changePage())} }>
                                    <View style={[styles.selctView,index == this.state.currentMana ? {backgroundColor: '#4B74FF'}:{backgroundColor: '#fff'}]}>
                                        <Text style={[styles.barText,index == this.state.currentMana ? {color: '#fff'}:{color: '#4B74FF'}]}>{item}</Text>
                                    </View>
                                </TouchableOpacity>
                            })}
                        </View>
                      </View>
                      {!this.state.currentMana?
                        (this.state.obj.length > 0?
                        this.state.obj.map((item) => {
                            return(<TouchableOpacity style={[styles.recordDetail, {borderBottomColor: '#f1f1f1',borderBottomWidth: 1}]} onPress={() => {this.props.navigation.navigate('ItemDetail',{item: item})}}>
                            <View style={{flexDirection: "row",backgroundColor: "#fff",padding: 10}}>
                                <View style={styles.imgBox}>
                                    <Image source={{uri: (config.imgUrl+item.fPaths)}} style={{width: 28,height: 28}}/>
                                </View>
                                <View style={{flex: 1}}>
                                    <View style={{flexDirection: "row",flex: 1,justifyContent: "space-between"}}>
                                        <Text style={{color: "#333",fontSize: 16}}>{item.fRecordTime ?moment(item.fRecordTime).format('HH:mm:ss'): '--'}</Text>
                                    </View>
                                    <View style={{flexDirection: "row"}}>
                                        <Text style={[styles.smallTitle,{marginRight: 30}]}>{item.fType?'大块砂石': "异物"} : {item.fQuantity != null ?item.fQuantity: '--'}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>)})
                        : <Text style={{width,height: 30,alignContent: "center",textAlign: "center",color: "#999"}}>暂无异常报警</Text>): null}
                      {this.state.currentMana?
                      <View style={{width: width,height: 320,webkitTapHighlightColor:'transparent',paddingBottom: 20}}>
                          <ECharts option={this.state.option} ref={ref => this.onRef = ref}/>
                      </View> : null}
                    
                </View>
            </ScrollView>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F6F6F6'
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
    },
    selctView: {
      paddingTop: 4,
      paddingBottom: 4,
      paddingLeft: 10,
      paddingRight: 10,
      borderWidth: 1,
      borderColor: "#4B74FF"
    },
    barText: { 
      fontSize: 14, 
      fontWeight: "500",
      textAlign: "center",
    },
    topBox: {
      flexDirection: "row",
      paddingTop: 10,
      paddingBottom: 5,
      alignItems: "center",
      justifyContent: "space-between"
    }
});
