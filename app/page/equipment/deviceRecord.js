import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity,RefreshControl, ScrollView, Image, Modal, FlatList, ActivityIndicator} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-datepicker';
import {ECharts} from 'react-native-echarts-wrapper';
import moment from 'moment';
import Picker from 'react-native-wheel-picker';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';

import deviceServer from '../../service/deviceServer';
import Header from '../../components/header';
import Toast from '../../components/toast';
import SelectModal from '../../components/selectModal';
import { parseTime, parseDate } from '../../utils/handlePhoto';

const PickerItem = Picker.Item;
const {width, height} = Dimensions.get('window');
class DeviceRecord extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state= {
        date: moment(new Date().getTime()-2592000000).format("YYYY-MM-DD"),
        date1: moment(new Date().getTime()).format("YYYY-MM-DD"),
        typeData: {
            index: 0,
            fId: '',
            fName: '全部'
        },
        option1: {
            title: {
                text: '3次',
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
                        {value:5, itemStyle: {
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
                        {value:5, itemStyle: {
                            color: '#F3F3F3'
                        }},
                        
                    ]
                }
            ]
        },
        option2: {
            title: {
                text: '3次',
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
                        {value:5 , itemStyle: {
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
                        {value:5, itemStyle: {
                            color: '#F3F3F3'
                        }},
                        
                    ]
                }
            ]
        },
        option3: {
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
                        {value:5, itemStyle: {
                            color: '#F3F3F3'
                        }},
                        
                    ]
                }
            ]
        },
        option4: null,
        nums: 0,
        type: 2, // 显示不同内容,  2: 设备的巡检记录 3：整体的巡检记录 4: 个人的巡检记录
        showMoreSearch: false,
        abnormalList: [{fId: null, fName: '不限'}, {fId: true, fName: '有异常情况'}, {fId: false, fName: '无异常情况'}],
        abnormalType: {
            fId: null,
            fName: '不限'
        },
        routeType: {
            fId: null,
            fName: '不限'
        },
        selectPeople: {
            fId: null,
            fName: '不限'
        },
        pickerList: [],
        itemList: [],
        dataSource: [],
        pageCurrent: 1,
        pageSize: 10,
        refreshing: false,
        loadingMore: false,
        canLoadMore: true,
        showRoutePicker: false,
        showRouteAbnormal: false,
    }

    componentDidMount() {
      SplashScreen.hide();
      this.selectRouteTask();
      if (this.props.navigation.state.params && this.props.navigation.state.params.type) {
        this.setState({
          type: this.props.navigation.state.params.type
        }, ()=>{
            this.fetchRecordList();
            this.fetchEcharts();
        })
      }
    }

    // 获取路线任务数据
    selectRouteTask = async () => {
        global.loading.show();
        const res = await deviceServer.selectCheckUpList();
        global.loading.hide();
        console.log('获取路线任务数据', res);
        if (res.success) {
            this.setState({
                pickerList: ['不限', ...res.obj.map((data)=>(`${data.fPatrolTaskTitle}-${data.fPatrolRouteName}`))],
                itemList: [{fPatrolTaskId: null, namename: '不限'}, ...res.obj]
            });
        } else {
            Toast.show(res.msg);
        }
    }

    onRefresh = () => {
        this.setState({
            pageCurrent: 1
        },()=>{
            this.fetchRecordList();
            this.fetchEcharts();
        })
    }

    // 选择路线
    selectRoute = (data) => {
        this.setState({
            routeType: {
                fName: data.namename ? data.namename : `${data.fPatrolTaskTitle}-${data.fPatrolRouteName}`,
                fId: data.fPatrolTaskId
            },
            pageCurrent: 1
        }, ()=>this.onRefresh());
    }

    // 选择异常情况
    selectAbnormal = (data) => {
        this.setState({
            abnormalType: data,
            pageCurrent: 1
        }, ()=>this.onRefresh());
    }

    // 查询图表数据
    fetchEcharts = async () => {
        const colors = ['#51D292', '#68B6FD', '#FFDB5C', '#FF9F7F', '#DE34CB', '#DE3443']
        const { pageCurrent, pageSize, dataSource, abnormalType, routeType } = this.state;
        const res = await deviceServer.getRecordEcharts({
            endTime: parseTime(this.state.date1),
            startTime: parseTime(this.state.date),
            fIsAbnormal: abnormalType.fId,
            fPatrolRouteId: routeType.fId,
            fUserIdList: this.state.type == 4 ? [this.props.fEmployeeId] : this.state.selectPeople.fId ? [this.state.selectPeople.fId] : []
        });
        console.log('查询图表数据', res);
        if (res.success) {
            let param = {};
            let num = 0;
            for (let obj of res.obj) {
                param[obj.name] = obj.value;
                num = num + obj.value;
            }
            this.setState({
                option4: null
            } ,()=>this.setState({
                nums: num,
                option4: {
                    tooltip : {
                       show: false
                    },
                    legend: {
                        orient: 'vertical',
                        right: 30,
                        top: '25%',
                        bottom: 20,
                        data: res.obj.map((data)=>(data.name + ' ' + data.value)),
                        // formatter: function (name, value) {
                        //         return name + '' +` ${param[name]}`;
                        // },
                        itemGap: 5,
                        itemHeight: 10,
                        textStyle: {
                            fontSize: 10
                        }
                    },
                    series : [
                        {
                            name: '姓名',
                            type: 'pie',
                            radius : '65%',
                            center: ['35%', '50%'],
                            data: res.obj.map((data, index)=>{
                                return {
                                    value: data.value,
                                    name: data.name + ' ' + data.value,
                                    itemStyle: {
                                        color: colors[index]
                                    }
                                }
                            }),
                            label: {
                                show: false  
                            },
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                }
            }))
            
        } else {
            Toast.show(res.msg);
        }
    }

    // 查询巡检记录
    fetchRecordList = async () => {
        const { pageCurrent, pageSize, dataSource, abnormalType, routeType } = this.state;
        if (pageCurrent == 1) {
            this.setState({refreshing: true});
        }
        const res = await deviceServer.selectCheckUpListByPage({
            endTime: parseTime(this.state.date1),
            startTime: parseTime(this.state.date),
            pageCurrent: pageCurrent,
            pageSize: pageSize,
            fIsAbnormal: abnormalType.fId,
            fPatrolRouteId: routeType.fId,
            fUserIdList: this.state.type == 4 ? [this.props.fEmployeeId] : this.state.selectPeople.fId ? [this.state.selectPeople.fId] : []
        });
        this.setState({refreshing: false, loadingMore: false})
        console.log('查询巡检记录', res);
        if (res.success) {
          let dataArr = [];
          if (pageCurrent == 1) {
              // 如果当前页是第一页则直接拿传过来的数据
              dataArr = res.obj.items;
          } else {
              // 如果当前页不是第一页则需要拼接
              dataArr = dataSource.concat(res.obj.items);
          }
          // 判断是否可以加载更多
          let canLoadMore = true;
          if (dataArr.length >= res.obj.itemTotal) {
              canLoadMore = false;
          }
          this.setState({
              dataSource: dataArr,
              canLoadMore: canLoadMore
          });
        } else {
          Toast.show(res.msg);
        }
      }

    // 加载更多时脚部组件
    footerComponent = () => {
        const { loadingMore, dataSource, canLoadMore } = this.state;
        if (dataSource.length == 0) {
            return null;
        }
        let moreText = '上拉加载更多数据';
        if (loadingMore) {
            moreText = '正在加载更多数据'
        } else {
            if (!canLoadMore) {
                moreText = '暂无更多数据' 
            }
        }
        return (
            <View style={styles.footerView}>
                {loadingMore ? <ActivityIndicator color="#000"/> : null}
                <Text style={{ color: '#999' }}>
                    {moreText}
                </Text>
            </View>
        )
    }

    // 加载更多
    loadMore = () => {
        const { refreshing, loadingMore, canLoadMore, pageCurrent} = this.state;
        console.log(123123123);
        // 当正在刷新 正在加载更多 不能加载更多的时候不能 触发加载更多
        if (refreshing || loadingMore || !canLoadMore) {
            return;
        }
        this.setState({
            loadingMore: true,
            pageCurrent: pageCurrent + 1
        }, () => this.fetchRecordList())
      }

    renderItem = ({item}) => { 
        const { type } = this.state;
        return (
            <TouchableOpacity style={[styles.recordDetail, {borderBottomColor: '#f1f1f1',borderBottomWidth: 1,backgroundColor: '#fff',marginRight: 10,marginLeft: 10}]} onPress={() => {this.props.navigation.navigate('RecordDetail',{item: item,type: type,name: this.props.navigation.state.params.name?this.props.navigation.state.params.name : ''})}}>
                <View style={styles.rowStyle}>
                    <Text style={styles.recordLabel}>巡检时间</Text> 
                    <Text style={styles.recordValue}>{parseDate(parseTime(item.fPatrolTaskDate), 'YYYY.MM.DD')}</Text> 
                </View>
                <View style={styles.rowStyle}>
                    <Text style={styles.recordLabel}>巡检路线</Text> 
                    <Text style={styles.recordValue}>{item.fPatrolRouteName || '--'}</Text> 
                </View>
                <View style={styles.rowStyle}>
                    <Text style={styles.recordLabel}>巡检人</Text> 
                    <Text style={[styles.recordValue, {flex: 1}]}>{item.tEquipmentPatrolTaskUserList ? item.tEquipmentPatrolTaskUserList.map((data)=>(data.fUserName)).join(','): '--'}</Text> 
                </View>
                <View style={styles.rowStyle}>
                    <View style={{flexDirection: 'row', alignItems: 'center',flex: 1}}>
                        <Text style={styles.recordLabel}>巡检次数</Text> 
                        <Text style={styles.recordValue}>{item.fPatrolTaskRecordNum}</Text> 
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center',flex: 1}}>
                        <Text style={styles.recordLabel}>异常情况</Text> 
                        <Text style={[styles.recordValue, {color: item.abnormalNum > 0 ? 'red' : '#1ACFAA'}]}>{item.abnormalNum}</Text> 
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    // 选择人员
    chooseReportPerson = () => {
        this.props.navigation.navigate('selectPeopleByDep',{surePeople: this.getReportPeople})
    }

    // 获取选中巡检人数据
    getReportPeople = (data) => {
        console.log('people', data);
        this.setState({
            selectPeople: {fId: data.fId, fName: data.fUserName}
        },() => {
            this.onRefresh();
            this.fetchEcharts();
        });
    }

    headerComponent = () => {
        const { showMoreSearch, option4 } = this.state;
        return (
            <View>
                <View style={{padding: 10,borderRadius: 4,marginBottom: 10}}>
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
                                onDateChange={(date) => {this.setState({date: date, pageCurrent: 1}, ()=>this.onRefresh())}}
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
                                onDateChange={(date) => {this.setState({date1: date, pageCurrent: 1}, ()=>this.onRefresh())}}
                            />
                        </View>
                    </View>
                { showMoreSearch && (this.state.type == 2 || this.state.type == 3) ? 
                    <TouchableOpacity style={[styles.itemStyle, {paddingBottom: 5}]} onPress={this.chooseReportPerson}>
                        <Image source={require('../../image/workStatus/user-group-fill.png')} style={{marginRight: 10}}/>
                        <View style={[styles.contentView]}>
                            <Text>巡检人</Text>
                            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                <Text style={{color: '#999',marginRight: 2}}>{this.state.selectPeople ? this.state.selectPeople.fName : '不限'}</Text>
                                {
                                    this.state.selectPeople.fId ? 
                                    <TouchableOpacity onPress={()=>this.setState({ selectPeople: {fId: null, fName: '不限'}}, ()=>this.onRefresh())}>
                                        <AntDesign name="closecircleo" size={12} style={{ color: '#C1C1C1' }} />
                                    </TouchableOpacity>
                                    :
                                    <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1' }}/>
                                }
                            </View>
                        </View>
                    </TouchableOpacity>: null }
                { showMoreSearch && (this.state.type == 3 || this.state.type == 4) ?
                    <TouchableOpacity style={[styles.itemStyle, {paddingBottom: 5}]} onPress={()=>this.setState({showRoutePicker: true})}>
                        <Image source={require('../../image/workStatus/handshake.png')} style={{marginRight: 10}}/>
                        <View style={[styles.contentView]}>
                            <Text>巡检路线</Text>
                            <View style={{flexDirection: 'row',alignItems: 'flex-end'}}>
                                <Text style={{color: '#999',marginRight: 2, width: (width/4)*2, textAlign: 'right' }} numberOfLines={1}>{this.state.routeType.fName}</Text>
                                <AntDesign name="right" color="#C1C1C1"/>
                            </View>
                        </View>
                    </TouchableOpacity>
                        : null}
                    <TouchableOpacity onPress={()=>this.setState({showMoreSearch: !showMoreSearch})} style={{justifyContent: 'center',alignItems: 'center',backgroundColor:'#fff',paddingTop: 5,paddingBottom: 5}}>
                        <AntDesign name={showMoreSearch ? 'up' : 'down'}/>
                    </TouchableOpacity>
                </View>
                {(this.state.type == 2 || this.state.type == 3) && option4 ? 
                    <View style={styles.pannelView}>
                        <View style={styles.rowTextView}>
                        <Text style={{fontSize: 16,color: '#000',width: '100%',textAlign: 'center',marginTop:5}}>巡检总数：{this.state.nums}</Text>
                        </View>
                        <View style={{ height: 180,flexDirection: 'row',paddingBottom: 15,flexWrap: 'wrap',borderBottomColor: '#f0f0f0'}}>
                            <View style={{flex: 1,position: 'relative'}}>
                                <ECharts option={this.state.option4}/>
                            </View>
                        </View>
                    </View> : null}
            </View>
        )
    }

    render() {
        const { showMoreSearch, option4 } = this.state;
        console.log(option4)
        
         return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText={'巡检记录'}
                    props={this.props}
                />
                <SelectModal 
                    showPicker={this.state.showRoutePicker}
                    onCancel={()=>this.setState({showRoutePicker: false})}
                    onOK={this.selectRoute}
                    pickerList={this.state.pickerList}
                    itemList={this.state.itemList}
                />
                <SelectModal 
                    showPicker={this.state.showRouteAbnormal} 
                    onCancel={()=>this.setState({showRouteAbnormal: false})}
                    onOK={this.selectAbnormal}
                    pickerList={['不限', '有异常情况', '无异常情况']}
                    itemList={this.state.abnormalList}
                />
                <View style={styles.content,{paddingBottom: 80}}>
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                title={'Loading'}
                                colors={['#000']}
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                            />
                        } 
                        ListHeaderComponent={this.headerComponent}
                        ListFooterComponent={this.footerComponent}
                        refreshing={this.state.refreshing}
                        data={this.state.dataSource}
                        renderItem={this.renderItem}
                        ListEmptyComponent={<Text style={{textAlign: 'center',color: '#c9c9c9', height: 70,justifyContent: 'center',lineHeight: 70}}>暂无数据</Text>}
                        onEndReachedThreshold={0.1}
                        onEndReached={this.loadMore}
                        ItemSeparatorComponent={()=>(<View style={{height: 10,backgroundColor: '#F6F6F6'}}/>)}
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        fEmployeeId: state.userReducer.userInfo.fEmployeeId,
    }
};

export default connect(mapStateToProps)(DeviceRecord);

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
        borderWidth: 1,
        borderColor: '#fff',
        margin: 10,
        borderRadius: 4,
        marginTop: 0
    },
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    content: {
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
    rowTextView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10,
      paddingRight: 10,
      paddingLeft: 10
    },
    recordDetail: {
      padding: 10,
      paddingTop: 10,
      paddingBottom: 15
    },
    rowStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10
    },
    recordLabel: {
      color: '#999',
    },
    recordValue: {
      color: '#333',
      marginLeft: 10
    },
    echartsCenterText: {
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        top: '35%'
    },
    footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 10,
        paddingBottom: 10
    }
});
