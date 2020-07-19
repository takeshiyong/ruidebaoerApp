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
class CheckItemList extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
      deviceList: [],
      sort: [],
      routeName: '',
      detail: {},
      showModal: false,
      checkItem: []
    }

    componentDidMount() {
      SplashScreen.hide();
      if (this.props.navigation.state.params && this.props.navigation.state.params.item) {
        console.log(this.props.navigation.state.params)
        this.setState({
          detail: this.props.navigation.state.params.item
        });
      }
    }

    // 获取设备详情
    getRouteDetail = async () => {
      const { detail } = this.state;
      global.loading.show();
      const res = await deviceServer.selectCheckItemByFid(detail.fEquipmentId);
      global.loading.hide();
      console.log('res', res);
      if (res.success) {
          this.setState({
            checkItem: res.obj
          })
      } else {
        Toast.show(res.msg);
      }
    }

    renderRow = (item, index) => {
      return (
        <View key={index} style={[styles.rowStyle, {justifyContent: 'space-between'},styles.itemStyle]}>
          <Text style={{color: '#333'}}>{item.fCheckItemsContent}</Text>
        </View>
      )
    }

    render() {
      const { typeList, deviceList, detail, showModal, checkItem } = this.state;
        return (
          <View style={styles.container}>
            <Header 
              titleText="巡检项列表"
              backBtn={true}
              hidePlus={true}
            />
            <ScrollView>
              <View style={styles.headerView}>
                <View style={styles.rowStyle}>
                  <Image source={require('../../image/deviceParam/cash-register.png')} />
                  <Text style={{color: '#333', marginLeft: 5}}>设备名</Text>
                </View>
                <Text style={{color: '#333'}}>{detail.fEquipmentName||'--'}</Text>
              </View>
              <View style={{padding:15,backgroundColor: '#fff',marginTop: 10,paddingBottom: 5}}>
                <View style={[styles.headerView, {paddingRight: 0, paddingLeft: 0,height: 30}]}>
                  <View style={styles.rowStyle}>
                    <Image source={require('../../image/deviceParam/route.png')} />
                    <Text style={{color: '#333', marginLeft: 5}}>巡检项</Text>
                  </View>
                  {
                    detail.tEquipmentPatrolItemsList && detail.tEquipmentPatrolItemsList.length > 0 ?
                    <Text style={{color: '#999'}}>{detail.tEquipmentPatrolItemsList.length}项</Text> : null
                  }
                </View>
              </View>
              {
                detail.tEquipmentPatrolItemsList && detail.tEquipmentPatrolItemsList.length > 0 ? detail.tEquipmentPatrolItemsList.map((item, index)=>{
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

export default connect(mapStateToProps)(CheckItemList);

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
