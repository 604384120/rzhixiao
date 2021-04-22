
import { Button, Icon, Popover, Checkbox, Popconfirm } from 'antd'
import Sortable, { SortableContainer } from 'react-anything-sortable'

const RefundDisplay = ({
  displayVisible,
  userAttrList,
  userDisplayList,
  userDisplayListTemp,
  userDisplayMap,
  onUpdateState,
  onReset,
  onUpdate,
}) => {
  const handleDisplayVisibleChange = (visible) => {
    if (visible == false) {

    } else {
      onUpdateState({ displayVisible: visible })
    }
  }

  const handleClose = () => {
    const tempArr = []
    for (let display of userDisplayList) {
      tempArr.push({ ...display })
    }
    for (let attr of userAttrList) {
      if (!userDisplayMap[attr.id]) {
        let attrTemp = { ...attr }
        attrTemp._checked = false
        attrTemp._position = tempArr.length
        tempArr.push(attrTemp)
      }
    }
    onUpdateState({ displayVisible: false, userDisplayListTemp: tempArr })
  }

  const handleCheckChange = (e, item) => {
    const target = userDisplayListTemp.filter(node => item.id === node.id)[0]
    if (target) {
      target._checked = e.target.checked
    }
    onUpdateState({ userDisplayListTemp })
  }

  const handleDrag = (data) => {
    const tempList = []
    for (let display of data) {
      tempList.push(userDisplayListTemp[display])
    }
    onUpdateState({ userDisplayListTemp: tempList })
  }

  const handleReset = () => {
    onReset()
  }

  const handleUpdate = () => {
    onUpdate()
  }

  const items = []
  let i = 0
  for (let item of userDisplayListTemp) {
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
          <span>表头设置</span>
          <span style={{ marginLeft: '45px' }}>
            <Popconfirm title="确认重置？" onConfirm={() => handleReset()} okText="确定" cancelText="取消"><Button size="small">重置</Button></Popconfirm>
          </span>
        </div>
				}
      trigger="click"
      placement="bottom"
      visible={displayVisible}
      onVisibleChange={handleDisplayVisibleChange}
    >
      <Icon type="bars"
        style={{
 float: 'right', fontSize: '20px', paddingTop: '5px', marginRight: '20px', color: displayVisible ? '#1890ff' : '',
}}
      />
    </Popover>
	  )
}

export default RefundDisplay
