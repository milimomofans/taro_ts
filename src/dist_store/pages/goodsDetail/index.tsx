import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Swiper, SwiperItem, Image, Button } from "@tarojs/components";
import api from "../../../utils/api"
import "./index.scss";

import { WtTopBar,WtShareButton } from "water-ui";

interface pageState{
  id:string|number,
  detail:detail,
  bannerIndex:number
}

interface detail{
  detail:string,
  goodsId:number | string,
  remark:string,
  thumbImgs:Array<string>,
  thumb:string
}

export default class Index extends Component <{},pageState> {
  constructor(props){
    super(props)

    this.state = {
      id:'',
      detail:{
        detail:'',
        goodsId:'',
        remark:'',
        thumb:'',
        thumbImgs:[]
      },
      bannerIndex:0
    }
  }

  componentWillMount() {
    let params = this.$router.params
    this.setState({
      id:params.id
    },()=>{
      this.getDetail()
    })

  }

  componentDidMount() {
   
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  
  config: Config = {
    navigationBarTitleText: "首页"
  };

  getDetail(){
    let { id } = this.state

    api["goodsList/getGoodsDetail"]({id},{apiParams:{id}})
      .then(res=>{
        this.setState({
          detail:res
        })
        console.log(res)
      })
  }

  posterGenerateSuccess(detail) {
    console.log("画布生成成功", detail);
  }
  posterGenerateFail(e) {
    console.log("画布生成失败", e);
  }
  onBack() {
    Taro.showLoading();
    Taro.navigateBack().then(() => Taro.hideLoading());
  }

  onShareAppMessage() {
    return {
      title: "分享",
      path: "/pages/share-button/index",
      imageUrl:
        "https://qqmylife-dev-1251517655.file.myqcloud.com/mch/att/201907301427/8JmUDPuPtu6jE1PSeQ2b6sNMYWlqakaAkJ7oxACw.png"
    };
  }

  render() {
    const { detail,bannerIndex } = this.state
    return (
        <View className="index">
           <WtTopBar
              title="商品详情"
              isWhite={false}
              showFilter={false}
              backgroundColor="#FFF"
            />
            <View className="banner">
              <Swiper
                className="swiper-container"
                current={bannerIndex}
                onChange={this.changeBanner}
                autoplay
              >
                {
                  detail.thumbImgs.map((item,index)=>{
                    return (
                      <SwiperItem key={index}>
                        <Image src={item} style="width:100%;height:100%"></Image>
                      </SwiperItem>
                    )
                  })
                }
              </Swiper>
              <View className="banner_dot">{bannerIndex}/{detail.thumbImgs.length}</View>
            </View>
            <View className="goods_detail">
                <View className="goods_detailItem">
                  <View >￥119</View>
                  <View>分销成交收益:￥4.00</View>
                </View>
                <View className="goods_title">{detail.detail}</View>
                <View className="goods_otherDetail">
                  <View>成交量:728</View>
                  <View>分享量:26</View>
                </View>
            </View>
            <View className="bottom_btn">
              <WtShareButton
                activityDescription={detail.detail}
                activityPrice="100元"
                codeDescription="二维码描述"
                themeColor="#d6b887"
                posterGenerateSuccess={this.posterGenerateSuccess.bind(this)}
                posterGenerateFail={this.posterGenerateFail.bind(this)}
                codeUrl="https://qqmylife-dev-1251517655.file.myqcloud.com/mch/att/201907301427/8JmUDPuPtu6jE1PSeQ2b6sNMYWlqakaAkJ7oxACw.png"
                activityUrl={detail.thumb}
              >
                <Button className="shareBtn">立即分享</Button>
              </WtShareButton>
              <View className="buy" style="background:linear-gradient(90deg,rgba(72,209,150,1) 0%,rgba(0,203,116,1) 100%)">立即抢购</View>
            </View>
        </View>
    )
  }

  changeBanner(e){
    this.setState({
      bannerIndex:e.detail.current
    })
  }

  toShare(){
    let { id } = this.state

    api["goodsList/goodTransform"]({},{apiParams:{id}}).then(res=>{
      console.log(res)
    })
  } 
}
