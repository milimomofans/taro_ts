export interface State {
    userInfo:userInfo | null,
    options:Array<{
        name:string,
        route:string
    }>
}
interface userInfo {
    userAvatar:string,
    userName:string,
    userId:string | number,
    userPhone:string | number,
    accountId:number
}
