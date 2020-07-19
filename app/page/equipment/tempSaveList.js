import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions,RefreshControl,TextInput,ImageBackground,ScrollView, TouchableOpacity, Image, TouchableHighlight, Platform} from 'react-native';
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
import {clientHeight, navHeight,isIphoneX} from '../../utils/screen';
import Header from '../../components/header';
import deviceServer from '../../service/deviceServer';
import { parseTime, parseDate, handlePhotoToJs } from '../../utils/handlePhoto';
import Toast from '../../components/toast';
import Radio from '../../components/radio';
import CameraUpload from '../../components/ImageAbout/CameraUpload';

const navStyle = navHeight();
const isAndroid = Platform.OS === 'android';
const {width, height} = Dimensions.get('window');
const PickerItem = Picker.Item;
export default class TempSaveList extends Component {
    state = {
      taskDetail: {}, // 任务id
       item: {},
       itemList: [],
       refreshing: false,
       routeData: {
           fId: '',
           fName: ''
       }
    };
    
    static navigationOptions = ({ navigation }) => ({
        header: null
    });

    componentDidMount() {
        SplashScreen.hide();
        if (this.props.navigation.state.params && this.props.navigation.state.params.taskDetail) {
            this.setState({
              taskDetail: this.props.navigation.state.params.taskDetail,
              routeData: this.props.navigation.state.params.routeData,
            }, ()=>{
                this.getTempSaveList();
            })
        }
    }
    
