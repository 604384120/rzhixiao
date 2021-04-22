import { Button, Col, Tag, Popover } from 'antd'

const ExportTable = ({
  sence,
  styles,
  isNavbar,
  exportFormat,
  formatVisible,
  onChangeFormat,
  onFormatVisibleChange,
  onGetExportUrl,
})=>{

  const handleChangeFormat = (format) => {
    onChangeFormat (format)
  }

  const handleFormatVisibleChange = (visible) => {
    onFormatVisibleChange(visible)
  }

  if(sence == 'order'){
    const renderTable = () => {
      if(exportFormat == 2){
        return (
          <table border="1px" borderColor="#ddd" className={styles.formatTable} style={{marginLeft:'10px',textAlign:'center',verticalAlign:'middle',width:'550px'}}>
          <thead style={{background:"rgb(245,245,245)"}}>
            <tr>
              <td>姓名</td>
              <td>任务名称</td>
              <td>收费时间</td>
              <td>订单号</td>
              <td>支付方式</td>
              <td>票据单号</td>
              <td>实收合计</td>
              <td>学费</td>
              <td>书本费</td>
              <td>住宿费</td>
            </tr>
          </thead>
          <tbody>
                <tr>
                  <td>学生1</td>
                  <td>2019-2020收费</td>
                  <td>9:00-10:00</td>
                  <td>12376543</td>
                  <td>支付宝</td>
                  <td>12332765458</td>
                  <td>88888</td>
                  <td>77777</td>
                  <td>22222</td>
                  <td>99999</td>
                </tr>
                <tr>
                  <td>学生2</td>
                  <td>2019-2020收费</td>
                  <td>9:00-10:00</td>
                  <td>12376543</td>
                  <td>支付宝</td>
                  <td>12332765458</td>
                  <td>88888</td>
                  <td>77777</td>
                  <td>22222</td>
                  <td>99999</td>
                </tr>
                <tr>
                  <td>学生3</td>
                  <td>2019-2020收费</td>
                  <td>9:00-10:00</td>
                  <td>12376543</td>
                  <td>支付宝</td>
                  <td>12332765458</td>
                  <td>88888</td>
                  <td>77777</td>
                  <td>22222</td>
                  <td>99999</td>
                </tr>
                <tr>
                  <td>学生4</td>
                  <td>2019-2020收费</td>
                  <td>9:00-10:00</td>
                  <td>12376543</td>
                  <td>支付宝</td>
                  <td>12332765458</td>
                  <td>88888</td>
                  <td>77777</td>
                  <td>22222</td>
                  <td>99999</td>
                </tr>
              </tbody>
            </table>
        )
      }else{
        return (
          <table border="1px" borderColor="#ddd" className={styles.formatTable} style={{marginLeft:'10px',textAlign:'center',verticalAlign:'middle',width:'540px'}}>
          <thead style={{background:"rgb(245,245,245)"}}>
            <tr>
              <td>姓名</td>
              <td>收费时间</td>
              <td>订单号</td>
              <td>支付方式</td>
              <td>票据单号</td>
              <td>任务名称</td>
              <td>项目名称</td>
              <td>本次实收</td>
            </tr>
          </thead>
          <tbody>
                <tr>
                  <td>学生1</td>
                  <td>9:00-10:00</td>
                  <td>1234587654</td>
                  <td>支付宝</td>
                  <td>9999900000</td>
                  <td>2019-2020收费</td>
                  <td>学费</td>
                  <td>88888</td>
                </tr>
                <tr>
                <td>学生2</td>
                  <td>9:00-10:00</td>
                  <td>1234587654</td>
                  <td>支付宝</td>
                  <td>9999900000</td>
                  <td>2019-2020收费</td>
                  <td>学费</td>
                  <td>88888</td>
                </tr>
                <tr>
                <td>学生3</td>
                  <td>9:00-10:00</td>
                  <td>1234587654</td>
                  <td>支付宝</td>
                  <td>9999900000</td>
                  <td>2019-2020收费</td>
                  <td>学费</td>
                  <td>88888</td>
                </tr>
                <tr>
                <td>学生4</td>
                  <td>9:00-10:00</td>
                  <td>1234587654</td>
                  <td>支付宝</td>
                  <td>9999900000</td>
                  <td>2019-2020收费</td>
                  <td>学费</td>
                  <td>88888</td>
                </tr>
              </tbody>
            </table>
        )
      }
    }
    const renderFormat = () => {
      return(
        <div style={{width:'630px', height:'250px'}}>
            <Col span={3} style={{textAlign:'center'}}>
              <div><Tag color={exportFormat>=2?"":"blue"} onClick={()=>handleChangeFormat(1)}>&nbsp;&nbsp;格式1&nbsp;&nbsp;</Tag></div>
              <div style={{marginTop:'15px'}}><Tag color={exportFormat==2?"blue":""} onClick={()=>handleChangeFormat(2)}>&nbsp;&nbsp;格式2&nbsp;&nbsp;</Tag></div>
            </Col>
            <Col span={21} style={{borderLeft:"1px solid rgb(240,240,240)"}}>
            <div style={{marginLeft:'10px',marginBottom:'5px'}}>示例：</div>
            {renderTable()}
            <Button type="primary" style={{marginTop:'15px', float:"right"}} target="_blank" href={onGetExportUrl()}>确认导出</Button>
            </Col>
        </div>
      )
    }
    return <Popover title="选择格式"
                  content={renderFormat()}
                  trigger="click"
                  placement="right"
                  visible={formatVisible}
                  onVisibleChange={handleFormatVisibleChange}
                  >
                <Button style={{ marginRight: '15px' }} target="_blank" href={onGetExportUrl()}>导出</Button>
              </Popover>
  }else if(sence == 'return'){
    const renderTable = () => {
      if(exportFormat == 2){
        return (
          <table border="1px" borderColor="#ddd" className={styles.formatTable} style={{marginLeft:'10px',textAlign:'center',verticalAlign:'middle',width:'550px'}}>
          <thead style={{background:"rgb(245,245,245)"}}>
            <tr>
              <td>姓名</td>
              <td>任务名称</td>
              <td>退费时间</td>
              <td>订单号</td>
              <td>支付方式</td>
              <td>票据单号</td>
              <td>实退合计</td>
              <td>学费</td>
              <td>书本费</td>
              <td>住宿费</td>
            </tr>
          </thead>
          <tbody>
                <tr>
                  <td>学生1</td>
                  <td>2019-2020收费</td>
                  <td>9:00-10:00</td>
                  <td>12376543</td>
                  <td>支付宝</td>
                  <td>12332765458</td>
                  <td>88888</td>
                  <td>77777</td>
                  <td>22222</td>
                  <td>99999</td>
                </tr>
                <tr>
                  <td>学生2</td>
                  <td>2019-2020收费</td>
                  <td>9:00-10:00</td>
                  <td>12376543</td>
                  <td>支付宝</td>
                  <td>12332765458</td>
                  <td>88888</td>
                  <td>77777</td>
                  <td>22222</td>
                  <td>99999</td>
                </tr>
                <tr>
                  <td>学生3</td>
                  <td>2019-2020收费</td>
                  <td>9:00-10:00</td>
                  <td>12376543</td>
                  <td>支付宝</td>
                  <td>12332765458</td>
                  <td>88888</td>
                  <td>77777</td>
                  <td>22222</td>
                  <td>99999</td>
                </tr>
                <tr>
                  <td>学生4</td>
                  <td>2019-2020收费</td>
                  <td>9:00-10:00</td>
                  <td>12376543</td>
                  <td>支付宝</td>
                  <td>12332765458</td>
                  <td>88888</td>
                  <td>77777</td>
                  <td>22222</td>
                  <td>99999</td>
                </tr>
              </tbody>
            </table>
        )
      }else{
        return (
          <table border="1px" borderColor="#ddd" className={styles.formatTable} style={{marginLeft:'10px',textAlign:'center',verticalAlign:'middle',width:'540px'}}>
          <thead style={{background:"rgb(245,245,245)"}}>
            <tr>
              <td>姓名</td>
              <td>退费时间</td>
              <td>订单号</td>
              <td>支付方式</td>
              <td>票据单号</td>
              <td>任务名称</td>
              <td>项目名称</td>
              <td>本次实退</td>
            </tr>
          </thead>
          <tbody>
                <tr>
                  <td>学生1</td>
                  <td>9:00-10:00</td>
                  <td>1234587654</td>
                  <td>支付宝</td>
                  <td>9999900000</td>
                  <td>2019-2020收费</td>
                  <td>学费</td>
                  <td>88888</td>
                </tr>
                <tr>
                <td>学生2</td>
                  <td>9:00-10:00</td>
                  <td>1234587654</td>
                  <td>支付宝</td>
                  <td>9999900000</td>
                  <td>2019-2020收费</td>
                  <td>学费</td>
                  <td>88888</td>
                </tr>
                <tr>
                <td>学生3</td>
                  <td>9:00-10:00</td>
                  <td>1234587654</td>
                  <td>支付宝</td>
                  <td>9999900000</td>
                  <td>2019-2020收费</td>
                  <td>学费</td>
                  <td>88888</td>
                </tr>
                <tr>
                <td>学生4</td>
                  <td>9:00-10:00</td>
                  <td>1234587654</td>
                  <td>支付宝</td>
                  <td>9999900000</td>
                  <td>2019-2020收费</td>
                  <td>学费</td>
                  <td>88888</td>
                </tr>
              </tbody>
            </table>
        )
      }
    }
  
    const renderFormat = () => {
      return(
        <div style={{width:'630px', height:'250px'}}>
            <Col span={3} style={{textAlign:'center'}}>
              <div><Tag color={exportFormat>=2?"":"blue"} onClick={()=>handleChangeFormat(1)}>&nbsp;&nbsp;格式1&nbsp;&nbsp;</Tag></div>
              <div style={{marginTop:'15px'}}><Tag color={exportFormat==2?"blue":""} onClick={()=>handleChangeFormat(2)}>&nbsp;&nbsp;格式2&nbsp;&nbsp;</Tag></div>
            </Col>
            <Col span={21} style={{borderLeft:"1px solid rgb(240,240,240)"}}>
            <div style={{marginLeft:'10px',marginBottom:'5px'}}>示例：</div>
            {renderTable()}
            <Button type="primary" style={{marginTop:'15px', float:"right"}} target="_blank" href={onGetExportUrl()}>确认导出</Button>
            </Col>
        </div>
      )
    }
    return <Popover title="选择格式"
        content={renderFormat()}
        trigger="click"
        placement="right"
        visible={formatVisible}
        onVisibleChange={handleFormatVisibleChange}
        >
      <Button style={{ marginRight: '15px' }} target="_blank" href={onGetExportUrl()}>导出</Button>
    </Popover>
  }else if(sence == 'statisticsStudent'){
    const renderTable = () => {
      if(exportFormat == 2){
        return (
          <table border="1px" borderColor="#ddd" className={styles.formatTable} style={{marginLeft:'10px',textAlign:'center',verticalAlign:'middle',width:'450px'}}>
          <thead style={{background:"rgb(245,245,245)"}}>
            <tr>
              <td>姓名</td>
              <td>应收总计</td>
              <td>收费总计</td>
              <td>项目名称</td>
              <td>应收金额</td>
              <td>收费金额</td>
            </tr>
          </thead>
          <tbody>
                <tr>
                  <td rowspan="2">学生1</td>
                  <td rowspan="2">100.00</td>
                  <td rowspan="2">100.00</td>
                  <td>学费</td>
                  <td>50.00</td>
                  <td>50.00</td>
                </tr>
                <tr>
                  <td>住宿费</td>
                  <td>50.00</td>
                  <td>50.00</td>
                </tr>
                <tr>
                  <td rowspan="2">学生2</td>
                  <td rowspan="2">100.00</td>
                  <td rowspan="2">100.00</td>
                  <td>学费</td>
                  <td>50.00</td>
                  <td>50.00</td>
                </tr>
                <tr>
                  <td>住宿费</td>
                  <td>50.00</td>
                  <td>50.00</td>
                </tr>
              </tbody>
            </table>
        )
      }else if(exportFormat == 3){
        return(
        <table border="1px" borderColor="#ddd" className={styles.formatTable} style={{marginLeft:'10px',textAlign:'center',verticalAlign:'middle',width:'450px'}}>
        <thead style={{background:"rgb(245,245,245)"}}>
        <tr>
          <td rowspan="2">姓名</td>
          <td colspan="2">应收金额</td>
          <td colspan="2">收费金额</td>
          <td colspan="2">退费金额</td>
        </tr>
        <tr>
          <td>学费</td>
          <td>住宿费</td>
          <td>学费</td>
          <td>住宿费</td>
          <td>学费</td>
          <td>住宿费</td>
        </tr>
      </thead>
      <tbody>
      <tr>
        <td>学生1</td>
        <td>100.00</td>
        <td>50.00</td>
        <td>50.00</td>
        <td>50.00</td>
        <td>50.00</td>
        <td>0</td>
      </tr>
      <tr>
        <td>学生2</td>
        <td>100.00</td>
        <td>50.00</td>
        <td>50.00</td>
        <td>50.00</td>
        <td>50.00</td>
        <td>0</td>
      </tr>
      <tr>
        <td>学生3</td>
        <td>100.00</td>
        <td>50.00</td>
        <td>50.00</td>
        <td>50.00</td>
        <td>50.00</td>
        <td>0</td>
      </tr>
      </tbody>
      </table>
        )
      }else if(exportFormat == 4){
        return(
        <table border="1px" borderColor="#ddd" className={styles.formatTable} style={{marginLeft:'10px',textAlign:'center',verticalAlign:'middle',width:'450px'}}>
        <thead style={{background:"rgb(245,245,245)"}}>
        <tr>
          <td rowspan="2">姓名</td>
          <td colspan="2">应收金额</td>
          <td colspan="2">收费方式</td>
          <td colspan="2">退费方式</td>
        </tr>
        <tr>
          <td>学费</td>
          <td>住宿费</td>
          <td>现金</td>
          <td>代扣</td>
          <td>现金</td>
          <td>代扣</td>
        </tr>
      </thead>
      <tbody>
      <tr>
        <td>学生1</td>
        <td>100.00</td>
        <td>50.00</td>
        <td>50.00</td>
        <td>50.00</td>
        <td>50.00</td>
        <td>0</td>
      </tr>
      <tr>
        <td>学生2</td>
        <td>100.00</td>
        <td>50.00</td>
        <td>50.00</td>
        <td>50.00</td>
        <td>50.00</td>
        <td>0</td>
      </tr>
      <tr>
        <td>学生3</td>
        <td>100.00</td>
        <td>50.00</td>
        <td>50.00</td>
        <td>50.00</td>
        <td>50.00</td>
        <td>0</td>
      </tr>
      </tbody>
      </table>
        )
      }else if(exportFormat == 5){
        return (
          <table border="1px" borderColor="#ddd" className={styles.formatTable} style={{marginLeft:'10px',textAlign:'center',verticalAlign:'middle',width:'450px'}}>
          <thead style={{background:"rgb(245,245,245)"}}>
            <tr>
              <td>姓名</td>
              <td>所属学年</td>
              <td>应收总计</td>
              <td>收费总计</td>
              <td>项目名称</td>
              <td>应收金额</td>
              <td>收费金额</td>
            </tr>
          </thead>
          <tbody>
                <tr>
                  <td rowspan="4">学生1</td>
                  <td rowspan="2">2017-2018学年</td>
                  <td rowspan="2">100.00</td>
                  <td rowspan="2">100.00</td>
                  <td>学费</td>
                  <td>50.00</td>
                  <td>50.00</td>
                </tr>
                <tr>
                  <td>住宿费</td>
                  <td>50.00</td>
                  <td>50.00</td>
                </tr>
                <tr>
                  <td rowspan="2">2018-2019学年</td>
                  <td rowspan="2">100.00</td>
                  <td rowspan="2">100.00</td>
                  <td>学费</td>
                  <td>50.00</td>
                  <td>50.00</td>
                </tr>
                <tr>
                  <td>住宿费</td>
                  <td>50.00</td>
                  <td>50.00</td>
                </tr>
              </tbody>
            </table>
        )
      }else{
        return (
          <table border="1px" borderColor="#ddd" className={styles.formatTable} style={{marginLeft:'10px',textAlign:'center',verticalAlign:'middle',width:'450px'}}>
          <thead style={{background:"rgb(245,245,245)"}}>
            <tr>
              <td>姓名</td>
              <td>应收金额</td>
              <td>减免金额</td>
              <td>收费总计</td>
              <td>退费金额</td>
              <td>剩余欠费</td>
            </tr>
          </thead>
          <tbody>
                <tr>
                  <td>学生1</td>
                  <td>100.00</td>
                  <td>20.00</td>
                  <td>50.00</td>
                  <td>20.00</td>
                  <td>50.00</td>
                </tr>
                <tr>
                <td>学生2</td>
                  <td>100.00</td>
                  <td>20.00</td>
                  <td>50.00</td>
                  <td>20.00</td>
                  <td>50.00</td>
                </tr>
                <tr>
                <td>学生3</td>
                  <td>100.00</td>
                  <td>20.00</td>
                  <td>50.00</td>
                  <td>20.00</td>
                  <td>50.00</td>
                </tr>
                <tr>
                <td>学生4</td>
                  <td>100.00</td>
                  <td>20.00</td>
                  <td>50.00</td>
                  <td>20.00</td>
                  <td>50.00</td>
                </tr>
              </tbody>
            </table>
        )
      }
    }
  
    const renderFormat = () => {
      return(
        <div style={{width:'530px', height:'250px'}}>
            <Col span={3} style={{textAlign:'center'}}>
              <div><Tag color={exportFormat>=2?"":"blue"} onClick={()=>handleChangeFormat(1)}>&nbsp;&nbsp;格式1&nbsp;&nbsp;</Tag></div>
              <div style={{marginTop:'15px'}}><Tag color={exportFormat==2?"blue":""} onClick={()=>handleChangeFormat(2)}>&nbsp;&nbsp;格式2&nbsp;&nbsp;</Tag></div>
              <div style={{marginTop:'15px'}}><Tag color={exportFormat==3?"blue":""} onClick={()=>handleChangeFormat(3)}>&nbsp;&nbsp;格式3&nbsp;&nbsp;</Tag></div>
              <div style={{marginTop:'15px'}}><Tag color={exportFormat==4?"blue":""} onClick={()=>handleChangeFormat(4)}>&nbsp;&nbsp;格式4&nbsp;&nbsp;</Tag></div>
              <div style={{marginTop:'15px'}}><Tag color={exportFormat==5?"blue":""} onClick={()=>handleChangeFormat(5)}>&nbsp;&nbsp;格式5&nbsp;&nbsp;</Tag></div>
            </Col>
            <Col span={21} style={{borderLeft:"1px solid rgb(240,240,240)"}}>
            <div style={{marginLeft:'10px',marginBottom:'5px'}}>示例：</div>
            {renderTable()}
            <Button type="primary" style={{marginTop:'15px', float:"right"}} target="_blank" href={onGetExportUrl()}>确认导出</Button>
            </Col>
        </div>
      )
    }
    return <Popover title="选择格式"
                  content={renderFormat()}
                  trigger="click"
                  placement="right"
                  visible={formatVisible}
                  onVisibleChange={handleFormatVisibleChange}
                  >
              <Button style={{ marginRight: '15px', marginBottom:isNavbar?'10px':undefined }} target="_blank" href={onGetExportUrl()}>导出</Button>
            </Popover>
  }else if(sence == 'statisticsMission'){
    const renderTable = () => {
      if(exportFormat == 2){
        return (
          <table border="1px" borderColor="#ddd" className={styles.formatTable} style={{marginLeft:'10px',textAlign:'center',verticalAlign:'middle',width:'450px'}}>
            <thead style={{background:"rgb(245,245,245)"}}>
              <tr>
                <td rowspan="2">姓名</td>
                <td rowspan="2">应收总计</td>
                <td rowspan="2">收费总计</td>
                <td colspan="2">学费</td>
                <td colspan="2">住宿费</td>
              </tr>
              <tr>
                <td>应收金额</td>
                <td>收费金额</td>
                <td>应收金额</td>
                <td>收费金额</td>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td>学生1</td>
              <td>100.00</td>
              <td>50.00</td>
              <td>50.00</td>
              <td>50.00</td>
              <td>50.00</td>
              <td>0</td>
            </tr>
            <tr>
              <td>学生2</td>
              <td>100.00</td>
              <td>50.00</td>
              <td>50.00</td>
              <td>50.00</td>
              <td>50.00</td>
              <td>0</td>
            </tr>
            <tr>
              <td>学生3</td>
              <td>100.00</td>
              <td>50.00</td>
              <td>50.00</td>
              <td>50.00</td>
              <td>50.00</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>)
      }else{
        return (
          <table border="1px" borderColor="#ddd" className={styles.formatTable} style={{marginLeft:'10px',textAlign:'center',verticalAlign:'middle',width:'450px'}}>
            <thead style={{background:"rgb(245,245,245)"}}>
              <tr>
                <td>姓名</td>
                <td>应收总计</td>
                <td>收费总计</td>
                <td>项目名称</td>
                <td>应收金额</td>
                <td>收费金额</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowspan="2">学生1</td>
                <td rowspan="2">100.00</td>
                <td rowspan="2">100.00</td>
                <td>学费</td>
                <td>50.00</td>
                <td>50.00</td>
              </tr>
              <tr>
                <td>住宿费</td>
                <td>50.00</td>
                <td>50.00</td>
              </tr>
              <tr>
                <td rowspan="2">学生2</td>
                <td rowspan="2">100.00</td>
                <td rowspan="2">100.00</td>
                <td>学费</td>
                <td>50.00</td>
                <td>50.00</td>
              </tr>
              <tr>
                <td>住宿费</td>
                <td>50.00</td>
                <td>50.00</td>
              </tr>
            </tbody>
          </table>
        )
      }
    }
    const renderFormat = () => {
      return(
        <div style={{width:'530px', height:'250px'}}>
            <Col span={3} style={{textAlign:'center'}}>
              <div><Tag color={exportFormat==2?"":"blue"} onClick={()=>handleChangeFormat(1)}>&nbsp;&nbsp;格式1&nbsp;&nbsp;</Tag></div>
              <div style={{marginTop:'15px'}}><Tag color={exportFormat==2?"blue":""} onClick={()=>handleChangeFormat(2)}>&nbsp;&nbsp;格式2&nbsp;&nbsp;</Tag></div>
            </Col>
            <Col span={21} style={{borderLeft:"1px solid rgb(240,240,240)"}}>
            <div style={{marginLeft:'10px',marginBottom:'5px'}}>示例：</div>
              {renderTable()}
            <Button type="primary" style={{marginTop:'15px', float:"right"}} target="_blank" href={onGetExportUrl()}>确认导出</Button>
            </Col>
        </div>
      )
    }
    return <Popover title="选择格式"
                content={renderFormat()}
                trigger="click"
                placement="right"
                visible={formatVisible}
                onVisibleChange={handleFormatVisibleChange}
                >
            <Button style={{ marginRight: '10px',marginBottom:'10px' }} target="_blank" href={onGetExportUrl()}>导出</Button>
          </Popover>
  }
}

export default ExportTable