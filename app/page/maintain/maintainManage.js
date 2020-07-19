import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, RefreshControl} from 'react-native';
import Header from '../../components/header';
import Toast from '../../components/toast';
import {ECharts} from 'react-native-echarts-wrapper';
import troubleServer from '../../service/troubleService';

const {width, height} = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
        
    }
    componentDidMount() {
        
    }
    
    
    render() {

        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="维修管理"
                    hidePlus={false} 
                    props={this.props}
                />
                
                    <View style={styles.items}>
                        <TouchableOpacity style={[styles.item,{backgroundColor: "#1ACFAA"}]}>
                            <Image source={require('../../image/maintain/fill.png')} style={styles.itemImg}/>
                            <Text style={styles.itemText}>维修跟踪</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item,{backgroundColor: "#4058FD"}]} onPress={() => this.props.navigation.navigate('MaintainLog', {type: 4})}>
                            <Image source={require('../../image/maintain/log.png')} style={styles.itemImg}/>
                            <Text style={styles.itemText}>维修日志</Text>
                        </TouchableOpacity>
                    </View>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            colors={['#000']}
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />
                      } 
                >
                    <View style={{width,height: 30,alignItems: "center",justifyContent:"center",marginTop:10}}>
                        <Text>暂无数据</Text>
                    </View>
                    
                    {/* <View style={styles.content}>
                        <View style={{backgroundColor: "#fff",width: "100%",height: 205,borderRadius: 4}}>
                            <Text style={styles.conHeader}>颚式破碎机  YZT-2100</Text>
                            <View style={styles.conCenter}>
                                <Image style={{width: 64,height: 64,backgroundColor: "#E0E0E0"}}/>
                                <View style={{marginLeft: 16,flex: 1,justifyContent: "center"}}>
                                    <Text style={{fontSize: 14,color: "#333",marginBottom: 12}}>西区003号颚式破碎机</Text>
                                    <Text style={{fontSize: 12,color: "#999"}}>曲轴漏油</Text>
                                </View>
                            </View>
                            <View style={{flex: 1,flexDirection: "row",justifyContent: "flex-end",alignItems: "center"}}>
                                <TouchableOpacity style={styles.detail}>
                                    <Text style={{fontSize: 14,color: '#4058FD'}}>查看详情</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.create}>
                                    <Text style={{fontSize: 14,color: '#fff'}}>创建任务</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View> */}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        display: "flex"
    },
    items: {
        position:"relative",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingTop: 17,
        paddingBottom: 17,
        backgroundColor: "#fff",
        paddingLeft: 16,
        paddingRight: 16
    },
    item: {
        width: (width-50)/2,
        height: 74,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    itemImg: {
        width: 28,
        height: 28
    },
    itemText: {
        color: "#FFFFFF",
        fontSize: 14,
        marginLeft: 10
    },
    content: {
        marginTop: 12,
        paddingLeft: 16,
        paddingRight: 16
    },
    conHeader: {
        color: "#333333",
        fontSize: 14,
        paddingTop: 26,
        paddingBottom: 18,
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1,
        paddingLeft: 16
    },
    conCenter:{
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 16,
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1,
        flexDirection: "row"
    },
    detail: {
        width: 90,
        height: 24,
        borderColor: "#4058FD",
        borderWidth: 1,
        borderRadius: 3,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12
    },
    create: {
        width: 90,
        height: 24,
        borderRadius: 3,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
        backgroundColor: "#4058FD"
    }
});
