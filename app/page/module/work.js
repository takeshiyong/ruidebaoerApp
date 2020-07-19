import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, BackHandler} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import Header from '../../components/header';
import Toast from '../../components/toast';

const {width, height} = Dimensions.get('window');
class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });

    componentDidMount() {
        // 启动监听该页面
        // this.viewDidAppear = this.props.navigation.addListener(
        //     'didFocus',
        //     (obj)=>{
        //         BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        //     }
        // )
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
        if (this.viewDidAppear) {
            this.viewDidAppear.remove();
        }
        if (this.didBlurSubscription) {
            this.didBlurSubscription.remove();
        }
    }

    render() {

        return (
            <View style={styles.container}>
                <Header 
                leftBtn={
                    <TouchableOpacity style={[{marginLeft: 13,position: 'relative'}]} onPress={()=>this.props.navigation.navigate('Message')}>
                        <Image source={require('../../image/index/notification.png')}></Image>
                        {this.props.messageInfo ? <View style={styles.tipMsg}/> : null}
                        
                    </TouchableOpacity>
                }
                    titleText="工作"
                    hidePlus={false} 
                    props={this.props}
                />
                <ScrollView>
                    <View style={styles.content}>
                    <View style={styles.consume}>
                            <Text style={[styles.title,{marginTop: 17}]}>常用应用</Text>
                            <View style={styles.items}>
                                <View style={styles.item}>
                                    <TouchableOpacity style={[styles.btn,{backgroundColor: "#36CA8B"}]} onPress={() => this.props.navigation.navigate('PowerManagement')}>
                                        <Image source={require("../../image/work/consumption.png")} style={{width: 56, height: 56}}/>
                                    </TouchableOpacity>
                                    <Text style={styles.des}>能耗管理</Text>
                                </View>
                                <View style={styles.item}>
                                    <TouchableOpacity style={[styles.btn,{backgroundColor: "#36CA8B"}]} onPress={() => this.props.navigation.navigate('ProductionManage')}>
                                        <Image source={require("../../image/work/info.png")} style={{width: 56, height: 56}}/>
                                    </TouchableOpacity>
                                    <Text style={styles.des}>产销管理</Text>
                                </View>
                                <View style={styles.item}>
                                    <TouchableOpacity style={[styles.btn,{backgroundColor: "#36CA8B"}]} onPress={() => this.props.navigation.navigate('Environmental')}>
                                        <Image source={require("../../image/work/Environmental.png")} style={{width: 56, height: 56}}/>
                                    </TouchableOpacity>
                                    <Text style={styles.des}>环境监控</Text>
                                </View>
                                <View style={styles.item}>
                                    <TouchableOpacity style={styles.btn} onPress={() => this.props.navigation.navigate('MeetingManage')}>
                                        <Image source={require("../../image/work/meeting.png")} style={{width: 56, height: 56}}/>
                                    </TouchableOpacity>
                                    <Text style={styles.des}>会议管理</Text>
                                </View>
                                <View style={styles.item}>
                                    <TouchableOpacity style={[styles.btn,{backgroundColor: "#3496F8"}]} onPress={() => this.props.navigation.navigate('Trouble')}>
                                        <Image source={require("../../image/work/trouble.png")} style={{width: 56, height: 56}}/>
                                    </TouchableOpacity>
                                    <Text style={styles.des}>隐患排查</Text>
                                </View>
                                <View style={styles.item}>
                                    <TouchableOpacity style={[styles.btn,{backgroundColor: "#3496F8"}]} onPress={()=>this.props.navigation.push('Map')}>
                                        <Image source={require("../../image/work/monitoring.png")} style={{width: 56, height: 56}}/>
                                    </TouchableOpacity>
                                    <Text style={styles.des}>厂区监控</Text>
                                </View>
                                <View style={styles.item}>
                                    <TouchableOpacity style={[styles.btn,{backgroundColor: "#3496F8"}]} onPress={()=>this.props.navigation.push('DeviceManage')}>
                                        <Image source={require("../../image/work/manage.png")} style={{width: 56, height: 56}}/>
                                    </TouchableOpacity>
                                    <Text style={styles.des}>设备管理</Text>
                                </View>
                                <View style={styles.item}>
                                    <TouchableOpacity style={[styles.btn,{backgroundColor: "#3496F8"}]} onPress={()=>this.props.navigation.push('CarshopsManage')}>
                                        <Image source={require("../../image/work/CarshopsManage.png")} style={{width: 56, height: 56}}/>
                                    </TouchableOpacity>
                                    <Text style={styles.des}>保养管理</Text>
                                </View>
                                {/* <View style={styles.item}>
                                    <TouchableOpacity style={[styles.btn,{backgroundColor: "#3496F8"}]} onPress={()=>this.props.navigation.push('DeviceRecodsMap', {fromWork: true})}>
                                        <Image source={require("../../image/work/circle.png")} style={{width: 56, height: 56}}/>
                                    </TouchableOpacity>
                                    <Text style={styles.des}>设备巡检</Text>
                                </View> */}
                                <View style={styles.item}>
                                    <TouchableOpacity style={[styles.btn,{backgroundColor: "#3496F8"}]} onPress={()=>this.props.navigation.push('CheckUpManage')}>
                                        <Image source={require("../../image/work/Inspection.png")} style={{width: 56, height: 56}}/>
                                    </TouchableOpacity>
                                    <Text style={styles.des}>巡检管理</Text>
                                </View>
                                <View style={styles.item}>
                                    <TouchableOpacity style={[styles.btn,{backgroundColor: "#3496F8"}]} onPress={()=>this.props.navigation.push('MaintainManage')}>
                                        <Image source={require("../../image/work/service.png")} style={{width: 56, height: 56}}/>
                                    </TouchableOpacity>
                                    <Text style={styles.des}>维修管理</Text>
                                </View>
                                <View style={styles.item}>
                                    <TouchableOpacity style={[styles.btn,{backgroundColor: "#3496F8"}]} onPress={()=>this.props.navigation.push('MaterialIdentificationManage')}>
                                        <Image source={require("../../image/work/MaterialIdentificationManage.png")} style={{width: 56, height: 56}}/>
                                    </TouchableOpacity>
                                    <Text style={styles.des}>料径识别</Text>
                                </View>
                                <View style={styles.item}>
                                    <TouchableOpacity style={[styles.btn,{backgroundColor: "#3496F8"}]} onPress={()=>this.props.navigation.push('VideoSurveillanceMange')}>
                                        <Image source={require("../../image/work/camera.png")} style={{width: 56, height: 56}}/>
                                    </TouchableOpacity>
                                    <Text style={styles.des}>视频监控</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.produce}>
                            <Text style={[styles.title,{marginTop: 17}]}>其他应用</Text>
                            <View style={styles.items}>
                            <View style={styles.item}>
                                <TouchableOpacity style={[styles.btn,{backgroundColor: "#36CA8B"}]} onPress={() => this.props.navigation.navigate('Verification')}>
                                    <Image source={require("../../image/work/verification.png")} style={{width: 56, height: 56}}/>
                                </TouchableOpacity>
                                <Text style={styles.des}>商品核销</Text>
                            </View>
                            <View style={styles.item}>
                                <TouchableOpacity style={[styles.btn,{backgroundColor: "#F05543"}]}>
                                    <Image source={require("../../image/work/review.png")} style={{width: 56, height: 56}}/>
                                </TouchableOpacity>
                                <Text style={styles.des}>安全检查</Text>
                            </View>
                            <View style={styles.item}>
                                <TouchableOpacity style={[styles.btn,{backgroundColor: "#3496F8"}]}>
                                    <Image source={require("../../image/work/accident.png")} style={{width: 56, height: 56}}/>
                                </TouchableOpacity>
                                <Text style={styles.des}>事故管理</Text>
                            </View>
                            <View style={styles.item}>
                                <TouchableOpacity style={[styles.btn,{backgroundColor: "#3496F8"}]}>
                                    <Image source={require("../../image/work/emergency.png")} style={{width: 56, height: 56}}/>
                                </TouchableOpacity>
                                <Text style={styles.des}>应急资源</Text>
                            </View>
                            
                            <View style={styles.item}>
                                <TouchableOpacity style={[styles.btn,{backgroundColor: "#3496F8"}]}>
                                    <Image source={require("../../image/work/workP.png")} style={{width: 56, height: 56}}/>
                                </TouchableOpacity>
                                <Text style={styles.des}>工作票</Text>
                            </View>
                            <View style={styles.item}>
                                <TouchableOpacity style={[styles.btn,{backgroundColor: "#3496F8"}]}>
                                    <Image source={require("../../image/work/dangerous.png")} style={{width: 56, height: 56}}/>
                                </TouchableOpacity>
                                <Text style={styles.des}>危险区域</Text>
                            </View>
                            <View style={styles.item}>
                                <TouchableOpacity style={styles.btn} onPress={() => this.props.navigation.navigate('WorkStatus')}>
                                    <Image source={require("../../image/work/WorkStatu.png")} style={{width: 56, height: 56}}/>
                                </TouchableOpacity>
                                <Text style={styles.des}>工作状态</Text>
                            </View>
                            <View style={styles.item}>
                                <TouchableOpacity style={[styles.btn,{backgroundColor: "#3496F8"}]} onPress={ () => this.props.navigation.navigate('AttendanceRecord')}>
                                    <Image source={require("../../image/work/attendance.png")} style={{width: 56, height: 56}}/>
                                </TouchableOpacity>
                                <Text style={styles.des}>考勤记录</Text>
                            </View>
                            <View style={styles.item}>
                                <TouchableOpacity style={[styles.btn,{backgroundColor: "#3496F8"}]} onPress={ () => this.props.navigation.navigate('CultivateManage')}>
                                    <Image source={require("../../image/work/cultivateManage.png")} style={{width: 56, height: 56}}/>
                                </TouchableOpacity>
                                <Text style={styles.des}>培训管理</Text>
                            </View>
                        </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
      messageInfo: state.userReducer.messageInfo,
      fEmployeeId: state.userReducer.userInfo.fEmployeeId
    }
}
export default connect(mapStateToProps)(App);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        display: "flex"
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
    content: {
        paddingTop: 10,
        backgroundColor: '#FFF',
    },
    title: {
        fontSize: 16,
        color: "#000",
        fontWeight: '600',
        marginLeft: 16
    },
    items: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        marginBottom: 17,
    },
    item: {
        width: width/4,
        alignItems: 'center',
        marginTop: 14
    },
    btn: {
        width: 56,
        height: 56,
        backgroundColor: "#FE9340",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center"
    },
    des:{
        marginTop: 6,
        textAlign: "center",
        width: 56,
        color: "#999999",
        fontSize: 12
    },
    people: {

    },
    produce: {

    },
    consume: {

    }
});
