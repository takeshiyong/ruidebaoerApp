import React from 'react';

import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Text
} from 'react-native';

import ImagePickers from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';

import ImageLarge from './ImageLarge';
import VideoLarge from './VideoLarge';
import MultChoose from './MultChoose';
import config from '../../config/index';
import userService from '../../service/userService';

export const prefixURL = config.imgUrl;
const options = {
  mediaType: 'video',
  durationLimit: 10
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
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
export default class CameraUpload extends React.Component {
  state= {
    imgPhotos: this.props.value || [], // 三个属性 id, path, status: uploading success error, type
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

  cameraAction = (type) => {
    if (type === 'video') {
      ImagePicker.launchCamera(options, (response) => {
        // Same code as in above section!
        console.log(response);
        if (response.didCancel) return; 
        let source = '';
        if (Platform.OS === 'android') {
          source = 'file://' + response.path;
        } else {
          source = response.path.replace('file://', '');
        }
        let fileName = source.substring(source.lastIndexOf('/')+1, source.length);
        let id = new Date().getTime();
        this.state.imgPhotos.push({id, status: 'uploading', type: 2, fileName});
        this.props.onChange(this.state.imgPhotos);
        this.uploadUrl(source, id);
      });
    } else if (type === 'camera') {
      ImagePickers.openCamera({
        cropperChooseText: '选择',
        cropperCancelText: '取消',
        loadingLabelText: '等待中...',
        mediaType: 'photo',
        // compressImageQuality: 1
      }).then(images => {
        // height:1500
        // mime:"image/jpeg"
        // modificationDate:"1532000456000"
        // path:"file:///data/user/0/com.pmsapp/cache/react-native-image-crop-picker/4004584.jpg"
        // size:585648
        // width:2000
        console.log(images);
        let source = '';
        if (Platform.OS === 'android') {
          source = images.path;
        } else {
          source = images.path.replace('file://', '');
        }
        let id = new Date().getTime();
        let type = '';
        if (images.mime.indexOf('image') != -1) {
          type = 1;
        }
        if (images.mime.indexOf('video') != -1) {
          type = 2
        }
        let fileName = source.substring(source.lastIndexOf('/')+1, source.length);
        this.state.imgPhotos.push({id, status: 'uploading', type: type, fileName});
        this.props.onChange(this.state.imgPhotos);
        this.uploadUrl(source, id);
      });
    } else if (type === 'picker') {
      let options = {
        multiple: true,
        cropperChooseText: '选择',
        cropperCancelText: '取消',
        loadingLabelText: '等待中...',
        maxFiles: this.props.limit ? this.props.limit : 9,
        includeExif: true
      };
      if (this.props.onlyPic) {
        options = {
          multiple: true,
          cropperChooseText: '选择',
          cropperCancelText: '取消',
          loadingLabelText: '等待中...',
          maxFiles: 9,
          includeExif: true,
          mediaType: 'photo',
        };
      }
      ImagePickers.openPicker({
        ...options
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
    }
  };

  // 递归上传图片
  recursiveUpload(uploadArr) {
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
      value = uploadArr[0].path;
    } else {
      value = uploadArr[0].path.replace('file://', '');
    }
    let id = new Date().getTime();
    let type = '';
    if (uploadArr[0].mime.indexOf('image') != -1) {
      type = 1;
    }
    if (uploadArr[0].mime.indexOf('video') != -1) {
      type = 2
    }
    this.state.imgPhotos.push({id, status: 'uploading', type, fileName: value.substring(value.lastIndexOf('/')+1, value.length)});
    this.props.onChange(this.state.imgPhotos);
    // 开始上传
    let fileName = new Date().getTime() + value.substring(value.lastIndexOf('.'), value.length);
    let filedata = new FormData();
    let file = {uri: value, type: 'multipart/form-data', name: fileName};
    filedata.append('file', file);
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

  render() {
    console.log(this.state.imgPhotos);
    const { onlyPic } = this.props;
    return (
      <View style={styles.container}>
        {
          this.state.imgPhotos?
            this.state.imgPhotos.map((data, index)=>{
              if (data.status === 'uploading') {
                return (
                  <View style={[styles.imgView]} key={data.id}>
                    { this.props.disabled ?
                      null :
                      <TouchableOpacity style={[styles.closeIcon,(index+1)%3 == 0 ? {right: 0} : {}]} onPress={()=>this.delImage(data.id)}>
                        <AntDesign name="close" color="#fff"/>
                      </TouchableOpacity>
                    }
                    <View
                      style={[styles.imageView,{...this.props.imgStyle,backgroundColor: '#eaeaea', justifyContent:'center', alignItems: 'center'},(index+1)%3 == 0 ? {marginRight: 0} : {}]}
                    >
                      <ActivityIndicator size="large" color='#fff'/>
                    </View>
                  </View>
                )
              } else if (data.status === 'error') {
                return (
                  <View style={[styles.imgView]} key={data.id}>
                    { this.props.disabled ?
                      null :
                      <TouchableOpacity style={[styles.closeIcon,(index+1)%3 == 0 ? {right: 0} : {}]} onPress={()=>this.delImage(data.id)}>
                        <AntDesign name="close" color="#fff"/>
                      </TouchableOpacity>}
                    <View
                      style={[styles.imageView,{...this.props.imgStyle,backgroundColor: '#eaeaea', justifyContent:'center', alignItems: 'center'},(index+1)%3 == 0 ? {marginRight: 0} : {}]}
                    >
                      <FontAwesome name="exclamation-triangle" color="red" size={30}/>
                    </View>
                  </View>
                )
              }
              if (data.type == 1) {
                return (
                  <View style={[styles.imgView]} key={data.id}>
                    { this.props.disabled ?
                      null :
                      <TouchableOpacity style={[styles.closeIcon,(index+1)%3 == 0 ? {right: 0} : {}]} onPress={()=>this.delImage(data.id)}>
                        <AntDesign name="close" color="#fff"/>
                      </TouchableOpacity>
                    }
                    <ImageLarge
                      style={[styles.imageView,{...this.props.imgStyle},(index+1)%3 == 0 ? {marginRight: 0} : { }]}
                      source={{uri: prefixURL + data.path}}
                      index={index}
                      arr={this.state.imgPhotos}
                    />
                  </View>
                )
              } else if (data.type == 2) {
                return (
                  <View style={[styles.imgView]} key={data.id}>
                    { this.props.disabled ?
                      null :
                      <TouchableOpacity style={[styles.closeIcon,(index+1)%3 == 0 ? {right: 0} : {}]} onPress={()=>this.delImage(data.id)}>
                        <AntDesign name="close" color="#fff"/>
                      </TouchableOpacity>
                    }
                    <VideoLarge
                      style={[styles.imageView,{...this.props.imgStyle},(index+1)%3 == 0 ? {marginRight: 0} : {}]}
                      source={{uri: prefixURL + data.path}}
                      index={index}
                      arr={this.state.imgPhotos}
                    />
                  </View>
                );
              }
            }): null
        }
        { this.props.disabled || (this.props.limit && this.props.limit == this.state.imgPhotos.length)?
          null :
          !this.state.loading ?
            <TouchableOpacity style={[styles.imageView, {justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F1F6'},{...this.props.imgStyle}, (this.state.imgPhotos.length+1) %3 == 0 ? {marginRight: 0}: {}]} onPress={()=>this.setState({showMultChoose: true})}>
                <Image source={require("../../image/troubleIssue/camera.png")} style={{width: 22, height: 25,marginBottom: 9}}/>
                <Text style={{color: '#999'}}>照片/视频</Text>
            </TouchableOpacity> :
            this.state.uploadArr.length !== 0?
              <TouchableOpacity
                style={[styles.imageView,styles.upLoading, {...this.props.imgStyle}, (this.state.imgPhotos.length+1) %3 == 0 ? {marginRight: 0}: null]}
                onPress={()=>{
                  this.state.uploadArr.splice(0, this.state.uploadArr.length);
                  this.setState({
                    loading: false
                  });
                }}>
                <Text style={{fontSize: 14,marginBottom: 10,color: '#999'}}>{this.state.currentLength}/{this.state.totalLength}</Text>
                <Text style={{fontSize: 16,textAlign: 'center',color: '#34abfd'}}>点击取消</Text>
              </TouchableOpacity>:null
        }
        <MultChoose
          isShow={this.state.showMultChoose}
          cancel={()=>this.setState({showMultChoose: false})}
          data={onlyPic ? [{name: '相机', key: 'camera'},{name: '相册', key: 'picker'}] :
          [{name: '拍摄', key: 'video'},{name: '相机', key: 'camera'},{name: '相册', key: 'picker'}]}
          press={(e)=>this.setState({showMultChoose: false}, ()=>{
            if (Platform.OS === 'android') {
              this.cameraAction(e);
            } else {
              setTimeout(()=>this.cameraAction(e), 600)
            }
          })}
        />
      </View>
    )
  }
}
