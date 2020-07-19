import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput, Image} from 'react-native';
import Video from 'react-native-video';
import Octicons from 'react-native-vector-icons/Octicons'
import ShowBigPhoto from './showPhoto';
const {width, height} = Dimensions.get('window');

export default class edit extends Component {
  constructor(props){
    super(props);
    this.state = {
      isShow: false,
      index: null,
      modalVisible: false,
      index: null,
      
    };
  }
  //设置头部
  static navigationOptions = () => ({
    header: null
  });

  //展示大图
  _showBigPhoto = (index) => {
    this.refs.viewer.openView();
    this.setState({ index: index});
  
  }
  //隐藏大图
  hidenBigPhoto = (flag) => {
    this.setState({modalVisible: flag});
  }
  //渲染视频
  renderVideo = (video,index) => {
    return (<View style={styles.photo}>
      {this.props.showDelete? 
        <TouchableOpacity style={styles.deltePhoto} onPress ={() => this.props.deltePhoto(index)}> 
          <Octicons name={'x'} size={14} style={{color: "#fff"}} />
        </TouchableOpacity> : null
      }
        <Video source={{ uri: video.uri, type: video.mime }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            height: 104
          }}
          rate={1}
          paused={false}
          volume={1}
          muted={false}
          resizeMode={'contain'}
          onError={e => console.log(e)}
          onLoad={load => console.log(load)}
          repeat={true} 
          ref={(ref: player) => { //方法对引用Video元素的ref引用进行操作
            this.player = ref
          }}
          
          // onPress ={() => this._showBigPhoto(index)}
          />
          
    
    </View>
    );
  }
  
  //渲染照片
  renderImage = (image,index) => {
    return (<View style={styles.photo}>
      {this.props.showDelete? 
        <TouchableOpacity style={styles.deltePhoto} onPress ={() => this.props.deltePhoto(index)}>
          <Octicons name={'x'} size={14} style={{color: "#fff"}} />
        </TouchableOpacity> : null
      }
      
      <TouchableOpacity onPress ={() => this._showBigPhoto(index)}>
        <Image style={{ width: 106, height: 106, resizeMode: 'contain',backgroundColor: '#e5e5e6' }} source={image} />
      </TouchableOpacity>
      
    </View>)
    
  }
  //照片与视频的合并调用
  renderAsset = (image,index) => {
    if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
      return this.renderVideo(image,index);
    }
    return this.renderImage(image,index);
  }
  render() {
   
    return (
      <View>
        {this.renderAsset(this.props.image,this.props.index)}
        <ShowBigPhoto ref={'viewer'} img={this.props.img} index={this.props.indexNum}/>
      </View>
    );
  }
}
const styles = StyleSheet.create({

  deltePhoto:{
    width: 22,
    height: 22,
    backgroundColor: "rgba(33,28,24,.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    position: "absolute",
    top: 0,
    right: 10,
  },
  photo: {
    height: 106,
    width: 106,
    position: "relative",
  }
});
