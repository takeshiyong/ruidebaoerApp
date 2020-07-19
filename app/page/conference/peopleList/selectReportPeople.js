import React, { Component } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Dimensions, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  TextInput, 
  Linking
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SplashScreen from 'react-native-splash-screen';
import moment from 'moment';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import Toast from '../../../components/toast';
import Entypo from 'react-native-vector-icons/Entypo';

const {width, height} = Dimensions.get('window');
class SelectPeopleItem extends Component {
  state = {
  };

  // 删除已选的人员操作
  deleteUser = (item) => {
    const { value } = this.props;
    let arr = [...value];
    console.log(arr);
    for (let i = 0, len = arr.length; i < len; i++) {
      if (arr[i].fId == item.fId) {
        arr.splice(i,1); 
        break;
      }
    }
    this.props.onChange(arr);
  }

  // 跳转选择页面
  jumpSelectPage = () => {
    const { detail, getValue } = this.props;
    if(getValue.length > 0){
        let dep = null;
        if (detail && detail.fDutyDepId && detail.fDutyDepName) {
            dep = {
                fId: detail.fDutyDepId,
                fName: detail.fDutyDepName
            }
        }
        let param = {};
        for (let item of getValue) {
            param[item.fId] = item.fUserName
        }
        this.props.navigation.navigate('PeopleList',
            {surePeople: this.getReportPeople, initArr: getValue}
        );
    }else{
        Toast.show('请先选择参会人');
    }
    
  }
  // 获取上一个页面选中的数据
  getReportPeople = (data) => {
    console.log('data', data);
    this.props.onChange(data);
  }

  render() {
    const { style, title, disabled, value, required, showPeople, showAllnum} = this.props;
    const { userList } = this.state;
    return (
        <View style={[styles.item, style]}>
            {
              !disabled ? 
              <TouchableOpacity style={styles.itemTitle}  onPress={this.jumpSelectPage}>
                <View style={styles.rowStyle}>
                  <Image source={require("../../../image/TroubleCallBack/userGroup.png")} style={{width: 16, height: 16,marginRight: required ? 4 : 9}}/>
                  <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>
                  {!required ? null : 
                  <Text style={{color: 'red'}}>*</Text>}
                  {title}</Text>
                  {!showPeople ? null :
                  <Text style={{marginLeft: 5, fontWeight: "500",color: "#333",fontSize: 14}}>{value.length? ": "+value.length + '人': ''} {showAllnum != undefined ? '/'+ showAllnum + "人": ' '  } </Text>
                  }
                </View>
                <View style={styles.rowStyle}>
                  <Text style={{ color: "#666666"}}>请选择{title}</Text>
                  <AntDesign name={'right'} size={12} style={{ color: '#666666', marginLeft: 13 }}/>
                </View>
              </TouchableOpacity> : 
              <View style={styles.itemTitle} onPress={this.jumpSelectPage}>
                <View style={styles.rowStyle}>
                  <Image source={require("../../../image/TroubleCallBack/userGroup.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                  <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>
                  {title}</Text>
                </View>
              </View>
            }
            <View style={[{marginTop: 20}]}>
              {
                disabled && value.length == 0 ? <Text style={{color: '#666'}}>--</Text>: (value.length >= 4? 
                  <View style={{flexDirection: 'row',alignItems: "center"}}>
                    {
                      value.slice(0,4).map((item)=>{
                        return (
                          <View style={styles.userIcon} key={item.fId}>
                            <View style={styles.userImgs}>
                                <View style={styles.userImg}>
                                    <Text style={{fontSize: 14,color: "white"}}>
                                        {item.fUserName ? item.fUserName.substr(item.fUserName.length-2,2) : ''}
                                    </Text>
                                </View> 
                            </View>
                            <Text style={{width: '100%',textAlign: 'center',fontSize: 13}} numberOfLines={1}>{item.fUserName}</Text>
                          </View>
                        );
                      })
                    }
                    <TouchableOpacity onPress={this.jumpSelectPage} style={{marginLeft: 20,marginTop: -10}}>
                        <Entypo name="dots-three-horizontal" size={18} color="#666"></Entypo>
                    </TouchableOpacity>
                  </View>
                  : 
                  <View style={{flexDirection: 'row'}}>
                    {
                      value.map((item)=>{
                        return (
                          <View style={styles.userIcon} key={item.fId}>
                            <View style={styles.userImgs}>
                                <View style={styles.userImg}>
                                    <Text style={{fontSize: 14,color: "white"}}>
                                        {item.fUserName ? item.fUserName.substr(item.fUserName.length-2,2) : ''}
                                    </Text>
                                </View> 
                            </View>
                            <Text style={{width: '100%',textAlign: 'center',fontSize: 13}} numberOfLines={1}>{item.fUserName}</Text>
                          </View>
                        );
                      })
                    }
                  </View>
                  )
              }
            </View>
        </View>
    );
  }
}

export default withNavigation(SelectPeopleItem);

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowWarp: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },  
  itemTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  userIcon: {
    alignItems: 'center',
    width: 80,
    height: 70,
    position: 'relative'
  },
  closeIcon: {
    position: 'absolute',
    top: 0,
    right: 14,
    zIndex: 2,
    width: 16,
    height: 16,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  userImgs:{
    width: 48,
    height: 48,
    backgroundColor: "#D9DEFF",
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userImg:{
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "#4058FD",
      alignItems: "center",
      justifyContent: "center"
  },

});
