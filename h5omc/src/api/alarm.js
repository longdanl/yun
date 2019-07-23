import request from '@/utils/request'
//获取告警列表
export function getAlarmList() {
    return request({
        url: './alarms',
        method: 'get'
    })
}
//修改角色信息
export function editRole(id,data) {
    return request({
        url:'./roles/'+id,
        method: 'put',
        data: data
    })
}
//删除角色,双括号是人家后台角度认为的变量
export function deleteRoles(id) {
    return request({
        url: './roles/'+id,
        method: 'delete'
    })
}

//批量删除角色（传参为ids数组）
export function deleteRolesBatch(ids) {
    return request({
        url: './roles/delete',
        method: 'post',
        data: ids
    })
}
//查询
export function getRolesByName(data) {
    return request({
        url: './roles?search='+data,
        method: 'get',
    })
}
//获取角色(分页)
export function getRolesList(data) {
    return request({
        url: './roles?'+data,
        method: 'get'
    })
}
export function sortBy(num,limit,type,data) {
    return request({
        url:'./roles?page='+num+'&page_size='+limit+'&sort='+type+' '+data,
        method: 'get',
    })
}