import { request, config } from 'utils'

const { api } = config

export async function getOrderFeeSum (data) {
  return request({
    url: api.getOrderFeeSum,
    method: 'get',
    data,
  })
}

export async function getOrderList (data) {
  return request({
    url: api.getOrderList,
    method: 'get',
    data,
  })
}

export async function getOrderRateList (data) {
  return request({
    url: api.getOrderRateList,
    method: 'get',
    data,
  })
}

export async function orderReview (data) {
  return request({
    url: api.orderReview,
    method: 'post',
    data,
  })
}

export async function updateOrderReconciliation (data) {
  return request({
    url: api.updateOrderReconciliation,
    method: 'post',
    data,
  })
}

export async function updateReturnOrderReconciliation (data) {
  return request({
    url: api.updateReturnOrderReconciliation,
    method: 'post',
    data,
  })
}

export async function refundOrder (data) {
  return request({
    url: api.refundOrder,
    method: 'post',
    data,
  })
}

export async function cancelOrder (data) {
  return request({
    url: api.cancelOrder,
    method: 'post',
    data,
  })
}

export async function convertOrder (data) {
  return request({
    url: api.convertOrder,
    method: 'post',
    data,
  })
}


export async function updateOrderPayType (data) {
  return request({
    url: api.updateOrderPayType,
    method: 'post',
    data,
  })
}

export async function getOrderPayType (data) {
  return request({
    url: api.getOrderPayType,
    method: 'get',
    data,
  })
}

export async function completeOrderReturn (data) {
  return request({
    url: api.completeOrderReturn,
    method: 'post',
    data,
  })
}

export async function cancelOrderReturn (data) {
  return request({
    url: api.cancelOrderReturn,
    method: 'post',
    data,
  })
}

export async function orderReturnReview (data) {
  return request({
    url: api.orderReturnReview,
    method: 'post',
    data,
  })
}

export async function getOrderReturnFeeSum (data) {
  return request({
    url: api.getOrderReturnFeeSum,
    method: 'get',
    data,
  })
}

export async function getOrderReturnList (data) {
  return request({
    url: api.getOrderReturnList,
    method: 'get',
    data,
  })
}

export async function getReturnOrderReconciliation (data) {
  return request({
    url: api.getReturnOrderReconciliation,
    method: 'get',
    data,
  })
}

export async function importOrder (data) {
  return request({
    url: api.importOrder,
    method: 'get',
    data,
  })
}

export async function importFee (data) {
  return request({
    url: api.importFee,
    method: 'get',
    data,
  })
}

export async function getImportPrs (data) {
  return request({
    url: api.getImportOrderPrs,
    method: 'get',
    data,
  })
}

export async function coverOrder (data) {
  return request({
    url: api.coverOrder,
    method: 'post',
    data,
  })
}


export async function getLoanList (data) {
  return request({
    url: api.getLoanList,
    method: 'get',
    data,
  })
}

export async function getLoanType (data) {
  return request({
    url: api.getLoanType,
    method: 'get',
    data,
  })
}

export async function getSubsidyList (data) {
  return request({
    url: api.getSubsidyList,
    method: 'get',
    data,
  })
}

export async function getSubsidyType (data) {
  return request({
    url: api.getSubsidyType,
    method: 'get',
    data,
  })
}

export async function getOrderReconciliation (data) {
  return request({
    url: api.getOrderReconciliation,
    method: 'get',
    data,
  })
}