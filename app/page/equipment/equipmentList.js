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
import TipModal from '../../components/tipModal';
const { width, height } = Dimensions.get('window');
class EquipmentList extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
      deviceList: [],
      sort: [],
      routeName: '',
      detail: {},
      showModal: false
    }

    componentDidMount() {
      SplashScreen.hide();
      if (this.props.navigation.state.params && this.props.navigation.state.params.item) {
        this.setState({
          detail: this.props.navigation.state.params.item
        }, ()=>this.getRouteDetail());
      }
    }

    // 获取设备详情
    getRouteDetail = async () => {
      const { detail } = this.state;
      global.loading.show();
      const res = await deviceServer.selectDetailsByfPatrolTaskId(detail.fPatrolTaskId);
      global.loading.hide();
      console.log('res', res);
      if (res.success) {
        this.setState({
          detail: res.obj
        });
      } else {
        Toast.show(res.msg);
      }
    }

    // 跳转检查项页面
    jumpCheckItem = (item) => {
      console.log('item', item);
      this.props.navigation.push('CheckItemList', {item: item});
    }

    renderRow = (item, index) => {
      return (
        <TouchableOpacity key={index} {...this.props.sortHandlers} style={[styles.rowStyle, {justifyContent: 'space-between'},styles.itemStyle]} onPress={()=>this.jumpCheckItem(item)}>
          <Text style={{color: '#333'}}>{item.fEquipmentName}</Text>
          <Text style={{color: '#333'}}>{'检查项：' + item.tEquipmentPatrolItemsList.length}</Text>
        </TouchableOpacity>
      )
    }

    // 删除路线
    delRoute = async () => {
      const { detail } = this.state;
      global.loading.show();
      const res = await deviceServer.deleteRoute(detail.fPatrolRouteId);
      global.loading.hide();
      if (res.success) {
        Toast.show(res.msg);
        const {state, goBack} = this.props.navigation;
        state.params.onRefresh && state.params.onRefresh();
        goBack();
      } else {
        Toast.show(res.msg);
      }
    }

    render() {
      const { typeList, deviceList, detail, showModal } = this.state;
        return (
          <View style={styles.container}>
            
            <Header 
              titleText="设备列表"
              backBtn={true}
              hidePlus={true}
            />
            <ScrollView>
              <View style={styles.headerView}>
                <View style={styles.rowStyle}>
                  <Image source={require('../../image/deviceParam/route.png')} />
                  <Text style={{color: '#333', marginLeft: 5}}>路线名</Text>
                </View>
                <Text style={{color: '#333'}}>{detail.fPatrolTaskTitle||'--'}</Text>
              </View>
              <View style={{padding:15,backgroundColor: '#fff',marginTop: 10,paddingBottom: 5}}>
                <View style={[styles.headerView, {paddingRight: 0, paddingLeft: 0,height: 30}]}>
                  <View style={styles.rowStyle}>
                    <Image source={require('../../image/deviceParam/cash-register.png')} />
                    <Text style={{color: '#333', marginLeft: 5}}>巡检设备</Text>
                  </View>
                  {
                    detail.patrolTaskEquipmentList && detail.patrolTaskEquipmentList.length > 0 ?
                    <Text style={{color: '#999'}}>{detail.patrolTaskEquipmentList.length}台</Text> : null
                  }
                </View>
              </View>
              {
                detail.patrolTaskEquipmentList && detail.patrolTaskEquipmentList.length > 0 ? detail.patrolTaskEquipmentList.map((item, index)=>{
                  return this.renderRow(item, index)
                }) : 
                <View style={{width: '100%', alignItems: 'center',backgroundColor: '#fff',height: 30,justifyContent: 'center',paddingBottom: 20}}>
                  <Text>暂无数据</Text>
                </View>
              }
            </ScrollView>
          </View>
        );
    }
}
const mapStateToProps = state => ({
  deviceTypes: state.deviceReducer.deviceTypes,
});

export default connect(mapStateToProps)(EquipmentList);

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
      paddingLeft: 15,
      alignItems: 'center',
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
    delBtn: {
      width: width - 30,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#DEE5EB',
      borderRadius: 4,
      backgroundColor: '#fff'
    }
});