    // 获取暂存列表
    getTempSaveList = async () => {
        const { taskDetail } = this.state;
        this.setState({refreshing: true});
        const res = await deviceServer.getTaskTempList(taskDetail.fPatrolTaskId);
        this.setState({refreshing: false});
        console.log('tempList', res)
        if(res.success){
            this.setState({
                itemList: res.obj.map((data)=>{
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
            });
        } else {
            Toast.show(res.msg)
        }
    }

    // 修改暂存项数据
    commitTempData = async (item) => {
        console.log('deviceServer', item);
        for (let obj of item.tPatrolItemsRecordAndFile) {
            if (!obj.tPatrolItemsRecord.fIsAbnormal) break;
            // 如果是异常 提交需要判断文件是否最少有一个
            let arr = obj.files.filter((data)=>(data.status === 'success'));
            if (arr.length == 0) {
              Toast.show('异常的检查项照片/视频不能为空');
              return
            }
        } 
        const { taskDetail } = this.state;
        let param = {
            fState: 2,
            fPatrolTaskId: taskDetail.fPatrolTaskId,
            fEquipmentId: item.tPatrolEquipmentRecord.fEquipmentId,
            tPatrolItemsRecordAndFile: item.tPatrolItemsRecordAndFile.map((data)=>{
                return {
                    files: data.files.map((data)=>{
                        if (data.status === 'success') {
                            return {
                              fFileName: data.fileName,
                              fFileLocationUrl: data.path,
                              fType: data.type
                            };
                        }
                    }),
                    tPatrolItemsRecord: {
                        fPatrolItemsDescribe: data.tPatrolItemsRecord.fPatrolItemsDescribe,
                        fIsAbnormal: data.tPatrolItemsRecord.fIsAbnormal,
                        fCheckItemsId: data.tPatrolItemsRecord.fCheckItemsId,
                        fPatrolItemsId: data.tPatrolItemsRecord.fPatrolItemsId
                    }
                }
            })
        };
        global.loading.show();
        const res = await deviceServer.commitCheckUp(param);
        global.loading.hide();
        if (res.success) {
            Toast.show(res.msg);
            this.getTempSaveList();
        } else {
            Toast.show(res.msg);
        }
    }
    
    render() {
        const { item, type, itemList, taskDetail, routeData} = this.state;
        console.log('taskDetail', taskDetail);
        return (
            <View style={styles.container}>
                <Header
                    backBtn={true}
                    titleText="暂存列表"
                    hidePlus={true}
                />
                <ScrollView 
                    style={styles.content}
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            colors={['#000']}
                            refreshing={this.state.refreshing}
                            onRefresh={this.getTempSaveList}
                        />
                    } 
                >
                    <View style={{width: '100%', paddingRight: 16,paddingLeft: 16}}>
                        <View style={styles.topBanner}>
                            <View style={{flexDirection: "row",marginBottom: 12}}>
                                <Text style={styles.leftText}>巡检时间</Text>
                                <Text style={styles.rightText}>{taskDetail.fPatrolTaskDate?parseDate(parseTime(taskDetail.fPatrolTaskDate), 'YYYY.MM.DD HH:mm') : '--'}</Text>
                            </View>
                            <View style={{flexDirection: "row",marginBottom: 12}}>
                                <Text style={styles.leftText}>巡检路线</Text>
                                <Text style={[styles.rightText, {color: '#4B74FF'}]}>{routeData.fName||'--'}</Text>
                            </View>
                            
                        </View>
                        <View style={{width: "100%",height: 1,backgroundColor: "#E0E0E0",marginTop: 16,marginBottom: 16}}></View>
                        <View style={styles.items}>
                        {
                            itemList.length != 0 ?itemList.map((item,index) => {
                                return(
                                    <View key={index} style={styles.item} onPress={() => {item.fRecordIsAbnormal?this.getErrorDetail(item,index): null}}>
                                        <TouchableOpacity 
                                            onPress={()=>{
                                                item.isExpend = !item.isExpend;
                                                this.setState({itemList: this.state.itemList});
                                            }} 
                                            style={{flexDirection: "row",marginBottom: 8,alignItems: "center",justifyContent: "space-between"}}>
                                            <View style={{flexDirection: "row",alignItems: "center",flex: 6}}>
                                                <ImageBackground  source={require('../../image/equiement/round.png')} style={{width: 28,height: 28,marginRight: 12,justifyContent: "center",alignItems: "center"}}>
                                                    <Text style={{color: "#fff",fontSize: 12}}>{index+1}</Text>
                                                </ImageBackground>
                                                <Text style={{fontSize: 14,fontWeight: "600"}}>{item.tPatrolEquipmentRecord.fEquipmentName}</Text>
                                            </View>
                                            <Text style={{flex: 4,textAlign: 'right'}}>{parseDate(parseTime(item.tPatrolEquipmentRecord.fTime), 'MM-DD HH:mm')}</Text>
                                            <AntDesign name={item.isExpend ? 'up' : 'down'} color='#333' style={{marginLeft: 10}}/> 
                                        </TouchableOpacity>
                                        { 
                                            item.isExpend && item.tPatrolItemsRecordAndFile.map((item) => {
                                                return (
                                                    <View style={{padding: 10, backgroundColor: '#F6F6F6',borderTopRightRadius: 4,
                                                    borderTopLeftRadius: 4,}}>
                                                        <View style={{paddingTop: 5, borderBottomColor: '#E0E0E0', borderBottomWidth: 1,paddingBottom: 10}}>
                                                            <Text style={{fontSize: 14}}>{item.tPatrolItemsRecord.fCheckItemsContent}</Text>
                                                        </View>
                                                        <View style={{flexDirection: 'row', alignItems: 'center', paddingTop: 15, paddingLeft: 10}}>
                                                            <Radio 
                                                                label="正常" 
                                                                value={!item.tPatrolItemsRecord.fIsAbnormal} 
                                                                onChange={()=>{
                                                                    item.tPatrolItemsRecord.fIsAbnormal = false;
                                                                    this.setState({ itemList: this.state.itemList });
                                                                }}
                                                            />
                                                            <Radio 
                                                                style={{marginLeft: 15}} 
                                                                label="异常" 
                                                                value={item.tPatrolItemsRecord.fIsAbnormal} 
                                                                onChange={()=>{
                                                                    item.tPatrolItemsRecord.fIsAbnormal = true;
                                                                    this.setState({ itemList: this.state.itemList });
                                                                }}
                                                            />
                                                        </View>
                                                        {
                                                            !item.tPatrolItemsRecord.fIsAbnormal ? null :
                                                            <View style={styles.unLineView}>
                                                                <Text>异常描述</Text>
                                                                <TextInput
                                                                    style={styles.inputStyle}
                                                                    placeholder="请填写异常描述"
                                                                    underlineColorAndroid="transparent"
                                                                    allowFontScaling={true}
                                                                    value={item.tPatrolItemsRecord.fPatrolItemsDescribe}
                                                                    onChangeText={(text)=>{
                                                                        item.tPatrolItemsRecord.fPatrolItemsDescribe = text;
                                                                        this.setState({
                                                                            itemList: this.state.itemList
                                                                        });
                                                                    }}
                                                                />
                                                                <View>
                                                                <CameraUpload
                                                                    value={item.files}
                                                                    onChange={(picArr1)=>{
                                                                        item.files = picArr1;
                                                                        this.setState({
                                                                            itemList: this.state.itemList 
                                                                        })
                                                                    }}
                                                                    imgStyle={{width: width*0.22, height: width*0.22}}
                                                                />
                                                                </View>
                                                            </View>
                                                        }
                                                    </View> 
                                                )
                                            })
                                            
                                        }
                                        {item.isExpend ? <TouchableOpacity style={styles.bottomBtn} onPress={()=>this.commitTempData(item)}>
                                            <Text style={{color: '#5094F2', fontSize: 16}}>提交</Text>
                                        </TouchableOpacity> : null}
                                    </View>)
                            }): 
                            <View style={{width: '100%'}}>
                                <Text style={{width: '100%', textAlign: 'center'}}>暂无数据</Text>
                            </View>
                        }
                    </View>
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
        marginBottom: 20,
    },
    topBanner: {
        width: "100%",
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
    },
    item: {
        marginBottom: 8,
        marginBottom: 20,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
    },
    centerContent: {
        flex: 1,
        backgroundColor:"#F6F6F6",
        marginLeft: 25,
        borderRadius: 4,
       
    },
    bottomBtn: {
        backgroundColor: '#F6F6F6',
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
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
    },
    unLineView: {
        borderTopWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10,
        borderTopColor: '#f6f6f6',
        paddingTop: 10
    },
    inputStyle: {
        padding: 0,
        textAlignVertical: 'top',
        height: 80,
        flex: 1,
        marginTop: 5
    }
});   
