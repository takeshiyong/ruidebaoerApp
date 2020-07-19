import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput,PermissionsAndroid, TouchableOpacity, ToastAndroid, AsyncStorage,Dimensions, Image } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import JPushModule from 'jpush-react-native';
import SplashScreen from 'react-native-splash-screen';

import action from '../store/action/index';
import Toast from '../components/toast';
import userService from '../service/userService';

const {width, height} = Dimensions.get('window');
class Login extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: () => {
                return null
        }
    });

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    componentDidMount() {
        SplashScreen.hide();
        this.requestCameraPermission();
    }

    async requestCameraPermission() {
        console.log(PermissionsAndroid.PERMISSIONS);
        try {
            await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    'title': 'READ_EXTERNAL_STORAGE0',
                    'message': 'MESSAGE'
                }
            )
            
            await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'ACCESS_FINE_LOCATION',
                    'message': 'MESSAGE'
                }
            )

            await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                {
                    'title': 'ACCESS_COARSE_LOCATION',
                    'message': 'MESSAGE'
                }
            )
        } catch (err) {
            console.warn(err);
        }
    }

  doLogin = async () => {
    const { username, password } = this.state;
    if (username.trim().length == 0) {
        Toast.show('用户名不能为空');
        return;
    } 
    if (password.trim().length == 0) {
        Toast.show('密码不能为空');
        return;
    }
    global.loading.show();
    const res = await userService.doLogin(this.props.notifyId||'123213', {
        fLoginName: username,
        fPassWord: password,
    });
    console.log('res', res);
    if (res.success) {
        global.webToken = res.obj.webtoken;
        await AsyncStorage.setItem('token', res.obj.webtoken);
        this.props.saveUserInfo(res.obj);
        await AsyncStorage.setItem('user', JSON.stringify({username,password}));
        global.loading.hide();
        // 跳转主页面
        this.toTabsPage();
    } else {
        global.loading.hide();
        Toast.show(res.msg);
    }
  }


  // 跳转主页面
  toTabsPage = () => {
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
    });
    this.props.navigation.dispatch(resetAction);
  }
  render() {
    return (
        <View style={styles.container}>
            <Image source={require("../image/login/top.png")} style={{width,height: 234}}/>
            <View style={styles.box}>
                <Text style={{fontSize: 16,fontWeight: "600", color: "#333", marginTop: 24, marginBottom: 20}}>登录</Text>
                <View style={styles.boxItems}>
                    <View style={styles.item}>
                        <Image source={require("../image/login/shield.png")} style={styles.img}/>
                        <TextInput
                            style={styles.boxItemsInput}
                            onChangeText={(username) => this.setState({ username })}
                            value={this.state.username}
                            placeholder="登录用户名"
                            clearTextOnFocus={true}
                        />
                    </View>
                </View>
                <View style={styles.boxItems}>
                    <View style={styles.item}>
                        <Image source={require("../image/login/lock.png")} style={styles.img}/>
                        <TextInput
                            style={styles.boxItemsInput}
                            onChangeText={(password) => this.setState({ password })}
                            value={this.state.password}
                            placeholder="登录密码"
                            clearTextOnFocus={true}
                            secureTextEntry={true}
                        />
                    </View>
                    
                </View>
                <TouchableOpacity
                    onPress={this.doLogin}>
                    <View style={styles.button}>
                        <Text style={{color: "#fff", fontSize: 14}}>登录</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#F6F6F6',
      width,
      height,
      alignItems: 'center'
  },
  box: {
      display: 'flex',    
      width: 343,
      height: 263,
      top: -44,
      backgroundColor:'white',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: "column"
  },
  boxItems: {
      width: "100%",
      paddingLeft: 16,
      paddingRight: 16
      
  },
  img:{
    width: 22,
    height: 22,
    marginRight: 13,
    marginLeft: 14,
    marginTop: 0
  },
  item:{
      width: "100%",
      
        display: 'flex',
        height: 48,
      flexDirection: "row",
      alignItems: 'center',
      backgroundColor: "#F6F6F6",
      marginBottom: 12
  },
  boxItemsInput: {
      flex: 1,
      paddingRight: 16,
      padding: 0
  },
  button: {
      width: 311,
      height: 44,
      backgroundColor: '#4B74FF',
      display: "flex",
      alignItems: 'center',
      justifyContent: "center",
  }
});

const mapStateToProps = state => ({
    notifyId: state.userReducer.notifyId,
})

const mapDispatchToProps = dispatch => ({
    saveUserInfo: param => dispatch(action.saveUserInfo(param))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login)