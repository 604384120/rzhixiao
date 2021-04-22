import { request, config } from 'utils'

const { api } = config

export async function getTemplateList (data) {
  return request({
    url: api.getTemplateList,
    method: 'get',
    data,
  })
}

export async function getTemplateText (data) {
  return request({
    url: api.getTemplateText,
    method: 'get',
    data,
  })
}

export async function updateTemplateText (data) {
  return request({
    url: api.updateTemplateText,
    method: 'post',
    data,
  })
}

export async function updateTemplateList (data) {
  return request({
    url: api.updateTemplateList,
    method: 'post',
    data,
  })
}

export async function addTemplateList (data) {
  return request({
    url: api.addTemplateList,
    method: 'post',
    data,
  })
}

export async function addReceiptHistory (data) {
  return request({
    url: api.addReceiptHistory,
    method: 'post',
    data,
  })
}

export async function coverReceipt (data) {
  return request({
    url: api.coverReceipt,
    method: 'post',
    data,
  })
}

export async function deleteReceiptHistory (data) {
  return request({
    url: api.deleteReceiptHistory,
    method: 'post',
    data,
  })
}


export async function getReceiptHistoryList (data) {
  return request({
    url: api.getReceiptHistoryList,
    method: 'get',
    data,
  })
}

export async function importReceipt (data) {
  return request({
    url: api.importReceipt,
    method: 'get',
    data,
  })
}

export async function getImportPrs (data) {
  return request({
    url: api.getReceiptImportPrs,
    method: 'get',
    data,
  })
}
