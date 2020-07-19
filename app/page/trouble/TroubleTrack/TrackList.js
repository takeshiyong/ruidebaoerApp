import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, TextInput,FlatList, RefreshControl, ActivityIndicator} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import troubleService from '../../../service/troubleService';
import Toast from '../../../components/toast';
import LevelShow from '../../../components/levelShow'
import Config from '../../../config';
import { parseDate } from '../../../utils/handlePhoto';

const {width, height} = Dimensions.get('window');
class TrackList extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    
    constructor(props) {
      super(props);
      this.state = {
        dataSource: [],
        canLoadMore: true,
        loadingMore: false,
        refreshing: false,
        pageSize: 10,
        pageCurrent: 1,
        stateParam: {
          0: '审核未通过',
          1: '待审核',
          2: '待研判',
          3: '确认中',
          4: '整改中',
          5: '待复查',
          6: '销号',
          7: '拒绝待研判',
          8: '未通过待研判',
          9: '重复隐患',
          10: '撤销待研判',
        },
        handPhotoParam: {
          0: '审核未通过', 
          1: '审核中',
          2: '研判中',
          3: '审核通过',
          4: '审核通过',
          5: '审核通过',
          6: '审核通过',
          7: '审核通过',
          8: '审核通过',
          9: '重复隐患',
          10: '审核通过'
        }
      }
    }

    componentDidMount() {
      SplashScreen.hide();
      this.fetchTroubleData();
    }

    componentWillReceiveProps(nextProps) {
      // 判断有没有切换状态
      if (this.props.type !== nextProps.type) {
        this.setState({pageCurrent: 1,dataSource: []}, ()=>this.fetchTroubleData());
      }
      if (this.props.state !== nextProps.state) {
        this.setState({pageCurrent: 1,dataSource: []}, ()=>this.fetchTroubleData());
      }
      if (this.props.fLevelId !== nextProps.fLevelId) {
        this.setState({pageCurrent: 1,dataSource: []}, ()=>this.fetchTroubleData());
      }
      if (this.props.fReportBeginTime!== nextProps.fReportBeginTime) {
        this.setState({pageCurrent: 1,dataSource: []}, ()=>this.fetchTroubleData());
      }
      if (this.props.fReportEndTime!== nextProps.fReportEndTime) {
        this.setState({pageCurrent: 1,dataSource: []}, ()=>this.fetchTroubleData());
      }
    }

    // 查询隐患数据
    fetchTroubleData = async () => {
      console.log('走了这里')
      const { pageCurrent, pageSize, dataSource } = this.state;
      if (pageCurrent == 1) {
          this.setState({refreshing: true});
      }
      const res = await troubleService.getTroubleList({
        fTypeId: this.props.type|| '',
        fState: this.props.state||null,
        pageSize,
        currentPage: pageCurrent,
        fDutyDepId: this.props.fDutyDepId || null,
        fLevelId: this.props.fLevelId || null,
        fReportBeginTime: this.props.fReportBeginTime || null,
        fReportEndTime: this.props.fReportEndTime || null,
        fReportUserId: this.props.fReportUserId || null,
        fSchedulingId: this.props.fSchedulingId || null
      });
      console.log('查询隐患列表', res);
      this.setState({refreshing: false, loadingMore: false})
      if (res.success) {
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

    // 刷新列表数据
    onRefresh = () => {
        const { refreshing } = this.state;
        const { refreshNum } = this.props;
        if (refreshing) return;
        refreshNum && refreshNum();
        this.setState({pageCurrent: 1 }, ()=>this.fetchTroubleData());
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

    // 切换隐患跟踪类型
    chooseType = (type) => {
      this.setState({
        type
      })
    };

    /**
     * list上每行渲染的内容
     */
    renderItem = ({item}) => {
      let type = this.props.type;
      // 如果有type按照 规定type去整个列表都是一个type，
      // 如果没有type则按每一个 数据去匹配
      if (!type) {
        type = item.fState;
      }
      if (this.props.typeByItem) {
        type = item.fState;
      }
      if (this.props.userId) {
        return this.handPhotoItem(item);
      }
      switch(type) {
        case 1:
          return this.pendingItem(item);
        case 2:
          return this.pendingItem(item);
        case 3: 
          return this.pendingItem(item);
        case 4:
          return this.processItem(item);
        case 5:
          return this.checkItem(item);
        case 6: 
          return this.pendingItem(item);
        case 7:
          return this.refuseItem(item);
        case 8:
          return this.reviewFailed(item);
        default: 
          return this.pendingItem(item);
      }
    }

    // 随手拍查询列表
    handPhotoItem = (item) => {
      const { troubleLevelParam, troubleTypeParam, troubleImgParam } = this.props;
      const { stateParam,handPhotoParam } = this.state;
      return (
        <TouchableOpacity style={styles.itemView} onPress={()=>this.props.navigation.navigate('TroubleDetails',{refresh: this.onRefresh, item, noBtn: true})}>
          <View style={styles.itemContent}>
            <View style={styles.itemTitle}>
              <View style={{flexDirection: 'row', alignItems: 'center',width: width-130}}>
                <View style={styles.circle}>
                  <Image source={{uri: `${Config.imgUrl}/${troubleImgParam[item.fTypeId]}`}} style={styles.imgSize}/>
                </View>
                <Text style={{color: '#000',marginRight: 5,marginLeft: 5,maxWidth: '70%',wordWrap: 'break-word'}}>{ item.fNo || troubleTypeParam[item.fTypeId]}</Text>
                {
                  !item.fLevelId ? null : <LevelShow level={troubleLevelParam[item.fLevelId]}/>
                }
              </View>
              <View style={[styles.itemTip,{backgroundColor: '#FFECE6'}]}>
                <Text style={{color: '#FF632E', fontSize: 10}}>{handPhotoParam[item.fState]}</Text>
              </View>
            </View>
            <Text numberOfLines={3} style={{color: '#666',marginTop: 13,marginBottom: 10}}>
              {item.fContent}
            </Text>
            <View style={styles.itemDeptView}>
              <View style={styles.rowCenter}>
                <Image source={require('../../../image/trouble/troubleTrack/myIcon.png')} />
                <Text style={{color: '#999', marginLeft: 7, fontSize: 12, width: width/2}} numberOfLines={1}>
                  {item.fReportUserName}
                </Text>
              </View>
              <View style={styles.rowCenter}>
                <Image source={require('../../../image/trouble/troubleTrack/clock.png')} />
                <Text style={{color: '#999', marginLeft: 7, fontSize: 12}}>{parseDate(item.fReportTime, 'YYYY.MM.DD HH:mm')}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )
    }

    // 列表跳转详情页面
    jumpDetail = (item) => {
      // 待审核页面
      if (item.fState == 1) {
        this.props.navigation.navigate('TroubleDetails',{refresh: this.onRefresh, item});
      } else if (item.fState == 2) {
        this.props.navigation.navigate('TroubleJudgment',{refresh: this.onRefresh, item});
      } else if (item.fState == 3 || item.fState == 10) {
        this.props.navigation.navigate('TroubleSafeNotify',{refresh: this.onRefresh, item, showOperating: item.fState == 3});
      } else if (item.fState == 6) {
        this.props.navigation.navigate('TroubleCallBack',{refresh: this.onRefresh, item});
      }
    }

    /**
     * 待处理样式
     */
    pendingItem = (item) => {
      const { troubleLevelParam, troubleTypeParam, troubleImgParam } = this.props;
      const { stateParam } = this.state;
      return (
        <TouchableOpacity style={styles.itemView} onPress={()=>this.jumpDetail(item)}>
          <View style={styles.itemContent}>
            <View style={styles.itemTitle}>
              <View style={{flexDirection: 'row', alignItems: 'center',width: width-130}}>
                <View style={styles.circle}>
                  <Image source={{uri: `${Config.imgUrl}/${troubleImgParam[item.fTypeId]}`}} style={styles.imgSize}/>
                </View>
                <Text style={{color: '#000',marginLeft: 5,marginRight: 5,maxWidth: '70%',wordWrap: 'break-word'}}>{ item.fNo || troubleTypeParam[item.fTypeId]}</Text>
                {
                  !item.fLevelId ? null : <LevelShow level={troubleLevelParam[item.fLevelId]}/>
                }
              </View>
              <View style={[styles.itemTip,{backgroundColor: '#FFECE6'}]}>
                <Text style={{color: '#FF632E', fontSize: 10}}>{stateParam[item.fState]}</Text>
              </View>
            </View>
            <Text numberOfLines={3} style={{color: '#666',marginTop: 13,marginBottom: 10}}>
              {item.fContent}
            </Text>
            <View style={styles.itemDeptView}>
              <View style={styles.rowCenter}>
                <Image source={require('../../../image/trouble/troubleTrack/myIcon.png')} />
                <Text style={{color: '#999', marginLeft: 7, fontSize: 12, width: width/2}} numberOfLines={1}>
                  {item.fReportUserName}
                </Text>
              </View>
              <View style={styles.rowCenter}>
                <Image source={require('../../../image/trouble/troubleTrack/clock.png')} />
                <Text style={{color: '#999', marginLeft: 7, fontSize: 12}}>{parseDate(item.fReportTime, 'YYYY.MM.DD HH:mm')}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )
    }

    /**
     * 复查拒整改
     */
    reviewFailed = (item) => {
      const { troubleLevelParam, troubleTypeParam, troubleImgParam } = this.props;
      return (
        <View style={styles.itemView}>
          <View style={styles.itemContent}>
            <View style={styles.itemTitle}>
              <View style={{flexDirection: 'row', alignItems: 'center',width: width-130}}>
                <View style={styles.circle}>
                  <Image source={{uri: `${Config.imgUrl}/${troubleImgParam[item.fTypeId]}`}} style={styles.imgSize}/>
                </View>
                <Text style={{color: '#000',marginRight: 5,marginLeft: 5,maxWidth: '70%',wordWrap: 'break-word'}}>{ item.fNo || troubleTypeParam[item.fTypeId]}</Text>
                {
                  !item.fLevelId ? null : <LevelShow level={troubleLevelParam[item.fLevelId]}/>
                }
              </View>
              <View style={[styles.itemTip, {backgroundColor: '#FEEAEA'}]}>
                <Text style={{color: '#F74747', fontSize: 10}}>未通过待研判</Text>
              </View>
            </View>
            <Text numberOfLines={3} style={{color: '#666',marginTop: 13,marginBottom: 10}}>
              {item.fContent}            
            </Text>
            <View style={styles.itemDeptView}>
              <View style={styles.rowCenter}>
                <Image source={require('../../../image/trouble/troubleTrack/myIcon.png')} />
                <Text style={{color: '#999', marginLeft: 7, fontSize: 12, width: width/2}} numberOfLines={1}>{item.fDutyDepName}</Text>
              </View>
              <View style={styles.rowCenter}>
                <Image source={require('../../../image/trouble/troubleTrack/clock.png')} />
                <Text style={{color: '#999', marginLeft: 7, fontSize: 12}}>{parseDate(item.fReportTime, 'YYYY.MM.DD HH:mm')}</Text>
              </View>
            </View>
            <View style={styles.extraView}>
              <View style={[styles.rowCenter, {justifyContent: 'space-between'},{paddingTop: 15,paddingBottom: 15,paddingRight: 15,paddingLeft: 15}]}>
                  <View style={[styles.rowCenter, ]}>
                    <View style={styles.pointView} />
                    <Text style={{color: '#666',marginLeft: 10,fontSize: 12}}>复查时间: {parseDate(item.fReviewTime, 'YYYY.MM.DD HH:mm')}</Text>
                  </View>
                  <TouchableOpacity onPress={()=>this.props.navigation.navigate('TroubleSafeNotify',{refresh: this.onRefresh, item})}>
                    <Text style={{color: '#455DFD', fontSize: 12}}>查看反馈单</Text>
                  </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )
    }

    /**
     * 拒整改样式
     */
    refuseItem = (item) => {
      const { troubleLevelParam, troubleTypeParam, troubleImgParam } = this.props;
      return (
        <View style={styles.itemView}>
          <View style={styles.itemContent}>
            <View style={styles.itemTitle}>
              <View style={{flexDirection: 'row', alignItems: 'center',width: width-130}}>
                <View style={styles.circle}>
                  <Image source={{uri: `${Config.imgUrl}/${troubleImgParam[item.fTypeId]}`}} style={styles.imgSize}/>
                </View>
                <Text style={{color: '#000',marginRight: 5,marginLeft: 5,maxWidth: '70%',wordWrap: 'break-word'}}>{ item.fNo || troubleTypeParam[item.fTypeId]}</Text>
                {
                  !item.fLevelId ? null : <LevelShow level={troubleLevelParam[item.fLevelId]}/>
                }
              </View>
              <View style={[styles.itemTip, {backgroundColor: '#FEEAEA'}]}>
                <Text style={{color: '#F74747', fontSize: 10}}>拒绝待研判</Text>
              </View>
            </View>
            <Text numberOfLines={3} style={{color: '#666',marginTop: 13,marginBottom: 10}}>
              {item.fContent}            
            </Text>
            <View style={styles.itemDeptView}>
              <View style={styles.rowCenter}>
                <Image source={require('../../../image/trouble/troubleTrack/myIcon.png')} />
                <Text style={{color: '#999', marginLeft: 7, fontSize: 12, width: width/2}} numberOfLines={1}>{item.fDutyDepName}</Text>
              </View>
              <View style={styles.rowCenter}>
                <Image source={require('../../../image/trouble/troubleTrack/clock.png')} />
                <Text style={{color: '#999', marginLeft: 7, fontSize: 12}}>{parseDate(item.fReportTime, 'YYYY.MM.DD HH:mm')}</Text>
              </View>
            </View>
            <View style={styles.extraView}>
              <View style={[styles.rowCenter, {justifyContent: 'space-between'},{paddingTop: 15,paddingBottom: 15,paddingRight: 15,paddingLeft: 15}]}>
                  <View style={[styles.rowCenter, ]}>
                    <View style={styles.pointView} />
                    <Text style={{color: '#666',marginLeft: 10,fontSize: 12}}>拒改时间: {parseDate(item.fAcceptTime, 'YYYY.MM.DD HH:mm')}</Text>
                  </View>
                  <TouchableOpacity onPress={()=>this.props.navigation.navigate('TroubleCallBack',{refresh: this.onRefresh, item})}>
                    <Text style={{color: '#455DFD', fontSize: 12}}>查看反馈单</Text>
                  </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )
    }

    /**
     * 整改中样式
     */
    processItem = (item) => {
      const { troubleLevelParam, troubleTypeParam, troubleImgParam } = this.props;
      return (
        <View style={styles.itemView}>
          <View style={styles.itemContent}>
            <View style={styles.itemTitle}>
              <View style={{flexDirection: 'row', alignItems: 'center',width: width-130}}>
                <View style={styles.circle}>
                  <Image source={{uri: `${Config.imgUrl}/${troubleImgParam[item.fTypeId]}`}} style={styles.imgSize}/>
                </View>
                <Text style={{color: '#000',marginRight: 5,marginLeft: 5,maxWidth: '70%',wordWrap: 'break-word'}}>{ item.fNo || troubleTypeParam[item.fTypeId]}</Text>
                {
                  !item.fLevelId ? null : <LevelShow level={troubleLevelParam[item.fLevelId]}/>
                }
              </View>
              <View style={[styles.itemTip, {backgroundColor: '#FFECE6'}]}>
                <Text style={{color: '#FF632E', fontSize: 10}}>整改中</Text>
              </View>
            </View>
            <Text numberOfLines={3} style={{color: '#666',marginTop: 13,marginBottom: 10}}>
              {item.fContent}            
            </Text>
            <View style={styles.itemDeptView}>
              <View style={styles.rowCenter}>
                <Image source={require('../../../image/trouble/troubleTrack/myIcon.png')} />
                <Text style={{color: '#999', marginLeft: 7, fontSize: 12, width: width/2}} numberOfLines={1}>{item.fDutyDepName}</Text>
              </View>
              <View style={styles.rowCenter}>
                <Image source={require('../../../image/trouble/troubleTrack/clock.png')} />
                <Text style={{color: '#999', marginLeft: 7, fontSize: 12}}>{parseDate(item.fReportTime, 'YYYY.MM.DD HH:mm')}</Text>
              </View>
            </View>
            <View style={styles.extraView}>
              <View style={[styles.rowCenter, {justifyContent: 'space-between'},{paddingTop: 15,paddingBottom: 15,paddingRight: 15,paddingLeft: 15,borderBottomWidth:1,borderBottomColor: '#e0e0e0'}]}>
                  <View>
                    <View style={[styles.rowCenter, ]}>
                      <View style={styles.pointView} />
                      <Text style={{color: '#666',marginLeft: 10,fontSize: 12}}>整改确认时间: {parseDate(item.fAcceptTime, 'YYYY.MM.DD HH:mm')}</Text>
                    </View>
                    <Text style={{color: '#999',marginLeft: 15,fontSize: 10, marginTop: 5}}>计划完成时间: {parseDate(item.fPlanFinishTime, 'YYYY.MM.DD HH:mm')}</Text>
                  </View>
                  <TouchableOpacity onPress={()=>{
                    this.props.navigation.navigate('TroubleCallBack', {item})
                    // this.props.navigation.navigate('TroubleSafeNotify',{refresh: this.onRefresh, item,markOperation: true});
                    }}>
                    <Text style={{color: '#455DFD', fontSize: 12}}>查看反馈单</Text>
                  </TouchableOpacity>
              </View>
              <View style={[styles.rowCenter,{justifyContent: 'space-between',paddingTop: 15,paddingBottom: 15,paddingRight: 15,paddingLeft: 15}]}>
                <View style={[styles.rowCenter]}>
                  <View style={[styles.pointView, {backgroundColor: '#FF632E'}]} />
                  <Text style={{color: '#FF632E',marginLeft: 10,fontSize: 12}}>待完成</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )
    }

    /**
     * 待复查样式
     */
    checkItem = (item) => {
      const { troubleLevelParam, troubleTypeParam, troubleImgParam } = this.props;
      return (
        <View style={styles.itemView}>
        <View style={styles.itemContent}>
          <View style={styles.itemTitle}>
            <View style={{flexDirection: 'row', alignItems: 'center',width: width-130}}>
              <View style={styles.circle}>
                <Image source={{uri: `${Config.imgUrl}/${troubleImgParam[item.fTypeId]}`}} style={styles.imgSize}/>
              </View>
              <Text style={{color: '#000',marginRight: 5,marginLeft: 5,maxWidth: '70%',wordWrap: 'break-word'}}>
                { item.fNo || troubleTypeParam[item.fTypeId]}
              </Text>
                {
                  !item.fLevelId ? null : <LevelShow level={troubleLevelParam[item.fLevelId]}/>
                }
            </View>
            <View style={styles.itemTip}>
              <Text style={{color: '#1acfaa', fontSize: 10}}>待复查</Text>
            </View>
          </View>
          <Text numberOfLines={3} style={{color: '#666',marginTop: 13,marginBottom: 10}}>
            {item.fContent}          
          </Text>
          <View style={styles.itemDeptView}>
            <View style={styles.rowCenter}>
              <Image source={require('../../../image/trouble/troubleTrack/myIcon.png')} />
              <Text style={{color: '#999', marginLeft: 7, fontSize: 12, width: width/2}} numberOfLines={1}>{item.fDutyDepName}</Text>
            </View>
            <View style={styles.rowCenter}>
              <Image source={require('../../../image/trouble/troubleTrack/clock.png')} />
              <Text style={{color: '#999', marginLeft: 7, fontSize: 12}}>{parseDate(item.fReportTime, 'YYYY.MM.DD HH:mm')}</Text>
            </View>
          </View>
          <View style={styles.extraView}>
            <View style={{paddingTop: 15,paddingBottom: 15,paddingRight: 15,paddingLeft: 15,borderBottomWidth:1,borderBottomColor: '#e0e0e0'}}>
              <View style={[styles.rowCenter, ]}>
                <View style={styles.pointView} />
                <Text style={{color: '#666',marginLeft: 10,fontSize: 12}}>整改确认时间: {parseDate(item.fAcceptTime, 'YYYY.MM.DD HH:mm')}</Text>
              </View>
              <Text style={{color: '#999',marginLeft: 15,fontSize: 10, marginTop: 5}}>计划完成时间: {parseDate(item.fPlanFinishTime, 'YYYY.MM.DD HH:mm')}</Text>
            </View>
            <View style={[styles.rowCenter,{justifyContent: 'space-between',paddingTop: 15,paddingBottom: 15,paddingRight: 15,paddingLeft: 15}]}>
              <View style={[styles.rowCenter]}>
                <View style={[styles.pointView, {backgroundColor: '#4058FD'}]} />
                <Text style={{color: '#666',marginLeft: 10,fontSize: 12}}>整改完成时间: {parseDate(item.fActualFinishTime, 'YYYY.MM.DD HH:mm')}</Text>
              </View>
              <TouchableOpacity onPress={()=>this.props.navigation.navigate('TroubleCallBack', {item, refresh: this.onRefresh})}>
                <Text style={{color: '#455DFD', fontSize: 12}}>复查</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      )
    }

    render() {
      return (
        <View style={{width}}>
          <FlatList
              refreshControl={
                <RefreshControl
                    title={'Loading'}
                    colors={['#000']}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                />
              } 
              ListHeaderComponent={this.props.ListHeaderComponent || null}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        display: "flex",
        alignItems: 'center',
    },
    rowCenter: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    itemView: {
      width: '100%',
      alignItems: 'center',
    },
    itemContent: {
      width: '93%',
      padding: 10,
      backgroundColor: '#fff',
      borderRadius: 4
    },
    itemTitle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: 0,
      paddingRight: 5
    },
    circle: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#4058FD',
      width: 25,
      height: 25,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center'
    },
    imgSize: {
      width: 20,
      height: 20
    },
    itemTip: {
      paddingTop: 3,
      paddingBottom: 3,
      paddingRight: 7,
      paddingLeft: 7,
      backgroundColor: '#E9FDF9'
    },
    itemDeptView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: '#f8f8f8',
      paddingTop: 10,
      paddingBottom: 10,
      paddingRight: 5,
      paddingLeft: 5
    },
    extraView: {
      backgroundColor: '#f8f8f8',
      borderRadius: 4
    },
    pointView: {
      width: 5,
      height: 5,
      borderRadius: 50,
      backgroundColor: '#50b240'
    },
    footerView: {
      alignItems: "center",
      justifyContent: 'center',
      marginTop: 10
    }
});

const mapStateToProps = state => ({
  troubleLevelParam: state.troubleReducer.troubleLevelParam,
  troubleTypeParam: state.troubleReducer.troubleTypeParam,
  troubleImgParam: state.troubleReducer.troubleImgParam,
})

export default withNavigation(connect(mapStateToProps)(TrackList));