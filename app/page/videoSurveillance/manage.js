import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity,TextInput,ActivityIndicator, ScrollView,Image, FlatList,RefreshControl} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import SplashScreen from 'react-native-splash-screen';
import Header from '../../components/header';
import Toast from '../../components/toast';
import { parseTime, parseDate } from '../../utils/handlePhoto';
import cameraServer from '../../service/cameraServer';
import config from '../../config/index';

const PAGESIZE = 10;
const {width, height} = Dimensions.get('window');
export default  class manage extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            showX: false,
            dataSource: [],
            videoSource: [],
            videoSearchSource: [],
            showPage: true,
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

    componentDidMount() {
      SplashScreen.hide();
      this.selectAreaTreeInfo('');
      this.displayresourcesexternally()
    }

    //大屏推送视频
    displayresourcesexternally = async () => {
        const { current, pageSize, currentPage } = this.state;
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: true,canLoadMore: true});
        } else {
            this.setState({ isLoadMore: true });
        }
        const res = await cameraServer.displayresourcesexternally({
            "currentPage": currentPage,
            "pageSize": pageSize
        })
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: false });
        } else {
            this.setState({ isLoadMore: false });
        }
        if (res.success) {
            this.setState({
                videoSource: res.obj.items
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
    //当值发生变换时
    handleChange = (text) => {
        console.log(text);
        if(text == ''){
            this.setState({
                showPage: true,
                showX: false,
                text: text,
                // currentPage: 1,
                pageSize: PAGESIZE,
            },() => {
                this.selectAreaTreeInfo('');
                this.displayresourcesexternally()
            })
        }else{
            this.setState({
                showPage: false,
                showX: true,
                text: text,
                pageSize: PAGESIZE,
            },() => {
                this.selectVideoInfoByName(text)
            })
        }
        
    }
    toNextPage = (item) => {
        if(item.fId == 1){
            this.props.navigation.navigate('MoreCameraList')
            return
        }
        if(item.fType == 2){
            this.props.navigation.navigate('VideoSecondList',{item:item})
        }else{
            this.props.navigation.navigate('VideoFirstList',{item:item})
        }
    }
    selectVideoInfoByName = async (fName) => {
        const res = await cameraServer.selectVideoInfoByName(fName)
        if(res.success){
            this.setState({
                videoSearchSource: res.obj
            },() => {console.log(this.state.videoSearchSource)})
        }else{
            console.log(res.msg)
        }
    }
    selectAreaTreeInfo = async (fName) => {
        const res = await cameraServer.selectAreaTreeInfo(fName)
        if(res.success){
            let dataSource = [];
            if(res.obj.length > 7){
                res.obj.slice(0,7).map((item) => {
                    dataSource.push(item)
                })
                dataSource.push({
                    fName: "更多",
                    fId: 1
                })
                this.setState({
                    dataSource
                })
            }else{
                this.setState({
                    dataSource: res.obj
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
        },() => {
            this.displayresourcesexternally()
        })
    };
      /**
     * 加载更多
     * @private
     */
    _onLoadMore() {
        // 不处于正在加载更多 && 有下拉刷新过，因为没数据的时候 会触发加载
        if (!this.state.isLoadMore && this.state.videoSource.length > 0 && this.state.canLoadMore) {
            this.setState({
                pageSize: this.state.pageSize + 10
            }, () => {
                this.displayresourcesexternally()
            })
  
        }
    } 
      /**
       * 创建尾部布局
       */
    _createListFooter = () => {
        const { isLoadMore, videoSource, canLoadMore } = this.state;
        
        let moreText = '下拉加载更多数据';
        if (isLoadMore) {
            moreText = '正在加载更多数据'
        } else {
            if (!canLoadMore) {
                moreText = '暂无更多数据' 
            }
        }
        if (videoSource.length == 0) {
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
        return(<View>
        <View style={styles.cameraBox}>
            {
                this.state.dataSource.length > 0 ?
                    this.state.dataSource.map((item,index) => {
                        return(<TouchableOpacity style={[styles.cameraItem,{marginBottom: this.state.dataSource.length >4 ? 10: 0}]} onPress={() => {this.toNextPage(item)}}>
                            <Image style={{width: 44,height: 44}} source={index == 7 ? require('../../image/videoSurveillance/more.png') :require('../../image/videoSurveillance/camera.png')}/>
                            <Text style={{fontSize: 14,color: "#333"}}>{item.fName?item.fName:'--'}</Text>
                        </TouchableOpacity>)
                    }): <Text style={{width,height: 30,textAlign: "center",alignContent: "center",color: "#999"}}>无摄像头</Text>
            }
        </View>
        <Text style={{padding: 15,color: "#333",fontSize: 16,fontWeight: "500"}}>大屏推送视频</Text>
        </View>)
    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#F9F9F9',width: "100%"}} />;
    }
    renderItem = ({item,index}) => {
        return (
            <TouchableOpacity style={[styles.videoBox,{marginLeft: 15}]} onPress={() => {this.props.navigation.navigate('Live',{fChannel:item.fChannel})}}>
                <Image style={{width: "100%",height: 93,backgroundColor: "#EBEBEB"}} source={{uri: config.cameraImg+item.fChannel}}/>
                <View style={styles.videoBoxBottom}>
                    <Text>{item.fName != null?item.fName: '--'}</Text>
                    {/* <View style={[styles.currentState,{backgroundColor: item.fEnable? "#227D51"  :"#E0E0E0"}]}></View> */}
                </View>
            </TouchableOpacity>
    )}
    render() {
        const { pop } = this.props.navigation;
        const { selectDep } = this.state;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="视频监控"
                    hidePlus={true} 
                />
                <View style={[styles.topBar, this.state.showX ? {borderBottomWidth: 0} : {}]}>
                    <View style={styles.barInput}>
                        <Feather name={'search'} size={14} style={{ color: '#696A6C', lineHeight: 30,marginRight: 5}} />
                        <TextInput  
                            style={{padding: 0,width: "100%", height: "100%", flex: 9, fontSize: 14,color: '#5D6A76'}}
                            placeholder={"搜索摄像头名称"}
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
                {
                this.state.showPage?
                    <FlatList
                        data={this.state.videoSource}
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
                : null}
                {
                    !this.state.showPage?
                    <View style={{paddingTop: 10}}>
                        <View style={styles.videoBoxs}>
                            {
                                this.state.videoSearchSource.length > 0 ?this.state.videoSearchSource.map((item) => {
                                    return(<TouchableOpacity style={styles.videoBox} onPress={() => {this.props.navigation.navigate('Live',{fChannel:item.fChannel})}}>
                                                <Image style={{width: "100%",height: 93,backgroundColor: "#EBEBEB"}} source={{uri: config.cameraImg+item.fChannel}}/>
                                                <View style={styles.videoBoxBottom}>
                                                    <Text>{item.fName?item.fName: '--'}</Text>
                                                    <View style={[styles.currentState,{backgroundColor: item.fEnable? "#227D51"  :"#E0E0E0"}]}></View>
                                                </View>
                                            </TouchableOpacity>)
                                        }): <Text style={{width,height: 30,textAlign: "center",alignContent: "center",color: "#999"}}>暂无数据</Text>
                            }
                            
                        </View>
                    </View>
                    : null
                }
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
    cameraBox: {
        width,
        backgroundColor: '#fff',
        padding: 15,
        flexDirection: "row",
        flexWrap: "wrap"
    },
    cameraItem: {
        width: (width-30)/4,
        alignItems: "center",
        
    },
    videoBox: {
        width: (width-43)/2,
        height: 141,
        marginBottom: 15
    },
    currentState:{
        backgroundColor: "#E0E0E0",
        width: 8,
        height: 8,
        borderRadius: 4
    },
    videoBoxBottom: {
        width: "100%",
        height: 48,
        alignItems: "center",
        paddingLeft: 12,
        paddingRight: 12,
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    videoBoxs: {
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
        paddingLeft: 15,
        paddingRight: 15
    },
    footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 20,
        paddingBottom: 10
    },
});
