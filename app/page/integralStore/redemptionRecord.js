import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, FlatList,Image,TouchableHighlight,RefreshControl,ActivityIndicator} from 'react-native';
import Header from '../../components/header';
import IntegralServer from '../../service/integralServer';
import { parseTime, parseDate } from '../../utils/handlePhoto';
import Toast from '../../components/toast';

const PAGESIZE = 10;
const {width, height} = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state ={
        currentPage: 1,
        current: false,
        // 列表数据结构
        dataSource: [],
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
        this.getIntegralDetail()
    }
    //兑换页记录时间分页查询
    selectRedemptionRecord = async  () => {
        const { pageSize, currentPage} = this.state;
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: true,canLoadMore: true});
        } else {
            this.setState({ isLoadMore: true });
        }
        const res = await IntegralServer.selectRedemptionRecord({
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
            Toast.show(res.msg)
            console.log(res.msg)
        }
        console.log(res)
    }
    //兑换页记录详情查询
    selectForDetails= async (item,index) => {
        if(!item.showBtn){
            const res = await IntegralServer.selectForDetails({
                status: 2,
                time: item.time
            })
            console.log(res);
            if(res.success){
                let fileList = res.obj;
                let dataSource = [...this.state.dataSource];
                for(let item of dataSource){
                    if(item.fileList&&item.fileList.length !==0 ){
                        item.fileList = []
                    }
                }
                dataSource[index].showBtn = true;
                dataSource[index].fileList = fileList
                this.setState({
                    dataSource
                })
            }else{
                console.log(res.msg);
                Toast.show(res.msg)
            }
        }else{
            let dataSource = [...this.state.dataSource];
            dataSource[index].showBtn = false;
            this.setState({
                dataSource
            })
        }
    }
    getIntegralDetail = () => {
        this.setState({ refreshing: true });
        this.selectRedemptionRecord()
        this.setState({ refreshing: false });
    }
    /**
     * 下啦刷新
     * 
     */
    
    _onRefresh = () => {
        // 不处于 下拉刷新
        if (!this.state.isRefresh) {
          this.getIntegralDetail()
        }
    };
      /**
     * 加载更多
     * @private
     */
    _onLoadMore() {
        // 不处于正在加载更多 && 有下拉刷新过，因为没数据的时候 会触发加载
        if (!this.state.isLoadMore && this.state.dataSource.length > 0 && this.state.showFoot !== 2) {
            this.setState({
                pageSize: this.state.pageSize + 10
            }, () => {
                this.getIntegralDetail()
            })
  
        }
    } 
      /**
       * 创建尾部布局
       */
    _createListFooter = () => {
        return (
            <View style={styles.footerView}>
                {this.state.showFoot === 1 ? <ActivityIndicator color="#000"/> : null}
                <Text style={{ color: '#999' }}>
                    {this.state.showFoot === 1 ? '正在加载更多数据...' : '没有更多数据了'}
                </Text>
            </View>
        )
    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#F9F9F9' }} />;
    }
    renderItem = ({item,index}) => {
        return (
            <View>
                <TouchableOpacity style={styles.titleTop} onPress = {() => {this.selectForDetails(item,index)}}>
                    <View>
                        <Text style={{color: "#333",fontSize: 14,marginTop: 10,marginBottom: 5}}>{item.time?parseDate(item.time,'YYYY年MM月'):'--'}</Text>
                        <Text style={{fontSize: 12,color: "#999"}}>支出{item.totalPoints!= null?item.totalPoints: '--'}积分(节约￥{item.savingMoney != null?item.savingMoney: '--'})</Text>
                    </View>
                    <Image style={{width:40,height: 40}} source={item.showBtn? require('../../image/verification/bottom.png'): require('../../image/verification/top.png')}/>
                </TouchableOpacity>
                {
                    item.fileList&&item.showBtn&&item.fileList.length !==0  ?
                        item.fileList.map((items) => {
                            return (<TouchableOpacity style={styles.items}>
                                        <View style={styles.item}>
                                            <Image style={{width:44,height: 44,marginLeft: 5,marginRight: 13}} source={require('../../image/verification/icon.png')}/>
                                            <View style={{flexDirection: 'row',justifyContent: "space-between",flex: 1,alignItems: "center"}}>
                                                <View>
                                                    <View style={{flexDirection: "row"}}>
                                                        <Text style={{color: "#333",fontSize: 14,fontWeight: "500"}}>{items.fCommName?items.fCommName: '--'}{item.fCommSpecification?item.fCommSpecification: ''}</Text>
                                                        <Text style={{marginLeft: 5,color: "#333",fontSize: 14,}}>{items.fCommSpecification != null ?items.fCommSpecification: '--'}</Text>
                                                        <Text style={{marginLeft: 5,color: "#333",fontSize: 14,}}>*{items.redemptionNumber != null ?items.redemptionNumber: '--'}</Text>
                                                    </View>
                                                    <Text style={{color: "#999",fontSize: 12,marginTop: 10}}>{items.fStartTime?parseDate(items.fStartTime,'MM-DD HH:mm'): '--'}</Text>
                                                </View>
                                                <Text style={{fontSize: 16,fontWeight: "600",color:'#4058FD' }}>{items.fIntegralNumber != null?items.fIntegralNumber: '--'}积分</Text>
                                            </View>
                                        </View>
                                </TouchableOpacity>)
                        })
                    : null
                }
            </View>
    )}
    render() {
        const { pop } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="兑换记录"
                    hidePlus={false} 
                    props={this.props}
                />
                <View style={{width: "100%",height: "100%",alignItems: "center"}}>
                    <View style={styles.box}>
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
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        backgroundColor: "#F6F6F6"
    },
    box: {
        width: "100%",
        flex:1,
        
    },
    footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 20,
    },
    titleTop: {
        width: "100%",
        height: 72,
        backgroundColor: "#F6F6F6",
        paddingLeft: 16,
        paddingRight: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    items: {
        
        height: 72,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: "#fff"
        
    },
    item: {
        height: 72,
        alignItems: "center",
        flexDirection: "row",
        borderBottomColor: "#F6F6F6",
        borderBottomWidth: 1,
       
    }
});
