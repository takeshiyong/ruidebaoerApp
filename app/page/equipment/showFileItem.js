import React, { Component } from 'react';
import { StyleSheet,ScrollView, Text, View, Dimensions,TextInput, TouchableOpacity, FlatList,Image,RefreshControl,ActivityIndicator,ImageBackground} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import deviceServer from '../../service/deviceServer';
import Header from '../../components/header';
import Toast from '../../components/toast';
import { parseTime, parseDate } from '../../utils/handlePhoto';
import ShowDonwModal from '../organization/showDonwModal';

const PAGESIZE = 10;
const {width, height} = Dimensions.get('window');
export default  class Organize extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    constructor(props) {
        super(props);
        this.state = {
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
            preventData: {}
        };
    }

    componentDidMount() {
      SplashScreen.hide();
      if (this.props.navigation.state && this.props.navigation.state.params.item) {
        console.log(this.props.navigation.state.params.item)
        this.setState({
          preventData: this.props.navigation.state.params.item
        },() => {
            this.equipmentKnowledgeFileSelect(this.state.preventData.fId)
        })
      }
    }
    //
    equipmentKnowledgeFileSelect = async (id) => {
        const { currentPage, pageSize } = this.state;
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: true,canLoadMore: true});
        } else {
            this.setState({ isLoadMore: true });
        }
        const res = await deviceServer.equipmentKnowledgeFileSelect({
            currentPage:currentPage,
            pageSize:pageSize,
            typeModelId: id
          });
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
    // 设备item组件渲染
    renderItem = ({item}) => {
        return (
            <TouchableOpacity style={{flexDirection: "row",paddingTop: 15,paddingBottom: 15,paddingLeft: 15}} onPress={() => {this.ShowModal.show(item)}}>
            <Image source={this.getDetailWay(item.fCoursewareTitle)} style={{width: 40, height: 40}}/>
            <View style={{marginLeft: 10}}>
                <Text style={{color: "#333"}}>{item.fFileName?item.fFileName:'--'}</Text>
                <View style={{flexDirection: "row"}}>
                    <Text>{item.fCreateTime?parseDate(item.fCreateTime,'YYYY/MM/DD HH:mm'):'--'}</Text>
                </View>
            </View>
        </TouchableOpacity>
        )
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
            this.equipmentKnowledgeFileSelect(this.state.preventData.fId)
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
                this.equipmentKnowledgeFileSelect(this.state.preventData.fId)
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
    getDetailWay = (fType) => {
        console.log(fType)
        switch (fType){
            case 'jpeg': 
                return require('../../image/documentIcon/image.png');
            case 'jpg': 
                return require('../../image/documentIcon/image.png');
            case 'gif': 
                return require('../../image/documentIcon/image.png');
            case 'png': 
                return require('../../image/documentIcon/image.png');
            case 'pdf': 
                return require('../../image/documentIcon/pdf.png');
            case 'ppt': 
                return require('../../image/documentIcon/ppt.png');
            case 'xls':
                return require('../../image/documentIcon/excel.png');
            case 'xlsx':
                return require('../../image/documentIcon/excel.png');
            case 'doc':
                return require('../../image/documentIcon/word.png');
            case 'docx':
                return require('../../image/documentIcon/word.png');
            default:
                return require('../../image/documentIcon/unfile.png');
        } 
        
    } 
    render() {
        const { pop } = this.props.navigation;
        const { selectDep } = this.state;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText={this.state.preventData.fEquipmentType?this.state.preventData.fEquipmentType: "--"}
                    hidePlus={true} 
                />
                <View style={{backgroundColor: '#fff'}}>
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
                <ShowDonwModal ref={(ref)=>this.ShowModal = ref} />
            </View>
           
        );
    }
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#F4F4F8',
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
    headerView: {
        height: 40,
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginBottom: 10
    },
    setTime: {
        flexDirection: "row",
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10
    },
    footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 20,
        paddingBottom: 20
    },
    headerView: {
        height: 40,
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginBottom: 10
    },
    headerText: {
        color: '#4972FE',
        marginRight: 8,
        marginLeft: 8
    },
    rowStyle: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center'
    },
    items: {
        borderTopWidth: 1,
        borderTopColor: "#E0E0E0",
        paddingLeft: 15,
        paddingRight: 15
    },
    tipsText: {
        width,
        height: 40,
        textAlign: "center",
        paddingTop: 10,
        fontSize: 16
    }
});
