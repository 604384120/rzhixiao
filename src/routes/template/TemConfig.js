import { Input, Button, Upload, Row, Card, Select, Popover, Message, InputNumber, Radio, Checkbox } from 'antd'
import { config } from 'utils'
import reqwest from 'reqwest'
import styles from '../common.less'

const { api } = config
const Option = Select.Option
const RadioGroup = Radio.Group

const TemConfig = ({
  receiptTemplateTexts,
  templateWidth,
  templateWidthTemp,
  fontSize,
  currentText,
  onSelectText,
  imgAspect,
  popVisible,
  changePop,
  configData,
  configData_temp,
  valueData,
  onAddText,
  onChangeWidth,
  onChangeFontSize,
  onTextWidth,
  onTextHeight,
  onTextPosX,
  onTextPosY,
  onSaveAll,
  onCancel,
  newTextName,
  onChangeName,
  onUploadImg,
  fileList,
  onUpload,
  onChangeType,
  onChooseRelate,
  onChangeText,
  onChangeBeginNo,
  onChangeTop,
  onChangeLeft,
  onChangePrintBg,
}) => {
  const uploadProps = {
    action: api.importUserExcel,
    showUploadList: false,
    beforeUpload: (file) => {
      onUploadImg(file)
    },
    data: { sence: 'uploadImg' },
    fileList,
    onChange: (info) => {
      if (info.file.status === 'done') {
        Message.success('上传成功')
        onUpload(info.file.response.ret_content)
      } else if (info.file.status === 'error') {
        Message.error('上传失败')
      }
    },
  }

  const createTextOption = () => {
    const options = [];
    if(receiptTemplateTexts){
      for(let index of receiptTemplateTexts){
        options.push(<Option key={index.id} value={index.id} title={index.name}>{index.name}</Option>)
      }
    }
		return options;
  }

  const creatValueOption = () => {
    const options = []
    for(let index of valueData){
      options.push(<Option key={index.relateId} value={index.relateId} title={index.label}>{index.label}</Option>)
    }
    return options
  }

  let height = 0
  let width = 0

  if (currentText) {
    height = currentText.height * templateWidth * imgAspect / 100

    width = currentText.width * templateWidth / 100
  }

  const addText = (
    <div>
      <Input placeholder="输入文本框名" value={newTextName} onChange={onChangeName} style={{ width: '180px', margin: '20px' }} />
      <Button type="primary" onClick={onAddText} icon="plus">添加</Button>
    </div>
  )

  const renderforSelect = () => {
    if (currentText && configData_temp[currentText.id] && configData_temp[currentText.id].type != '1') {
      return (<Select style={{ width: '70%' }}
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        value={configData_temp[currentText.id] ? configData_temp[currentText.id].relateId : ''}
        onChange={onChooseRelate}
      >
        {creatValueOption()}
      </Select>)
    }

    return (<Input disabled={!currentText} onChange={onChangeText} value={currentText && configData_temp[currentText.id] ? configData_temp[currentText.id].value : ''} style={{ width: '70%' }} />)
  }

  return (<div>
    <Row>
      <Upload style={{ width: '30%' }} {...uploadProps}>
        <Button icon="upload" type="primary">上传票据</Button>
      </Upload>
    </Row>

    <Row className={styles.space}>
      <span className={styles.beforeInp}>票据宽度:</span><Input className={!templateWidthTemp || templateWidthTemp == '' || templateWidthTemp == '0'?styles.inputRed:undefined} addonAfter="mm" onChange={onChangeWidth} value={templateWidthTemp} style={{ width: '70%' }} placeholder="请输入票据真实宽度" />
    </Row>

    <Row className={styles.space}>
      <span className={styles.beforeInp}>字体大小:</span><InputNumber min={5} max={20} onChange={onChangeFontSize} value={fontSize} style={{ width: '70%' }} placeholder="请输入票据字体大小" />
    </Row>

    <Row className={styles.titleBg}>文本框设置</Row>
    <Row className={styles.space}>
      <Popover content={addText} visible={popVisible} trigger="click" onVisibleChange={changePop} title="添加文本框">
        <Button icon="plus" type="primary">添加文本框</Button>
      </Popover>
      <Select style={{ width: '120px', marginLeft: 20 }}
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        value={currentText ? currentText.id : ''}
        onSelect={onSelectText}
      >
        {createTextOption()}
      </Select>
    </Row>
    <Row className={styles.space}>
      <span className={styles.beforeInp}>文本框内容</span>
      <RadioGroup value={currentText && configData_temp[currentText.id] ? configData_temp[currentText.id].type : '2'} onChange={onChangeType}>
        <Radio value="2">选择字段</Radio>
        <Radio value="1">输入文本</Radio>
      </RadioGroup>
    </Row>
    <Row className={styles.space}>
      <span className={styles.beforeInp} />
      {renderforSelect()}
    </Row>
    <Row className={styles.space}>
      <span className={styles.beforeInp}>宽 度：</span><Input addonAfter="mm" value={currentText ? width.toFixed(0) : ''} onChange={onTextWidth} style={{ width: '70%' }} placeholder="请输入宽度" />
    </Row>
    <Row className={styles.space}>
      <span className={styles.beforeInp}>高 度：</span><Input addonAfter="mm" value={currentText ? height.toFixed(0) : ''} onChange={onTextHeight} style={{ width: '70%' }} placeholder="请输入高度" />
    </Row>
    <Row className={styles.space}>
      <span className={styles.beforeInp}>位置X：</span><InputNumber max={200} min={0} step={0.1} addonAfter="mm" value={currentText ? (currentText._positionX != undefined ? currentText._positionX : (currentText.positionX * templateWidth / 100).toFixed(1)) : ''} onChange={onTextPosX} style={{ width: '70%' }} placeholder="请输入位置X" />
    </Row>
    <Row className={styles.space}>
      <span className={styles.beforeInp}>位置Y：</span><InputNumber max={120} min={0} step={0.1} addonAfter="mm" value={currentText ? (currentText._positionY != undefined ? currentText._positionY : (currentText.positionY * templateWidth * imgAspect / 100).toFixed(1)) : ''} onChange={onTextPosY} style={{ width: '70%' }} placeholder="请输入位置Y" />
    </Row>
    <Row className={styles.titleBg}>打印设置</Row>
    <Row className={styles.space}>
      <span className={styles.beforeInp}>起始编号：</span>
      <Input className={!configData.beginNo || configData.beginNo == ''?styles.inputRed:undefined} onChange={onChangeBeginNo} value={configData.beginNo} style={{ width: '70%' }} />
    </Row>
    <Row className={styles.space}>
      <span className={styles.beforeInp}>上边距：</span>
      <Input value={configData.offsetUp} onChange={onChangeTop} style={{ width: '70%' }} />
    </Row>
    <Row className={styles.space}>
      <span className={styles.beforeInp}>左边距：</span>
      <Input value={configData.offsetLeft} onChange={onChangeLeft} style={{ width: '70%' }} />
    </Row>
    <Row className={styles.space}><Button onClick={onCancel} style={{ float: 'right' }}>取消</Button><Button onClick={onSaveAll} style={{ float: 'right', marginRight: '10px' }} type="primary">保存</Button><Checkbox checked={configData.printBg=='1'} onChange={onChangePrintBg}
        style={{float:'right',marginRight:'45px',marginTop:'8px'}}>打印背景图片</Checkbox></Row>
  </div>)
}

export default TemConfig
