import React, { Component } from 'react';
import { StyleSheet,ScrollView, Text, View, Dimensions, TouchableOpacity, FlatList,Image,RefreshControl,ActivityIndicator,ImageBackground} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {ECharts} from 'react-native-echarts-wrapper';
import {connect} from 'react-redux';
import Toast from '../../components/toast';
import { parseTime, parseDate } from '../../utils/handlePhoto';


import Header from '../../components/header';
import carshopsServer from '../../service/deviceServer';
const { width, height } = Dimensions.get('window');

const PAGESIZE = 10;
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
      option1: {},
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
      this.initData()
    }
    initData = () => {
      this.selectListByConditionAndRecent();
      this.selectMaintainStatistics();
    }
    selectMaintainStatistics = async () => {
        const res = await carshopsServer.selectMaintainStatistics({
            "endDate": new Date().getTime()+7*86400000,
            "startDate": new Date().getTime()+86400000
        })
        if(res.success){
            let  date = [];
            let weekData = [];
            let monthData = [];
            let yearData = [];
            for(let i = 1;i <= 7; i++){
                date.push(parseDate((new Date().getTime()+i*86400000),'MM-DD'))
            }
            for(let item of res.obj){
                weekData.push(item.weekCount);
                monthData.push(item.monthCount);
                yearData.push(item.yearCount);
            }
            this.setState({
                option1:{
                    backgroundColor: 'transparent',
                    tooltip: {
                        backgroundColor: 'rgba(75,116,255,0.5)',
                        padding: [10, 15],
                        trigger: 'axis',
                        position: function(point){
                            let a = point[0]-100;
                            let b = point[1]-120;
                            if ((point[0]-100) < 0) {
                                a = -(point[0]-100);
                            }
                            if ((point[1]-120) < 0) {
                                b = -(point[1]-120);
                            }
                            //其中params为当前鼠标的位置
                            return [a,b];
                        },
                        formatter: function (params, ticket, callback) {
                            var showHtm="";
                            let a = 0;
                            var title = params[a].name;
                            showHtm+= '<i style="width:8px;height:8px;border-radius:50%;border: 1px solid #fff;background-color: #4B74FF;display:inline-block;"></i> '+ title + '<br>';
                            for(var i=0;i<params.length;i++){
                                //名称
                                var name = params[i].seriesName;
                                //值
                                var value = params[i].value;
                                showHtm+= name + "：" + value+'个'+'<br>'
                                
                            }
                            return showHtm;
                        },
                    },
                    grid: {
                        x: 50,
                        width: '70%'
                    },
                    legend: {
                        data:['周保','月保','年保'],
                        bottom: 0,
                        textStyle: {
                            fontSize: 10
                        },
                        width: width - 40,
                        itemWidth: 20
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: date,
                            axisPointer: {
                                type: 'line',
                                lineStyle: {
                                    color: '#4B74FF'
                                }
                            },
                            splitLine: {
                                show: false,
                            },
                            axisTick: {
                                show: false
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#E0E0E0'
                                }
                            },
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#999999'
                                }
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '单位：个　　　',
                            
                            axisLabel: {
                                formatter: '{value}'
                            },
                            axisLine: {
                                show: false,
                                lineStyle: {
                                    color: '#999999'
                                }
                            },
                            nameTextStyle: {
                                color: '#666'
                            },
                            splitLine: {
                                lineStyle: {
                                    color: '#E0E0E0'
                                }
                            },
                        },
                    ],
                    series: [
                        {
                            name:'周保',
                            stack: '保养',
                            type:'bar',
                            silent: true,
                            data:weekData,
                            itemStyle: {
                                normal: {
                                    // barBorderRadius: [10, 10, 0, 0],
                                    //颜色渐变
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0,
                                            color: '#1ACFAA' // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: '#82F3DC' // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                    }
                                }
                            },
                            barWidth: 20, // 控制柱子的宽度
                        },
                        {
                            name:'月保',
                            stack: '保养',
                            type:'bar',
                            silent: true,
                            data:monthData,
                            itemStyle: {
                                normal: {
                                    
                                    //颜色渐变
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0,
                                            color: '#E24329' // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: '#FDB451' // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                    }
                                }
                            },
                            barWidth: 20, // 控制柱子的宽度
                        },
                        {
                            name:'年保',
                            type:'bar',
                            stack: '保养',
                            silent: true,
                            data:yearData,
                            itemStyle: {
                                normal: {
                                    barBorderRadius: [10, 10, 0, 0],
                                    //颜色渐变
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0,
                                            color: '#566CF9' // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: '#7A95F7' // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                    }
                                }
                            },
                            barWidth: 20, // 控制柱子的宽度
                        },
                        
                        
                      ]
                  }
            })
        }else{
            console.log(res.msg);
        }
    }
    selectListByConditionAndRecent = async () => {
        const { current, pageSize, currentPage } = this.state;
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: true,canLoadMore: true});
        } else {
            this.setState({ isLoadMore: true });
        }
        const res = await carshopsServer.selectListByConditionAndRecent({
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
    /**
     * 下啦刷新
     * 
     */
    _onRefresh = () => {
        // 不处于 下拉刷新
        this.setState({
            pageSize: PAGESIZE
        }, ()=> {
            this.initData()
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
                this.initData()
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
    _createListHeader = () => {
        return(<View>
            <View style={styles.headerView}>
                <TouchableOpacity style={styles.headerBtn} onPress={()=>this.props.navigation.push('CarshopsAdd',{initData:this.initData})}>
                    <Image source={require('../../image/carshops/add.png')}/>
                    <Text style={{color: '#333333',marginTop: 12}}>保养创建</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerBtn} onPress={()=>this.props.navigation.push('CarshopsTrack')}>
                    <Image source={require('../../image/carshops/save.png')}/>
                    <Text style={{color: '#333333',marginTop: 12}}>进度跟踪</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerBtn} onPress={()=>this.props.navigation.push('DeviceMaintain', {type: 2})}>
                    <Image source={require('../../image/carshops/record.png')}/>
                    <Text style={{color: '#333333',marginTop: 12}}>保养记录</Text>
                </TouchableOpacity>
            </View>
            <View>
                <View style={[styles.myPanel, {marginTop: 10}]}>
                    <View style={styles.panelTitle}>
                        <Text style={styles.panelTitleText}>未来7天保养计划分布</Text>
                    </View>
                    <View style={{width: width,height: 300,webkitTapHighlightColor:'transparent'}}>
                        <ECharts option={this.state.option1} style={{webkitTapHighlightColor:'transparent'}}/>
                    </View>
                </View>
            </View>
            <View style={{marginTop: 12,backgroundColor: "#fff",paddingLeft: 16,paddingRight: 16,paddingBottom: 10}}>
                <View style={{justifyContent: "space-between",flexDirection: "row",marginTop: 17}}>
                    <Text style={{fontSize: 16,color: "#333",fontWeight: "500"}}>未来7天保养计划</Text>
                    <TouchableOpacity onPress={()=>this.props.navigation.push('MorePlane')}>
                        <Text style={{fontSize: 14,color: "#4058FD",fontWeight: "400"}}>查看更多</Text>
                    </TouchableOpacity>
                </View>
            </View>
          </View>)
    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#fff' }} />;
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
    renderItem = ({item}) => {
        return(<TouchableOpacity style={styles.item} onPress={()=>this.props.navigation.push('MainCarshopsDetail',{fMaintainPlanId: item.fMaintainPlanId,initData:this.initData})}>
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
        </TouchableOpacity>)
    }
    render() {
        return (
          <View style={styles.container}>
            <Header 
              titleText="保养管理"
              backBtn={true}
            />
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
                ListHeaderComponent={this._createListHeader.bind(this)}
                ListEmptyComponent={<Text style={{width:'100%', textAlign: 'center',marginTop: 10,color: '#c9c9c9', paddingBottom: 80}}>暂无数据</Text>}
                onEndReached={() => this._onLoadMore()}
                onEndReachedThreshold={0.1}
                ItemSeparatorComponent={()=>this._separator()}
            /> 
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
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1,
        backgroundColor: "#fff",
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10
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
    },
    footerView: {
      alignItems: "center",
      justifyContent: 'center',
      marginTop: 20,
      paddingBottom: 10
  }
});
