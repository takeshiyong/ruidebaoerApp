import React, { Component } from 'react';
import { StyleSheet, BackHandler, Text, View, TouchableOpacity, Dimensions, TouchableHighlight,Linking, Platform, StatusBar, ImageBackground, Image, ScrollView,RefreshControl, FlatList, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import Orientation from "react-native-orientation";
import {sH, sW, sT, barHeight, navHeight,isIphoneX} from '../../utils/screen';
import Header from '../../components/header';
import CollegeServer from '../../service/collegeServer';
import config from '../../config/index';
import VideoPlayer from '../../components/VideoPlay/VideoPlayer';
import Toast from '../../components/toast';
import { parseDate } from '../../utils/handlePhoto'; 


const navStyle = navHeight();
const isAndroid = Platform.OS === 'android';
const {width, height} = Dimensions.get('window');
export  class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null,
    });
    state = {
        showMenu: false,
        manage:["简介","目录","相关课程"],
        current: 0,
        currentPage: 1,
        // 列表数据结构
        dataSource: [],
        // 下拉刷新
        isRefresh: false,
        // 加载更多
        isLoadMore: false,
        pageSize: 10,
        // 控制foot  1：正在加载   2 ：无更多数据
        showFoot: 1,
        obj: {},
        courseware: [],
        path: '',
        showVideo: false,
        volume: 1,
        muted: false,
        paused: true,
        currentTime: 0.0,
        duration: 0.0,
 		id: '',
        key: 0,
        isFullScreen: false,
        barTitle: '',
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this._backButtonPress);
    }

    componentDidMount() {
        this.getSelectDetails()
        console.log(this.props.navigation.state.params);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this._backButtonPress);
        clearInterval(this.timer);
    }
    /**
     * 下啦刷新
     * 
     */
    
    _onRefresh = () => {
        // 不处于 下拉刷新
        if (!this.state.isRefresh) {
          this.getSelectListByCondition(this.state.id)
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
                this.getSelectListByCondition(this.state.id)
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
        return <View style={{ height: 1, backgroundColor: '#fff' }} />;
    }
    renderItem = ({item}) => {
        return (
            <TouchableOpacity style={styles.courseItem}  onPress={() => this.props.navigation.push('Course',{id: item.fCourseId})}>
            <Image style={styles.cItemImg} source={{uri: (config.imgUrl+item.fCourseCoverFile.fFileLocationUrl)}}/>
            <View style={styles.imgDes}>
                <Text style={styles.imgTitleName} numberOfLines={2} ellipsizeMode="tail">{item.fCourseName ? item.fCourseName : '--'}</Text>
                <View >
                    <View style={{flexDirection: "row",alignItems: "center",marginBottom: 9}}>
                        <Image style={styles.desImg} source={require('../../image/collegeSort/bofangliang.png')}/>
                        <Text style={styles.desImgDes}>播放数量:{item.fCoursePlayTimes? item.fCoursePlayTimes : 0}次</Text>
                    </View>
                    <View style={{flexDirection: "row",alignItems: "center"}}>
                        <Image style={styles.desImg} source={require('../../image/collegeSort/shichang.png')}/>
                        <Text style={styles.desImgDes}>课程时长:{item.allHourLong? item.allHourLong : 0} 分钟</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
        )
      }
    toDetail = (id) => {      
        this.props.navigation.navigate('PhotographEdit', { id });
    }
    //分页查询课程信息
    getSelectListByCondition = async (id) => {
        this.setState({ refreshing: true });
        global.loading.show();
      const res = await  CollegeServer.getSelectListByCon({
        fIsPublish: true,
        fCourseTypeId: id,
        pageCurrent: this.state.currentPage,
        pageSize: this.state.pageSize
      })
      global.loading.hide();
      this.setState({ refreshing: false });
      if(res.success){
        this.setState({
            dataSource: res.obj.items
        })
        if (this.state.pageSize >= res.obj.itemTotal) {
            this.setState({
                showFoot: 2
            })
        }
      }else{
          console.log('分页查询课程',res.msg)
        Toast.show(res.msg);
      }
    }
    //获取页面详情
    getSelectDetails = async () => {
        global.loading.show();
        const res  = await CollegeServer.getSelectDetails(this.props.navigation.state.params.id);
        global.loading.hide();
        if(res.success){
            this.setState({
                obj: res.obj,
                courseware: res.obj.tChapterManagementDetailsList,
                path: config.imgUrl+res.obj.fCourseCoverFile.fFileLocationUrl,
                id : res.obj.fCourseTypeId,
                barTitle: res.obj.fCourseName
            },() => {
                this.getSelectListByCondition(this.state.id)
            })
        }else{
            console.log('获取页面详情',res.msg)
            Toast.show(res.msg);
          }
    }
    //点击传递文件路径
    openCoursewareFile = async (item,id,type,index,index1) => {
        const { courseware } = this.state
        if(item.fCoursewareOpenType === 0){
            this.timer = setTimeout(()=>{
                this.learnCourseWare(this.props.navigation.state.params.id,id,this.props.navigation.state.params.fTrainId?this.props.navigation.state.params.fTrainId:null)
            }, 180000);
        }
        if(courseware[index1].tCoursewareManagementDetailsList[index].file == null){
            global.loading.show();
            let res = await CollegeServer.openCoursewareFile(id)
            global.loading.hide();
                if(res.success) {
                    if(type !== 0){
                        courseware[index1].tCoursewareManagementDetailsList[index].file = res.obj
                        this.setState({
                            courseware: courseware
                        })
                    }else{
                        for(let i = 0; i< courseware.length; i++){
                            for(let j = 0;j< courseware[i].tCoursewareManagementDetailsList.length; j++){
                                courseware[i].tCoursewareManagementDetailsList[j].changeColor = false
                            }
                        }
                        courseware[index1].tCoursewareManagementDetailsList[index].changeColor = true
                        this.setState({
                            path: config.imgUrl+res.obj[0].fFileLocationUrl,
                            showVideo: true,
                            paused: false,
                            key: this.state.key+1,
                            courseware: courseware
                        })
                    }
                }else{
                    Toast.show(res.msg);
                    console.log("传递文件路径:",res.msg)
                } 
        }else{
            return null
        }
    }
    //学习课件
    learnCourseWare = async (courseId,coursewareId,trainPlanId) => {
        const res = await CollegeServer.learnCourseWare({
            "courseId": courseId,
            "coursewareId": coursewareId,
            "trainPlanId": trainPlanId
        })
        if(res.success){
            Toast.show(res.msg);
        }else{
            Toast.show(res.msg);
            console.log('学习课件',res.msg)
        }
    }
    //简介组件
    synopsisConponents = (obj) => {
        return (
            <View style={{paddingLeft: 16,paddingRight: 16,backgroundColor: "#fff"}}>
                <View style={{width: "100%",borderBottomColor: "#E0E0E0",borderBottomWidth: 1,}}>
                    <View style={{flexDirection: "row",marginTop: 20}}>
                        <Text style={{fontSize: 16, color: "#333", fontWeight: "600"}} numberOfLines={2} ellipsizeMode="tail">{obj.fCourseName? obj.fCourseName : '--'}</Text>
                    </View>
                    <View style={{flexDirection: "row",marginTop: 5}}>
                    {obj.fLabelList ? 
                        obj.fLabelList.map((item) => {
                            return <View style={styles.topTitle}>
                                        <Image style={{width: 12, height: 12,marginRight: 4,marginLeft: 3,}} source={require('../../image/Course/fire.png')}/>
                                        <Text style={{color: "#4058FD", fontSize: 10}}>{item.fLabelName ? item.fLabelName : '-'}</Text>
                                    </View>
                        }) :null
                    }
                        
                    </View>
                    <View style={{flexDirection: "row", alignItems: "center",marginTop: 5,paddingBottom: 5}}>
                        <Image style={{width: 16, height: 12,marginRight: 10}} source={require('../../image/Course/bofangliang.png')}/>
                        <Text style={styles.miText}>{obj.fCoursePlayTimes ? obj.fCoursePlayTimes: 0}次</Text>
                        <Image style={{width: 12, height: 12,marginRight: 10}} source={require('../../image/Course/shichang.png')}/>
                        <Text style={styles.miText}>{obj.allHourLong?obj.allHourLong:0}分</Text>
                        {obj.fCreateTime ? <Text style={styles.miText}>
                            创建时间  { parseDate(obj.fCreateTime, 'YYYY-MM-DD') }
                        </Text>: null}
                    </View>
                </View>
                <View style={{width: "100%"}}>
                    <Text style={{width: "100%",flexWrap: "wrap", fontSize: 14,color: "#666",lineHeight: 16,marginTop: 5, paddingTop: 15, paddingBottom: 15}}>
                        {obj.fCourseProfiles ? obj.fCourseProfiles : "无更多介绍"}
                    </Text>
                </View>
            </View>
        )
    }
    downFile = (path) => {
        console.log(path)
        this.learnCourseWare(this.props.navigation.state.params.id,path.fServiceId,this.props.navigation.state.params.fTrainId?this.props.navigation.state.params.fTrainId:null)
        Linking.openURL(config.imgUrl + path.fFileLocationUrl).catch(err => console.error('An error occurred', err));
    }
    //目录组件
    catalogConponents = () => {
        let obj = this.state.courseware;
        
        return (<View style={{paddingLeft: 16,paddingRight: 16,backgroundColor: "#fff",paddingBottom: 5,}}>
                    <View style={{flexDirection: "row",alignItems: "center",borderBottomColor: '#E0E0E0',borderBottomWidth: 1,paddingTop: 18,paddingBottom: 18}}>
                        <Text style={{marginRight: 13,color: '#999'}}>课件</Text>
                        <Image style={styles.smallImg} source={require('../../image/Course/folder.png')}/>
                        <Text style={{marginRight: 18,color: '#999'}}>视频</Text>
                        <Image style={styles.smallImg} source={require('../../image/Course/hangou.png')}/>
                        <Text style={{color: '#999'}}>文档</Text>
                    </View>
                    {obj.length !== 0 ? obj.map((item,index1) => {
                        return (
                                <View style={{marginTop: 17}}>
                                    <View style={{marginBottom: 8}}>
                                        <TouchableOpacity style={[styles.itemTitle,{height:40}]} onPress={() => {this.showCourseware(index1)}}>
                                            <Text style={[styles.middleTitle,{marginLeft: 16}]}>{item.fChapterTitle}</Text> 
                                            <Image style={{width: 24,height: 24,marginRight: 10}} source={item.display ? require('../../image/Course/top.png') : (item.tCoursewareManagementDetailsList.length !== 0 ? require('../../image/Course/bottom.png') : require('../../image/Course/top.png'))}/>
                                        </TouchableOpacity>
 
                                        {item.display ? item.tCoursewareManagementDetailsList.map((item,index) => {
                                            return  (  <View>
                                                    <View style={styles.titleBar}>
                                                        <Image style={styles.smallImg} source={item.fCoursewareOpenType == 0?require('../../image/Course/hangou.png'): require('../../image/Course/folder.png')}/>
                                                        <View style={{width: "100%",paddingLeft: 10,}}>
                                                            <TouchableOpacity index={index} onPress={() => {this.openCoursewareFile(item,item.fCoursewareId,item.fCoursewareOpenType,index,index1)}}> 
                                                                <Text style={[styles.middleTitle,item.changeColor ? {color: "#4058FD"}: {color: "#333"}]}>{item.fCoursewareTitle}</Text>
                                                                <Text style={{color: "#999", fontSize: 12,marginTop: 10}}>{item.fCoursewareOpenType == 0 ? (item.fCoursewareHourLong+'分钟'): ''}</Text>
                                                            </TouchableOpacity>
                                                                <View style={{paddingRight: 26}}>
                                                                    {item.file ? item.file.map((item) => {
                                                                        return (<TouchableOpacity style={[styles.itemTitle,{marginTop: 5}]} onPress = {() => {this.downFile(item)}}>
                                                                                <Text style={[styles.middleTitle,{width:230,marginLeft: 5}]}>{item.fFileName}</Text>
                                                                                <Text style={{marginRight: 10}}>下载</Text>
                                                                            </TouchableOpacity>);
                                                                    }) : null}
                                                                </View>
                                                        </View>
                                                    </View>
                                                </View>)
                                            }): null}
                                    </View>
                                </View>)
                    }) 
                    :
                    <Text style = {styles.catalogBottom}>没有更多数据了</Text>
                    }
             </View>)
    }
    //设置课件隐藏
    showCourseware = (index) => {
        let courseware = this.state.courseware;
        if( this.state.courseware[index].display ){
            courseware[index].display = !courseware[index].display
        }else{
            courseware[index].display = true
        }
        this.setState({
            courseware: courseware
        })
    }
    aboutConponents = (obj) => {
        return <View style={{paddingLeft: 16,paddingRight: 16,paddingBottom: 10,paddingTop: 5,backgroundColor: "#fff"}}>
                    <View style={{flex: 1,paddingBottom: 20}}>
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
    }
    onLoadStart = () => {
        global.loading.show();
    }
    //视频加载时调用
    onLoad = (data) => {
        this.setState({duration: data.duration});
        if(this.state.currentTime < 0){
           console.log(222)
        }else{
            console.log(333)
        }
    }
    //获取当前时间
    getCurrentTimePercentage() {
        if (this.state.currentTime > 0) {
            global.loading.hide();
            return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
        }else{

        }
        return 0;
    };
    //结束后回调
    onEnd = () => {
        this.setState({paused: true});
        this.video.seek(0)
    };
    //视频播放过程中每个间隔进度单位调用的回调函数
    onProgress = (data) => {
        this.setState({currentTime: data.currentTime});
    };
    _onOrientationChanged = (isFullScreen) => {
        if (isFullScreen) {
            Orientation.lockToPortrait();
            this.setState({
                isFullScreen: false
            });
            this.videoPlayer.updateLayout(width, 221, false);
        } else {
            Orientation.lockToLandscapeRight();
            this.setState({
                isFullScreen: true
            });
            this.videoPlayer.updateLayout(height, (height * 9/16)-20, true);
        }
    };

    /// 处理安卓物理返回键，横屏时点击返回键回到竖屏，再次点击回到上个界面
    _backButtonPress = () => {
        if (this.state.isFullScreen) {
            Orientation.lockToPortrait();
            this.setState({
                isFullScreen: false
            });
            this.videoPlayer.updateLayout(width, 221, false);
        } else {
            this.props.navigation.goBack();
        }
        return true;
    };

    onTapBackButton = () => {
        Orientation.lockToPortrait();
        this.setState({
            isFullScreen: false
        });
        this.videoPlayer.updateLayout(width, 221, false);
    }
    
    render() {
        const { pop } = this.props.navigation;
        const { isFullScreen } = this.state;
        return (
            <View style={styles.container}>
                { isFullScreen ? null :
                <Header 
                    backBtn={true} 
                    titleText={this.state.barTitle}
                    hidePlus={false} 
                    props={this.props}
                    onRefresh = {() => {this.props.navigation.state.params.fTrainId? this.props.navigation.state.params.onRefresh(this.props.navigation.state.params.fTrainId): null}}
                    /> 
                }
                <View ref={ref=> this.viewSize = ref} style={[styles.video, isFullScreen ? { width: height, height: width}: {}]}>
                    <View style={{width: "100%"}}>
                        {
                            this.state.showVideo?
                            <VideoPlayer onTapBackButton={this.onTapBackButton} ref={(ref) => this.videoPlayer = ref} key={this.state.key} videoURL={this.state.path} onChangeOrientation={this._onOrientationChanged} /> : 
                            <Image source={{uri: this.state.path}} style={{width: "100%",  height: 221}}/>
                        }
                    </View>
                </View>
                {
                    isFullScreen ? null :
                    <View style={styles.changeBar}>
                        {this.state.manage.map((item,index) => {
                            return <TouchableOpacity index={index} onPress={() => {this.setState({current: index})} }>
                                <View style={[styles.barView,index == this.state.current ? {borderBottomColor: "#4058FD"}:{borderBottomColor: "#fff"}]}>
                                    <Text style={[styles.barText,index == this.state.current ? {color: "#333"}:{color: "#999"}]}>{item}</Text>
                                </View>
                            </TouchableOpacity>
                        })}
                    </View>
                }
                {
                    isFullScreen ? null : 
                    <ScrollView>   
                        {this.state.current == 0 ? 
                        this.synopsisConponents(this.state.obj): null}
                        {this.state.current == 1 ? 
                        this.catalogConponents(): null}
                        {this.state.current == 2 ? 
                        this.aboutConponents(this.state.obj): null}
                    </ScrollView>
                }
            </View>
        );
    }
}
const mapStateToProps = state => {
    return {
        courseSort: state.collegeReducer.courseSort
    }
  }
