import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions,ImageBackground,ScrollView, TouchableOpacity, Image, TouchableHighlight, Platform} from 'react-native';
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
import Picker from 'react-native-wheel-picker';
import deviceServer from '../../service/deviceServer';
import { parseTime, parseDate, handlePhotoToJs } from '../../utils/handlePhoto';
import Toast from '../../components/toast';
import CameraUpload from '../../components/ImageAbout/CameraUpload';


const navStyle = navHeight();
const isAndroid = Platform.OS === 'android';
const {width, height} = Dimensions.get('window');
const PickerItem = Picker.Item;
export default class DeviceRecodsMap extends Component {
    state = {
       type: 1, // 显示不同内容,  2: 设备的巡检记录 3：整体的巡检记录 4: 个人的巡检记录,
       id: "",
       item: {},
       itemList: [],
       fromAbnormal: false
    };
    
    static navigationOptions = ({ navigation }) => ({
        header: null
    });

    componentDidMount() {
        SplashScreen.hide();
        if (this.props.navigation.state.params && this.props.navigation.state.params.type && this.props.navigation.state.params.item) {
            this.setState({
              type: this.props.navigation.state.params.type,
              item: this.props.navigation.state.params.item,
              fromAbnormal: this.props.navigation.state.params.fromAbnormal,
              id: this.props.navigation.state.params.item.fPatrolTaskId
            }, ()=>{
                this.getPageDetail();
            })
          }
    }
    
    getPageDetail = async () => {
        console.log(this.props.navigation.state.params)
        const res = await deviceServer.getPageDetail({
            fPatrolTaskId: this.state.id
        })
        console.log('getPageDetail', res);
        if(res.success){
            this.setState({
                itemList: res.obj
            })
        }else{
            Toast.show(res.msg)
        }
        
    }
    getErrorDetail = async (item,index) => {
        console.log(item, 'item');
        if(!item.showBtn){
            if (item.fileList) {
                let itemList = [...this.state.itemList];
                itemList[index].showBtn = true;
                this.setState({
                    itemList
                })
                return;
            }
            global.loading.show();
            const res = await deviceServer.getErrorDetail(item.fPatrolRecordId);
            global.loading.hide();
            if(res.success){
                let fileList = res.obj;
                let itemList = [...this.state.itemList];
                for(let item of itemList){
                    if(item.fileList&&item.fileList.length !==0 ){
                        item.fileList = []
                    }
                }
                itemList[index].showBtn = true;
                itemList[index].fileList = fileList.map((data)=>{
                    return {
                        ...data,
                        tPatrolItemsRecordAndFile: data.tPatrolItemsRecordAndFile.map((data)=>{
                            return {
                                ...data,
                                files: handlePhotoToJs(data.files)
                            }
                        })
                    }
                })
                this.setState({
                    itemList
                })
            }else{
                console.log(res.msg);
                Toast.show(res.msg)
            }
        }else{
            let itemList = [...this.state.itemList];
            itemList[index].showBtn = false;
            this.setState({
                itemList
            })
        }
        
    }

    // 查看巡检设备页面
    patrolequipment = (item) => {   
        this.props.navigation.push('EquipmentList', {item: {fPatrolTaskId: item}})
    }

