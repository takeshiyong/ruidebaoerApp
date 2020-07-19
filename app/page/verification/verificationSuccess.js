import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView,Image,ImageBackground} from 'react-native';
import Header from '../../components/header';
import { parseTime, parseDate } from '../../utils/handlePhoto';



const {width, height} = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state ={
        obj: {}
    }
    componentDidMount () {
        console.log(this.props.navigation.state.params)
        if(this.props.navigation.state.params&&this.props.navigation.state.params.obj){
            this.setState({
                obj: this.props.navigation.state.params.obj
            })
        }
    }
    render() {
        const { pop } = this.props.navigation;
        const { obj } = this.state
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="核销成功"
                    hidePlus={false} 
                    props={this.props}
                />
               <ScrollView>
                    <View style={{width: "100%",paddingLeft: 16,paddingRight: 16,backgroundColor: "#fff"}}>
                        <View style={{height: 172,backgroundColor: "#fff",alignItems: "center",justifyContent: "center",borderBottomColor: "#EEEEEE",borderBottomWidth: 1,}}>
                            <Image style={{width:110,height: 78}} source={require('../../image/showShopModal/finish.png')}/>
                            <Text style={{marginTop: 28,color: "#333",fontSize: 16,fontWeight: "500"}}>商品核销成功！</Text>
                        </View>
                   </View>
                    <View style={{paddingLeft: 16,paddingRight: 16,backgroundColor: '#fff',paddingTop: 24}}>
                        <View style={{marginBottom: 12,flexDirection: "row"}}>
                            <Text style={styles.leftText}>订单编号:</Text>
                            <Text style={styles.rightText}>{obj.fOrderNumber?obj.fOrderNumber: '--'}</Text>
                        </View>
                        <View style={{marginBottom: 12,flexDirection: "row"}}>
                            <Text style={styles.leftText}>商品名称:</Text>
                            <Text style={styles.rightText}>{obj.fCommName?obj.fCommName: '--'}</Text>
                        </View>
                        <View style={{marginBottom: 12,flexDirection: "row"}}>
                            <Text style={styles.leftText}>商品规格:</Text>
                            <Text style={styles.rightText}>{obj.fCommSpecification?obj.fCommSpecification: '--'}</Text>
                        </View>
                        <View style={{marginBottom: 12,flexDirection: "row"}}>
                            <Text style={styles.leftText}>商品数量:</Text>
                            <Text style={styles.rightText}>{obj.fCommodityNumber?obj.fCommodityNumber: '--'}</Text>
                        </View>
                        <View style={{marginBottom: 12,flexDirection: "row"}}>
                            <Text style={styles.leftText}>消耗积分:</Text>
                            <Text style={[styles.rightText,{color: "#4058FD"}]}>{obj.fIntegralNumber?obj.fIntegralNumber: '--'}</Text>
                        </View>
                        <View style={{paddingBottom: 24,flexDirection: "row",borderBottomColor: "#EEEEEE",borderBottomWidth: 1,}}>
                            <Text style={styles.leftText}>商品价格:</Text>
                            <Text style={[styles.rightText,{color: '#FF6733'}]}>￥{obj.totalPriceOfGoods?obj.totalPriceOfGoods:'--'}</Text>
                        </View>
                    </View>
                    <View style={{paddingLeft: 16,paddingRight: 16,backgroundColor: "#fff",paddingTop: 24,paddingBottom: 12}}>
                        <View style={{marginBottom: 12,flexDirection: "row"}}>
                            <Text style={styles.leftText}>兑  换  人:</Text>
                            <Text style={styles.rightText}>{obj.departmentName?obj.departmentName:'--'} {obj.fUserName?obj.fUserName:'--'}</Text>
                        </View>
                        <View style={{marginBottom: 12,flexDirection: "row"}}>
                            <Text style={styles.leftText}>核销时间:</Text>
                            <Text style={styles.rightText}>{obj.fWriteOffTime?parseDate(obj.fWriteOffTime,'YYYY-MM-DD HH:mm'): '--'}</Text>
                        </View>
                    </View>
               </ScrollView>
               <View style={{paddingLeft: 16,paddingRight: 16,width: width,flexDirection: "row",marginBottom: 10}}>
                    <TouchableOpacity style={styles.cannelButton} onPress={()=>{this.props.navigation.replace('Record')}}>
                        <Text style={{color: "#333",fontSize: 14}}>查看订单</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.successButton} onPress={()=>{this.props.navigation.push('ScanQRcode', {fromVerif: true})}}>
                        <Text style={{color: "#fff",fontSize: 14}}>继续核销</Text>
                    </TouchableOpacity>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: height,
        backgroundColor: '#F4F4F8',
        display: "flex"
    },
    leftText: {
        marginRight: 10,
        fontSize: 14,
        color: "#999",
        fontWeight: "500"
    },
    rightText: {
        color: "#333",
        fontSize: 14,
        fontWeight: "500"
    },
    cannelButton: {
        flex: 3,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        height: 42,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        marginRight: 13
    },
    successButton: {
        flex: 7,
        height: 42,
        backgroundColor: "#4058FD",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5
    }
});
