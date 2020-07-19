import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity,ActivityIndicator, ScrollView,Image, FlatList,RefreshControl} from 'react-native';
import Header from '../../components/header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import config from '../../config/index';
import IntegralServer from '../../service/integralServer';
import TipModal from '../../components/tipModal';
import Toast from '../../components/toast';


const PAGESIZE = 10;
const {width, height} = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
        obj:[],
        item: {},
        current: null,
        listItem: {},
        showModalTwo: false,
        showModalOne: false,
        id: ''
    }
    
    componentDidMount() {
        if(this.props.navigation.state.params&&this.props.navigation.state.params.item){
            console.log(this.props.navigation.state.params.item)
            this.selectCommMobeilByPage(this.props.navigation.state.params.item.fId)
            this.setState({
                item: this.props.navigation.state.params.item,
                id: this.props.navigation.state.params.item.fId
            })
        }
    }
    //移动端分页查询商品信息（根据商品状态和商品类型）
    selectCommMobeilByPage = async (id) => {
        const res = await IntegralServer.selectCommDetailByCommId(id);
        if(res.success){
            console.log(res)
            this.setState({
                obj: res.obj
            })
        }else{
            console.log(res.msg)
        }
    }
    //下架商品
    ShellOffComm = async () => {
        const res = await IntegralServer.ShellOffComm(this.state.listItem.fId);
        if(res.success){
            Toast.show(res.msg);
            this.selectCommMobeilByPage(this.props.navigation.state.params.item.fId);
            this.setState({showModalTwo: false,current: null})
        }else{
            Toast.show(res.msg);
        }

    }
    //删除上架商品
    delectContent = async () => {
        console.log(this.state.listItem);
        const res = await IntegralServer.delShellByFId(this.state.listItem.fId);
        if(res.success){
            Toast.show(res.msg);
            this.selectCommMobeilByPage(this.props.navigation.state.params.item.fId)
            this.setState({showModalOne: false,current: null})
        }else{
            Toast.show(res.msg);
        }
    }
    render() {
        const { pop } = this.props.navigation;
        const { item, obj} = this.state;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="上架列表"
                    hidePlus={false} 
                    props={this.props}
                />
                <TipModal 
                    showModal={this.state.showModalOne}
                    onCancel={()=>{this.setState({showModalOne: false})}}
                    onOk={this.delectContent}
                    tipText={`您确定删除此条上架商品吗？`}
                />
                <TipModal 
                    showModal={this.state.showModalTwo}
                    onCancel={()=>{this.setState({showModalTwo: false})}}
                    onOk={this.ShellOffComm}
                    tipText={`您确定下架此条上架商品吗？`}
                />
                <View style={{width: "100%",height: '100%',position: 'relative'}}>
                    <View style={{flexDirection: "row",justifyContent: "space-between",padding: 15}}>
                        <View style={{flexDirection: "row"}}>
                            <Text style={{marginRight: 5,color: "#333",fontSize: 16}}>{item.fCommName?item.fCommName:'--'}</Text>
                            <Text style={{color: "#333",fontSize: 16}}>{item.fCommSpecification?item.fCommSpecification:'--'}</Text>
                        </View>
                        <Text style={{color: "#333",fontSize: 16}}>{item.fCommIntegral?item.fCommIntegral:'--'}积分</Text>
                    </View>
                    <View style={{paddingLeft: 15,paddingRight:15,backgroundColor: "#fff"}}>
                        <View style={styles.tipsTitle}>
                            <Text style={styles.topText}>选中</Text>
                            <Text style={styles.topText}>上架积分</Text>
                            <Text style={styles.topText}>上架数量</Text>
                            <Text style={styles.topText}>已兑换</Text>
                        </View>
                        <ScrollView>
                            {
                                obj.length != 0? obj.map((items,index) => {
                                    return(<TouchableOpacity style={[styles.contentText,{borderBottomWidth: index == (obj.length - 1)? 0: 1}]} onPress={() => {this.setState({current: index,listItem: items},() => {console.log(this.state.listItem)})}}>
                                        <View style={styles.centerText}>
                                            <View style={styles.radios}>
                                                <View style={[styles.smallRadios,{backgroundColor: index == this.state.current? "#4058FD": "#fff"}]}></View>
                                            </View>
                                        </View>
                                        <Text style={styles.centerText}>{items.fShelfOnTime}</Text>
                                        <Text style={styles.centerText}>{items.fShelfOnNumber}</Text>
                                        <Text style={styles.centerText}>{items.fExchangeNumber}</Text>
                                    </TouchableOpacity>)
                                }): <Text style={{width,paddingTop: 20,textAlign: "center"}}>无数据</Text>
                            }
                        </ScrollView>
                    </View>
                    {
                        this.state.current != null ?
                        <View style={styles.bottomTap}>
                            <TouchableOpacity style={styles.bottom} onPress={() => {this.props.navigation.navigate('ShelfStore',{selectCommMobeilByPage:this.selectCommMobeilByPage,id: this.state.id,listItem: this.state.listItem,formerlyInter: this.state.item.fCommIntegral})}}>
                                <Text style={styles.textBottom}>编辑</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.bottom} onPress={() => {this.setState({showModalTwo: true,postitem: this.state.listItem})}}>
                                <Text style={styles.textBottom}>下架</Text>
                            </TouchableOpacity> 
                            
                            <TouchableOpacity style={styles.bottom} onPress={() => {this.setState({showModalOne: true,postitem: this.state.listItem})}}>
                                <Text style={styles.textBottom}>删除</Text>
                            </TouchableOpacity>
                        </View> : null
                    }
                    
                </View>
                    
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F8',
        display: "flex"
    },
    tabBar: {
        marginTop: 15,
        height: 40,
        width,
        paddingLeft: 16,
    },
    bottomTap:{
        backgroundColor: "#fff",
        position: "absolute",
        bottom: 70,
        flexDirection: "row",
        paddingLeft: 15,
        paddingRight: 15,
        width,
        height: 60,
        alignItems: "center",
        justifyContent: 'space-between'
    },
    bottom:{
        flexDirection: "row",
        padding: 10,
        width: (width-50)/3,
        borderRadius: 3,
        justifyContent: "center",
        backgroundColor: "#4058FD"
    },
    textBottom: {
        color: "#fff",
        fontSize: 14,
        
    },
    topText: {
        color: "#333",
        fontSize: 14,
        width: (width-30)/4,
        textAlign: "center"
    },
    tipsTitle: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1
    },
    contentText: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: '#E0E0E0',
    },
    radios: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: "#E0E0E0",
        alignItems: "center",
        justifyContent: "center",
    },
    smallRadios: {
        width: 9,
        height: 9,
        
        borderRadius: 4.5
    },
    centerText:{
        width: (width-30)/4,
        textAlign: "center",
        alignItems: "center"
    }
});
