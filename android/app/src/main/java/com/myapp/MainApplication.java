package com.myapp;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import ui.fileselector.RNFileSelectorPackage;
import com.rnfs.RNFSPackage;

import com.brentvatne.react.ReactVideoPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.ksyun.media.reactnative.ReactKSYVideoPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import org.lovebing.reactnative.baidumap.BaiduMapPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import org.reactnative.camera.RNCameraPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.imagepicker.ImagePickerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.zyu.ReactNativeWheelPickerPackage;
import cn.jpush.reactnativejpush.JPushPackage;
import com.RNFetchBlob.RNFetchBlobPackage;

import java.util.Arrays;
import java.util.List;

import com.imagepicker.ImagePickerPackage;


public class MainApplication extends Application implements ReactApplication {


  // 设置为 true 将不会弹出 toast
  private boolean SHUTDOWN_TOAST = true;
  // 设置为 true 将不会打印 log
  private boolean SHUTDOWN_LOG = false;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new SvgPackage(),
            new OrientationPackage(),
            new LinearGradientPackage(),
            new RNFileSelectorPackage(),
            new RNFSPackage(),
			      new ReactNativeWheelPickerPackage(),
            new ReactVideoPackage(),
            new SplashScreenReactPackage(),
            new ReactKSYVideoPackage(),
            new RNCWebViewPackage(),
            new BaiduMapPackage(),
            new VectorIconsPackage(),
            new RNCameraPackage(),
            new PickerPackage(),
            new ImagePickerPackage(),
            new RNGestureHandlerPackage(),
            new RNFetchBlobPackage(),
            new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
