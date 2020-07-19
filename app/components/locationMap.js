import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, PermissionsAndroid,Modal, PanResponder, TouchableOpacity, Image, TouchableHighlight, RefreshControl, Platform, ScrollView} from 'react-native';
import {
    MapView, 
    MapTypes, 
    Geolocation,
    Overlay
} from 'react-native-baidu-map';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import SplashScreen from 'react-native-splash-screen';
import Picker from 'react-native-wheel-picker';
import Toast from 'react-native-root-toast';

import {clientHeight, navHeight,isIphoneX} from '../utils/screen';
import deviceServer from '../service/deviceServer';
import Header from './header';
const navStyle = navHeight();
const isAndroid = Platform.OS === 'android';
const {width, height} = Dimensions.get('window');
const PickerItem = Picker.Item;
export default class DeviceRecodsMap extends Component {
    state = {
        showPicker: false,
        mayType: MapTypes.NORMAL,
        trafficEnabled: false,
        baiduHeatMapEnabled: false,
        zoom: 15,
        markers: [],
        markers1:[],
        markers2:[],
        center:{
            latitude: 34.190028,
            longitude: 108.88379,
        },
        clickMark: null,
        panelHeight: 90,
        panelShow: true,
        showType: 0,
        typeLever: true, //true地图 ,false路线页面,
        changeData: {},
        typeData: {
            index: 0,
            fId: '',
            fName: '请选择巡检路线'
        },
        pickerList: [],
        itemList: [],
        refreshing: false,
        taskDetail: {},
        taskStatus: {}
    };
    
    static navigationOptions = ({ navigation }) => ({
        header: null
    });

    componentDidMount() {
        SplashScreen.hide();
        this.getCurrentPosition();
        this.requestLocationPermission();
        if (this.props.navigation.state && this.props.navigation.state.params.location) {
          this.setState({
            clickMark: this.props.navigation.state.params.location.str
          })
        }
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
                longitude: res.longitude - 0.002*Math.floor(Math.random()*10),
                nums: Math.floor(Math.random()*10)
            }
            arr.push(obj);
        }
        this.setState({
            center: {
                latitude: res.latitude,
                longitude: res.longitude,
            },
            markers1: [arr[0], arr[1], arr[2]],
            markers2: [arr[2], arr[3], arr[4]],
            markers: arr
        })
    }

    // 确定定位信息
    sureLocation = async () => {
      const { clickMark } = this.state;
      if (!clickMark) {
        Toast.show('请选择定位点');
        return;
      }
      const res = await Geolocation.getCurrentPosition({lat: this.state.clickMark.latitude, lng: this.state.clickMark.longitude});
      this.props.navigation.goBack();
      this.props.navigation.state.params.getLocation({str: clickMark, fName: res.address});
    }

    render() {
        const { showType, markers1, markers2, markers, taskDetail, typeData, taskStatus } = this.state;
        const { Marker, Arc, Circle, Polyline, Polygon, InfoWindow } = Overlay;
        return (
            <View style={styles.container}>
                <Header
                    backBtn={true}
                    titleText="地图"
                    hidePlus={true}
                />
                    <View style={{position: 'relative',alignItems: 'center'}}>
                        <MapView
                            trafficEnabled={this.state.trafficEnabled}
                            baiduHeatMapEnabled={this.state.baiduHeatMapEnabled}
                            zoom={this.state.zoom}
                            zoomControlsVisible={false}
                            mapType={this.state.mapType}
                            center={this.state.center}
                            style={styles.map}
                            onMapClick={(e) => {
                                this.setState({
                                    clickMark: e,
                                });
                            }}
                        >
                        {
                            this.state.clickMark ? 
                            <Marker 
                              perspective={true}
                              title="设备点"
                              location={this.state.clickMark}
                              cust="test"
                            /> : null
                        }
                        </MapView>
                        <View style={styles.botton}>
                            <TouchableOpacity style={styles.bottomLeft} onPress={()=>this.sureLocation()}>
                                <Text style={{color: "#fff", fontSize: 16}}>确定</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
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
        bottom: 0,
        zIndex: 99,
        width: width - 40,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
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
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        flexDirection: 'row'
    },
    panelItems: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',

    },
    TopLeftBtn: {
        width: width - 110,
        height: 44,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.9)',
        flexDirection: "row",
        alignItems: "center",
        // shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 }, 
        shadowOpacity: 0.5, 
        shadowRadius: 3, 
        elevation: 1 
    },
    topLeftLeftBtn: {
        borderRightWidth: 1,
        borderRightColor: "#E0E0E0",
        height: 20,
        alignItems: "center",
        flexDirection: "row",
        paddingLeft: 12
    },
    TopRightBtn: {
        height: 44,
        borderRadius: 4,
        width: 44,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: "center",
        justifyContent: "center",
        // shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 }, 
        shadowOpacity: 0.5, 
        shadowRadius: 3, 
        elevation: 1 
    },
    inforTopPanel: {
        position: 'absolute',
        left: 20,
        top: isAndroid ? navStyle.height+15 : (isIphoneX() ? navStyle.height+65 : navStyle.height+35),
        zIndex: 99,
        width: width - 40,
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        // borderRadius: 4,
        // backgroundColor: 'rgba(255,255,255,0.9)',
        flexDirection: "row",
        justifyContent: "space-between"
    },
    ToPoint: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(255,255,255,0.9)',
        zIndex: 99,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        position: 'absolute',
        right: 20,
        bottom: isAndroid ? 108 : (isIphoneX() ? 183 : 138),
    },
    botton: {
        borderTopColor: "#E0E0E0",
        borderTopWidth: 1,
        height: 59,
        alignItems: "center", 
        paddingLeft: 16, 
        paddingRight: 16, 
        flexDirection: "row", 
        justifyContent: "space-between",
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: "#fff",
        zIndex: 999999,
        position: 'absolute',
        bottom: 3,
        width,
    },
    bottomLeft: {
        flex: 2,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        borderRadius: 4,
        backgroundColor: '#5970FE'
    },
    bottomRight: {
        flex: 3,
        backgroundColor: "#4058FD", 
        alignItems: "center", 
        justifyContent: "center",
        height: "100%",
        borderRadius: 5,
        flexDirection: "row"
    },
    
    item: {
        marginBottom: 8
    },
    leftItem: {
        height: 44,
        justifyContent: "center",
        alignItems: "center",
        borderRightColor: "#E0E0E0",
        borderRightWidth: 1
    },
    rightText: {
        fontSize: 16,
        color: '#666666',
        fontWeight: "500"
    },
    leftText: {
        fontSize: 16,
        color: '#FF632E',
        fontWeight: "500"
    },
    bottomText: {
        color: "#999",
        fontSize: 12,
        marginTop: 10
    },
    //picker
    modalStyle: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center'
    },
    selectModalTop: {
        width: width,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0
      },
    selectModalBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 5,
        paddingTop: 8,
        paddingBottom: 8,
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1
    },
    publishButton: {
        width: width-32,
        height:44,
        backgroundColor: "#4058FD",
        borderRadius: 5,
        marginTop: 17,
        alignItems: "center",
        justifyContent: "center"
    }
});   
