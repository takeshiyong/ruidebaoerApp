import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, TextInput, FlatList} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SplashScreen from 'react-native-splash-screen';
import { withNavigation } from 'react-navigation';

import LevelShow from '../../../components/levelShow';

const {width, height} = Dimensions.get('window');
class ExamineList extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    constructor(props) {
      super(props);
      this.state = {
        sourceData: [{data: 1}, {data: 1,flag: true}]
      }
    }
    componentDidMount() {
      SplashScreen.hide();
    }

    // 切换隐患跟踪类型
    chooseType = (type) => {
      this.setState({
        type
      })
    };

    /**
     * list上每行渲染的内容
     */
    renderItem = (arg) => {
      const { type } = this.props;
      switch(type) {
        case 1: 
          return this.checkPendingItem(arg);
        case 2:
          return this.auditedItem(arg);
        default: 
          return this.checkPendingItem(arg);
      }
    }

    // 跳转详情页面
    jumpDetail = () => {
      this.props.navigation.push('TroubleDetails');
    }

    /**
     * 待审核样式
     */
    checkPendingItem = ({item, index}) => {
      return (
        <TouchableOpacity style={styles.itemView} onPress={this.jumpDetail}>
          <View style={styles.itemContent}>
            <View style={styles.itemTitle}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.circle}>
                  <FontAwesome5 name="car-alt" color="#fff" size={14}/>
                </View>
                <Text style={{color: '#000',marginRight: 5,marginLeft: 5}}>车辆问题</Text>
                <LevelShow level="A级"/>
              </View>
              <View style={[styles.itemTip,{backgroundColor: '#FFECE6'}]}>
                <Text style={{color: '#FF632E', fontSize: 10}}>待审核</Text>
              </View>
            </View>
            <Text numberOfLines={3} style={{color: '#666',marginTop: 13,marginBottom: 10}}>
              3号矿区运矿车发生了抛锚，目前停在前往1号矿区路上，离1号​​矿区较近。请派维修人员前往维修，最多显示3行文字，这里显示的是占位符，不要再往下读了，到这里就可以了
            </Text>
            <View style={styles.itemDeptView}>
              <View style={styles.rowCenter}>
                <Image source={require('../../../image/trouble/troubleTrack/myIcon.png')} />
                <Text style={{color: '#999', marginLeft: 7, fontSize: 12}}>破碎车间</Text>
              </View>
              <View style={styles.rowCenter}>
                <Image source={require('../../../image/trouble/troubleTrack/clock.png')} />
                <Text style={{color: '#999', marginLeft: 7, fontSize: 12}}>2019.07.21 17:22</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )
    }

    /**
     * 已审核
     */
    auditedItem = ({item, index}) => {
      console.log(item, 'item')
      return (
        <View style={styles.itemView}>
          <View style={styles.itemContent}>
            <View style={styles.itemTitle}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.circle}>
                  <FontAwesome5 name="car-alt" color="#fff" size={14}/>
                </View>
                <Text style={{color: '#000',marginRight: 5,marginLeft: 5}}>车辆问题</Text>
                <LevelShow level="B级"/>
              </View>
              <View style={[styles.itemTip, {backgroundColor: '#E9FDF9'}]}>
                <Text style={{color: '#1ACFAA', fontSize: 10}}>{item.flag ? '审核通过': '审核未通过'}</Text>
              </View>
            </View>
            <Text numberOfLines={3} style={{color: '#666',marginTop: 13,marginBottom: 10}}>
              3号矿区运矿车发生了抛锚，目前停在前往1号矿区路上，离1号​​矿区较近。请派维修人员前往维修，最多显示3行文字，这里显示的是占位符，不要再往下读了，到这里就可以了
            </Text>
            <View style={styles.itemDeptView}>
              <View style={styles.rowCenter}>
                <Image source={require('../../../image/trouble/troubleTrack/myIcon.png')} />
                <Text style={{color: '#999', marginLeft: 7, fontSize: 12}}>破碎车间</Text>
              </View>
              <View style={styles.rowCenter}>
                <Image source={require('../../../image/trouble/troubleTrack/clock.png')} />
                <Text style={{color: '#999', marginLeft: 7, fontSize: 12}}>2019.07.21 17:22</Text>
              </View>
            </View>
          </View>
        </View>
      )
    }

    render() {
      return (
        <FlatList
          data={[{key: 'a'}, {key: 'b', flag: true}]}
          renderItem={this.renderItem}
        />
      );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        display: "flex",
        alignItems: 'center',
    },
    rowCenter: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    itemView: {
      width: '100%',
      alignItems: 'center',
    },
    itemContent: {
      width: '93%',
      padding: 10,
      backgroundColor: '#fff',
      borderRadius: 4
    },
    itemTitle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: 5,
      paddingRight: 5
    },
    circle: {
      backgroundColor: '#4058FD',
      width: 25,
      height: 25,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center'
    },
    itemTip: {
      paddingTop: 3,
      paddingBottom: 3,
      paddingRight: 7,
      paddingLeft: 7,
      backgroundColor: '#E9FDF9'
    },
    itemDeptView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: '#f8f8f8',
      paddingTop: 10,
      paddingBottom: 10,
      paddingRight: 5,
      paddingLeft: 5
    },
    extraView: {
      backgroundColor: '#f8f8f8',
      borderRadius: 4
    },
    pointView: {
      width: 5,
      height: 5,
      borderRadius: 50,
      backgroundColor: '#50b240'
    }

});

export default withNavigation(ExamineList);