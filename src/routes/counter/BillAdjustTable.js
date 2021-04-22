import { Table } from "antd"
import styles from '../common.less'
import { getFormat, getYearFormat } from 'utils'

const BillAdjuestTable = ({
  ...tableProps,
  missionCurrent,
  dataSource,
	dataLoading,
}) => {

  const filterData = (data) => {
		if(missionCurrent){
			const arr = data.filter(item => missionCurrent.id === item.missionId)
			return arr;
		}
		return data;
	}

	const columns = [
		{
			title: "学年",
			dataIndex: "year",
      width:'80px',
      render: (text, record) => {
				return getYearFormat(text)
			}
		},
		{
			title: "任务名称",
			dataIndex: "missionName",
			width:'80px'
		},{
			title: "项目名称",
			dataIndex: "subjectName",
			width:'80px'
		},
		{
			title: "原应收金额",
			dataIndex: "srcFee",
			width:'80px',
			render: (text, record) => {
				return record.snapshot?getFormat(record.snapshot['totalFee']):'0.00'
			}
		},
		{
			title: "调整金额",
			dataIndex: "updateFee",
			width:'80px',
			render: (text, record) => {
				return getFormat(text)
			}
		},
		{
			title: "应收金额",
			dataIndex: "dstFee",
      width:'80px',
      render: (text, record) => {
				return record.info?getFormat(record.info['totalFee']):'0.00'
			}
		},{
			title: "调整事项",
			dataIndex: "snapshot",
      width:'80px',
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
    },{
      title: "调整人",
      dataIndex: "accountName",
      width:'80px',
    },{
      title: "调整原因",
      dataIndex: "reason",
      width:'80px',
      render: (text, record) => {
				return record.info?record.info['reason']:''
			}
    },{
      title: "调整时间",
      dataIndex: "createDate",
      width:'80px',
    },
	];

	return (
		<div>
		  <Table
      {...tableProps}
      dataSource={filterData(dataSource)}
			size="middle"
			bordered
			columns={columns}
			pagination={false}
			loading={dataLoading}
			className={styles.fixedTable}
			scroll={{y: 240, x:1078}}
	      />
		</div>
		)
}

export default BillAdjuestTable;
