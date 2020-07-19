import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput, Image, Dimensions, Platform, AsyncStorage ,StatusBar, Linking} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';
import JPushModule from 'jpush-react-native';
import { connect } from 'react-redux';

import action from '../store/action/index';
import userService from '../service/userService';
import Toast from '../components/toast';
import UpdateModal from '../components/updateModal';
import config from '../config';
 
const {width, height} = Dimensions.get('window');
class welcome extends Component{
  static navigationOptions = ({ navigation }) => ({
    header: () => {
         return null
    }
  });
  state = {
    IsForceUpdate: false,
    visible: false,
    registrationId:'',
    version: '',
    desc: '',
    fUrl: '',
    fFileName: ''
  };
  componentDidMount(){
    this.initNotify();
    // 隐藏启动图
    // 设置Text TextInput标签字体大小不随系统字体大小动
    TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, {allowFontScaling: false});
    Text.defaultProps = Object.assign({}, Text.defaultProps, {allowFontScaling: false});
  }

  /**
   * 页面一进来初始化极光推送推送
   */
  initNotify = () => {
    if (Platform.OS === 'android') {
      JPushModule.initPush();
      JPushModule.notifyJSDidLoad((result)=>{
        if (result == 0) {

        }
      });
    } else {
      JPushModule.setupPush();
    }
    // 通过极光推送获取设备id保存于redux中
    JPushModule.getRegistrationID(registrationId => {
      this.props.saveNotifyIds(registrationId);
      this.getUpdate(registrationId);
      // this.doLoginByStore(registrationId);
      this.setState({registrationId: registrationId})
    })
  }

  // 获取更新信息
  getUpdate = async (registrationId) => {
    global.loading.show();
    let flag = Platform.OS =='android' ? 1 : 2
    const res = await userService.selectAppVersion(flag);
    global.loading.hide();
    console.log(res.msg);
    if (res.success) {
      if(res.obj == null) {
        this.doLoginByStore(registrationId);
      }
      if (res.obj.fVersion != config.VESION_NO) {
        // 判断当前版本不相等
        SplashScreen.hide();
        this.setState({
          visible: true,
          IsForceUpdate: res.obj.fIsForceUpdate,
          version: res.obj.fVersion,
          desc: res.obj.fUpdateInfo,
          fUrl: res.obj.fUrl,
          fFileName: res.obj.fFileName
        })
      } else {
        // 符合当前版本
        this.doLoginByStore(registrationId);
      }
    } else {
      Toast.show(res.msg);
    }
  }

  // 从缓存中获取用户信息用于登录
  doLoginByStore = async (registrationId) => {
    if (registrationId.length == 0) {
      registrationId = '123213123'
    }
    const user = await AsyncStorage.getItem('user');
    if (!user) {
      setTimeout(()=>{
        this.toLoginPage();
      }, 2000);
      return;
    }
    const {username, password} = JSON.parse(user);
    const res = await userService.doLogin(registrationId, {
      fLoginName: username,
      fPassWord: password
    });
    console.log('welcome登录接口返回结果', res);
    if (res.success) {
        global.webToken = res.obj.webtoken;
        await AsyncStorage.setItem('token', res.obj.webtoken);
        this.props.saveUserInfo(res.obj);
        SplashScreen.hide();
        // 跳转主页面
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
        });
        this.props.navigation.dispatch(resetAction);
    } else {
        this.toLoginPage();
    }
  }
  
  toLoginPage = () => {
    // SplashScreen.hide();
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Login' })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <View style={styles.container}>
          <UpdateModal 
            IsForceUpdate={this.state.IsForceUpdate}
            tipText={`发现新版本 v${this.state.version}`}
            desc={this.state.desc}
            onCancel={()=>this.setState({visible:false}, ()=>this.doLoginByStore(this.state.registrationId))}
            onOk={()=>{Linking.openURL(config.imgUrl+this.state.fUrl+"?filename="+ this.state.fFileName)}}
            showModal={this.state.visible}
          />
          <Image source={require("../image/welcome/launch_screen.png")} style={{width, height}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,1)',
    paddingTop: StatusBar.currentHeight + 30
  },
});

const mapDispatchToProps = dispatch => ({
  saveNotifyIds: id => dispatch(action.saveNotifyId(id)),
  saveUserInfo: param => dispatch(action.saveUserInfo(param))
});


export default connect(()=>({}), mapDispatchToProps)(welcome)