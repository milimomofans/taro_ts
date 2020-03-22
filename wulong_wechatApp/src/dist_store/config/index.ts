import tabImg from '../static/index'; 
import pageRoute from './pageRoute'



interface tabbar{
    title:string,
    image:string,
    selectedImage:string,
    route:string
}


const tabbar:Array<tabbar> = [
    { title: '商城', image: tabImg.home,selectedImage:tabImg.home_cur,route:"/dist_store/pages/goodsList/index"},
    { title: '统计', image: tabImg.statistic,selectedImage:tabImg.statistic_cur,route:"/dist_store/pages/statistical/index"},
    { title: '我的', image: tabImg.mine,selectedImage:tabImg.mine_cur,route:"/dist_store/pages/mine/index"}
]

export{
    pageRoute,
    tabbar
}




