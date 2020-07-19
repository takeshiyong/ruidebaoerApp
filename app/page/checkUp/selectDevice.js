import React, { Component } from 'react';
import { StyleSheet,ScrollView, Text, View, Dimensions, TouchableOpacity, FlatList,Image,RefreshControl,ActivityIndicator,ImageBackground} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {ECharts} from 'react-native-echarts-wrapper';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';

import deviceServer from '../../service/deviceServer';
import config from '../../config';
import Header from '../../components/header';
import Toast from '../../components/toast';
const { width, height } = Dimensions.get('window');
class SelectDevice extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
      option1: null,
      option2: null,
      typeList: [],
      statics: null,
      // 当前选中的设备类型id
      currentTypeId: '',
      dataSource: [ // type: 1.绿 2.灰 3.红, tem: 温度, shake: 震动
       
      ],
      refreshing: false,
    }

    componentDidMount() {
      SplashScreen.hide();
      this.getTypeList();
    }

    // 获取区域列表
    getTypeList = async () => {
      global.loading.show();
      const res = await deviceServer.getDeviceEquipmentAreaSelectAll();
      global.loading.hide();
      console.log('获取区域列表', res);
      if (res.success) {
        let currentId = '';
        // 如果类型数组大于1则默认选中第一个类型
        if (res.obj.length > 0) {
          res.obj[0].checked = true;
          currentId = res.obj[0].fId;
          this.getTypeListById(currentId);
        }
        this.setState({
          currentTypeId: currentId,
          typeList: res.obj
        });
      } else {
        Toast.show(res.msg);
      }
    }


    // 根据设备类型查询设备列表
    getTypeListById = async (fId) => {
      if (this.state.refreshing) {
        return;
      }
      this.setState({refreshing: true});
      const res = await deviceServer.getDeviceListByArea(fId);
      this.setState({refreshing: false});
      console.log('获取设备列表', res);
      if (res.success) {
        this.setState({
          dataSource: res.obj
        })
      } else {
        Toast.show(res.msg);
      }
    }

    // 刷新列表数据
    onRefresh = () => {
      this.getTypeListById(this.state.currentTypeId);
    }

    // 切换选中项 通过类型获取列表数据
    changeItem = (index, data) => {
      // 获取列表数据
      this.getTypeListById(data.fId)
      for (let obj of this.state.typeList) {
        obj.checked = false;
      }
      this.state.typeList[index].checked = true;
      this.setState({
        typeList: this.state.typeList,
        currentTypeId: data.fId
      });
    }

    // 左侧类型组件
    typeRender = (item, index) => {
      if (item.checked) {
        return (
          <TouchableOpacity key={index} style={[styles.typeItem,{backgroundColor: '#F6F6F6'}]} onPress={()=>this.changeItem(index, item)}>
            <View style={styles.activeTip}/>
            <View style={{position: 'relative', width: '100%'}}>
              <Text style={{color: '#333',fontWeight: '600',width: '80%',marginLeft: 10,textAlign: 'center'}}>
                {item.fAreaName}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity key={index} style={[styles.typeItem]} onPress={()=>this.changeItem(index, item)}>
          <View style={{position: 'relative', width: '100%'}}>
            <Text style={{width: '80%',marginLeft: 10,textAlign: 'center',color: '#333'}}>{item.fAreaName}</Text>
            {item.num ? <View style={styles.tips}/>: null}
          </View>
        </TouchableOpacity>
      );
    }

    // 选择设备进入线路 顺便查询检查项
    chooseItem = async (item) => {
      const {navigate,goBack,state} = this.props.navigation;
      global.loading.show();
      const res = await deviceServer.selectCheckItemByFid(item.fId);
      global.loading.hide();
      if (res.success) {
        let param = {
          ...item,
          fAllCheckItemsList: res.obj
        };
        state.params.chooseDevice(param);
        goBack();
      } else {
        Toast.show(res.msg);
      }
        
    }

    // 设备item组件渲染
    renderItem = ({item}) => {
      let color = '';
      return (
        <TouchableOpacity style={styles.itemFastStyle} onPress={()=>this.chooseItem(item)}>
          <View style={[styles.rowStyle,]}>
            <Text style={{color: '#333'}}>{item.fEquipmentName}</Text>
            <View style={[styles.circle, {backgroundColor: color}]}/>
          </View>
        </TouchableOpacity>
      )
    }
    
    render() {
      const { typeList } = this.state;
      console.log('typeList', typeList)
        return (
          <View style={styles.container}>
            <Header 
              titleText="选择设备"
              backBtn={true}
              hidePlus={true}
            />
            <View style={{flexDirection: 'row'}}>
              <View style={{width: 90,backgroundColor: '#EDEDED',height: height-70}}>
                <View style={{width: '100%',backgroundColor: '#fff', alignItems: 'center',justifyContent: 'center',height: 40}}>
                  <Text style={{fontSize: 16}}>区域</Text>
                </View>
                {
                  typeList.map((data, index)=>(this.typeRender(data,index)))
                }
              </View>
              <View style={{flex: 1,padding: 10}}>
                <View style={{borderRadius: 4,height: height - 80}}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.dataSource}
                    renderItem={this.renderItem}
                    ListEmptyComponent={<Text style={{width:'100%', textAlign: 'center',marginTop: 10,color: '#c9c9c9', paddingBottom: 50}}>暂无数据</Text>}
                    refreshControl={
                      <RefreshControl
                          title={'Loading'}
                          colors={['#000']}
                          refreshing={this.state.refreshing}
                          onRefresh={this.onRefresh}
                      />
                    } 
                  />
                </View>
              </View>
            </View>
          </View>
        );
    }
}
const mapStateToProps = state => ({
  deviceTypes: state.deviceReducer.deviceTypes,
});

