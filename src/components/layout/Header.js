import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Row, Menu, Icon, Popover, Layout, Badge, List, Checkbox, Radio, Spin } from 'antd'
import classnames from 'classnames'
import styles from './Header.less'
import Menus from './Menu'
import { config, token } from 'utils'
import UpdatePwdModal from './UpdatePwdModal'
import InfiniteScroll from 'react-infinite-scroller'

const { SubMenu } = Menu

const Header = ({
  user, logout, switchSider, siderFold, isNavbar, menuPopoverVisible, location, switchMenuPopover, navOpenKeys, changeOpenKeys, menu,
  pwdModalVisible, showPwdModal, hidePwdModal, updatePwdSubmit,
  msgLoading, msgUnreadCount, msgList, msgCount, msgVisible, msgPageSize, msgPageNum, msgStatus, msgTimer, msgRefesh,
  onUpdateState, onGetMsgList, onGetMsgCount, onUpdateMessageStatus,
}) => {
  let handleClickMenu = (e) => {
    if (e.key === 'logout') {
      logout()
    } else if (e.key === 'showPwdModal') {
      showPwdModal()
    }
  }

  const menusProps = {
    menu,
    siderFold: false,
    darkTheme: false,
    isNavbar,
    handleClickNavMenu: switchMenuPopover,
    location,
    navOpenKeys,
    changeOpenKeys,
  }

  const pwdModalProps = {
    pwdModalVisible,
    hidePwdModal,
    updatePwdSubmit,
  }

  const msgQueryParam = {
    pageNum: msgPageNum,
    pageSize: msgPageSize,
    status: msgStatus,
  }

  const logoRender = (user) => {
    if(user){
      if (user.logoInfo) {
        return (<span><img src={user.logoInfo} style={{ height: '70%', width:'auto', marginRight: '16px' }} /></span>)
      } else if (user.logo) {
        return (<span style={{ color: 'black', fontSize: '15px' }}><img src={user.logo} style={{ height: '60%',  width:'auto', marginRight: '8px' }} />{isNavbar?'':user.schoolName}</span>
        )
      }
      return (<span>{user.schoolName}</span>)
    }
  }

  const renderMsgIcon = (item) => {
    const iconMap = {
      1: 'bank',
      2: 'edit',
      3: 'user-add',
      4: 'user-delete',
    }
    return iconMap[item.type]
  }

  const handleInfiniteOnLoad = () => {
    if (msgLoading || msgCount <= msgList.length) {
      return
    }
    msgQueryParam.pageNum += 1
    msgQueryParam.queryType = 1
    onGetMsgList(msgQueryParam)
  }

  const handleChangeMsgVisible = (visible) => {
    if (msgRefesh) {
      // 强制刷新
      msgQueryParam.msgRefesh = true
      onGetMsgList(msgQueryParam)
    }
    if (visible && (!msgList || msgList.length <= 0)) {
      onGetMsgList(msgQueryParam)
    }
    onUpdateState({ msgVisible: visible })
  }

  const handleShowMsgCheck = (item, visible) => {
    if (item.status == '1') {
      item._showCheckbox = visible
      onUpdateState({ msgList })
    }
  }

  const handleChangeMsgStatus = (e, item) => {
    if (e.target.checked) {
      onUpdateMessageStatus({ id: item.id, status: '2' })
    }
  }

  const handleShowMsgStatus = (e) => {
    if (e.target.checked) {
      msgStatus = 1
    } else {
      msgStatus = null
    }
    msgQueryParam.status = msgStatus
    msgQueryParam.pageNum = 1
    msgQueryParam.pageSize = 15
    onGetMsgList(msgQueryParam)
    onUpdateState({ msgStatus })
  }

  if (!msgTimer && token()) {
    const timerID = setInterval(
      () => {
        onGetMsgCount()
      },
      60000
    )
    onUpdateState({ msgTimer: timerID })
  }

  return (
    <Layout.Header className={styles.header}>
      {
        isNavbar? <Popover placement="bottomLeft" onVisibleChange={switchMenuPopover} visible={menuPopoverVisible} overlayClassName={styles.popovermenu} trigger="click" 
        content={<div style={{overflowY:'scroll',height:'80vh'}}><Menus {...menusProps} /></div>}>
        <div className={styles.logo}>
          {logoRender(user)}
        </div>
        </Popover>: <div className={styles.logo}>
          {logoRender(user)}
        </div>
      }
      <div className={styles.rightWarpper}>
     {
     token()!='' && 
        <div style={{ marginRight: '20px', lineHeight: '56px' }}>
          <Popover placement="bottom"
            mouseLeaveDelay={1}
            trigger="click"
            onVisibleChange={(visible) => { handleChangeMsgVisible(visible) }}
            visible={msgVisible}
            content={
              <div>
                <div style={{ width: '280px', maxHeight: '500px', overflow: 'auto' }}>
                  <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={handleInfiniteOnLoad}
                    hasMore={!msgLoading && msgCount > msgList.length}
                    useWindow={false}
                  >
                    <List
                      dataSource={msgList}
                      locale={msgLoading && msgCount == 0 ? { emptyText: '' } : { emptyText: '暂无未读消息' }}
                      renderItem={item => (
                        <List.Item key={item.id}>
                          <Row style={{ padding: '0px' }} onMouseOver={(e) => { handleShowMsgCheck(item, true) }}>
                          <div style={{
 width: '20px', display: 'inline-block', verticalAlign: 'top', paddingTop: '10px', marginRight: '10px',
}}
                          >
                            <Badge dot={item.status == '1'} offset={['0px', '0px']}><Icon type={renderMsgIcon(item)} style={{ fontSize: 18 }} /></Badge></div>
                          <div style={{ width: '240px', display: 'inline-block' }}>
                            <Row>{item.createDate} {item._showCheckbox ? <Checkbox style={{ float: 'right', fontSize: '12px' }} checked={item.status != '1'} onChange={(e) => { handleChangeMsgStatus(e, item) }}>已处理</Checkbox> : ''}</Row>
                            <Row>{item.sendPersonName} {item.content}{item.url ? <Link to={item.url}>点此查看</Link> : ''}</Row>
                          </div>
                        </Row>
                        </List.Item>
              )}
                    >
                      {msgLoading && msgCount > msgList.length && (
                      <div style={{
 position: 'absolute', bottom: '40px', textAlign: 'center', width: '100%',
}}
                      >
                        <Spin />
                      </div>
              )}
                    </List>
                  </InfiniteScroll>
                </div>
                <div style={{ padding: '20px' }}><Checkbox style={{ float: 'right' }} checked={msgStatus == '1'} onChange={handleShowMsgStatus}>只显示未处理消息</Checkbox>
                </div>
              </div>
          }
          >
            <Badge count={msgUnreadCount} overflowCount={99} offset={['-6px', '7px']}>
              <Icon type="bell" />
            </Badge>
          </Popover>
        </div>
     }
        <Menu mode="horizontal" onClick={handleClickMenu}>
          <SubMenu
            style={{
              float: 'right',
            }}
            title={<span>
              <Icon type="user" />
              {user?user.loginName:null}
            </span>}
          >
            <Menu.Item key="showPwdModal">
              修改密码
            </Menu.Item>
            <Menu.Item key="logout">
              退出登录
            </Menu.Item>
          </SubMenu>
        </Menu>
        <UpdatePwdModal {...pwdModalProps} />
      </div>
    </Layout.Header>
  )
}

Header.propTypes = {
  menu: PropTypes.array,
  user: PropTypes.object,
  logout: PropTypes.func,
  switchSider: PropTypes.func,
  siderFold: PropTypes.bool,
  isNavbar: PropTypes.bool,
  menuPopoverVisible: PropTypes.bool,
  location: PropTypes.object,
  switchMenuPopover: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Header
