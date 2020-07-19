import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Platform,Image, ActivityIndicator,RefreshControl, FlatList} from 'react-native';
import Header from '../../components/header';
import CollegeServer from '../../service/collegeServer';
import { connect } from 'react-redux';
import { getSortname } from '../../store/thunk/systemVariable';
import config from '../../config/index';
import Toast from '../../components/toast';
import AntDesign from 'react-native-vector-icons/AntDesign';

const isAndroid = Platform.OS === 'android';
const {width, height} = Dimensions.get('window');
export  class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
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
        chooseArr: [],
        chooseParam: []
    }
    componentDidMount() {
        this.props.dispatch(getSortname());
        this.getSelectListByCondition(this.props.courseSort.length !== 0 ? this.props.courseSort[this.state.current].fCourseTypeId: null);
        if (this.props.navigation.state && this.props.navigation.state.params.sourseList) {
            const {sourseList} = this.props.navigation.state.params
            this.setState({
                chooseArr: [...sourseList],
                chooseParam: sourseList.length > 0 ? sourseList.map((item) => item.fCourseId): []
            })
        }
    }
    pushValue = () => {
        const {goBack,state} = this.props.navigation;
        const { chooseArr } = this.state;
        state.params.getValue(chooseArr);
        goBack();
    }
    //分页查询课程信息
    getSelectListByCondition = async (id) => {
        global.loading.show();
        this.setState({ refreshing: true });
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

    toDetail = (id) => {      
        this.props.navigation.navigate('PhotographEdit', { id });
    }
    /**
     * 下啦刷新
     * 
     */
    
    _onRefresh = () => {
        // 不处于 下拉刷新
        if (!this.state.isRefresh) {
          this.getSelectListByCondition(this.props.courseSort.length !== 0 ? this.props.courseSort[this.state.current].fCourseTypeId: null)
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
                this.getSelectListByCondition(this.props.courseSort.length !== 0 ? this.props.courseSort[this.state.current].fCourseTypeId: null)
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
        console.log(this.state.chooseParam.includes(item.fCourseId),item.fCourseId,this.state.chooseParam)
        return (
            <TouchableOpacity style={styles.courseItem}  onPress={()=>this.markVideo(item)}>
            <View style={styles.bigView}>
                <View style={{width: 24,height: 24,borderRadius: 12,
                    backgroundColor: this.state.chooseParam.includes(item.fCourseId)? "#4058FD": "transparent",
                    zIndex: 999}}></View>
            </View>
            <Image style={styles.cItemImg} source={{uri: (config.imgUrl+item.fCourseCoverFile.fFileLocationUrl)}}/>
            <View style={styles.imgDes}>
                <Text style={styles.imgTitleName} numberOfLines={2} ellipsizeMode="tail">{item.fCourseName ? item.fCourseName : '--'}</Text>
                <View style={{justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row",alignItems: "center",marginBottom: 5}}>
                        <Image style={styles.desImg} source={require('../../image/collegeSort/bofangliang.png')}/>
                        <Text style={styles.desImgDes}>播放数量:{item.fCoursePlayTimes ? item.fCoursePlayTimes :0} 次</Text>
                    </View>
                    <View style={{flexDirection: "row",alignItems: "center"}}>
                        <Image style={styles.desImg} source={require('../../image/collegeSort/shichang.png')}/>
                        <Text style={styles.desImgDes}>课程时长:{item.allHourLong ? item.allHourLong : 0} 分钟</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
        )
      }
    // 选中视频
    markVideo = (data) => {
        const { chooseParam, chooseArr } = this.state;
        console.log(data.fCourseId,chooseParam);

        if(chooseParam.includes(data.fCourseId)){
            for(let index in chooseArr){
                if(chooseArr[index].fCourseId == data.fCourseId){
                    chooseArr.splice(index,1),
                    chooseParam.splice(index,1)
                    this.setState({
                        chooseArr,
                        chooseParam
                    })
                    return;
                }
            }
        }else{
            chooseArr.push({fCourseId: data.fCourseId, fCourseName: data.fCourseName,allHourLong: data.allHourLong});
            chooseParam.push(data.fCourseId)
            this.setState({
                chooseArr,
                chooseParam
            })
        }
        
        
    }
    render() {
        const { pop } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header
                    backBtn={true}
                    titleText="分类"
                    hidePlus={false}
                    props={this.props}
                    
                />
                <View style={{width: "100%",height: "100%"}}>
                        <View style={{flexDirection: "row",height: "100%"}}>
                            <View style={{backgroundColor: "#F6F6F6"}}>
                                <ScrollView>   
                                {this.props.courseSort.map((item, index) => {
                                    return <TouchableOpacity index={index} key={index} onPress={() => {this.setState({current: index},() => {this.getSelectListByCondition(this.props.courseSort.length !== 0 ? this.props.courseSort[index].fCourseTypeId: null)})}}>
                                        <View style={[styles.leftText,index == this.state.current ? {backgroundColor: '#fff'}:{color: "#F6F6F6"}]}>
                                            <Text style={[{height: 52, lineHeight: 52, fontSize: 14,color: "#333"} ,index == this.state.current ? { fontWeight: "600"}:{fontWeight: "400"}]}>{item.fCourseTypeName}</Text>
                                        </View>
                                    </TouchableOpacity>
                                })}
                                
                                </ScrollView> 
                            </View>
                        
                            <View style={{flex: 1,paddingBottom: 70}}>
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
                    <View style={styles.bottomView}>
                            <TouchableOpacity 
                                style={styles.rowStyles} 
                                onPress={()=>{
                                    if (this.state.chooseArr.length == 0) return;
                                    this.setState({showChoose: true})
                                }}
                            >
                                <Text style={{color: '#4058FD'}}>已选择: {this.state.chooseArr.length}个课程</Text>
                                <AntDesign name="up" color="#4058FD" size={14} style={{marginLeft: 5,marginTop: 3}}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sureBtn} onPress={this.pushValue}>
                                <Text style={{color: '#fff'}}>确定</Text>
                            </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => {
    return {
        courseSort: state.collegeReducer.courseSort
    }
  }
  export default connect(
    mapStateToProps,
  )(App);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        display: "flex"
    },
    leftText: {
        width: 90,
        paddingLeft: 5,
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center"
    },
    courseItem: {
        position: "relative",
        marginTop: 15,
        display: "flex",
        flexDirection: "row",
        paddingRight: 15,
        paddingBottom: 5,
        width: "100%",
    },
    cItemImg: {
        width: 120,
        height: 75,
        marginLeft: 12
    },
    imgDes: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        marginLeft: 12,
        justifyContent: "space-between"
    },
    imgTitleName: {
        color: "#333333",
        fontSize: 14,
        lineHeight: 16,
        width: "100%",
        flexWrap: "wrap"
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
    footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 10,
        paddingBottom: 10
      },
    bottomView: {
        height: 50,
        width: '100%',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#D6D6D6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 20,
        paddingLeft: 20,
        position: "absolute",
        bottom: isAndroid ? 70 : (isIphoneX() ? 145 : 100),
        left: 0
    },
    rowStyles: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    sureBtn: {
        width: 70,
        height: 32,
        borderRadius: 4,
        backgroundColor: '#4058FD',
        alignItems: 'center',
        justifyContent:'center'
    },
    bigView: {
        width: 30,
        height: 30,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        position: "absolute",
        left: 20,
        top: 10,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999
    }
});
