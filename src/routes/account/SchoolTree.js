
import { Menu, Dropdown, Button, Icon, Tree, Popover } from 'antd'
import React from 'react'
import styles from './tree.less'

const TreeNode = Tree.TreeNode

const SchoolTree = ({
  departTree, user, schoolName, onSelectDepart, onDeleteDepart, onAddDepart, onEditDepart, departs,
}) => {
  const clickNode = (data) => {
    onSelectDepart(data[0])
  }

  const editDepart = (data) => {
    onEditDepart(data)
  }

  const deleteDepart = (data) => {
    onDeleteDepart(data)
  }

  const addDepart = (data) => {
    onAddDepart(data)
  }

  const renderMenu = (data) => {
    const menuList = []
    menuList.push(<Menu.Item key="0"><a onClick={(e) => { e.stopPropagation(); addDepart(data) }}>添加子部门</a></Menu.Item>)
    menuList.push(<Menu.Item key="1"><a onClick={(e) => { e.stopPropagation(); editDepart(data) }}>编辑</a></Menu.Item>)
    menuList.push(<Menu.Item key="2"><a onClick={(e) => { e.stopPropagation(); deleteDepart(data) }}>删除</a></Menu.Item>)
    return menuList
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
      <Dropdown overlay={<Menu>{renderMenu(item)}</Menu>}>
        <Icon type="bars" className={styles.operation} onClick={(e) => { e.stopPropagation() }} style={{ margin: '6px 0 0 15px' }} />
      </Dropdown>
    </div>}
    key={item.id}
    dataRef={item}
  >
    {renderTreeNodes(item.children, level+1)}
  </TreeNode>
	        )
	      }
	      return (<TreeNode title={
  <div>
    <div style={{ float: 'left' }}>{renderTitle(item.label, level)}</div>
    <Dropdown overlay={<Menu>{renderMenu(item)}</Menu>}>
      <Icon type="bars" className={styles.operation} onClick={(e) => { e.stopPropagation() }} style={{ margin: '6px 0 0 15px' }} />
    </Dropdown>
  </div>
							}
  key={item.id}
  dataRef={item}
	      />)
	    })
    }
  }

  return (
    <div style={{ minHeight: '600px', border: '1px solid #f4f4f4' }}>
      <div onClick={() => { clickNode(['0']) }} style={{ padding: '10px', background: 'rgb(242,242,242)' }}>
        <span>{schoolName}</span>
        {user.isAdmin == '1' ? <span>
          <span style={{ float: 'right', marginRight: '10px' }}>
            <Icon type="plus" onClick={(e) => { e.stopPropagation(); addDepart({ id: '0', label: schoolName }) }} />
          </span>
        </span> : ''}
      </div>
      {
          departTree ? <Tree
            className={styles['my-tree']}
            defaultExpandAll
            selectedKeys={departs}
            onSelect={(data) => { clickNode(data) }}
		        >
            {renderTreeNodes(departTree, 0)}
          </Tree> : ''
		  	}

    </div>
	  )
}

export default SchoolTree
