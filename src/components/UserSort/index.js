import { Button, Icon, Popover, Checkbox, Popconfirm } from 'antd'
import Sortable, { SortableContainer } from 'react-anything-sortable'

const UserSort = ({
  visible,
  userAttrList,
  displayList,
  style,
  className,
  displayListTemp,
  displayMap,
  displayExtra,
  onFilter,
  onUpdateState,
  onReset,
  onUpdate,
}) => {
  const handleSortVisibleChange = (visible) => {
    if (visible == false) {
      return
    }
    onUpdateState({ visible: visible })
  }

  const handleClose = () => {
    const tempArr = []
    if(displayList){
      for (let sort of displayList) {
        tempArr.push({ ...sort })
      }
      for (let attr of userAttrList) {
        if(onFilter && onFilter(attr)){
          continue
        }
        if (!displayMap[attr.id]) {
          let attrTemp = { ...attr }
          attrTemp._checked = false
          attrTemp._position = tempArr.length
          tempArr.push(attrTemp)
        }
      }
      for(let extra in displayExtra){
        if (!displayMap[extra]) {
          let attr = {
            id: extra,
            name: displayExtra[extra],
            _position: tempArr.length,
            _checked: false,
          }
          tempArr.push(attr)
        }
      }
    }
    
    onUpdateState({ visible: false, displayListTemp: tempArr })
  }

  const handleCheckChange = (e, item) => {
    const target = displayListTemp.filter(node => item.id === node.id)[0]
    if (target) {
      target._checked = e.target.checked
    }
    onUpdateState({ displayListTemp })
  }

  const handleDrag = (data) => {
    const tempList = []
    for (let sort of data) {
      tempList.push(displayListTemp[sort])
    }
    onUpdateState({ displayListTemp: tempList })
  }

  const handleReset = () => {
    onReset()
  }

  const handleUpdate = () => {
    onUpdate(displayListTemp)
  }

  const renderItems = () => {
    const items = []
    let i = 0
    if(displayListTemp){
      for (let item of displayListTemp) {
        items.push(<SortableContainer className="sort" sortData={i} key={i}>
          <div>
            <Checkbox className="sort-subject-checkbox" checked={item._checked} onChange={e => handleCheckChange(e, item)}>{item.name}</Checkbox>
            <Icon className="sort-subject-drag" type="swap" />
          </div>
        </SortableContainer>)
        i++
      }
    }
    return items;
  }

  return (
    <Popover
      content={
        <div style={{ width: '111%' }}>
          <div style={{ height: '200px', overflow: 'scroll' }}>
            <Sortable className="sort-container" direction="vertical" dynamic sortHandle="sort-subject-drag" onSort={handleDrag}>
              {renderItems()}
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
      visible={visible}
      onVisibleChange={handleSortVisibleChange}
    >
      <a style={{...style}} className={className}>更多筛选条件 <Icon type="down" /></a>
    </Popover>
	  )
}

export default UserSort

