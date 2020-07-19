import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity,ActivityIndicator, ScrollView,Image, FlatList,RefreshControl} from 'react-native';
import Header from '../../components/header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import config from '../../config/index';
import IntegralServer from '../../service/integralServer';
import TipModal from '../../components/tipModal';
import Toast from '../../components/toast';


const PAGESIZE = 10;
const {width, height} = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
        manageS:["在售","已下架"],
        allStore:[],
        current: 0,
        currentMana: 0,
        show: false,
        dataSource: [],
        currentPage: 1,
        // 下拉刷新
        isRefresh: false,
        // 加载更多
        isLoadMore: false,
        canLoadMore: true,
        pageSize: PAGESIZE,
        // 控制foot  1：正在加载   2 ：无更多数据
        showFoot: 2,
        showModalTwo: false,
        showModalOne: false
    }
    toDetail = (id) => {      
        this.props.navigation.navigate('PhotographEdit', { id });
    }
    componentDidMount() {
        this.getManegementData()
        this.getTCommCategory()
    }
    //移动端分页查询商品信息（根据商品状态和商品类型）
    selectCommMobeilByPage = async () => {
        const { pageSize, currentPage,currentMana,allStore,current} = this.state;
        
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: true,canLoadMore: true});
            
        } else {
            this.setState({ isLoadMore: true });
        }
        const res = await IntegralServer.seleMobileCommByPage({
            currentPage: currentPage,
            fCategoryId: allStore[current].fId?allStore[current].fId: '',
            pageSize: pageSize
        });
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: false });
        } else {
            this.setState({ isLoadMore: false });
        }
        if(res.success){
            this.setState({
                dataSource: res.obj.items
            })
            if (this.state.pageSize >= res.obj.itemTotal) {
                this.setState({
                    canLoadMore: false 
                })
            }
        }else{
            console.log(res.msg)
        }
    }
    //查询所有的商品类型信息
    getTCommCategory = async () => {
        const res = await IntegralServer.getTCommCategory();
        if(res.success){
            let all = {fId: null,fCateName: "全部"}
            let allStore = [...res.obj];
            allStore.unshift(all);
            this.setState({
                allStore
            },() => {this.selectCommMobeilByPage()})
        }else{
            console.log(res.msg)
        }
    }
    getManegementData = () => {
        this.setState({ refreshing: true });
        this.getTCommCategory()
        this.setState({ refreshing: false });
    }
    //展示item底部框
    setIndexShowDetail = (index) => {
        let dataSource = [...this.state.dataSource];
        for(let item of dataSource){
            if(item.showChange == null){
                item.showChange = false
            }
        }
        dataSource[index].showChange = !dataSource[index].showChange;
        this.setState({
            dataSource
        })
    }
    /**
     * 下啦刷新
     * 
     */
    
    _onRefresh = () => {
        // 不处于 下拉刷新
        this.setState({
            pageSize: PAGESIZE
        },() => {this.getManegementData()})
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
                this.getManegementData()
            })
  
        }
    } 
      /**
       * 创建尾部布局
       */
    _createListFooter = () => {
        const { isLoadMore, dataSource, canLoadMore } = this.state;
        let moreText = '下拉加载更多数据';
        if (isLoadMore) {
            moreText = '正在加载更多数据'
        } else {
            if (!canLoadMore) {
                moreText = '暂无更多数据' 
            }
        }
        if (dataSource.length == 0) {
            moreText = '暂无数据'
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
        return <View style={{ height: 1, backgroundColor: '#F9F9F9' }} />;
    }
    
    renderItem = ({item,index}) => {
        return (
            <View style={{backgroundColor: "#fff",paddingLeft: 16,paddingRight: 16,marginBottom: 10}}>
                <TouchableOpacity style={styles.titleTop} onPress = {() => {this.setIndexShowDetail(index)}}>
                    <Image style={{width:60,height: 60,marginRight: 15,backgroundColor: "#E0E0E0"}} source={{uri: (config.imgUrl+item.fCommPath)}}/>
                    <View style={{flex: 1,justifyContent: "space-between"}}>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text style={{fontSize: 14,color:  "#333"}}>{item.fCommName?item.fCommName: '--'}</Text>
                            <Text>{item.shellOnSize != null?(item.shellOnSize>0? '在售' : '未售'): '--'}</Text>
                        </View>
                        <View style={{flexDirection:"row",justifyContent: "space-between",alignItems: "center",marginTop: 5}}>
                            <View style={{flexDirection: "row"}}>
                                <Text style={styles.textSign}>{item.fCommSpecification?item.fCommSpecification: '--'}</Text>
                                <Text style={{color: "#9E9E9E",marginLeft: 11}}>已兑换{item.sumfExchangeNumber != null? item.sumfExchangeNumber:"--"}</Text>
                                <Text style={{color: "#9E9E9E",marginLeft: 11}}>总库存{item.shellonNum != null? item.shellonNum:"--"}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: "row",justifyContent: "space-between",alignItems: "center"}}>
                            <View style={{flexDirection: "row"}}>
                                <View style={{height: 16,position: "relative"}}>
                                    <Text style={styles.textLine}></Text>
                                    <Text style={{color: "#FF6834",fontSize: 14}}>￥{item.fCommPrice?item.fCommPrice: '--'}</Text>
                                </View>
                                <Text style={{color: "#4058FD",fontSize: 14,fontWeight: "400",marginLeft: 12}}>{item.fCommIntegral?item.fCommIntegral: '--'}积分</Text>
                            </View>
                            <Image style={{width:20,height: 20}} source={item.showChange? require('../../image/verification/bottom.png'): require('../../image/verification/top.png')}/>
                        </View>

                    </View>
                    
                </TouchableOpacity>
                {
                item.showChange ? 
                    <View style={styles.bottomTap}>
                        <TouchableOpacity style={{flexDirection: "row",alignItems: "center"}} onPress={() => {this.props.navigation.navigate('AddStore',{item,getTCommCategory: this.getTCommCategory})}}>
                            <Image style={{width:16,height: 16,marginRight: 8}} source={require('../../image/verification/pen.png')}/>
                            <Text style={styles.textBottom}>编辑</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection: "row"}} onPress={() => {this.props.navigation.navigate('ShelfStore',{item,getTCommCategory: this.getTCommCategory})}}>
                            <Image style={{width:16,height: 16,marginRight: 8}}  source={require('../../image/verification/arrowUp.png')}/>
                            <Text style={styles.textBottom}>上架</Text>
                        </TouchableOpacity> 
                        <TouchableOpacity style={{flexDirection: "row"}} onPress={() => {this.props.navigation.navigate('ShelfList',{item,getTCommCategory: this.getTCommCategory})}}>
                            <Image style={{width:16,height: 16,marginRight: 8}}  source={require('../../image/verification/arrowUp.png')}/>
                            <Text style={styles.textBottom}>上架列表</Text>
                        </TouchableOpacity>
                        {
                            item.shellOnSize&&item.shellOnSize > 0 ? null :
                            <TouchableOpacity style={{flexDirection: "row"}} onPress={() => {this.setState({showModalTwo: true,postitem: item})}}>
                                <Image style={{width:16,height: 16,marginRight: 8}} source={require('../../image/verification/trashAlt.png')}/>
                                <Text style={styles.textBottom}>删除</Text>
                            </TouchableOpacity>
                        }
                        
                        
                    </View> :null
                }
            </View>
    )}
    //删除商品
    delectContent = async () => {
        const res = await IntegralServer.delById(this.state.postitem.fId)
        if(res.success){
            Toast.show(res.msg)
            this.selectCommMobeilByPage()
            this.setState({showModalTwo: false})
        }else{
            Toast.show(res.msg)
            console.log(res.msg);
        }   
    }
    render() {
        const { pop } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="商品管理"
                    hidePlus={false} 
                    props={this.props}
                />
                <TipModal 
                    showModal={this.state.showModalTwo}
                    onCancel={()=>{this.setState({showModalTwo: false})}}
                    onOk={this.delectContent}
                    tipText={`您确定删除${this.state.postitem?this.state.postitem.fCommName: '--'}吗？`}
                />
                <View style={{width: "100%",height: "100%"}}>
                    <View style={{paddingLeft: 16,paddingRight: 16,backgroundColor:"#fff",alignItems: "center"}}>
                        <View style={styles.tabBar}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                <View style={{display: "flex", flexDirection:"row"}}>
                                    {this.state.allStore.map((item,index) => {
                                        return <TouchableOpacity index={index} onPress={() => {this.setState({current: index},() => {this.selectCommMobeilByPage()})}}>
                                            <View style={[styles.barTexts,index == this.state.current ? { borderBottomColor: "#6376FD"}:{borderBottomColor: "#fff"}]}>
                                                <Text style={[{height: 40, lineHeight: 40, fontSize: 14, fontWeight: "500"} ,index == this.state.current ? {color: "#6376FD"}:{color: "#333333"}]}>{item.fCateName}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    })}
                                </View>
                            </ScrollView>
                        </View>
                    </View> 
                    <View style={{marginTop: 5,paddingBottom: 50}}>
                        <FlatList
                            data={this.state.dataSource}
                            // keyExtractor={(item)=>item.fId}
                            refreshControl={
                                <RefreshControl
                                    title={'Loading'}
                                    colors={['#000']}
                                    refreshing={this.state.isRefresh}
                                    onRefresh={() => {
                                        this._onRefresh();
                                    }}
                                />
                            }
                            renderItem={this.renderItem}
                            refreshing={this.state.isRefresh}
                            //加载更多
                            ListFooterComponent={this._createListFooter.bind(this)}
                            onEndReached={() => this._onLoadMore()}
                            onEndReachedThreshold={0.1}
                            ItemSeparatorComponent={()=>this._separator()}
                            />
                    </View>
                </View>
                {
                 !this.state.currentMana?
                    <TouchableOpacity style={{width:44,height: 44,position: "absolute",bottom: 21,right: 17,zIndex: 9999}} onPress={() => {this.props.navigation.navigate('AddStore',{getTCommCategory: this.getTCommCategory})}}>
                        <Image style={{width:44,height: 44,}} source={require('../../image/verification/yuan.png')}/>
                    </TouchableOpacity>  : null
                } 
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F8',
        display: "flex"
    },
    tabBar: {
        marginTop: 15,
        height: 40,
        width,
        paddingLeft: 16,
    },
    selctView: {
        alignItems: "center",
        paddingTop: 11,
        paddingBottom: 11
    },
    barText: {
        fontSize: 14,
    },
    barTexts: {
        height: 40,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 2,
        marginRight:30,
    },
    footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 10,
        paddingBottom: 80
    },
    titleTop: {
        marginTop: 12,
        flexDirection: "row",
        width: "100%",
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: '#F6F6F6',
        borderBottomWidth: 1
    },
    textSign: {
        color: "#9E9E9E",
        paddingRight: 19,
        borderRightColor: "#9E9E9E",
        borderRightWidth: 1
    },
    textLine: {
        width: "100%",
        height: 1,
        backgroundColor: "#FF6834",
        position: "absolute",
        top: "65%"
    },
    textBottom: {
        fontSize: 14,
        color: "#858585",
        fontWeight: '500'
    },
    bottomTap: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        paddingLeft: 17,
        paddingRight: 21,
        paddingTop: 15,
        paddingBottom: 17
    }
});
