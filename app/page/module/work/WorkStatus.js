import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image} from 'react-native';
import Header from '../../../components/header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import DatePicker from 'react-native-datepicker';
import {ECharts} from 'react-native-echarts-wrapper';


const {width, height} = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state= {
        date: null,
        date1: null,
        option1: {
            title: {
                text: '2次',
                top: '40%',
                left: '45%',
                textStyle: {
                    fontSize: 12,
                },
                textAlign: 'center',
            },
            series: [
                {
                    clockwise: false,
                    name:'访问来源',
                    type:'pie',
                    radius: ['55%', '75%'],
                    center: ['50%','50%'],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    legendHoverLink: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value:2, itemStyle: {
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
    
                        }},
                        {value:10, itemStyle: {
                            color: '#F3F3F3'
                        }},
                        
                    ]
                }
            ]
        },
        option2: {
            title: {
                text: '1次',
                top: '40%',
                left: '45%',
                textStyle: {
                    fontSize: 12,
        
                },
                textAlign: 'center'
            },
            series: [
                {
                    clockwise: false,
                    name:'访问来源',
                    type:'pie',
                    radius: ['55%', '75%'],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    legendHoverLink: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value:1 , itemStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 1,
                                y2: 0,
                                colorStops: [{
                                    offset: 0,
                                    color: '#5E75FE' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#4058FD' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
    
                        }},
                        {value:10, itemStyle: {
                            color: '#F3F3F3'
                        }},
                        
                    ]
                }
            ]
        },
        option3: {
            title: {
                text: '5次',
                top: '40%',
                left: '45%',
                textStyle: {
                    fontSize: 12,
        
                },
                textAlign: 'center'
            },
            series: [
                {
                    clockwise: false,
                    name:'访问来源',
                    type:'pie',
                    radius: ['55%', '75%'],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    legendHoverLink: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value:5, itemStyle: {
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
    
                        }},
                        {value:10, itemStyle: {
                            color: '#F3F3F3'
                        }},
                        
                    ]
                }
            ]
        },
        option4: {
            title: {
                text: '4次',
                top: '40%',
                left: '45%',
                textStyle: {
                    fontSize: 12,
        
                },
                textAlign: 'center'
            },
            series: [
                {
                    clockwise: false,
                    name:'访问来源',
                    type:'pie',
                    radius: ['55%', '75%'],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    legendHoverLink: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value:4, itemStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 1,
                                y2: 0,
                                colorStops: [{
                                    offset: 0,
                                    color: '#F74747' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#FC676E' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
    
                        }},
                        {value:10, itemStyle: {
                            color: '#F3F3F3'
                        }},
                        
                    ]
                }
            ]
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="工作状态"
                    props={this.props}
                />
                <ScrollView >
                    <View style={styles.content}>
                        <View style={{borderRadius: 4,borderWidth: 1,borderWidth: 1,borderColor: '#fff'}}>
                            <View style={[styles.itemStyle]}>
                                <Image source={require('../../../image/workStatus/start.png')} style={{marginRight: 10}}/>
                                <View style={styles.contentView}>
                                    <Text>开始日期</Text>
                                    <DatePicker
                                        style={{width: 150}}
                                        date={this.state.date}
                                        mode="date"
                                        placeholder="请选择开始日期"
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
                                                color: '#999'
                                            },
                                            placeholderText: {
                                                color: '#999'
                                            }
                                        }}
                                        iconComponent={<AntDesign name="right" color="#C1C1C1"/>}
                                        onDateChange={(date) => {this.setState({date: date})}}
                                    />
                                </View>
                            </View> 
                            <View style={styles.itemStyle}>
                                <Image source={require('../../../image/workStatus/stop.png')} style={{marginRight: 10}}/>
                                <View style={styles.contentView}>
                                    <Text>结束日期</Text>
                                    <DatePicker
                                        style={{width: 150}}
                                        date={this.state.date1}
                                        mode="date"
                                        placeholder="请选择结束日期"
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
                                                color: '#999'
                                            },
                                            placeholderText: {
                                                color: '#999'
                                            }
                                        }}
                                        iconComponent={<AntDesign name="right" color="#C1C1C1"/>}
                                        onDateChange={(date) => {this.setState({date1: date})}}
                                    />
                                </View>
                            </View>
                            <View style={[styles.itemStyle, {paddingBottom: 5}]}>
                                <Image source={require('../../../image/workStatus/user-group-fill.png')} style={{marginRight: 10}}/>
                                <View style={[styles.contentView,{borderBottomWidth: 0}]}>
                                    <Text>部门</Text>
                                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                        <Text style={{color: '#999',marginRight: 2}}>请选择部门</Text>
                                        <AntDesign name="right" color="#C1C1C1"/>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.pannelView}>
                            <Text style={{fontSize: 16,color: '#000',fontWeight: 'bold',marginLeft: 10,marginTop: 10}}>统计</Text>
                            <View style={{ flexDirection: 'row',paddingBottom: 15}}>
                                <View style={styles.echartsView}>
                                    <ECharts option={this.state.option1}/>
                                    <View style={styles.hideLine}/>
                                    <Text style={styles.echartsText}>酒精超标</Text>
                                </View>
                                <View style={styles.echartsView}>
                                    <ECharts option={this.state.option2}/>
                                    <View style={styles.hideLine}/>
                                    <Text style={styles.echartsText}>体温异常</Text>                                        
                                </View>
                                <View style={styles.echartsView}>
                                    <ECharts option={this.state.option3}/>
                                    <View style={styles.hideLine}/>
                                    <Text style={styles.echartsText}>精神恍惚</Text>                               
                                </View>
                                <View style={styles.echartsView}>
                                    <ECharts option={this.state.option4}/>
                                    <View style={styles.hideLine}/>
                                    <Text style={styles.echartsText}>身体带病</Text>
                                </View>
                            </View>
                            <Text style={{fontSize: 16,color: '#000',fontWeight: 'bold',marginLeft: 10,marginTop: 10}}>详情</Text>            
                            <View style={{marginTop: 10,paddingRight: 8,paddingLeft: 8}}>
                                <View style={styles.detailView}>
                                    <View style={styles.detailTitle}>
                                        <View style={styles.nameCircle}>
                                            <Text style={{color: '#fff', fontSize: 14}}>志</Text>
                                        </View>
                                        <Text style={{marginLeft: 10,color: '#000',fontSize: 14}}>李志</Text>
                                        <View style={styles.tip}>
                                            <Text style={{color: '#fff',fontSize: 10}}>破碎操作员</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row',alignItems: 'center',marginTop: 15}}>
                                        <View style={styles.tipView}>
                                            <Text style={{color: '#000',fontSize: 16}}>1</Text>
                                            <Text style={{color: '#666'}}>酒精超标</Text>
                                        </View>
                                        <View style={styles.tipView}>
                                            <Text style={{color: '#000',fontSize: 16}}>1</Text>
                                            <Text style={{color: '#666'}}>体温异常</Text>
                                        </View>
                                        <View style={styles.tipView}>
                                            <Text style={{color: '#000',fontSize: 16}}>4</Text>
                                            <Text style={{color: '#666'}}>精神恍惚</Text>
                                        </View>
                                        <View style={[styles.tipView, {borderRightWidth: 0}]}>
                                            <Text style={{color: '#000',fontSize: 16}}>3</Text>
                                            <Text style={{color: '#666'}}>身体带病</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.detailView}>
                                    <View style={styles.detailTitle}>
                                        <View style={styles.nameCircle}>
                                            <Text style={{color: '#fff', fontSize: 14}}>明</Text>
                                        </View>
                                        <Text style={{marginLeft: 10,color: '#000',fontSize: 14}}>李明明</Text>
                                        <View style={styles.tip}>
                                            <Text style={{color: '#fff',fontSize: 10}}>破碎操作员</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row',alignItems: 'center',marginTop: 15}}>
                                        <View style={styles.tipView}>
                                            <Text style={{color: '#000',fontSize: 16}}>1</Text>
                                            <Text style={{color: '#666'}}>酒精超标</Text>
                                        </View>
                                        <View style={styles.tipView}>
                                            <Text style={{color: '#000',fontSize: 16}}>0</Text>
                                            <Text style={{color: '#666'}}>体温异常</Text>
                                        </View>
                                        <View style={styles.tipView}>
                                            <Text style={{color: '#000',fontSize: 16}}>1</Text>
                                            <Text style={{color: '#666'}}>精神恍惚</Text>
                                        </View>
                                        <View style={[styles.tipView, {borderRightWidth: 0}]}>
                                            <Text style={{color: '#000',fontSize: 16}}>1</Text>
                                            <Text style={{color: '#666'}}>身体带病</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
      hideLine: {
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: '#fff',
        position: 'absolute',
        bottom: 13
      },
    echartsView: {
        flex: 1,
        height: 100,
        position: 'relative'
    },
    title: {
        marginLeft: 10,
    },
    itemStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 50,
        paddingLeft: 10,
    },
    contentView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingRight: 10
    },
    pannelView: {
        backgroundColor: '#fff',
        marginTop: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#fff'
    },
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    content: {
        padding: 10,
        backgroundColor: '#F4F4F4',
    },
    itemTop: {
        display: "flex",
        width: width-40,
        paddingLeft: 20,
        flexDirection: "row",
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderColor: "rgba(197, 195, 196, .8)"
    },
    item: {
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingBottom: 20,
        marginBottom: 6,
        display: "flex",
        flexDirection: 'column',
        alignItems: 'center'
    },
    echartsText: {
        color: '#666666',
        fontSize: 12,
        textAlign: 'center'
    },
    detailView: {
        width: '100%',
        backgroundColor: '#F6F6F6',
        borderRadius: 4,
        paddingBottom: 10,
        marginBottom: 20
    },
    detailTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        paddingLeft: 15
    },
    nameCircle: {
        width: 25,
        height: 25,
        borderRadius: 50,
        backgroundColor: '#4058FD',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tip: {
        backgroundColor: '#FF8244',
        marginLeft: 10,
        paddingTop: 2,
        paddingBottom: 2,
        paddingRight: 5,
        paddingLeft: 5,
        justifyContent: 'center',
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        alignItems: 'center'
    },
    tipView: {
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: '#E0E0E0',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10
    }
});
