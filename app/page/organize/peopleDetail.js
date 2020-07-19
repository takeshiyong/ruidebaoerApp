import React, { Component } from 'react';
import { StyleSheet, Text, View,FlatList,RefreshControl, Dimensions,Linking,ActivityIndicator, TouchableOpacity, ScrollView, Image, TextInput} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import Header from '../../components/header';
import Integral from '../../service/integralServer';
import userService from '../../service/userService';
import Toast from '../../components/toast';
import { parseDate } from '../../utils/handlePhoto';

const {width, height} = Dimensions.get('window');
class PeopleDetail extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    constructor(props) {
      super(props);
      this.state = {
        type: 0,
        obj: [{fId: 0, fName: '基本信息'},{fId: 1, fName: '职责'},{fId: 2, fName: '积分'},{fId: 3, fName: '培训情况'}],
        allNum: 0,
        item: {},
        dataSource: [],
        isRefresh: false,
        canLoadMore: true,
        loadingMore: false,
        pageCurrent: 1,
        pageSize: 10,
        detailItem: {}
      }
    }
    componentDidMount() {
      SplashScreen.hide();
      this.setState({
        item: this.props.navigation.state.params.item
      }, () => {
        this.getUserDetail();
      })
    }

    // 获取用户详细信息
    getUserDetail = async () => {
      const res = await userService.selectPeopleDetailById(this.state.item.fId);
      if (res.success) {
        console.log('res', res)
        this.setState({
          detailItem: res.obj
        }, () => {
          this.fetchTroubleData();
        });
      } else {
        Toast.show(res.msg);
      }
    }

    // 查询隐患数据
    fetchTroubleData = async () => {
      const { pageCurrent, pageSize, dataSource } = this.state;
      if (pageCurrent == 1) {
          this.setState({refreshing: true});
      }
      const res = await Integral.getIntegralRules({
        userId: this.state.detailItem.fUserId,
        pageSize,
        pageCurrent: pageCurrent
      });
      this.setState({refreshing: false, loadingMore: false})
      if (res.success) {
        let dataArr = [];
        if (pageCurrent == 1) {
            // 如果当前页是第一页则直接拿传过来的数据
            dataArr = res.obj.pageRes.items;
        } else {
            // 如果当前页不是第一页则需要拼接
            dataArr = dataSource.concat(res.obj.pageRes.items);
        }
        // 判断是否可以加载更多
        let canLoadMore = true;
        if (dataArr.length >= res.obj.pageRes.itemTotal) {
            canLoadMore = false;
        }
        this.setState({
            dataSource: dataArr,
            canLoadMore: canLoadMore
        });
      } else {
        // Toast.show(res.msg);
      }
    }

    _onRefresh = () => {
      this.setState({
        pageCurrent: 1
      }, ()=>{
        this.fetchTroubleData();
      })
    }

    // 渲染基本信息
    renderInfo = () => {
      const { detailItem } = this.state;
      return (
        <View style={styles.contentView}>
          
          <View style={styles.items}>
            <Text style={{color: '#A4A4A4',fontSize: 12}}>姓名</Text>
            <Text style={{color: '#333'}}>{detailItem.fUserName || '--'}</Text>
          </View>
          <View style={[styles.items, {flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center'}]}>
            <View>
              <Text style={{color: '#A4A4A4',fontSize: 12}}>电话</Text>
              <Text style={{color: '#333'}}>{detailItem.fPhone || '--'}</Text>
            </View>
            <TouchableOpacity onPress={()=>{
                if (!detailItem.fPhone) return;
                Linking.openURL(`tel:${detailItem.fPhone}`);
              }}>
              <FontAwesome5 name="phone" color="#68B6FD" size={18}/>
            </TouchableOpacity>
          </View>
          <View style={styles.items}>
            <Text style={{color: '#A4A4A4',fontSize: 12}}>邮箱</Text>
            <Text style={{color: '#333'}}>{detailItem.fEmali || '--'}</Text>
          </View>
          <View style={styles.items}>
            <Text style={{color: '#A4A4A4',fontSize: 12}}>生日</Text>
            <Text style={{color: '#333'}}>{detailItem.fBirthday || '--'}</Text>
          </View>
          <View style={styles.items}>
            <Text style={{color: '#A4A4A4',fontSize: 12}}>部门</Text>
            <Text style={{color: '#333'}}>{detailItem.fDepName || '--'}</Text>
          </View>
          <View style={styles.items}>
            <Text style={{color: '#A4A4A4',fontSize: 12}}>职位</Text>
            <Text style={{color: '#333'}}>{detailItem.fDepName?detailItem.fDepName+'-':''}{detailItem.fPositionName}</Text>
          </View>
        </View> 
      )
    }

    // 加载更多时脚部组件
    footerComponent = () => {
      const { loadingMore, dataSource, canLoadMore } = this.state;
      if (dataSource.length == 0) {
          return null;
      }
      let moreText = '上拉加载更多数据';
      if (loadingMore) {
          moreText = '正在加载更多数据'
      } else {
          if (!canLoadMore) {
              moreText = '暂无更多数据' 
          }
      }
      return (
          <View style={styles.footerView}>
              {loadingMore ? <ActivityIndicator color="#000"/> : null}
              <Text style={{ color: '#999' }}>
                  {moreText}
              </Text>
          </View>
      )
  }
   // 加载更多
   loadMore = () => {
      const { refreshing, loadingMore, canLoadMore, pageCurrent} = this.state;
      // 当正在刷新 正在加载更多 不能加载更多的时候不能 触发加载更多
      if (refreshing || loadingMore || !canLoadMore) {
          return;
      }
      this.setState({
          loadingMore: true,
          pageCurrent: pageCurrent + 1
      }, () => this.fetchTroubleData())
    }

    // 积分明细
    renderIntegralDetail = () => {
      return (
        <View style={{width: "100%",backgroundColor: "#fff",paddingLeft: 16,paddingRight: 16,paddingBottom: 30}}>
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
              ListEmptyComponent={<Text style={{width, textAlign: 'center',marginTop: 10,color: '#c9c9c9', paddingBottom: 50}}>暂无数据</Text>}
              ListFooterComponent={this.footerComponent}
              onEndReached={this.loadMore}
              onEndReachedThreshold={0.1}
              ItemSeparatorComponent={()=>this._separator()}
            /> 
          </View>
      );
    }

    // 分割线
    _separator = () => {
      return <View style={{ height: 1, backgroundColor: '#F9F9F9' }} />;
    }

    renderItem = ({item}) => {
      return (
        <TouchableOpacity style={{height: 72,alignItems: "center",flexDirection: "row"}}>
            <Image style={{width:44,height: 44,marginLeft: 5,marginRight: 13}} source={require('../../image/verification/icon.png')}/>
            <View style={{flexDirection: 'row',justifyContent: "space-between",flex: 1,alignItems: "center"}}>
                <View>
                    <Text style={{color: "#333",fontSize: 14,fontWeight: "500"}}>{item.fName? item.fName: '--'}</Text>
                    <Text style={{color: "#999",fontSize: 12,marginTop: 10}}>{item.fAddTime? parseDate(item.fAddTime,'YYYY.MM.DD HH:mm'): '--'}</Text>
                </View>
                <Text style={{fontSize: 16,fontWeight: "600",color: item.fChangeType ? '#1ACFAA' : "#F56767"}}>{item.fChangeType ? '+' : "-"} {item.fIntegralNumber? item.fIntegralNumber: '0'}积分</Text>
            </View>
        </TouchableOpacity>
      )
    }

    render() {
      const { type } = this.state;
      console.log(this.state.item);
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText={this.state.item.fUserName}
                    hidePlus={false} 
                    props={this.props}
                />
                <View style={styles.navView}>
                  {
                    this.state.obj.map((data)=>{
                      return (
                        <TouchableOpacity 
                          style={[styles.navItem, type==data.fId?styles.navActive: {}]}
                          onPress={()=>this.setState({type: data.fId})}
                        >
                            <Text style={[styles.navText, type == data.fId ? styles.textActive : {}]}>{data.fName}</Text>
                        </TouchableOpacity>
                      );
                    })
                  } 
                </View>
                { this.state.type == 0 ? this.renderInfo() : null}
                { this.state.type == 1 ? null : null}
                { this.state.type == 2 ? this.renderIntegralDetail() : null}
                { this.state.type == 3 ? null : null}
                
            </View> 
        );
    }
}

const mapStateToProps = state => {
  return {
    troubleLevel: state.troubleReducer.troubleLevel
  }
}

export default connect(mapStateToProps)(PeopleDetail);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F6F6F6',
      display: "flex",
      alignItems: 'center',
    },
    navView: {
      width: '93%',
      marginTop: 10,
      flexDirection: 'row'
    },
    navItem: {
      flex: 1,
      height: 34,
      borderWidth: 1,
      borderColor: '#E7E7E7',
      backgroundColor: '#fff',
      borderRightWidth: 0,
      alignItems: 'center',
      justifyContent: 'center'
    },
    navText: {
      fontSize: 13,
      color: '#999'
    },
    navActive: {
      backgroundColor: '#455DFD',
      borderColor: '#455DFD',
    },
    textActive: {
      color: '#fff'
    },
    footerView: {
      alignItems: "center",
      justifyContent: 'center',
      marginTop: 10
    },
    contentView: {
      marginTop: 10,
      width: '93%',
      backgroundColor: '#fff',
      paddingRight: 10,
      paddingLeft: 10,
      paddingBottom: 15,
      borderRadius: 4
    },
    items: {
      paddingTop: 10,
      paddingBottom: 10,
      borderBottomColor: '#EEEEEE',
      borderBottomWidth: 1
    }
});
