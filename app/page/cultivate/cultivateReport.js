import React, { Component } from 'react';
import { StyleSheet,ScrollView, Text, View, Dimensions, TouchableOpacity, FlatList,Image,Modal,RefreshControl,ActivityIndicator,ImageBackground} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-datepicker';
import {ECharts} from 'react-native-echarts-wrapper';
import moment from 'moment';
import Picker from 'react-native-wheel-picker';
import SplashScreen from 'react-native-splash-screen';
import carshopsServer from '../../service/collegeServer';
import Toast from '../../components/toast';
import Header from '../../components/header';
import { parseTime,parseDate } from '../../utils/handlePhoto';

const PickerItem = Picker.Item;
const {width, height} = Dimensions.get('window');
const PAGESIZE = 10;
class DeviceMaintain extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state= {
        date: null,
        date1: null,
        showPicker: false,
        typeData: {
            index: 0,
            fId: null,
            fName: '全部'
        },
        
        changeData: {},
        pickerList: [],
        itemList: [],
        
        currentPage: 1,
        // 列表数据结构
        dataSource: [],
        // 下拉刷新
        refreshing: false,
        // 加载更多
        isLoadMore: false,
        canLoadMore: true,
        pageSize: PAGESIZE,
    }

    componentDidMount() {
      SplashScreen.hide();
      this.TTrainTypeSelectAll();
      this.trainplanSelectByPage()
    }
    /**
     * 下啦刷新
     * 
     */
    _onRefresh = () => {
        // 不处于 下拉刷新
        this.setState({
            pageSize: PAGESIZE
        }, ()=> {
            this.trainplanSelectByPage()
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
                this.trainplanSelectByPage()
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
    listHead = () => {
        return(<View style={styles.content}>
            <View style={{borderColor: '#fff',borderRadius: 4,margin: 10}}>
                <View style={[styles.itemStyle]}>
                    <Image source={require('../../image/workStatus/start.png')} style={{marginRight: 10}}/>
                    <View style={styles.contentView}>
                        <Text>开始日期</Text>
                        <DatePicker
                            style={{width: 150}}
                            date={this.state.date}
                            mode="date"
                            placeholder="请选择开始日期"
                            format="YYYY-MM-DD"
                            confirmBtnText="确定"
                            cancelBtnText="取消"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateTouchBody: {
                                    borderWidth: 0
                                },
                                dateInput: {
                                    marginLeft: 36,
                                    borderWidth: 0,
                                    alignItems: 'flex-end',
                                    paddingRight: 2
                                },
                                dateText: {
                                    color: '#999'
                                },
                                placeholderText: {
                                    color: '#999'
                                }
                            }}
                            iconComponent={<AntDesign name="right" color="#C1C1C1"/>}
                            onDateChange={(date) => {this.setState({date: date},() => {this.getNextData()})}}
                        />
                    </View>
                </View> 
                <View style={styles.itemStyle}>
                    <Image source={require('../../image/workStatus/stop.png')} style={{marginRight: 10}}/>
                    <View style={styles.contentView}>
                        <Text>结束日期</Text>
                        <DatePicker
                            style={{width: 150}}
                            date={this.state.date1}
                            mode="date"
                            placeholder="请选择结束日期"
                            format="YYYY-MM-DD"
                            confirmBtnText="确定"
                            cancelBtnText="取消"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateTouchBody: {
                                    borderWidth: 0
                                },
                                dateInput: {
                                    marginLeft: 36,
                                    borderWidth: 0,
                                    alignItems: 'flex-end',
                                    paddingRight: 2
                                },
                                dateText: {
                                    color: '#999'
                                },
                                placeholderText: {
                                    color: '#999'
                                }
                            }}
                            iconComponent={<AntDesign name="right" color="#C1C1C1"/>}
                            onDateChange={(date) => {this.setState({date1: date},() => {this.getNextData()})}}
                        />
                    </View>
                </View>
                <TouchableOpacity style={[styles.itemStyle,{marginLeft: 2}]} onPress ={() => {this.showTypeDataList()}}>
                    <Image source={require('../../image/troubleDetails/leavel.png')} style={{marginRight: 10}}/>
                    <View style={[styles.contentView,{borderBottomWidth: 0}]}>
                        <Text>培训类型</Text>
                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            <Text style={{color: '#999',marginRight: 2}}>{this.state.typeData&&this.state.typeData.fName?this.state.typeData.fName:'请选择维修级别'}</Text>
                            <AntDesign name="right" color="#C1C1C1"/>
                        </View>
                    </View>
                </TouchableOpacity>
               
               
                 
            </View>
            
            
        </View>)
    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#F4F4F4' }} />;
    }
    getNextData = () => {
        this.setState({
            pageSize: PAGESIZE
        },() => {
            this.trainplanSelectByPage()
        })
    }
    //分页查询培训计划
    trainplanSelectByPage = async () => {
        const { current, pageSize, currentPage } = this.state;
        if(this.state.date&&this.state.date1){
            if(new Date(this.state.date.replace(/-/g, '/')).getTime() > new Date(this.state.date1.replace(/-/g, '/')).getTime()){
                Toast.show('开始时间不能大于结束时间，请核对');
                return;
            }
        }
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: true,canLoadMore: true});
        } else {
            this.setState({ isLoadMore: true });
        }
        const res = await carshopsServer.trainplanSelectByPage({
            "currentPage": currentPage,
            "pageSize": pageSize,
            'searchBeginTime': this.state.date?parseTime(this.state.date): null,
            'searchEndTime':this.state.date1?parseTime(this.state.date1): null,
            'trainPlanTypeId': this.state.typeData.fId,
            'state': [3]
        })
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: false });
        } else {
            this.setState({ isLoadMore: false });
        }
        if (res.success) {
            let dataSource = [...res.obj.items];
            this.setState({
                dataSource,
            })
            if (this.state.pageSize >= res.obj.itemTotal) {
                this.setState({
                    canLoadMore: false
                })
            }
        } else {
            Toast.show(res.msg);
        }
    }
     //picker确认改值
     onPickerSelect = () => {
        const {typeData, changeData} = this.state;
        console.log(changeData);
        this.setState({
            showPicker: false,
            typeData: {
                index: changeData.index,
                fName: changeData.fName?changeData.fName: typeData.fName,
                fId: changeData.fId != null?changeData.fId: typeData.fId,
            },
        },() => {this.getNextData()})
    }
    //查询所有培训类型名称
    TTrainTypeSelectAll = async () => {
        const res = await carshopsServer.TTrainTypeSelectAll();
        if(res.success){
            console.log(res);
            this.setState({
                typeDataList: res.obj
            })
        }else{
            console.log(res.msg);
        }
    }
    // 展开选择所有培训类型名称
    showTypeDataList = () => {
        let typeDataList = [...this.state.typeDataList]
        const { typeData } = this.state;
        if(typeDataList.length > 0){
            const selectList = typeDataList.map((data, index)=>{
                return {
                    index: index,
                    fId: data.fId,
                    fName: data.fTypeName
                }
            });
            
            this.setState({
                itemList: selectList,
                pickerList: selectList.map((data)=>(data.fName)),
                changeData: selectList[typeData.index],
                showPicker: true,
                showDouble: false
            });
        } 
        
    }
    // picker滚动的时候改值
    onPickerChange = (index) => {
        const { changeData, itemList } = this.state;
        this.setState({
            changeData: itemList[index]
        });
    }
    renderItem = ({item,index}) => {
        return (<TouchableOpacity style={styles.listItem} onPress={() => {this.props.navigation.push('CultivateDetail',{item: item,peopleType: 1,showType: 2})}}>
        <View style={{flex: 6}}>
            <View style={styles.itemTitle}>
                <View style={{flexDirection: "row",alignItems: "center"}}>
                    <Text style={{marginRight: 12,color: "#333",fontSize: 14,fontWeight: "500"}}>{item.fName?item.fName: null}</Text>
                </View>
            </View>
            <View style={{paddingLeft: 13,paddingBottom: 11}}>
                <View style={styles.lineText}>
                    <Text style={styles.leftText}>类   型</Text>
                    <Text style={styles.rightText}>{item.fTypeName?item.fTypeName: '--'}</Text>
                </View>
                <View style={styles.lineText}>
                    <View style={[styles.lineTwiceText,{marginRight: 25}]}>
                        <Text style={styles.leftText}>人   数</Text>
                        <Text style={styles.rightText}>{item.fPersonNumber !=null? item.fPersonNumber : null}</Text>
                    </View>
                    <View style={styles.lineTwiceText}>
                        <Text style={styles.leftText}>课程数</Text>
                        <Text style={styles.rightText}>{item.courseNumber != null? item.courseNumber: "--"}</Text>
                    </View>
                </View>
                <View style={styles.lineText}>
                    <Text style={styles.leftText}>时   间</Text>
                    <Text style={styles.rightText}>{item.fBeginTime?parseDate(item.fBeginTime,'YYYY.MM.DD'): '--'}</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>) }
    render() {
        const { type, showMoreSearch, derviceName, manufacturerData} = this.state;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="培训记录"
                    hidePlus={type == 1}
                    
                />
                <Modal
                    animationType={'fade'}
                    transparent
                    visible={this.state.showPicker}
                    onRequestClose={() => {}}
                    >
                    <View style={styles.modalStyle}>
                        <View style={styles.selectModalTop}>
                            <View style={styles.selectModalBody}>
                                <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        showPicker: false,
                                        changeData: {}
                                    })
                                }}
                                >
                                <Text style={{ fontSize: 14, color: '#508DCE' ,marginLeft: 8}}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.onPickerSelect}
                                >
                                <Text style={{ fontSize: 14, color: '#508DCE' ,marginRight: 8 }}>确定</Text>
                                </TouchableOpacity>
                            </View>
                            <Picker
                                style={{ width: width, height: 180 }}
                                itemStyle={{ color: 'black', fontSize: 22 }}
                                selectedValue={this.state.selectedItem}
                                onValueChange={(index) => this.onPickerChange(index)}>
                                {this.state.pickerList.map((value, i) => (
                                    <PickerItem label={value} value={i} key={value}/>
                                ))}
                            </Picker>
                        </View>
                    </View>
                </Modal>
                    <FlatList
                            style={{flex: 1}}
                            data={this.state.dataSource}
                            // keyExtractor={(item)=>item.fId}
                            refreshControl={
                                <RefreshControl
                                    title={'Loading'}
                                    colors={['#000']}
                                    refreshing={this.state.refreshing}
                                    onRefresh={() => {
                                        this._onRefresh();
                                    }}
                                />
                            }
                            renderItem={this.renderItem}
                            refreshing={this.state.refreshing}
                            //加载更多
                            ListHeaderComponent={this.listHead}
                            ListFooterComponent={this._createListFooter}
                            ListEmptyComponent={<Text style={{width:'100%', textAlign: 'center',marginTop: 10,color: '#c9c9c9', paddingBottom: 80}}>暂无数据</Text>}
                            onEndReached={() => this._onLoadMore()}
                            onEndReachedThreshold={0.1}
                            ItemSeparatorComponent={()=>this._separator()}
                        />
            </View>
        );
    }
}


