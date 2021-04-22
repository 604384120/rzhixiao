import { request, config } from 'utils'

const { api } = config

export async function getCreditClassList (data) {
  return request({
    url: api.getCreditClassList,
    method: 'get',
    data,
  })
}

export async function addCreditClass (data) {
  return request({
    url: api.addCreditClass,
    method: 'post',
    data,
  })
}

export async function updateCreditClass (data) {
  return request({
    url: api.updateCreditClass,
    method: 'post',
    data,
  })
}

export async function deleteCreditClass (data) {
  return request({
    url: api.deleteCreditClass,
    method: 'post',
    data,
  })
}

export async function importCreditClass (data) {
  return request({
    url: api.importCreditClass,
    method: 'get',
    data,
  })
}


export async function getImportCreditClassPrs (data) {
  return request({
    url: api.getImportCreditClassPrs,
    method: 'get',
    data,
  })
}


export async function coverCreditClass (data) {
  return request({
    url: api.coverCreditClass,
    method: 'post',
    data,
  })
}

export async function getCreditRuleList (data) {
  return request({
    url: api.getCreditRuleList,
    method: 'get',
    data,
  })
}

export async function updateCreditRule (data) {
  return request({
    url: api.updateCreditRule,
    method: 'post',
    data,
  })
}

export async function getCreditBatchList (data) {
  return request({
    url: api.getCreditBatchList,
    method: 'get',
    data,
  })
}

export async function addCreditBatch (data) {
  return request({
    url: api.addCreditBatch,
    method: 'post',
    data,
  })
}

export async function updateCreditBatch (data) {
  return request({
    url: api.updateCreditBatch,
    method: 'post',
    data,
  })
}

export async function deleteCreditBatch (data) {
  return request({
    url: api.deleteCreditBatch,
    method: 'post',
    data,
  })
}

export async function importCreditBatch (data) {
  return request({
    url: api.importCreditBatch,
    method: 'get',
    data,
  })
}

export async function getCreditBatchDetail (data) {
  return request({
    url: api.getCreditBatchDetail,
    method: 'get',
    data,
  })
}

export async function deleteCreditBatchDetail (data) {
  return request({
    url: api.deleteCreditBatchDetail,
    method: 'post',
    data,
  })
}

export async function getCreditStatistics (data) {
  return request({
    url: api.getCreditStatistics,
    method: 'get',
    data,
  })
}

export async function getUserClassDetail (data) {
  return request({
    url: api.getUserClassDetail,
    method: 'get',
    data,
  })
}

export async function getCreditOperateList (data) {
  return request({
    url: api.getCreditOperateList,
    method: 'get',
    data,
  })
}

export async function getImportCreditBatchPrs (data) {
  return request({
    url: api.getImportCreditBatchPrs,
    method: 'get',
    data,
  })
}

export async function coverCreditBatch (data) {
  return request({
    url: api.coverCreditBatch,
    method: 'post',
    data,
  })
}