export default connect(mapStateToProps)(App);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        display: "flex"
    },
    video: {
        width: "100%",
        backgroundColor: "#8A8A8A"
    },
    headers: {
        paddingTop: isAndroid ? StatusBar.currentHeight : navStyle.paddingTop,
        borderTopWidth: 2,
        height: isAndroid ? navStyle.height : (isIphoneX() ? navStyle.height+50 : navStyle.height+20),
        display: 'flex',
        flexDirection: "row",
        width,
        justifyContent: 'space-between',
        alignItems: 'center',


    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
  
      },
    changeBar:{
        paddingLeft: 39, 
        paddingRight: 39,
        height: 43, 
        width: "100%",
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1,
        
    },
    barView: {
       borderBottomColor: "#fff",
       borderBottomWidth: 1
    },
    barText: {
        lineHeight: 44,
        paddingRight: 15,
        paddingLeft: 15,
        fontSize: 14
    },
    miText: {
        fontSize: 12,
        color: "#999",
        marginRight: 18
    },
    topTitle:{
        width: 74, 
        height: 20,
        backgroundColor: "#F6F6F6", 
        flexDirection: "row",
        borderRadius: 8, 
        alignItems: "center",
        marginRight: 12,
        justifyContent: 'center'
    },
    courseItem: {
        marginTop: 15,
        display: "flex",
        flexDirection: "row",
        width: "100%",
        // alignItems: "center"
    },
    cItemImg: {
        width: 150,
        height: 94,
    },
    imgDes: {
        display: "flex",
        flex:1,
        height: 94,
        flexDirection: "column",
        marginLeft: 12,
        justifyContent: "space-between"
    },
    imgTitleName: {
        color: "#333333",
        width: "100%",
        fontSize: 14,
        lineHeight: 23,
        flexWrap: 'wrap',
    },
    desImg: {
        width: 12,
        height: 12,
        marginRight:8
    },
    desImgDes: {
        fontSize: 10,
        color: "#999"
    },
    //catalog
    catalogText: {
        fontSize: 12,
        marginRight: 19,
        color: "#999"
    },
    smallImg: {
        width: 16,
        height: 16,
        marginRight: 8
    },
    middleTitle: {
        color: "#333333", 
        fontSize: 14, 
        fontWeight: "500",
    },
    itemTitle:{
        width: "100%",
        backgroundColor: "#F6F6F6", 
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 5,
        alignItems: "center",
        flexDirection: "row", 
        justifyContent: "space-between"
    },
    footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 20,
      },
    progress: {
        flex:1,
        flexDirection: 'row',
        borderRadius: 3,
        overflow: 'hidden',
    },
    innerProgressCompleted: {
        height: 20,
        backgroundColor: '#cccccc',
    },
    innerProgressRemaining: {
        height: 20,
        backgroundColor: '#2C2C2C',
    },
    titleBar: {
        paddingTop: 16,
        paddingBottom: 14,
        paddingLeft: 17, 
        flexDirection: "row",
        width:"100%"
    },
    catalogBottom: {
        width: width,
        height: 20,
        alignContent:"center",
        justifyContent:"center",
        textAlign: "center",
        marginLeft: -20,
        marginTop: 5
    }
});
