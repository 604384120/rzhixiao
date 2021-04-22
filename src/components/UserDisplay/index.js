import { Button, Icon, Popover, Checkbox, Popconfirm } from 'antd'
import Sortable, { SortableContainer } from 'react-anything-sortable'

const UserDisplay = ({
  visible,
  userAttrList,
  displayList,
  displayListTemp,
  displayMap,
  displayExtra,
  onUpdateState,
  title,
  content,
  onReset,
  onUpdate,
}) => {
  const handleDisplayVisibleChange = () => {
    const tempArr = []
    if(displayList){
      for (let display of displayList) {
        tempArr.push({ ...display })
      }
      for (let attr of userAttrList) {
        if (!displayMap[attr.id]) {
          let attrTemp = { ...attr }
          attrTemp._checked = false
          attrTemp._position = tempArr.length
          tempArr.push(attrTemp)
        }
      }
    }
    
    onUpdateState({
      displayListTemp: tempArr, displayAddValue: '', displayAddVisible: false,
    })
  }

  // const handleClose = () => {
  //   const tempArr = []
  //   if(displayList){
  //     for (let display of displayList) {
  //       tempArr.push({ ...display })
  //     }
  //     for (let attr of userAttrList) {
  //       if (!displayMap[attr.id]) {
  //         let attrTemp = { ...attr }
  //         attrTemp._checked = false
  //         attrTemp._position = tempArr.length
  //         tempArr.push(attrTemp)
  //       }
  //     }
  //   }
    
  //   onUpdateState({
  //     visible: false, displayListTemp: tempArr, displayAddValue: '', displayAddVisible: false,
  //   })
  // }

  const handleCheckChange = (e, item) => {
    const target = displayListTemp.filter(node => item.id === node.id)[0]
    if (target) {
      target._checked = e.target.checked
    }
    onUpdateState({ displayListTemp })
  }

  const handleDrag = (data) => {
    const tempList = []
    for (let display of data) {
      tempList.push(displayListTemp[display])
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
    return items
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
          <div style={{ textAlign: 'right' }}>
            {/* <Button size="small" style={{ marginRight: '10px' }} onClick={handleClose}>取消</Button> */}
            <Button type="primary" size="small" style={{marginRight: '20px'}} onClick={handleUpdate}>确定</Button>
          </div>
        </div>
				}
      title={
        <div>
          <span>{title?title:"表头设置"}</span>
          <span style={{ marginLeft: '45px' }}>
            <Popconfirm title="确认重置？" onConfirm={() => handleReset()} okText="确定" cancelText="取消"><Button size="small">重置</Button></Popconfirm>
          </span>
        </div>
				}
      trigger="click"
      placement="bottom"
      // visible={visible}
      onVisibleChange={handleDisplayVisibleChange}
    >
      {content?content:
      <Icon type="bars"
        style={{float: 'right', fontSize: '20px', paddingTop: '5px', marginRight: '20px', color: visible ? '#1890ff' : ''}}
      />}
    </Popover>
	  )
}

export default UserDisplay

