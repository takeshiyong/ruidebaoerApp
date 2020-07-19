import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, ImageBackground,ActivityIndicator, FlatList,RefreshControl} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import ShowModal from '../../components/showShopModal';
import Header from '../../components/header';
import Integral from '../../service/integralServer';
import Toast from '../../components/toast';
import config from '../../config/index';


const PAGESIZE = 10;
const {width, height} = Dimensions.get('window');
class ShopPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allStore:[],
            current: 0,
            currentPage: 1,
            fAllIntegral: 0,
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
        };
      }

    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    toDetail = (id) => {
        this.props.navigation.navigate('PhotographEdit', { id });
    }
    componentDidMount() {
        this.getIntegralRules();
        this.getManegementData();
    }
    //积分明细接口
    getIntegralRules = async () => {
        const res = await Integral.getIntegralRules({
            pageCurrent: this.state.currentPage,
            pageSize: this.state.pageSize,
            userId: this.props.userInfo.fId
        })
        if(res.success){
            this.setState({
                fAllIntegral: res.obj.fAllIntegral
            })
        }else{
            console.log('积分明细',res.msg);
            // Toast.show(res.msg)
        }
    }
    //查询所有的商品类型信息
    getTCommCategory = async () => {
        const res = await Integral.getTCommCategory();
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
        this.getTCommCategory();
        this.getIntegralRules()
        this.setState({ refreshing: false });
    }
    //移动端分页查询商品信息（根据商品状态和商品类型）
    selectCommMobeilByPage = async () => {
        const { pageSize, currentPage,currentMana,allStore,current} = this.state;
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: true,canLoadMore: true});
        } else {
            this.setState({ isLoadMore: true });
        }
        const res = await Integral.selectCommMobeilByPage({
            currentPage: currentPage,
            fCategoryId: allStore[current].fId,
            pageSize: pageSize
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
    //兑换成功
    insertOrder = async (num,item) => {
        const res = await Integral.insertOrder({
            "fCommodityNumber": num,
            "fShelfOnId": item.fId
        });
        if(res.success){
            this.ShowModal.hide()
            this.props.navigation.push('SuccessRedem',{id: res.obj,getManegementData: this.getManegementData})
        }else{
            console.log(res);
            Toast.show(res.msg)
        }
        
    }
    
    finishConversion = (num,item) => {
        console.log(num,item);
        if(num > 0){
            this.insertOrder(num,item);
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
    //首布局
    _createListHeader = () => {
        return(<View style ={{marginBottom: 20}}>
                    <View style={styles.banner} source={require('../../image/integarlStore/banner.png')}>
                        <Text style={{ color: "white", fontSize: 45}}>{this.state.fAllIntegral ? this.state.fAllIntegral : 0}</Text>
                        <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center', justifyContent: 'center',marginTop: 10}} onPress={() => {this.props.navigation.navigate('GetInterDetail')}}>
                            <AntDesign name="exclamationcircle" color="#fff" size={16}/>
                            <Text style={{color: "white", fontSize: 14,marginLeft: 5}}>积分获得攻略</Text>
                        </TouchableOpacity>
                        <View style={styles.integralInfo}>
                            <TouchableOpacity onPress = {() => {this.props.navigation.navigate('Integral')}}>
                                <Text style={styles.integralText}>积分明细</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress = {() => {this.props.navigation.navigate('RedemptionRecord')}}>
                                <Text style={styles.integralText}>积分兑换记录</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.tabBar}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={{display: "flex", flexDirection:"row"}}>
                                {this.state.allStore.map((item,index) => {
                                    return <TouchableOpacity index={index} onPress={() => {this.setState({current: index},()=>{this.selectCommMobeilByPage()})}}>
                                        <View style={[styles.barText,index == this.state.current ? {color: "#FFFFFF",backgroundColor: '#4058FD'}:{color: "#333333"}]}>
                                            <Text style={[{height: 40, lineHeight: 40, fontSize: 16, fontWeight: "600"} ,index == this.state.current ? {color: "#FFFFFF"}:{color: "#333333"}]}>{item.fCateName}</Text>
                                        </View>
                                    </TouchableOpacity>
                                })}
                            </View>
                        </ScrollView>
                    </View>
        </View>)
    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#F9F9F9',width: "100%"}} />;
    }
    renderItem = ({item,index}) => {
        return (
            <TouchableOpacity style={[styles.item,{marginLeft: 10}]}>
                <Image style={{width: "100%",height:150}} source={{uri: (config.imgUrl+item.fCommPath)}}/>
                <View style={{paddingLeft: 8,paddingRight: 8}}>
                    <Text style={styles.itemAText}>{item.fCommName?item.fCommName: '--'}</Text>
                    <View style={{flexDirection: "row",justifyContent: "space-between"}}>
                        <View style={{flexDirection: "row",alignItems: "center"}}>
                            <Text style={{marginRight: 6}}>{item.fCommSpecification?item.fCommSpecification: '--'}</Text>
                            <Text style={{borderRightColor: "#999999",borderRightWidth: 1,height: 12}}/>
                            <Text style={{marginLeft: 6}}>库存{item.fStock !=null && item.fExchangeNumber !=null ?(item.fStock-item.fExchangeNumber): '--'}</Text>
                        </View>
                        <View style={{height: 12,position: "relative",}}>
                            <Text style={{width: '100%',height: 1,backgroundColor: "#FF632E",position: "absolute", left: 0, top: "60%"}}></Text>
                            <Text style={{color: "#FF632E",fontSize: 12}}>￥{item.fCommPrice?item.fCommPrice: '--'}</Text>
                        </View>
                    </View>
                    <View style={{display: "flex", flexDirection:"row", justifyContent:"space-between", width: "100%"}}>
                        <View style={{flexDirection: "row"}}>
                            <Text style={[styles.itemText,{fontWeight: 'bold'}]}>{item.fShelfOnTime?item.fShelfOnTime:'--'}</Text>
                            <Text style={styles.itemText}>积分</Text>
                        </View>
                        <TouchableOpacity style={styles.itemTextBorder} onPress={() => {this.setState({type: 'conversion'},() => {this.ShowModal.show(item)}) }}>
                            <Text style={styles.itemTextIntegral}>立即兑换</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
    )}
    render() {
        const { pop } = this.props.navigation;
        const { userIntegral } = this.props;
        return (
            <View style={styles.container}>
                <Header
                    backBtn={true}
                    titleText="积分商城"
                    props={this.props}
                    isMine={true}
                />
                    <View >
                        <View style={{paddingBottom: 80}}>
                            <FlatList
                                data={this.state.obj}
                                columnWrapperStyle={true}
                                numColumns= {2}
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
                                ListHeaderComponent={this._createListHeader.bind(this)}
                                ListFooterComponent={this._createListFooter.bind(this)}
                                onEndReached={() => this._onLoadMore()}
                                onEndReachedThreshold={0.1}
                                ItemSeparatorComponent={()=>this._separator()}
                                />
                        </View>
                    </View>
                <ShowModal ref={(ref)=>this.ShowModal = ref} type={this.state.type} finishConversion={this.finishConversion}/>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        userIntegral: state.userReducer.userIntegral,
        userInfo: state.userReducer.userInfo
    }
}

export default connect(mapStateToProps)(ShopPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F8',
        display: "flex"
    },
    banner: {
        width,
        height: 210,
        backgroundColor: "#486FFD",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 15
    },
    integralInfo: {
        width,
        display: "flex",
        flexDirection: "row",
        paddingLeft: 60,
        paddingRight:60,
        justifyContent: "space-around"
    },
    integralText: {
        paddingLeft: 15,
        paddingTop: 10,
        paddingRight: 15,
        paddingBottom: 10,
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 20,
        color: "white",
        marginTop: 25,
    },
    tabBar: {
        marginTop: 15,
        height: 40,
        width,
        paddingLeft: 15,
    },
    barText: {
        height: 40,
        lineHeight: 40,
        fontSize: 16,
        fontWeight: "600",
        marginRight: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 20,
    },
    //content
    content:{
        width: width,
        marginTop: 10,
        borderRadius: 4,
        marginBottom: 10,
    },
    collegeListHeader: {
        display: "flex",
        flexDirection: "row",
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: "space-between",
        height: 50,
        alignItems: "center",

    },
    courseTitle: {
        color: "#333333",
        fontSize: 16,
        fontWeight: "600",
    },
    items: {
        width: width,
        paddingLeft: 10,
        paddingRight: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
    },
    item: {
        width: (width-30)/2,
        backgroundColor: "#FFF",
        marginBottom: 12,
        
    },
    itemAText:{
        fontSize: 14,
        marginTop: 10,
        marginBottom: 4,
        color: '#333',
        fontWeight: "600"
    },
    itemText: {
        fontSize: 14,
        marginTop: 8,
        marginBottom: 20,
        color: "#4058FD",
    },
    itemTextIntegral: {
        fontSize: 12,
        color: '#fff',
    },
    itemTextBorder: {
      marginTop: 8,
      marginBottom: 10,
      borderRadius: 8,
      width: 64,
      height: 22,
      alignItems: 'center',
      backgroundColor: '#4058FD',
      alignItems: "center",
      justifyContent: "center"
    },
    footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 20,
    },
});
