import { Page } from 'components'
import { Row, Col, Card, Button, Input } from 'antd'

const Print = ({
  settingData, textData, templateHeight, getHeight,
}) => {
  const { templateWidth, imgUrl, receiptTemplateTexts } = textData
  const { settingText, offsetLeft, offsetUp } = settingData

  let arr = {}
  receiptTemplateTexts.map((item) => {
    arr[item.id] = { ...item }
  })

  let stTexts = []
  stTexts = [].concat(JSON.parse(JSON.stringify(settingText)))

  stTexts.forEach((item) => {
    item.positionX = parseFloat(arr[item.textId].positionX) + (offsetLeft / templateWidth * 100)
    item.positionY = parseFloat(arr[item.textId].positionY) + (offsetUp / templateHeight * 100)
    item.width = arr[item.textId].width
    item.height = arr[item.textId].height
    item.fontSize = arr[item.textId].fontSize
  })

  // const style = document.createElement('style')
  // style.type = 'text/css'
  // style.media = 'print'

  const loadImg = (e) => {
    templateHeight = templateWidth * e.target.height / e.target.width
    getHeight(templateHeight)
  }

  if (templateWidth && templateHeight) {
    const str = `@page{size:${templateWidth}mm` + ` ${templateHeight + 1}mm;` + 'margin: 0} '
    // style.innerHTML = str
    // document.getElementsByTagName('head')[0].appendChild(style)
    document.getElementById("printStyle").innerHTML = str
  }
  const printBox = 'printBox'
  return (
    <div id="prn" name="prn">
      <div style={{ position: 'relative', width: '100%', height: '100%' }} className={printBox} >
        <img onLoad={loadImg} src={imgUrl} style={{ visibility: settingData.printBg=='1'?'':'hidden', width: '100%' }} />
        {stTexts.map((item) => {
				return (<div key={item.textId}
  style={{
position: 'absolute', top: `${item.positionY}%`, left: `${item.positionX}%`, width: `${item.width}%`, height: `${item.height}%`,fontFamily:"Microsoft Yahei",color:'black',fontSize:item.fontSize?parseInt(item.fontSize):undefined
}}
				>{item.value}</div>)
			})}
      </div>
    </div>)
}

export default Print

