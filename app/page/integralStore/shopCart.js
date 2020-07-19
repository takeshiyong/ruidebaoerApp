import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, ImageBackground,ActivityIndicator, FlatList,RefreshControl} from 'react-native';
import Header from '../../components/header';
import ShowModal from '../../components/showShopModal';
import IntegralServer from '../../service/integralServer';
import config from '../../config/index';
import { parseTime, parseDate } from '../../utils/handlePhoto';
import AntDesign from 'react-native-vector-icons/AntDesign';


const PAGESIZE = 10;
const {width, height} = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });

    state = {
        manage:["待核销","已核销"],
        current: 0,
        obj:[],
        currentPage: 1,
        // 下拉刷新
        isRefresh: false,
        // 加载更多
        isLoadMore: false,
        pageSize: PAGESIZE,
        // 控制foot  1：正在加载   2 ：无更多数据
        showFoot: 2,
        canLoadMore: true,
    }
    componentDidMount = () => {
        this.getManegementData()
    }
    getManegementData = () => {
        this.setState({ refreshing: true });
        this.selectOrderPage()
        this.setState({ refreshing: false });
    }
    //订单页查询
    selectOrderPage = async() => {
        const { pageSize, currentPage} = this.state;
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: true,canLoadMore: true});
        } else {
            this.setState({ isLoadMore: true });
        }
        const res = await IntegralServer.selectOrderPage({
            status: this.state.current? 2: 1,
            pageSize,
            currentPage
        });
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: false });
        } else {
            this.setState({ isLoadMore: false });
        }
        if(res.success){
            this.setState({
                obj: res.obj.items
            })
            if (this.state.pageSize >= res.obj.itemTotal) {
                this.setState({
                    canLoadMore: false,
                })
            }
        }else{
            console.log(res.msg)
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
        },() => {this.getManegementData()})
    };
      /**
     * 加载更多
     * @private
     */
    _onLoadMore() {
        // 不处于正在加载更多 && 有下拉刷新过，因为没数据的时候 会触发加载
        if (!this.state.isLoadMore && this.state.obj.length > 0 && this.state.canLoadMore) {
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
        const { isLoadMore, obj, canLoadMore } = this.state;
        
        let moreText = '下拉加载更多数据';
        if (isLoadMore) {
            moreText = '正在加载更多数据'
        } else {
            if (!canLoadMore) {
                moreText = '暂无更多数据' 
            }
        }
        if (obj.length == 0) {
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
        return <View style={{ height: 1, backgroundColor: '#F9F9F9',width: "100%"}} />;
    }
    renderItem = ({item,index}) => {
        return (<View style={{width: "100%",backgroundColor: "#fff",marginBottom: 10,paddingLeft: 19,paddingRight: 21}}>
            <View style={{flexDirection: "row",alignItems: "center",paddingTop: 10,paddingBottom: 10}}>
                <Text style={{fontSize: 14,color: "#333333"}}>{item.fCommName?item.fCommName: '--'}</Text>
                <Text style={{fontSize: 14,color: "#333",marginLeft: 10}}>{item.fCommSpecification?item.fCommSpecification: '--'}</Text>
            </View>
            <View style={{flexDirection: "row",justifyContent: "space-between",paddingTop: 10,paddingBottom: 10,borderTopColor: "#F6F6F6",borderTopWidth: 1}}>
                <View style={{flexDirection: "row"}}>
                    <Image style={{width: 64,height: 64,backgroundColor: "#E0E0E0",marginRight: 16}} source={{uri: (config.imgUrl+item.fCommPath)}}/>
                    <View>
                        <Text style={{fontSize: 14,color: "#999999"}}>数量:  {item.fExchangeNumber?item.fExchangeNumber: '--'}</Text>
                        <Text style={{fontSize: 14,color: "#999999",marginTop: 5}}>总价:  {item.fIntegralNumber !=null?item.fIntegralNumber: '--'} 积分</Text>
                        {
                            !this.state.current?
                                <Text style={{marginTop: 5,marginBottom: 0,color: "#999999", fontSize: 12}}>有效期至: {item.fValidTime?parseDate(item.fValidTime,'YYYY-MM-DD HH:mm'): "--"}</Text>
                            : null
                        }
                        {
                            this.state.current?
                                <Text style={{marginTop: 5,marginBottom: 0,color: "#999999", fontSize: 12}}>使用日期: {item.fValidTime?parseDate(item.fValidTime,'YYYY-MM-DD HH:mm'): "--"}</Text>
                            : null
                        }
                    </View>
                </View>
                {
                    !this.state.current?
                    <TouchableOpacity style={{marginTop: 20,backgroundColor: "#4B74FF",width: 64,height: 34,borderRadius: 8,justifyContent: "center", alignItems:"center"}} onPress={() => this.ShowModal.show(item)}>
                        <Text style={{fontSize: 14,color: '#fff'}}>使用</Text>
                    </TouchableOpacity>
                    : null
                }
                {/* {
                    this.state.current?
                    <View style={{width: 64,height: 34,borderRadius: 8,justifyContent: "center", alignItems:"center"}}>
                        <Text style={{fontSize: 14,color: '#333'}}>已使用</Text>
                    </View>
                    : null
                } */}
            </View>
    </View>
    )}
    
    render() {
        const { pop } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="订单列表"
                    hidePlus={true} 
                    props={this.props}
                    isMine={true}
                />
                <View style={styles.tabBarCon}>
                    {this.state.manage.map((item,index) => {
                        return (<TouchableOpacity index={index} onPress={() => {this.setState({current: index},() => {this.selectOrderPage()})} }>
                                    <View style={[styles.barView,index == this.state.current ? {borderBottomColor: "#4058FD"}:{borderBottomColor: "#fff"}]}>
                                        <Text style={[styles.barText,index == this.state.current ? {color: "#4B74FF"}:{color: "#333333"}]}>{item}</Text>
                                    </View>
                                </TouchableOpacity>)
                    })}
                </View>
                <View style={{paddingBottom: 80}}>
                        <FlatList
                                data={this.state.obj}
                                // columnWrapperStyle={true}
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
                <ShowModal ref={(ref)=>this.ShowModal = ref} type='RedeemQRCode'/>
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
    tabBarCon: {
        display: "flex", 
        width:width,
        flexDirection:"row",
        paddingLeft: 70,
        paddingRight: 70,
        justifyContent: "space-between",
        backgroundColor: "#FFF",
        borderBottomColor: "#F6F6F6",
        borderBottomWidth: 1
    },
    barView: {
        height: 44,
        borderBottomWidth: 1,
        
    },
    barText: { 
        lineHeight: 44, 
        fontSize: 14, 
        height: 44,
        fontWeight: "400",
        width: 48,
        textAlign: "center",
    },
    footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 20,
        paddingBottom: 50
    },
});
