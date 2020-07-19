import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity,TextInput,ActivityIndicator, ScrollView,Image, FlatList,RefreshControl} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import SplashScreen from 'react-native-splash-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import organizationServer from '../../service/organizationServer';
import Header from '../../components/header';
import Toast from '../../components/toast';
import { parseTime, parseDate } from '../../utils/handlePhoto';


const PAGESIZE = 10;
const {width, height} = Dimensions.get('window');
export default  class Organize extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            showX: false,
            dataSource: [1],
            item: {},
            currentPage: 1,
            // 下拉刷新
            isRefresh: false,
            // 加载更多
            isLoadMore: false,
            pageSize: PAGESIZE,
            // 控制foot  1：正在加载   2 ：无更多数据
            showFoot: 2,
            canLoadMore: true,
            showType: false,
            fYear: ''
        };
    }

    componentDidMount() {
      SplashScreen.hide();
      if (this.props.navigation.state && this.props.navigation.state.params.item) {
        this.setState({
            fYear: this.props.navigation.state.params.item.fYear
        },() => {this.getItemsData()})
      }
    }

    appSelectByPage = async () => {
        const { currentPage, pageSize, refreshing,text,fYear} = this.state;
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: true,canLoadMore: true});
        } else {
            this.setState({ isLoadMore: true });
        }
        
        const res = await organizationServer.appSelectByPage({
            "fCurrentPage": currentPage,
            "fPageSize": pageSize,
            "fSearchCount": text,
            "fYear": fYear
        })
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
    
    //当值发生变换时
    handleChange = (text) => {
        if(text != ''){
            this.setState({
                text,
                showX: true
            },() => {this.getItemsData()})
        }else{
            this.setState({
                text,
                showX: false
            },() => {this.getItemsData()})
        }
        
    }
    /**
     * 下啦刷新
     * 
     */
    getItemsData = () => {
        this.setState({ refreshing: true });
        this.appSelectByPage()
        this.setState({ refreshing: false });
    }
    _onRefresh = () => {
        // 不处于 下拉刷新
        this.setState({
            pageSize: PAGESIZE
        },() => {this.getItemsData()})
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
                this.getItemsData()
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
        return <View style={{ height: 1, backgroundColor: '#F9F9F9',width: "100%"}} />;
    }
    renderItem = ({item,index}) => {
        return (<TouchableOpacity style={{flexDirection: "row",paddingTop: 10,paddingBottom: 10,alignItems: "center"}} onPress={() => {this.props.navigation.navigate("ResponsibilityDetail",{item})}}>
        <Image source={require("../../image/documentIcon/item.png")} style={{width: 40, height: 40}}/>
        <View style={{marginLeft: 10}}>
            <Text>{item.fName?item.fName:'--'}</Text>
            <Text>{item.fCreateTime?parseDate(item.fCreateTime,'YYYY.MM.DD'):'--'}</Text>
        </View>
    </TouchableOpacity>)}
    render() {
        const { pop } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="责任书列表"
                    hidePlus={true} 
                />
                <View style={[styles.topBar, this.state.showX ? {borderBottomWidth: 0} : {}]}>
                    <View style={styles.barInput}>
                        <Feather name={'search'} size={14} style={{ color: '#696A6C', lineHeight: 30,marginRight: 5}} />
                        <TextInput  
                            style={{padding: 0,width: "100%", height: "100%", flex: 9, fontSize: 14,color: '#5D6A76'}}
                            placeholder={"搜索"}
                            allowFontScaling={true}
                            onChangeText={(text) => {this.handleChange(text)}}
                            value = {this.state.text}
                        />
                        {this.state.showX ? 
                            <TouchableOpacity style={{height: "100%",flex: 1,alignItems: "center"}} onPress={() => {this.setState({text: ""}, ()=>this.handleChange(this.state.text))}}>
                                <Feather name={'x'} size={16} style={{ color: 'rgba(148, 148, 148, .8)',lineHeight: 35}} />
                            </TouchableOpacity>
                            : null
                        }
                    </View>
                </View>
                <View style={{backgroundColor: '#fff'}}>
                    <View style={{paddingLeft: 15,paddingRight: 15}}>
                            <FlatList
                            data={this.state.dataSource}
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
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#F4F4F8',
    },
    
    topBar:{
        width,
        height: 54,
        backgroundColor: "white",
        borderBottomColor: "#E1E1E1",
        borderBottomWidth: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    barInput:{
        height: 35,
        paddingLeft: 10,
        width: width-20,
        borderRadius: 5,
        backgroundColor: "#F6F8FA",
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    headerView: {
        height: 40,
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginBottom: 10
    },
    setTime: {
        flexDirection: "row",
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10
    },
    footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 20,
        paddingBottom: 20
    },
    
});
