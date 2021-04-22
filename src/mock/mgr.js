const { config } = require('./common')

const { apiPrefix } = config

module.exports = {
  [`POST ${apiPrefix}/mgr/mgrAccount/login`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      loginName: `admin${Math.random()}`,
      departId: '0',
      name: '财务部门',
      schoolName: '电子科技大学',
      shortName: 'ee',
      isAdmin: '1',
      id: '22',
      logo: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523854914696&di=712a2892ec7d2c3336afaf039a1a8150&imgtype=0&src=http%3A%2F%2Fwww.yimiedu.com%2Fupload%2F20150422%2F14296704684703870.png',
      logoInfo: '',
      printType:'',
      isStand: '0',
      msg:'登录失败',
      count:'3',
      isReview:'0',
      groupToken: '7d70wkcf9',
    }
    res.status(200).json(data)
  },


  [`POST ${apiPrefix}/mgr/mgrAccount/autoLogin`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      loginName: `admin${Math.random()}`,
      departId: '0',
      name: '财务部门',
      schoolName: '898989',
      shortName: "xxx",
      isAdmin: '1',
      id: '2',
      logo: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523854914696&di=712a2892ec7d2c3336afaf039a1a8150&imgtype=0&src=http%3A%2F%2Fwww.yimiedu.com%2Fupload%2F20150422%2F14296704684703870.png',
      logoInfo: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=802597730,4249290214&fm=58&bpow=1024&bpoh=1024',
      //logoInfo: 'http://wx.weiweixiao.net/Uploads/dcbb4dbd11290f0/609/riS8S8iL6BGAAAAWPwAVGQ.jpg',
      printType:'bs',
      groupToken: '7d70wkcf9',
    }
    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/mgr/mgrAccount/updateSchool`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      
    }
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/mgr/mgrAccount/loginOut`] (req, res) {
    res.clearCookie('token')
    let data = {}
    data.ret_code = 1
    data.ret_content = ''
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/mgr/mgrAccount/getCurrentTime`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: "2017-08-29 23:11:00" })
  },

  [`POST ${apiPrefix}/mgr/mgrAccount/updateMgrAttr`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/mgr/mgrAccount/deleteMgrAttr`] (req, res) {
    res.status(200).json({ ret_code: 2, ret_content: "22222" })
  },

  [`GET ${apiPrefix}/mgr/mgrAccount/getMgrAttr`] (req, res) {
    let data = {}
    
    data.ret_code = 1
    data.ret_content = [{
      id:"1",
      attrId:"1",
      relateName:"1班,2班,3班,4班,5班,6班,7班,8班,9班,10班,11班,12班,13班,14班,15班,16班,17班,18班",
    },{
      id:"2",
      attrId:"2",
      relateName:null,
    }]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/mgr/mgrAccount/getMgrAccountList`] (req, res) {
    let data = {}

    data.ret_code = 1
    data.ret_content = { count: 50 }
    data.ret_content.data = [{
      id: '1',
      loginName: 'admin1',
      name: '管理员1',
      phone: '16658965896',
      createDate: '2018-01-11 14:08:23',
      updateDate: '2018-01-11 14:08:27',
      departId: '0',
      departName: '卫生部门',
      privilegeList: ['3'],
    },
    {
      id: '2',
      loginName: 'Cooerl2',
      name: 'Cooerl2',
      phone: '13208001770',
      createDate: '2018-01-11 17:57:20',
      updateDate: '2018-01-11 17:57:22',
      departId: '11',
      departName: '卫生部门',
    }, {
      id: '1212',
      loginName: 'admin1212',
      name: '管理员1212',
      phone: '16658965896',
      createDate: '2018-01-11 14:08:23',
      updateDate: '2018-01-11 14:08:27',
      departId: '0',
      departName: '卫生部门',
      privilegeList: ['3'],
    },
    {
      id: '222',
      loginName: 'Cooerl222',
      name: 'Cooerl222',
      phone: '13208001770',
      createDate: '2018-01-11 17:57:20',
      updateDate: '2018-01-11 17:57:22',
      departId: '11',
      departName: '卫生部门',
    }, {
      id: '11111',
      loginName: 'admin11111',
      name: '管理员11111',
      phone: '16658965896',
      createDate: '2018-01-11 14:08:23',
      updateDate: '2018-01-11 14:08:27',
      departId: '0',
      departName: '卫生部门',
      privilegeList: ['3'],
    },
    {
      id: '29',
      loginName: 'aaaaaa29',
      name: 'aaaaaaa29',
      phone: '13208001770',
      createDate: '2018-01-11 17:57:20',
      updateDate: '2018-01-11 17:57:22',
      departId: '11',
      departName: '卫生部门',
    }, {
      id: '133',
      loginName: 'admin133',
      name: '管理员133',
      phone: '16658965896',
      createDate: '2018-01-11 14:08:23',
      updateDate: '2018-01-11 14:08:27',
      departId: '0',
      departName: '卫生部门',
      privilegeList: ['3'],
    },
    {
      id: '82',
      loginName: 'Cooerl82',
      name: 'Cooerl82',
      phone: '13208001770',
      createDate: '2018-01-11 17:57:20',
      updateDate: '2018-01-11 17:57:22',
      departId: '11',
      departName: '卫生部门',
    }, {
      id: '16',
      loginName: 'admin16',
      name: '管理员16',
      phone: '16658965896',
      createDate: '2018-01-11 14:08:23',
      updateDate: '2018-01-11 14:08:27',
      departId: '0',
      departName: '卫生部门',
      privilegeList: ['3'],
    },
    {
      id: '62',
      loginName: 'Cooerl62',
      name: 'Cooerl62',
      phone: '13208001770',
      createDate: '2018-01-11 17:57:20',
      updateDate: '2018-01-11 17:57:22',
      departId: '11',
      departName: '卫生部门',
    }, {
      id: '15',
      loginName: 'admin15',
      name: '管理员15',
      phone: '16658965896',
      createDate: '2018-01-11 14:08:23',
      updateDate: '2018-01-11 14:08:27',
      departId: '0',
      departName: '卫生部门',
      privilegeList: ['3'],
    },
    {
      id: '24',
      loginName: 'Cooerl24',
      name: 'Cooerl24',
      phone: '13208001770',
      createDate: '2018-01-11 17:57:20',
      updateDate: '2018-01-11 17:57:22',
      departId: '11',
      departName: '卫生部门',
    }, {
      id: '12',
      loginName: 'admin12',
      name: '管理员12',
      phone: '16658965896',
      createDate: '2018-01-11 14:08:23',
      updateDate: '2018-01-11 14:08:27',
      departId: '0',
      departName: '卫生部门',
      privilegeList: ['3'],
    },
    {
      id: '21',
      loginName: 'Cooerl21',
      name: 'Cooerl21',
      phone: '13208001770',
      createDate: '2018-01-11 17:57:20',
      updateDate: '2018-01-11 17:57:22',
      departId: '11',
      departName: '卫生部门',
    }]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/mgr/mgrAccount/getMgrAccount`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      id: 1,
      token: '1',
      loginName: 'admin',
      loginPwd: '123456',
      name: 'ztest',
      phone: '16658965896',
      createDate: '2018-01-16 17:22:23',
      updateDate: '2018-01-17 11:09:41',
      privilegeList: [
        '1',
        '3',
      ],
      departId: 2,
      status: 1,
    }
    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/mgr/mgrAccount/updatePwd`] (req, res) {
    const data = {
      ret_code: '1',
      ret_content: '成功修改',
    }

    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/mgr/mgrAccount/updateMgrAccount`] (req, res) {
    res.status(200).json({ ret_code: 0, ret_content: '用户名存在' })
  },

  [`POST ${apiPrefix}/mgr/mgrAccount/deleteMgrAccount`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`GET ${apiPrefix}/mgr/mgrDepart/getMgrDepart`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      id: '1',
      token: '1',
      name: '财务部',
      pid: 0,
      createDate: '2017-12-12 18:04:34',
      updateDate: '2018-01-15 15:53:14',
      privilegeList: ['1', '2'],
      status: '1',
    }
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/mgr/mgrDepart/getMgrDepartTree`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = [{
      id: '1',
      label: '石家庄市新华区阳光未来国际小学',
      pid: '0',
      children: [{
        id: '11',
        label: '二级 1-1',
        pid: '1',
        children: [{
          id: '111',
          label: '三级 1-1-1',
          pid: '11',
        }, {
          id: '112',
          label: '三级 1-1-2三级 1-1-2三级 1-1-2三级 1-1-2三级 1-1-2三级 1-1-2',
          pid: '11',
        }],
      }],
    }, {
      id: '2',
      label: '一级 2',
      pid: '0',
      children: [{
        id: '21',
        label: '二级 2-1',
        pid: '2',
      }, {
        id: '22',
        label: '二级 2-2',
        pid: '2',
      }],
    }, {
      id: '3',
      label: '一级 3',
      children: [{
        id: '31',
        label: '二级 3-1',
        pid: '3',
      }, {
        id: '32',
        label: '二级 3-2',
        pid: '3',
      }],
    }, {
      id: '4',
      label: '一级 3',
      children: [{
        id: '41',
        label: '二级 3-1',
        pid: '4',
      }, {
        id: '42',
        label: '二级 3-2',
        pid: '4',
      }],
    }, {
      id: '5',
      label: '一级 3',
      children: [{
        id: '51',
        label: '二级 3-1',
        pid: '5',
      }, {
        id: '52',
        label: '二级 3-2',
        pid: '5',
      }],
    }]
    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/mgr/mgrPrivilege/updateMgrPrivilege`] (req, res) {
    const data = {
      ret_code: '1',
      ret_content: '成功设置权限',
    }

    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/mgr/mgrDepart/updateMgrDepart`] (req, res) {
    const data = {
      ret_code: '1',
      ret_content: '1',
    }

    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/mgr/mgrPrivilege/getMgrPrivilegeTree`] (req, res) {
    const data = {
      ret_code: 1,
      ret_content:
      [{
        id: '1',
        label: '一级 1',
        children: [{
          id: '11',
          label: '二级 1-1',
          children: [{
            id: '111',
            label: '三级 1-1-1',
          }, {
            id: '112',
            label: '三级 1-1-2',
          }],
        }],
      }, {
        id: '2',
        label: '一级 2',
        children: [{
          id: '21',
          label: '二级 2-1',
        }, {
          id: '22',
          label: '二级 2-2',
        }],
      }, {
        id: '3',
        label: '一级 3',
        children: [{
          id: '31',
          label: '二级 3-1',
        }, {
          id: '32',
          label: '二级 3-2',
        }],
      }],
    }

    if (req.query.departId == '5') {
      data.ret_content.checked = ['2']
    }

    res.status(200).json(data)
  },
}
