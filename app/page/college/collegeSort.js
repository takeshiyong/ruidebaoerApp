import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, ActivityIndicator,RefreshControl, FlatList} from 'react-native';
import Header from '../../components/header';
import CollegeServer from '../../service/collegeServer';
import { connect } from 'react-redux';
import { getSortname } from '../../store/thunk/systemVariable';
import config from '../../config/index';
import Toast from '../../components/toast';

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
    }
    componentDidMount() {
        this.props.dispatch(getSortname());
        this.getSelectListByCondition(this.props.courseSort.length !== 0 ? this.props.courseSort[this.state.current].fCourseTypeId: null);
        
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
        return (
            <TouchableOpacity style={styles.courseItem}  onPress={() => this.props.navigation.push('Course',{id: item.fCourseId})}>
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
      }
});
