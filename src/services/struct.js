
import { request, config } from 'utils'

const { api } = config

// 获取层级列表
export async function getStructList (data) {
  return request({
    url: api.getStructList,
    method: 'get',
    data,
  })
}

// 编辑层级
export async function updateStruct (data) {
  return request({
    url: api.updateStruct,
    method: 'post',
    data,
  })
}

// 获取层级对应table
export async function getItemList (data) {
  return request({
    url: api.getItemList,
    method: 'get',
    data,
  })
}

// 获取层级对应下拉列表
export async function getAllItemList (data) {
  return request({
    url: api.getAllItemList,
    method: 'get',
    data,
  })
}

// 添加层级项目
export async function addItem (data) {
  return request({
    url: api.addItem,
    method: 'post',
    data,
  })
}

// 编辑与删除层级项目
export async function updateItem (data) {
  return request({
    url: api.updateItem,
    method: 'post',
    data,
  })
}

// 批量删除层级项目
export async function deleteItemList (data) {
  return request({
    url: api.deleteItemList,
    method: 'post',
    data,
  })
}

// 层级项目添加标签
export async function addItemLabel (data) {
  return request({
    url: api.addItemLabel,
    method: 'post',
    data,
  })
}

// 获取层级属性
export async function getStructAttr (data) {
  return request({
    url: api.getStructAttr,
    method: 'get',
    data,
  })
}

// 层级项目添加标签
export async function addStructAttr (data) {
  return request({
    url: api.addStructAttr,
    method: 'post',
    data,
  })
}

// 层级项目添加标签
export async function deleteStructAttr (data) {
  return request({
    url: api.deleteStructAttr,
    method: 'post',
    data,
  })
}

export async function getStructItemTree (data) {
  return request({
    url: api.getStructItemTree,
    method: 'get',
    data,
  })
}

// //获取标签列表
// export async function getGroup ( data ) {
// 	return request({
// 		url: api.getGroup,
// 		method: "get",
// 		data
// 	})
// }

// //添加标签组
// export async function addGroup ( data ) {
// 	return request({
// 		url: api.addGroup,
// 		method: "post",
// 		data
// 	})
// }

// //编辑标签组
// export async function updateGroup ( data ) {
// 	return request({
// 		url: api.updateGroup,
// 		method: "post",
// 		data
// 	})
// }

// //删除标签组
// export async function deleteGroup ( data ) {
// 	return request({
// 		url: api.deleteGroup,
// 		method: "post",
// 		data
// 	})
// }

// //添加标签
// export async function addLabel ( data ) {
// 	return request({
// 		url: api.addLabel,
// 		method: "post",
// 		data
// 	})
// }

// //编辑标签
// export async function updateLabel ( data ) {
// 	return request({
// 		url: api.updateLabel,
// 		method: "post",
// 		data
// 	})
// }

// //删除标签
// export async function deleteLabel ( data ) {
// 	return request({
// 		url: api.deleteLabel,
// 		method: "post",
// 		data
// 	})
// }

// //打标签
// export async function updateItemLabel( data ) {
// 	return request({
// 		url: api.updateItemLabel,
// 		method: "post",
// 		data
// 	})
// }

// //获取学生数目
// export async function getUserCount( data ){
// 	return request({
// 		url: api.getUserCount,
// 		method: "get",
// 		data
// 	})
// }
