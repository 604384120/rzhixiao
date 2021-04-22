
import { Menu, Dropdown, Button, Icon, Tree, Popover } from 'antd'
import React from 'react'

const TreeNode = Tree.TreeNode

const SchoolTree = ({
  departTree, user, schoolName, onSelectDepart, departId
}) => {
  const clickNode = (data) => {
    onSelectDepart(data)
  }

  const renderTitle = (label, level) => {
    let length = 15 - level
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
            <TreeNode title={<div style={{ float: 'left' }}>{renderTitle(item.label, level)}</div>}
              key={item.id}
              dataRef={item}
            >
              {renderTreeNodes(item.children, level+1)}
            </TreeNode>
	        )
	      }
	      return (<TreeNode title={<div style={{ float: 'left' }}>{renderTitle(item.label, level)}</div>}
                  key={item.id}
                  dataRef={item}
                />
              )
	    })
    }
  }

  return (
    <div style={{ minHeight: '600px', border: '1px solid #f4f4f4' }}>
      <div onClick={() => { clickNode(['0']) }} style={{ padding: '10px', background: 'rgb(242,242,242)' }}>
        <span>{schoolName}</span>
      </div>
      {
          departTree ? <Tree
            defaultExpandAll
            selectedKeys={departId}
            onSelect={(data) => { clickNode(data) }}
		        >
            {renderTreeNodes(departTree, 0)}
          </Tree> : ''
		  	}

    </div>
	  )
}

export default SchoolTree
