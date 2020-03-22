export default [
    {
        name: 'getList',
        method: 'GET',
        desc: '获取商品列表',
        path: '/backend/goods',
        mockEnable: false,
        auth: true,
        needTime: true,
        mockPath: '/mock/9/backend/goods',
        limitParams:false,
        params:{
            title:"",
            type:"",
            appId:"",
            pageNo:1,
            pageSize:10,
            sortBy:""  //排序字段  n最新（默认）  s销量
        }
    },
    {
        name: 'getGoodsDetail',
        method: 'GET',
        desc: '获取商品详情',
        path: 'backend/goods/:id/detail',  ///
        mockEnable: false,
        auth: true,
        needTime: true,
        mockPath: 'mock/9/backend/goods/:id/detail', ///
        limitParams:false
    },
    {
        name:"goodTransform",
        method:"POST",
        desc:"商品分享转链",
        path:"goods/:id/transform",
        mockPath:"mock/9/goods/{id}/transform",
        limitParams:false,
        params:{
            id:""
        },
    }
]