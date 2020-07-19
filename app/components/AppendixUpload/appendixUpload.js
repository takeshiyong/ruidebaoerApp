import React from 'react';

import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Text,
  Linking,
  PermissionsAndroid
} from 'react-native';

import ImagePickers from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RNFS from 'react-native-fs';
import RNFileSelector from 'react-native-file-selector';
import _ from 'lodash';

import ImageLarge from '../ImageAbout/ImageLarge';
import VideoLarge from '../ImageAbout/VideoLarge';
import MultChoose from '../ImageAbout/MultChoose';
import config from '../../config/index';
import userService from '../../service/userService';

export const prefixURL = config.imgUrl;
const options = {
  mediaType: 'video',
  durationLimit: 10
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  textView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  imageView: {
    marginBottom: 10,
    marginRight: 20
  },
  imgView: {
    position: 'relative'
  },
  closeIcon: {
    position: 'absolute',
    top: 0,
    right: 20,
    zIndex: 2,
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  upLoading: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#efefef'
  }
});
export default class AppendixUpload extends React.Component {
  state= {
    imgPhotos: this.props.value || [], // 三个属性 id path status: uploading success error
    showMultChoose: false,
    currentLength: 0, // 当前图片
    totalLength: 0, // 上传总数
    uploadArr: []
  };

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        imgPhotos: nextProps.value
      })
    }
  }

  cameraAction = async () => {
    if (Platform.OS === 'ios') {
      ImagePickers.openPicker({
        multiple: true,
        cropperChooseText: '选择',
        cropperCancelText: '取消',
        loadingLabelText: '等待中...',
        maxFiles: 9,
        includeExif: true
      }).then(images => {
        // height:1500
        // mime:"image/jpeg"
        // modificationDate:"1532000456000"
        // path:"file:///data/user/0/com.pmsapp/cache/react-native-image-crop-picker/4004584.jpg"
        // size:585648
        // width:2000
        console.log('images', images);
        let arr = _.cloneDeep(images);
        this.setState({
          totalLength: arr.length,
          uploadArr: arr
        }, ()=> this.recursiveUpload(this.state.uploadArr));
      });
    } else {
        RNFileSelector.Show(
          {
              title: '选择文件',
              onDone: (path) => {
                this.setState({
                  totalLength: 1,
                  uploadArr: [{uri: path}]
                }, ()=> this.recursiveUpload(this.state.uploadArr));
              },
              onCancel: () => {
                  console.log('cancelled')
              }
          }
      )
    }
  };

  // 递归上传图片
  recursiveUpload(uploadArr) {
    console.log('uploadArr', uploadArr);
    // 如果上传个数为0之后则 关闭上传计数器
    if (uploadArr.length === 0) {
      this.setState({
        currentLength: 0,
        loading: false,
      });
      return;
    }
    // 拿取数组中第一个 对象的地址
    this.setState({
      loading: true,
      currentLength: this.state.currentLength + 1
    });
    let value = '';
    if (Platform.OS === 'android') {
      value = 'file://' + uploadArr[0].uri;
    } else {
      value = uploadArr[0].uri.replace('file://', '');
    }
    let id = new Date().getTime();
    let names = '';
    if (uploadArr[0].name) {
      names = uploadArr[0].name;
    } else {
      names = uploadArr[0].uri.substr(uploadArr[0].uri.lastIndexOf('/')+1);
    }
    console.log(names,'names');
    this.state.imgPhotos.push({id, status: 'uploading',type: 3,fileName: names});
    this.props.onChange(this.state.imgPhotos);
    // 开始上传
    let fileName = new Date().getTime() + value.substring(value.lastIndexOf('.'), value.length);
    let filedata = new FormData();
    
    let file = {uri: value, type: 'multipart/form-data', name: fileName};
    filedata.append('file', file);
    console.log('filedata', filedata)
    userService.fileUpload(filedata)
      .then((responseData) => {
        console.log(responseData);
        if (responseData.success) {
          for (let obj of this.state.imgPhotos) {
            if (obj.id === id) {
              obj.status = 'success';
              obj.path = responseData.data.fFileLocationUrl;
              break;
            }
          }
          // 上传成功 个数变化 递归调取下一个
          uploadArr.splice(0, 1);
          this.recursiveUpload(uploadArr);
        } else {
          for (let obj of this.state.imgPhotos) {
            if (obj.id === id) {
              obj.status = 'error';
              break;
            }
          }
          uploadArr.splice(0, uploadArr.length);
          this.recursiveUpload(uploadArr);
        }
        this.props.onChange(this.state.imgPhotos);
      })
      .catch((error) => {
        console.log('error', error);
        for (let obj of this.state.imgPhotos) {
          if (obj.id === id) {
            obj.status = 'error';
            break;
          }
        }
        uploadArr.splice(0, uploadArr.length);
        this.recursiveUpload(uploadArr);
        this.props.onChange(this.state.imgPhotos);
      })
  }

  // 上传图片
  uploadUrl(value, id) {
    let fileName = new Date().getTime() + value.substring(value.lastIndexOf('.'), value.length);
    let filedata = new FormData();
    let file = {uri: value, type: 'multipart/form-data', name: fileName};
    console.log('file', file);
    filedata.append('file', file);
    userService.fileUpload(filedata)
      .then((responseData) => {
        console.log('responseData', responseData);
        if (responseData.success) {
          for (let obj of this.state.imgPhotos) {
            if (obj.id === id) {
              obj.status = 'success';
              obj.path = responseData.data.fFileLocationUrl;
              break;
            }
          }
        } else {
          for (let obj of this.state.imgPhotos) {
            if (obj.id === id) {
              obj.status = 'error';
              break;
            }
          }
        }
        this.props.onChange(this.state.imgPhotos);
      })
      .catch((error) => {
        console.log('error', error);
        for (let obj of this.state.imgPhotos) {
          if (obj.id === id) {
            obj.status = 'error';
            break;
          }
        }
        this.props.onChange(this.state.imgPhotos);
      })
  }

  // 删除照片
  delImage(id) {
    for (let i = 0; i< this.state.imgPhotos.length; i++) {
      if (this.state.imgPhotos[i].id === id) {
        this.state.imgPhotos.splice(i,1);
        this.props.onChange(this.state.imgPhotos);
        this.setState({imgPhotos:this.state.imgPhotos});
        break;
      }
    }
  }

  // 下载附件
  downFile = (path, fileName) => {
    Linking.openURL(config.imgUrl + path).catch(err => console.error('An error occurred', err));
    // const ExternalDirectoryPath = RNFS.DocumentDirectoryPath;
    // const toLoadPath = `${ExternalDirectoryPath}/${fileName}`;
    // RNFS.downloadFile({
    //     fromUrl: config.imgUrl + path,
    //     toFile: toLoadPath,
    //     progressDivider:0,
    //     begin: (res) => console.log('begin', res) ,
    //     progress: (res) =>  console.log('progress', res)
    // })
    // .promise.then(()=>{
    //   RNFS.readDir(ExternalDirectoryPath).then((res)=>{console.log(res)});
    // })
    // 		.catch((err)=> console.log(err));
  }

  render() {
    return (
      <View style={styles.container}>
        { this.props.disabled ?
            null :
            !this.state.loading ?
              <TouchableOpacity onPress={()=>{this.cameraAction()}}>
                  <Text style={{color: '#4058FD'}}>上传附件</Text>
              </TouchableOpacity> :
              this.state.uploadArr.length !== 0 ?
                <TouchableOpacity
                  onPress={()=>{
                    this.state.uploadArr.splice(0, this.state.uploadArr.length);
                    this.setState({
                      loading: false
                    });
                  }}>
                  <Text style={{color: '#4058FD'}}>上传中 {this.state.currentLength}/{this.state.totalLength}，点击取消</Text>
                </TouchableOpacity>:null
          }
        {
          this.state.imgPhotos?
            this.state.imgPhotos.map((data, index)=>{
              if (data.status === 'uploading') {
                return (
                  <View style={[styles.textView,{marginTop: 5}]} key={data.id}>
                      <Text style={{fontSize: 12,marginRight: 4,maxWidth: '70%'}} numberOfLines={1}>{data.fileName}</Text>
                      <ActivityIndicator size={12} color='#666'/>
                  </View>
                )
              } else if (data.status === 'error') {
                return (
                  <View style={[styles.textView,{marginTop: 5}]} key={data.id}>
                      <Text style={{fontSize: 12,marginRight: 5,maxWidth: '70%',color: '#FF6666'}} numberOfLines={1}>{data.fileName}</Text>
                      <TouchableOpacity onPress={()=>this.delImage(data.id)}>
                        <AntDesign name="closecircle" color="#FF6666"/>
                      </TouchableOpacity>
                  </View>
                )
              }
              return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity style={{maxWidth: '70%'}} key={data.id} onPress={()=>this.downFile(data.path,data.fileName)}>
                    <Text style={{color: '#4058FD',marginRight: 4}} numberOfLines={1}>{data.fileName}</Text>
                  </TouchableOpacity>
                  { this.props.disabled ?
                    null :
                    <TouchableOpacity onPress={()=>this.delImage(data.id)}>
                      <AntDesign name="closecircle" color="#000"/>
                    </TouchableOpacity>
                  }
                </View>
              )
            }): null
        }
        
      </View>
    )
  }
}
