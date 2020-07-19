import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Modal} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-datepicker';
import {ECharts} from 'react-native-echarts-wrapper';
import moment from 'moment';
import Picker from 'react-native-wheel-picker';
import { connect } from 'react-redux';

import troubleService from '../../service/troubleService';
import Header from '../../components/header';
import TrackList from './TroubleTrack/TrackList';
import { parseTime } from '../../utils/handlePhoto';

const PickerItem = Picker.Item;
const {width, height} = Dimensions.get('window');
class TroubleLog extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state= {
        date: moment(new Date().getTime()-2592000000).format("YYYY-MM-DD"),
        date1: moment(new Date().getTime()).format("YYYY-MM-DD"),
        showPicker: false,
        typeData: {
            index: 0,
            fId: '',
            fName: '全部'
        },
        changeData: {},
        pickerList: [],
        pickerType: 0, // 0：是级别 1：是类型
        itemList: [],
        option1: {
            title: {
                text: '10处',
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
                        {value:10, itemStyle: {
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
                        {value:100, itemStyle: {
                            color: '#F3F3F3'
                        }},
                        
                    ]
                }
            ]
        },
        option2: {
            title: {
                text: '0处',
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
                        {value:0 , itemStyle: {
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
                        {value:100, itemStyle: {
                            color: '#F3F3F3'
                        }},
                        
                    ]
                }
            ]
        },
        option3: {
            title: {
                text: '14处',
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
                        {value:14, itemStyle: {
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
                        {value:100, itemStyle: {
                            color: '#F3F3F3'
                        }},
                        
                    ]
                }
            ]
        },
        option4: {
            title: {
                text: '5处',
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
                                    color: '#F74747' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#FC676E' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
    
                        }},
                        {value:100, itemStyle: {
                            color: '#F3F3F3'
                        }},
                        
                    ]
                }
            ]
        },
        optionArr: []
    }

    componentDidMount() {
        this.getStatistics();
    }

    //picker确认改值
    onPickerSelect = () => {
        const { levelData, typeData, pickerType, itemList, changeData } = this.state;
        const data = changeData;
		this.setState({
            showPicker: false,
            typeData: {
                index: 0,
                fName: data.fName,
                fId: data.fId
            },
		}, ()=>this.getStatistics())
    }

    // picker滚动的时候改值
    onPickerChange = (index) => {
        const { changeData, itemList } = this.state;
        this.setState({
            changeData: itemList[index]
        });
    }

    // 展开选择隐患级别
    showTroubleType = () => {
        const { typeData } = this.state;
        const selectList = this.props.troubleType.map((data, index)=>{
            return {
                index: index + 1,
                fId: data.fId,
                fName: data.fTypeName
            }
        });
        selectList.unshift({index: 0, fId: '', fName: '全部'});
        this.setState({
            itemList: selectList,
            pickerList: selectList.map((data)=>(data.fName)),
            changeData: selectList[typeData.index],
            showPicker: true,
            pickerType: 0
        })
    }

    getStatistics = async () => {
        const { typeData, date, date1} = this.state;
        const res = await troubleService.selectLogNumByLevel({
            fStartTime: parseTime(this.state.date),
            fEndTime: parseTime(this.state.date1+' 23:59:00'),
            fTypeId: typeData.fId
        });
        console.log('统计查询',res)
        if (res.success) {
            let arr = []
            if (!res.obj) return;
            let allNum = 0;
            for (let obj of res.obj) {
                allNum = obj.num + allNum;
            }
            for (let obj of res.obj) {
                arr.push({
                    name: obj.fLevelName,
                    option: {
                        title: {
                            text: obj.num+'处',
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
                                    {value:obj.num, itemStyle: {
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
                                    {value: obj.num ? allNum - obj.num : 1, itemStyle: {
                                        color: '#F3F3F3'
                                    }},
                                    
                                ]
                            }
                        ]
                    }
                })
            }
            this.setState({
                optionArr: []
            }, ()=>{
                this.setState({
                    optionArr: arr
                })
            })
            
        }
    }
    

    headerComponent = () => {
        return (
            <View style={styles.content}>
                <View style={{borderRadius: 4,borderWidth: 1,borderWidth: 1,borderColor: '#fff'}}>
                    <View style={[styles.itemStyle]}>
                        <Image source={require('../../image/workStatus/start.png')} style={{marginRight: 10}}/>
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
                                onDateChange={(date) => {this.setState({date: date}, ()=>this.getStatistics())}}
                            />
                        </View>
                    </View> 
                    <View style={styles.itemStyle}>
                        <Image source={require('../../image/workStatus/stop.png')} style={{marginRight: 10}}/>
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
                                onDateChange={(date) => {this.setState({date1: date}, ()=>this.getStatistics())}}
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.itemStyle, {paddingBottom: 5}]} onPress={this.showTroubleType}>
                        <Image source={require('../../image/workStatus/user-group-fill.png')} style={{marginRight: 10}}/>
                        <View style={[styles.contentView,{borderBottomWidth: 0}]}>
                            <Text>隐患类型</Text>
                            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                <Text style={{color: '#999',marginRight: 2}}>{this.state.typeData.fName}</Text>
                                <AntDesign name="right" color="#C1C1C1"/>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.pannelView}>
                    <Text style={{fontSize: 16,color: '#000',fontWeight: 'bold',marginLeft: 10,marginTop: 10}}>统计</Text>
                    <View style={{ flexDirection: 'row',paddingBottom: 15,flexWrap: 'wrap'}}>
                        {
                            this.state.optionArr.map((data,index)=>{
                                return (
                                    <View key={index} style={styles.echartsView}>
                                        <ECharts option={data.option}/>
                                        <View style={styles.hideLine}/>
                                        <Text style={styles.echartsText}>{data.name + '隐患'}</Text>
                                    </View>
                                )
                            })
                        }
                    </View>
                    
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="隐患日志"
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
                                    this.setState({
                                        showPicker: false,
                                        changeData: {}
                                    })
                                }}
                                >
                                <Text style={{ fontSize: 14, color: '#508DCE' ,marginLeft: 8}}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.onPickerSelect}
                                >
                                <Text style={{ fontSize: 14, color: '#508DCE' ,marginRight: 8 }}>确定</Text>
                                </TouchableOpacity>
                            </View>
                            <Picker
                                style={{ width: width, height: 180 }}
                                itemStyle={{ color: 'black', fontSize: 22 }}
                                selectedValue={this.state.typeData.index}
                                onValueChange={(index) => this.onPickerChange(index)}>
                                    {this.state.pickerList.map((value, i) => (
                                        <PickerItem label={value} value={i} key={value}/>
                                    ))}
                            </Picker>
                        </View>
                    </View>
                </Modal>
                <View style={{flex: 1}}>
                    <TrackList 
                        ListHeaderComponent={this.headerComponent()}
                        state={[6]}
                        typeByItem={true}
                        type={this.state.typeData.fId}
                        fReportBeginTime={parseTime(this.state.date)}
                        fReportEndTime={parseTime(this.state.date1+' 23:59:00')}
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    troubleType: state.troubleReducer.troubleType
});

export default connect(mapStateToProps)(TroubleLog);

const styles = StyleSheet.create({
      hideLine: {
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: '#fff',
        position: 'absolute',
        bottom: 13
      },
    echartsView: {
        width: (width - 30)/4,
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
    },
     //picker
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
});
