import { request, config } from 'utils'

const { api } = config

export async function getSubjectList (data) {
  return request({
    url: api.getSubjectList,
    method: 'get',
    data,
  })
}

export async function getSubjectByMissId (data) {
  return request({
    url: api.getSubjectByMissId,
    method: 'get',
    data,
  })
}

export async function addSubject (data) {
  return request({
    url: api.addSubject,
    method: 'post',
    data,
  })
}


export async function updateSubject (data) {
  return request({
    url: api.updateSubject,
    method: 'post',
    data,
  })
}


export async function deleteSubject (data) {
  return request({
    url: api.deleteSubject,
    method: 'post',
    data,
  })
}

