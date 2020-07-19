import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity,ActivityIndicator, ScrollView,Image, FlatList,RefreshControl} from 'react-native';
import Header from '../../components/header';
import ShowModal from '../../components/showShopModal';
import IntegralServer from '../../service/integralServer';
import { parseTime, parseDate } from '../../utils/handlePhoto';
import config from '../../config/index';


const PAGESIZE = 10;
const {width, height} = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
        current: 0,
        dataSource : [],
        currentPage: 1,
        // 下拉刷新
        isRefresh: false,
        // 加载更多
        isLoadMore: false,
        canLoadMore: true,
        pageSize: PAGESIZE,
        // 控制foot  1：正在加载   2 ：无更多数据
        showFoot: 2,
    }
    toDetail = (id) => {      
        this.props.navigation.navigate('PhotographEdit', { id });
    }
    componentDidMount() {
        this.getWriteOffRecordPage()
        this.getRecordData()
    }
    //核销记录页
    getWriteOffRecordPage = async() => {
        const { pageSize, currentPage} = this.state;
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: true,canLoadMore: true});
        } else {
            this.setState({ isLoadMore: true });
        }
        const res = await IntegralServer.getWriteOffRecordPage({
            currentPage: currentPage,
            status: 2,
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
    getRecordData = () => {
        this.setState({ refreshing: true });
        // this.getWriteOffRecordPage()
        this.setState({ refreshing: false });
    }
    /**
     * 下啦刷新
     * 
     */
    
    _onRefresh = () => {
        // 不处于 下拉刷新
        this.setState({
            pageSize: PAGESIZE
        },() => {this.getRecordData()})
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
                this.getRecordData()
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
        let moreText = '下拉加载更多数据';
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
        return <View style={{ height: 1, backgroundColor: '#F9F9F9' }} />;
    }
    renderItem = ({item,index}) => {
        return (<View style={{width: "100%",backgroundColor: "#fff",borderBottomColor: "#F6F6F6",borderBottomWidth: 1,paddingLeft: 19,paddingRight: 21}}>
                    <Text style={{marginTop: 25,marginBottom: 12,color: "#A8A8A8", fontSize: 12}}>订单号:{item.fOrderNumber?item.fOrderNumber:'--'}</Text>
                    <View style={styles.item}>
                        <View style={{flexDirection: "row",flex:1}}>
                            <Image style={{width: 44,height: 44,backgroundColor: "#E0E0E0",marginRight: 16}} source={{uri: (config.imgUrl+item.fCommPath)}}/>
                            <View style={{width: "100%",justifyContent: "space-between"}}>
                                <View style={{flexDirection: "row"}}>
                                    <Text style={{fontSize: 14,color: "#333333",marginRight: 5}}>{item.fCommName?item.fCommName:'--'}</Text>
                                    <Text style={{fontSize: 14,color: "#333"}}>{item.fCommSpecification?item.fCommSpecification:'--'}</Text>
                                    <Text style={{fontSize: 14,color: "#333"}}>  *{item.fCommodityNumber?item.fCommodityNumber:'--'}</Text>
                                </View>
                                <View>
                                    <Text style={{fontSize: 14,color: "#A8A8A8"}}>{item.fWriteOffTime? parseDate(item.fWriteOffTime,'YYYY-MM-DD HH:mm'): '--'}</Text>
                                </View>
                            </View>
                        </View>
                        <Text style={{fontSize: 16,color: "#3A3A3A",fontWeight: "600"}}>{item.fIntegralNumber !=null ?item.fIntegralNumber:"--"}</Text>
                    </View>
                </View>)
            }
    render() {
        const { pop } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="核销记录"
                    hidePlus={true} 
                    props={this.props}
                    isMine={true}
                />   
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
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 12,
        paddingBottom: 16,
        width: "100%",
    }
});
