//底部弹出框 点击相机，相册
import React, {Component} from 'react';
import {
  View, Text, StyleSheet, Modal,
   TouchableOpacity, NativeModules, Dimensions,TouchableHighlight
} from 'react-native';



var ImagePicker = NativeModules.ImageCropPicker;

const {width, height} = Dimensions.get('window');

export default class photograph extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isShow != this.state.isShow) {
      this.setState({
        isShow: nextProps.isShow
      });
    }
  }
  //消失整个弹出框
  displayPhotograph = () => {
    this.props.showPhotograph(false);
  }
  //设置过大文件
  settingPhotograph = (image,size) => {
    // if(image.size > size){
    //     alert('文件过大，请重新选择'); 
    //     // this.cleanupSingleImage()
    //     return 
    // }else{
      this.props.postPhoto({
          image: {uri: image.path,width: image.width, height: image.height, mime: image.mime || null}
      })  
    // }  
  }
  // 清除单个文件
  cleanupSingleImage = () => {
    let image = this.state.image || (this.state.images && this.state.images.length ? this.state.images[0] : null);
    console.log('will cleanup image', image);

    ImagePicker.cleanSingle(image ? image.uri : null).then(() => {
      console.log(`removed tmp image ${image.uri} from tmp directory`);
    }).catch(e => {
      alert(e);
    })
  }
  //选择照相机
  pickSingleWithCamera = (cropping) => {
    ImagePicker.openCamera({
      cropping: cropping,
      width: 300,
      height: 300,
      includeExif: true,
    }).then(image => {
      console.log('received image', image);
      this.displayPhotograph();
      this.settingPhotograph(image, 100000)
    }).catch(e => console.log(e));
  }
  //选择录影
  pickSingleWithVideo = () => {
    ImagePicker.openCamera({
      mediaType: 'video',
      includeExif: true,
      width: 300,
      height: 300, 
    }).then(image => {
      console.log('received image', image);
      this.displayPhotograph();
      this.settingPhotograph(image, 10000000)
    }).catch(e => console.log(e));
  }
  //选择相册
  pickSingle = (cropit, circular=false) => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: cropit,
      cropperCircleOverlay: circular,
      compressImageMaxWidth: 640,
      compressImageMaxHeight: 480,
      compressImageQuality: 0.5,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
    }).then(image => {
      console.log('received image', image);
      this.displayPhotograph();
      this.settingPhotograph(image, 10000000);
    }).catch(e => {
      console.log(e);
      Alert.alert(e.message ? e.message : e);
    });
  }


  render() {
    return (
  <View>
    <Modal
      transparent={true}
      visible={this.props.isShow}
      animationType='fade'   
    >
      <View style={styles.container}>
        <View style={styles.ShowCase}>
          <TouchableOpacity onPress={() => this.pickSingleWithCamera(false)} style={styles.button}>
            <Text style={styles.text}>拍照</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.pickSingleWithVideo()} style={[styles.button,styles.line]}>
            <Text style={styles.text}>录像</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.pickSingle(false)} style={styles.button}>
            <Text style={styles.text}>从相册选择</Text>
          </TouchableOpacity>
        </View>
        <TouchableHighlight
            onPress={() => {this.displayPhotograph()}} 
            style={styles.cancle}>
            <Text style={styles.text}>取消</Text>
        </TouchableHighlight>
      </View>
      
        
    </Modal>
    </View>);
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.1)',
    width,
    height: height-25
  },
  ShowCase: {
    width: 300,
    marginBottom: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 300,
    height: 40,
    borderTopColor: '#fefefe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line:{
    
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#d8d8d8',
    borderTopColor: '#d8d8d8'
  },
  text: {
    color: '#3765d5',
    fontSize: 20,
    textAlign: 'center'
  },
  cancle:{
    height: 40,
    width: 300,
    marginBottom: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }
});