    render() {
        const { item, type, itemList} = this.state;
        console.log(item, 'item');
        return (
            <View style={styles.container}>
                
                <Header
                    backBtn={true}
                    titleText="记录详情"
                    hidePlus={true}
                />
                <ScrollView style={styles.content}>
                    <View style={styles.topBanner}>
                        <View style={{flexDirection: "row",marginBottom: 12}}>
                            <Text style={styles.leftText}>巡检时间</Text>
                            <Text style={styles.rightText}>{item.fPatrolTaskDate?parseDate(parseTime(item.fPatrolTaskDate), 'YYYY.MM.DD'): '--'}</Text>
                        </View>
                        {this.state.type == 2?<View style={{flexDirection: "row",marginBottom: 12}}>
                            <Text style={styles.leftText}>巡检设备</Text>
                            <Text style={styles.rightText}>{this.props.navigation.state.params.name? this.props.navigation.state.params.name: '--'}</Text>
                        </View>:null}
                        {this.state.type == 3||this.state.type == 4?
                        <View 
                            style={{flexDirection: "row",marginBottom: 12}} 
                        >
                            <Text style={[styles.leftText, ]}>巡检路线</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between', flex: 1}}>
                                <Text style={[styles.rightText, {color: '#333',flex: 1,paddingRight: 5}]} numberOfLines={1}>{item.fPatrolRouteName?item.fPatrolRouteName: '--'}</Text>
                                <TouchableOpacity style={{paddingRight: 5}} onPress={()=>this.patrolequipment(item.fPatrolTaskId)}>
                                    <Text style={[styles.rightText, {color: '#73BAFC'}]}>{'查看巡检设备'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>:null}
                        <View style={{flexDirection: "row",marginBottom: 12}}>
                            <Text style={styles.leftText}>巡检次数</Text>
                            <Text style={styles.rightText}>{item.fPatrolTaskRecordNum?item.fPatrolTaskRecordNum: '--' }</Text>
                        </View>
                        <View style={{flexDirection: "row"}}>
                            <Text style={styles.leftText}>巡  检  人</Text>
                            <Text style={styles.rightText}>{item.tEquipmentPatrolTaskUserList ? item.tEquipmentPatrolTaskUserList.map((data)=>(data.fUserName)).join(','): '--'}</Text>
                        </View>
                    </View>
                    <View style={{width: "100%",height: 1,backgroundColor: "#E0E0E0",marginTop: 16,marginBottom: 16}}></View>
                    <View style={styles.items}>
                        {
                            itemList.length != 0 ?itemList.map((item,index) => {
                                if (this.state.fromAbnormal && !item.fRecordIsAbnormal) {
                                    return null;
                                }
                                return(<View key={index} style={styles.item} >
                                        <TouchableOpacity onPress={() => {item.fRecordIsAbnormal?this.getErrorDetail(item,index): null}} style={{flexDirection: "row",marginBottom: 8,alignItems: "center",justifyContent: "space-between"}}>
                                            <View style={{flexDirection: "row",alignItems: "center",flex: 3}}>
                                                <ImageBackground  source={require('../../image/equiement/round.png')} style={{width: 28,height: 28,marginRight: 12,justifyContent: "center",alignItems: "center"}}>
                                                    <Text style={{color: "#fff",fontSize: 12}}>{index+1}</Text>
                                                </ImageBackground>
                                                <Text style={{color: !item.fRecordIsAbnormal?'#6FB967': '#F56767',fontSize: 14,fontWeight: "600"}}>{!item.fRecordIsAbnormal?'正常': '异常'}</Text>
                                            </View>
                                            <Text style={{flex: 4}}>
                                            {item.fRecordStartTime?parseDate(parseTime(item.fRecordStartTime), 'MM-DD HH:mm'): '--'} ~ {item.fRecordEndTime?parseDate(parseTime(item.fRecordEndTime), 'MM-DD HH:mm'): '--'}</Text>
                                            { item.fRecordIsAbnormal ? 
                                                    item.fileList&&item.showBtn&&item.fileList.length !==0 ? <AntDesign name={'up'} color='#333' /> : <AntDesign name={'down'} color='#333' />
                                            : <View style={{width: 12}}/>}
                                        </TouchableOpacity>
                                        { item.fileList&&item.showBtn&&item.fileList.length !==0 ?
                                            item.fileList.map((items) => {
                                                return items.tPatrolItemsRecordAndFile.map((item, index) => {
                                                    return(<View key={index} style={{flexDirection: "row",marginTop: 5}}> 
                                                    <View style={styles.centerContent}>
                                                        <View style={styles.centerContentHeader}>
                                                            <Text style={{color: "#666",fontSize: 12}}>{items.tPatrolEquipmentRecord.fTime?items.tPatrolEquipmentRecord.fTime: '--'}</Text>
                                                            <Text style={{color: "#666",fontSize: 12}}>{items.tPatrolEquipmentRecord.fEquipmentName?items.tPatrolEquipmentRecord.fEquipmentName: '--'}</Text>
                                                        </View>
                                                        <View style={{paddingLeft: 12,paddingRight: 12}}>
                                                            <View style={{flexDirection: "row",justifyContent: "space-between",alignItems: "center"}}>
                                                                <Text style={{marginTop: 16,color: "#666666",fontSize: 12}}>测项：{item.tPatrolItemsRecord.fCheckItemsContent?item.tPatrolItemsRecord.fCheckItemsContent: '--'}</Text>
                                                            </View>
                                                            <Text style={{marginBottom: 16,color: "#666666",fontSize: 12,marginTop: 3}}>描述：{item.tPatrolItemsRecord.fPatrolItemsDescribe||'--'}</Text>
                                                            {
                                                             item.files.length !== 0? 
                                                                <View style={{flexDirection: "row",justifyContent: "space-between",paddingBottom: 20}}>
                                                                    <CameraUpload
                                                                        disabled={true}
                                                                        value={item.files}
                                                                        imgStyle={{width: 85,height: 85,backgroundColor: "#E0E0E0"}}
                                                                    /> 
                                                                </View> : null
                                                            }
                                                        </View>
                                                    </View>
                                                </View>)
                                                })
                                            })
                                         : null}
                                    </View>)
                            }): <View style={{flex: 1,alignItems: 'center',justifyContent: 'center'}}>
                                <Text>暂无数据</Text>
                            </View>
                        }
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: height,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    content: {
        height: height,
        width: width,
        paddingRight: 16,
        marginBottom: 20,
        paddingLeft: 16
    },
    topBanner: {
        width: "100%",
        height: 148,
        backgroundColor: "#F6F6F6",
        marginTop: 17,
        borderRadius: 6,
        paddingLeft: 16,
        paddingTop: 16
    },
    leftText: {
        color: '#999999',
        fontSize: 14,
        marginRight: 8
    },
    rightText: {
        color: '#333333',
        fontSize: 14,
        fontWeight: "500"
    },
    item: {
        marginBottom: 8,
        marginBottom: 20
    },
    centerContent: {
        flex: 1,
        backgroundColor:"#F6F6F6",
        marginLeft: 25,
        borderRadius: 4,
       
    },
    centerContentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 12,
        paddingRight: 12,
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
        height: 44,
        width: "100%"
    }
});   
