import { request, config } from 'utils'

const { api } = config

export async function getUserAttr (params) {
  return request({
    url: api.getUserAttr,
    method: 'get',
    data: params,
  })
}

export async function updateUserAttr (params) {
  return request({
    url: api.updateUserAttr,
    method: 'post',
    data: params,
  })
}

export async function updateUserAttrStatus (params) {
  return request({
    url: api.updateUserAttrStatus,
    method: 'post',
    data: params,
  })
}

export async function addUserAttr (params) {
  return request({
    url: api.addUserAttr,
    method: 'post',
    data: params,
  })
}

export async function getUserAttrValue (params) {
  return request({
    url: api.getUserAttrValue,
    method: 'get',
    data: params,
  })
}

export async function addUserAttrValue (params) {
  return request({
    url: api.addUserAttrValue,
    method: 'post',
    data: params,
  })
}

export async function updateUserAttrValue (params) {
  return request({
    url: api.updateUserAttrValue,
    method: 'post',
    data: params,
  })
}

export async function deleteUserAttrValue (params) {
  return request({
    url: api.deleteUserAttrValue,
    method: 'post',
    data: params,
  })
}

export async function deleteUserAttr (params) {
  return request({
    url: api.deleteUserAttr,
    method: 'post',
    data: params,
  })
}

export async function getDisplayAttr (params) {
  return request({
    url: api.getDisplayAttr,
    method: 'get',
    data: params,
  })
}

export async function getAttrRelateList (params) {
  return request({
    url: api.getAttrRelateList,
    method: 'get',
    data: params,
  })
}

export async function getAttrRelatePage (params) {
  return request({
    url: api.getAttrRelatePage,
    method: 'get',
    data: params,
  })
}

export async function updateDisplayAttr (params) {
  return request({
    url: api.updateDisplayAttr,
    method: 'post',
    data: params,
  })
}

export async function deleteDisplayAttr (params) {
  return request({
    url: api.deleteDisplayAttr,
    method: 'post',
    data: params,
  })
}

export async function getUserInfo (params) {
  return request({
    url: api.getUserInfo,
    method: 'get',
    data: params,
  })
}

export async function getUserOperate (params) {
  return request({
    url: api.getUserOperate,
    method: 'get',
    data: params,
  })
}

export async function getUserList (params) {
  return request({
    url: api.getUserList,
    method: 'get',
    data: params,
  })
}


export async function updateUserInfo (params) {
  return request({
    url: api.updateUserInfo,
    method: 'post',
    data: params,
  })
}

export async function deleteUserInfo (params) {
  return request({
    url: api.deleteUserInfo,
    method: 'post',
    data: params,
  })
}

export async function importUserInfo (params) {
  return request({
    url: api.importUserInfo,
    method: 'get',
    data: params,
  })
}

export async function importConfirm (params) {
  return request({
    url: api.importConfirm,
    method: 'post',
    data: params,
  })
}

export async function getImportPrs (params) {
  return request({
    url: api.getImportPrs,
    method: 'get',
    data: params,
  })
}

export async function getUserTransferInfo (params) {
  return request({
    url: api.getUserTransferInfo,
    method: 'get',
    data: params,
  })
}

export async function importUserDelete (params) {
  return request({
    url: api.importUserDelete,
    method: 'get',
    data: params,
  })
}

export async function coverUser (params) {
  return request({
    url: api.coverUser,
    method: 'post',
    data: params,
  })
}

export async function updateSchoolSubmit (params) {
  return request({
    url: api.updateSchoolSubmit,
    method: 'post',
    data: params,
  })
}

export async function getSchool (params) {
  return request({
    url: api.getSchool,
    method: 'get',
    data: params,
  })
}



