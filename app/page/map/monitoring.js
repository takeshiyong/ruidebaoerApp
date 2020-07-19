import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, PermissionsAndroid, PanResponder, TouchableOpacity, Image, TouchableHighlight, Platform} from 'react-native';
import {
    MapView, 
    MapTypes, 
    Geolocation,
    Overlay
} from 'react-native-baidu-map';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import SplashScreen from 'react-native-splash-screen';

import {clientHeight, navHeight,isIphoneX} from '../../utils/screen';
import Header from '../../components/header';

const isAndroid = Platform.OS === 'android';
const {width, height} = Dimensions.get('window');
export default class Map extends Component {
    state = {
        mayType: MapTypes.NORMAL,
        trafficEnabled: false,
        baiduHeatMapEnabled: false,
        zoom: 15,
        markers:[],
        center:{
            latitude: 34.190028,
            longitude: 108.88379,
        },
        
        clickMark: null,
        panelHeight: 90,
        panelShow: true,
        showType: 0,
    };
    
    static navigationOptions = ({ navigation }) => ({
        header: null
    });

    componentDidMount() {
        SplashScreen.hide();
        this.getCurrentPosition();
        this.requestLocationPermission();
    }

    // 获取权限
    async requestLocationPermission() {
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

    componentWillMount() {
       
    }

    // 获取当前地理位置
    getCurrentPosition = async () => {
        const res = await Geolocation.getCurrentPosition();
        console.log('获取当前地理位置', res);
        let arrNum = [0,1,2,3,4];
        let arr = [];
        if (!res.latitude || !res.longitude) {
            return;
        }
        console.log(res.latitude - 0.0002*1, Math.floor(Math.random()*10));
        for (let key of arrNum) {
            console.log(obj, key)
            let obj = {
                type: key,
                latitude: res.latitude - 0.002*Math.floor(Math.random()*10),
                longitude: res.longitude - 0.002*Math.floor(Math.random()*10)
            }
            arr.push(obj);
        }
        this.setState({
            center: {
                latitude: res.latitude,
                longitude: res.longitude,
            },
            markers: arr
        })
        console.log('arr', arr)
    }

    renderMarker = (item,key) => {
        const { Marker, Arc, Circle, Polyline, Polygon, InfoWindow } = Overlay
        let type = item.type;
        let imgUrl = require("../../image/map/alarm-normal.png");
        if (type == 1) {
            imgUrl = require("../../image/map/box.png");
        } else if (type == 2) {
            imgUrl = require("../../image/map/lamp.png");
        } else if (type == 3) {
            imgUrl = require("../../image/map/mic.png");
        } else if (type == 4) {
            imgUrl = require("../../image/map/people.png");
        } else if (type == 5) {
            imgUrl = require("../../image/map/target.png");
        }
        return (
            <Marker 
                key={key}
                perspective={true}
                title="设备点"
                location={{latitude: item.latitude, longitude: item.longitude}}
                cust="test"
                icon={imgUrl}
            />
        )
    }

    render() {
        const { showType, } = this.state;
        const { Marker, Arc, Circle, Polyline, Polygon, InfoWindow } = Overlay;
        return (
            <View style={styles.container}>
                <Header
                    backBtn={true}
                    titleText="厂区监控"
                    props={this.props}
                />
                <View style={{position: 'relative',alignItems: 'center'}}>
                    <View style={styles.positionView}>
                        <View style={styles.panelView}>
                            <TouchableOpacity style={styles.panelItem} onPress={()=>this.setState({showType: 1})}>
                                <Image source={showType==1 ? require('../../image/map/warning-active.png')  : require('../../image/map/warning.png')}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.panelItem} onPress={()=>this.setState({showType: 2})}>
                                <Image source={showType==2 ? require('../../image/map/alarm-active.png') : require('../../image/map/alarm.png')}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.panelItem} onPress={()=>this.setState({showType: 3})}>
                                <Image source={showType==3 ? require('../../image/map/Stone-cube-active.png') : require('../../image/map/Stone-cube.png')}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.panelItem} onPress={()=>this.setState({showType: 4})}>
                                <Image source={showType==4 ? require('../../image/map/my-active.png') : require('../../image/map/my.png')}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.panelItem,{borderBottomWidth: 0}]} onPress={()=>this.setState({showType: 5})}>
                                <Image source={showType==5 ? require('../../image/map/resource-active.png') : require('../../image/map/resource.png')}/>   
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.micView} onPress={()=>this.setState({showType: 6})}>
                            <Image source={showType==6 ? require('../../image/map/webcam-fill-active.png'): require('../../image/map/webcam-fill.png')}/>
                        </TouchableOpacity>
                    </View>
                    <MapView
                        trafficEnabled={this.state.trafficEnabled}
                        baiduHeatMapEnabled={this.state.baiduHeatMapEnabled}
                        zoom={this.state.zoom}
                        mapType={this.state.mapType}
                        center={this.state.center}
                        marker={this.state.marker}
                        style={styles.map}
                        onMapClick={(e) => {
                            this.setState({
                                clickMark: null,
                                panelHeight: 0
                            });
                        }}
                        onMarkerClick={(e)=>{
                            this.setState({
                                clickMark: {latitude: e.position.latitude, longitude: e.position.longitude},
                                center: {latitude: e.position.latitude, longitude: e.position.longitude},
                                panelHeight: 90,
                                panelShow: true
                            });
                        }}  
                    >
                    {
                        this.state.markers.map((item, key)=>{
                            return this.renderMarker(item, key);
                        })
                    }
                    </MapView>
                    {showType==1 ? 
                        <View style={styles.inforPanel}>
                            <TouchableOpacity style={styles.backBtn}>
                                <View style={styles.tipBtn}></View>
                            </TouchableOpacity>
                            <View style={styles.panelTitle}>
                                <Image source={require('../../image/map/warning-active.png')}/>
                                <Text style={{color: '#000', fontSize: 15,fontWeight: 'bold', marginLeft: 10}}>隐患信息</Text>
                            </View>
                            <View style={{flex: 1,marginBottom: 10}}>
                                <View style={styles.panelItems}>
                                    <View style={{flex: 1}}>
                                        <Text style={{color: '#666'}}>隐患级别: B级</Text>
                                    </View>
                                    <View style={{flex: 1,alignItems: 'center'}}>
                                        <Text style={{color: '#666'}}>隐患数量: 3处</Text>
                                    </View>
                                </View>
                                <View style={styles.panelItems}>
                                    <Text style={{color: '#666'}}>隐患位置: 生活区</Text>
                                </View>
                                <View style={styles.panelItems}>
                                    <Text style={{color: '#666'}}>最近上报时间: 2019年05月14分 14时22分</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.bottomBtn} onPress={()=>{}}>
                                <Text style={{color: '#fff',fontSize: 15}}>查看隐患列表</Text>
                            </TouchableOpacity>
                        </View>:null}
                        {showType==2 ?
                        <View style={styles.inforPanel}>
                            <TouchableOpacity style={styles.backBtn}>
                                <View style={styles.tipBtn}></View>
                            </TouchableOpacity>
                            <View style={styles.panelTitle}>
                                <Image source={require('../../image/map/alarm-active.png')}/>
                                <Text style={{color: '#000', fontSize: 15,fontWeight: 'bold', marginLeft: 10}}>风险信息</Text>
                            </View>
                            <View style={{flex: 1,marginBottom: 10}}>
                                <View style={styles.panelItems}>
                                    <View style={{flex: 1}}>
                                        <Text style={{color: '#666'}}>风险数量: 低级风险1处</Text>
                                    </View>
                                </View>
                                <View style={styles.panelItems}>
                                    <Text style={{color: '#666'}}>风险位置: 生活区</Text>
                                </View>
                                <View style={styles.panelItems}>
                                    <Text style={{color: '#666'}}>风险更新时间: 2019年05月14分 14时22分</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.bottomBtn} onPress={()=>{}}>
                                <Text style={{color: '#fff',fontSize: 15}}>查看风险列表</Text>
                            </TouchableOpacity>
                        </View>:null}
                        {showType==3 ? 
                        <View style={styles.inforPanel}>
                            <TouchableOpacity style={styles.backBtn}>
                                <View style={styles.tipBtn}></View>
                            </TouchableOpacity>
                            <View style={styles.panelTitle}>
                                <Image source={require('../../image/map/Stone-cube-active.png')}/>
                                <Text style={{color: '#000', fontSize: 15,fontWeight: 'bold', marginLeft: 10}}>设备信息</Text>
                            </View>
                            <View style={{flex: 1,marginBottom: 10,paddingTop: 12,paddingBottom: 12}}>
                                <View style={styles.panelItems}>
                                    <View style={{flex: 1}}>
                                        <Text style={{color: '#666'}}>设备名称: 西区03号破碎机</Text>
                                    </View>
                                </View>
                                <View style={styles.panelItems}>
                                <Text style={{color: '#666'}}>设备类型: 颚式破碎机</Text>
                                </View>
                                <View style={styles.panelItems}>
                                    <Text style={{color: '#666'}}>设备状态: 20190907YCJPS</Text>
                                </View>
                                <View style={styles.panelItems}>
                                    <Text style={{color: '#666'}}>运行时长: 2045172h</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.bottomBtn} onPress={()=>{}}>
                                <Text style={{color: '#fff',fontSize: 15}}>查看设备详情</Text>
                            </TouchableOpacity>
                        </View>:null}
                        {showType==4 ? 
                        <View style={styles.inforPanel}>
                            <TouchableOpacity style={styles.backBtn}>
                                <View style={styles.tipBtn}></View>
                            </TouchableOpacity>
                            <View style={styles.panelTitle}>
                                <Image source={require('../../image/map/my-active.png')}/>
                                <Text style={{color: '#000', fontSize: 15,fontWeight: 'bold', marginLeft: 10}}>人员信息</Text>
                            </View>
                            <View style={{flex: 1,marginBottom: 10}}>
                                <View style={styles.panelItems}>
                                    <View style={{flex: 1}}>
                                        <Text style={{color: '#666'}}>姓名: 李科</Text>
                                    </View>
                                    <View style={{flex: 1,alignItems: 'center'}}>
                                        <Text style={{color: '#666'}}>电话: 15691715325</Text>
                                    </View>
                                </View>
                                <View style={styles.panelItems}>
                                    <Text style={{color: '#666'}}>职位及部门: 资料员-销售部</Text>
                                </View>
                                <View style={styles.panelItems}>
                                    <Text style={{color: '#666'}}>位置更新: 5分钟</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.bottomBtn} onPress={()=>{}}>
                                <Text style={{color: '#fff',fontSize: 15}}>查看人员信息</Text>
                            </TouchableOpacity>
                        </View>:null}
                        {showType==5 ? 
                        <View style={styles.inforPanel}>
                            <TouchableOpacity style={styles.backBtn}>
                                <View style={styles.tipBtn}></View>
                            </TouchableOpacity>
                            <View style={styles.panelTitle}>
                                <Image source={require('../../image/map/resource-active.png')}/>
                                <Text style={{color: '#000', fontSize: 15,fontWeight: 'bold', marginLeft: 10}}>测量点信息</Text>
                            </View>
                            <View style={{flex: 1,marginBottom: 10}}>
                                <View style={styles.panelItems}>
                                    <View style={{flex: 1}}>
                                        <Text style={{color: '#666'}}>温度: 24℃</Text>
                                    </View>
                                    <View style={{flex: 1,alignItems: 'center'}}>
                                        <Text style={{color: '#666'}}>湿度: 11%</Text>
                                    </View>
                                </View>
                                <View style={styles.panelItems}>
                                    
                                    <View style={{flex: 1}}>
                                        <Text style={{color: '#666'}}>噪音: 47dB</Text>
                                    </View>
                                    <View style={{flex: 1,alignItems: 'center'}}>
                                        <Text style={{color: '#666'}}>PM2.5: 110</Text>
                                    </View>
                                </View>
                                <View style={styles.panelItems}>
                                    <Text style={{color: '#666'}}>PM10: 145</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.bottomBtn} onPress={()=>{}}>
                                <Text style={{color: '#fff',fontSize: 15}}>查看历史数据</Text>
                            </TouchableOpacity>
                        </View>:null}
                        {showType==6 ? 
                        <View style={styles.inforPanel}>
                            <TouchableOpacity style={styles.backBtn} onPress={()=>{console.log(123)}}>
                                <View style={styles.tipBtn}></View>
                            </TouchableOpacity>
                            <View style={styles.panelTitle}>
                                <Image source={require('../../image/map/webcam-fill-active.png')}/>
                                <Text style={{color: '#000', fontSize: 15,fontWeight: 'bold', marginLeft: 10}}>摄像头信息</Text>
                            </View>
                            <View style={{flex: 1,marginBottom: 10}}>
                                <View style={styles.panelItems}>
                                    <View style={{flex: 1}}>
                                        <Text style={{color: '#666'}}>名称: 破碎机监控</Text>
                                    </View>
                                    <View style={{flex: 1,alignItems: 'center'}}>
                                    </View>
                                </View>
                                <View style={styles.panelItems}>
                                    
                                    {/* <View style={{flex: 1}}>
                                        <Text style={{color: '#666'}}>噪音: 47dB</Text>
                                    </View>
                                    <View style={{flex: 1,alignItems: 'center'}}>
                                        <Text style={{color: '#666'}}>PM2.5: 110</Text>
                                    </View> */}
                                </View>
                                <View style={styles.panelItems}>
                                    {/* <Text style={{color: '#666'}}>PM10: 145</Text> */}
                                </View>
                            </View>
                            <TouchableOpacity onPress={()=>{this.props.navigation.push('Live')}}>
                                <View style={styles.bottomBtn}>
                                    <Text style={{color: '#fff',fontSize: 15}} >查看监控</Text>
                                </View>
                            </TouchableOpacity>
                        </View>:null}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: height,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    map: {
        height: height- navHeight().height - 20,
        width
    },
    positionView: {
        position: 'absolute',
        right: 20,
        top: 20,
        zIndex: 99,
    },
    panelView: {
        height: 200,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderColor: '#C1C6D6',
        borderWidth: 1
    },
    micView: {
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderColor: '#C1C6D6',
        borderWidth: 1,
        paddingLeft: 11,
        paddingRight: 11,
        paddingTop: 11,
        paddingBottom: 11,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    panelItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        marginLeft: 8,
        paddingLeft: 3,
        paddingRight: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    inforPanel: {
        position: 'absolute',
        left: 20,
        bottom: isAndroid ? 20 : (isIphoneX() ? 95 : 50),
        zIndex: 99,
        width: width - 40,
        height: 230,
        borderWidth: 1,
        borderColor: '#C1C6D6',
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingRight: 15,
        paddingLeft: 15
    },
    backBtn: {
        width: width - 70,
        height: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tipBtn: {
        width: 40,
        borderRadius: 3,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderColor: '#E0E0E0'
    },
    panelTitle: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        alignItems: 'center',
        paddingLeft: 5
    },
    bottomBtn: {
        width: width - 70,
        height: 40,
        backgroundColor: '#4B74FF',
        marginBottom: 10,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
    },
    panelItems: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',

    }
});   
