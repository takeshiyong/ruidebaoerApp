import  RootNavigator  from './app/navigation/index';
import React, {Component} from 'react';
import {Platform, StatusBar, Text} from 'react-native';
import { Provider } from 'react-redux';
import store from './app/store/reducers/index';
import {LocaleConfig} from 'react-native-calendars';
import Loading from './app/components/loading';

LocaleConfig.locales['zh-Hans'] = {
  monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
  dayNames: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
  amDesignator: '上午',
  pmDesignator: '下午'
};

LocaleConfig.defaultLocale = 'zh-Hans';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <StatusBar backgroundColor="transparent" translucent={true} barStyle="dark-content"/>
        <RootNavigator/>
        {<Loading ref={(ref)=>global.loading = ref} />}
      </Provider>
    );
  }
}