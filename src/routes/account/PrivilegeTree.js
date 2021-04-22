import { Tree, Message, Button, Icon } from 'antd'

const TreeNode = Tree.TreeNode

const PrivilegeTree = ({
  checkedPrivilege, privilegeTree, shortName, 
  onChangeAccountPrivilege, 
  onEdit,onCancel,
  onSubmit,
  departSelected, accountSelected, editable
}) => {
  const getCurrentPrivilege = () => {
    if (accountSelected) {
      return accountSelected._privilegeList?accountSelected._privilegeList:
      (accountSelected.privilegeList ? accountSelected.privilegeList : [])
    } else if (departSelected) {
      return departSelected._privilegeList?departSelected._privilegeList:
      (departSelected.privilegeList ? departSelected.privilegeList : [])
    }
    return []
  }

  const getCurrentName = () => {
    if (accountSelected) {
      return `${accountSelected.departName}/${accountSelected.loginName}@${shortName}`
    } else if (departSelected) {
      return departSelected.name
    }
    return '当前未选中任何部门或用户'
  }

  const handleChoosePrivilege = (ids) => {
    if (accountSelected || departSelected) {
      return onChangeAccountPrivilege(ids)
    }

    Message.info('请先选择部门或者用户进行操作')
  }

  const renderTreeNodes = (data) => {
    if (data) {
      return data.map((item) => {
	      if (item.children) {
	        return (
  <TreeNode title={<span>{item.label}</span>} key={item.id} dataRef={item} disabled={!editable}>
    {renderTreeNodes(item.children)}
  </TreeNode>
	        )
	      }
	      return <TreeNode title={<span>{item.label}</span>} key={item.id} dataRef={item} disabled={!editable}/>
	    })
    }
  }

  return (<div style={{ minHeight: '600px', border: '1px solid #f4f4f4' }}>
    <div style={{ padding: '10px', background: 'rgb(242,242,242)' }}>
      <span>{getCurrentName()}
      </span>
    </div>
    <div>
      {(accountSelected||departSelected)?
        (editable?<span><Button type="primary" size="small" style={{float:'right',marginTop:'5px',marginRight:'10px'}} onClick={onSubmit}>保存</Button><Button size="small" style={{float:'right',marginTop:'5px',marginRight:'5px'}} onClick={onCancel}>取消</Button></span>:
        <Button size="small" style={{float:'right',marginTop:'5px',marginRight:'10px'}} onClick={onEdit}>编辑</Button>):''}
    </div>
    <div style={{ padding: '0px',marginTop:'15px' }}>
      {
			privilegeTree ? <Tree
        checkable
        defaultExpandAll
        onCheck={handleChoosePrivilege}
        checkedKeys={getCurrentPrivilege()}
            >
        {renderTreeNodes(privilegeTree)}
      </Tree> : ''
     }

    </div>
  </div>)
}

export default PrivilegeTree
