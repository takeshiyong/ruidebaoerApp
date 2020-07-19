//点击查看大图
import React, {Component} from 'react';

import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';

import ImageViewer from 'react-native-image-zoom-viewer';


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

export default class ImageLarge extends Component {
  state = {
    showLarge: false,
    showDefault: false
  };

  render() {
    const url = {
      uri: this.props.source.uri
    };
    let arr = this.props.arr;
    arr = arr.map((data)=>{
      return {url: data.uri}
    });
    return (
      <View>
        <TouchableOpacity onPress={()=>this.setState({showLarge: true})}>
          <Image style={this.props.style} source={url} resizeMethod="resize"/>
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
                index={this.props.index}
                loadingRender={()=>(<View style={{height: height,justifyContent:'center',alignItems:'center'}}><ActivityIndicator  size="large"/></View>)}
                onDoubleClick={()=>{}}
              />
            </Modal> : null
        }
      </View>

    )
  }
}