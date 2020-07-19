import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, TextInput} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SplashScreen from 'react-native-splash-screen';

import Header from '../../components/header';

const {width, height} = Dimensions.get('window');
export default class TroubleNotify extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    componentDidMount() {
      SplashScreen.hide();
    }
    render() {
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="安全整改通知书"
                    hidePlus={false} 
                />
                <ScrollView>
                    <View style={{paddingBottom: 20}}>
                        <View style={[styles.item,styles.itemUnderLine,{alignItems: "center", flexDirection: "row",height: 48,marginTop: 12}]}>
                            <View style={[styles.rowCenter, {flex: 2}]}>
                                <Image source={require("../../image/troubleDetails/appsBig.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>隐患类型</Text>
                            </View>
                            <Text style={{color: "#666",fontSize: 14,flex: 3}}>车辆</Text>
                        </View>
                        <View style={[styles.item,styles.itemUnderLine,{flexDirection: "row",height: 48,alignItems: "center"}]}>
                            <View style={[styles.rowCenter, {flex: 2}]}>
                                <Image source={require("../../image/troubleIssue/userGroup.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>主送单位</Text>
                            </View>
                            <Text style={{color: "#666",fontSize: 14,flex: 3}}>公司矿石破碎部</Text>
                        </View>
                        <View style={[styles.item,{paddingTop: 14}, styles.itemUnderLine]}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleDetails/calendar.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>检查地点</Text>
                            </View>
                            <Text style={styles.addressText}>西安市雁塔区鱼化街办天谷八路211号环 普产业园C座302
-5</Text>
                        </View>
                        <View style={[styles.item,styles.itemUnderLine,{flexDirection: "row",height: 48,alignItems: "center"}]}>
                            <View style={[styles.rowCenter, {flex: 2}]}>
                                <Image source={require("../../image/troubleDetails/leavel.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>隐患级别</Text>
                            </View>
                            <View style={{flex: 3}}>
                              <Image source={require("../../image/trouble/troubleTrack/A.png")} />
                            </View>
                        </View>
                        <View style={[styles.item,styles.itemUnderLine,{flexDirection: "row",height: 48,alignItems: "center"}]}>
                            <View style={[styles.rowCenter, {flex: 2}]}>
                                <Image source={require("../../image/troubleDetails/appsBig.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>隐患类型</Text>
                            </View>
                            <Text style={{color: "#666",fontSize: 14,flex: 3}}>车辆</Text>
                        </View>
                        <View style={[styles.item, styles.itemUnderLine]}>
                            <View style={[styles.rowCenter,{marginTop: 10,marginBottom: 13}]}>
                                <Image source={require("../../image/troubleDetails/filePencil.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>隐患内容</Text>
                            </View>
                                <Text style={{fontSize: 14,color: "#666",width: width-32,lineHeight: 20}}>3号矿区运矿车发生了抛锚，目前停在前往1号矿区路上,离1号矿区较近。请派维修人员前往维修</Text>
                            <View style={{flexDirection: "row",marginTop: 22,flexWrap: "wrap",justifyContent: "space-between"}}>
                                <View style={styles.itemImage}>
                                    {/* <Image source={require("../../image/troubleDetails/camera.png")}/> */}
                                </View>
                                <View style={styles.itemImage}>
                                    {/* <Image source={require("../../image/troubleDetails/camera.png")}/> */}
                                </View>
                                <View style={styles.itemImage}>
                                    {/* <Image source={require("../../image/troubleDetails/camera.png")}/> */}
                                </View>
                            </View>
                        </View>
                        <View style={[styles.item,{paddingTop: 14}, styles.itemUnderLine]}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/troubleDetails/msg.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>整改意见</Text>
                            </View>
                            <Text style={styles.addressText}>3号矿区运矿车发生了抛锚，目前停在前往1号矿区路上，离1号矿区较近。请派维修人员前往维修，这里显示的是占位符...</Text>
                        </View>
                        <View style={styles.notesView}>
                          <Text style={{color: '#999', fontSize: 12}}>注：安全隐患具备整改条件</Text>
                        </View>
                        <View style={[styles.item,styles.itemUnderLine,{alignItems: "center", flexDirection: "row",height: 48,marginTop: 12}]}>
                            <View style={[styles.rowCenter, {flex: 2}]}>
                                <Image source={require("../../image/troubleIssue/userGroup.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>下发单位</Text>
                            </View>
                            <Text style={{color: "#666",fontSize: 14,flex: 3}}>公司安全环保部</Text>
                        </View>
                        <View style={[styles.item,styles.itemUnderLine,{flexDirection: "row",height: 48,alignItems: "center"}]}>
                            <View style={[styles.rowCenter, {flex: 2}]}>
                                <Image source={require("../../image/troubleIssue/calendar.png")} style={{width: 16, height: 16,marginRight: 9}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: "600"}}>署名时间</Text>
                            </View>
                            <Text style={{color: "#666",fontSize: 14,flex: 3}}>2017.07.29 12:22</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    rowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    addressText: {
      color: "#666",
      fontSize: 14,
      marginTop: 12,
      marginBottom: 14,
      width: width-32,
      lineHeight: 20
    },
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        width: '100%'
    },
    itemUnderLine: {
      borderBottomColor: "#F6F6F6",
      borderBottomWidth: 1
    },
    notesView: {
      backgroundColor: '#f6f6f6',
      paddingTop: 10,
      paddingBottom: 10,
      paddingRight: 15,
      paddingLeft: 15
    },
    item: {
        backgroundColor: "#fff",
        paddingLeft: 16,
        paddingRight: 16,
        width: '100%'
    },
    itemImage: {
        alignItems: "center",
        width: (width-64)/3,
        height: (width-64)/3,
        backgroundColor: "#F0F1F6",
        borderRadius: 5,
        justifyContent: "center",
        marginBottom: 16,
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
        backgroundColor: "#fff"
    },
    bottomLeft: {
        flex: 2,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 13,
        height: "100%",
        borderRadius: 5
    },
    bottomRight: {
        flex: 3,
        backgroundColor: "#4058FD", 
        alignItems: "center", 
        justifyContent: "center",
        height: "100%",
        borderRadius: 5
    }
    
});
