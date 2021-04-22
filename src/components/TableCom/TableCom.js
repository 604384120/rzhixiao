import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { Resizable } from 'react-resizable'
import md5 from 'md5'

const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  )
}

class TableCom extends React.Component {
  state = {
    columns: this.props.columns,
    index: '',
    widthCol: {},
    subColumns: null,
  }

  components = {
    header: {
      cell: ResizeableTitle,
    },
  }

  constructor(props) {
  //   // 必须在这里通过super调用父类的constructor
    super(props);

    let index = md5(JSON.stringify(props.columns))
    let widthCol = window.sessionStorage.getItem(index)
    if(widthCol){
      widthCol = JSON.parse(widthCol)
      for(let column of props.columns){
        if(widthCol && widthCol[column.dataIndex]){
          column.width = widthCol[column.dataIndex]
        }
      }
    }
    this.state = {
      columns: props.columns,
      index,
      widthCol: widthCol?widthCol:{}
    }
  }

  componentWillReceiveProps(nextProps) { // 父组件重传props时就会调用这个方法
    let index = md5(JSON.stringify(nextProps.columns))
    // if(index == this.state.index){
    //   //内容没有任何改变，不需要更新表头
    //   return
    // }
    let widthCol = window.sessionStorage.getItem(index)
    window.sessionStorage.setItem(this.state.index, null)
    if(widthCol){
      widthCol = JSON.parse(widthCol)
      for(let colunm of nextProps.columns){
        if(widthCol){
          if(widthCol[colunm.dataIndex]){
            colunm.width = widthCol[colunm.dataIndex]
          }else{
            widthCol[colunm.dataIndex] = colunm.width
          }
        }
      }
    }
    if(index == this.state.index){
      //内容没有任何改变，不需要更新表头
      //return
      window.sessionStorage.setItem(index, JSON.stringify(widthCol))
    }
    this.setState({columns: nextProps.columns, index, widthCol:widthCol?widthCol:{}})
  }

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns]
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      }
      this.state.widthCol[nextColumns[index].dataIndex] = nextColumns[index].width
      window.sessionStorage.setItem(this.state.index, JSON.stringify(this.state.widthCol))
      return { columns: nextColumns }
    })
  }

  render() {
    const columns = this.state.columns.map((col, index) => {
      let temp = {
        ...col,
        onHeaderCell: column => ({
          width: column.width,
          onResize: this.handleResize(index),
        }),
      }
      if(col.subColumns){
        for(let subColumn of col.subColumns){
          if(this.state.widthCol && this.state.widthCol[subColumn.dataIndex]){
            subColumn.width = this.state.widthCol[subColumn.dataIndex]
          }
        }
        temp.render = (text, record) => {
          let dataSource = col.subDataSource(record)
          return {
            children: dataSource.length>0?<Table
              dataSource={dataSource}
              columns={col.subColumns}
              size="middle"
              bordered
              showHeader={false}
              pagination={false}
              rowKey={re => re.id}
              style={{width:'100%'}}
              />:'',
            props: {
              colSpan: col.subColSpan,
              className:this.props.styles.childTablePanel,
              style:{padding:'0'}
            },
          };
        }
      }
      return temp
    })
    return <Table
            {...this.props}
            columns={columns}
    				components={this.components}
          />
  }
}

TableCom.propTypes = {
  //dataLoading:PropTypes.bool,
  // type: PropTypes.string,
  // columns: PropTypes.array,
  // dataSource: PropTypes.array,
  // styles: PropTypes.object,
  // getFormat: PropTypes.func,
  // onMoveLeft: PropTypes.func,
  // onMoveRight: PropTypes.func,
}

export default TableCom




