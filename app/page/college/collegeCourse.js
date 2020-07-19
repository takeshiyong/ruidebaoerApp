import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ActivityIndicator,TextInput, Image, RefreshControl, FlatList } from 'react-native';
import Header from '../../components/header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CollegeServer from '../../service/collegeServer';
import config from '../../config/index';
import Toast from '../../components/toast';

const {width, height} = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
        text: "",
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
    }
    componentDidMount() {
        this.getSelectListByCondition()
    }
    toDetail = (id) => {      
        this.props.navigation.navigate('PhotographEdit', { id });
    }
    //分页查询课程信息
    getSelectListByCondition = async () => {
        this.setState({ refreshing: true });
      const res = await  CollegeServer.getSelectListByCon({
        fIsPublish: true,
        pageCurrent: this.state.currentPage,
        pageSize: this.state.pageSize
      })
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
    /**
     * 下啦刷新
     * 
     */
    
    _onRefresh = () => {
        // 不处于 下拉刷新
        if (!this.state.isRefresh) {
          this.getSelectListByCondition()
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
                this.getSelectListByCondition()
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
                <Text style={styles.imgTitleName} numberOfLines={2} ellipsizeMode="tail">{item.fCourseName ?item.fCourseName : '--'}</Text>
                <View>
                    <View style={{flexDirection: "row",alignItems: "center",marginBottom: 5}}>
                        <Image style={styles.desImg} source={require('../../image/collegeSort/bofangliang.png')}/>
                        <Text style={styles.desImgDes}>播放数量:{item.fCoursePlayTimes?item.fCoursePlayTimes: 0} 次</Text>
                    </View>
                    <View style={{flexDirection: "row",alignItems: "center"}}>
                        <Image style={styles.desImg} source={require('../../image/collegeSort/shichang.png')}/>
                        <Text style={styles.desImgDes}>课程时长:{item.allHourLong?item.allHourLong: 0} 分钟</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
        )
      }
    render() {
        const { pop } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="课程"
                    hidePlus={true} 
                    props={this.props}
                    isMine={true}
                />
                {/* <View style={styles.searchTop}>
                    <View style={styles.search}>
                        <AntDesign name={"search1"} style={{width: 12,height: 12,marginLeft: 18,marginRight: 11}}/>
                        <TextInput
                                style={{height: 40,flex: 1}}
                                onChangeText={(text) => this.setState({text})}
                                placeholder="搜索课程"
                                allowFontScaling= {true}
                        />
                    </View>
                    <TouchableOpacity style={{flexDirection: "row",alignItems: "center"}}>
                        <Image source={require("../../image/collegeCourse/select.png")} style={{width: 22,height: 22,marginRight: 4}}/>
                        <Text style={{fontSize: 12, color: "#999"}}>综合排序</Text>
                    </TouchableOpacity>
                </View> */}
                {/* <View style={styles.changeButton}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>更新时间</Text>
                        <Image source={require("../../image/collegeCourse/top.png")} style={styles.buttonImg}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>视频时长</Text>
                        <Image source={require("../../image/collegeCourse/center.png")} style={styles.buttonImg}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>播放次数</Text>
                        <Image source={require("../../image/collegeCourse/bottom.png")} style={styles.buttonImg}/>
                    </TouchableOpacity>
                </View> */}
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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        display: "flex"
    },
    searchTop: {
        width: "100%", 
        height: 44, 
        backgroundColor: "#fff",
        flexDirection: "row", 
        alignItems: "center",
        paddingLeft: 16,
        paddingRight: 16,
        justifyContent: "space-between"
    },
    search: {
        width: 246,
        height: 34,
        backgroundColor: "#F6F6F6", 
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 5
    },
    changeButton: {
        height: 58,
        backgroundColor: "#fff",
        width: "100%",
        borderColor: "#E0E0E0",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingLeft: 16,
        paddingRight: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    button: {
        width: (width-58)/3,
        height: 40,
        backgroundColor: "#E0E0E0",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    buttonText: {
        color: "#333",
        fontSize: 12,
        fontWeight: "500"
    },
    buttonImg: {
        width: 7,
        height: 13,
        marginLeft: 8,
    },
    courseItem: {
        marginTop: 15,
        display: "flex",
        flexDirection: "row",
        marginLeft: 16,
        width: "100%",
        paddingRight: 25,
        // alignItems: "center"
    },
    cItemImg: {
        width: 150,
        height: 94,
    },
    imgDes: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        height: 94,
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
    footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 20,
      }
});
