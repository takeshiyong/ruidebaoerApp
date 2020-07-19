import React, { Component } from 'react';
import { StyleSheet,ScrollView, Text, View, Dimensions, TouchableOpacity, FlatList,Image,RefreshControl,ActivityIndicator,ImageBackground} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {ECharts} from 'react-native-echarts-wrapper';
import {connect} from 'react-redux';

import Header from '../../components/header';
import { getDeviceTypes } from '../../store/thunk/systemVariable';
const { width, height } = Dimensions.get('window');
class DeviceManage extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
      option1: {
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
      },

    }

    componentDidMount() {
      SplashScreen.hide();
      // 获取设备大类列表
      this.props.dispatch(getDeviceTypes());
    }
    
    render() {
        return (
          <View style={styles.container}>
            <Header 
              titleText="设备管理"
              backBtn={true}
            />
            <ScrollView>  
            <View style={styles.headerView}>
              <TouchableOpacity style={styles.headerBtn} onPress={()=>this.props.navigation.push('DeviceClass')}>
                <Image source={require('../../image/equiement/createtask_fill.png')}/>
                <Text style={{color: '#fff',marginTop: 5}}>设备档案</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerBtn} onPress={()=>this.props.navigation.push('DeviceRecord', {type: 3})}>
                <Image source={require('../../image/equiement/computer_fill.png')}/>
                <Text style={{color: '#fff',marginTop: 5}}>巡检记录</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerBtn} onPress={()=>this.props.navigation.push('DeviceMaintain', {type: 2})}>
                <Image source={require('../../image/equiement/document_fill.png')}/>
                <Text style={{color: '#fff',marginTop: 5}}>保养记录</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerBtn} onPress={()=>this.props.navigation.push('MaintainLog', {type: 4})}>
                <Image source={require('../../image/equiement/decoration_fill.png')}/>
                <Text style={{color: '#fff',marginTop: 5}}>维修记录</Text>
              </TouchableOpacity>
            </View> 
            <View style={styles.tipView}>
              <Image source={require('../../image/equiement/volume-up.png')} />
              <Text style={{color: '#666',fontSize: 12,flex: 1,marginLeft: 10}}>西区颚式破碎机 轴承温度异常</Text>
              <Text style={styles.timeText}>12: 14</Text>
            </View>
            
              <View style={styles.contentView}>
                <View style={[styles.myPanel, {marginTop: 10}]}>
                    <View style={styles.panelTitle}>
                        <Text style={styles.panelTitleText}>设备</Text>
                        <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {this.props.navigation.push('DeviceManage')}}>
                            <View style={[styles.selctView, {borderRadius: 5, borderWidth:0}]}>
                                <Text style={{color: '#333'}}>共: <Text style={{fontWeight: 'bold',color:'#333'}}>200台</Text></Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{width: '100%',height: 300,webkitTapHighlightColor:'transparent'}}>
                        <ECharts option={this.state.option1} style={{webkitTapHighlightColor:'transparent'}}/>
                    </View>
                </View>
                <ImageBackground 
                  source={require('../../image/equiement/yellow.png')}
                  style={styles.imageBackground}
                  >
                  <View>
                    <Text style={styles.bigText}>设备隐患库</Text>
                    <Text style={styles.smallText}>隐患总数11条</Text>
                  </View>
                  <Image source={require('../../image/equiement/yellow-g.png')}/>
                </ImageBackground>
                <ImageBackground 
                  source={require('../../image/equiement/green.png')}
                  style={styles.imageBackground}
                  >
                  <Image source={require('../../image/equiement/green-g.png')}/>
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.bigText}>设备故障库</Text>
                    <Text style={styles.smallText}>上千种设备的故障解决方案</Text>
                  </View>
                </ImageBackground>
                <TouchableOpacity onPress={()=>this.props.navigation.push('DeviceDoc')}>
                    <ImageBackground 
                    source={require('../../image/equiement/blue.png')}
                    style={styles.imageBackground}
                    >
                    <View>
                        <Text style={styles.bigText}>设备知识库</Text>
                        <Text style={styles.smallText}>上千种设备的养护及操作方法</Text>
                    </View>
                    <Image source={require('../../image/equiement/blue-g.png')}/>
                    </ImageBackground>
                </TouchableOpacity>
                
              </View>
            </ScrollView>
          </View>
        );
    }
}

export default connect()(DeviceManage);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F6F6F6'
    },
    headerView: {
      width,
      height: 145,
      backgroundColor: '#486FFD',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around'
    },
    headerBtn: {
      borderRadius: 4,
      backgroundColor: 'rgba(225,225,225,0.3)',
      width: width/5,
      height: 95,
      alignItems:'center',
      justifyContent: 'center'
    },
    tipView: {
      width: width,
      backgroundColor: '#fff',
      height: 44,
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 10,
      paddingLeft: 10
    },
    timeText: {
      color: '#999',
      fontSize: 12,
      width: 50,
      textAlign: 'right'
    },
    contentView: {
      padding: 10
    },
    staticView: {
      width: width - 20,
      height: 220,
      backgroundColor: '#fff'
    },
    titleTextWeight: {
      color: '#333',
      fontWeight: 'bold',
      fontSize: 16,
      paddingLeft: 15,
      paddingTop: 15
    },
    statisView: {
      flexDirection: 'row',
      borderRadius: 4
    },
    rowStyle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    labelView: {
      alignItems: 'center',
      flex: 1
    },
    imageBackground: {
      width: width-20,
      height: (width-20)*0.247,
      marginTop: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight: 20,
      paddingLeft: 20
    },
    bigText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 20,
    },
    smallText: {
      color: '#fff',
      fontSize: 12,
      marginTop: 5,
    },
    myPanel: {
        backgroundColor:'#fff',
        borderRadius: 4,
        padding: 15
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
});
