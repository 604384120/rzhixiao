import { request, config } from 'utils'

const { api } = config
const { getMenu } = api

export async function query (params) {
  return request({
    url: getMenu,
    method: 'get',
    data: params,
  })
}
