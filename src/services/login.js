import { request, config } from 'utils'

const { api } = config

export async function login (data) {
  return request({
    url: api.login,
    method: 'post',
    data,
  })
}


export async function autoLogin (data) {
  return request({
    url: api.autoLogin,
    method: 'post',
    data,
  })
}