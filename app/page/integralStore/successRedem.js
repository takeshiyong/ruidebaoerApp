import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView,Image} from 'react-native';
import Header from '../../components/header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IntegralServer from '../../service/integralServer';
import { parseTime, parseDate } from '../../utils/handlePhoto';
import config from '../../config/index';
import QRCode from 'react-native-qrcode-svg';



const {width, height} = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
        item: {}
    }
    componentDidMount () {
        if (this.props.navigation.state.params && this.props.navigation.state.params.id) {
            this.getForDetails(this.props.navigation.state.params.id)
          }
    }
    //核销确认页核销信息
    getForDetails = async (id) => {
        const res = await IntegralServer.getForDetails(id);
        if(res.success){
            this.setState({
                item: res.obj
            })
        }else{
            console.log(res.msg)
        }
    }
    render() {
        const { pop } = this.props.navigation;
        const { item } = this.state;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="核销信息"
                    hidePlus={true} 
                    props={this.props}
                    isMine={true}
                    onRefresh= {this.props.navigation.state.params.getManegementData}
                />
                <View style={styles.topBar}>
                    <Image style={{width: 28,height: 28,marginRight:16}} source={require('../../image/integarlStore/yes.png')}/>
                    <Text style={{fontSize: 14,color: "#333",fontWeight: "500"}}>恭喜，兑换成功！</Text>
                </View>
                <View style={{paddingLeft: 14,paddingRight: 14,backgroundColor: "#fff",marginTop: 10}}> 
                    <View style={styles.topBox}>
                        <View style={{flexDirection: "row"}}>
                            <Image style={{width: 44,height: 44,marginRight: 16,backgroundColor: "#E0E0E0"}} source={{uri: (config.imgUrl+item.fCommPath)}}/>
                            <View>
                                <View style={{flexDirection: "row"}}>
                                    <Text style={{color: "#333",marginRight: 10}}>{item.fCommName?item.fCommName: '--'}</Text>
                                    <Text style={{color: "#333"}}>{item.fCommSpecification?item.fCommSpecification: '--'}  *{item.fCommodityNumber?item.fCommodityNumber:'--'}</Text>
                                </View>
                                <Text style={{marginTop: 8,color: "#999",fontSize: 12}}>有效期至：{item.fValidTime?parseDate(item.fValidTime,'YYYY-MM-DD HH:mm'): "--"}</Text>
                            </View>
                        </View>
                        <View style={styles.useText}>
                            <Text style={{color: '#FF632E'}}>{item.fIsConversion == 1?'未兑换': (item.fIsConversion == 2? "已兑换": '已过期')}</Text>
                        </View>
                    </View>                    
                    <View style={{width: "100%",alignItems: "center",justifyContent: "center"}}>
                        <View style={{width: 275,height: 343,backgroundColor: "#fff",alignItems: "center"}}>
                            <Text style={{marginTop: 20,color: "#333",fontSize: 14,marginTop: 25}}>劵号：{item.fOrderNumber? item.fOrderNumber: '--'}</Text>
                            {
                                        item.fId? 
                                        <View style={{marginTop: 24}}>
                                        <QRCode
                                            value={item.fId}
                                            size={225}
                                            />
                                        </View>
                                        :null
                            }
                            <Text style={{fontSize: 14,color:"#999",marginTop: 16}}>兑换商品时请出示此码</Text>
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
        backgroundColor: '#F4F4F8',
        display: "flex"
    },
    topBar: {
        width: "100%",
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#fff"
    },
    topBox:{
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: "#E7E7E7",
        borderBottomWidth: 1,
        paddingTop: 20,
        paddingBottom: 16,
        alignItems: "center"
    },
    useText:{
        width: 56,
        height: 20,
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: "#FFECE6",
        borderRadius: 5
    }
});
