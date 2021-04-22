import * as structServive from 'services/struct'
import * as userService from 'services/user'
import { Message } from 'antd'
import modelExtend from 'dva-model-extend'
import { model } from 'models/common'
import queryString from 'query-string'

export default modelExtend(model, {

  namespace: 'struct',

  state: {
    structList: [],
    structMap: {},
    structSelected: undefined,

    modalVisible: false,
    modalData: {},
    modalAttrList: null,

    attrList: null,
    attrMap: {},

    pageNum: 1,
    pageSize: 20,
    counst: 0,
    structItemList: [],
    searchName: '',
    structItemPidSelected: {},
    dataLoading: true,

    editableData: null,
    structItemList: null,
    currentItem: null,
    currentItem_id: null,
    itemList: {},
    allItemlist: [],
    allItemlist1: null,
    tableData: null,
    tableData1: [],
    tableLabel: {},
    studentNum: 0,

  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname == '/struct') {
          dispatch({
			            type: 'query',
			            payload: {
			              ...queryString.parse(location.search),
			            },
			          })
        }
      })
    },
  },

  effects: {
    * query ({ payload }, { put, call, select }) {
      let data = null
      var structList = []
      var structMap = {}
      var { structSelected } = yield select(_ => _.struct)
      if(structSelected){
        //不需要再初始化
        return
      }
      data = yield call(structServive.getStructList)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      structList = data.ret_content
      let i = 0
      let lastStruct = undefined
      let pid = null
      let path= []
      if (structList) {
        for (let item of structList) {
          if(item.status != '1'){
            continue
          }
          item._position = i++
          item._pid = pid
          pid = item
          if(!structSelected){
            //取第一个层级
            structSelected = item
          }
          lastStruct = item
          structMap[item.id] = item
        }
        if(!lastStruct){
          return Message.error('请先设置学校结构')
        }
        lastStruct._isLast = true//标记最后一个节点
      } else {
        return Message.error('请先设置学校结构')
      }
      let param = {}
      path.pop()
      if(path.length > 0){
        param.structId = path.toString()
      }

      //获取层级树
      const app = yield select(_ => _.app)
      const departTreeData = yield call(structServive.getStructItemTree, param)
      if (!departTreeData.success) {
        throw departTreeData
      } else if (departTreeData.ret_code != 1) {
        return Message.error(departTreeData.ret_content)
      }
      let departMap = {}
      const checkData = (data) => {
        data.forEach((index) => {
          index.value = index.id
          index.name = index.label
          if (index.structItemAttrRelateMap) {
            for (let attrValue in index.structItemAttrRelateMap) {
              index[`attrId_${attrValue}`] = index.structItemAttrRelateMap[attrValue].relateName
            }
          }
          if (index.children) {
            checkData(index.children)
          }
          departMap[index.id] = index
        })
      }
      checkData(departTreeData.ret_content, [])
      let rootNode = {
        value: '0',
        id: "0",
        label: app.user.schoolName,
        children: departTreeData.ret_content
      }
      departMap['0'] =  rootNode
      let departTree = [rootNode]
      yield put({
        type: 'updateState',
        payload: {
          structList,
          structMap,
          departTree,
          departMap,
          dataLoading: false,
        },
      })

      if (structSelected) {
        //跳转默认tab
        yield put({
          type: 'changeStruct',
          payload: {
            structSelected
          }
        })
      }
    },

    * changeStruct ({ payload }, { put, call, select }) {
      let { structSelected, departId, attrList } = payload
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      if(!structSelected.attrList){
        //生成所有数据
        let data = yield call(structServive.getStructAttr, { structId: structSelected.id })
        if (!data.success) {
          throw data
        } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
        }
        let attrList = data.ret_content
        let attrMap = {}
        for (let attr of attrList) {
          attrMap[attr.attrId] = attr
        }
        structSelected.attrMap = attrMap
        structSelected.attrList = attrList
      }

      const { departMap, departTree } = yield select(_ => _.struct)
      let needData = (departId || attrList || !structSelected.dataList)//需要查询出数据
      let dataList = []
      let attrArr = []
      if(attrList){
        for(let attr of attrList){
          if(attr._idSelected && attr._idSelected.length>0){
            //存在选中数据
            attrArr.push({
              id: attr.attrId,
              value: attr._idSelected
            })
          }
        }
      }
      let i = 0
      const checkData = (data, structArr) => {
        if(!data){
          return
        }
        data.forEach((index) => {
          let tempNode = undefined
          if(structArr){
            let depart = []
            tempNode = []
            //生成上级组织结构
            for(let node of structArr){
              index[node.structId] = node.name
              tempNode.push(node)
              depart.push(node.id)
            }
            index.depart = depart
          }
          if(index.structId == structSelected.id){
            //当前层级
            if(index.children){
              index._children = index.children
              index.children = null
            }
            if(needData){
              if(attrArr.length>0){
                if(!index.structItemAttrRelateMap){
                  return
                }
                for(let attr of attrArr){
                  if(!index[`attrId_${attr.id}`] || attr.value.indexOf(index[`attrId_${attr.id}`])<0){
                    return
                  }
                }
              }
              if(payload.searchName && index.name.toLowerCase().indexOf(payload.searchName.toLowerCase())<0){
                return
              }
              index._index = i++
              dataList.push(index)
            }
          }else if((structSelected._pid && index.structId==structSelected._pid.id) || 
            (!structSelected._pid && index.id=='0')){
            //上一级层级
            if(index.children) {
              index._children = index.children
              index.children = null
            }
            if(tempNode && index.id != '0'){
              tempNode.push(index)
            }
            if(index._children){
              checkData(index._children, tempNode)
            }
          }else{
            if(index._children){
              index.children = index._children
              index._children = null
            }
            if(tempNode && index.id != '0'){
              tempNode.push(index)
            }
            if(index.children){
              checkData(index.children, tempNode)
            }
          }
        })
      }
      if(departId){
        checkData(departMap[departId].children?departMap[departId].children:departMap[departId]._children)
      }else{
        checkData(departTree, [])
      }

      if(needData){
        structSelected.dataList = dataList
      }

      yield put({
        type: 'updateState',
        payload: {
          structSelected,
          dataLoading: false
        },
      })
    },
    * getItemList ({ payload }, { put, call, select }) {
      const { departMap } = yield select(_ => _.struct)
      const { structSelected } = payload
      let param = {
        pageNum: structSelected.pageNum,
        pageSize: structSelected.pageSize,
        structId: structSelected.id,
        searchName: structSelected.searchName
      }
      if(structSelected.selectedDepart){
        param.pid = structSelected.selectedDepart[structSelected.selectedDepart.length-1]
      }
      let attrArr = []
      if(structSelected.attrList){
        for (let attr of structSelected.attrList) {
          if (attr._idSelected && attr._idSelected.length > 0) {
            attrArr.push({ attrId: attr.attrId, valueName: attr._idSelected.toString() })
          }
        }
      }
      if(attrArr && attrArr.length>0){
        param.attrValueId = JSON.stringify(attrArr)
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true,
        },
      })
      const data = yield call(structServive.getItemList, param)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      const structItemList = data.ret_content.data
      for (let item of structItemList) {
        if (item.structItemAttrRelateEntities) {
          for (let attrValue of item.structItemAttrRelateEntities) {
            item[`attrId_${attrValue.attrId}`] = attrValue.relateName
          }
        }
        for (let struct of item.pidItems) {
          item[struct.structId] = struct.name
        }
        if(item.pid && departMap[item.pid] && departMap[item.pid].depart){
          item.depart = [...departMap[item.pid].depart, item.pid]
        }
      }
      structSelected.count =  parseInt(data.ret_content.count)
      structSelected.dataList = structItemList
      yield put({
        type: 'updateState',
        payload: {
          structSelected,
          dataLoading: false,
        },
      })
    },

    * updateItem ({ payload }, { put, call, select }) {
      const { structSelected, dataLoading } = yield select(_ => _.struct)
      if(dataLoading){
        return Message.error("请不要重复点击")
      }
      const data = yield call(structServive.updateItem, payload)
      if (!data.success) {
		        throw data
		    } else if (data.ret_code != 1) {
          return Message.error(data.ret_content)
		    }
      Message.success('修改成功')
      if(structSelected._isLast){
        yield put({
          type: 'getItemList',
          payload: {
            structSelected
          },
        })
      }else{
        const { departMap } = yield select(_ => _.struct)
        let temp = departMap[payload.id]
        for(let attr of payload.attrValues){
          for(let value of structSelected.attrMap[attr.attrId].userAttrValueEntities){
            if(value.id == attr.relateId){
              temp[`attrId_${attr.attrId}`] = value.value
              break;
            }
          }
        }
        if(payload.pid){
          //修改了层级
          let orcDepart = temp.depart
          temp.depart = [...departMap[payload.pid].depart]
          temp.depart.push(payload.pid)
          for(let depart of temp.depart){
            temp[departMap[depart].structId] = departMap[depart].name
          }
          //加入新的子节点列表
          if(!departMap[payload.pid]._children){
            departMap[payload.pid]._children = []
          }
          departMap[payload.pid]._children.unshift(temp)
          
          if(orcDepart && orcDepart.length>0){
            //从原始子节点列表中删除
            let parent = departMap[orcDepart[orcDepart.length-1]]
            let i=0
            for(let node of parent._children){
              if(node.id == payload.id){
                parent._children.splice(i, 1)
                break
              }
            }
          }
        }
        temp._editable = false
        if(payload.name!=undefined){
          temp.name = payload.name
          temp.label = payload.name
        }
        yield put({
          type: 'updateState',
          payload: {
            dataLoading: false,
            structSelected,
            departMap
          },
        })
      }
    },

    * addItem ({ payload }, { put, call, select }) {
      const { structSelected, dataLoading } = yield select(_ => _.struct)
      if(dataLoading){
        return Message.error("请不要重复点击")
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true
        },
      })
      const data = yield call(structServive.addItem, payload)
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }
      Message.success('修改成功')
      
      if(structSelected._isLast){
        //最后一个节点
        yield put({
          type: 'getItemList',
          payload: {
            structSelected
          },
        })
      }else{
        //添加到树
        const { departMap } = yield select(_ => _.struct)
        let temp = {
          id: data.ret_content,
          value: data.ret_content,
          name: payload.name,
          label: payload.name,
        }
        for(let attr of payload.attrValues){
          for(let value of structSelected.attrMap[attr.attrId].userAttrValueEntities){
            if(value.id == attr.relateId){
              temp[`attrId_${attr.attrId}`] = value.value
              break;
            }
          }
        }
        temp.depart = []
        if(payload.pid){
          temp.depart = [...departMap[payload.pid].depart]
          temp.depart.push(payload.pid)
        }
       
        for(let depart of temp.depart){
          temp[departMap[depart].structId] = departMap[depart].name
        }
        temp.structId = structSelected.id
        structSelected.dataList.splice(0, 1)
        structSelected.dataList.unshift(temp)
        if(payload.pid){
          if(!departMap[payload.pid]._children){
            departMap[payload.pid]._children = []
          }
          departMap[payload.pid]._children.unshift(temp)
        }else{
          departMap['0']._children.unshift(temp)
        }
        departMap[temp.id] = temp
        yield put({
          type: 'updateState',
          payload: {
            dataLoading: false,
            structSelected,
            departMap
          },
        })
      }
    },

    * deleteItemList ({ payload }, { put, call, select }) {
      const { structSelected, dataLoading } = yield select(_ => _.struct)
      if(dataLoading){
        return Message.error("请不要重复点击")
      }
      yield put({
        type: 'updateState',
        payload: {
          dataLoading: true
        },
      })
      const data = yield call(structServive.deleteItemList, payload)
      if (!data.success) {
		        throw data
		    } else if (data.ret_code != 1) {
		      return Message.error(data.ret_content)
		    }
      Message.success('删除成功')

      if(structSelected._isLast){
        yield put({
          type: 'getItemList',
          payload: {
            structSelected
          },
        })
      }else{
        const { departMap } = yield select(_ => _.struct)
        let temp = departMap[payload.ids]
        let orcDepart = temp.depart
        let parent = []
        if(orcDepart && orcDepart.length>0){
          //从原始子节点列表中删除
          parent = departMap[orcDepart[orcDepart.length-1]]
        }else{
          parent = departMap['0']
        }
        let i=0
        for(let node of parent._children){
          if(node.id == payload.ids){
            parent._children.splice(i, 1)
            break
          }
          i++
        }
        temp._editable = false
        i=0
        for(let node of structSelected.dataList){
          if(node.id == payload.ids){
            structSelected.dataList.splice(i, 1)
            break
          }
          i++
        }
        delete departMap[payload.ids]
        yield put({
          type: 'updateState',
          payload: {
            dataLoading: false,
            structSelected,
            departMap
          },
        })
      }
    },

    * getModalAttrList ({ payload }, { put, call }) {
      const data = yield call(userService.getUserAttr, { status: '1', valueType: '2' })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      yield put({
        type: 'updateState',
        payload: {
          modalAttrList: data.ret_content,
        },
      })
    },
    * addStructAttr ({ payload }, { put, call, select }) {
      let data = yield call(structServive.addStructAttr, payload)
      if (!data.success) {
		        throw data
		    } else if (data.ret_code != 1) {
		      return Message.error(data.ret_content)
		    }
      Message.success('添加成功')
      data = yield call(structServive.getStructAttr, { structId: payload.structId })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      const { structSelected } = yield select(_ => _.struct)
      let attrList = data.ret_content
      let attrMap = {}
      for (let attr of attrList) {
        attrMap[attr.attrId] = attr
      }
      structSelected.attrList = attrList
      structSelected.attrMap = attrMap
      yield put({
        type: 'updateState',
        payload: {
          structSelected,
          modalData: { attrId: '_add', attrName: '', _add: true },
        },
      })
    },
    * deleteStructAttr ({ payload }, { put, call, select }) {
      let data = yield call(structServive.deleteStructAttr, { id: payload.id })
      if (!data.success) {
		        throw data
		    } else if (data.ret_code != 1) {
		      return Message.error(data.ret_content)
		    }
      Message.success('删除成功')
      data = yield call(structServive.getStructAttr, { structId: payload.structId })
      if (!data.success) {
        throw data
      } else if (data.ret_code != 1) {
        return Message.error(data.ret_content)
      }

      const { structSelected } = yield select(_ => _.struct)
      let attrList = data.ret_content
      let attrMap = {}
      for (let attr of attrList) {
        attrMap[attr.attrId] = attr
      }
      structSelected.attrList = attrList
      structSelected.attrMap = attrMap
      yield put({
        type: 'updateState',
        payload: {
          structSelected,
          modalData: { attrId: '_add', attrName: '', _add: true },
        },
      })
    },
  },

  reducers: {

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

  },

})
