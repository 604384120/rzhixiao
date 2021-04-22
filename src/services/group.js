import { request, config } from 'utils'

const { api } = config

export async function getGroupStatistics (data) {
  return request({
    url: api.getGroupStatistics,
    method: 'get',
    data,
  })
}

export async function getGroupMgrDepartTree (data) {
  return request({
    url: api.getGroupMgrDepartTree,
    method: 'get',
    data,
  })
}

export async function getGroupMgrAccountList (data) {
  return request({
    url: api.getGroupMgrAccountList,
    method: 'get',
    data,
  })
}

export async function getGroupTreeStatistics (data) {
  return request({
    url: api.getGroupTreeStatistics,
    method: 'get',
    data,
  })
}

export async function getDisplayAttrAdmin (data) {
  return request({
    url: api.getDisplayAttrAdmin,
    method: 'get',
    data,
  })
}

export async function updateGroupMgrDepart (data) {
  return request({
    url: api.updateGroupMgrDepart,
    method: 'post',
    data,
  })
}

export async function deleteGroupMgrDepart (data) {
  return request({
    url: api.deleteGroupMgrDepart,
    method: 'post',
    data,
  })
}

export async function updateGroupMgrAcc (data) {
  return request({
    url: api.updateGroupMgrAcc,
    method: 'post',
    data,
  })
}

export async function updateGroupMgrAccount (data) {
  return request({
    url: api.updateGroupMgrAccount,
    method: 'post',
    data,
  })
}

export async function updatePwd (data) {
  return request({
    url: api.updatePwd,
    method: 'post',
    data,
  })
}

export async function updateDisplayAttrAdmin (data) {
  return request({
    url: api.updateDisplayAttrAdmin,
    method: 'post',
    data,
  })
}

export async function deleteDisplayAttrAdmin (data) {
  return request({
    url: api.deleteDisplayAttrAdmin,
    method: 'post',
    data,
  })
}