export default connect(mapStateToProps)(SelectDevice);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F6F6F6'
    },
    typeItem: {
      width: '100%',
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      position: 'relative'
    },
    activeTip: {
      width: 4,
      height: 15,
      backgroundColor: '#4058FD',
      position: 'absolute',
      left: 0,
      top: 18
    },
    tips: {
      width: 8,
      height: 8,
      borderRadius: 50,
      backgroundColor: '#F74747',
      position: 'absolute',
      right: -5,
      top: 0
    },
    active: {
      backgroundColor: '#F6F6F6'
    },  
    headerView: {
      width,
      height: 145,
      backgroundColor: '#4B74FF',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around'
    },
    headerBtn: {
      borderRadius: 4,
      backgroundColor: 'rgba(225,225,225,0.3)',
      width: width/5,
      height: 95,
      alignItems:'center',
      justifyContent: 'center'
    },
    tipView: {
      width: width,
      backgroundColor: '#fff',
      height: 44,
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 10,
      paddingLeft: 10
    },
    timeText: {
      color: '#999',
      fontSize: 12,
      width: 50,
      textAlign: 'right'
    },
    contentView: {
      padding: 10
    },
    staticView: {
      width: '100%',
      height: 220,
      backgroundColor: '#fff',
      borderRadius: 4,
      marginBottom: 10
    },
    titleTextWeight: {
      color: '#333',
      fontWeight: 'bold',
      fontSize: 16,
    },
    titleNum: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10
    },  
    statisView: {
      flexDirection: 'row',
      borderRadius: 4
    },
    circle: {
      width: 8,
      height: 8,
      borderRadius: 50,
      backgroundColor: '#E0E0E0',marginLeft: 5
    },  
    rowStyle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    labelView: {
      alignItems: 'center',
      flex: 1
    },
    imageBackground: {
      width: width-20,
      height: (width-20)*0.37,
      marginTop: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight: 20,
      paddingLeft: 20
    },
    bigText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 20,
    },
    smallText: {
      color: '#fff',
      fontSize: 12,
      marginTop: 5,
    },
    itemFastStyle: {
      width: '100%',
      backgroundColor: '#fff',
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomColor: '#e0e0e0',
      borderBottomWidth: 1
    },
    linearGradient: {
      width: 75,
      height: 75,
      alignItems: 'center',
      justifyContent: 'center'
    },
    descText: {
      color: '#999',
      fontSize: 12,marginTop: 2
    }
    
});
