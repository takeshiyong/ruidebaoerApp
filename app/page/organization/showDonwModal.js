import React from "react";
import { ActivityIndicator, StyleSheet,WebView, Text, View,Dimensions,TouchableOpacity, Linking,Image,TextInput} from "react-native";
import Toast from '../../components/toast';
import Feather from 'react-native-vector-icons/Feather';
import config from '../../config/index';

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;

/**
 * 规章制度
 *  开启  
 *  关闭   
 */
 
export default class showModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal : false,
            item: {}
        };
    }
    show = (item) => {
      this.setState({showModal: true})
      if(item){
          console.log(item);
          this.setState({
            item,
          })
      }
    };
    hide = () => {
      this.setState({
          showModal: false,
        })
    };
    getDetailWay = (fType) => {
        switch (fType){
            case 'jpeg': 
                return require('../../image/documentIcon/image.png');
            case 'jpg': 
                return require('../../image/documentIcon/image.png');
            case 'gif': 
                return require('../../image/documentIcon/image.png');
            case 'png': 
                return require('../../image/documentIcon/image.png');
            case 'pdf': 
                return require('../../image/documentIcon/pdf.png');
            case 'ppt': 
                return require('../../image/documentIcon/ppt.png');
            case 'xls':
                return require('../../image/documentIcon/excel.png');
            case 'xlsx':
                return require('../../image/documentIcon/excel.png');
            case 'doc':
                return require('../../image/documentIcon/word.png');
            case 'docx':
                return require('../../image/documentIcon/word.png');
            default:
                return require('../../image/documentIcon/unfile.png');
        } 
        
    }
    downFile = (file) => {
        console.log(config.imgUrl + file.fFileLocationUrl +"?filename=" + file.fFileName)
        Linking.openURL(config.imgUrl + file.fFileLocationUrl +"?filename=" + file.fFileName).catch(err => console.error('An error occurred', err));
    }
    showThisFile = (file) => {
        console.log(file);
        return(
        <WebView
            style={{borderWidth: 1,borderColor: 'red',flex: 1}}
            originWhitelist={["*"]}
            scrollEnabled={false}
            source={{uri: config.imgUrl + file}}
            onError={syntheticEvent => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
            }}
            onLoadProgress={({ nativeEvent }) => {
              console.log('nativeEvent.progress', nativeEvent.progress);
            }}
          />)
    }
    render() {
        const {item} = this.state;
        if (!this.state.showModal) {
            return null;
        }
        
        return (
            <View style={{
                flex : 1,
                width : width,
                height : height,
                position : 'absolute',
                backgroundColor : 'rgba(0,0,0,.8)',
            }}>
                <TouchableOpacity style={styles.xButton} onPress={() => {this.setState({showModal: false,item: {}})}}>
                    <Feather name={'x'} size={40} style={{ color: '#fff',lineHeight: 35}} />
                </TouchableOpacity>
                <View style={{flex: 1,alignItems: "center",justifyContent: "center"}}>
                    <Image source={this.getDetailWay(item.fCoursewareTitle)} style={{width: 100, height: 100}}/>
                    <Text style={{color:"#fff",marginTop: 10}}>{item.fFileName?item.fFileName: '--'}</Text>
                    {/* <TouchableOpacity style={[styles.clickButton,{marginTop: 90}]} onPress={() => {this.showThisFile(item.fFileLocationUrl)}}>
                        <Text style={{color:"#333"}}>预览</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={[styles.clickButton,{backgroundColor: "#4058FD"}]} onPress={() => {this.downFile(item)}}>
                        <Text style={{color:"#fff"}}>下载</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    xButton: {
        height: 30,
        alignItems: "center",
        position: "absolute",
        top: 50,
        right: 10

    },
    clickButton: {
        backgroundColor: "#fff",
        width: 130,
        height: 30,
        marginTop: 25,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5
    }
});
