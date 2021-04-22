import { request, config } from 'utils'

const { api } = config

export async function getBillList (data) {
  return request({
    url: api.getBillList,
    method: 'get',
    data,
  })
}

export async function getBills (data) {
  return request({
    url: api.getBills,
    method: 'get',
    data,
  })
}

export async function getBillStatistics (data) {
  return request({
    url: api.getBillStatistics,
    method: 'get',
    data,
  })
}

export async function getBillByUser (data) {
  return request({
    url: api.getBillByUser,
    method: 'get',
    data,
  })
}

export async function updateBill (data) {
  return request({
    url: api.updateBill,
    method: 'post',
    data,
  })
}

export async function updateBatchBill (data) {
  return request({
    url: api.updateBatchBill,
    method: 'post',
    data,
  })
}

export async function updateBatchDeferredBill (data) {
  return request({
    url: api.updateBatchDeferredBill,
    method: 'post',
    data,
  })
}

export async function updateBatchDiscountBill (data) {
  return request({
    url: api.updateBatchDiscountBill,
    method: 'post',
    data,
  })
}

export async function addBatchBill (data) {
  return request({
    url: api.addBatchBill,
    method: 'post',
    data,
  })
}

export async function completeOrder (data) {
  return request({
    url: api.completeOrder,
    method: 'post',
    data,
  })
}

export async function importBillDelete (data) {
  return request({
    url: api.importBillDelete,
    method: 'get',
    data,
  })
}

export async function getFeeBillOperateHistory (data) {
  return request({
    url: api.getFeeBillOperateHistory,
    method: 'get',
    data,
  })
}

export async function getMissionByUser (data) {
  return request({
    url: api.getMissionByUser,
    method: 'get',
    data,
  })
}

export async function getOrderByUser (data) {
  return request({
    url: api.getOrderByUser,
    method: 'get',
    data,
  })
}

export async function getOrderReturnByUser (data) {
  return request({
    url: api.getOrderReturnByUser,
    method: 'get',
    data,
  })
}

export async function importBill (data) {
  return request({
    url: api.importBill,
    method: 'get',
    data,
  })
}

export async function importBillBySubject (data) {
  return request({
    url: api.importBillBySubject,
    method: 'get',
    data,
  })
}

export async function getImportBillPrs (data) {
  return request({
    url: api.getImportBillPrs,
    method: 'get',
    data,
  })
}

export async function coverBill (data) {
  return request({
    url: api.coverBill,
    method: 'post',
    data,
  })
}

export async function getUserListNoBill (data) {
  return request({
    url: api.getUserListNoBill,
    method: 'get',
    data,
  })
}

export async function getDeferredList (data) {
  return request({
    url: api.getDeferredList,
    method: 'get',
    data,
  })
}

export async function getDiscountList (data) {
  return request({
    url: api.getDiscountList,
    method: 'get',
    data,
  })
}

