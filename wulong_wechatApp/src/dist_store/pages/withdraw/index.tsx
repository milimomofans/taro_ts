import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { WtTopBar } from "water-ui";

import api from '../../../utils/api'
import './index.scss'

interface State {
  amount?:string
  timer:any
  drawInfo:any
}

let timer:any = null

export default class Index extends Component <{},State> {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
    config: Config = {
    navigationBarTitleText: '首页'
  }

  constructor(){
    super(...arguments)
    this.state = {
      amount:'0',
      timer:null,
      drawInfo:null
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { amount } = this.state
    return (
      <View className='index'>
          <WtTopBar
          title="提现"
          isWhite={false}
          showFilter={false}
          backgroundColor="#f8f8f8"
        />
        <View className="title">到账途径：企业打款</View>
        <View className="widhdraw_content">
            <View className="content_title">提现金额</View>
            <View className="input_content">
                <Text>¥</Text>
                <Input type="number" value={amount} onInput={this.inputHandler} placeholder="请输入提现金额"/>
            </View>
            <View className="prompt">
                可提现金额：¥120.89
                <Text onClick={this.doAllDraw}>全部提现</Text>
            </View>
        </View>
        <View className="submit">确定</View>
      </View>
    )
  }

  inputHandler(e){
    console.log(e)
    let { value } = e.detail

    if (!/^(\d?)+(\.\d{0,2})?$/.test(value)) { 
      value = value.substring(0, e.detail.value.length - 1);
    }
    this.setState({
      amount:value
    })

    if(timer){
      clearTimeout(timer)
      timer = null
    }
 
    this.getTotal(value)
  }

  doAllDraw(){
    this.setState({
      amount:120.89
    },()=>{
      this.getTotal(120.89)
    })
  }

  getTotal(value){
    let that = this
    timer = setTimeout(() => {
      api["user/userDraw"]({amount:value}).then(res=>{
        that.setState({
          drawInfo:res
        })
      })
      .catch((err)=>{
        Taro.showToast({
          title:err,
          icon:"none",
          duration:1000
        })
      })
    }, 500);
    // let that = this
    // this.setState({
    //   timer:setTimeout(() => {
    //     api["user/userDraw"]({amount:value}).then(res=>{
    //       console.log(res)
    //     })
    //   }, 500)
    // })
  
  }


}

