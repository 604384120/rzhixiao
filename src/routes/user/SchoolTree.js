import { Tree, Popover } from 'antd'

const TreeNode = Tree.TreeNode

const SchoolTree = ({
  departTree, users, schoolName, onSelectDepart, selectedDepart, userSortMap, onLoadStructItem
}) => {
  const clickNode = (data, e) => {
    if(e.selectedNodes.length==1){
      data=e.selectedNodes[0].props.dataRef
      onSelectDepart(data)
    }
  }

  const renderTitle = (label, level) => {
    let length = 12 - level
    if(label.length >= length){
      return <Popover content={label}>{label.substring(0, length)+"..."}</Popover>
    }else{
      return label
    }
  }

  const handleLoadData = (treeNode)=>{
    return new Promise(resolve => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      onLoadStructItem(treeNode.props.dataRef, ()=>{
        resolve();
      })
    });
  }

  const renderTreeNodes = (data, level) => {
  //   let arr = []
  //   for (let item of data){
  //     if(item.structItemAttrRelateMap){
  //       //存在属性关联
  //       for(let index in item.structItemAttrRelateMap){
  //         if(userSortMap[index] && userSortMap[index]._idSelected && userSortMap[index]._idSelected.length>0
  //           && userSortMap[index]._idSelected.indexOf(item.structItemAttrRelateMap[index].relateName)==-1){
  //           //存在筛选条件并且未匹配到所选的内容，返回空
  //             continue
  //         }
  //       }
  //     }
  //     if (item.children) {
  //       arr.push(
  //           <TreeNode title={
  //             <div>
  //               <div style={{ float: 'left' }}>{renderTitle(item.label, level)}</div>
  //             </div>}
  //             key={item.id}
  //             dataRef={item}
  //           >
  //             {renderTreeNodes(item.children, level+1)}
  //           </TreeNode>
  //       )
  //     }
  //     arr.push(<TreeNode title={
  //       <div>
  //         <div style={{ float: 'left' }}>{renderTitle(item.label, level)}</div>
  //       </div>
  //                   }
  //       key={item.id}
  //       dataRef={item}
  //       />)
  //   }
  //   return arr
    if (data) {
      return data.map((item) => {
        if(item.structItemAttrRelateMap){
          //存在属性关联
          for(let index in item.structItemAttrRelateMap){
            if(userSortMap[index] && userSortMap[index]._idSelected && userSortMap[index]._idSelected.length>0
              && userSortMap[index]._idSelected.indexOf(item.structItemAttrRelateMap[index].relateName)==-1){
              //存在筛选条件并且未匹配到所选的内容，返回空
                return
            }
          }
        }
	      if (item.children) {
	        return (
  <TreeNode title={
    <div>
      <div style={{ float: 'left' }}>{renderTitle(item.label, level)}</div>
    </div>}
    key={item.id}
    dataRef={item}
    isLeaf={item.isLeaf}
  >
    {renderTreeNodes(item.children, level+1)}
  </TreeNode>
	        )
	      }
	      return (<TreeNode title={
  <div>
    <div style={{ float: 'left' }}>{renderTitle(item.label, level)}</div>
  </div>
							}
  key={item.id}
  dataRef={item}
  isLeaf={item.isLeaf}
	      />)
	    })
    }
  }

  return (
    <div style={{ minHeight: '600px', border: '1px solid #f4f4f4' }}>
      {
          departTree ? <Tree
            loadData={handleLoadData}
            defaultExpandedKeys={selectedDepart&&selectedDepart.length>0?selectedDepart:['0']}
            selectedKeys={selectedDepart}
            onSelect={(data, e) => { clickNode(data, e) }}
		        >
            {renderTreeNodes(departTree, 0)}
          </Tree> : ''
		  	}

    </div>
	  )
}

export default SchoolTree
