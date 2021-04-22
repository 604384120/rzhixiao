import { Input } from 'antd'
import styles from '../common.less'

const PrintShow = ({
  imgUrl, receiptTemplateTexts, onChoose, currentTexts,
}) => {
  const handleChoose = (node) => {
    onChoose(node)
  }

  const creatTemplateText = () => {
    let list = []
    for(let node of receiptTemplateTexts){
      list.push(<div key={node.id} onClick={() => handleChoose(node)}>
          <Input disabled value={node.name} 
            style={{position: 'absolute', cursor: 'pointer', width: `${node.width}%`, height: `${node.height}%`, left: `${node.positionX}%`, top: `${node.positionY}%`}} 
            className={currentTexts == node.id ? styles.active_input : ''}
          />
        </div>)
    }
    return list
  }

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <div style={{ position: 'relative' }}>
        <img style={{ width: '100%' }} src={imgUrl} />
        {creatTemplateText()}
      </div>
    </div>)
}

export default PrintShow
