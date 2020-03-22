import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'

import { WtTopBar } from "water-ui";
import { AtCalendar,AtModal,AtModalContent,AtAccordion,AtList,AtListItem } from "taro-ui"

import './index.scss'


class Index extends Component {
  config: Config = {
    navigationBarTitleText: '首页'
  }

  constructor(){
      super(...arguments)
      this.state =  {
        showTime:false,
        time:{
            start:"2020/3/16",
            end:"2020/3/16"
        },
        showOpt:false
      }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { showTime,time,showOpt } = this.state
    return (
      <View className='index'>
        <WtTopBar
          title="分润商品统计"
          isWhite={false}
          showFilter={false}
          backgroundColor="#f8f8f8"
        />
        <AtModal isOpened={showTime}>
            <AtModalContent>
                <AtCalendar 
                 isMultiSelect={true}
                 onSelectDate={this.test.bind(this)}
                 currentDate={{start:time.start,end:time.end}}
                 format="YYYY/MM/DD"
                />
            </AtModalContent>
        </AtModal>
     
        <View className="head_select">
            <View onClick={this.showSelect} className="time_select">{time.start} - {time.end}</View>
            <View className="other_select">
                <AtAccordion
                    open={showOpt}
                    onClick={this.handleClick.bind(this)}
                    title='点击量'
                >
                    <AtList hasBorder={false}>
                        <AtListItem
                            title='标题文字'
                            arrow='right'
                            thumb='https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
                        />
                    </AtList>
                </AtAccordion>

            </View>
        </View>
        <View>
            
        </View>
      </View>
    )
  }

  showSelect(){
      this.setState({
          showTime:true
      })
  }

  test(e){
      console.log(e)
      let { value } = e 
      if(value.start && value.end){
          let time = {
              start:value.start,
              end:value.end
          }
          this.setState({
            showTime:false,
            time
          })
      }
  }

  handleClick(){
      let { showOpt } = this.state
      this.setState({
          showOpt:!showOpt
      })
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>
