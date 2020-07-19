import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView,Image,ImageBackground} from 'react-native';
import Header from '../../components/header';



const {width, height} = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    render() {
        const { pop } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="商品核销"
                    hidePlus={false} 
                    props={this.props}
                />
                <View style={{width: "100%",backgroundColor: "#4B74FF",alignItems: "center"}}>
                    <TouchableOpacity style={styles.banner}  onPress={()=>{this.props.navigation.push('ScanQRcode', {fromVerif: true})}}>
                        <ImageBackground style={{width: 306,height: 306,alignItems: "center", justifyContent: "center"}} source={require('../../image/verification/banner.png')}>
                            <Image style={{width:34,height: 34}} source={require('../../image/verification/sq.png')}/>
                            <Text style={{color: "#4058FD",fontSize: 14,marginTop: 14}}>扫码核销</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                    
                </View>
                <View style={styles.box}>
                        <TouchableOpacity style={[styles.item]} onPress={() => this.props.navigation.navigate('Management')}>
                            <Image style={{width:34,height: 34,marginTop: 10}} source={require('../../image/verification/box.png')}/>
                            <Text style={styles.commonText}>商品管理</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.navigate('Record')}>
                            <Image style={{width:34,height: 34,marginTop: 10}} source={require('../../image/verification/open.png')}/>
                            <Text style={styles.commonText}>核销记录</Text>
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
        backgroundColor: "#4B74FF",
        display: "flex"
    },
    box: {
        width: width,
        height: 200,
        position: "absolute",
        bottom: 30,
        paddingLeft: 16,
        paddingRight: 16,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    banner: {
        width: 120,
        height: 120,
        backgroundColor: "#fff",
        borderRadius: 60,
        marginTop: 130, 
        alignItems: "center",
        justifyContent: "center"
    },
    item:{
        width: (width-43)/2,
        alignItems: "center",
        height: 200,
        borderRadius: 10,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    },
    commonText: {
        color: "#333",
        fontSize: 14,
        marginTop: 16,
        fontWeight: "500"
    }
});
