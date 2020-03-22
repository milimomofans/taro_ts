import Taro, { Component, Config } from "@tarojs/taro";
import { View, Input, Image } from "@tarojs/components";
import api from "../../../utils/api";
import classNames from 'classnames'
import { State } from './type'
import { tabbar } from "../../config/index";

import { WtTopBar } from "water-ui";
import { AtTabBar,AtFloatLayout } from "taro-ui";

import "./index.scss";


export default class Index extends Component <{}, State> {
  constructor(props){
    super(props)
    this.state = {
      serachParam:{
        title:'',
        type:'',
        appId:'',
        pageNo:1,
        pageSize:10,
        sortBy:'n'
      },
      sortArr:[
        {name:"销量排序",state:true,sortBy:"s"},
        {name:"最新分销",state:false,sortBy:"n"}
      ],
      pageNext:true,
      goodsList:[],
      keyword:'',

    }
  }

  componentWillMount() {}

  componentDidMount() {
    this.getList()
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    const { sortArr,goodsList } = this.state
    return (
      <View className='index'>
         <WtTopBar
          title="商城"
          isWhite={false}
          showFilter={false}
          backgroundColor="#FFF"
        />
         <AtTabBar
            fixed
            tabList={tabbar}
            onClick={this.handleClick.bind(this)}
            current={0}
        />
        <View className="serach_content">
          <View className="serach_input">
          <View className='at-icon at-icon-search'></View>
             <Input placeholder="请输入搜索内容" value={this.state.keyword} onInput={this.onInput}></Input>
          </View>
          <View className="serach_btn" onClick={this.onSerach}>搜索</View>
        </View>
        
        <View className="cond_content">
          <View className="sort_content">
            <View className="sort_type">
              <View style="margin-right:30rpx">礼信</View>
              <View className="at-icon at-icon-chevron-down"></View>
            </View>
            {
              sortArr.map((item)=>{
                return (
                   <View  className={classNames('sort_item',item.sortBy == this.state.serachParam.sortBy ? 'curSort_item' : '')}   onClick={this.changeSort.bind(this, item)} >{item.name}</View>
                )
              })
            }
          </View>
        </View>
        
        <View className="goods_content">
          {
            goodsList.map((item)=>{
              return (
                 <View key={item.id} className="goods_item" onClick={this.toDetail.bind(this,item)}>
                  <Image className="goods_headPic" src="" ></Image>
                  <View className="goods_info">
                      <View className="goods_title">{item.title}</View>
                      <View className="goods_price">¥{item.price} </View>
                      <View className="other_info">
                        <View style="margin-right:40rpx">收益：¥{item.profitMoney} </View>
                        <View>销量：{item.sellNum} 件</View>
                      </View>
                  </View>
                </View>
              )
            })
          }
        </View>
          
        <View style="height:130rpx"></View>
      </View>
    );
  }

  onInput(e){
    console.log(e)
    var { serachParam } = this.state
    serachParam.title = e.detail.value
    this.setState({
      serachParam
    })
  }

  onSerach(){
    let { serachParam } = this.state
    serachParam.pageNo = 1
    this.setState({
      goodsList:[],
      serachParam
    },()=>{
      this.getList()
    })
  }
 

  changeSort(item){
    let { serachParam } = this.state
    if(serachParam.sortBy == item.sortBy) return
    serachParam.sortBy = item.sortBy
    
    this.setState({
      serachParam,
      goodsList:[]
    },()=>{
      this.getList()
    })
  }


  getList(){
    let { serachParam } = this.state
    api["goodsList/getList"]({},serachParam)
      .then(res=>{
        let { goodsList } = this.state,
        { data } = res,
        pageNext = true
      
        data.currentPage < data.totalPage ? '' : pageNext = !pageNext
        
        // for(var i = 0;i<goodsList.length;i++){
        //   newArr[i] = goodsList[i]
        // }

        // newArr.push(...data)
        // goodsList = res.data

        this.setState({
          goodsList: [...goodsList,...data],
          pageNext
        },()=>{

        })
        console.log(this.state.goodsList)
      })
  }

  toDetail(item){
    let { id } = item
    Taro.navigateTo({
      url:`/dist_store/pages/goodsDetail/index?id=${id}`
    })
  }

  handleClick(e){
    Taro.reLaunch({
      url:tabbar[e].route
    })
  }
}
