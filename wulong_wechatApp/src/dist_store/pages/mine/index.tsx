import { ComponentClass } from "react"
import Taro, { Component, Config } from "@tarojs/taro"
import { View, Image, Text } from "@tarojs/components"
import { tabbar } from '../../config/index';

import  api from '../../../utils/api';

import { State } from './type'

import { WtTopBar } from "water-ui";
import { AtIcon,AtTabBar } from "taro-ui";

import './index.scss';




export default class Index extends Component <{},State> {
  constructor(){
    super(...arguments)

    this.state = {
      userInfo:null,
      options:[
        {name:"分享成果",route:""},
        {name:"历史分享",route:""},
        {name:"分享统计",route:""}
      ]
    }
  }
  componentWillMount() {}

  componentDidMount() {
    this.getUserInfo()
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  getUserInfo(){
    api['user/userInfo']().then(res=>{
      console.log(res)
      this.setState({
        userInfo:res  
      })
    })
  }

  

  render () {
    const { userInfo,options } = this.state
    return (
      <View className='index'>
        <WtTopBar
          isWhite={false}
          showFilter={false}
          backgroundColor="#2FCB88"
        /> 
        <AtTabBar
            fixed
            tabList={tabbar}
            onClick={this.handleClick.bind(this)}
            current={2}
        />        
        <View className="userInfo_content">
            {
              userInfo ?  
              <View className="userInfo_box">
                <View className="avatar">
                    <Image src={userInfo.userAvatar} />
                </View>
                <View className="userName" >{userInfo.userName}</View>
              </View>
              : null    
            }
           
        </View>
        <View className="options_content">
            {
              options.map((item)=>{
                return (
                  <View  className="option_item">
                      <Text>{item.name}</Text>
                      <AtIcon 
                      value="chevron-right"
                      size="15"
                      ></AtIcon>
                  </View>
                )
              })
            }
        </View>
      </View>
    )
  }

  handleClick(e){
    Taro.reLaunch({
      url:tabbar[e].route
    })
  }
}


