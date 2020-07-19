import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Header from '../../components/header';
import { createMaterialTopTabNavigator } from 'react-navigation';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import MessageList from './list';

const {width, height} = Dimensions.get('window');
export default class MessageMain extends Component {
    static navigationOptions = () => ({
        header: ()=> {
            return  null;
        }
    });

    render() {
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="动态列表"
                    props={this.props}
                />
                <ScrollableTabView
                  tabBarUnderlineStyle={{backgroundColor: '#1890FF',height: 2}}
                  tabBarActiveTextColor={'#1890FF'}
                  tabBarBackgroundColor={'#fff'}
                >
                  <MessageList tabLabel="全部" type={[1,2,3,4,5, 6, 7,8]}/> 
                  <MessageList tabLabel="安全动态" type={[1]}/> 
                  <MessageList tabLabel="奖惩信息" type={[2]}/> 
                  <MessageList tabLabel="任务动态" type={[3]}/> 
                  <MessageList tabLabel="通知" type={[4, 5, 6, 7,8]}/> 
                </ScrollableTabView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});
