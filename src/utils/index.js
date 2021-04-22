/* global window */
import classnames from 'classnames'
import lodash from 'lodash'
import config from './config'
import myRequest from './request'
import { color } from './theme'

// 连字符转驼峰
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
Date.prototype.format = function (format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length))
    }
  }
  return format
}


/**
 * @param   {String}
 * @return  {String}
 */

const queryURL = (name) => {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter(_ => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  let data = lodash.cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach((item) => {
    let hashVP = hash[item[pid]]
    if (hashVP) {
      if (!hashVP[children]) {
        hashVP[children] = []
        hashVP.showCount = 0
      }
      hashVP[children].push(item)
      if (item.hidden != 1) hashVP.showCount++
    } else {
      result.push(item)
    }
  })
  return result
}

const getFormat = (fee) => {
  if(!fee){
    fee = 0
  }else{
    fee = parseInt(fee);
  }
  let negative = false;
  if(fee < 0){
    fee = -fee;
    negative = true;
  }

  let temp = fee%100;
  let text1 = Math.floor(temp/10);
  let text2 = temp%10;

  let v = Math.floor(fee/100)+"."+text1+text2;
  if(negative){
    v = "-" + v;
  }
  return v;
}

const getYearFormat = (year) => {
  if(year){
    return year+"-"+(parseInt(year)+1)
  }
  else{
    return ""
  }
}

const getYearNew = ()=>{
  return new Date().getMonth()<7?new Date().getFullYear()-1:new Date().getFullYear()
}

const getSortParam = (sortList) => {
  let tempList = []
  if (sortList && sortList.length > 0) {
    for (let sort of sortList) {
      if (sort._idSelected && sort._idSelected.length > 0 && !sort._extra) {
        let tempSort = {}
        tempSort.attrId = sort.id
        let tempStr = '';
        for (let select of sort._idSelected) {
          tempStr += `${select},`
        }
        if(sort._valueType == '3'){
          tempSort.relateId = tempStr
          
        }else{
          tempSort.relateName = tempStr
        }
        
        tempList.push(tempSort)
      }
    }
  }
  return tempList
}

var mytoken = ""
const token = (t)=>{
  if(t){
    mytoken = t
  }
  return mytoken
} 

const request = (options) => {
  if(mytoken){
    if(options.data){
      options.data.token = mytoken
    }
    else{
      options.data = {token: mytoken}
    }
  }
  return myRequest(options)
}

const dowloadUrl = (url) => { 
  if(mytoken){
    return url+"?token="+mytoken
  }
  return url
}

module.exports = {
  config,
  request,
  color,
  classnames,
  queryURL,
  queryArray,
  arrayToTree,
  getFormat,
  getYearFormat,
  getSortParam,
  getYearNew,
  token,
  dowloadUrl
}
