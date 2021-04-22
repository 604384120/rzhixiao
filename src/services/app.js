import { request, config } from 'utils'

const { api } = config

export async function login (params) {
  return request({
    url: api.login,
    method: 'post',
    data: params,
  })
}
export async function logout (params) {
  return request({
    url: api.loginOut,
    method: 'get',
    data: params,
  })
}

export async function query (params) {
  return request({
    url: api.user.replace('/:id', ''),
    method: 'get',
    data: params,
  })
}

export async function updatePwd (params) {
  return request({
    url: api.resetPwd,
    method: 'post',
    data: params,
  })
}

export async function updateMyPwd (params) {
  return request({
    url: api.updateMyPwd,
    method: 'post',
    data: params,
  })
}
