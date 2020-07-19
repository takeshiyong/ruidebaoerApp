import React, { Component } from 'react';
import { StyleSheet,ScrollView, Text, View, Dimensions, TouchableOpacity, FlatList,Image,RefreshControl,ActivityIndicator,ImageBackground} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {ECharts} from 'react-native-echarts-wrapper';
import {connect} from 'react-redux';
import Toast from '../../components/toast';
import { parseTime, parseDate } from '../../utils/handlePhoto';


import carshopsServer from '../../service/deviceServer';
import Header from '../../components/header';
const { width, height } = Dimensions.get('window');
const PAGESIZE = 10;
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
        allStore: [{name: '日保养'},{name: '周保养'},{name: '月保养'},{name: '年保养'}],
        current: 0,
        options: [],
        currentPage: 1,
        // 列表数据结构
        dataSource: [],
        // 下拉刷新
        refreshing: false,
        // 加载更多
        isLoadMore: false,
        canLoadMore: true,
        pageSize: PAGESIZE,
    }

    componentDidMount() {
      SplashScreen.hide();
        this.initData();
    }
    initData = () => {
        this.getCarshopsData();
        this.getListNum();
    }
    // 获取各列表数据个数
    getListNum = async () => {
        const res = await carshopsServer.selectInProgressPlanCount();
        console.log('获取各列表数据个数', res);
        if (res.success) {
            this.setState({
                allStore: this.state.allStore.map((data, index)=>{
                    let num = 0;
                    switch (index) {
                        case 0:
                            num = res.obj.dayNum;
                            break;
                        case 1:
                            num = res.obj.weekNum;
                            break;
                        case 2:
                            num = res.obj.monthNum;
                            break;
                        case 3:
                            num = res.obj.yearNum;
                            break;
                    }
                    return {
                        ...data,
                        value: num
                    }
                })
            })
        }   
    }
    /**
     * 下啦刷新
     * 
     */
    _onRefresh = () => {
        // 不处于 下拉刷新
        this.setState({
            pageSize: PAGESIZE
        }, ()=> {
            this.getCarshopsData()
        })
            
    };

    
      /**
     * 加载更多
     * @private
     */
    _onLoadMore() {
        // 不处于正在加载更多 && 有下拉刷新过，因为没数据的时候 会触发加载
        if (!this.state.isLoadMore && this.state.dataSource.length > 0 && this.state.canLoadMore) {
            this.setState({
                pageSize: this.state.pageSize + 10
            }, () => {
                this.getCarshopsData()
            })
        }
    } 
      /**
       * 创建尾部布局
       */
    _createListFooter = () => {
        const { isLoadMore, dataSource, canLoadMore } = this.state;
        if (dataSource.length == 0) {
            return null;
        }
        let moreText = '上拉加载更多数据';
        if (isLoadMore) {
            moreText = '正在加载更多数据'
        } else {
            if (!canLoadMore) {
                moreText = '暂无更多数据' 
            }
        }
        return (
            <View style={styles.footerView}>
                {isLoadMore ? <ActivityIndicator color="#000"/> : null}
                <Text style={{ color: '#999' }}>
                    {moreText}
                </Text>
            </View>
        )
    }

    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#fff' }} />;
    }
    getCarshopsData = () => {
        this.selectListByCondition()
    }
    //分页查询登录人保养任务计划
    selectListByCondition = async () => {
        const { current, pageSize, currentPage } = this.state;
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: true,canLoadMore: true});
        } else {
            this.setState({ isLoadMore: true });
        }
        const res = await carshopsServer.selectListByCondition({
            "fMaintainLevel": current,
            "pageCurrent": currentPage,
            "pageSize": pageSize
        })
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: false });
        } else {
            this.setState({ isLoadMore: false });
        }
        if (res.success) {
            this.setState({
                dataSource: res.obj.items
            })
            if (this.state.pageSize >= res.obj.itemTotal) {
                this.setState({
                    canLoadMore: false
                })
            }
        } else {
            Toast.show(res.msg);
        }
    }
    getData = (data) => {
        switch (data){
            case 0: 
                return '日';
            case 1: 
                return '周';
            case 2: 
                return '月';
            case 3: 
                return '年';
            default:
                return null;
        } 
    }
    renderItem = ({item,index}) => {
        return (<TouchableOpacity style={styles.item} onPress={()=>this.props.navigation.push('MainCarshopsDetail',{fMaintainPlanId: item.fMaintainPlanId,initData:this.initData})}>
                        <View style={styles.itemTitle}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <View style={{width: 4,height: 4,backgroundColor: "#4B74FF",borderRadius: 2,marginRight: 9}}></View>
                                <Text style={{marginRight: 12,color: "#333",fontSize: 14}}>{item.fMaintainPlanTitle?item.fMaintainPlanTitle: '--'}</Text>
                                <View style={{width: 40,height: 14,alignItems: "center",justifyContent: "center",backgroundColor: "#4058FD",borderTopLeftRadius: 5,borderBottomRightRadius: 5}}>
                                    <Text style={{color: "#fff",fontSize: 10}}>{item.fMaintainLevel != null?this.getData(item.fMaintainLevel): '--'}保</Text>
                                </View>
                            </View>
                            <View style={styles.typeButton}>
                                <Text style={{color: "#1ACFAA",fontSize: 10}}>{item.fIsIssue? '已下发': "未下发"}</Text>
                            </View>
                        </View>
                        <View style={{paddingLeft: 13,paddingBottom: 11}}>
                            <View style={{flexDirection: "row"}}>
                                <View style={{flexDirection: "row",alignItems: "center",marginBottom: 14}}>
                                    <Text style={styles.leftText}>设备数量</Text>
                                    <Text style={styles.rightText}>{item.equipmentNum?item.equipmentNum: '--'}</Text>
                                </View>
                                <View style={{flexDirection: "row",alignItems: "center",marginBottom: 14,marginLeft: 25}}>
                                    <Text style={styles.leftText}>任务时间</Text>
                                    <Text style={styles.rightText}>{item.fNextTime?parseDate(item.fNextTime,'YYYY.MM.DD'):'--'}</Text>
                                </View>
                            </View>
                            
                            <View style={{flexDirection: "row",alignItems: "center",marginBottom: 14}}>
                                <Text style={styles.leftText}>保养人员</Text>
                                <Text style={styles.rightText}>{item.maintainPlanUserList&&item.maintainPlanUserList.length >0?item.maintainPlanUserList.map((item) => {return item.fUserIdName}) :'--'}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>) }
    render() {
        return (
          <View style={styles.container}>
            <Header 
              titleText="更多计划"
              backBtn={true}
            />
            <View style={{width,height: 44,backgroundColor: "#fff",borderBottomWidth: 1,borderBottomColor: "#E0E0E0"}}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={{flexDirection:"row",justifyContent: "space-between",width}}>
                        {this.state.allStore.map((item,index) => {
                            return <TouchableOpacity style={{flex: 1}} index={index} onPress={() => {this.setState({current: index},()=> {this.getCarshopsData();})}}>
                                <View style={[styles.barText,index == this.state.current ? {borderBottomColor: "#4B74FF",color: "#4B74FF"}:{color: "#333333"}]}>
                                    <Text style={[{height: 40, lineHeight: 40, fontSize: 14} ,index == this.state.current ? {color: "#4B74FF"}:{color: "#333333"}]}>{item.name}{item.value ? `(${item.value})` : ''}</Text>
                                </View>
                            </TouchableOpacity>
                        })}
                    </View>
                </ScrollView> 
            </View> 
                <View style={{height: "100%",paddingBottom: 130,backgroundColor: "#fff"}}>
                    <FlatList
                        style={{flex: 1}}
                        data={this.state.dataSource}
                        // keyExtractor={(item)=>item.fId}
                        refreshControl={
                            <RefreshControl
                                title={'Loading'}
                                colors={['#000']}
                                refreshing={this.state.refreshing}
                                onRefresh={() => {
                                    this._onRefresh();
                                }}
                            />
                        }
                        renderItem={this.renderItem}
                        refreshing={this.state.refreshing}
                        //加载更多
                        ListFooterComponent={this._createListFooter}
                        ListEmptyComponent={<Text style={{width:'100%', textAlign: 'center',marginTop: 10,color: '#c9c9c9', paddingBottom: 80}}>暂无数据</Text>}
                        onEndReached={() => this._onLoadMore()}
                        onEndReachedThreshold={0.1}
                        ItemSeparatorComponent={()=>this._separator()}
                    />    
                </View>
          </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F6F6F6'
    },
    tText: {
        color: "#999",
        fontSize: 12,
        marginRight: 12
    },
    barText: {
        height: 40,
        lineHeight: 40,
        fontSize: 16,
        fontWeight: "600",
        flex: 1,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#fff"
    },
      footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 20,
    },
    item: {
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1,
        marginTop: 19,
        paddingLeft: 15,
        paddingRight: 15,
        
    },
    typeButton: {
        width: 44,
        height: 20,
        backgroundColor:"#D2FFF6",
        alignItems: "center",
        justifyContent: "center"
    },
    itemTitle: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18
    },
    leftText: {
        color: "#999",
        fontSize: 12,
        marginRight: 12
    },
    rightText: {
        color: "#666",
        fontSize: 16,
        fontWeight: "500"
    }
});
