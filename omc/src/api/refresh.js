import request from '../utils/request'
import qs from 'qs'
//登录
//重新获取token
export function refresh(data) {
    return request({
        url: '/api/oauth/token',
        method: 'post',
        auth:{username:"omc",password:"xinyun"},
        data
    })
}
