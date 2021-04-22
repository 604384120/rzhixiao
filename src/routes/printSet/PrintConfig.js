import { Input, Button, Row, Select, Radio, Checkbox } from 'antd'
import styles from '../common.less'

const Option = Select.Option
const RadioGroup = Radio.Group

const PrintConfig = ({
  currentTexts,
  onChangeType,
  receiptTemplateTexts,
  valueData,
  configData_temp,
  onChangeCurrent,
  onChangeText,
  onChooseRelate,
  onChangeTop,
  onChangeLeft,
  configData,
  saveAll,
  onChangeBeginNo,
  onChangePrintBg,
}) => {

  const creatValueOption = () => {
    const options = []
    for(let index of valueData){
      options.push(<Option key={index.relateId} value={index.relateId} title={index.label}>{index.label}</Option>)
    }
    return options
  }

  const creatTextOption = () => {
    const options = []
    for (let index of receiptTemplateTexts){
      options.push(<Option key={index.id} value={index.id} title={index.name}>{index.name}</Option>)
    }
    return options
  }

  const renderforSelect = () => {
    if (configData_temp[currentTexts]) {
      if (configData_temp[currentTexts].type == '2') {
        return (<Select style={{ width: '70%' }}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          value={configData_temp[currentTexts] ? configData_temp[currentTexts].relateId : ''}
          onChange={onChooseRelate}
        >
          {creatValueOption()}
        </Select>)
      }
    }

    return (<Input disabled={!currentTexts} onChange={onChangeText} value={configData_temp[currentTexts] ? configData_temp[currentTexts].value : ''} style={{ width: '70%' }} />)
  }

  return (<div>
    <Row style={{ marginBottom: '20px' }}>
      <span className={styles.beforeInp}>起始编号：</span>
      <Input onChange={onChangeBeginNo} value={configData.beginNo} style={{ width: '70%' }} />
    </Row>
    <Row style={{ marginBottom: '20px' }}>
      <span className={styles.beforeInp}>选择文本框</span>
      <Select showSearch
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        style={{ width: '70%' }}
        value={currentTexts || ''}
        onChange={onChangeCurrent}
      >
        {creatTextOption()}
      </Select>
    </Row>
    <Row style={{ marginBottom: '20px' }}>
      <span className={styles.beforeInp}>文本框内容</span>
      <RadioGroup value={configData_temp[currentTexts] ? configData_temp[currentTexts].type : '1'} onChange={onChangeType}>
        <Radio value="2">选择字段</Radio>
        <Radio value="1">输入文本</Radio>
      </RadioGroup>
    </Row>

    <Row style={{ marginBottom: '20px' }}>
      <span className={styles.beforeInp} />
      {renderforSelect()}
    </Row>
    <Row style={{ marginBottom: '20px', background: 'rgba(228,228,228,.4)', padding: '10px' }}>偏移量设置</Row>
    <Row style={{ marginBottom: '20px' }}>
      <span className={styles.beforeInp}>上边距：</span>
      <Input value={configData.offsetUp} onChange={onChangeTop} style={{ width: '70%' }} />
    </Row>
    <Row style={{ marginBottom: '20px' }}>
      <span className={styles.beforeInp}>左边距：</span>
      <Input value={configData.offsetLeft} onChange={onChangeLeft} style={{ width: '70%' }} />
    </Row>
    <Row style={{ margin: '20px 0 20px 0', textAlign: 'center'  }}>
      <Button style={{float:'right',marginRight:'20px'}} onClick={saveAll} type="primary">保存</Button>
      <Checkbox checked={configData.printBg=='1'} onChange={onChangePrintBg}
        style={{float:'right',marginRight:'45px',marginTop:'8px'}}>打印背景图片</Checkbox>
    </Row>
  </div>)
}

export default PrintConfig
