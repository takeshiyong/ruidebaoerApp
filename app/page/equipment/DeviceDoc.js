import React, { Component } from 'react';
import { StyleSheet,ScrollView, Text, View, Dimensions,TextInput, TouchableOpacity, FlatList,Image,RefreshControl,ActivityIndicator,ImageBackground} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Feather from 'react-native-vector-icons/Feather';

import deviceServer from '../../service/deviceServer';
import config from '../../config';
import Header from '../../components/header';
import Toast from '../../components/toast';
const { width, height } = Dimensions.get('window');

const PAGESIZE = 10;
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
      typeList: [],
      statics: null,
      showX:false,
      text: '',
      // 当前选中的设备类型id
      currentTypeId: '',
      refreshing: false,
      dataSource: [],
      currentPage: 1,
      // 下拉刷新
      isRefresh: false,
      // 加载更多
      isLoadMore: false,
      pageSize: PAGESIZE,
      // 控制foot  1：正在加载   2 ：无更多数据
      showFoot: 2,
      canLoadMore: true,
      currentDataSource: [],
      showType: false
    }

    componentDidMount() {
      SplashScreen.hide();
      this.getTypeList();
    }
    // 获取设备类型
    getTypeList = async () => {
      global.loading.show();
      const res = await deviceServer.equipmentTypeInfoSelectAll();
      global.loading.hide();
      if (res.success) {
        let currentId = '';
        // 如果类型数组大于1则默认选中第一个类型
        if (res.obj.length > 0) {
          res.obj[0].checked = true;
          currentId = res.obj[0].fId;
          this.getTypeListById(currentId);
        }
        this.setState({
          currentTypeId: currentId,
          typeList: res.obj
        });
      } else {
        Toast.show(res.msg);
      }
    }
    // 根据设备类型查询设备列表
    getTypeListById = async (fId) => {
      const { currentPage, pageSize } = this.state;
      if (pageSize == PAGESIZE) {
          this.setState({ refreshing: true,canLoadMore: true});
      } else {
          this.setState({ isLoadMore: true });
      }
      const res = await deviceServer.typeModelSelect({
        currentPage:currentPage,
        pageSize:pageSize,
        fId: fId
      });
      console.log('获取设备列表', res);
      if (pageSize == PAGESIZE) {
        this.setState({ refreshing: false });
      } else {
          this.setState({ isLoadMore: false });
      }
      if (res.success) {
        this.setState({
          dataSource: res.obj.items
        },() => {console.log(1111111111111111111,this.state.dataSource)})
        if (this.state.pageSize >= res.obj.itemTotal) {
          this.setState({
              canLoadMore: false
          })
        }
      } else {
        Toast.show(res.msg);
      }
    }
    //搜索功能
    typeModelSearch = async (text) => {
      const { currentPage, pageSize } = this.state;
      if (pageSize == PAGESIZE) {
          this.setState({ refreshing: true,canLoadMore: true});
      } else {
          this.setState({ isLoadMore: true });
      }
      const res = await deviceServer.typeModelSearch({
        currentPage:currentPage,
        pageSize:pageSize,
        keyword: text
      });
      console.log('获取搜索文件', res);
      if (pageSize == PAGESIZE) {
        this.setState({ refreshing: false });
      } else {
          this.setState({ isLoadMore: false });
      }
      if (res.success) {
        this.setState({
          dataSource: res.obj.items
        },() => {console.log(1111111111111111111,this.state.dataSource)})
        if (this.state.pageSize >= res.obj.itemTotal) {
          this.setState({
              canLoadMore: false
          })
        }
      } else {
        Toast.show(res.msg);
      }
    }
    // 切换选中项 通过类型获取列表数据
    changeItem = (index, data) => {
      // 获取列表数据
      this.getTypeListById(data.fId)
      for (let obj of this.state.typeList) {
        obj.checked = false;
      }
      this.state.typeList[index].checked = true;
      this.setState({
        typeList: this.state.typeList,
        currentTypeId: data.fId
      });
    }

    // 左侧类型组件
    typeRender = (item, index) => {
      if (item.checked) {
        return (
          <TouchableOpacity key={index} style={[styles.typeItem,{backgroundColor: '#F6F6F6'}]} onPress={()=>this.changeItem(index, item)}>
            <View style={styles.activeTip}/>
            <View style={{position: 'relative', width: '100%'}}>
              <Text style={{color: '#333',fontWeight: '600',width: '80%',marginLeft: 10,textAlign: 'center'}}>
                {item.fTypeName}
              </Text>
              {item.num ? <View style={styles.tips}/>: null}
            </View>
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity key={index} style={[styles.typeItem,]} onPress={()=>this.changeItem(index, item)}>
          <View style={{position: 'relative', width: '100%'}}>
            <Text style={{width: '80%',marginLeft: 10,textAlign: 'center'}}>{item.fTypeName}</Text>
            {item.num ? <View style={styles.tips}/>: null}
          </View>
        </TouchableOpacity>
      );
    }

    // 设备item组件渲染
    renderItem = ({item}) => {
      return (
        <TouchableOpacity style={{flexDirection: "row",paddingTop: 10,paddingBottom: 10,alignItems: "center"}} onPress={()=>{this.pushValue(item)}}>
            <Image source={require("../../image/documentIcon/file.png")} style={{width: 40, height: 40,marginLeft: 10}}/>
            <View style={{marginLeft: 10}}>
                <Text>{item.fEquipmentType?item.fEquipmentType:'--'}</Text>
            </View>
        </TouchableOpacity>
      )
    }
    pushValue = async (item) => {
      this.props.navigation.navigate('ShowFileItem',{item})
    }
    /**
       * 下啦刷新
       * 
    */
   onRefresh = () => {
        // 不处于 下拉刷新
        this.setState({
            pageSize: PAGESIZE
        }, ()=> {
            if(this.state.text){
              this.typeModelSearch(this.state.text)
            }else{
              this.getTypeListById(this.state.currentTypeId);
            }
        })
            
    };

    
    /**
     * 加载更多
     * @private
    */
    _onLoadMore() {
        // 不处于正在加载更多 && 有下拉刷新过，因为没数据的时候 会触发加载
        if (!this.state.isLoadMore && this.state.dataSource.length > 0 && this.state.canLoadMore) {
            this.setState({
                pageSize: this.state.pageSize + 10
            }, () => {
                if(this.state.text){
                  this.typeModelSearch(this.state.text)
                }else{
                  this.getTypeListById(this.state.currentTypeId);
                }
            })
        }
    } 
    /**
      * 创建尾部布局
    */
    _createListFooter = () => {
        const { isLoadMore, dataSource, canLoadMore } = this.state;
        if (dataSource.length == 0) {
            return null;
        }
        let moreText = '上拉加载更多数据';
        if (isLoadMore) {
            moreText = '正在加载更多数据'
        } else {
            if (!canLoadMore) {
                moreText = '暂无更多数据' 
            }
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
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#fff' }} />;
    }
    //当值发生变换时
    handleChange = (text) => {
        this.setState({
            currentDataSource: this.state.dataSource
        })
        console.log(text);
        if(text == ''){
            this.setState({
                showType: false,
                showX:false,
                text,
                dataSource: this.state.currentDataSource
            })
        }else{
            this.setState({
                showType: true,
                showX:true,
                text,
            },() => {this.typeModelSearch(text)})
        }
        
    }
  
    render() {
      const { typeList } = this.state;
        return (
          <View style={styles.container}>
            <Header 
              titleText="设备列表"
              backBtn={true}
              hidePlus={true}
            />
            
              <View style={[styles.topBar, this.state.showX ? {borderBottomWidth: 0} : {}]}>
                    <View style={styles.barInput}>
                          <Feather name={'search'} size={14} style={{ color: '#696A6C', lineHeight: 30,marginRight: 5}} />
                          <TextInput  
                              style={{padding: 0,width: "100%", height: "100%", flex: 9, fontSize: 14,color: '#5D6A76'}}
                              placeholder={"搜索"}
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
              
              <View style={{flexDirection: 'row'}}>
              {
              !this.state.showType ?
                <View style={{width: 90,backgroundColor: '#EDEDED',height: height-70}}>
                  {
                    typeList.map((data, index)=>(this.typeRender(data,index)))
                  }
                </View>
                : null 
              }
                <View style={{flex: 1}}>
                  <View style={{borderRadius: 4,height: height - 80}}>
                    <FlatList
                      style={{backgroundColor: "#fff",paddingLeft: 15}}
                      showsVerticalScrollIndicator={false}
                      data={this.state.dataSource}
                      renderItem={this.renderItem}
                      ListEmptyComponent={<Text style={{width:'100%', textAlign: 'center',marginTop: 10,color: '#c9c9c9', paddingBottom: 50}}>暂无数据</Text>}
                      refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            colors={['#000']}
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />
                      } 
                      //加载更多
                      ListFooterComponent={this._createListFooter}
                      onEndReached={() => this._onLoadMore()}
                      onEndReachedThreshold={0.1}
                      ItemSeparatorComponent={()=>this._separator()}
                    />
                  </View>
                </View>
              </View>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F6F6F6'
    },
    typeItem: {
      width: '100%',
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      position: 'relative'
    },
    activeTip: {
      width: 4,
      height: 15,
      backgroundColor: '#4058FD',
      position: 'absolute',
      left: 0,
      top: 18
    },
    tips: {
      width: 8,
      height: 8,
      borderRadius: 50,
      backgroundColor: '#F74747',
      position: 'absolute',
      right: -5,
      top: 0
    },
    active: {
      backgroundColor: '#F6F6F6'
    },  
    itemFastStyle: {
      width: '100%',
      backgroundColor: '#fff',
      flexDirection: 'row',
      borderBottomColor: "#E0E0E0",
      borderBottomWidth: 1,
      paddingLeft: 5,
      paddingTop: 15,
      paddingBottom: 15,
      alignItems: 'center',
    },
    footerView: {
      alignItems: "center",
      justifyContent: 'center',
      marginTop: 10,
      paddingBottom: 10
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
    
});
