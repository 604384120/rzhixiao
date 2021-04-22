const { config } = require('./common')

const { apiPrefix } = config

module.exports = {
  [`GET ${apiPrefix}/receipt/receiptTemplate/getTemplateText`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      templateWidth: '200',
      fontSize: '',
      imgUrl: 'http://www.zhizhixiao.com/Uploads/dcbb4dbd11290f0/577/yjMv4-vC6BGAAAAWPwAVGQ.png',
      receiptTemplateTexts: [
        {
          id: '1',
          name: '年',
          width: '3.87',
          height: '6.25',
          positionX: '19.55',
          positionY: '16.73',
          subjectNo: '6',
          createDate: '2018-01-22 17:37:48',
          status: '1',
          fontSize:'10'
        }, {
          id: '2',
          name: '月',
          width: '3.87',
          height: '6.25',
          positionX: '26.71',
          positionY: '16.73',
          subjectNo: '6',
          createDate: '2018-01-22 17:37:48',
          status: '1',
        }, {
          id: '3',
          name: '日',
          width: '3.87',
          height: '6.25',
          positionX: '31.87',
          positionY: '16.73',
          subjectNo: '6',
          createDate: '2018-01-22 17:37:48',
          status: '1',
        }, {
          id: '4',
          name: '姓名',
          height: '6.25',
          width: '16.13',
          positionX: '17.1',
          positionY: '23.63',
          subjectNo: '6',
          createDate: '2018-01-22 17:37:48',
          status: '1',
        }, {
          id: '5',
          name: '项目1',
          height: '6.25',
          width: '26.45',
          positionX: '13.66',
          positionY: '37.5',
          subjectNo: '6',
          createDate: '2018-01-22 17:37:48',
          status: '1',
        }, {
          id: '6',
          name: '金额1',
          height: '6.25',
          width: '10.32',
          positionX: '40.52',
          positionY: '37.38',
          subjectNo: '6',
          createDate: '2018-01-22 17:37:48',
          status: '1',
        },
      ],
    }

    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/receipt/receiptSetting/getTextValue`] (req, res) {
    const data = {
      ret_code: 1,
      ret_content: [
        {
          type: '2',
          relateType: '1',
          relateId: '3',
          value: '姓名',
          label: 'xxxxx',
        },
        {
          type: '2',
          relateType: '2',
          relateId: '开票日期-年',
          value: '开票日期-年',
          label: 'yyyyy',
        },
      ],
    }

    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/receipt/receiptTemplate/updateTemplateText`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = "222"
    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/receipt/receiptSetting/updateSetting`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`GET ${apiPrefix}/receipt/receiptSetting/getSetting`] (req, res) {
    let data = {
      ret_code: 1,
      ret_content: {
        settingId: '1',
        templateId: '1',
        name: '1',
        offsetUp: '',
        offsetLeft: '',
        beginNo: '1',
        status: '1',
        receiptNo: '638297802',
        printBg:'1',
        fontSize:'16',
        settingText: [{
          id: '1',
          settingId: '1',
          textId: '1',
          type: '1',
          relateType: '1',
          relateId: '项目-03',
          value: '2018',
        }, {
          id: '2',
          settingId: '2',
          textId: '2',
          type: '2',
          relateType: '1',
          relateId: '项目-01',
          value: '05',
        }, {
          id: '3',
          settingId: '2',
          textId: '3',
          type: '2',
          relateType: '1',
          relateId: '金额-01',
          value: '10',
        }, {
          id: '4',
          settingId: '2',
          textId: '4',
          type: '2',
          relateType: '1',
          relateId: '金额-02',
          value: '梁琦asdasdfasfsadfasdfasdfaf',
        }, {
          id: '5',
          settingId: '2',
          textId: '5',
          type: '2',
          relateType: '1',
          relateId: '1',
          value: '学费',
        }, {
          id: '6',
          settingId: '2',
          textId: '6',
          type: '2',
          relateType: '1',
          relateId: '1',
          value: '1000.00',
        },
        ],
      },
    }


    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/receipt/receiptHistory/getReceiptHistoryList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 200 }
    data.ret_content.data = 
   
    [
      {
      id: '1',
      receiptNo: '638297801',
      downUrl: "http://www.baidu.com",
      orderNo:'1',
      createTime: '2018-02-08 00:00:00',
      missionId: '1',
      missionName: '2018年春收',
      status:'1',
      tempalteName:'四川省政府非税收入通用票据',
      templateCode:'201',
      accountName:"张三",
      attrList: [{
        attrId: '1',
        relateId: '1',
        relateName: '清水河校区',
      }, {
        attrId: '2',
        relateId: '2',
        relateName: '计算机学院',
      }, {
        attrId: '3',
        relateId: '3',
        relateName: '计算机专业',
      }, {
        attrId: '5',
      }, {
        attrId: '4',
      },
      ],
      feeBillLists: [
        {
          id: '1',
          subjectName: '学费',
          paidFee: '500',
          subCode:'001',
          totalFee:'2000',
          subjectId:'1',
          receiptNo: '638297801',
        }, {
          id: '2',
          subjectName: '教材费',
          paidFee: '500',
          subCode:'002',
          totalFee:'1000',
          subjectId:'2',
        },
      ],
    },
    {
      id: '2',
      receiptNo: "09888",
      orderNo:'2',
      createTime: '2018-02-08 00:00:00',
      missionId: '1',
      missionName: '2018年春收',
      status:'0',
      tempalteName:'四川省政府非税收入通用票据',
      templateCode:'202',
      accountName:"张三",
      attrList: [{
        attrId: '1',
        relateId: '1',
        relateName: '清水河校区',
      }, {
        attrId: '2',
        relateId: '2',
        relateName: '计算机学院',
      }, {
        attrId: '3',
        relateId: '3',
        relateName: '计算机专业',
      }, {
        attrId: '4',
        relateId: '4',
        relateName: '一班',
      }, {
        attrId: '5',
        relateId: '5',
        relateName: '敖炜',
      },
      ],
      feeBillLists: [
        {
          id: '1',
          subjectName: '学费',
          paidFee: '500',
          subCode:'001',
          totalFee:'2000',
          subjectId:'1',
        },
      ],
    }, {
      id: '3',
      receiptNo: "11123",
      orderNo:'3',
      timeEnd: '2018-02-08 00:00:00',
      missionId: '2',
      missonName: '2017年秋收	',
      status:'1',
      attrList: [{
        attrId: '1',
        relateId: '1',
        relateName: '清水河校区',
      }, {
        attrId: '2',
        relateId: '2',
        relateName: '计算机学院',
      }, {
        attrId: '3',
        relateId: '3',
        relateName: '计算机专业',
      }, {
        attrId: '4',
        relateId: '4',
        relateName: '一班',
      }, {
        attrId: '5',
        relateId: '5',
        relateName: '敖炜',
      },
      ],
      feeBillLists: [
        {
          id: '1',
          subjectName: '学费',
          paidFee: '500',
          subCode:'001',
          totalFee:'2000',
          subjectId:'1',
        },
      ],
    }]
    for(let i=4;i<=20;i++){
      data.ret_content.data.push({
        id: i,
        receiptNo: "11123",
        orderNo:i.toString(),
        timeEnd: '2018-02-08 00:00:00',
        missionId: '2',
        missonName: '2017年秋收	',
        status:'1',
        attrList: [{
          attrId: '1',
          relateId: '1',
          relateName: '清水河校区',
        }, {
          attrId: '2',
          relateId: '2',
          relateName: '计算机学院',
        }, {
          attrId: '3',
          relateId: '3',
          relateName: '计算机专业',
        }, {
          attrId: '4',
          relateId: '4',
          relateName: '一班',
        }, {
          attrId: '5',
          relateId: '5',
          relateName: '敖炜',
        },
        ],
        feeBillLists: [
          {
            id: '1',
            subjectName: '学费',
            paidFee: '500',
            subCode:'001',
            totalFee:'2000',
            subjectId:'1',
          },
        ],
      })
    }
    
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/receipt/receiptHistory/importReceipt`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = ""
    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/receipt/receiptHistory/coverReceipt`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`GET ${apiPrefix}/receipt/receiptHistory/getImportPrs`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      cfNum: '100',
      cgNum: '855',
      wxNum: '55',
      status: '2',
    }
    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/receipt/receiptHistory/addReceiptHistory`] (req, res) {
    var start = (new Date()).getTime();
    while ((new Date()).getTime() - start < 5000) {
      continue;
    }
    res.status(200).json({ ret_code: 1, ret_content: {receiptNo:'20010202838',downUrl:'http://www.baidu.com'} })
  },

  [`POST ${apiPrefix}/receipt/receiptHistory/deleteReceiptHistory`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: '' })
  },

  [`GET ${apiPrefix}/receipt/receiptTemplate/getTemplateList`] (req, res) {
    let data = {}

    data.ret_code = 1

    data.ret_content = [{
      id: '1',
      name: '四川省政府非税收入通用票据',
      createDate: '2018-01-17 17:30:38',
      status: '1',
      imgUrl: 'C:\Users\Administrator\Desktop\loadfile\f6343eebcb0c4f41ba6f194c0e90edfc.png',
      width: '155',
      digits: '1',
      numCopies: '1',
      numRelates: '1',
      code: '100',
      typeCode:null,
      typeName:null,
    },
    {
      id: '2',
      name: '四川省中小学、大中专院校专用票据',
      createDate: '2018-01-17 17:30:38',
      status: '0',
      imgUrl: 'C:\Users\Administrator\Desktop\loadfile\f6343eebcb0c4f41ba6f194c0e90edfc.png',
      width: '155',
      digits: '1',
      numCopies: '1',
      numRelates: '1',
      code: '101',
      typeCode:'1',
      typeName:'电子发票',
      info:"{\"代开标志\":\"自开\",\"销货方识别号\":28176786897,\"销货方名称\":\"四川大学锦城学院\",\"销货方地址\":\"四川省成都市武侯区科华南路19号\",\"销货方电话\":27689866176867,\"销货方银行账号\":27689866176867,\"复核人\":\"张勤\",\"税率\":0.17}"
    },
    {
      id: '3',
      name: '巅峰赛',
      createDate: '2018-01-17 17:30:38',
      status: '0',
      imgUrl: 'C:\Users\Administrator\Desktop\loadfile\f6343eebcb0c4f41ba6f194c0e90edfc.png',
      width: '155',
      digits: '1',
      numCopies: '1',
      numRelates: '1',
      code: '101',
      typeCode:'1',
      typeName:'电子发票',
      info:null
    }]
    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/receipt/receiptTemplate/addTemplateList1`] (req, res) {
    const data = {
      ret_code: '1',
      ret_content: '成功修改',
    }

    res.status(200).json(data)
  },

   [`POST ${apiPrefix}/receipt/receiptTemplate/updateTemplateList`] (req, res) {
    const data = {
      ret_code: '1',
      ret_content: '成功修改',
    }

    res.status(200).json(data)
  },
}