export default DeviceMaintain;

const styles = StyleSheet.create({
    itemStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 50,
        paddingLeft: 10,
    },
    contentView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingRight: 10
    },
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    content: {
        backgroundColor: '#F4F4F4',
    },
    // item: {
    //     backgroundColor: '#fff',
    //     paddingTop: 20,
    //     paddingBottom: 20,
    //     marginBottom: 6,
    //     display: "flex",
    //     flexDirection: 'column',
    //     alignItems: 'center'
    // },
     //picker
     modalStyle: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center'
    },
    selectModalTop: {
        width: width,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0
      },
    selectModalBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 5,
        paddingTop: 8,
        paddingBottom: 8,
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1
    },
    footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 20,
        paddingBottom: 10
    },
    listItem: {
        backgroundColor: '#fff',
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1,
        flexDirection: "row",
        marginRight: 15,
        marginLeft: 15,
        paddingLeft: 15,
        paddingTop: 15
    },
    typeButton: {
        width: 44,
        height: 20,
        backgroundColor:"#D2FFF6",
        alignItems: "center",
        justifyContent: "center"
    },
    itemTitle: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18
    },
    leftText: {
        color: "#999",
        fontSize: 12,
        marginRight: 16
    },
    rightText: {
        color: "#666",
        fontSize: 16,
        fontWeight: "500",
        marginRight: 5
    },
    barText: {
        height: 40,
        lineHeight: 40,
        fontSize: 16,
        fontWeight: "600",
        flex: 1,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#fff"
    },
    lineText:{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14
    },
    lineTwiceText: {
        flexDirection: "row",
        alignItems: "center"
    },
});
