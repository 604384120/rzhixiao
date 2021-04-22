import { request, config } from 'utils'

const { api } = config

// 获取招生人员列表
export async function getJoinAccountList (data) {
  return request({
    url: api.getJoinAccountList,
    method: 'get',
    data,
  })
}

// 获取意向学员列表
export async function getIntentionUserList (data) {
  return request({
    url: api.getIntentionUserList,
    method: 'get',
    data,
  })
}

// 获取招生统计列表
export async function getJoinAccountStat (data) {
  return request({
    url: api.getJoinAccountStat,
    method: 'get',
    data,
  })
}

// 添加招生人员
export async function addJoinAccount (data) {
  return request({
    url: api.addJoinAccount,
    method: 'post',
    data,
  })
}

// 推荐入学，退款
export async function updateJoinUserStatus (data) {
  return request({
    url: api.updateJoinUserStatus,
    method: 'post',
    data,
  })
}

// 获取表单
export async function getJoinForm (data) {
  return request({
    url: api.getJoinForm,
    method: 'get',
    data,
  })
}


// 更新表单
export async function updateJoinForm (data) {
  return request({
    url: api.updateJoinForm,
    method: 'post',
    data,
  })
}


// 获取表单属性
export async function getJoinAttr (data) {
  return request({
    url: api.getJoinAttr,
    method: 'get',
    data,
  })
}

// 获取生源列表
export async function getJoinUserList (data) {
  return request({
    url: api.getJoinUserList,
    method: 'get',
    data,
  })
}

// 获取生源详情
export async function getJoinUserInfo (data) {
  return request({
    url: api.getJoinUserInfo,
    method: 'get',
    data,
  })
}

// 招生人员状态
export async function updateJoinAccount (data) {
  return request({
    url: api.updateJoinAccount,
    method: 'post',
    data,
  })
}

// 审核表单
export async function reviewJoinUser (data) {
  return request({
    url: api.reviewJoinUser,
    method: 'post',
    data,
  })
}


// 添加生源
export async function addJoinUser (data) {
  return request({
    url: api.addJoinUser,
    method: 'post',
    data,
  })
}

// 更新
export async function updateJoinUser (data) {
  return request({
    url: api.updateJoinUser,
    method: 'post',
    data,
  })
}

// 获取操作历史
export async function getJoinUserOperate (data) {
  return request({
    url: api.getJoinUserOperate,
    method: 'get',
    data,
  })
}