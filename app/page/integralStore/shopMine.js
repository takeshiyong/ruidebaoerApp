import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView} from 'react-native';
import Header from '../../components/header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';



const {width, height} = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    toDetail = (id) => {      
        this.props.navigation.navigate('PhotographEdit', { id });
    }
    render() {
        const { pop } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="积分商城"
                    hidePlus={true} 
                    props={this.props}
                    isMine={true}
                />
                <ScrollView>   
                    <View style={styles.banner}>
                        <Text>wode page</Text>
                    </View>
                </ScrollView> 
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
    banner: {
        width,
        height: 187,
        backgroundColor: "#68B6FD",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
});
