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
        this.getCarshopsData();
    }

    // 获取各列表数据个数
    getListNum = async () => {
        const res = await carshopsServer.getNumByMaintainList();
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
                            num = res.obj.monthNum
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
        this.selectListByLoginUserIdAndLevel();
        this.getListNum();
    }
    //分页查询登录人保养任务列表
    selectListByLoginUserIdAndLevel = async () => {
        const { current, pageSize, currentPage } = this.state;
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: true,canLoadMore: true});
        } else {
            this.setState({ isLoadMore: true });
        }
        const res = await carshopsServer.selectListByLoginUserIdAndLevel({
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
            let dataSource = [...res.obj.items];
            dataSource.map((items,index) => {
                let allNum = items.tMaintainRecordEquipmentList.length
                let options = {
                    series: [
                      {
                          type: 'pie',
                          radius: ['65%','80%'],
                          center: ['50%', '60%'],
                          labelLine:{show: false},
                          legendHoverLink: false,
                          hoverAnimation: false,
                          clockwise: false,
                          data:[
                              { value: items.tMaintainRecordEquipmentList.filter((data)=>(data.fState !=0)).length,
                                itemStyle:{normal:{color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 1,
                                y2: 0,
                                colorStops: [{
                                    offset: 0,
                                    color: '#82F3DC' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#1ACFAA' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }}}},
                              {value: (allNum-(items.tMaintainRecordEquipmentList.filter((data)=>(data.fState !=0)).length)),
                                itemStyle:{normal:{color: '#F6F6F6'}}},
                          ],
                          
                      }
                  ]
                }
                items.options = options;
                items.num = items.tMaintainRecordEquipmentList.filter((data)=>(data.fState !=0)).length;
            })
            this.setState({
                dataSource,
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
    renderItem = ({item,index}) => {
        return (<TouchableOpacity style={styles.item} onPress={() => {this.props.navigation.push('CarshopsDetail',{id: item.fMaintainTaskId,onRefresh: this.getCarshopsData,type: 1})}}>
        <View style={{flex: 6}}>
            <View style={styles.itemTitle}>
                <View style={{flexDirection: "row",alignItems: "center"}}>
                    <View style={{width: 4,height: 4,backgroundColor: "#4B74FF",borderRadius: 2,marginRight: 9}}></View>
                    <Text style={{marginRight: 12,color: "#333",fontSize: 14}}>{item.fMaintainTaskTitle?item.fMaintainTaskTitle: '--'}</Text>
                    <View style={{width: 40,height: 14,alignItems: "center",justifyContent: "center",backgroundColor: "#5FEBFF",borderTopLeftRadius: 5,borderBottomRightRadius: 5}}>
                        <Text style={{color: "#fff",fontSize: 10}}>{item.fMaintainLevel != null?(item.fMaintainLevel == 0?'日': (item.fMaintainLevel == 1? '周': (item.fMaintainLevel == 2? '月': '年')) ): '--'}保</Text>
                    </View>
                </View>
            </View>
            <View style={{paddingLeft: 13,paddingBottom: 11}}>
            <View style={{flexDirection: "row",alignItems: "center",marginBottom: 14}}>
                <Text style={styles.leftText}>设备数量</Text>
                <Text style={styles.rightText}>{item.tMaintainRecordEquipmentList&&item.tMaintainRecordEquipmentList.length != 0? item.tMaintainRecordEquipmentList.length : '--'}</Text>
            </View>
            <View style={{flexDirection: "row",alignItems: "center",marginBottom: 14}}>
                <Text style={styles.leftText}>保养人员</Text>
                {
                    item.tMaintainTaskUserList&&item.tMaintainTaskUserList != 0? 
                    item.tMaintainTaskUserList.map((item, index) => {
                        return <Text key={index} style={styles.rightText}>{item.fUserName}</Text>
                    }): null
                }
                
            </View>
            <View style={{flexDirection: "row",alignItems: "center",marginBottom: 14}}>
                <Text style={styles.leftText}>任务时间</Text>
                <Text style={styles.rightText}>{item.fMaintainTaskDate?parseDate(item.fMaintainTaskDate,'YYYY.MM.DD'): '--'}</Text>
            </View>
        </View>
        </View>
        <View style={{flex: 4,paddingBottom: 30,position: 'relative'}}>
            <View style={styles.circleView}>
                <Text style={{color: '#666',fontWeight: 'bold',fontSize: 16}}>{item.num != null ?item.num: '--'}<Text style={{color: '#666',fontWeight: 'bold',fontSize: 16}}>/{item.tMaintainRecordEquipmentList.length?item.tMaintainRecordEquipmentList.length:"--"}</Text></Text>
                <Text style={{color: '#999'}}>{item.fMaintainTaskState != null? (item.fMaintainTaskState == 0? '进行中': (item.fMaintainTaskState == 1? "完成": '已逾期')): '--'}</Text>
            </View>
            <View style={{width: '80%', height: '80%',position: 'absolute',top: 17,left: 13}}>
                <ECharts option={item.options} key={item.fMaintainLevel}/>
            </View>
        </View>
    </TouchableOpacity>)
    }
    render() {
        return (
          <View style={styles.container}>
            <Header 
              titleText="保养追踪"
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
                <View style={{height: "100%",paddingBottom: 130}}>
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
    headerView: {
      width,
      height: 108,
      backgroundColor: '#FFFFFF',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around'
    },
    headerBtn: {
      borderRadius: 4,
      width: width/3,
      height: 108,
      alignItems:'center',
      justifyContent: 'center'
    },
    myPanel: {
        backgroundColor:'#fff',
        borderRadius: 4,
        padding: 15
    },
    panelTitleText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000'
    },
    panelTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    item: {
        backgroundColor: '#fff',
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1,
        flexDirection: "row",
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 15
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
        fontWeight: "500",
        marginRight: 5
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
    circleView: {
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        width: '100%',
        zIndex: 99,
        top: '45%'
      },
      footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 20,
    },
});
