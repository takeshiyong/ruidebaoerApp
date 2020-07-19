import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image} from 'react-native';
import Header from '../../components/header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { navHeight } from '../../utils/screen'
const {width, height} = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    render() {
        const { goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header
                    backBtn={true}
                    titleText="砂石头条"
                    hidePlus={false}
                    props={this.props}
                />
                <ScrollView style={{backgroundColor: '#fff'}}>
                    <Image style={{width:'100%',height:height-navHeight().height,}} source={require('../../image/college/newsdetail.png')} resizeMode={'stretch'}/>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
        display: "flex"
    },
    content: {
        backgroundColor: '#FFF',
        display: "flex",
        flexDirection: "column",
    },
    banner: {
        width:width,
		height: height,
    },  
});
