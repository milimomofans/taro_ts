export default[
    {
        name: 'userInfo',
        method: 'GET',
        desc: '获取用户信息',
        path: '/user',
        mockEnable: false,
        auth: true,
        needTime: true,
        mockPath: '/mock/9/user',
        limitParams:false,
        params:{}
    },
    {
        name:"userStatistics",
        method:"GET",
        desc:"获取用户统计信息",
        path:"/user/statistics",
        mockEnable:false,
        auth: true,
        needTime: true,
        mockPath: '/mock/9/user/statistics',
        limitParams:false,
        params:{}
    },
    {
        name:"userBill",
        method:"GET",
        desc:"获取用户账单信息",
        path:"/user/bill",
        mockEnable:false,
        auth: true,
        needTime: true,
        mockPath: '/mock/9/user/bill',
        limitParams:false,
        params:{
            pageNo:1,
            pageSize:10,
            type:'',
            time:''
        }
    },
    {
        name:"shareHistory",
        method:"GET",
        desc:"获取用户分享历史",
        path:"/user/share/history",
        mockEnable:false,
        auth: true,
        needTime: true,
        mockPath: '/mock/9/user/share/history',
        limitParams:false,
        params:{
            pageNo:1,
            pageSize:10,
            time:''
        }
    },
    {
        name:"userDraw",
        method:"POST",
        desc:"获取用户提现信息",
        path:"user/draw",
        mockEnable:false,
        auth:true,
        needTime:true,
        mockPath:"/mock/9/user/draw",
        limitParams:false,
        header:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        params:{
            amount:0
        }
    },
    {
        name:"drawConfirm",
        method:"POST",
        desc:"用户提现确认",
        path:"/user/draw/confirm",
        mockEnable:false,
        auth:true,
        needTime:true,
        mockPath:"/mock/9/user/draw/confirm",
        limitParams:false,
        params:{
            amount:0,
            version:0
        }
    },
    {
        name:"userDrawList",
        method:"GET",
        desc:"用户提现列表",
        path:"/user/draw",
        mockEnable:false,
        auth:true,
        needTime:true,
        mockPath:"/mock/9/user/draw/confirm",
        limitParams:false,
        params:{
            status:"",
            pageNo:1,
            pageSize:10
        }
    }

]