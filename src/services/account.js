import { request, config } from 'utils'

const { api } = config

export async function getMgrAccountList (data) {
  return request({
    url: api.getMgrAccountList,
    method: 'get',
    data,
  })
}


export async function getCurrentTime (data) {
  return request({
    url: api.getCurrentTime,
    method: 'get',
    data,
  })
}


export async function getMgrAccount (data) {
  return request({
    url: api.getMgrAccount,
    method: 'get',
    data,
  })
}

export async function resetPwd (data) {
  return request({
    url: api.resetPwd,
    method: 'post',
    data,
  })
}

export async function addMgrAccount (data) {
  return request({
    url: api.addMgrAccount,
    method: 'post',
    data,
  })
}

export async function updateMgrAccount (data) {
  return request({
    url: api.updateMgrAccount,
    method: 'post',
    data,
  })
}

export async function deleteMgrAccount (data) {
  return request({
    url: api.deleteMgrAccount,
    method: 'post',
    data,
  })
}

export async function getMgrDepartTree (data) {
  return request({
    url: api.getMgrDepartTree,
    method: 'get',
    data,
  })
}

export async function getMgrDepart (data) {
  return request({
    url: api.getMgrDepart,
    method: 'get',
    data,
  })
}

export async function addMgrDepart (data) {
  return request({
    url: api.addMgrDepart,
    method: 'post',
    data,
  })
}

export async function updateMgrDepart (data) {
  return request({
    url: api.updateMgrDepart,
    method: 'post',
    data,
  })
}

export async function deleteMgrDepart (data) {
  return request({
    url: api.deleteMgrDepart,
    method: 'post',
    data,
  })
}

export async function updateMgrPrivilege (data) {
  return request({
    url: api.updateMgrPrivilege,
    method: 'post',
    data,
  })
}

export async function getMgrPrivilegeTree (data) {
  return request({
    url: api.getMgrPrivilegeTree,
    method: 'get',
    data,
  })
}

export async function updateSchool (data) {
  return request({
    url: api.updateSchool,
    method: 'post',
    data,
  })
}

export async function getMgrAttr (data) {
  return request({
    url: api.getMgrAttr,
    method: 'get',
    data,
  })
}

export async function updateMgrAttr (data) {
  return request({
    url: api.updateMgrAttr,
    method: 'post',
    data,
  })
}


export async function deleteMgrAttr (data) {
  return request({
    url: api.deleteMgrAttr,
    method: 'post',
    data,
  })
}
