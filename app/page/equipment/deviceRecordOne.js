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
class DeviceRecordOne extends Component {
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
        option4: null,
        nums: 0,
        type: 2, // 显示不同内容,  2: 设备的巡检记录 3：整体的巡检记录 4: 个人的巡检记录
        showMoreSearch: false,
        detail: {},
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
      if (this.props.navigation.state.params && this.props.navigation.state.params.type) {
        this.setState({
          type: this.props.navigation.state.params.type,
          detail: this.props.navigation.state.params.detail,
        }, ()=>{
            this.fetchRecordList();
        })
      }
    }

    onRefresh = () => {
        this.fetchRecordList();
    }

    // 查询巡检记录
    fetchRecordList = async () => {
      console.log(this.state.detail, 'this.state.detail');
        const colors = ['#51D292', '#68B6FD', '#FFDB5C', '#FF9F7F', '#DE34CB', '#DE3443']
        this.setState({refreshing: true})
        const res = await deviceServer.selectCheckUpListByOneDevice({
            endTime: parseTime(this.state.date1),
            startTime: parseTime(this.state.date),
            fEquipmentId: this.state.detail.fId,
            fUserId: this.state.selectPeople.fId ? this.state.selectPeople.fId : ""
        });
        console.log('查询单设备巡检记录', res);
        this.setState({refreshing: false})
        if (res.success) {
          this.setState({
              dataSource: res.obj.taskAndDevice,
          });
          let param = {};
            for (let obj of res.obj.classNameAndClassNumRes) {
                param[obj.shiftName] = obj.midClassAnomaly;
            }
            this.setState({
                option4: null
            } ,()=>this.setState({
                nums: res.obj.allDeviceNum,
                option4: {
                    tooltip : {
                       show: false
                    },
                    legend: {
                        orient: 'vertical',
                        right: 30,
                        top: '25%',
                        bottom: 20,
                        data: res.obj.classNameAndClassNumRes.map((data)=>(data.shiftName + ' ' + data.midClassAnomaly)),
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
                            data: res.obj.classNameAndClassNumRes.map((data, index)=>{
                                return {
                                    value: data.midClassAnomaly,
                                    name: data.shiftName + ' ' + data.midClassAnomaly,
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

    renderItem = ({item}) => { 
        const { type } = this.state;
        return (
            <TouchableOpacity 
              style={[styles.recordDetail, {borderBottomColor: '#f1f1f1',borderBottomWidth: 1}]} 
              onPress={() => {this.props.navigation.navigate('RecordDetailOne',{item: item,detail: this.state.detail, userId: this.state.selectPeople.fId})}}>
                <View style={styles.rowStyle}>
                    <Text style={styles.recordLabel}>巡检时间</Text> 
                    <Text style={styles.recordValue}>{parseDate(parseTime(item.inspectionTime), 'YYYY.MM.DD')}</Text> 
                </View>
                <View style={styles.rowStyle}>
                    <Text style={styles.recordLabel}>巡检人</Text> 
                    <Text style={[styles.recordValue, {flex: 1}]}>{item.fUserName}</Text> 
                </View>
                <View style={styles.rowStyle}>
                    <Text style={styles.recordLabel}>巡检次数</Text> 
                    <Text style={styles.recordValue}>{item.todayInspectionNum}</Text> 
                </View>
                <View style={styles.rowStyle}>
                    <Text style={styles.recordLabel}>异常情况</Text> 
                    <Text style={[styles.recordValue, {color: item.abnormalNum > 0 ? 'red' : '#1ACFAA'}]}>{item.abnormalNum}</Text> 
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
        });
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
                <ScrollView style={styles.content}>
                  <View style={{padding: 10,borderRadius: 4}}>
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
                    { showMoreSearch ? 
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
                      <TouchableOpacity onPress={()=>this.setState({showMoreSearch: !showMoreSearch})} style={{justifyContent: 'center',alignItems: 'center',backgroundColor:'#fff',paddingTop: 5,paddingBottom: 5}}>
                          <AntDesign name={showMoreSearch ? 'up' : 'down'}/>
                      </TouchableOpacity>
                  </View>
                    {this.state.type == 2 && option4 ? 
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
                    <View style={{backgroundColor: '#fff',margin: 10,borderRadius: 4,marginTop: 0}}>
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
                            refreshing={this.state.refreshing}
                            data={this.state.dataSource}
                            renderItem={this.renderItem}
                            ListEmptyComponent={<Text style={{textAlign: 'center',color: '#c9c9c9', height: 70,justifyContent: 'center',lineHeight: 70}}>暂无数据</Text>}
                            ItemSeparatorComponent={()=>(<View style={{height: 10,backgroundColor: '#F6F6F6'}}/>)}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        fEmployeeId: state.userReducer.userInfo.fEmployeeId,
    }
};

export default connect(mapStateToProps)(DeviceRecordOne);

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
