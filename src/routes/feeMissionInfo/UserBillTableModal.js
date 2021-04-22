import React from "react"
import { Table, Modal } from "antd"
import styles from '../common.less'
import { getFormat } from 'utils'

const UserBillTableModal = ({
	modalTableData,
  modalTableVisible,
  operateHistoryList,
	modalTableMask,
  onModalTableVisible,
}) => {

  let tempMap = {
    '1':{
      srcTitle: "原应收金额",
      dstTitle: "应收金额",
      index: "totalFee"
    },
    '2':{
      srcTitle: "原减免金额",
      dstTitle: "减免金额",
      index: "discount"
    },
    '3':{
      srcTitle: "原缓缴金额",
      dstTitle: "缓缴金额",
      index: "deferred"
    },
  }

	const columns = [];
	let num = 6;
	columns.push({
		title: "项目名称",
		dataIndex: "subjectName",
		width:80,
  })
  columns.push({
    title: tempMap[modalTableMask].srcTitle,
    dataIndex: "srcFee",
    width:80,
    render: (text, record) => {
      return record.snapshot?getFormat(record.snapshot[tempMap[modalTableMask].index]):'0.00'
    }
  })

	if(modalTableMask=='1' || modalTableMask=='2'){
    num ++
    columns.push({
      title: "调整金额",
      dataIndex: "updateFee",
      width:80,
      render: (text, record) => {
        return getFormat(text)
      }
    })
  }
	
	columns.push({
		title: tempMap[modalTableMask].dstTitle,
		dataIndex: "dstFee",
		width:80,
		render: (text, record) => {
			return record.info?getFormat(record.info[tempMap[modalTableMask].index]):'0.00'
		}
  })
  if(modalTableMask=='1'){
    num ++
    columns.push({
      title: "调整事项",
      dataIndex: "snapshot",
      width:80,
      render: (text, record) => {
        if(!record.snapshot){
          return "账单添加"
        }
        if(record.snapshot['status'] == 0 && record.info['status'] == 1){
          return "账单开启"
        }
        if(record.snapshot['status'] == 1 && record.info['status'] == 0){
          return "账单关闭"
        }
        if(record.info['totalFee']){
          return "金额修改"
        }
        if(record.info['reason']){
          return "原因修改"
        }
        return "-"
      }
    })
  }
  if(modalTableMask=='3'){
    num ++
    columns.push({
      title: "截至时间",
      dataIndex: "defTimeEnd",
      width:80,
      render: (text, record) => {
        return record.info?record.info['defTimeEnd']:''
      }
    })
  }
	columns.push({
		title: '调整人',
		dataIndex: "accountName",
		width:80,
  })
  columns.push({
		title: "调整原因",
		dataIndex: "reason",
		width:80,
		render: (text, record) => {
      if(modalTableMask=='1'){
        return record.info?record.info['reason']:''
      }else if(modalTableMask=='2'){
        return record.info?record.info['disReason']:''
      }else{
        return record.info?record.info['defReason']:''
      }
		}
  })
  columns.push({
		title: '调整时间',
		dataIndex: "createDate",
		width:80,
	})

	return (
		<div>
      <Modal
			visible={modalTableVisible}
			onCancel={onModalTableVisible}
			closable={true}
			title={modalTableMask=='1'&&"应收调整记录" || modalTableMask=='2'&&"减免调整记录" || modalTableMask=='3'&&"缓缴调整记录"}
			footer={null}
			width={'1200px'}
			maskClosable={false}
			>
        <Table
        dataSource={operateHistoryList}
        size="middle"
        bordered
        columns={columns}
        pagination={false}
        loading={modalTableData.dataLoading}
        className={styles.fixedTable}
        scroll={{x:num*80}}
        styles={styles}
	      />
			</Modal>
		</div>
		)
}

export default UserBillTableModal;
