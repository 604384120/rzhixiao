/* global window */
/* global document */
import React from 'react'
import NProgress from 'nprogress'
import PropTypes from 'prop-types'
import pathToRegexp from 'path-to-regexp'
import { connect } from 'dva'
import { Loader, MyLayout, Print } from 'components'
import { BackTop, Layout, Modal, Row, Button } from 'antd'
import { classnames, config } from 'utils'
import { Helmet } from 'react-helmet'
import { withRouter } from 'dva/router'
import { routerRedux } from 'dva/router'
import Error from './error'
import '../themes/index.less'
import './app.less'
import md5 from 'md5'

const { Content, Footer, Sider } = Layout
const { Header, Bread, styles } = MyLayout
const { prefix, openPages } = config

let lastHref
let lastHrefPath
const App = ({
  children, dispatch, app, loading, location,
}) => {
  const {
    user, siderFold, darkTheme, isNavbar, menuPopoverVisible, navOpenKeys, menu, permissions, pwdModalVisible,
    msgLoading, msgList, msgCount, msgVisible, msgUnreadCount, msgStatus, msgPageSize, msgPageNum, msgTimer, msgRefesh, 
    printing, printCheck, textData, templateHeight, printData,
  } = app
  let { pathname } = location
  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  const { iconFontJS, iconFontCSS, logo } = config
  const current = menu.filter(item => pathToRegexp(item.route || '').exec(pathname))
  const hasPermission = current.length ? permissions.visit.includes(current[0].id) : false
  const { href } = window.location

  if(!user && pathname!='/login' && lastHrefPath=='/login'){
    dispatch(routerRedux.push({
      pathname: '/login',
    }))
  }
  
  if (lastHref !== href) {  
    NProgress.start()
    if (!loading.global) {
      NProgress.done()
      lastHref = href
      lastHrefPath = pathname
    }
  }

  const headerProps = {
    menu,
    user,
    location,
    siderFold,
    isNavbar,
    menuPopoverVisible,
    navOpenKeys,
    pwdModalVisible,
    msgLoading,
    msgList,
    msgCount,
    msgVisible,
    msgUnreadCount,
    msgStatus,
    msgPageSize,
    msgPageNum,
    msgTimer,
    msgRefesh,
    switchMenuPopover () {
      dispatch({ type: 'app/switchMenuPopver' })
    },
    logout () {
      dispatch({ type: 'app/logout' })
    },
    switchSider () {
      dispatch({ type: 'app/switchSider' })
    },
    changeOpenKeys (openKeys) {
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
    },
    showPwdModal () {
      dispatch({ type: 'app/showPwdModal' })
    },
    hidePwdModal () {
      dispatch({ type: 'app/hidePwdModal' })
    },
    onUpdateState (data) {
      dispatch({ type: 'app/updateState', payload: { ...data } })
    },
    onGetMsgList (data) {
      dispatch({ type: 'app/getMessageList', payload: { ...data } })
    },
    onUpdateMessageStatus (data) {
      dispatch({ type: 'app/updateMessageStatus', payload: { ...data } })
    },
    onGetMsgCount () {
      dispatch({ type: 'app/getMessageCount' })
    },
    updatePwdSubmit (data) {
      dispatch({
        type: 'app/updatePwd',
        payload: {
          oldPwd: md5(data.password_original),
          newPwd: md5(data.password),
        },
      })
      dispatch({
        type: 'app/hidePwdModal',
      })
    },
  }

  const siderProps = {
    menu,
    location,
    siderFold,
    darkTheme,
    navOpenKeys,
    isNavbar,
    menuPopoverVisible,
    changeTheme () {
      dispatch({ type: 'app/switchTheme' })
    },
    switchMenuPopover () {
      dispatch({ type: 'app/switchMenuPopver' })
    },
    switchSider () {
      dispatch({ type: 'app/switchSider' })
    },
    changeOpenKeys (openKeys) {
      window.localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys))
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
    },
  }

  const breadProps = {
    menu,
    location,
  }

  if (openPages && openPages.includes(pathname)) {
    return (<div>
      <Loader fullScreen spinning={loading.effects['app/query']} />
      {children}
    </div>)
  }

  const getHeight = (value)=>{
    dispatch({
      type: 'app/updateState',
      payload:{
        templateHeight: value
      },
    })
  }

  const handlePrint = () => {
    const prnList = window.document.getElementsByName('prn')
    let tempStr = ""
    for(let node of prnList){
      tempStr += node.innerHTML
    }
		//const prnhtml = window.document.getElementById('prn').innerHTML
    window.document.getElementById('printArea').innerHTML = tempStr
    dispatch({
      type: 'app/updateState',
      payload: {
        printCheck: 0,
      },
    })
    setTimeout(() => {
      dispatch({
        type: 'app/print'
      })
    }, 500)
  }
  
  const handlePrintResult = (rs) => {
		if(rs){
      //打印成功
      dispatch({
        type: 'app/printSuccessBatch',
      })
		}else{
      //打印失败
      dispatch({
        type: 'app/updateState',
        payload: {
          printCheck: 0,
        },
      })
		}
  }

  const renderPrintList = () => {
    const list = []
    for(let node of printData._list){
      let billList = []
      for(let billNode of node.feeBillLists){
        if(printData._subjectMap[billNode.subjectId]._checked && !billNode.receiptNo){
          billList.push(billNode)
        }
      }
      if(billList.length>0){
        list.push(
          <div style={{width:'600px',pageBreakBefore: 'auto', pageBreakAfter: 'always'}}>
          <div style={{background:'url('+textData.imgUrl+') no-repeat', backgroundSize:'100%'}}>
          <Print textData={textData} getHeight={getHeight} templateHeight={templateHeight} settingData={node._settingData} />
          </div>
        </div>
        )
      }
    }
    return list
  }
  
  return (
    <div>
      {menu.length > 0 && <div>
        <Loader fullScreen spinning={loading.effects['app/query']} />
        <Helmet>
          <title>收费管理系统</title>
          <meta content="webkit" name="renderer" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0x" />
          <link rel="icon" href={logo} type="image/x-icon" />
          {iconFontJS && <script src={iconFontJS} />}
          {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}
          <link rel="stylesheet" href="/drag.css" />
        </Helmet>

        {
          user&&<Layout style={printing ? { display: 'none' } : {}} className={classnames({ [styles.dark]: darkTheme, [styles.light]: !darkTheme })}>

          <Header {...headerProps} />
          <Layout style={{ height: '100vh', overflow: 'scroll' }} id="mainContainer">
            <BackTop target={() => document.getElementById('mainContainer')} />
            {!isNavbar && <Sider
              trigger={null}
              collapsible
              collapsed={siderFold}
            >
              {siderProps.menu.length === 0 ? null : <MyLayout.Sider {...siderProps} />}
            </Sider>}
            <Content style={{ height: '95vh' }}>
              <Bread {...breadProps} />
              {hasPermission ? children : <Error />}
              <Footer>
                {config.footerText}
              </Footer>
            </Content>

          </Layout>

        </Layout>
        }
        {printCheck!=0&&<Modal visible={true} title={"打印确认"} footer={null} maskClosable={false} onCancel={()=>{handlePrintResult(false)}} width={'700px'}>
        <Row style={{margin: 'auto', left: 0, right: 0, width:'600px'}}>
        {renderPrintList()}
        </Row>
        <Row style={{marginTop:'60px', textAlign:'center'}}>
        {printCheck==1&&<Button type="primary" onClick={()=>{handlePrint()}}>确认打印</Button>}
        {printCheck==2&&<Button onClick={()=>{handlePrintResult(false)}} style={{marginRight:'10px'}}>打印失败</Button>}
        {printCheck==2&&<Button type="primary" disabled={printData._isPrinting>0} onClick={()=>{handlePrintResult(true)}}>打印成功</Button>}
        </Row>
        </Modal>}
        <div id="printArea" style={!printing ? { display: 'none' } : {}} />

        </div>}

    </div>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(App))
