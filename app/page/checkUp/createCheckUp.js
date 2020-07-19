import React, { Component } from 'react';
import { StyleSheet,ScrollView, Text, View, Dimensions, TouchableOpacity, FlatList,Image,TextInput,RefreshControl,ActivityIndicator,ImageBackground, Modal} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {ECharts} from 'react-native-echarts-wrapper';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import DatePicker from 'react-native-datepicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Picker from 'react-native-wheel-picker';

import deviceServer from '../../service/deviceServer';
import config from '../../config';
import Header from '../../components/header';
import Toast from '../../components/toast';
import SelectPeople from '../../components/selectPeople';
import { parseTime } from '../../utils/handlePhoto';
const { width, height } = Dimensions.get('window');
const PickerItem = Picker.Item;
class CreateCheckUp extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });

    state = {
      route: {
        fId: '',
        fName: '请选择巡检路线',
        index: 0
      },
      nums: '',
      time: null,
      peopleArr: [],
      changeData: {},
      pickerList: [],
      showPicker: false,
      paramList: [],
    }

    componentDidMount() {
      SplashScreen.hide();
      this.getRouteList();
    }

    // 查询所有路线
    getRouteList = async () => {
      global.loading.show();
      const res = await deviceServer.selectRouteAll({});
      global.loading.hide();
      console.log('res', res);
      if (res.success) {
        this.setState({
          pickerList: res.obj.map((data)=>(data.fPatrolRouteName)),
          paramList: res.obj
        })
      }
    }

    // 滚动路线
    onPickerChange = (index) => {
      const { paramList } = this.state;
      this.setState({
        changeData: paramList[index]
      })
    }

    // 选中路线
    onPickerSelect = () => {
      const { paramList, changeData } = this.state;
      this.setState({
        showPicker: false,
        route: {
          fId: changeData.fPatrolRouteId,
          fName: changeData.fPatrolRouteName,
          index: 0
        }
      });
    }

    // 创建巡检
    addCheckUp = async () => {
      const { route, nums, time, peopleArr} = this.state;
      if (route.fId.length == 0) {
        Toast.show('巡检路线不能为空');
        return;
      }  
      if (nums.trim().length == 0) {
        Toast.show('巡检次数不能为空');
        return;
      }
      if (isNaN(nums * 1)) {
        Toast.show('巡检次数只能是数字');
        return;
      }
      if (!time) {
        Toast.show('巡检时间不能为空');
        return;
      }
      if (peopleArr.length == 0) {
        Toast.show('巡检人不能为空');
        return;
      }
      global.loading.show();
      const res = await deviceServer.createCheckUpTask({
        fPatrolRouteId: route.fId,
        fPatrolTaskDate: parseTime(time),
        fPatrolTaskRecordNum: nums * 1,
        fUserIdList: peopleArr.map((data)=>(data.fId))
      })
      global.loading.hide();
      if (res.success) {
        Toast.show(res.msg);
        const { state, goBack } = this.props.navigation;
        state.params && state.params.onRefresh && state.params.onRefresh();
        goBack();
      } else {
        Toast.show(res.msg);
      }
    }

    render() {
      const { route, nums } = this.state;
        return (
          <View style={styles.container}>
            <Header 
              titleText="巡检创建"
              backBtn={true}
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
                            selectedValue={this.state.selectedItem}
                            onValueChange={(index) => this.onPickerChange(index)}>
                            {this.state.pickerList.map((value, i) => (
                                <PickerItem label={value} value={i} key={value}/>
                            ))}
                        </Picker>
                    </View>
                </View>
            </Modal>
            <ScrollView>
              <View style={{padding: 10}}>
                <TouchableOpacity style={styles.headerView} onPress={()=>this.setState({showPicker: true})}>
                  <View style={styles.rowStyle}>
                    <Image source={require('../../image/deviceParam/route.png')} />
                    <Text style={{color: '#333', marginLeft: 5,fontWeight: "600"}}><Text style={{color: 'red'}}>*</Text>巡检路线</Text>
                  </View>
                  <View style={styles.rowStyle}>
                    <Text style={{color: '#666', marginRight: 10}}>{route.fName}</Text>
                    <AntDesign name={'right'} color="#666"/>
                  </View>
                </TouchableOpacity>
                <View style={styles.headerView}>
                  <View style={styles.rowStyle}>
                    <Image source={require('../../image/deviceAdd/24gf-appsBig.png')} />
                    <Text style={{color: '#333', marginLeft: 5,fontWeight: "600"}}><Text style={{color: 'red'}}>*</Text>巡检次数</Text>
                  </View>
                  <View style={[styles.rowStyle, {flex: 1,paddingRight: 13}]}>
                    <TextInput 
                      value={nums}
                      onChangeText={(text)=>this.setState({nums: text})}
                      style={{padding: 0,flex: 1,color: '#666',fontSize: 14,textAlign: 'right'}}
                      placeholder={'请输入巡检次数'}
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                    />
                    { nums.length == 0 ? <View style={{width: 10}}/> : <Text style={{color: '#666',marginRight: 10}}>次</Text> }
                  </View>
                </View>
                <TouchableOpacity style={styles.headerView}>
                  <View style={styles.rowStyle}>
                    <Image source={require('../../image/deviceAdd/date.png')} />
                    <Text style={{color: '#333', marginLeft: 5,fontWeight: "600"}}><Text style={{color: 'red'}}>*</Text>巡检时间</Text>
                  </View>
                  <View style={[styles.rowStyle, {flex: 1}]}>
                    <DatePicker
                        style={{width: '100%',height: 20}}
                        date={this.state.time}
                        mode="date"
                        placeholder="请选择巡检时间"
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
                                paddingRight: 2,
                                marginTop: -20
                            },
                            dateText: {
                                color: '#666'
                            },
                            placeholderText: {
                                color: '#666'
                            }
                        }}
                        iconComponent={<AntDesign name="right" size={12} style={{ color: '#666',marginLeft: 10, marginTop: -18 }}/>}
                        onDateChange={(date) => {this.setState({time: date})}}
                    />
                  </View>
                </TouchableOpacity>
                <View style={{paddingTop: 15,backgroundColor: '#fff',paddingBottom: 5,paddingLeft: 15,paddingRight: 10}}>
                    <SelectPeople required={true} title="巡检人" value={this.state.peopleArr} onChange={(arr)=>this.setState({peopleArr: arr})}/>
                </View>
                <TouchableOpacity 
                  style={{backgroundColor: '#4058FD', borderRadius: 4, width: width - 20,height: 44, justifyContent: 'center', alignItems: 'center',marginTop: 15}}
                  onPress={this.addCheckUp}
                >
                  <Text style={{color: '#fff', fontSize: 16}}>创建</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            
          </View>
        );
    }
}
const mapStateToProps = state => ({
  deviceTypes: state.deviceReducer.deviceTypes,
});

export default connect(mapStateToProps)(CreateCheckUp);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F6F6F6',
    },
    headerView: {
      backgroundColor: '#fff',
      justifyContent: 'space-between',
      flexDirection: 'row',
      padding: 15,
      paddingRight: 10,
      paddingLeft: 15
    },
    rowStyle: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    itemStyle: {
      height: 40,
      backgroundColor: '#fff',
      paddingRight: 15,
      paddingLeft: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
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
