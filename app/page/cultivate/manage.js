import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, FlatList,RefreshControl,ActivityIndicator} from 'react-native';
import Header from '../../components/header';
import Toast from '../../components/toast';
import {ECharts} from 'react-native-echarts-wrapper';
import carshopsServer from '../../service/collegeServer';
import { parseTime, parseDate } from '../../utils/handlePhoto';

const PAGESIZE = 10;
const {width, height} = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null,
    });
    state = {
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
        this.trainplanSelectByPage();
    }

    //分页查询培训计划
    trainplanSelectByPage = async () => {
        const { current, pageSize, currentPage } = this.state;
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: true,canLoadMore: true});
        } else {
            this.setState({ isLoadMore: true });
        }
        const res = await carshopsServer.trainplanSelectByPage({
            "currentPage": currentPage,
            "pageSize": pageSize,
            'state': [1,2]
        })
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: false });
        } else {
            this.setState({ isLoadMore: false });
        }
        if (res.success) {
            let dataSource = [...res.obj.items].filter((item) => {return item.fState != 3});
            dataSource.map((items,index) => {
                let allNum = items.fPersonNumber
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
                              { value: items.fCompletePersonNumber,
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
                              {value: (allNum-items.fCompletePersonNumber),
                                itemStyle:{normal:{color: '#F6F6F6'}}},
                          ],
                          
                      }
                  ]
                }
                items.options = options;
                items.num = items.fCompletePersonNumber;
                items.allNum = items.fPersonNumber

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
    /**
     * 下啦刷新
     * 
     */
    _onRefresh = () => {
        // 不处于 下拉刷新
        this.setState({
            pageSize: PAGESIZE
        }, ()=> {
            this.trainplanSelectByPage()
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
                this.trainplanSelectByPage()
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
    renderItem = ({item,index}) => {
        return (<TouchableOpacity style={styles.listItem} onPress={() => {this.props.navigation.push('CultivateDetail',{item: item,peopleType: 1,showType: item.fState === 1 ? 1 : 2,initData:item.fState === 1 ? this.trainplanSelectByPage : null, })}}>
        <View style={{flex: 6}}>
            <View style={styles.itemTitle}>
                <View style={{flexDirection: "row",alignItems: "center"}}>
                    <View style={{width: 4,height: 4,backgroundColor: "#4B74FF",borderRadius: 2,marginRight: 9}}></View>
                    <Text style={{marginRight: 12,color: "#333",fontSize: 14,fontWeight: "500"}}>{item.fName?item.fName: '--'}</Text>
                </View>
            </View>
            <View style={{paddingLeft: 13,paddingBottom: 11}}>
                <View style={styles.lineText}>
                    <Text style={styles.leftText}>类   型</Text>
                    <Text style={styles.rightText}>{item.fTypeName?item.fTypeName: '--'}</Text>
                </View>
                <View style={styles.lineText}>
                    <View style={[styles.lineTwiceText,{marginRight: 15}]}>
                        <Text style={styles.leftText}>人   数</Text>
                        <Text style={styles.rightText}>{item.fPersonNumber !=null? item.fPersonNumber:'--'}</Text>
                    </View>
                    <View style={styles.lineTwiceText}>
                        <Text style={styles.leftText}>课程数</Text>
                        <Text style={styles.rightText}>{item.courseNumber != null? item.courseNumber: "--"}</Text>
                    </View>
                </View>
                
                <View style={styles.lineText}>
                    <Text style={styles.leftText}>时   间</Text>
                    <Text style={styles.rightText}>{item.fBeginTime?parseDate(item.fBeginTime,'YYYY.MM.DD'): '--'}</Text>
                </View>
            </View>
        </View>
        <View style={{flex: 4,paddingBottom: 30,position: 'relative'}}>
            <View style={styles.circleView}>
                <Text style={{color: '#666',fontWeight: 'bold',fontSize: 16}}>{item.num != null ?item.num: '--'}<Text style={{color: '#666',fontWeight: 'bold',fontSize: 16}}>/{item.allNum?item.allNum:"--"}</Text></Text>
            </View>
            <View style={{width: '80%', height: '80%',position: 'absolute',top: 17,left: 13}}>
                <ECharts option={item.options} key={item.fId}/>
            </View>
        </View>
    </TouchableOpacity>)
    }
    render() {

        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="培训管理"
                    hidePlus={false} 
                    props={this.props}
                />
                    <View style={styles.items}>
                        <TouchableOpacity style={[styles.item,{backgroundColor: "#4058FD"}]} onPress={() => this.props.navigation.navigate('AddCultivate',{initData: this.trainplanSelectByPage})}>
                            <Image source={require('../../image/cultivate/creat.png')} style={styles.itemImg}/>
                            <Text style={styles.itemText}>培训创建</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item,{backgroundColor: "#1496FA"}]} onPress={() => this.props.navigation.navigate('CultivateReport')}>
                            <Image source={require('../../image/cultivate/record.png')} style={styles.itemImg}/>
                            <Text style={styles.itemText}>培训记录</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingLeft: 15,paddingRight: 16,backgroundColor: "#fff",marginTop: 10,flex: 1}}>
                            <Text style={{color: "#333",fontSize: 16,fontWeight: "500",paddingTop: 15,paddingBottom: 10}}>培训列表</Text>
                            <FlatList
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
    listItem: {
        backgroundColor: '#fff',
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1,
        flexDirection: "row",
        paddingRight: 15,
        // paddingLeft: 15,
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
        marginRight: 16
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
    lineText:{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14
    },
    lineTwiceText: {
        flexDirection: "row",
        alignItems: "center"
    },
    footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 10,
        paddingBottom: 10
    },
    circleView: {
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        zIndex: 99,
        top: '52%'
    },
});
