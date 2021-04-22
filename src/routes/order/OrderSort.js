
import { Button, Icon, Popover, Checkbox, Popconfirm } from 'antd'
import React from 'react'
import Sortable, { SortableContainer } from 'react-anything-sortable'

const OrderSort = ({
  sortVisible,
  userAttrList,
  userAttrRelateMap,
  userSortList,
  userSortListTemp,
  userSortMap,
  structList,
  onUpdateState,
  onReset,
  onUpdate,
}) => {
  const handleSortVisibleChange = (visible) => {
    if (visible == false) {
      return
    }
    onUpdateState({ sortVisible: visible })
  }

  const handleClose = () => {
    const tempArr = []
    for (let sort of userSortList) {
      tempArr.push({ ...sort })
    }
    for (let struct of structList) {
		  if (struct.status == '1' && !userSortMap[struct.id]) {
        let attr = {
			  id: struct.id,
			  name: struct.label,
			  _position: tempArr.length,
          _checked: false,
          attrId: userAttrRelateMap[`3_${struct.id}`].id,
        }
        tempArr.push(attr)
		  }
    }
    if (!userSortMap.payType) {
      let attr = {
			  id: 'payType',
			  name: '支付方式',
			  _position: tempArr.length,
			  _checked: false,
      }
      tempArr.push(attr)
		  }
		  if (!userSortMap.reDate) {
      let attr = {
			  id: 'reDate',
			  name: '开票时段',
			  _position: tempArr.length,
			  _checked: false,
      }
      tempArr.push(attr)
		  }
		  if (!userSortMap.receiptNo) {
      let attr = {
			  id: 'receiptNo',
			  name: '票据号段',
			  _position: tempArr.length,
			  _checked: false,
      }
      tempArr.push(attr)
		  }
		  if (!userSortMap.accountId) {
      let attr = {
			  id: 'accountId',
			  name: '经办人',
			  _position: tempArr.length,
			  _checked: false,
      }
      tempArr.push(attr)
		  }
    onUpdateState({ sortVisible: false, userSortListTemp: tempArr })
  }

  const handleCheckChange = (e, item) => {
    const target = userSortListTemp.filter(node => item.id === node.id)[0]
    if (target) {
      target._checked = e.target.checked
    }
    onUpdateState({ userSortListTemp })
  }

  const handleDrag = (data) => {
    const tempList = []
    for (let sort of data) {
      tempList.push(userSortListTemp[sort])
    }
    onUpdateState({ userSortListTemp: tempList })
  }

  const handleReset = () => {
    onReset()
  }

  const handleUpdate = () => {
    onUpdate()
  }

  const items = []
  let i = 0
  for (let item of userSortListTemp) {
    items.push(<SortableContainer className="sort" sortData={i} key={i}>
      <div>
        <Checkbox className="sort-subject-checkbox" checked={item._checked} onChange={e => handleCheckChange(e, item)}>{item.name}</Checkbox>
        <Icon className="sort-subject-drag" type="swap" />
      </div>
    </SortableContainer>)
    i++
  }

  return (
    <Popover
      content={
        <div style={{ width: '111%' }}>
          <div style={{ height: '200px', overflow: 'scroll' }}>
            <Sortable className="sort-container" direction="vertical" dynamic sortHandle="sort-subject-drag" onSort={handleDrag}>
              {items}
            </Sortable>
          </div>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Button size="small" style={{ marginRight: '10px' }} onClick={handleClose}>取消</Button><Button type="primary" size="small" onClick={handleUpdate}>确定</Button>
          </div>
        </div>
				}
      title={
        <div>
          <span>筛选条件设置</span>
          <span style={{ marginLeft: '20px' }}>
            <Popconfirm title="确认重置？" onConfirm={() => handleReset()} okText="确定" cancelText="取消"><Button size="small">重置</Button></Popconfirm>
          </span>
        </div>
				}
      trigger="click"
      placement="bottom"
      visible={sortVisible}
      onVisibleChange={handleSortVisibleChange}
    >
      <Icon type="filter"
        style={{
 float: 'right', fontSize: '20px', paddingTop: '5px', marginRight: '20px', color: sortVisible ? '#1890ff' : '',
}}
      />
    </Popover>
	  )
}

export default OrderSort
