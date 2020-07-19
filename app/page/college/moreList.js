import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ActivityIndicator,TextInput, Image, RefreshControl, FlatList } from 'react-native';
import Header from '../../components/header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CollegeServer from '../../service/collegeServer';
import config from '../../config/index';
import Toast from '../../components/toast';

const {width, height} = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
        videoSourse: []
    }
    componentDidMount() {
        if (this.props.navigation.state && this.props.navigation.state.params.videoSourse) {
            this.setState({
                videoSourse: this.props.navigation.state.params.videoSourse
            })
          }
    }
    
    render() {
        const { pop } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="播放记录"
                    hidePlus={true} 
                    props={this.props}
                    isMine={true}
                />
                <View style={{width: "100%",padding: 15}}>
                    {
                        this.state.videoSourse.length > 0? 
                        this.state.videoSourse.map((item) => {
                            // console.log(11111111111111111111111,item.courseCoverFile.fFileLocationUrl)
                            return(<TouchableOpacity style={{marginRight: 12,flexDirection: "row",marginBottom: 10}} onPress={() => this.props.navigation.push('Course',{id: item.course.fCourseId})}> 
                                    <Image style={{width: 118,height: 65,backgroundColor: "#D5D5D5",borderRadius: 5}} source={{uri: config.imgUrl + item.courseCoverFile?(item.courseCoverFile.fFileLocationUrl?item.courseCoverFile.fFileLocationUrl: null): null}}/>
                                    <Text numberOfLines={2} style = {[styles.itemText,{marginLeft: 10,marginTop: 8}]}>{item.course?(item.course.fCourseName?item.course.fCourseName:'--'): null}</Text>
                                </TouchableOpacity>)
                        })
                        : <Text>无播放记录</Text>
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        
    },
    itemText:{
        marginLeft: 10,
        fontSize: 14,
        
        color: "#333333"
    }
});
