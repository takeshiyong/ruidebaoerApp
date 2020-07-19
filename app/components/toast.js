import Toast from 'react-native-root-toast'; // 引入类库
// 通过调用 Toast.show(message, options); 可以在屏幕上显示一个toast，并返回一个toast实例

const Msg = {
  show: (msg, duration = 2000)=> {
    Toast.show(msg, {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      textColor: '#fff',
      duration: duration, // toast显示时长
      position: -40, // toast位置
      shadow: false, // toast是否出现阴影
      animation: true, // toast显示/隐藏的时候是否需要使用动画过渡
      hideOnPress: true, // 是否可以通过点击事件对toast进行隐藏
      delay: 0, // toast显示的延时
      onShow: () => {
        // toast出现回调（动画开始时）
      },
      onShown: () => {
        // toast出现回调（动画结束时）
      },
      onHide: () => {
        // toast隐藏回调（动画开始时）
      },
      onHidden: () => {
        // toast隐藏回调（动画结束时）
      }
    });
  }
};

export default Msg;