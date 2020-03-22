import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./index.scss"
import classNames from "classnames";

interface Props{
    options:Array<any>
    height?:string | number
    width?:string | number
    iconSize?:string | number
    current:number
}

export default class option extends Component <Props,{}>{
    static defaultProps = {
        options:[1,2],
        height:50,
        width:200,
        iconSize:30,
        current:0
    }

    
    constructor(){
        super(...arguments)
        this.state = {
            open:false
        }
    }

    handleClick(){
        this.setState({
            open:!this.state.open
        })
    }

    handleSelect(item,index){
        this.props.optionSelect({value:item,index})
        this.setState({
            open:false
        })
        // console.log(this)
        // this.setState({
        //     current:i
        // })
    }
    render(){
        const { options,height,width,iconSize,current } = this.props;
        const { open } = this.state
        return (
            <View>
                 <View className="option_item" style="margin-right:40rpx">
                    <View className="title" onClick={this.handleClick}>
                        {
                            options[current].title ? 
                            (
                                <Text>{options[current].title}</Text>                      
                            ) :
                            (
                                <Text>标题</Text>
                            )
                            
                        }
                        <View className="at-icon at-icon-chevron-down"></View>
                    </View>
                    <View className="option_popup" style={{height:open ? (height * options.length) + 'rpx' : ''}}>
                        {
                            options.map((item,index)=>{
                                return (
                                    <View onClick={this.handleSelect.bind(this,item,index)} className={classNames("popup_item",current == index ? 'curPopup' : '')}>{item.title}</View>
                                )
                            })
                        }
                    </View>
                </View>
            </View>
        )
    }
}
