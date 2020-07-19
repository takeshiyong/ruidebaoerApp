import React, { Component } from 'react';
import { StyleSheet,ScrollView, Text, View, Dimensions, TouchableOpacity, FlatList,Image,RefreshControl,ActivityIndicator,ImageBackground} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {ECharts} from 'react-native-echarts-wrapper';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';

import deviceServer from '../../service/deviceServer';
import config from '../../config';
import Header from '../../components/header';
import Toast from '../../components/toast';
import { parseDate, parseTime } from '../../utils/handlePhoto';
const { width, height } = Dimensions.get('window');
class Manage extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
      checkUpList: [],
      taskList: []
    }

    componentDidMount() {
      SplashScreen.hide();
      this.getCheckUpList();
      this.getCheckUpTaskList();
    }

    // 获取以开始的巡检任务
    getCheckUpTaskList = async () => {
      const res = await deviceServer.selectCheckUpListByPage({
        orderParams: [{
            orderEnum: "DESC",
            paramEnum: "CREATE_TIME"
        }],
        pageCurrent: 1,
        pageSize: 2,
        fPatrolTaskState: 0
      });
      if (res.success) {
        this.setState({
          taskList: res.obj.items.map((data)=>{
            return {
              ...data,
              option: {
                  series: [
                    {
                        type: 'pie',
                        radius: ['85%', '100%'],
                        center: ['50%', '50%'],
                        labelLine:{show: false},
                        legendHoverLink: false,
                        hoverAnimation: false,
                        clockwise: false,
                        data:[
                            {value:data.fPatrolRecordNum,itemStyle:{normal:{color: '#FF9C4C'}}},
                            {value:data.fPatrolTaskRecordNum - data.fPatrolRecordNum,itemStyle:{normal:{color: '#E0E0E0'}}},
                        ],
                    }
                ]
              }
            }
          })
        })
      } else {
        Toast.show(res.msg);
      }
    }

    // 获取巡检路线数据
    getCheckUpList = async () => {
      const res = await deviceServer.getCheckUpList({
        pageSize: 2,
        pageCurrent: 1,
        orderParams: [{
          orderEnum: "DESC",
          paramEnum: "UPDATE_TIME"
        }]
      });
      console.log('获取巡检路线数据', res);
      if (res.success) {
        this.setState({
          checkUpList: res.obj.items
        });
      } else {
        Toast.show(res.msg);
      }
    }
    
    render() {
      const { typeList, taskList } = this.state;
        return (
          <View style={styles.container}>
            <Header 
              titleText="巡检管理"
              backBtn={true}
            />
            <ScrollView>
              <View style={styles.viewHeader}>
                <TouchableOpacity style={styles.touchBtn} onPress={()=>this.props.navigation.push('CreateCheckUp', {onRefresh: this.getCheckUpTaskList})}>
                  <Image source={require('../../image/checkUp/plus.png')} />
                  <Text style={{color: '#333',marginTop: 5}}>巡检创建</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchBtn}>
                  <Image source={require('../../image/checkUp/catch.png')} />
                  <Text style={{color: '#333',marginTop: 5}}>异常处理</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchBtn} onPress={()=>this.props.navigation.push('DeviceRecord', {type: 3})}>
                  <Image source={require('../../image/checkUp/static.png')} />
                  <Text style={{color: '#333',marginTop: 5}}>统计分析</Text>
                </TouchableOpacity>
              </View>
              <View style={{backgroundColor: '#fff', marginTop: 15,padding:  5,paddingRight: 15,paddingLeft: 15}}>
                <View style={[styles.rowView, {justifyContent: 'space-between',height: 30}]}>
                  <TouchableOpacity>
                    <Text style={{color: '#333',fontWeight: 'bold', fontSize: 16}}>巡检路线</Text>
                  </TouchableOpacity>
                  <View style={{flexDirection: 'row', alignItems: 'center',}}>
                    <TouchableOpacity onPress={()=>this.props.navigation.push('AddRoute', {onRefresh: this.getCheckUpList})}>
                      <Text style={{color: '#4058FD'}}>添加</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center',marginLeft: 10}}  onPress={()=>this.props.navigation.push('RouteList')}>
                      <Text style={{color: '#4058FD'}}>更多</Text>
                      <AntDesign name="right" color="#4058FD"/>
                    </TouchableOpacity>
                  </View>
                </View>
                { this.state.checkUpList.length > 0 ?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                  this.state.checkUpList.map((item, index)=>{
                    return (
                      <TouchableOpacity key={index} style={styles.luxianView} onPress={()=>this.props.navigation.push('RouteDetail', {item, onRefresh: this.getCheckUpList})}>
                        <View style={styles.rowView}>
                          <View style={{width: 5,height: 5,borderRadius: 50,backgroundColor: '#4B74FF'}}/>
                          <Text style={{color: '#333',marginLeft: 5}}>{item.fPatrolRouteName}</Text>
                        </View>
                        <View style={[styles.rowView, {flex: 1}]}>
                          <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
                            <Text style={{color: '#666',fontWeight: 'bold',fontSize: 16}}>{item.allEquipmentNum}</Text>
                            <Text style={{color: '#999', marginTop: 5,fontSize: 12}}>设备</Text>
                          </View>
                          <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
                            <Text style={{color: '#666',fontWeight: 'bold',fontSize: 16}}>{item.allCheckNum}</Text>
                            <Text style={{color: '#999', marginTop: 5,fontSize: 12}}>测项</Text>
                          </View>
                          <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
                            <Text style={{color: '#666',fontWeight: 'bold',fontSize: 16}}>{item.patrolCountNum}</Text>
                            <Text style={{color: '#999', marginTop: 5,fontSize: 12}}>已执(次)</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )
                  }):
                  <View style={{width: '100%',height: 50,justifyContent: 'center',alignItems: 'center'}}>
                    <Text >暂无数据</Text>
                  </View>
                }
              </View>
              <View style={{backgroundColor: '#fff', marginTop: 15,padding:  5,paddingRight: 15,paddingLeft: 15}}>
                <View style={[styles.rowView, {justifyContent: 'space-between',height: 30}]}>
                  <View >
                    <Text style={{color: '#333',fontWeight: 'bold', fontSize: 16}}>执行中巡检</Text>
                  </View>
                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center',marginLeft: 10}}  onPress={()=>this.props.navigation.push('CheckUpIngList')}>
                      <Text style={{color: '#4058FD'}}>更多</Text>
                      <AntDesign name="right" color="#4058FD"/>
                    </TouchableOpacity>
                </View>

                {taskList.length > 0 ? 
                  taskList.map((data, key)=>{
                    console.log(data);
                    return (
                      <View key={key} style={[styles.luxianView, {height: 168}]}>
                        <View style={styles.rowView}>
                          <View style={{width: 5,height: 5,borderRadius: 50,backgroundColor: '#4B74FF'}}/>
                          <Text style={{color: '#333',marginLeft: 5}}>{data.fPatrolTaskTitle}</Text>
                        </View>
                        <View style={styles.rowView}>
                          <View style={{flex: 1}}>
                            <View style={[{flex: 1,borderBottomWidth: 1,borderBottomColor: '#e0e0e0'}, styles.rowView]}>
                              <View style={{flex: 4,justifyContent: 'center',alignItems: 'center'}}>
                                <Text style={styles.valueText}>{data.equipmentNum}</Text>
                                <Text style={styles.labelText}>设备</Text>
                              </View>
                              <View style={{flex: 9,justifyContent: 'center',alignItems: 'center'}}>
                                <Text style={styles.valueText}>{data.checkItemNum}</Text>
                                <Text style={styles.labelText}>测项</Text>
                              </View>
                            </View>
                            <View style={[{flex: 1}, styles.rowView]}>
                              <View style={{flex: 4,justifyContent: 'center',alignItems: 'center'}}>
                                <Text style={styles.valueText}>
                                  {data.tEquipmentPatrolTaskUserList.length > 0 ? data.tEquipmentPatrolTaskUserList.length > 1 ? data.tEquipmentPatrolTaskUserList[0].fUserName+'等' : data.tEquipmentPatrolTaskUserList[0].fUserName : '--'}
                                </Text>
                                <Text style={styles.labelText}>巡检人</Text>
                              </View>
                              <View style={{flex: 9,justifyContent: 'center',alignItems: 'center'}}>
                                <Text style={styles.valueText}>{parseDate(parseTime(data.fPatrolTaskDate),'YYYY.MM.DD HH:mm')}</Text>
                                <Text style={styles.labelText}>任务结束时间</Text>
                              </View>
                            </View>
                          </View>
                          <View style={{width: 90, height: 140, paddingBottom: 20,alignItems: 'center',}}>
                            <TouchableOpacity onPress={()=>this.props.navigation.push('DeviceRecodsMap', {item: data})} style={{width: '80%',height: '70%',position: 'relative'}}>
                              <ECharts option={data.option} key={data.fPatrolTaskId}/>
                              <Text style={{position: 'absolute',width: '100%',textAlign: 'center',top: '37%',color: '#666',
                            fontWeight: 'bold',fontSize: 16}}>{data.fPatrolRecordNum}/{data.fPatrolTaskRecordNum}</Text>
                            </TouchableOpacity> 
                            {
                              data.fIsAbnormal ? 
                              <TouchableOpacity 
                                onPress={()=>{
                                  console.log('data', data);
                                  this.props.navigation.navigate('RecordDetail',{
                                    item: data,
                                    type: 3,
                                    fromAbnormal: true
                                  })}} 
                                style={{zIndex: 9999}}
                              >
                                <Text style={{color: '#F56767',width: 90,textAlign: 'center',zIndex: 999}}>查看异常</Text>
                              </TouchableOpacity>
                              : null
                            }
                            
                          </View>
                        </View>
                      </View>
                    )
                  }) : 
                  <View style={{width: '100%',height: 50,justifyContent: 'center',alignItems: 'center'}}>
                    <Text >暂无数据</Text>
                  </View> }
              </View>
            </ScrollView>
          </View>
        );
    }
}
const mapStateToProps = state => ({
  deviceTypes: state.deviceReducer.deviceTypes,
});

export default connect(mapStateToProps)(Manage);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F6F6F6'
    },
    viewHeader: {
      height: 108,
      width: '100%',
      backgroundColor: '#fff',
      flexDirection: 'row',
    },
    touchBtn: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    rowView: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    luxianView: {
      height: 107,
      width: '100%',
      borderBottomColor: '#e0e0e0',
      borderBottomWidth: 1,
      paddingTop: 10,
      paddingBottom: 10,
      paddingRight: 5,
      paddingLeft: 5
    },
    valueText: {
      color: '#666',
      fontWeight: 'bold',
      fontSize: 16
    },
    labelText: {
      color: '#999',
      marginTop: 5,
      fontSize: 12
    }
});
