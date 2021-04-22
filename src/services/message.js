import { request, config } from 'utils'

const { api } = config

export async function getMessageList (data) {
  return request({
    url: api.getMessageList,
    method: 'get',
    data,
  })
}

export async function updateMessageStatus (data) {
  return request({
    url: api.updateMessageStatus,
    method: 'post',
    data,
  })
}


export async function getCount (data) {
  return request({
    url: api.getCount,
    method: 'get',
    data,
  })
}

