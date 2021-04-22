import { Tree, Popover } from 'antd'

const TreeNode = Tree.TreeNode

const StructTree = ({
  departTree, onSelectDepart, selectedDepart
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

  const renderTreeNodes = (data, level) => {
    if (data) {
      return data.map((item) => {
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
	      return (
          <TreeNode title={
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

export default StructTree
