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
import AntDesign from 'react-native-vector-icons/AntDesign';
import Video from 'react-native-video';

const {width,height} = Dimensions.get('window');
const styles = StyleSheet.create({
  mask: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'relative'
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  backBtn: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.9)',
    zIndex: 99,
    alignItems: 'center',
    justifyContent: 'center',
    top: 8,
    left: 7,
    borderRadius: 50
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
    console.log('his.state.showLarge', this.state.showLarge)
    return (
      <View>
        <TouchableOpacity onPress={()=>this.setState({showLarge: false}, ()=>this.setState({showLarge: true}))}>
          <View style={[this.props.style, {justifyContent: 'center', alignItems:'center', backgroundColor: '#F0F1F6'}]}>
            <AntDesign name="playcircleo" color="#999" size={36}/>
          </View>
        </TouchableOpacity>
        {
          this.state.showLarge ?
            <Modal
              animationType={'fade'}
              transparent
              visible={this.props.showLarge}
              onRequestClose={()=>this.setState({showLarge: false},()=>console.log(12312312))}
            >
              <View style={styles.mask}>
                {
                  Platform.OS ==='android' ?
                    <TouchableOpacity style={styles.backBtn} onPress={()=>this.setState({showLarge: false})}>
                      <AntDesign name="arrowleft" color="#fff" size={20}/>
                    </TouchableOpacity> : null
                }
                <Video
                  source={url}   // Can be a URL or a local file.
                  ref={(ref) => {
                    this.player = ref
                  }}                                      // Store reference
                  onFullscreenPlayerDidDismiss={(err)=>{
                    this.setState({showLarge: false});
                    console.log('123', err);
                  }}
                  onFullscreenPlayerWillDismiss={()=>console.log(1231231231231)}
                  // onBuffer={this.onBuffer}                // Callback when remote video is buffering
                  onError={(error)=>console.log('videoError', error)}               // Callback when video cannot be loaded
                  controls={true}
                  style={styles.backgroundVideo} 
                />
              </View>
            </Modal> 
            : null
        }
      </View>

    )
  }
}
