import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity,TextInput,ImageBackground, ScrollView,Image, FlatList,RefreshControl} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import organizationServer from '../../service/organizationServer';
import Header from '../../components/header';
import Toast from '../../components/toast';

const {width, height} = Dimensions.get('window');
export default  class Organize extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    constructor(props) {
        super(props);
        this.state = {
            obj: []
        };
    }

    componentDidMount() {
      SplashScreen.hide();
      this.selectTargetYear();
      
    }

    selectTargetYear = async () => {
        const res = await organizationServer.selectTargetYear();
        console.log(res);
        if(res.success){
           this.setState({
                obj:res.obj
           })
        }else{
            console.log(res.msg)
        }
    }
    render() {
        const { pop } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="安全目标"
                    hidePlus={true} 
                />
                <View style={{paddingLeft: 15,paddingRight: 15}}>
                    {
                        this.state.obj.length != 0 ?this.state.obj.map((item) => {
                            return (<TouchableOpacity onPress={() => {this.props.navigation.navigate('Responsibility',{item})}}>
                                <ImageBackground  source={require('../../image/documentIcon/blue.png')} style={styles.saveItems} >
                                    <Text style={{color: "#fff",fontSize: 22}}>{item.fYear?item.fYear: '--'}年安全目标责任书</Text>
                                    <Text style={{color: "#fff",fontSize: 14,marginTop: 5}}>共{item.fNum?item.fNum:'--'}份</Text>
                                </ImageBackground>
                        </TouchableOpacity>)
                        }) : <Text style={styles.tipsText}>暂无文件</Text>
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
    },
    saveItems:{
        
        height: 107,
        marginTop: 16,
        justifyContent: "center",
        paddingLeft: 15
    },
    tipsText: {
        width,
        height: 40,
        textAlign: "center",
        alignContent: "center",
        paddingTop: 10,
        fontSize: 16,
        marginLeft: -15
    }
    
});
