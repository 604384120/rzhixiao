import { request, config } from 'utils'

const { api } = config

export async function getOverallStatistics (data) {
  return request({
    url: api.getOverallStatistics,
    method: 'get',
    data,
  })
}

export async function getOverallStatisticsSubject (data) {
  return request({
    url: api.getOverallStatisticsSubject,
    method: 'get',
    data,
  })
}

export async function getArchitectureStatisticsList (data) {
  return request({
    url: api.getArchitectureStatisticsList,
    method: 'get',
    data,
  })
}

export async function getArchitectureStatisticsDetail (data) {
  return request({
    url: api.getArchitectureStatisticsDetail,
    method: 'get',
    data,
  })
}

export async function getArchitectureStatSubject (data) {
  return request({
    url: api.getArchitectureStatSubject,
    method: 'get',
    data,
  })
}

export async function getMissionStatistics (data) {
  return request({
    url: api.getMissionStatistics,
    method: 'get',
    data,
  })
}

export async function getMissionStatisticsDetail (data) {
  return request({
    url: api.getMissionStatisticsDetail,
    method: 'get',
    data,
  })
}

export async function getSubjectStatistics (data) {
  return request({
    url: api.getSubjectStatistics,
    method: 'get',
    data,
  })
}

export async function getSubjectStatisticsDetail (data) {
  return request({
    url: api.getSubjectStatisticsDetail,
    method: 'get',
    data,
  })
}

export async function getTimeStatistics (data) {
  return request({
    url: api.getTimeStatistics,
    method: 'get',
    data,
  })
}

export async function getTimeSubjectStatistics (data) {
  return request({
    url: api.getTimeSubjectStatistics,
    method: 'get',
    data,
  })
}

export async function getTimeMissionStatistics (data) {
  return request({
    url: api.getTimeMissionStatistics,
    method: 'get',
    data,
  })
}

export async function getTimePayTypeStatistics (data) {
  return request({
    url: api.getTimePayTypeStatistics,
    method: 'get',
    data,
  })
}

export async function getStudentStatisticsList (data) {
  return request({
    url: api.getStudentStatisticsList,
    method: 'get',
    data,
  })
}