import React, { Component } from 'react';
import { StyleSheet,ScrollView, Text, View, Dimensions, TouchableOpacity, FlatList,Image,RefreshControl,ActivityIndicator,ImageBackground} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import deviceServer from '../../service/deviceServer';
import config from '../../config';
import Header from '../../components/header';
import Toast from '../../components/toast';
const { width, height } = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
      typeList: [],
      statics: null,
      // 当前选中的设备类型id
      currentTypeId: '',
      refreshing: false,
      dataSource: []
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
    // 根据设备类型查询设备列表
    getTypeListById = async (fId) => {
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
      return (
        <TouchableOpacity style={styles.itemFastStyle} onPress={()=>{this.pushValue(item)}}>
            <Text style={{color: "#333",fontSize: 14,fontWeight: "500"}}>{item.fEquipmentName}</Text>
        </TouchableOpacity>
      )
    }
    pushValue = (item) => {
        const {navigate,goBack,state} = this.props.navigation;
        state.params.getValue(item);
        goBack();
    }
    render() {
      const { typeList } = this.state;
        return (
          <View style={styles.container}>
            <Header 
              titleText="设备列表"
              backBtn={true}
              hidePlus={true}
            />
            <View style={{flexDirection: 'row'}}>
              <View style={{width: 90,backgroundColor: '#EDEDED',height: height-70}}>
                {
                  typeList.map((data, index)=>(this.typeRender(data,index)))
                }
              </View>
              <View style={{flex: 1}}>
                <View style={{borderRadius: 4,height: height - 80}}>
                  <FlatList
                    style={{backgroundColor: "#fff",paddingLeft: 15}}
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
    itemFastStyle: {
      width: '100%',
      backgroundColor: '#fff',
      flexDirection: 'row',
      borderBottomColor: "#E0E0E0",
      borderBottomWidth: 1,
      paddingLeft: 5,
      paddingTop: 15,
      paddingBottom: 15,
      alignItems: 'center',
    },
    
    
    
});
