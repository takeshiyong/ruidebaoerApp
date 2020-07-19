import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity,RefreshControl, ScrollView, Image, Modal, FlatList, ActivityIndicator} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-datepicker';
import {ECharts} from 'react-native-echarts-wrapper';
import moment from 'moment';
import Picker from 'react-native-wheel-picker';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';

import cameraServer from '../../service/cameraServer';
import Header from '../../components/header';
import Toast from '../../components/toast';
import SelectModal from '../../components/selectModal';
import { parseTime, parseDate } from '../../utils/handlePhoto';
import config from '../../config/index';


const PickerItem = Picker.Item;
const {width, height} = Dimensions.get('window');
const colors = ['#51D292', '#68B6FD']
class DeviceRecord extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state= {
        date: null,
        date1: null,
        option: {},
        type: 2, // 显示不同内容,  1: 设备的报警记录 2：整体的报警记录 
        dataSource: [1,2,3],
        pageCurrent: 1,
        pageSize: 10,
        refreshing: false,
        loadingMore: false,
        canLoadMore: true,
        derviceName: {
            fEquipmentName: '',
            fId: ''
        },
        itemTotal: 0,
    }

    componentDidMount() {
      SplashScreen.hide();
      if (this.props.navigation.state.params && this.props.navigation.state.params.type) {
        if(this.props.navigation.state.params.type == 1){
            this.setState({
                type: this.props.navigation.state.params.type,
                derviceName: {
                    fId: this.props.navigation.state.params.fVideoId
                }
              }, ()=>{
                  this.init();
              })
        }else{
            this.setState({
                type: this.props.navigation.state.params.type
              }, ()=>{
                  this.init();
              })
        }
        
      }
    }
    init = () => {
        this.fetchRecordList();
        this.selectAlarmTypeNumBySearch();
    }
    onRefresh = () => {
        const {date,date1} = this.state;
        if(date != null){
            if(new Date(date.replace(/-/g, '/')).getTime() < new Date().getTime()){
                Toast.show('开始时间不能小于当前时间，请核对');
                return;
            }
        }
        if(date != null&&date1 != null){
            if(new Date(date.replace(/-/g, '/')).getTime() >= new Date(date1.replace(/-/g, '/')).getTime()){
                Toast.show('开始时间不能大于等于结束时间，请核对');
                return;
            }
        }
        this.setState({
            pageCurrent: 1
        },()=>{
            this.fetchRecordList();
            this.selectAlarmTypeNumBySearch();
        })
    }
    //获取报警设备
    getValue = (value) => {
        console.log(value)
        this.setState({
            derviceName: {
                fEquipmentName: value.fName,
                fId: value.fVideoId
            },
        },() => {this.onRefresh()})
    }
    //根据条件查询各类型料径识别报警数
    selectAlarmTypeNumBySearch = async () => {
        const { pageCurrent, pageSize, dataSource} = this.state;
        const res = await cameraServer.selectAlarmTypeNumBySearch({
            "currentPage": pageCurrent,
            "fEndTime": this.state.date1?parseTime(this.state.date1):null,
            "fStartTime": this.state.date?parseTime(this.state.date):null,
            "fVideoId": this.state.derviceName.fId?this.state.derviceName.fId: '',
            "pageSize": pageSize
        });
        if (res.success) {
            let data = [];
            let foreignNum = {};
            foreignNum.value = res.obj.foreignNum;
            foreignNum.name = "异物数量";
            data.push(foreignNum);
            let largeNum = {};
            largeNum.value = res.obj.largeNum;
            largeNum.name = "大块数量";
            data.push(largeNum);
            this.setState({
                numObj: res.obj,
                
                option: {
                    tooltip : {
                        trigger: 'item',
                        position: ['30%', '50%'],
                        backgroundColor: 'rgba(75,116,255,0.5)',
                        formatter: "{b}"
                    },
                    legend: {
                        orient: 'vertical',
                        right: 30,
                        top: '35%',
                        bottom: 20,
                        data: data.map((data)=>(data.name + ' ' + data.value)),
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
                            data: data.map((data, index)=>{
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
            },() => {
                if (this.onRef) {
                    this.onRef.setOption(this.state.option)
                }
            })
        }else{
            console.log(res.msg);
        }
    }
    // 查询报警记录
    fetchRecordList = async () => {
        const { pageCurrent, pageSize, dataSource} = this.state;
        if (pageCurrent == 1) {
            this.setState({refreshing: true});
        }
        global.loading.show();
        const res = await cameraServer.selectAlarmRecordByPage({
            "currentPage": pageCurrent,
            "fEndTime": this.state.date1?parseTime(this.state.date1):null,
            "fStartTime": this.state.date?parseTime(this.state.date):null,
            "fVideoId": this.state.derviceName.fId?this.state.derviceName.fId: '',
            "pageSize": pageSize
        });
        global.loading.hide();
        this.setState({refreshing: false, loadingMore: false})
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
              canLoadMore: canLoadMore,
              itemTotal: res.obj.itemTotal
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
    headerComponent = () => {
        const {  derviceName } = this.state;
        return(<View>
            <View style={{padding: 10,borderRadius: 4}}>
                <View style={[styles.itemStyle]}>
                          <Image source={require('../../image/workStatus/start.png')} style={{marginRight: 10}}/>
                          <View style={styles.contentView}>
                              <Text>开始日期</Text>
                              <DatePicker
                                  style={{width: 150}}
                                  date={this.state.date}
                                  maxDate = {new Date()}
                                  mode="datetime"
                                  placeholder="请选择开始日期"
                                  format="YYYY-MM-DD HH:mm"
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
                                          marginLeft: 15,
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
                                  maxDate = {new Date()}
                                  minDate={this.state.date? moment(parseTime(this.state.date)+60000).format('YYYY-MM-DD HH:mm'): moment().format('YYYY-MM-DD HH:mm')}
                                  mode="datetime"
                                  format="YYYY-MM-DD HH:mm"
                                  placeholder="请选择结束日期"
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
                                          marginLeft: 15,
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
                {this.state.type == 2? 
                <TouchableOpacity style={[styles.itemStyle, {paddingBottom: 5}]} onPress={() =>this.props.navigation.push('DevicesCamera',{getValue: this.getValue})}>
                                <Image source={require('../../image/workStatus/cash-register.png')} style={{marginRight: 10}}/>
                                <View style={[styles.contentView,{marginLeft: 2,borderBottomWidth: 0}]}>
                                    <Text>保养设备</Text>
                                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                        <Text style={{color: '#999',marginRight: 2}}>{derviceName.fEquipmentName != ''?derviceName.fEquipmentName:'请选择保养设备'}</Text>
                                        <AntDesign name="right" color="#C1C1C1"/>
                                    </View>
                                </View>
                        </TouchableOpacity> : null
                }
            </View>
            {this.state.option ? 
                <View style={{paddingLeft: 10,paddingRight: 10,paddingTop: 10}}>
                    <View style={styles.pannelView}>
                        <View style={styles.rowTextView}>
                            <Text style={{fontSize: 16,color: '#000',width: '100%',textAlign: 'center',marginTop:5}}>大块异物占比分析</Text>
                        </View>
                        <View style={{ height: 180,flexDirection: 'row',paddingBottom: 15,flexWrap: 'wrap',borderBottomColor: '#f0f0f0'}}>
                            <View style={{flex: 1,position: 'relative'}}>
                                <ECharts option={this.state.option} ref={ref => this.onRef = ref}/>
                            </View>
                        </View>
                    </View> 
                </View>
            : null}
            <Text style={{color: "#333",fontWeight: "500",padding: 5,paddingLeft: 10}}>报警总数:   {this.state.itemTotal !=null ?this.state.itemTotal: '--'}</Text>
        </View>)
    }
    // 加载更多
    loadMore = () => {
        const { refreshing, loadingMore, canLoadMore, pageCurrent} = this.state;
        // 当正在刷新 正在加载更多 不能加载更多的时候不能 触发加载更多
        if (refreshing || loadingMore || !canLoadMore) {
            return;
        }
        this.setState({
            loadingMore: true,
            pageCurrent: pageCurrent + 1
        }, () => this.init())
      }

    renderItem = ({item}) => { 
        const { type } = this.state;
        return (
            <TouchableOpacity style={[styles.recordDetail, {borderBottomColor: '#f1f1f1',borderBottomWidth: 1}]} onPress={() => {this.props.navigation.navigate('ItemDetail',{item: item})}}>
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
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

   
    render() {
         return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText={'报警记录'}
                    props={this.props}
                />
                <View style={styles.content}>
                    <FlatList
                            refreshControl={
                                <RefreshControl
                                    title={'Loading'}
                                    colors={['#000']}
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />
                            } 
                            ListFooterComponent={this.footerComponent}
                            ListHeaderComponent = {this.headerComponent}
                            refreshing={this.state.refreshing}
                            data={this.state.dataSource}
                            renderItem={this.renderItem}
                            ListEmptyComponent={<Text style={{textAlign: 'center',color: '#999', fontWeight: '500', height: 70,justifyContent: 'center',lineHeight: 70}}>暂无数据</Text>}
                            onEndReachedThreshold={0.1}
                            onEndReached={this.loadMore}
                            ItemSeparatorComponent={()=>(<View style={{height: 1,backgroundColor: '#F6F6F6'}}/>)}
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
        backgroundColor: "#fff",
        borderRadius: 4,
        
    },
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    content: {
        backgroundColor: '#F4F4F4',
        paddingBottom: 80
    },
     //picker
    rowTextView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10,
      paddingRight: 10,
      paddingLeft: 10
    },
    recordDetail: {
      paddingLeft: 10,
      paddingRight: 10
      
    },
    footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 10,
        paddingBottom: 10
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
