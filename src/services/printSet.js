import { request, config } from 'utils'

const { api } = config

export async function getSetting (data) {
  return request({
    url: api.getSetting,
    method: 'get',
    data,
  })
}

export async function updateSetting (data) {
  return request({
    url: api.updateSetting,
    method: 'post',
    data,
  })
}

export async function getTextValue (data) {
  return request({
    url: api.getTextValue,
    method: 'get',
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

export async function deleteReceiptHistory (data) {
  return request({
    url: api.deleteReceiptHistory,
    method: 'post',
    data,
  })
}
