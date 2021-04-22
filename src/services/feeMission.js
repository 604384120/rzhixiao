import { request, config } from 'utils'

const { api } = config

export async function getMissionList (data) {
  return request({
    url: api.getMissionList,
    method: 'get',
    data,
  })
}

export async function getMissionSimple (data) {
  return request({
    url: api.getMissionSimple,
    method: 'get',
    data,
  })
}

export async function getMissionById (data) {
  return request({
    url: api.getMissionById,
    method: 'get',
    data,
  })
}


export async function addMission (data) {
  return request({
    url: api.addMission,
    method: 'post',
    data,
  })
}

export async function updateMissionStatus (data) {
  return request({
    url: api.updateMissionStatus,
    method: 'post',
    data,
  })
}

export async function updateMission (data) {
  return request({
    url: api.updateMission,
    method: 'post',
    data,
  })
}


export async function deleteMission (data) {
  return request({
    url: api.deleteMission,
    method: 'post',
    data,
  })
}

export async function createBills (data) {
  return request({
    url: api.createBills,
    method: 'get',
    data,
  })
}


export async function getCreateBillsPrs (data) {
  return request({
    url: api.getCreateBillsPrs,
    method: 'get',
    data,
  })
}

export async function getMchList (data) {
  return request({
    url: api.getMchList,
    method: 'get',
    data,
  })
}

export async function getYearList (data) {
  return request({
    url: api.getYearList,
    method: 'get',
    data,
  })
}
