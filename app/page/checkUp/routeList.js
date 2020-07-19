import React, { Component } from 'react';
import { StyleSheet,ScrollView, Text, View, Dimensions, TouchableOpacity, FlatList,Image,RefreshControl,ActivityIndicator,ImageBackground} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {ECharts} from 'react-native-echarts-wrapper';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';

import config from '../../config';
import deviceServer from '../../service/deviceServer';
import Header from '../../components/header';
import Toast from '../../components/toast';
const { width, height } = Dimensions.get('window');
class RouteList extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
      dataSource: [],
      refreshing: false,
      loadingMore: false,
      canLoadMore: false,
      pageCurrent: 1,
      pageSize: 10
    }

    componentDidMount() {
      SplashScreen.hide();
      this.getCheckUpList();
    }

    // 刷新列表数据
    onRefresh = () => {
      this.setState({ pageCurrent: 1 }, ()=>this.getCheckUpList());
    } 
    
    // 获取巡检路线数据
    getCheckUpList = async () => {
      const { pageCurrent, pageSize, refreshing} = this.state;
      if (pageCurrent == 1) {
        this.setState({refreshing: true});
      }
      const res = await deviceServer.getCheckUpList({
        pageSize,
        pageCurrent,
        orderParams: [{
          orderEnum: "DESC",
          paramEnum: "UPDATE_TIME"
        }]
      });
      if (res.success) { 
        if (pageCurrent == 1) {
          this.setState({refreshing: false});
        } else {
          this.setState({loadingMore: false});
        }
        let dataArr = [];
        if (pageCurrent == 1) {
            // 如果当前页是第一页则直接拿传过来的数据
            dataArr = res.obj.items;
        } else {
            // 如果当前页不是第一页则需要拼接
            dataArr = dataSource.concat(res.obj.items);
        }
        // 判断是否可以加载更多
        let canLoadMore = true;
        if (dataArr.length >= res.obj.itemTotal) {
            canLoadMore = false;
        }
        this.setState({
            dataSource: dataArr,
            canLoadMore: canLoadMore
        });
      } else {
        Toast.show(res.msg);
      }
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

  renderItem = ({item}) => {
    return (
      <TouchableOpacity style={styles.luxianView} onPress={()=>this.props.navigation.push('RouteDetail', {item, onRefresh: this.onRefresh})}>
        <View style={styles.rowView}>
          <View style={{width: 5,height: 5,borderRadius: 50,backgroundColor: '#4B74FF'}}/>
          <Text style={{color: '#333',marginLeft: 5}}>{item.fPatrolRouteName}</Text>
        </View>
        <View style={[styles.rowView, {flex: 1}]}>
          <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
            <Text style={{color: '#666',fontWeight: 'bold',fontSize: 16}}>{item.allEquipmentNum}</Text>
            <Text style={{color: '#999', marginTop: 5,fontSize: 12}}>设备</Text>
          </View>
          <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
            <Text style={{color: '#666',fontWeight: 'bold',fontSize: 16}}>{item.allCheckNum}</Text>
            <Text style={{color: '#999', marginTop: 5,fontSize: 12}}>测项</Text>
          </View>
          <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
            <Text style={{color: '#666',fontWeight: 'bold',fontSize: 16}}>{item.patrolCountNum}</Text>
            <Text style={{color: '#999', marginTop: 5,fontSize: 12}}>已执(次)</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
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
    }, () => this.getCheckUpList())
  }

    render() {
      const { typeList } = this.state;
        return (
          <View style={styles.container}>
            <Header 
              titleText="巡检线路"
              backBtn={true}
            />
            <FlatList
              refreshControl={
                <RefreshControl
                    title={'Loading'}
                    colors={['#000']}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                />
              } 
              ListFooterComponent={this.footerComponent}
              refreshing={this.state.refreshing}
              data={this.state.dataSource}
              renderItem={this.renderItem}
              ListEmptyComponent={<Text style={{width, textAlign: 'center',marginTop: 10,color: '#c9c9c9', paddingBottom: 50}}>暂无数据</Text>}
              onEndReachedThreshold={0.1}
              onEndReached={this.loadMore}
              ItemSeparatorComponent={()=>(<View style={{height: 10,backgroundColor: '#F6F6F6'}}/>)}
          />
          </View>
        );
    }
}

const mapStateToProps = state => ({
  deviceTypes: state.deviceReducer.deviceTypes,
});

export default connect(mapStateToProps)(RouteList);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F6F6F6'
    },
    viewHeader: {
      height: 108,
      width: '100%',
      backgroundColor: '#fff',
      flexDirection: 'row',
    },
    touchBtn: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    rowView: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    luxianView: {
      height: 107,
      width: '100%',
      paddingTop: 10,
      paddingBottom: 10,
      paddingRight: 5,
      paddingLeft: 5,
      backgroundColor: '#fff'
    },
    footerView: {
      alignItems: "center",
      justifyContent: 'center',
      marginTop: 10
    },
    valueText: {
      color: '#666',
      fontWeight: 'bold',
      fontSize: 16
    },
    labelText: {
      color: '#999',
      marginTop: 5,
      fontSize: 12
    }
});
