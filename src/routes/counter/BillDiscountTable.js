import { Table } from "antd"
import styles from '../common.less'
import { getFormat, getYearFormat } from 'utils'

const BillDiscountTable = ({
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
			title: "原减免金额",
			dataIndex: "srcFee",
			width:'80px',
			render: (text, record) => {
				return record.snapshot?getFormat(record.snapshot['discount']):'0.00'
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
			title: "减免金额",
			dataIndex: "dstFee",
      width:'80px',
      render: (text, record) => {
				return record.info?getFormat(record.info['discount']):'0.00'
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
				return record.info?record.info['disReason']:''
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

export default BillDiscountTable;
