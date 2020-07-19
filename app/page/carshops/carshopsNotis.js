import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, PermissionsAndroid,Modal, PanResponder, TouchableOpacity, Image, TouchableHighlight, RefreshControl, Platform, ScrollView} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import {clientHeight, navHeight,isIphoneX} from '../../utils/screen';
import Header from '../../components/header';
import Toast from '../../components/toast';
import deviceServer from '../../service/deviceServer';


const navStyle = navHeight();
const isAndroid = Platform.OS === 'android';
const {width, height} = Dimensions.get('window');
export default class App extends Component {
    state = {
        obj: []
    };
    static navigationOptions = ({ navigation }) => ({
        header: null
    });
    componentDidMount() {
        SplashScreen.hide();
        console.log(this.props.navigation.state.params)
        if (this.props.navigation.state.params && this.props.navigation.state.params.id&&this.props.navigation.state.params.Level != null) {
            this.getSelectByEquipmentId(this.props.navigation.state.params.id,this.props.navigation.state.params.Level)
        }
    }
    //根据设备id查询保养要点
    getSelectByEquipmentId = async (id,level) => {
        const res = await deviceServer.getSelectByEquipmentId(id,level);
        if(res.success) {
            this.setState({
                obj: res.obj
            },() => {console.log(this.state.obj)})
        }else{
            console.log(res.msg);
        }
    }
    render() {
        const {  typeData, taskStatus } = this.state;
        return (
            <View style={styles.container}>
                <Header
                    backBtn={true}
                    titleText="保养要点"
                    hidePlus={true}
                />
                <View style={{paddingLeft: 16,paddingRight: 16}}>
                    <Text style={styles.topTitle}>保养要点</Text>
                    {
                        this.state.obj.length != 0?
                        this.state.obj.map((item) => {
                            return (<View style={styles.noticeCon}>
                                <Text style={{color: "#333",fontSize: 14}}>{item.fMaintainPointsTitle?item.fMaintainPointsTitle: '--'}</Text>
                            </View>)
                        }): <Text style={{width,height: 20,textAlign: "center"}}>无保养要点</Text>
                    }
                    
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
    },
    topTitle:{
        color: "#333",
        fontSize: 16,
        fontWeight: '500',
        paddingLeft: 16,
        marginTop: 16,
        marginBottom: 16
    },
    noticeCon: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#fff",
        borderRadius: 5,
        marginTop: 5
    }
});   
