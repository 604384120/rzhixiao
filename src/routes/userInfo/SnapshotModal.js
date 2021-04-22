import { Row, Modal, Button, message, Icon, Popover } from 'antd'
import styles from './index.less'

const SnapshotModal = ({
  modalVisible,
  modalData,
  tempTypeMap,
  typeMap,

  onClose,
}) => {
  const createAttrValue = (type, attr) => {
    let value = ''
    if (modalData._srcMap[attr.id]) {
      value = modalData._srcMap[attr.id].relateName
    }

    if (modalData._dstMap[attr.id]) {
      return (
        <Popover content={value}><span style={{ color: 'red' }}>{modalData._dstMap[attr.id].relateName}</span></Popover>
      )
    }
    return value
  }

  const createAttr = (type) => {
    const attrs = []
    let list = tempTypeMap[type].list
    if (list) {
			  for (let i = 0; i < list.length; i += 2) {
        attrs.push(<tr key={list[i].id}>
          <td className={styles.userInfoAttrTD}>{list[i].name}</td><td className={styles.userInfoAttrValueTD}>
            {createAttrValue(type, list[i])}
          </td>
          <td className={styles.userInfoAttrTD}>{i + 1 >= list.length ? '' : list[i + 1].name}</td><td className={styles.userInfoAttrValueTD}>
            {i + 1 >= list.length ? '' : createAttrValue(type, list[i + 1])}
          </td>
        </tr>)
			  }
    }
    return attrs
  }

  const createAttrGroup = () => {
    const groups = []
    for (let type in tempTypeMap) {
      groups.push(<div style={{ marginBottom: '20px' }} key={type}>
        <Row style={{ borderLeft: '5px solid #1890ff', paddingLeft: '10px', marginBottom: '10px' }}><span style={{ fontSize: '18px', marginRight: '10px' }}>{typeMap[type]}</span>
        </Row>
        <Row>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {createAttr(type)}
            </tbody>
          </table>
        </Row>
      </div>)
    }
    return groups
  }
  return (
    <Modal
      visible={modalVisible}
      onCancel={() => { onClose() }}
      title={`修改记录：${modalData.createDate}`}
      footer={null}
      width="840px"
      maskClosable={false}
    >
      <div style={{ height: '600px', width: '800px', overflowY: 'scroll' }}>
        {createAttrGroup()}
      </div>
    </Modal>
  )
}

export default SnapshotModal
