import React, { Component } from 'react';
import { StyleSheet, StatusBar,BackHandler, Text, View ,TouchableOpacity, Dimensions, Platform, Image, ScrollView, AsyncStorage, Linking} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';

import { StackActions, NavigationActions } from 'react-navigation';
import UpdateModal from '../../components/updateModal';
import userService from '../../service/userService';
import Toast from '../../components/toast';
import config from '../../config';
import {sH, sW, sT, barHeight, navHeight} from '../../utils/screen';
import Header from '../../components/header';
import Action from '../../store/action';
import { getUserIntegral } from '../../store/thunk/systemVariable';
import { __param } from 'tslib';

const navStyle = navHeight();
const isAndroid = Platform.OS === 'android';
const {width, height} = Dimensions.get('window');
class Mine extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });

    state = {
        IsForceUpdate: false,
        version: '',
        desc: '',
        visible: false,
        fUrl: ''
    }

    resetLogin = () => {
        // 清空缓存
        AsyncStorage.clear();
        this.props.dispatch(Action.exitLoginClear());
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    componentDidMount()  {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            getUserIntegral();
            // BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        });
        // this.didBlurSubscription = this.props.navigation.addListener(
        //     'willBlur',
        //     (obj)=>{
        //         BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        //     }
        // )
    }

    onBackAndroid = () => {  
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            return false;
        }
        this.lastBackPressed = Date.now();
        Toast.show('再按一次退出应用');
        return true;
    }

    componentWillUnmount() {
        
    }

    // 检查更新
    checkUpdate = async () => {
        global.loading.show();
        let flag = Platform.OS =='android' ? 1 : 2
        const res = await userService.selectAppVersion(flag);
        global.loading.hide();
        console.log(res.msg);
        if (res.success) {
            if(res.obj == null) {
                return;
            }
            if (res.obj.fVersion != config.VESION_NO) {
                // 判断当前版本不相等
                this.setState({
                    visible: true,
                    IsForceUpdate: res.obj.fIsForceUpdate,
                    version: res.obj.fVersion,
                    desc: res.obj.fUpdateInfo,
                    fUrl: res.obj.fUrl
                })
            } else {
                // 符合当前版本
                Toast.show('当前已是最新版本，无需更新');
            }
        } else {
            Toast.show(res.msg);
        }
    }

    render() {
        const { userInfo, userIntegral } = this.props;
        return (
            <View style={styles.container}>
                <UpdateModal 
                    IsForceUpdate={this.state.IsForceUpdate}
                    tipText={`发现新版本 v${this.state.version}`}
                    desc={this.state.desc}
                    onCancel={()=>this.setState({visible:false})}
                    onOk={()=>{Linking.openURL(config.imgUrl+this.state.fUrl)}}
                    showModal={this.state.visible}
                />
                <Header
                    leftBtn={
                        <TouchableOpacity style={[{marginLeft: 13,position: 'relative'}]} onPress={()=>this.props.navigation.navigate('Message')}>
                            <Image source={require('../../image/index/notification.png')}></Image>
                            {this.props.messageInfo ? <View style={styles.tipMsg}/> : null}
                            
                        </TouchableOpacity>
                    }
                    titleText="我的"
                    props={this.props}
                />
                <ScrollView>
                    <View style={{height: 78, width, backgroundColor: "#486FFD", position: "absolute"}}></View>
                    <View style={styles.content}>
                        <View style={styles.cards}>
                                <View style={{display: "flex", flexDirection: "row",justifyContent: "space-between", height: 100, alignItems: "center"}}>
                                    <View style={{display: "flex", flexDirection: "row"}}>
                                        <View style={styles.userImgs}>
                                            <View style={styles.userImg}>
                                                <Text style={{fontSize: 14,color: "white"}}>
                                                    {userInfo ? userInfo.fUserName.substr(userInfo.fUserName.length-2,2) : ''}
                                                </Text>
                                            </View> 
                                        </View>
                                        <View style={styles.userInfo}>
                                            <Text style={styles.num}>{userInfo ? userInfo.fUserName : ''}</Text>
                                            <Text style={styles.des}>{userInfo ? userInfo.fDepName : ''}</Text>
                                        </View>
                                    </View>
                                    <View style={{width: 112, height: 34, alignItems: "center",display: "flex", flexDirection: "row", backgroundColor: "#FF6E36", borderTopLeftRadius: 8,borderBottomLeftRadius: 8}}>
                                        <Image source={require("../../image/mine/answer.png")} style={{marginLeft: 7, marginRight: 9}}/>
                                        <Text style={{color: "white"}}>答题积分</Text>
                                    </View>
                                </View>
                                <View style={styles.cardsInfo}>
                                    <View style={styles.infoItem}>
                                        <Text style={[styles.num,{marginBottom: 13}]}>{userIntegral.fUseIntegral == null ? '--': userIntegral.fUseIntegral}</Text>
                                        <Text style={styles.des}>安全积分</Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <Text style={[styles.num,{marginBottom: 13}]}>2次</Text>
                                        <Text style={styles.des}>违规处罚</Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <Text style={[styles.num,{marginBottom: 13}]}>4次</Text>
                                        <Text style={styles.des}>安全奖励</Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <Text style={[styles.num,{marginBottom: 13}]}>1400道</Text>
                                        <Text style={styles.des}>安全答题</Text>
                                    </View> 
                                </View>
                            
                        </View>
                        <View style={styles.aboutBar } >
                            <TouchableOpacity style={styles.baritem} onPress={() => {this.props.navigation.navigate('CollegeTabNavigator')}}>
                                <Image style={styles.barImg} source={require("../../image/mine/home-icon.png")}/>
                                <Text style={styles.barText}>砂石学院</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.baritem}>
                                <Image style={styles.barImg} source={require("../../image/mine/safety2-icon.png")}/>
                                <Text style={styles.barText}>安全中心</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.baritem}>
                                <Image style={styles.barImg} source={require("../../image/mine/win-icon.png")}/>
                                <Text style={styles.barText}>积分排行</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.baritem}>
                                <Image style={styles.barImg} source={require("../../image/mine/server-icon.png")}/>
                                <Text style={styles.barText}>案例中心</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.items}>
                            <TouchableOpacity style={styles.item}>
                            <View style={styles.itemAbout}>
                                <Image source={require("../../image/mine/idea.png")}/>
                                <Text style = {styles.itemText}>我的培训</Text>
                            </View>
                            <AntDesign name={'right'} size={15} style={{ color: '#CFCFCF' }} />
                        </TouchableOpacity>
                            <TouchableOpacity style={styles.item} onPress={() =>{this.props.navigation.navigate('ShopTabNavigator')}}>
                            <View style={styles.itemAbout}>
                                <Image source={require("../../image/mine/shop.png")}/>
                                <Text style = {styles.itemText}>积分商城</Text>
                            </View>
                            <AntDesign name={'right'} size={15} style={{ color: '#CFCFCF' }} />
                        </TouchableOpacity>
                            <TouchableOpacity style={styles.item}>
                            <View style={styles.itemAbout}> 
                                <Image source={require("../../image/mine/sett.png")}/>
                                <Text style = {styles.itemText}>通用设置</Text>
                            </View>
                            <AntDesign name={'right'} size={15} style={{ color: '#CFCFCF' }} />
                        </TouchableOpacity>
                            <TouchableOpacity style={styles.item}>
                            <View style={styles.itemAbout}> 
                                <Image source={require("../../image/mine/card.png")}/>
                                <Text style = {styles.itemText}>账号管理</Text>
                            </View>
                            <AntDesign name={'right'} size={15} style={{ color: '#CFCFCF' }} />
                        </TouchableOpacity>
                            <TouchableOpacity style={styles.item}>
                            <View style={styles.itemAbout}>
                                <Image source={require("../../image/mine/input.png")}/>
                                <Text style = {styles.itemText}>软件意见建议</Text>
                            </View>
                            <AntDesign name={'right'} size={15} style={{ color: '#CFCFCF' }} />
                        </TouchableOpacity>
                            <TouchableOpacity style={styles.item} onPress={this.checkUpdate}>
                            <View style={styles.itemAbout}>
                                <Image source={require("../../image/update.png")} style={{width: 18,height: 17}}/>
                                <Text style = {styles.itemText}>检查更新</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{marginRight: 5}}>{`v${config.VESION_NO}`}</Text>
                                <AntDesign name={'right'} size={15} style={{ color: '#CFCFCF' }} />
                            </View>
                        </TouchableOpacity>
                            <TouchableOpacity style={styles.item} onPress={this.resetLogin}>
                            <View style={styles.itemAbout}>
                                <Image source={require("../../image/mine/logout.jpg")} style={{width: 17,height: 18}}/>
                                <Text style = {styles.itemText}>退出登录</Text>
                            </View>
                            <AntDesign name={'right'} size={15} style={{ color: '#CFCFCF' }} />
                        </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
            )
        }
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width,
        height,
    },
    content: {
        paddingLeft: 16,
        paddingRight: 16,
        position: "relative",
    },
    cards:{
        marginTop: 10,
        width: width-32,
        borderRadius: 10,
        height: 162,
        display: "flex",
        flexDirection: "column",
        paddingLeft:16,
        backgroundColor: "#fff",
        shadowOffset: {  height: 4 }, 
        shadowOpacity: 0.8, 
        shadowRadius: 6, 
        elevation: 6 
    },
    userImgs:{
        width: 48,
        height: 48,
        backgroundColor: "#D9DEFF",
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    tipMsg: {
        width: 8,
        height: 8,
        borderRadius: 50,
        backgroundColor: 'red',
        position: 'absolute',
        bottom: 2,
        left: 14
    },
    userImg:{
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#4058FD",
        alignItems: "center",
        justifyContent: "center"
    },
    userInfo: {
        height: 44,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    },
    num: {
        color: "#000000",
        fontSize: 16
    },
    des:{
        color: "#999999",
        fontSize: 12
    },
    cardsInfo: {
        display: "flex",
        marginRight: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        
    },
    infoItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: 'center',
    },
    aboutBar: {
        paddingRight: 32,
        paddingLeft: 16,
        width,
        display: "flex",
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-between",
    },
    baritem: {
        display: "flex",
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'center',
    },
    barImg: {
        marginTop: 26,
        marginBottom: 12,
        width: 34,
        height: 34,

    },
    barText:{
        fontSize: 12,
        color: "#666666"
    },
    items:{
        marginTop: 12,
        width,
        backgroundColor: "white",
 
        paddingRight: 32,
    },
    item: {
        height: 50,
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',
        borderBottomColor:"#F8F8F9",
        borderBottomWidth: 1,
        justifyContent: 'space-between',
    },
    itemAbout:{
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',

    },
    itemText:{
        marginLeft: 10,
        fontSize: 14,
        color: "#333333"
    }
});

const mapStateToProps = state => ({
    userInfo: state.userReducer.userInfo,
    userIntegral: state.userReducer.userIntegral,
    messageInfo: state.userReducer.messageInfo,
})
export default connect(mapStateToProps)(Mine)
