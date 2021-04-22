import { Row, Col, Card, Button, Input, Steps, Upload, message, Table, Icon, Select, Spin, Popconfirm, Checkbox } from 'antd'
import { Page } from 'components'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { config, dowloadUrl } from 'utils'
import reqwest from 'reqwest'
import { Link } from 'react-router-dom'

const { api } = config
const Step = Steps.Step
const Option = Select.Option

const UserImport = ({
  location,
  dispatch,
  userImport,
  loading,
  app,
}) => {
  const { isNavbar } = app
  const {
    step, fileList, uploading, uploadDisable, importInfo, userAttrList, editable,
    importing, cfNum, cgNum, cgUrl, wxNum, cgCoverNum, covering, cgCoverUrl,
  } = userImport
  const uploadProps = {
    action: api.importUserExcel,
    showUploadList: false,
    beforeUpload: (file) => {
      dispatch({
        type: 'userImport/updateState',
        payload: {
          fileList: [file],
          uploadDisable: false,
        },
      })
      return false
    },
    fileList,
  }

  const handleUpload = () => {
    if (fileList.length == 0) {
      message.error('请先选择文件')
      return
    }
    let upFileName = fileList[0].name
    let suffix = upFileName.substring(upFileName.lastIndexOf('.') + 1, upFileName.length)// 后缀名
    if (!suffix) {
      message.error('请上传xls或者xlsx文件')
      return
    }
    suffix = suffix.toLowerCase()
    if (suffix != 'xls' && suffix != 'xlsx') {
      message.error('请上传xls或者xlsx文件')
      return
    }

    const formData = new FormData()
    formData.append('sence', 'userExcel')
    fileList.forEach((file) => {
      formData.append('files[]', file)
    })

    dispatch({
      type: 'userImport/updateState',
      payload: {
        uploading: true,
      },
    })

    reqwest({
      url: api.importUserExcel,
      method: 'post',
      processData: false,
      data: formData,
      withCredentials: true,
      success: (resp) => {
        if (!resp) {
          message.error('系统错误！')
          dispatch({
            type: 'userImport/updateState',
            payload: {
              uploading: false,
              uploadDisable: true,
            },
          })
          return
        }
        if (typeof (resp) === 'string') {
          resp = JSON.parse(resp)
        }

        if (resp.ret_code != '1') {
          if (resp.ret_code == 12) {
            localStorage.clear()
            window.location.reload()
            return
          }
          message.error(resp.ret_content)
          dispatch({
            type: 'userImport/updateState',
            payload: {
              uploading: false,
              uploadDisable: true,
            },
          })
          return
        } else if (!resp.ret_content) {
          message.error('系统错误！')
          dispatch({
            type: 'userImport/updateState',
            payload: {
              uploading: false,
              uploadDisable: true,
            },
          })
          return
        }

        dispatch({
          type: 'userImport/updateState',
          payload: {
            uploading: false,
            uploadDisable: true,
            filePath: resp.ret_content.fileName,
          },
        })
        message.success('上传成功！')
        // 进入第二阶段
        dispatch({
          type: 'userImport/importUserInfo',
          payload: {
            file: resp.ret_content.fileName,
          },
        })

        dispatch({
          type: 'userImport/updateState',
          payload: {
            step: 1,
          },
        })
      },
      error: () => {
        dispatch({
          type: 'userImport/updateState',
          payload: {
            uploading: false,
            uploadDisable: true,
          },
        })
        message.error('上传失败！')
      },
    })
  }

  const renderStep1 = () => {
    return (
      <div style={{ paddingTop: isNavbar?'40px':'150px' }}>
          <Row style={isNavbar?{textAlign:'center'}:{marginLeft:"30%"}}>
            <span>请正确填入</span><span style={{ fontWeight: 'bold' }}>学生信息</span><span>后选择上传，<a target="_blank" href={dowloadUrl(api.exportUserModel)}>下载表格模板</a></span>
          </Row>
          <Row style={isNavbar?{paddingTop: '30px', textAlign: 'center'}:{ paddingTop: '30px', marginLeft:"30%" }}>
            <Upload style={{ marginRight: '5px'}} {...uploadProps}><Button>浏览</Button></Upload>
            <Input style={{maxWidth:'300px', width: '50%', marginRight:'5px' }} disabled value={fileList[0] ? fileList[0].name : '未选择文件'} />
            <Button type="primary" icon={isNavbar?"":"upload"} loading={uploading} disabled={uploadDisable} onClick={handleUpload}>上传</Button>
          </Row>
          <Row style={isNavbar?{textAlign:"center", marginTop: '10px'}:{ marginLeft:"30%", marginTop: '10px' }}><span>导入可能需要较长时间，请耐心等待...</span></Row>
      </div>
    )
  }

  const renderOption = () => {
    const options = []
    for (let attr of userAttrList) {
      options.push(<Option key={attr.id} title={attr.name}>{attr.name}</Option>)
    }
    return options
  }

  const handleEdit = (record) => {
    const target = importInfo.filter(item => record.id === item.id)[0]
    if (target) {
      target._editable = true
      dispatch({
        type: 'userImport/updateState',
        payload: {
          importInfo,
        },
      })
    }
  }

  const handleChange = (value, record) => {
    const target = importInfo.filter(item => record.id === item.id)[0]
    if (target) {
      target.attrId = value
      dispatch({
        type: 'userImport/updateState',
        payload: {
          importInfo,
        },
      })
    }
  }

  const handleChangeCreateValue = (e) => {
    let editable = '0'
    if(e.target.checked){
      editable = '1'
    }

    dispatch({
      type: 'userImport/updateState',
      payload: {
        editable,
      },
    })
  }

  const handleBackStep1 = () => {
    dispatch({
      type: 'userImport/updateState',
      payload: {
        step: 0,
      },
    })
  }

  const handleStep2OK = () => {
    // 返回所有的数据
    const sortList = []
    const sortCheck = {}
    for (let attr of importInfo) {
      if (sortCheck[attr.attrId]) {
        message.error(`请不要重复绑定一个字段：${attr.source},${sortCheck[attr.attrId].source}`)
        return
      }
      if(attr.attrId){
        sortCheck[attr.attrId] = attr
        let temp = {
          id: attr.id,
          attrId: attr.attrId,
        }
        sortList.push(temp)
      }
    }

    const timerID = setInterval(
      () => {
        dispatch({
          type: 'userImport/getImportPrs',
        })
      },
      3000
    )

    dispatch({
      type: 'userImport/importConfirm',
      payload: {
        sortList: JSON.stringify(sortList),
        editable,
        timerID,
      },
    })
  }

  const columns = [
    {
      title: '数据范例',
      dataIndex: 'example',
      width: '20%',
    }, {
      title: '源文件表头',
      dataIndex: 'source',
      width: '20%',
    }, {
      title: '对应系统表头',
      dataIndex: 'attr',
      width: '20%',
      render: (text, record) => {
        return (
          record._editable ?
            <Select style={{ width: '90%' }}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              value={record.attrId}
              onChange={(value) => { handleChange(value, record) }}
            >{renderOption()}</Select>
            : <div>{text}<Icon type="down" onClick={() => handleEdit(record)} style={{ marginLeft: '5px' }} /></div>
        )
      },
    },
  ]

  const renderStep2 = () => {
    return (
      <div style={{ paddingTop:isNavbar?'20px':'50px' }}>
        <Col span={isNavbar?0:4} />
        <Col span={isNavbar?24:16}>
          <Table
            dataSource={importInfo}
            bordered
            columns={columns}
            pagination={false}
            rowKey={record => record.id}
          />
          <Row style={{ marginTop: '30px', textAlign: 'center', color:'red' }}>
            <Checkbox checked={editable=="1"} onChange={handleChangeCreateValue}/> 同时创建不存在的选项值或者组织结构
          </Row>
          <Row style={{ marginTop: '30px', textAlign: 'center' }}>
            <Button onClick={handleBackStep1} style={{ float: 'center', backgroundColor: '#f2f2f2', borderColor: '#f2f2f2' }}>上一步</Button>
            <Button onClick={handleStep2OK} type="primary" style={{ float: 'center', marginLeft: '20px' }}>确认导入</Button>
          </Row>
        </Col>
      </div>
    )
  }

  const handleCheckUser = () => {
    dispatch(routerRedux.push({
      pathname: '/user',
    }))
  }

  const handleImportAgain = () => {
    dispatch({
      type: 'userImport/updateState',
      payload: {
        step: 0,
        cgNum: '0',
        cgUrl: null,
        wxNum: '0',
        cfNum: '0',
        cgCoverNum: '0',
        importing: false,
        covering: false,
        cgCoverUrl: null,
      },
    })
  }

  const handleCover = () => {
    const timerID = setInterval(
      () => {
        dispatch({
          type: 'userImport/getImportPrs',
        })
      },
      3000
    )

    dispatch({
      type: 'userImport/coverUser',
      payload: {
        timerID,
      },
    })
  }


  const renderCoverButton = () => {
    if (importing) {
      return ''
    } else if (covering && cfNum == '0') {
      return '覆盖完成'
    } else if (cfNum == '0') {
      return ''
    }
    return (
      <Popconfirm title="确认覆盖？" onConfirm={() => handleCover()} okText="确定" cancelText="取消"><a style={{ marginLeft: '10px' }}>覆盖</a></Popconfirm>
    )
  }

  const renderStep3 = () => {
    return (
      <div style={{ paddingTop: isNavbar?'20px':'100px' }}>
        <Col span={isNavbar?0:6} />
        <Col span={isNavbar?24:12}>
          <Row style={isNavbar?{ textAlign:'center' }:{ paddingLeft:'32%' }}>
            <Row>
              {
                importing ? <div><Spin indicator={(<Icon type="loading" style={{ fontSize: 18, marginRight: '10px' }} spin />)} /><span style={{ fontSize: 18 }}>{covering ? '覆盖中' : '导入中'}</span></div>
                : <div><span style={{ fontSize: 18 }}>处理完成</span></div>
              }

            </Row>
            <Row style={{ marginTop: '30px' }}>
              {cgNum}条新数据导入成功 {cgUrl && !importing && cgNum != '0' && <Link to={cgUrl}>查看</Link>}
            </Row>
            {
              covering && <Row style={{ marginTop: '30px' }}>
                {cgCoverNum}条数据覆盖成功 {cgCoverUrl && !importing && cgCoverNum != '0' && <Link to={cgCoverUrl}>查看</Link>}
              </Row>
            }
            <Row style={{ marginTop: '30px' }}>
              <span>{wxNum}条无效数据导入失败 {importing || wxNum == '0' ? '' : <a target="_blank" href={dowloadUrl(api.exportErrorUser)}>下载</a>}</span>
            </Row>
            <Row style={{ marginTop: '30px' }}>
              <span>{cfNum}条重复数据导入失败 {importing || cfNum == '0' ? '' : <a target="_blank" href={dowloadUrl(api.exportRepetitionUser)}>下载</a>} {renderCoverButton()}</span>
            </Row>
          </Row>
          <Row style={{ marginTop: isNavbar?'40px':'120px', textAlign: 'center' }}>
            <Button onClick={handleCheckUser} style={{ float: 'center', backgroundColor: '#f2f2f2', borderColor: '#f2f2f2' }} disabled={importing}>查看学生信息</Button>
            <Button onClick={handleImportAgain} type="primary" style={{ float: 'center', marginLeft: '20px' }} disabled={importing}>继续导入</Button>
          </Row>
        </Col>
      </div>
    )
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return renderStep1()

      case 1:
        return renderStep2()

      case 2:
        return renderStep3()
    }
  }

  return (
    <Page inner>
      <Row gutter={16}>
        <Col>
          <Card bordered={false} bodyStyle={{ padding: '20px 0px' }}>
            <Steps current={step} style={{ width: '80%', marginLeft: '10%' }} size={isNavbar?"small":""}>
              <Step title="选择文件" />
              <Step title="导入设置" />
              <Step title="导入结果" />
            </Steps>
            {renderStep()}
          </Card>
        </Col>
      </Row>
    </Page>
  )
}

UserImport.propTypes = {
  userImport: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default connect(({ userImport, app, loading }) => ({ userImport, app, loading }))(UserImport)

