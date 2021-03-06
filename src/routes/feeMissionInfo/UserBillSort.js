
import { Button, Icon, Popover, Checkbox, Popconfirm } from 'antd'
import Sortable, { SortableContainer } from 'react-anything-sortable'

const UserBillSort = ({
  sortVisible,
  userAttrList,
  userSortList,
  userSortListTemp,
  userSortMap,
  className,
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
    for (let attr of userAttrList) {
      if (!userSortMap[attr.id]) {
        let attrTemp = { ...attr }
        attrTemp._checked = false
        attrTemp._position = tempArr.length
        tempArr.push(attrTemp)
      }
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
            <Button size="small" style={{ marginRight: '10px' }} onClick={handleClose}>??????</Button><Button type="primary" size="small" onClick={handleUpdate}>??????</Button>
          </div>
        </div>
				}
      title={
        <div>
          <span>??????????????????</span>
          <span style={{ marginLeft: '20px' }}>
            <Popconfirm title="???????????????" onConfirm={() => handleReset()} okText="??????" cancelText="??????"><Button size="small">??????</Button></Popconfirm>
          </span>
        </div>
				}
      trigger="click"
      placement="bottom"
      visible={sortVisible}
      onVisibleChange={handleSortVisibleChange}
    >
      <a  className={className}>?????????????????? <Icon type="down" /></a>
    </Popover>
	  )
}

export default UserBillSort
