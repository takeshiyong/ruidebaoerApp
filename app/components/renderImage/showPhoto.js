import React, { Component } from 'react';
import {StyleSheet, Dimensions, Modal} from 'react-native';


import ImageViewer from 'react-native-image-zoom-viewer';

const {width, height} = Dimensions.get('window');

export default class ShowPhoto extends Component{
  static navigationOptions = ({ navigation }) => ({
    header: () => {
         return null
    }
  });
  constructor(props){
    super(props);
    this.state = {
      modalVisible: false
    }
  }

  // renderLoad = () => { //这里是写的一个loading
  //   return (
  //       <View style={{ marginTop: (height / 2) - 20 }}>
  //           <ActivityIndicator animating={true} size={"large"} />
  //       </View>
  //   )
  // }
  openView = () => {
    this.setState({modalVisible: true})
  }
  render() {
    let imgs = this.props.img;
    let arr = [];
      imgs = imgs.map((data)=>{
        if(data.image){
          if(data.image.uri !== null){
            let img = {url: data.image.uri}
            return arr.push(img)
          }
        }else{
          return {url: null}
        }      
      });
    console.log(arr);
    return (
    
        <Modal visible={this.state.modalVisible} transparent={true} >
            <ImageViewer 
              imageUrls={arr} // 照片路径
              enableSwipeDown={true}//下拉实现隐藏，可以调用onCancel
              onCancel = {() => this.setState({modalVisible: false})}
              enableImageZoom={true} // 是否开启手势缩放
              index={this.props.index} // 初始显示第几张
              onClick = {() => this.setState({modalVisible: false})} //点击事件
            />
        </Modal>
      
    )
  }
}

const styles = StyleSheet.create({

});
