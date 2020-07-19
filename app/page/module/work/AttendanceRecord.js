import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView} from 'react-native';
import Header from '../../../components/header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ECharts} from 'react-native-echarts-wrapper';
import moment from 'moment';
import { blueBg, redBg, orangBg, greenBg  } from './base64Bg';

const {width, height} = Dimensions.get('window');
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allStore:["全公司","市场部","生产部","后勤部","安环部"],
            current: 0,
            timeDate: new Date().getTime(),
            option1: {
                title: {
                    text: '迟到',
                    top: '10%',
                    left: '15%',
                    textStyle: {
                        fontSize: 14,
                        color: "white"
                    },
                    textAlign: 'center',
                },
                series: [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius: ['52%', '70%'],
                        center: ['65%','50%'],
                        avoidLabelOverlap: false,
                        hoverAnimation: false,
                        legendHoverLink: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center',
                            },
                            emphasis: {
                                show: false,
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
                                color: '#fff'
                            }},
                            {value:7, itemStyle: {
                                color: '#00AEFE'
                            }},
                            
                        ]
                    }
                ]
            },
            option2: {
                title: {
                    text: '请假',
                    top: '10%',
                    left: '15%',
                    textStyle: {
                        fontSize: 14,
                        color: "white"
                    },
                    textAlign: 'center',
                },
                series: [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius: ['52%', '70%'],
                        center: ['65%','50%'],
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
                                color: 'white'
                            }},
                            {value:5, itemStyle: {
                                color: '#E34950'
                            }},
                            
                        ]
                    }
                ]
            },
            option3: {
                title: {
                    text: '旷工',
                    top: '10%',
                    left: '15%',
                    textStyle: {
                        fontSize: 14,
                        color: "white"
                    },
                    textAlign: 'center',
                    
                },
                series: [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius: ['52%', '70%'],
                        center: ['65%','50%'],
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
                                    fontWeight: 'bold',
                                    borderRadius: 15
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[
                            {value:1, itemStyle: {
                                color: 'white'
                            }},
                            {value:10, itemStyle: {
                                color: '#E77134'
                            }},
                            
                        ]
                    }
                ]
            },
            option4: {
                title: {
                    text: '出差',
                    top: '10%',
                    left: '15%',
                    textStyle: {
                        fontSize: 14,
                        color: "white"
                    },
                    textAlign: 'center',
                    
                },
                series: [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius: ['52%', '70%'],
                        center: ['65%','50%'],
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
                                color: 'white'
                            }},
                            {value:7, itemStyle: {
                                color: '#6BD0BB'
                            }},
                            
                        ]
                    }
                ]
            }
        };
      }
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    preBtn(){
       this.setState({
            timeDate: this.state.timeDate-86400000
       })
    }
    nextBtn(){
        this.setState({
            timeDate: this.state.timeDate+86400000
        })
    }
    additionalCodeBlueBg = `
        document.body.style.background = "url('${blueBg}')";
        document.body.style.backgroundSize = "100% 100%";
    `;
    additionalCodeRedBg = `
        document.body.style.background = "url('${redBg}')";
        document.body.style.backgroundSize = "100% 100%";
    `;
    additionalCodeOrangBg = `
        document.body.style.background = "url('${orangBg}')";
        document.body.style.backgroundSize = "100% 100%";
    `;
    additionalCodeGreenBg = `
        document.body.style.background = "url('${greenBg}')";
        document.body.style.backgroundSize = "100% 100%";
    `;
  
    render() {
        const timeDate = moment(this.state.timeDate).format("YYYY-MM-DD");
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="考勤记录"
                    props={this.props}
                />
                <ScrollView>
                    <View style={styles.content}>
                        <View style={styles.topBar}>
                            <View style={{display: "flex",flexDirection: "row",justifyContent: "space-between",height: 57,alignItems: "center", borderBottomColor:"#E8E8E8",borderBottomWidth: 1}}>
                                <Text style={{fontSize: 16,color:"#333333",fontWeight: "600"}}>筛选</Text>
                                <View style={{display: "flex",flexDirection: "row",}}>
                                    <TouchableOpacity><Text style={[styles.dateText,{borderRightWidth: 0,borderTopLeftRadius: 8,borderBottomLeftRadius: 8,backgroundColor: "#4B74FF",color: "white"}]}>日</Text></TouchableOpacity>
                                    <TouchableOpacity><Text style={styles.dateText}>周</Text></TouchableOpacity> 
                                    <TouchableOpacity><Text style={[styles.dateText,{borderLeftWidth: 0,borderTopRightRadius: 8,borderBottomRightRadius: 8}]}>月</Text></TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.dateShow}>
                                <TouchableOpacity style={{width: 22,height: 22, backgroundColor: "#E0E0E0", borderRadius: 20,alignItems: "center",justifyContent: "center"}} onPress={() => {this.preBtn()}}>
                                    <AntDesign name={'left'} size={9} style={{ color: '#fff'}}/>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={{fontSize: 16, color: "#4B74FF"}}>{timeDate}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{width: 22,height: 22, backgroundColor: "#E0E0E0", borderRadius: 20,alignItems: "center",justifyContent: "center"}} onPress={() => {this.nextBtn()}}>
                                    <AntDesign name={'right'} size={9} style={{ color: '#fff'}}/>
                                </TouchableOpacity> 
                            </View>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                <View style={{display: "flex", flexDirection: "row",marginTop: 10,paddingBottom: 19}}>
                                    {this.state.allStore.map((item,index) => {
                                        return <TouchableOpacity index={index} onPress={() => {this.setState({current: index})}}>
                                        <Text style={[styles.buText, index == this.state.current ? {color: "white",backgroundColor: "#4B74FF"}:{color: "#B7B8BA"}]}>{item}</Text>
                                            </TouchableOpacity>
                                    })}
                                </View>
                            </ScrollView>
                        </View>
                        <View  style={styles.echartsCon}>
                            <View style={styles.echartsView}>
                                <ECharts option={this.state.option1} additionalCode={this.additionalCodeBlueBg}/>
                                <View style={styles.echartsTitle}>
                                    <Text style={{fontSize: 14, color: "white", fontWeight: "600"}}>7</Text>
                                    <Text style={{fontSize: 12, color: "white"}}>人次</Text>
                                </View>
                            </View>
                            <View style={styles.echartsView}>
                                <ECharts option={this.state.option2} additionalCode={this.additionalCodeRedBg}/>
                                <View style={styles.echartsTitle}>
                                    <Text style={{fontSize: 14, color: "white", fontWeight: "600"}}>30</Text>
                                    <Text style={{fontSize: 12, color: "white"}}>人次</Text>
                                </View>                              
                            </View>
                            <View style={styles.echartsView}>
                                <ECharts option={this.state.option3} additionalCode={this.additionalCodeOrangBg}/> 
                                <View style={styles.echartsTitle}>
                                    <Text style={{fontSize: 14, color: "white", fontWeight: "600"}}>0</Text>
                                    <Text style={{fontSize: 12, color: "white"}}>人次</Text>
                                </View>                      
                            </View>
                            <View style={styles.echartsView}>
                                    <ECharts option={this.state.option4} additionalCode={this.additionalCodeGreenBg}/>
                                <View style={styles.echartsTitle}>
                                    <Text style={{fontSize: 14, color: "white", fontWeight: "600"}}>7</Text>
                                    <Text style={{fontSize: 12, color: "white"}}>人次</Text>
                                </View> 
                            </View>
                        </View>
                        <View style={styles.items}>
                            <TouchableOpacity style={styles.item}>
                            <Text style = {styles.itemText}>忘打卡</Text>
                            <View style={styles.itemAbout}>
                                <View style={{display: "flex", flexDirection: "row",alignItems: "flex-end"}}>
                                    <Text style = {styles.itemText}>2</Text>
                                    <Text style = {{fontSize: 10,marginBottom: 1,marginRight: 9}}>人次</Text>
                                </View>
                                <AntDesign name={'right'} size={12} style={{ color: '#B2B2B2' }} />
                            </View>
                        </TouchableOpacity>
                            <TouchableOpacity style={styles.item}>
                            <Text style = {styles.itemText}>早退</Text>
                            <View style={styles.itemAbout}>
                            <View style={{display: "flex", flexDirection: "row",alignItems: "flex-end"}}>
                                <Text style = {styles.itemText}>1</Text>
                                <Text style = {{fontSize: 10,marginBottom: 1,marginRight: 9}}>人次</Text>
                            </View>
                                <AntDesign name={'right'} size={12} style={{ color: '#B2B2B2' }} />
                            </View>
                        </TouchableOpacity>
                            <TouchableOpacity style={styles.item}>
                            <Text style = {styles.itemText}>外出办公</Text>
                            <View style={styles.itemAbout}>
                                <View style={{display: "flex", flexDirection: "row",alignItems: "flex-end"}}>
                                    <Text style = {styles.itemText}>0</Text>
                                    <Text style = {{fontSize: 10,marginBottom: 1,marginRight: 9}}>人次</Text>
                                </View>
                                <AntDesign name={'right'} size={12} style={{ color: '#B2B2B2' }} />
                            </View>
                        </TouchableOpacity>
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
        display: "flex"
    },
    content: {
        width: "100%",
        position: "relative",
        paddingTop: 13,
        paddingLeft: 15,
        paddingRight: 15
    },
    topBar: {
        backgroundColor: "white",
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 8
    },
    dateText: {
        fontSize: 12,
        paddingRight: 16,
        paddingLeft: 16,
        paddingTop: 7,
        paddingBottom: 7,
        borderColor: "#4B74FF",
        borderWidth: 1,
        color: "#4B74FF"
    },
    dateShow: {
        height: 48,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomColor: "#E8E8E8",
        borderBottomWidth: 1
    },
    buText: {
        padding: 9,
        paddingLeft: 14,
        paddingRight: 16,
        backgroundColor: "#F6F6F6",
        marginRight: 8,
        borderRadius: 15,
        fontSize: 12
    },
    echartsCon: {
        marginTop: 7,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
    },
    echartsView: {
        marginTop: 10,
        width: (width-42)/2,
        height: 93,
        position: "relative",
        backgroundColor: '#F6F6F6',
    },
    echartsText: {
        color: "white",
        fontSize: 22,
        fontWeight: "600",
        position: "absolute",
        top: 0,
        left: 0
    },
    echartsTitle: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        height: '100%',
        width: '100%',
        paddingLeft: '30%'
    },
    items: {
        marginTop: 12,
        width: "100%",
        backgroundColor: "white",
        paddingLeft: 16,
        paddingRight: 14,
        borderRadius: 9,
        marginBottom: 50
    },
    item: {
        height: 49,
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',
        borderBottomColor:"#F1F1F1",
        borderBottomWidth: 1,
        justifyContent: 'space-between',
    },
    itemAbout:{
        display: 'flex',
        flexDirection: "row",
        alignItems: "center",
    },
    itemText:{
        fontSize: 14,
        color: "#333333",
    },
});
