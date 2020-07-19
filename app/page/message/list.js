import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView,ActivityIndicator, RefreshControl, TouchableOpacity, FlatList, Image } from 'react-native';
import moment from 'moment';
import { withNavigation } from 'react-navigation';

import userService from '../../service/messageServer';
import { connect } from 'react-redux';
import Toast from '../../components/toast';
import { getMessageInfo, getAllUserName } from '../../store/thunk/systemVariable';
import { parseDate } from '../../utils/handlePhoto';



const {width, height} = Dimensions.get('window');
class MessageList extends Component {
    static navigationOptions = () => ({
        header: ()=> {
            return  null;
        }
    });

    state={
      currentPage: 1,
      fReceiver: this.props.fEmployeeId,
      fState: 0,
      pageSize: 10,
      // 列表数据结构
      dataSource: [],
      // 下拉刷新
      isRefresh: false,
      // 加载更多
      isLoadMore: false,
      // 控制foot  1：正在加载   2 ：无更多数据
      showFoot: 1,
      refreshing: false,
      dataSource: []
    }
    getInfo = async () => {
      this.setState({ refreshing: true });
      const {currentPage, fReceiver, fState, fType, pageSize} = this.state
      const res = await userService.messageGet({
        currentPage: currentPage,
        fReceiver: fReceiver,
        fState: fState,
        fType: this.props.type,
        pageSize: pageSize
      });
      this.setState({ refreshing: false });
      if(res.success){
        this.setState({
          dataSource: res.obj.items,
        })
        if (this.state.pageSize >= res.obj.itemTotal) {
          this.setState({
              showFoot: 2
          })
        }
      }else{
        Toast.show(res.msg);
      }
    }
    componentDidMount = () => {
      this.getInfo();
      this.props.dispatch(getAllUserName());
    }
    /**
     * 下啦刷新
     * 
     */
    
    _onRefresh = () => {
      // 不处于 下拉刷新
      if (!this.state.isRefresh) {
        this.getInfo()
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
              this.getInfo()
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

    //设置以读
    setMessageRead = async (item) => {
      const { navigate } = this.props.navigation;
      navigate('MessageDetail', {messageDetail: item});
      if (item.noticeTargetState == 2) {
        return;
      }
      const res = await userService.messageReaded(item.noticeTargetId);
      if (res.success) {
        this.markRead(item);
        this.props.dispatch(getMessageInfo(this.props.fEmployeeId));
      } else {
        console.log(res.msg);
      }
    }

    // 视图未读变已读
    markRead = (item) => {
      for (let obj of this.state.dataSource) {
        if (item.fId == obj.fId) {
          obj.noticeTargetState = 2;
          break;
        }
      }
      this.setState({dataSource: this.state.dataSource});
    }
    // 展开内容
    expendMessage = (item) => {
      for (let obj of this.state.dataSource) {
        if (item.fId == obj.fId) {
          obj.expendFlag = !obj.expendFlag;
          break;
        }
      }
      this.setState({dataSource: this.state.dataSource});
    }

    renderItem = ({item}) => {
      return (
        <TouchableOpacity style={styles.detailContent} onPress={() => this.setMessageRead(item)}>
          {
            item.fType == 4 || item.fType == 5 || item.fType == 6 || item.fType == 7|| item.fType == 8 ? 
            <Image source={require('../../image/message/notify.png')} style={{marginRight: 10}}/> : null
          }
          {
            item.fType == 3 ? 
            <Image source={require('../../image/message/task.png')} style={{marginRight: 10}}/> : null
          }
          {
            item.fType == 2 ? 
            <Image source={require('../../image/message/reward.png')} style={{marginRight: 10}}/> : null
          }
          {
            item.fType == 1 ? 
            <Image source={require('../../image/message/safe.png')} style={{marginRight: 10}}/> : null
          }
          <View style={{flex: 1}}>
            <View style={styles.notifyTitle}>
              <View style={styles.rowCenter}>
                {
                  item.noticeTargetState == 1 ? <View style={styles.redCircle}/> : null
                }
                <Text style={{color: '#000',fontSize: 14}}>{item.fTitle}</Text>
              </View>
              <Text style={{color: '#999', fontSize: 10}}>{parseDate(item.fCreateTime, 'YYYY-MM-DD')}</Text>
            </View>
            <Text style={{width: '100%',color: '#999', fontSize:12,marginTop: 4}} numberOfLines={1}>
              {`${this.props.userAllName[item.fOriginator] ? ` ` : ''}${item.fContent}`}
            </Text>
          </View>
        </TouchableOpacity>
      )
    } 
    render() {
        return (
            <View style={styles.container}>
              <FlatList
                data={this.state.dataSource}
                keyExtractor={(item)=>item.fId}
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
                //下拉刷新相关
                // onRefresh={() => this._onRefresh()}
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
const mapStateToProps = state => {
  return {
    userAllName: state.userReducer.troubleName,
    fEmployeeId: state.userReducer.userInfo.fEmployeeId,
  }
}
export default connect(mapStateToProps)(withNavigation(MessageList));
const styles = StyleSheet.create({
    detailContent: {
      paddingTop: 10,
      paddingBottom: 10,
      paddingRight: 10,
      paddingLeft: 10,
      backgroundColor: '#fff',
      width: '100%',
      flexDirection: 'row'
    },
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    footerView: {
      alignItems: "center",
      justifyContent: 'center',
      marginTop: 10
    },
    notifyTitle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    rowCenter: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    redCircle: {
      width: 5,
      height: 5,
      borderRadius: 50,
      backgroundColor: 'red',
      marginRight: 4
    }
});
