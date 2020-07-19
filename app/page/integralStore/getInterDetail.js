import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, ImageBackground,ActivityIndicator, FlatList,RefreshControl} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import ShowModal from '../../components/showShopModal';
import Header from '../../components/header';
import Integral from '../../service/integralServer';
import Toast from '../../components/toast';
import config from '../../config/index';


const PAGESIZE = 10;
const {width, height} = Dimensions.get('window');

export default class ShopPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
      }

    //设置头部
    static navigationOptions = () => ({
        header: null
    });
   
    componentDidMount() {
        
    }
    
    render() {
        return(<View>
            <Header
                    backBtn={true}
                    titleText="积分攻略"
                    props={this.props}
                    isMine={true}
                />
                <View style={styles.content}>
                    <Text>隐患上报次数越多越快，获取的积分越高</Text>
                </View>
        </View>)
    }
}
const styles = StyleSheet.create({
    content: {
        padding: 15
    }
});
