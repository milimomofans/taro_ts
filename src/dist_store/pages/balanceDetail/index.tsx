
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker} from '@tarojs/components'
import Option  from "../../components/option/options"
import { WtTopBar } from "water-ui";
import api from "../../../utils/api"
import './index.scss'

export default class Index extends Component {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  state = {
    pageParam:{
      pageNo:1,
      pageSize:10,
      time:""  //YYYY-MM
    },
    typeArr:[
      {title:"收入",type:"IN"},
      {title:"提现",type:"OUT"}
    ],

    current:0,
    userBill:[],
    haveNext:true
  }

  constructor(){
      super(...arguments)
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  changeOption(data){
    this.setState({
      current:data.index
    },
    ()=>{
      this.doInitialize()
    })
  }

  doInitialize(){
    let { pageParam } = this.state
    pageParam.pageNo = 1
    this.setState({
      pageParam,
      haveNext:true,
      userBill:[]
    },()=>{
      this.getUserBill()
    })
  }

  getUserBill(){
    let { pageParam,typeArr,current,userBill } = this.state,
    apiParam = {
      ...pageParam,
      type:typeArr[current].type
    }
    api["user/userBill"](apiParam).then(res=>{
      let {data} = res      
      this.setState({
        userBill:[...userBill,...data]
      })
    })
  }


  onDateChange(e){
    let {pageParam} = this.state
    pageParam.time = e.detail.value
    this.setState({
      pageParam:pageParam
    },()=>{
      this.doInitialize()
    })
  }

  toRecord(){
     
  }

  render () {
    const {pageParam} = this.state
    return (
      <View className='index'>
          <WtTopBar
          title="余额明细"
          isWhite={false}
          showFilter={false}
          backgroundColor="#f8f8f8"
        />
        <View className="options">
            <Picker mode='date' fields="month" onChange={this.onDateChange}>
              <View className='picker'>
                {
                  pageParam.time ? 
                  (
                    <Text>{pageParam.time}</Text>
                  ) :
                  (
                    <View>
                      选择时间 
                      <Text className="at-icon at-icon-chevron-down"></Text>
                    </View>
                  )
                }
              </View>
            </Picker>
            
           <Option options={this.state.typeArr} current={this.state.current} optionSelect={this.changeOption.bind(this)}></Option>
        </View>
        <View className="bdetail_content">
            <View className="bdetail_item">
                <View className="bdetail_item_top">
                    <View>分享收益</View>
                    <View>+100.00</View>
                </View>
                <View className="bdetail_item_bottom">
                    <View>
                        <Text style="margin-right:10rpx">2019/11/01</Text>
                        <Text>14:33:08</Text>
                    </View>
                    <View>余额¥1098</View>
                </View>
            </View>
        </View>

        <View className="bottom_btn">
          {/* {
            [{name:"累计收入总量",type:"IN"},{name:"累计支出总量",type:"OUT"}].map(item=>{
              (
                <View onClick={this.toRecord.bind(this,item.type)} className="btn_item" key={item.type} >{item.name}</View>
              )
            })
          } */}
           
        </View>
      </View>
    )
  }
}
