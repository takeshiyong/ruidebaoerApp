import React, {Component} from 'react';

import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Dimensions,
  Modal,
  TouchableHighlight,
  Platform,
  CameraRoll,
  ActivityIndicator,
  Text
} from 'react-native';

import ImageViewer from 'react-native-image-zoom-viewer';
// import { _Download } from '../common/DownFile';
import config from '../../config/index';

const {width,height} = Dimensions.get('window');
const styles = StyleSheet.create({
  mask: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  }
});

export const prefixURL = config.imgUrl;
export default class ImageLarge extends Component {
  state = {
    showLarge: false,
    showDefault: true
  };

  render() {
    const url = {
      uri: this.props.source.uri
    };
    console.log('urlurl', url);
    let arr = this.props.arr;
    arr = arr.map((data)=>{
      return {url: prefixURL+data.path}
    });
    console.log('this.props.style', this.props.style, this.props.style.width)
    return (
      <View>
        <TouchableOpacity style={this.props.style} onPress={()=>this.setState({showLarge: true})}>
          <Image style={{width: this.props.style[1].width, height: this.props.style[1].height}} source={url} resizeMethod="resize"/>
        </TouchableOpacity>
        {
          this.state.showLarge ?
            <Modal
              animationType={'fade'}
              transparent
              visible={this.props.showLarge}
              onRequestClose={()=>this.setState({showLarge: false})}
            >
              <ImageViewer
                imageUrls={arr}
                enableImageZoom={true}
                onClick={()=>this.setState({showLarge: false})}
                onCancel={()=>this.setState({showLarge: false})}
                onSaveToCamera={false}
                // menuContext={{ saveToLocal: '保存图片', cancel: '取消' }}
                index={this.props.index}
                // onSave={(e)=>{
                //   if (Platform.OS === 'ios') {
                //     let promise = CameraRoll.saveToCameraRoll(e);
                //     promise.then(function(result) {
                //       Toast.show('保存成功');
                //     }).catch(function(error) {
                //       Toast.show('保存失败');
                //     });
                //   } else {
                //     _Download(e);
                //   }
                // }}
                saveToLocalByLongPress={false}
                loadingRender={()=>(<View style={{height: height,justifyContent:'center',alignItems:'center'}}><ActivityIndicator  size="large"/></View>)}
                renderFooter={(e)=>{
                  if (this.state.showDefault) {
                    return null;
                  }
                  return (
                    <TouchableHighlight
                      style={[
                        Platform.OS === 'ios'?{position: 'absolute', bottom: 40, left: width/2-50,width: 100,borderWidth: 1,borderColor: '#c9c9c9',padding: 5,alignItems: 'center',borderRadius: 2,backgroundColor:'rgba(0, 0, 0, 0.3)'}
                        :{marginLeft: width/2 - 50,marginBottom: 30,width: 100,borderWidth: 1,borderColor: '#c9c9c9',padding: 5,alignItems: 'center',borderRadius: 2,backgroundColor:'rgba(0, 0, 0, 0.3)'}]}
                      onPress={()=>this.setState({showDefault: true})}
                    >
                      <Text style={{color: '#c9c9c9'}}>查看原图</Text>
                    </TouchableHighlight>
                  )
                }}
              />
            </Modal> 
            : null
        }
      </View>

    )
  }
}
