import Taro, { Component, Config } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import { WtTopBar } from "water-ui";
import api from '../../../utils/api';
import "./index.scss";
import classNames from 'classnames'


export default class Index extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  state = {
      statusArr:[
          {title:"待审",status:"WAITAUDIT"},
          {title:"通过",status:"PASS"},
          {title:"驳回",status:"REJECT"},
          {title:"已打款",status:"REMITTED"}
      ],
      current:0,
      pageParam:{
          pageNo:1,
          pageSize:10
      },
      haveNext:true
  }

  componentWillMount() {}

  componentDidMount() {
      this.getUserDraw()
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  getUserDraw(){
      let { statusArr,current,pageParam } = this.state,
      param = {
        status:statusArr[current].status,
        ...pageParam
      }
      api["user/userDrawList"](param).then(res=>{
          console.log(res)
      })
  }

  handleTab(index){
      console.log(index)
      this.setState({
        current:index
      })
  }

  render() {
    const { statusArr,current } = this.state
    return (
      <View className="index">
           <WtTopBar
              title="提现记录"
              isWhite={false}
              showFilter={false}
              backgroundColor="#FFF"
           />
           <View className="tabs">
               {
                   statusArr.map((item,index)=>{
                       return (
                        <View 
                          className={classNames('tab',index == current ? 'curTab' : '')} 
                          onClick={this.handleTab.bind(this,index)}
                          style={{width:`${100/statusArr.length}%`}}
                          >
                            {item.title}
                        </View>
                       )
                   })
               }
           </View>
           <View className="list_content">
               <View className="list_item">
                   <View className="first_left">红包转入</View>
                   <View className="first_right">¥100.00</View>
               </View>
               <View className="list_item">
                   <View className="second_left">2019/11/21 14:33:08</View>
                   <View className="second_right">审核通过</View>
               </View>
           </View>

      </View>
    );
  }
}
