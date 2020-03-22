export interface State {
    serachParam:SerachParam,
    sortArr:Array<sortArr>,  
    pageNext:boolean,   //判断是否有分页
    goodsList:Array<goods>,
    keyword:string
}

interface goods {
    id:number,
    goodsId:string,
    title:string,
    pic:string,
    description:string,
    price:number,
    sellPrice:number,
    sellNum:number,
    profitRuleId:string,
    profitMoney:number,
    publish:boolean,
    publishTime:string,
    appId:number,
    createTime:string,
    modifyTime:string
}

interface SerachParam {
    title:string,
    type:string,
    appId:string,
    pageNo:number,
    pageSize:number,
    sortBy:string  //排序字段  n最新（默认）  s销量
}
  
interface sortArr {
    name:string,
    state:Boolean,
    sortBy:string
}
  
