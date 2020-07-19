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
import { parseTime, parseDate } from '../../utils/handlePhoto';
const { width, height } = Dimensions.get('window');
class CheckUpIngList extends Component {
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
      const res = await deviceServer.selectCheckUpListByPage({
        pageSize,
        pageCurrent,
        orderParams: [{
          orderEnum: "DESC",
          paramEnum: "CREATE_TIME"
        }],
        fPatrolTaskState: 0
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
            dataArr = res.obj.items.map((data)=>{
              return {
                ...data,
                option: {
                    series: [
                      {
                          type: 'pie',
                          radius: ['85%', '100%'],
                          center: ['50%', '50%'],
                          labelLine:{show: false},
                          legendHoverLink: false,
                          hoverAnimation: false,
                          clockwise: false,
                          data:[
                              {value:data.fPatrolRecordNum,itemStyle:{normal:{color: '#FF9C4C'}}},
                              {value:data.fPatrolTaskRecordNum - data.fPatrolRecordNum,itemStyle:{normal:{color: '#E0E0E0'}}},
                          ],
                          
                      }
                  ]
                }
              }
            });
        } else {
            // 如果当前页不是第一页则需要拼接
            dataArr = dataSource.concat(res.obj.items.map((data)=>{
              return {
                ...data,
                option: {
                    series: [
                      {
                          type: 'pie',
                          radius: ['85%', '100%'],
                          center: ['50%', '50%'],
                          labelLine:{show: false},
                          legendHoverLink: false,
                          hoverAnimation: false,
                          clockwise: false,
                          data:[
                              {value:data.fPatrolRecordNum,itemStyle:{normal:{color: '#FF9C4C'}}},
                              {value:data.fPatrolTaskRecordNum - data.fPatrolRecordNum,itemStyle:{normal:{color: '#E0E0E0'}}},
                          ],
                      }
                  ]
                }
              }
            }));
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
      <View style={[styles.luxianView, {height: 168,paddingRight: 10, paddingLeft: 10}]}>
        <View style={styles.rowView}>
          <View style={{width: 5,height: 5,borderRadius: 50,backgroundColor: '#4B74FF'}}/>
          <Text style={{color: '#333',marginLeft: 5}}>{item.fPatrolRouteName}</Text>
        </View>
        <View style={styles.rowView}>
          <View style={{flex: 1}}>
            <View style={[{flex: 1,borderBottomWidth: 1,borderBottomColor: '#e0e0e0'}, styles.rowView]}>
              <View style={{flex: 4,justifyContent: 'center',alignItems: 'center'}}>
                <Text style={styles.valueText}>{item.equipmentNum}</Text>
                <Text style={styles.labelText}>设备</Text>
              </View>
              <View style={{flex: 9,justifyContent: 'center',alignItems: 'center'}}>
                <Text style={styles.valueText}>{item.checkItemNum}</Text>
                <Text style={styles.labelText}>测项</Text>
              </View>
            </View>
            <View style={[{flex: 1}, styles.rowView]}>
              <View style={{flex: 4,justifyContent: 'center',alignItems: 'center'}}>
                <Text style={styles.valueText}>
                  {item.tEquipmentPatrolTaskUserList.length > 0 ? item.tEquipmentPatrolTaskUserList.length > 1 ? item.tEquipmentPatrolTaskUserList[0].fUserName+'等' : item.tEquipmentPatrolTaskUserList[0].fUserName : '--'}
                </Text>
                <Text style={styles.labelText}>巡检人</Text>
              </View>
              <View style={{flex: 9,justifyContent: 'center',alignItems: 'center'}}>
                <Text style={styles.valueText}>{parseDate(parseTime(item.fPatrolTaskDate),'YYYY.MM.DD HH:mm')}</Text>
                <Text style={styles.labelText}>任务结束时间</Text>
              </View>
            </View>
          </View>
          <View style={{width: 90, height: 140, paddingBottom: 20,alignItems: 'center',}}>
            <TouchableOpacity  style={{width: '80%',height: '70%',position: 'relative'}} onPress={()=>this.props.navigation.push('DeviceRecodsMap', {item})}>
              <ECharts option={item.option}/>
              <Text style={{position: 'absolute',width: '100%',textAlign: 'center',top: '37%',color: '#666',
            fontWeight: 'bold',fontSize: 16}}>{item.fPatrolRecordNum}/{item.fPatrolTaskRecordNum}</Text>
            </TouchableOpacity>
            {
              item.fIsAbnormal ? 
              <TouchableOpacity onPress={()=>{this.props.navigation.navigate('RecordDetail',{item,type: 3,fromAbnormal: true})}} style={{zIndex: 9999}}>
                <Text style={{color: '#F56767',width: 90,textAlign: 'center',zIndex: 999}}>查看异常</Text>
              </TouchableOpacity>
              : null
            }
            
          </View>
        </View>
      </View>
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
              titleText="执行中巡检"
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

export default connect(mapStateToProps)(CheckUpIngList);

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
