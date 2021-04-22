import { request, config } from 'utils'

const { api } = config

// 获取项目核销列表
export async function getVerifySubjectList (data) {
  return request({
    url: api.getVerifySubjectList,
    method: 'get',
    data,
  })
}

// 获取核销统计列表
export async function getVerifySubjectStatisticsList (data) {
  return request({
    url: api.getVerifySubjectStatisticsList,
    method: 'get',
    data,
  })
}

// 获取核销操作历史
export async function getVerifyBillOperateList (data) {
  return request({
    url: api.getVerifyBillOperateList,
    method: 'get',
    data,
  })
}

// 获取核销人
export async function getVerifyAccountList (data) {
  return request({
    url: api.getVerifyAccountList,
    method: 'get',
    data,
  })
}

// 添加项目核销人员
export async function addVerifySubject (data) {
  return request({
    url: api.addVerifySubject,
    method: 'post',
    data,
  })
}

// 修改项目核销人员
export async function updateVerifySubject (data) {
  return request({
    url: api.updateVerifySubject,
    method: 'post',
    data,
  })
}

// 删除项目核销
export async function deleteVerifySubject (data) {
  return request({
    url: api.deleteVerifySubject,
    method: 'post',
    data,
  })
}

// 添加核销账单
export async function addVerifyBill (data) {
  return request({
    url: api.addVerifyBill,
    method: 'post',
    data,
  })
}

// 取消核销
export async function updateVerifyBill (data) {
  return request({
    url: api.updateVerifyBill,
    method: 'post',
    data,
  })
}

// 添加核销账单
export async function addVerifyBillScan (data) {
  return request({
    url: api.addVerifyBillScan,
    method: 'post',
    data,
  })
}
