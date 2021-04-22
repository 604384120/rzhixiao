import { Row, Col } from 'antd'

const UserSortLayer = ({
  list,
  query
}) => {
  let numPerRow = 4
  if(document.body.clientWidth < 600){
    numPerRow = 1;
  }else{
	numPerRow = Math.round(document.body.clientWidth / 400)
	if(numPerRow == 5){
		numPerRow = 4
	}
  }

  const createSort = () => {
		const sortCols = [];
		let row = 0;
		sortCols.push([]);
		let length = 1;
		for(let node of list){
			if(length > numPerRow){
				//添加新行
				sortCols.push([]);
				row++;
				length = 1;
			}
			if(node.length == 2){
				if(length == numPerRow){
					sortCols.push([]);
					row++;
					length = 1;
				}
				length++;
				sortCols[row].push(<Col span={Math.round(24/numPerRow*2)} key={node.id}>{node.content}</Col>)
			}else{
				sortCols[row].push(<Col span={Math.round(24/numPerRow)} key={node.id}>{node.content}</Col>)
		  }
		  length++;
    }
    if(query){
      if (length > numPerRow) {
        // 新建一个新列
        sortCols.push([])
        row++
        length = 1;
      }
      let len = numPerRow + 1 - length
      for (let i = 1; i < len; i++) {
        sortCols[row].push(<Col span={Math.round(24/numPerRow)} key={`span_${i}`} />)
      }
      // 加入筛选条件
      sortCols[row].push(<Col span={Math.round(24/numPerRow)} key="query_more">{query}</Col>)
    }
    const rows = [];
		let i=0
		for(let cols of sortCols){
		  rows.push(
			<Row key={i++}>
			  {cols}
			</Row>
		  )
		}
		return rows;
  }

  return (
    <div style={{position:'relative', zIndex:810, backgroundColor:'white' }}>
      {createSort()}
    </div>
	)
}

export default UserSortLayer