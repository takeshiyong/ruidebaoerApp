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
class DeviceClass extends Component {
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
        // {
        //   type: 1,
        //   tem: '80℃',
        //   shake: '150HZ'
        // },
        // {
        //   type: 2,
        //   tem: '',
        //   shake: ''
        // },
        // {
        //   type: 3,
        //   tem: '100℃',
        //   shake: '150HZ'
        // },
        // {
        //   type: 1,
        //   tem: '80℃',
        //   shake: '150HZ'
        // },
        // {
        //   type: 2,
        //   tem: '',
        //   shake: ''
        // },
        // {
        //   type: 3,
        //   tem: '100℃',
        //   shake: '150HZ'
        // },
      ],
      refreshing: false,
    }

    componentDidMount() {
      SplashScreen.hide();
      this.getTypeList();
    }

    // 获取设备类型
    getTypeList = async () => {
      global.loading.show();
      const res = await deviceServer.getDeviceType();
      global.loading.hide();
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

    // 根据设备类型查询设备统计
    getTypeStaiscsByType = async (fId) => {
      const res = await deviceServer.getDeviceStaticsByType(fId);
      console.log(res, '根据设备类型查询设备统计');
      if (res.success) {
        const detail = res.obj;
        this.setState({
          statics: detail,
          option1: {
              series: [
                {
                    type: 'pie',
                    radius: '70%',
                    center: ['50%', '50%'],
                    labelLine:{show: false},
                    legendHoverLink: false,
                    hoverAnimation: false,
                    clockwise: false,
                    data:[
                        {value:detail.onlineCount * 1,itemStyle:{normal:{color: '#5E75FE'}}},
                        {value:detail.allCount * 1 - detail.onlineCount * 1,itemStyle:{normal:{color: '#E0E0E0'}}},
                    ],
                    
                }
            ]
          },
          option2: {
              series: [
                {
                    type: 'pie',
                    radius: '70%',
                    center: ['50%', '50%'],
                    labelLine:{show: false},
                    legendHoverLink: false,
                    hoverAnimation: false,
                    clockwise: false,
                    data:[
                        {value:detail.faultCount * 1,itemStyle:{normal:{color: '#FF9C4C'}}},
                        {value:detail.allCount * 1 - detail.faultCount * 1,itemStyle:{normal:{color: '#E0E0E0'}}},
                    ],
                    
                }
            ]
          },
        })
      }
    }

    // 根据设备类型查询设备列表
    getTypeListById = async (fId) => {
      this.getTypeStaiscsByType(fId)
      if (this.state.refreshing) {
        return;
      }
      this.setState({refreshing: true});
      const res = await deviceServer.getDeviceListByType(fId);
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
                {item.fTypeName}
              </Text>
              {item.num ? <View style={styles.tips}/>: null}
            </View>
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity key={index} style={[styles.typeItem,]} onPress={()=>this.changeItem(index, item)}>
          <View style={{position: 'relative', width: '100%'}}>
            <Text style={{width: '80%',marginLeft: 10,textAlign: 'center'}}>{item.fTypeName}</Text>
            {item.num ? <View style={styles.tips}/>: null}
          </View>
        </TouchableOpacity>
      );
    }

    // 设备item组件渲染
    renderItem = ({item}) => {
      let color = '';
      console.log('item.fImageUrl',item.fImageUrl);
      return (
        <TouchableOpacity style={styles.itemFastStyle} onPress={()=>{this.props.navigation.push('DeviceDetail',{type: 2, item})}}>
          <LinearGradient start={{x: 0.5, y: 1}} end={{x: 0.5, y:0.5}} colors={['#EBEBEB', '#FFFFFF']} style={styles.linearGradient}>
            <Image source={{uri: config.imgUrl + item.fImageUrl}} resizeMode="contain" style={{width: 60,height: 60}}/>
          </LinearGradient> 
          <View style={{flex: 1,marginLeft: 10}}>
            <View style={[styles.rowStyle,]}>
              <Text style={{color: '#333'}}>{item.fEquipmentName}</Text>
              <View style={[styles.circle, {backgroundColor: color}]}/>
            </View>
            <View style={{width: '100%',flexDirection: 'row'}}>
              <View style={{flex: 1,marginTop: 3}}>
                <Text style={[styles.descText,item.type == 3 ? {color: '#F74747'}: null]}>
                  轴承温度:{item.tem||'--'}
                </Text>
                <Text style={styles.descText}>震动:{item.shake||'--'}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )
    }
    
    // 统计图部分
    listHead = () => {
      const { statics } = this.state;
      if (!this.state.option1) {
        return null
      }
      return (
        <View style={styles.staticView}> 
          <View style={styles.titleNum}>
            <Text style={styles.titleTextWeight}>统计</Text>
            <Text style={{color: '#666'}}>共计：<Text style={{fontWeight: 'bold'}}>{statics.allCount}台</Text></Text>
          </View>
          <View style={styles.statisView}>
            <View style={{flex: 1,height: 180}}>
              <View style={{height: '70%'}}>
                <ECharts option={this.state.option1} style={{webkitTapHighlightColor:'transparent'}}/>
              </View>
              <View style={styles.rowStyle}>
                <View style={styles.labelView}>
                  <Text style={{color: '#666',fontWeight: '600'}}>0%</Text>
                  <Text style={{color: '#999',fontSize: 12}}>开机率</Text>
                </View>
                <View style={styles.labelView}>
                  <Text style={{color: '#666',fontWeight: '600'}}>{statics.onlineCount}台</Text>
                  <Text style={{color: '#999',fontSize: 12}}>使用设备</Text>
                </View>
              </View>
            </View>
            <View style={{flex: 1,height: 180}}>
              <View style={{height: '70%'}}>
                <ECharts option={this.state.option2} style={{webkitTapHighlightColor:'transparent'}}/>
              </View>
              <View style={styles.rowStyle}>
                <View style={styles.labelView}>
                  <Text style={{color: '#666',fontWeight: '600'}}>{statics.faultRate}</Text>
                  <Text style={{color: '#999',fontSize: 12}}>故障率</Text>
                </View>
                <View style={styles.labelView}>
                  <Text style={{color: '#666',fontWeight: '600'}}>{statics.faultCount}台</Text>
                  <Text style={{color: '#999',fontSize: 12}}>故障设备</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )
    }

    render() {
      const { typeList } = this.state;
        return (
          <View style={styles.container}>
            <Header 
              titleText="设备分类"
              backBtn={true}
              hidePlus={true}
              rightBtn={
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate('DevideAdd',{onRefresh: () =>this.getTypeListById(this.state.currentTypeId)})}}>
                  <Text style={{color: '#fff',fontSize: 14,marginRight: 5}}>添加设备</Text>
                </TouchableOpacity>
              }
            />
            <View style={{flexDirection: 'row'}}>
              <View style={{width: 90,backgroundColor: '#EDEDED',height: height-70}}>
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
                    ListHeaderComponent={this.listHead}
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

export default connect(mapStateToProps)(DeviceClass);

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
      height: 95,
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
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
