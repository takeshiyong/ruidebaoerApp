import React, { Component } from 'react';
import { StyleSheet,ScrollView, Text, View, Dimensions, TouchableOpacity, FlatList,Image,RefreshControl,ActivityIndicator,TextInput,ImageBackground} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {ECharts} from 'react-native-echarts-wrapper';
import LinearGradient from 'react-native-linear-gradient';

import Header from '../../components/header';
import Radio from '../../components/radio';
import Toast from '../../components/toast';
import CameraUpload from '../../components/ImageAbout/CameraUpload';
import deviceServer from '../../service/deviceServer';
const { width, height } = Dimensions.get('window');
export default class DeviceParam extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
      detail: {},
    }

    componentDidMount() {
      SplashScreen.hide();
      if (this.props.navigation.state.params && this.props.navigation.state.params.item) {
        this.setState({
          detail: this.props.navigation.state.params.item
        })
      }
    }

    render() {
        const { type, detail } = this.state;
        return (
          <View style={styles.container}>
            <Header 
              titleText={'设备参数'}
              backBtn={true}
            />
            <ScrollView >
              <View style={styles.content}>
                <View style={styles.rowStyle}>
                  <View style={styles.titleView}>
                    <Image source={require('../../image/deviceParam/24gf-appsBig.png')}/>
                    <Text style={{color: '#333',marginLeft: 5}}>设备型号</Text>
                  </View>
                  <Text style={{color: '#666'}}>{detail.fEquipmentType || '--'}</Text>
                </View>
                {detail.infoList ? detail.infoList.map((data)=>{
                  return (
                    <View style={styles.rowStyle}>
                      <View style={styles.titleView}>
                        <Image source={require('../../image/deviceParam/24gf-calendar.png')}/>
                        <Text style={{color: '#333',marginLeft: 5}}>{data.attributeName}</Text>
                      </View>
                      <Text style={{color: '#666'}}>{data.fValue || '--'}{data.unit }</Text>
                    </View>
                  );
                }) : null}
                <View style={styles.rowStyle}>
                    <View style={styles.titleView}>
                      <Image source={require('../../image/deviceParam/24gf-mapMarker3.png')}/>
                      <Text style={{color: '#333',marginLeft: 5}}>额定功率</Text>
                    </View>
                    <Text style={{color: '#666'}}>{detail.fRatedPower || '--'}kw</Text>
                </View>
                <View style={styles.rowStyle}>
                    <View style={styles.titleView}>
                      <Image source={require('../../image/deviceParam/24gf-mapMarker4.png')}/>
                      <Text style={{color: '#333',marginLeft: 5}}>生产能力</Text>
                    </View>
                    <Text style={{color: '#666'}}>{detail.fProductionCapacity||'--'}吨/h</Text>
                </View>   
                <View style={styles.rowStyle}>
                    <View style={styles.titleView}>
                      <Image source={require('../../image/deviceParam/24gf-mapMarker5.png')}/>
                      <Text style={{color: '#333',marginLeft: 5}}>生产日期</Text>
                    </View>
                    <Text style={{color: '#666'}}>{detail.fProductionDate || '--'}</Text>
                </View> 
                <View style={[styles.rowStyle, {height: 'auto',alignItems: 'flex-start',paddingTop: 10,borderBottomWidth: 0}]}>
                    <View style={[styles.titleView, {flex: 2}]}>
                      <Image source={require('../../image/deviceParam/24gf-mapMarker6.png')}/>
                      <Text style={{color: '#333',marginLeft: 5}}>制造商</Text>
                    </View>
                    <View style={{flex: 3}}>
                      <Text style={{color: '#666'}}>名称：{detail.manufacturerName}</Text>
                      <Text style={{color: '#666'}}>电话：{detail.manufacturerPhone}</Text>
                      <Text style={{color: '#666'}}>地址：{detail.manufacturerAddress}</Text>
                    </View>
                </View> 
              </View>
            </ScrollView>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F6F6F6'
    },
    content: {
      paddingBottom: 10,
      paddingRight: 15,
      paddingLeft: 15,
      backgroundColor: '#fff',
      width: '100%',
      marginTop: 10
    },
    rowStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#DEE5EB',
      height: 48
    },
    titleView: {
      flexDirection: 'row',
      alignItems: 'center',

    }
});
