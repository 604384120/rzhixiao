import { Row, Card, Divider, Select, Button, message, Input } from 'antd'
import { connect } from 'dva'
import StructNav from './StructNav'
import { Page, UserSortLayer } from 'components'
import StructItem from './StructItem'
import StructTree from './StructTree'
import StructAttrModal from './StructAttrModal'
import styles from '../common.less'

const Option = Select.Option
const Search = Input.Search

const Struct = ({
  location,
  dispatch,
  struct,
  loading,
  app,
}) => {
  const { isNavbar } = app
  const {
    structList, structMap, structSelected, modalVisible, modalData, modalAttrList, dataLoading,
    departTree, departMap
  } = struct

  const structAttrModalProps = {
    modalVisible,
    structSelected,
    modalData,
    modalAttrList,
    dataSource: structSelected&&structSelected.attrList?structSelected.attrList:[],
    attrMap: structSelected&&structSelected.attrMap?structSelected.attrMap:{},
    onClose () {
      dispatch({
        type: 'struct/updateState',
        payload: {
          modalVisible: false,
          modalData: {},
        },
      })
    },
    onUpdateState (data) {
      dispatch({
        type: 'struct/updateState',
        payload: {
          ...data,
        },
      })
    },
    onGetModalAttrList () {
      dispatch({
        type: 'struct/getModalAttrList',
      })
    },
    onDelete (data) {
      dispatch({
        type: 'struct/deleteStructAttr',
        payload: {
          ...data,
        },
      })
    },
    onAdd (data) {
      dispatch({
        type: 'struct/addStructAttr',
        payload: {
          ...data,
        },
      })
    },
  }

  const navProps = {
    data: structList,
    structSelected,
    isNavbar,
  	onShowSetList () {
  		dispatch({
  			type: 'struct/showModal',
  			payload: {
  				modalType: 'setList',
  			},
  		})
  	},
  	onChangeNav (now) {
      dispatch({
        type: 'struct/changeStruct',
        payload: {
          structSelected: structMap[now],
        },
      })
      if(structMap[now]._isLast && !structMap[now].pageSize){
        structMap[now].pageNum = 1
        structMap[now].pageSize = 20
        dispatch({
          type: 'struct/getItemList',
          payload: {
            structSelected: structMap[now],
          },
        })
      }
  	},
  }

  const ItemProps = {
    structList,
    structItemList: structSelected?structSelected.dataList:[],
    structSelected,
    attrList: structSelected?structSelected.attrList:[],
    attrMap: structSelected?structSelected.attrMap:[],
    count: structSelected?structSelected.count:undefined,
    pageNum: structSelected?structSelected.pageNum:undefined,
    pageSize: structSelected?structSelected.pageSize:undefined,
    dataLoading,
    departMap,
    departTree,
    onChangePage (n, s) {
      structSelected.pageNum = n
      structSelected.pageSize = s
      dispatch({
        type: 'struct/getItemList',
        payload: {
          structSelected
        },
      })
    },
    onUpdateDataSource: (data) => {
      dispatch({
        type: 'struct/updateState',
        payload: {
          structItemList: data,
        },
      })
    },
    onUpdate: (data) => {
      if (data._name!=undefined && !data._name) {
        message.error(`请输入${structSelected.label}名称`)
        return
      }
      let pid = undefined
      if(structSelected._pid){
        if (data._depart!=undefined) {
          if(!data._depart || data._depart.length<=0){
            message.error(`请选择上级组织结构`)
            return
          }else{
            pid = data._depart[data._depart.length-1]
          }
        }
      }
      
      let attrArr = []
      for (let attrId in data._attrTemp) {
        attrArr.push({ attrId, relateId: data._attrTemp[attrId] })
      }

      dispatch({
        type: 'struct/updateItem',
        payload: {
          id: data.id,
          name: data._name,
          pid,
          attrValues: attrArr,
        },
      })
    },
    onAdd: (data) => {
      if (!data._name) {
        message.error(`请输入${structSelected.label}名称`)
        return
      }
      let pid = undefined
      if(structSelected._pid){
        if (!data._depart || data._depart.length<=0) {
          message.error(`请选择上级组织结构`)
          return
        }else{
          pid = data._depart[data._depart.length-1]
        }
      }
     
      let attrArr = []
      for (let attrId in data._attrTemp) {
        attrArr.push({ attrId, relateId: data._attrTemp[attrId] })
      }
      dispatch({
        type: 'struct/addItem',
        payload: {
          structId: structSelected.id,
          name: data._name,
          pid,
          attrValues: attrArr,
        },
      })
    },
    onDelete: (data) => {
      dispatch({
        type: 'struct/deleteItemList',
        payload: {
          ids: data.id,
          status: '0',
        },
      })
    },
  }

  const StructTreeProps = {
    departTree,
    selectedDepart: structSelected&&structSelected.selectedDepart?structSelected.selectedDepart:[],
    onSelectDepart (data) {
      if (data.id == '0') {
        structSelected.selectedDepart = []
      }else{
        structSelected.selectedDepart = [data.id]
      }
      if(structSelected._isLast){
        dispatch({
          type: 'struct/getItemList',
          payload: {
            structSelected,
          },
        })
      }else{
        dispatch({
          type: 'struct/changeStruct',
          payload: {
            structSelected,
            departId: data.id,
            attrList: structSelected.attrList,
            searchName: structSelected.searchName
          },
        })
      }
    },
  }

  const handleChangeAttrValueSort = (value, attr) => {
    structSelected.attrMap[attr.attrId]._idSelected = value
    if(structSelected._isLast){
      dispatch({
        type: 'struct/getItemList',
        payload: {
          structSelected,
        },
      })
    }else{
      dispatch({
        type: 'struct/changeStruct',
        payload: {
          structSelected,
          attrList: structSelected.attrList,
          departId: structSelected.selectedDepart?structSelected.selectedDepart[0]:undefined,
          searchName: structSelected.searchName
        },
      })
    }
  }

  const createAttrValueSortOption = (attr) => {
    const options = []
    if (attr.userAttrValueEntities) {
      for (let select of attr.userAttrValueEntities) {
        options.push(<Option key={select.id} value={select.value} title={select.value}>{select.value}</Option>)
      }
      return options
    }
    return null
  }

  const handleAdd = () => {
    if (structSelected.dataList.length == 0 || !structSelected.dataList[0]._add) {
      // 获取当前选择到的层级
      const newItem = {
        id: '',
        _editable: true,
        _add: true,
      }
      structSelected.dataList.unshift(newItem)
      dispatch({
        type: 'struct/updateState',
        payload: {
          structSelected,
        },
      })
    }
  }

  const handleChangeSearchName = (e) => {
    structSelected.searchName = e.target.value
    dispatch({
      type: 'struct/updateState',
      payload: {
        structSelected,
      },
    })
  }
  const handleSearch = () => {
    if(structSelected._isLast){
      dispatch({
        type: 'struct/getItemList',
        payload: {
          structSelected,
        },
      })
    }else{
      dispatch({
        type: 'struct/changeStruct',
        payload: {
          structSelected,
          attrList: structSelected.attrList,
          departId: structSelected.selectedDepart?structSelected.selectedDepart[0]:undefined,
          searchName: structSelected.searchName
        },
      })
    }
  }
  const handleAttrRelate = (name) => {
    dispatch({
      type: 'struct/showModal',
      payload: {
        modalData: { attrId: '_add', attrName: '', _add: true },
      },
    })
  }
  let width = document.body.clientWidth;
  if(width>769){
    width -= 300;
  }
  let treeLen = Math.round(240/(width/24))

  const createSort = () => {
    let i = 0
    const list = []
    if (structSelected&&structSelected.attrList) {
      for (let attr of structSelected.attrList) {
        i++
        list.push({
          id:i,
          content:(<div className={styles.sortCol}>
                    <div className={styles.sortText}>{attr.attrName}:</div>
                    <Select mode="multiple"
                      allowClear
                      optionFilterProp="children"
                      value={attr._idSelected}
                      className={styles.sortSelectMuti}
                      placeholder={`选择${attr.attrName}`}
                      onChange={value => handleChangeAttrValueSort(value, attr)}
                    >
                      {createAttrValueSortOption(attr)}
                    </Select>
                  </div>)
                })
        }
      }
      return list
  }

  const layerProps = {
    list: createSort(),
    query:(''),
  }

  return (
    <div className="content-inner">
      <div>
        <StructNav {...navProps} />
      </div>
      <div>{
        structSelected ? <Page inner>
          <Card bordered={false}
            bodyStyle={{padding: ' 0'}}>
            <UserSortLayer {...layerProps}/>
            <Divider style={{ margin: '5px' }} dashed />
            <Row>
              <div style={{width:'240px', float:'left'}}>
                  <StructTree {...StructTreeProps} />
              </div>
              <div style={{paddingLeft:'10px', float:'left', width:'calc(100% - 250px)'}}>
                <Row>
                  <Button icon="plus" onClick={handleAdd} type="primary" style={{ marginBottom: '10px' }} >添加{structSelected.label}</Button>
                  <Button onClick={handleAttrRelate} type="default" style={{ marginLeft: '5px', marginBottom: '10px' }} >关联字段</Button>
                  <Search enterButton placeholder="搜索" value={structSelected?structSelected.searchName:undefined}
                    onChange={handleChangeSearchName}
                    onSearch={value => handleSearch(value)} style={{ width: isNavbar?'100%':'200px', float: 'right', marginBottom: '10px' }} />
                </Row>
                <Row>
                  <StructItem {...ItemProps} />
                </Row>
              </div>
            </Row>
            { modalVisible && <StructAttrModal {...structAttrModalProps} /> }
          </Card>
        </Page> : null
      }</div>
    </div>
  )
}
export default connect(({ struct, loading, app }) => ({ struct, loading, app }))(Struct)

