import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, TouchableHighlight, Platform, StatusBar, ImageBackground, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import AntDesign from 'react-native-vector-icons/AntDesign';

import config from '../config';
import {sH, sW, sT, barHeight, navHeight,isIphoneX} from '../utils/screen';
import ShadowSelector from './shadowSelector';

const navStyle = navHeight();
const isAndroid = Platform.OS === 'android';
const {width, height} = Dimensions.get('window');
class Header extends Component {
    state = {
      showMenu: false
    }
    backButton = () => {
      this.props.navigation.pop()
      this.props.onRefresh && this.props.onRefresh();
    }
    render() {
        return (
          <View style={[styles.headers]}>
            <View style={{flex: 1}}>
              {
                this.props.backBtn ?
                <TouchableOpacity onPress={() => {this.backButton()}}><Image  style={{width: 25, height: 25,marginLeft: 10}} source={require('../image/goBack.png')}></Image></TouchableOpacity>
                :this.props.leftBtn?
                this.props.leftBtn:null
              }
            </View>
            <View style={this.props.centerStyle||{flex: 1}}>
              {this.props.title?this.props.title:
              <Text 
              numberOfLines={1} 
              ellipsizeMode="tail"
              style={{width: '100%',textAlign: 'center', color: '#fff',fontSize: 16}}>{this.props.titleText?this.props.titleText: ''}</Text>}
            </View>
            <View style={styles.headerTitle}>
                <ShadowSelector props={this.props.props} onRequestClose={()=>this.setState({showMenu: false})} isShow={this.state.showMenu}/>
                {this.props.rightBtn ? this.props.rightBtn : null}
                {this.props.hidePlus ?
                  null:
                  <TouchableOpacity style={{marginRight: 13}} onPress={()=>this.setState({showMenu: true})}>
                      <Image source={require('../image/index/add-plus.png')}></Image>
                  </TouchableOpacity>
                }
            </View>
          </View>
        );  
    }
}

const styles = StyleSheet.create({
    headers: {
        backgroundColor: '#486FFD',
        height: isAndroid ? navStyle.height : (isIphoneX() ? navStyle.height+50 : navStyle.height+20),
        paddingTop: 15,
        display: 'flex',
        flexDirection: "row",
        width,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flex: 1,
      
    },
    
});
export default withNavigation(Header);