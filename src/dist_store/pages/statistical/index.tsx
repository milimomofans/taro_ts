import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import api from "../../../utils/api";
import "./index.scss";
import { WtTopBar } from "water-ui";
import { tabbar } from '../../config/index';
import { AtTabBar } from 'taro-ui'


export default class Index extends Component {
  constructor(){
    super(...arguments)
    this.state = {
      statisticsInfo:null
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.userStatistics()
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  userStatistics(){
    api["user/userStatistics"]().then(res=>{
      // console.log(res)
      this.setState({
        statisticsInfo:res
      })
    })
  }
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: "首页"
  };

  render() {
    const borderBottom = "border-bottom:2rpx solid rgba(244,244,244,1);padding-bottom:36rpx;margin-bottom:40rpx"
    const { statisticsInfo } = this.state
    return (
      <View className='index'>
          <WtTopBar
            title="统计"
            isWhite={true}
            backgroundColor="#000"
            showFilter={false}
          />
          <AtTabBar
            fixed
            tabList={tabbar}
            onClick={this.handleClick.bind(this)}
            current={1}
          />
          <View className="statistics_content">
              <View className="earn_content">
                  <View className="title">当前收益金额</View>
                  <View className="price" style={borderBottom}>￥{statisticsInfo.auditAmount}</View>
              </View>
              <View>
                  <View className="title">当前可提现总金额</View>
                  <View className="price">￥{statisticsInfo.waitDrawAmount}</View>
              </View>
              <View className="withdrawals" onClick={this.routeTo.bind(this,'withdraw')}>提现</View>
              <View className="total">累计收益：￥{statisticsInfo.totalAmount}</View>
          </View>
          <View className="item_btn" onClick={this.routeTo.bind(this,'balanceDetail')}>余额明细</View>
          <View className="item_btn" onClick={this.routeTo.bind(this,'')}>提现记录</View>
      </View>
    );
  }

  routeTo(route){
    let url = `/dist_store/pages/${route}/index`
    Taro.navigateTo({
      url
    })
  }

  handleClick(e){
    Taro.reLaunch({
      url:tabbar[e].route
    })
  }
}
