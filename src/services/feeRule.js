import { request, config } from 'utils'

const { api } = config

export async function getRuleList (data) {
  return request({
    url: api.getRuleList,
    method: 'get',
    data,
  })
}

export async function addRule (data) {
  return request({
    url: api.addRule,
    method: 'post',
    data,
  })
}


export async function updateRule (data) {
  return request({
    url: api.updateRule,
    method: 'post',
    data,
  })
}


export async function deleteRule (data) {
  return request({
    url: api.deleteRule,
    method: 'post',
    data,
  })
}

export async function getRuleStandList (data) {
  return request({
    url: api.getRuleStandList,
    method: 'get',
    data,
  })
}

export async function delectRuleStand (data) {
  return request({
    url: api.delectRuleStand,
    method: 'post',
    data,
  })
}

export async function updateRuleStand (data) {
  return request({
    url: api.updateRuleStand,
    method: 'post',
    data,
  })
}

export async function copyRuleStand (data) {
  return request({
    url: api.copyRuleStand,
    method: 'post',
    data,
  })
}

export async function getFeeRuleAttr (data) {
  return request({
    url: api.getFeeRuleAttr,
    method: 'get',
    data,
  })
}

export async function updateFeeRuleAttr (data) {
  return request({
    url: api.updateFeeRuleAttr,
    method: 'post',
    data,
  })
}

export async function getDeferredStandList (data) {
  return request({
    url: api.getDeferredStandList,
    method: 'get',
    data,
  })
}

export async function addDeferredStand (data) {
  return request({
    url: api.addDeferredStand,
    method: 'post',
    data,
  })
}

export async function updateDeferredStand (data) {
  return request({
    url: api.updateDeferredStand,
    method: 'post',
    data,
  })
}

export async function getDiscountStandList (data) {
  return request({
    url: api.getDiscountStandList,
    method: 'get',
    data,
  })
}

export async function addDiscountStand (data) {
  return request({
    url: api.addDiscountStand,
    method: 'post',
    data,
  })
}

export async function updateDiscountStand (data) {
  return request({
    url: api.updateDiscountStand,
    method: 'post',
    data,
  })
}