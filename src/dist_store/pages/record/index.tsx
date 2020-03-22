import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { WtTopBar } from "water-ui";

import './index.scss'


class Index extends Component {

    config: Config = {
    navigationBarTitleText: '首页'
  }

  componentWillReceiveProps () {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
          <WtTopBar
          title="顶部导航2"
          isWhite={false}
          showFilter={false}
          backgroundColor="#f8f8f8"
        />
        <View className="record_title">
            <View>累计收入金额：<Text style="color:#2FCB88">¥65.00</Text></View>
            <View>当前收益余额：<Text>¥10.00</Text></View>
        </View>
        <View className="record_content">
            <View className="record_item">
                <View><Text>时间</Text></View>
                <View><Text>分润单号</Text></View>
                <View><Text>类型</Text></View>
                <View><Text>分润金额</Text></View>
            </View>
            <View className="record_item">
                <View>2020-01-11</View>
                <View>781787819289</View>
                <View>分润收入</View>
                <View>¥10.00</View>
            </View>
        </View>

      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Index as ComponentClass<PageOwnProps, PageState>
