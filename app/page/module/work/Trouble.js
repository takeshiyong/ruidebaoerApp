import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, RefreshControl} from 'react-native';
import Header from '../../../components/header';
import Toast from '../../../components/toast';
import {ECharts} from 'react-native-echarts-wrapper';
import troubleServer from '../../../service/troubleService';

const {width, height} = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
        option2: {},
        key: 1,
        fAllNum: 0,
        state1: 0,
        state2: 0,
        state3: 0,
        refreshing: false
    }
    componentDidMount() {
        this.selectByLevel();
        this.selectNumByState();
    }
    onRefresh = () => {
        this.selectByLevel();
        this.selectNumByState();
    }
    //设置隐患format数据
    changeDataForm = (arr,allname) => {
        for(let i = 0; i< arr.length; i++){
            if (name == arr.fLevelName) {
                return (arr.fLevelName + (arr.num/allname).toFixed(2)*100+'%');
            }
        }
    }
    //根据隐患级别查询饼状图占比
    selectByLevel = async () => {
        this.setState({refreshing: true});
        global.loading.show();
        const res = await troubleServer.selectByLevel();
        global.loading.hide();
        this.setState({refreshing: false});
        const color = ['#FC666C','#FF632E','#35C9FF','#82F3DC'];
        if(res.success){
            let arr = [];
            let dataArr = [];
            for(let i = 0; i<res.obj.httpSelectByLevelRes.length; i++){
                arr.push(res.obj.httpSelectByLevelRes[i].fLevelName);
                dataArr.push({
                    value: res.obj.httpSelectByLevelRes[i].num,
                    name: res.obj.httpSelectByLevelRes[i].fLevelName,
                    label: {
                        formatter: function(item, names) {
                            return item.data.name+': '+item.data.value + '件'
                        },
                        color: '#666666',
                        padding: [5, 6],
                        borderRadius: 10,
                        backgroundColor: '#F4F4F4'
                    },
                    labelLine: {
                        height2: 3
                    },
                    itemStyle:{
                        normal: {
                            color: color[i]
                        }
                    }
                })
            }
            this.setState({
                key: this.state.key+ 1,
                option2: {
                    legend: {
                        orient: 'horizontal',
                        bottom: 0,

                        data: arr,
                        formatter: function(name) {
                            return name;
                        },
                        textStyle: {
                            rich: {
                                title: {
                                    color: '#333',
                                    align: 'left',
                                },
                                value: {
                                    align: 'right',
                                    width: 50
                                }
                            }
                        }
                    },
                    series: [{
                        name: '隐患数量',
                        type: 'pie',
                        clockWise: false,
                        radius: [50, 60],
                        hoverAnimation: false,
                        center: ['52%', '43%'],
                        silent: true,
                        data: dataArr,
                    }]
                }
            });
            this.setState({
                fAllNum: res.obj.fAllNum
            })
        }

        
    }
    //根据隐患状态集合查询隐患数量
    selectNumByState = async () => {
        Promise.all([
            troubleServer.selectNumByState({fStateList: [1]}),
            troubleServer.selectNumByState({fStateList: [5]}),
            troubleServer.selectNumByState({fStateList: [7]})
        ]).then((result) => {
            if(result[0].success&&result[1].success&&result[2].success){
                this.setState({
                    state1 : result[0].obj,
                    state2 : result[1].obj,
                    state3 : result[2].obj
                })
            }else{
                Toast.show(result[0].msg);
                // Toast.show(result[1].msg);
                // Toast.show(result[2].msg);
            }
        }).catch((error) => {
            Toast.show(error);
        })
    }
    render() {

        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="隐患排查"
                    hidePlus={false} 
                    props={this.props}
                />
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
                    <View style={styles.content}>
                        <View style={styles.items}>
                            <TouchableOpacity style={[styles.item,{backgroundColor: "#FF632E"}]} onPress={() => this.props.navigation.navigate('TroubleIssue')}>
                                <Image source={require('../../../image/trouble/fileEditFill.png')} style={styles.itemImg}/>
                                <Text style={styles.itemText}>隐患发布</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.item,{backgroundColor: "#36C9FF"}]} onPress={() => this.props.navigation.navigate('TroubleList')}>
                                <Image source={require('../../../image/trouble/billFill.png')} style={styles.itemImg}/>
                                <Text style={styles.itemText}>隐患列表</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.item,{backgroundColor: "#FC676E"}]} onPress={() => this.props.navigation.navigate('ExamineMain')}>
                                <Image source={require('../../../image/trouble/fileChartFill.png')} style={styles.itemImg}/>
                                <Text style={styles.itemText}>隐患审核</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.item,{backgroundColor: "#1ACFAA"}]} onPress={() => this.props.navigation.navigate('TroubleTrack')}>
                                <Image source={require('../../../image/trouble/fileShredFill.png')} style={styles.itemImg}/>
                                <Text style={styles.itemText}>隐患跟踪</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.item,{backgroundColor: "#BC6BFA"}]} onPress={() => this.props.navigation.navigate('TroubleQuery')}>
                                <Image source={require('../../../image/trouble/fileSearchFill.png')} style={styles.itemImg}/>
                                <Text style={styles.itemText}>隐患查询</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.item,{backgroundColor: "#4058FD"}]} onPress={() => this.props.navigation.navigate('TroubleLog')}>
                                <Image source={require('../../../image/trouble/filePaperFill.png')} style={styles.itemImg}/>
                                <Text style={styles.itemText}>隐患日志</Text>
                            </TouchableOpacity>
                            
                        </View>
                        <View style={styles.itemAbout}>
                            <View style={styles.pandect}>
                                <Text style={styles.title}>隐患总览</Text>
                                <View style={{width: '100%',height: 280,paddingRight: 16,position: "relative",paddingBottom: 20}}>
                                    <View style={{position: "absolute",top: "38%",zIndex: 999,width: width - 30,alignItems: 'center'}}>
                                        <Text style={{fontSize: 10,color: '#999999'}}>隐患总数</Text>
                                        <View style={{flexDirection: "row",alignItems: "flex-end"}}>
                                            <Text style={{fontSize: 16,color: '#666666', fontWeight: "600"}}>{this.state.fAllNum? this.state.fAllNum: 0}</Text>
                                            <Text style={{fontSize: 10,color: '#666666'}}>件</Text>
                                        </View>
                                    </View>
                                    <ECharts key={this.state.key} ref={ref => this.chart = ref} option={this.state.option2}/>
                                </View>
                            </View>
                            <View>
                                <Text style={[styles.tipsTitle]}>详情</Text>
                                <View style={styles.tipsItems}>
                                    <TouchableOpacity style={styles.tipsItem} onPress={() => this.props.navigation.navigate('ExamineMain')}>
                                        <Image source={require('../../../image/trouble/suona.png')} style={{width: 22,height: 22,marginRight: 25}}/>
                                        <View style={{flexDirection: "row"}}>
                                            <Text style={[styles.tipsText,{fontWeight: "600"}]}>{this.state.state1}</Text>
                                            <Text style={styles.tipsText}>条隐患待审核</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.tipsItem} onPress={() => this.props.navigation.navigate('TroubleTrack',{type:5})}>
                                        <Image source={require('../../../image/trouble/suona.png')} style={{width: 22,height: 22,marginRight: 25}}/>
                                        <View style={{flexDirection: "row"}}>
                                            <Text style={[styles.tipsText,{fontWeight: "600"}]}>{this.state.state2}</Text>
                                            <Text style={styles.tipsText}>条隐患待复查</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.tipsItem} onPress={() => this.props.navigation.navigate('TroubleTrack',{type:7})}>
                                        <Image source={require('../../../image/trouble/suona.png')} style={{width: 22,height: 22,marginRight: 25}}/>
                                        <View style={{flexDirection: "row"}}>
                                            <Text style={[styles.tipsText,{fontWeight: "600"}]}>{this.state.state3}</Text>
                                            <Text style={styles.tipsText}>条隐患拒绝整改</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                        </View>
                    </View>
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
    content: {
        paddingLeft: 16,
        paddingRight: 16
    },
    items: {
        position:"relative",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 4
    },
    item: {
        width: (width-50)/2,
        height: 74,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12
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
    //itemAbout
    itemAbout: {
        backgroundColor: "#fff",
        marginTop: 16,
    },
    title: {
        color: "#333333",
        fontSize: 16,
        marginLeft: 17,
        marginTop: 18,
        fontWeight: "600"
    },

    tipsTitle: {
    color: "#333333",
    fontSize: 16,
    marginLeft: 17,
    marginBottom: 3,
    fontWeight: "600"
    },
    tipsItems: {
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 20
    },
    tipsItem: {
        width: "100%",
        height: 48,
        backgroundColor: "#F6F6F6",
        borderRadius: 5,
        marginTop: 13,
        flexDirection: "row",
        paddingLeft: 13,
        alignItems: "center"
    },
    tipsText: {
        color: "#333",
        fontSize: 14,
    }
});
