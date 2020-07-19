import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, FlatList,Image,RefreshControl,ActivityIndicator} from 'react-native';
import { connect } from 'react-redux';
import Header from '../../components/header';

import Integral from '../../service/integralServer';
const {width, height} = Dimensions.get('window');
import Toast from '../../components/toast';
import { parseDate } from '../../utils/handlePhoto';
class Integrals extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state ={
        currentPage: 1,
        // 列表数据结构
        dataSource: [],
        // 下拉刷新
        isRefresh: false,
        // 加载更多
        isLoadMore: false,
        pageSize: 10,
        // 控制foot  1：正在加载   2 ：无更多数据
        showFoot: 2,
        items: {},
        fAllIntegral: 0
    }
    toDetail = (id) => {      
        this.props.navigation.navigate('PhotographEdit', { id });
    }
    componentDidMount() {
        this.getIntegralData();
        this.getIntegralRules();
    }
    //积分明细接口
    getIntegralRules = async () => {
        console.log('param', {
            pageCurrent: this.state.currentPage,
            pageSize: this.state.pageSize,
            userId: this.props.userInfo.fEmployeeId
        });
        this.setState({isRefresh: true});
        const res = await Integral.getIntegralRules({
            pageCurrent: this.state.currentPage,
            pageSize: this.state.pageSize,
            userId: this.props.userInfo.fId
        });
        this.setState({isRefresh: false});
        if(res.success){
            this.setState({
                dataSource: res.obj.pageRes.items,
                fAllIntegral: res.obj.fAllIntegral
            })
            if (this.state.pageSize >= res.obj.pageRes.itemTotal) {
                this.setState({
                    showFoot: 2
                })
            }
        }else{
            Toast.show(res.msg)
        }
    }
    getIntegralData = () => {
        this.setState({ refreshing: true });
        this.setState({ refreshing: false });
    }
    /**
     * 下啦刷新
     * 
     */
    
    _onRefresh = () => {
        // 不处于 下拉刷新
        if (!this.state.isRefresh) {
          this.getIntegralData()
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
                this.getIntegralRules();
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
    renderItem = ({item}) => {
        return (<TouchableOpacity style={{height: 72,alignItems: "center",flexDirection: "row"}}>
                <Image style={{width:44,height: 44,marginLeft: 5,marginRight: 13}} source={require('../../image/verification/icon.png')}/>
                <View style={{flexDirection: 'row',justifyContent: "space-between",flex: 1,alignItems: "center"}}>
                    <View>
                        <Text style={{color: "#333",fontSize: 14,fontWeight: "500"}}>{item.fNote? item.fNote: '--'}</Text>
                        <Text style={{color: "#999",fontSize: 12,marginTop: 10}}>{item.fAddTime? parseDate(item.fAddTime,'YYYY.MM.DD HH:mm'): '--'}</Text>
                    </View>
                    <Text style={{fontSize: 16,fontWeight: "600",color: item.fChangeType ? '#1ACFAA' : "#F56767"}}>{item.fChangeType ? '+' : "-"} {item.fIntegralNumber? item.fIntegralNumber: '0'}积分</Text>
                </View>
            </TouchableOpacity>)
            }
    render() {
        const { pop } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="积分明细"
                    hidePlus={false} 
                    props={this.props}
                />
                <View style={{width: "100%",height: "100%",backgroundColor: "#4B74FF",alignItems: "center"}}>
                    <View style={{width: "100%",height: 220,justifyContent: "center",alignItems:"center",}}>
                        <Text style={{fontSize: 36,fontWeight: "600",color: "#fff"}}>{this.state.fAllIntegral? this.state.fAllIntegral: 0}</Text>
                        <TouchableOpacity style={styles.button} onPress = {() => {this.props.navigation.navigate('ShopPage')}}>
                            <Text style={{color: "#fff",fontSize: 14}}>去兑换</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width: "100%",backgroundColor: "#fff",borderTopLeftRadius: 8,borderTopRightRadius: 8,paddingLeft: 16,paddingRight: 16,height: 400,paddingBottom: 30}}>
                        <FlatList
                                showsVerticalScrollIndicator = {false}
                                showsHorizontalScrollIndicator = {false}
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

const mapStateToProps = state => ({
    userInfo: state.userReducer.userInfo
});

export default connect(mapStateToProps)(Integrals);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F8',
        display: "flex"
    },
    button: {
        width: 120,
        height: 44,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 36
    },
    footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 20,
      }
});
