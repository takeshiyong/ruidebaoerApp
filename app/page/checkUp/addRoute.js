import React, { Component } from 'react';
import { StyleSheet,ScrollView, Text, View, Dimensions, TouchableOpacity, FlatList,Image,TextInput,RefreshControl,ActivityIndicator,ImageBackground} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {ECharts} from 'react-native-echarts-wrapper';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';

import deviceServer from '../../service/deviceServer';
import config from '../../config';
import Header from '../../components/header';
import SortableListView from '../../components/ReactNativeSortableListview';
import Toast from '../../components/toast';
const { width, height } = Dimensions.get('window');
class AddRoute extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
      deviceList: null,
      sort: [],
      routeName: '',
      detail: null

    }

    componentDidMount() {
      SplashScreen.hide();
      if (this.props.navigation.state.params && this.props.navigation.state.params.detail) {
        const { detail } = this.props.navigation.state.params;
        let deviceList = {};
        let sort = [];
        if (detail.routeEquipmentList.length == 0) deviceList = null;
        for (let obj of detail.routeEquipmentList) {
          deviceList[obj.fEquipmentId] = {...obj, fId: obj.fEquipmentId};
          sort.push(obj.fEquipmentId);
        }
        this.setState({
          detail: this.props.navigation.state.params.detail,
          routeName: this.props.navigation.state.params.detail.fPatrolRouteName,
          deviceList,
          sort
        });
      }
    }

    renderRow = (item) => {
      return (
        <TouchableOpacity {...this.props.sortHandlers} style={[styles.rowStyle, {justifyContent: 'space-between'},styles.itemStyle]}>
          <Text style={{color: '#333',flex: 1}}>{item.fEquipmentName}</Text>
          <Text style={{flex: 1}}>{'检查项：'+item.fAllCheckItemsList.length}</Text>
          <TouchableOpacity onPress={()=>this.delDevice(item)}>
            <AntDesign name="close" />
          </TouchableOpacity>
        </TouchableOpacity>
      )
    }

    // 删除选中设备
    delDevice = (item) => {
      const {deviceList, sort} = this.state;
      delete deviceList[item.fId];
      for (let [key, item] of sort.entries()) {
        sort.splice(key, 1);
        break;
      }
      this.setState({
        deviceList,
        sort
      });
    }

    // 选择设备返回的数据
    chooseDevice = (item) => {
      console.log('item', item);
      const {sort , deviceList} = this.state;
      // 判断是否已有数据
      let isHave = sort.indexOf(item.fId) != -1;
      this.setState({
        deviceList: {
          ...deviceList,
          [item.fId]: item
        },
        sort: isHave ? [...sort] : [...sort, item.fId]
      });
    }

    // 编辑路线
    editRoute = async (param) => {
      const { detail } = this.state;
      global.loading.show();
      const res = await deviceServer.updateRoute({
        ...param,
        fPatrolRouteId: detail.fPatrolRouteId,
      });
      global.loading.hide();
      if (res.success) {
        Toast.show(res.msg);
        const {navigate,goBack,state} = this.props.navigation;
        state.params.onRefresh && state.params.onRefresh();
        goBack();
      } else {
        Toast.show(res.msg);
      }
    }

    // 创建 编辑路线
    addRoute = async () => {
      const {routeName, deviceList, sort, detail} = this.state;
      console.log('detail', detail)
      if (routeName.trim().length == 0) {
        Toast.show('路线名称不能为空');
        return;
      }
      if (!deviceList || (deviceList && Object.keys(deviceList).length == 0)) {
        Toast.show('请选择至少一个设备');
        return;
      }
      const param = {
        fPatrolRouteName: routeName,
        fPatrolRouteRemarks: ' ',
        routeEquipmentList: sort.map((data, key)=>{
          return {
            fEquipmentId: deviceList[data].fId,
            fEquipmentSort: key+1,
            fCheckItemsIdList: deviceList[data].fAllCheckItemsList ? deviceList[data].fAllCheckItemsList.map((data)=>(data.fCheckItemsId)) : []
          };
        })
      }
      console.log('param', param);
      if (detail) {
        this.editRoute(param);
        return;
      }
      global.loading.show();
      const res = await deviceServer.createDeviceRoute(param);
      global.loading.hide();
      if (res.success) {
        Toast.show(res.msg);
        const {navigate,goBack,state} = this.props.navigation;
        state.params.onRefresh && state.params.onRefresh();
        goBack();
      } else {
        Toast.show(res.msg);
      }
    }

    render() {
      const { typeList, deviceList, routeName, detail } = this.state;
      console.log('deviceList', deviceList);
        return (
          <View style={styles.container}>
            <Header 
              titleText={detail ? '编辑路线' : '创建路线'}
              backBtn={true}
            />
            <ScrollView>
              <View style={styles.headerView}>
                <View style={styles.rowStyle}>
                  <Image source={require('../../image/deviceParam/route.png')} />
                  <Text style={{color: '#333', marginLeft: 5}}>路线名</Text>
                </View>
                <TextInput
                  style={{flex: 1,textAlign: 'right',padding: 0}}
                  placeholder="请输入线路名"
                  value={routeName}
                  onChangeText={(text)=>this.setState({routeName: text})}
                />
              </View>
              <View style={{padding:15,backgroundColor: '#fff',marginTop: 10,paddingBottom: 5}}>
                <View style={[styles.headerView, {paddingRight: 0, paddingLeft: 0,height: 30}]}>
                  <View style={styles.rowStyle}>
                    <Image source={require('../../image/deviceParam/cash-register.png')} />
                    <Text style={{color: '#333', marginLeft: 5}}>巡检设备</Text>
                  </View>
                  {
                    deviceList && Object.keys(deviceList).length > 0 ?
                    <Text style={{color: '#999'}}>{Object.keys(deviceList).length}台</Text> : null
                  }
                </View>
              </View>
              {
                deviceList ? 
                <SortableListView 
                  data={this.state.deviceList}
                  order={this.state.sort}
                  onRowMoved={e => {
                    this.state.sort.splice(e.to, 0, this.state.sort.splice(e.from, 1)[0]);
                    this.forceUpdate();
                  }}
                  renderRow={this.renderRow}
                /> : null
              }
              <View style={{height: 50,justifyContent: 'center',alignItems: 'center',backgroundColor: '#fff'}}>
                <TouchableOpacity style={styles.rowStyle} onPress={()=>{this.props.navigation.push('SelectDevice', {chooseDevice: this.chooseDevice})}}>
                  <AntDesign name="plus" color="#4058FD"/>
                  <Text style={{color: '#4058FD',marginLeft: 3}}>添加设备</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            <View style={{padding: 10}}>
              <TouchableOpacity 
                style={{backgroundColor: '#4058FD', borderRadius: 4, width: width - 20,height: 44, justifyContent: 'center', alignItems: 'center'}}
                onPress={()=>this.addRoute()}
              >
                <Text style={{color: '#fff', fontSize: 16}}>{detail ? '保存' : '创建'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
}
const mapStateToProps = state => ({
  deviceTypes: state.deviceReducer.deviceTypes,
});

export default connect(mapStateToProps)(AddRoute);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F6F6F6',
    },
    headerView: {
      height: 64,
      backgroundColor: '#fff',
      justifyContent: 'space-between',
      flexDirection: 'row',
      paddingRight: 15,
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
    }
});
