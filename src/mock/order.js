const { config } = require('./common')

const { apiPrefix } = config

module.exports = {
  [`GET ${apiPrefix}/order/order/importOrder`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = ""
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/order/order/importFee`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = ""
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/order/orderReturn/importReturn`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = ""
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/order/order/importLoan`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = ""
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/order/order/importSubsidy`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = ""
    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/order/order/coverOrder`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/order/orderReturn/coverReturn`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/order/order/coverLoan`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/order/order/coverSubsidy`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`GET ${apiPrefix}/order/order/getImportPrs`] (req, res) {
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

  [`GET ${apiPrefix}/order/orderReturn/getImportPrs`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      cfNum: '10',
      cgNum: '855',
      wxNum: '55',
      status: '2',
    }
    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/order/orderReturn/completeOrderReturn`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/order/orderReturn/orderReturnReview`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/order/orderReturn/updateReturnOrderReconciliation`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/order/order/refundOrder`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/order/order/cancelOrder`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/order/order/convertOrder`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/order/orderReturn/cancelOrderReturn`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/order/order/cancelLoan`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/order/order/cancelSubsidy`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/order/order/orderReview`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/order/order/updateOrderReconciliation`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/order/orderPayType/updateOrderPayType`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`GET ${apiPrefix}/order/order/getOrderFeeSum`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
        feeSum:'192',
        count:'87',
        rateCount:'78',
        rateSum:'345',
      }
    res.status(200).json(data)
  },
  
  [`GET ${apiPrefix}/order/orderReturn/getOrderReturnFeeSum`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
        feeSum:'192',
        count:'87'
      }
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/order/order/getOrderList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 20 }
    data.ret_content.data = [
      {
      id: '1',
      orderNo: '1516363147990615',
      fee: '1000',
      payType: '2',
      receiptPrintId: '1',
      receiptNo: '638297801',
      timeEnd: '2018-02-08 00:00:00',
      missionId: '1',
      missionName: '2018年春收',
      status:'6',
      remark:'手贱',
      cancelAccountId:'2',
      templateCode:"2222",
      cancelAccountName:'yyy',
      printType:'bs',
      accountId: "146",
      accountName: "知校测试大学",
      rateFee:'12',
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
          downUrl:'http://www.baidu.com'
        }, {
          id: '2',
          subjectName: '教材费',
          paidFee: '500',
          subCode:'002',
          totalFee:'1000',
          subjectId:'2',
        },
      ],
      "orderOperateList": [{
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": null,
        "createDate": "2019-09-26 15:36:46",
        "mask": "2"
      }, {
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": "cscsc",
        "createDate": "2019-09-29 18:06:05",
        "mask": "1"
      }],
    },
    {
      id: '2',
      orderNo: '1516363147990617',
      fee: '9000',
      payType: '1',
      receiptPrintId: null,
      receiptNo: null,
      timeEnd: '2018-02-08 00:00:00',
      missionId: '1',
      missionName: '2018年春收',
      status:'5',
      accountId:'2',
      accountName:'xxx',
      templateCode:"2222",
      printType:'',
      accountId: "146",
      accountName: "知校测试大学",
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
          receiptNo: '638297802',
        },
      ],
      "orderOperateList": [{
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": 'sdfsdf',
        "createDate": "2019-09-26 15:36:46",
        "mask": "4"
      }, {
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": "cscsc",
        "createDate": "2019-09-29 18:06:05",
        "mask": "1"
      }],
    }, {
      id: '3',
      orderNo: '1516363147990616',
      fee: '9000',
      payType: '1',
      receiptPrintId: null,
      receiptNo: null,
      timeEnd: '2019-12-09 00:00:45',
      missionId: '2',
      missonName: '2017年秋收	',
      status:'2',
      accountId:'2',
      accountName:'werv',
      templateCode:'xxx',
      printType:'',
      accountId: "146",
      accountName: "知校测试大学",
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
          paidFee: '900',
          subCode:'001',
          totalFee:'1000',
          subjectId:'1',
        },
      ],
      "orderOperateList": [{
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": null,
        "createDate": "2019-09-26 15:36:46",
        "mask": "2"
      }, {
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": "对账理由",
        "createDate": "2019-09-29 18:06:05",
        "mask": "1"
      }],
    }, {
      id: '31',
      orderNo: '15163631479906161',
      fee: '9000',
      payType: '5',
      receiptPrintId: null,
      receiptNo: null,
      timeEnd: '2018-02-08 00:00:00',
      missionId: '2',
      missonName: '2017年秋收	',
      status:'2',
      accountId:'2',
      accountName:'xxx',
      templateCode:'xxx',
      printType:'Xnhkxy',
      accountId: "146",
      accountName: null,
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
          paidFee: '900',
          subCode:'001',
          totalFee:'1000',
          subjectId:'1',
        },
      ],
      "orderOperateList": [{
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": null,
        "createDate": "2019-09-26 15:36:46",
        "mask": "2"
      }, {
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": "cscsc",
        "createDate": "2019-09-29 18:06:05",
        "mask": "1"
      }],
    },{
      id: '4',
      orderNo: '8765434567',
      fee: '934000',
      payType: '1',
      receiptPrintId: null,
      receiptNo: null,
      timeEnd: '2018-02-08 00:00:00',
      missionId: '2',
      missonName: '2017年秋收	',
      status:'4',
      accountId:'2',
      accountName:'xxx',
      templateCode:'xxx',
      printType:'xxx',
      accountId: "146",
      accountName: "知校测试大学",
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
          paidFee: '900',
          subCode:'001',
          totalFee:'1000',
          subjectId:'1',
          receiptNo: '638297802',
        },
      ],
      "orderOperateList": [{
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": null,
        "createDate": "2019-09-26 15:36:46",
        "mask": "2"
      }, {
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": "cscsc",
        "createDate": "2019-09-29 18:06:05",
        "mask": "1"
      }],
    }]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/order/order/getOrderRateList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 20 }
    data.ret_content.data = [
      {
      id: '1',
      orderNo: '1516363147990615',
      fee: '1000',
      payType: '2',
      receiptPrintId: '1',
      receiptNo: '638297801',
      timeEnd: '2018-02-08 00:00:00',
      missionId: '1',
      missionName: '2018年春收',
      status:'6',
      remark:'手贱',
      cancelAccountId:'2',
      templateCode:"2222",
      cancelAccountName:'yyy',
      printType:'bs',
      accountId: "146",
      accountName: "知校测试大学",
      rateFee:'12',
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
          downUrl:'http://www.baidu.com'
        }, {
          id: '2',
          subjectName: '教材费',
          paidFee: '500',
          subCode:'002',
          totalFee:'1000',
          subjectId:'2',
        },
      ],
      "orderOperateList": [{
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": null,
        "createDate": "2019-09-26 15:36:46",
        "mask": "2"
      }, {
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": "cscsc",
        "createDate": "2019-09-29 18:06:05",
        "mask": "1"
      }],
    },
    {
      id: '2',
      orderNo: '1516363147990617',
      fee: '9000',
      payType: '1',
      receiptPrintId: null,
      receiptNo: null,
      timeEnd: '2018-02-08 00:00:00',
      missionId: '1',
      missionName: '2018年春收',
      status:'5',
      accountId:'2',
      accountName:'xxx',
      templateCode:"2222",
      printType:'',
      accountId: "146",
      accountName: "知校测试大学",
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
          receiptNo: '638297802',
        },
      ],
      "orderOperateList": [{
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": 'sdfsdf',
        "createDate": "2019-09-26 15:36:46",
        "mask": "4"
      }, {
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": "cscsc",
        "createDate": "2019-09-29 18:06:05",
        "mask": "1"
      }],
    }, {
      id: '3',
      orderNo: '1516363147990616',
      fee: '9000',
      payType: '1',
      receiptPrintId: null,
      receiptNo: null,
      timeEnd: '2019-12-09 00:00:45',
      missionId: '2',
      missonName: '2017年秋收	',
      status:'0',
      accountId:'2',
      accountName:'werv',
      templateCode:'xxx',
      printType:'',
      accountId: "146",
      accountName: "知校测试大学",
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
          paidFee: '900',
          subCode:'001',
          totalFee:'1000',
          subjectId:'1',
        },
      ],
      "orderOperateList": [{
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": null,
        "createDate": "2019-09-26 15:36:46",
        "mask": "2"
      }, {
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": "对账理由",
        "createDate": "2019-09-29 18:06:05",
        "mask": "1"
      }],
    }, {
      id: '31',
      orderNo: '15163631479906161',
      fee: '9000',
      payType: '5',
      receiptPrintId: null,
      receiptNo: null,
      timeEnd: '2018-02-08 00:00:00',
      missionId: '2',
      missonName: '2017年秋收	',
      status:'2',
      accountId:'2',
      accountName:'xxx',
      templateCode:'xxx',
      printType:'',
      accountId: "146",
      accountName: null,
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
          paidFee: '900',
          subCode:'001',
          totalFee:'1000',
          subjectId:'1',
        },
      ],
      "orderOperateList": [{
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": null,
        "createDate": "2019-09-26 15:36:46",
        "mask": "2"
      }, {
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": "cscsc",
        "createDate": "2019-09-29 18:06:05",
        "mask": "1"
      }],
    },{
      id: '4',
      orderNo: '8765434567',
      fee: '934000',
      payType: '1',
      receiptPrintId: null,
      receiptNo: null,
      timeEnd: '2018-02-08 00:00:00',
      missionId: '2',
      missonName: '2017年秋收	',
      status:'4',
      accountId:'2',
      accountName:'xxx',
      templateCode:'xxx',
      printType:'xxx',
      accountId: "146",
      accountName: "知校测试大学",
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
          paidFee: '900',
          subCode:'001',
          totalFee:'1000',
          subjectId:'1',
          receiptNo: '638297802',
        },
      ],
      "orderOperateList": [{
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": null,
        "createDate": "2019-09-26 15:36:46",
        "mask": "2"
      }, {
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": "cscsc",
        "createDate": "2019-09-29 18:06:05",
        "mask": "1"
      }],
    }]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/order/orderReturn/getOrderReturnList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 20 }
    data.ret_content.data = [{
      id: '1',
      orderNo: '1516363147990615',
      fee: '1000',
      payType: '2',
      receiptPrintId: '1',
      receiptNo: '638297801',
      timeEnd: '2018-02-08 00:00:00',
      accountId:'2',
      accountName:'xxx',
      status:'0',
      reviewAccountName:'钟馗',
      reviewDate:'1314-1-14',
      remark:'六神装',
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
        }, {
          id: '2',
          subjectName: '教材费',
          paidFee: '500',
          subCode:'002',
          totalFee:'1000',
          subjectId:'2',
        },
      ],
      "orderOperateList": [{
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": null,
        "createDate": "2019-09-26 15:36:46",
        "mask": "4"
      }, {
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": "cscsc",
        "createDate": "2019-09-29 18:06:05",
        "mask": "2"
      }],
    },
    {
      id: '2',
      orderNo: '151636314799061611111111111111111111111111111111111111111111',
      fee: '9000',
      payType: '1',
      receiptPrintId: null,
      receiptNo: null,
      timeEnd: '2018-02-08 00:00:00',
      accountId:'2',
      accountName:'xxx',
      status:'5',
      reviewAccountName:'姜子牙',
      reviewDate:'1314-1-14',
      remark:'超神了',
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
        },
      ],
      "orderOperateList": [{
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": 'sdfsdfsdf',
        "createDate": "2019-09-26 15:36:46",
        "mask": "1"
      }, {
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": "cscsc",
        "createDate": "2019-09-29 18:06:05",
        "mask": "4"
      }]
    }, {
      id: '3',
      orderNo: '15163631479906161111198765432345678909876543234789',
      fee: '9000',
      payType: '1',
      receiptPrintId: null,
      receiptNo: null,
      timeEnd: '2018-02-08 00:00:00',
      cancelAccountId:'2',
      cancelAccountName:'yyy',
      status:'4',
      reviewAccountName:'老夫子',
      reviewDate:'1314-1-14',
      remark:'偷水晶了',
      accountId:'2',
      accountName:'xxx',
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
        },
      ],
    },{
      id: '4',
      orderNo: '151636314799061611118765432345678765434565323456789',
      fee: '9000',
      payType: '1',
      receiptPrintId: null,
      receiptNo: null,
      timeEnd: '2018-02-08 00:00:00',
      cancelAccountId:'2',
      cancelAccountName:'yyy',
      status:'2',
      reviewAccountName:'狄仁杰',
      reviewDate:'5209-1-14',
      remark:'输出爆炸',
      accountId:'2',
      accountName:'xxx',
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
        },
      ],
    },{
      id: '5',
      orderNo: '151636314245466',
      fee: '1000',
      payType: '2',
      receiptPrintId: '1',
      receiptNo: '638297801',
      timeEnd: '2018-02-08 00:00:00',
      accountId:'2',
      accountName:'xxx',
      status:'6',
      reviewAccountName:'钟馗',
      reviewDate:'1314-1-14',
      remark:'六神装',
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
        }, {
          id: '2',
          subjectName: '教材费',
          paidFee: '500',
          subCode:'002',
          totalFee:'1000',
          subjectId:'2',
        },
      ],
      "orderOperateList": [{
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark":'sdfsdfl',
        "createDate": "2019-09-26 15:36:46",
        "mask": "2"
      }, {
        "accountId": "146",
        "accountName": "知校测试大学",
        "remark": "cscsc",
        "createDate": "2019-09-29 18:06:05",
        "mask": "1"
      }],
    }]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/order/orderReturn/getReturnOrderReconciliation`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      "payTypeStatistics": {
        "date": null,
        "paidFee": "2445400",
        "refund": "600",
        "paidFeeCount": "6",
        "refundCount": "4",
        "realFee": "5644600",
        "typeStatistics": [{
          "payType": "1",
          "paidFee": "0",
          "refund": "0",
          "paidFeeCount": "0",
          "refundCount": "0",
          "realFee": "0",
          "name": null,
          "subjectStatistics": null
        }, {
          "payType": "2",
          "paidFee": "13400",
          "refund": "0",
          "paidFeeCount": "2",
          "refundCount": "0",
          "realFee": "13400",
          "name": null,
          "subjectStatistics": null
        }, {
          "payType": "3",
          "paidFee": "1332000",
          "refund": "800",
          "paidFeeCount": "3",
          "refundCount": "4",
          "realFee": "1331200",
          "name": null,
          "subjectStatistics": null
        }, {
          "payType": "4",
          "paidFee": "100000",
          "refund": "0",
          "paidFeeCount": "1",
          "refundCount": "0",
          "realFee": "100000",
          "name": null,
          "subjectStatistics": null
        }]
      },
      "orderListEntity": {
        "count": "50",
        "data": [{
          "missionId": "1557",
          "missionName": "水dian费",
          "subjectId": null,
          "orderNo": "2019092414425814864065",
          "fee": "2896201",
          "returnFee": null,
          "payType": "3",
          "timeEnd": "2019-09-24 14:42:54",
          "receiptNo": null,
          "downUrl": null,
          "receiptPrintId": null,
          "userId": "14082",
          "templateCode": "4",
          "status": "2",
          "templateName": null,
          "accountName": "知校测试大学",
          "cancelAccountName": "知校测试大学",
          "reviewAccountName": "知校测试大学",
          "reviewDate": "2019-09-24 15:15:23",
          "createDate": null,
          "loanType": null,
          "subsidyType": null,
          "remark": "xxx",
          "printType": null,
          "orderRemark": null,
          "attrList": [{
            "relateName": "20125769",
            "attrId": "966",
            "relateId": "null"
          }, {
            "relateName": "陈羽甜sdf",
            "attrId": "968",
            "relateId": "null"
          }, {
            "relateName": "阳光小学asdlkfj",
            "attrId": "1285",
            "relateId": "null"
          }, {
            "relateName": "在读sdf",
            "attrId": "994",
            "relateId": "4053"
          }, {
            "relateName": "西校区sdf",
            "attrId": "979",
            "relateId": "1078"
          }, {
            "relateName": "2018级sdf",
            "attrId": "983",
            "relateId": "3993"
          }, {
            "relateName": "测试11sdf",
            "attrId": "1287",
            "relateId": "5845"
          }, {
            "relateName": "班级1sdf",
            "attrId": "984",
            "relateId": "1118"
          }, {
            "relateName": "财经学院",
            "attrId": "980",
            "relateId": "1107"
          }, {
            "relateName": "财务管理",
            "attrId": "981",
            "relateId": "1082"
          }, {
            "relateName": "汉族sdf",
            "attrId": "972",
            "relateId": "5841"
          }, {
            "relateName": "本科sdf",
            "attrId": "993",
            "relateId": "4050"
          }, {
            "relateName": "男",
            "attrId": "969",
            "relateId": "3873"
          }],
          "feeBillLists": [{
            "id": "273733",
            "subjectName": "水费sdf",
            "missionName": null,
            "subType": "2",
            "paidFee": "22200",
            "subCode": "8",
            "totalFee": "22200",
            "isRequired": null,
            "isDefault": null,
            "allowModify": null,
            "userId": "14082",
            "orderNo": "2019092414425814864065",
            "subjectId": "1215",
            "receiptNo": null,
            "receiptPrintId": null,
            "downUrl": null
          }, {
            "id": "300041",
            "subjectName": "水费sd",
            "missionName": null,
            "subType": "2",
            "paidFee": "1232100",
            "subCode": "8",
            "totalFee": "1232100",
            "isRequired": null,
            "isDefault": null,
            "allowModify": null,
            "userId": "14082",
            "orderNo": "2019092414425814864065",
            "subjectId": "1215",
            "receiptNo": null,
            "receiptPrintId": null,
            "downUrl": null
          }],
        },]
      },
    }
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/order/order/getLoanList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 20 }
    data.ret_content.data = [
      {
      id: '1',
      orderNo: '1516363147990615',
      timeEnd: '2018-02-08 00:00:00',
      missionId: '1',
      missionName: '2018年春收',
      status:'0',
      remark:'手贱',
      loanType:"1",
      status:'0',
      accountId:'1',
      accountName:'xxx',
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
      orderNo: '1516363147990614',
      timeEnd: '2018-02-08 00:00:00',
      missionId: '2',
      missionName: '2017年春收',
      status:'0',
      remark:'手贱',
      loanType:"22",
      status:'5',
      cancelAccountId:'1',
      cancelAccountName:'yyy',
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
      orderNo: '1516363147990613',
      timeEnd: '2018-02-08 00:00:00',
      missionId: '1',
      missionName: '2018年春收',
      status:'0',
      remark:'手贱',
      loanType:"12",
      status:'4',
      accountId:'1',
      accountName:'xxx',
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
    },{
      id: '4',
      orderNo: '1516147990613',
      timeEnd: '2018-02-08 00:00:00',
      missionId: '1',
      missionName: '2018年春收',
      status:'0',
      remark:'手贱',
      loanType:"12",
      status:'2',
      accountId:'1',
      accountName:'xxx',
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
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/order/order/getLoanType`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = [{
      id: '12',
      name: '微信',
    },
    {
      id: '22',
      name: '支付宝',
    },{
      id: '32',
      name: '现金',
    },{
      id: '42',
      name: 'pos机',
    },{
      id: '52',
      name: '贷款',
    },]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/order/order/getSubsidyList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 20 }
    data.ret_content.data = [
      {
      id: '1',
      orderNo: '1516363147990615',
      timeEnd: '2018-02-08 00:00:00',
      missionId: '1',
      missionName: '2018年春收',
      status:'0',
      remark:'手贱',
      subsidyType:"1",
      status:'0',
      accountId:'1',
      accountName:'xxx',
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
      orderNo: '1516363147990614',
      timeEnd: '2018-02-08 00:00:00',
      missionId: '2',
      missionName: '2017年春收',
      status:'0',
      remark:'手贱',
      subsidyType:"22",
      status:'5',
      cancelAccountId:'1',
      cancelAccountName:'yyy',
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
      },{
        attrId: '6',
        relateId: '6',
        relateName: '123456789',
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
      orderNo: '1516363147990613',
      timeEnd: '2018-02-08 00:00:00',
      missionId: '1',
      missionName: '2018年春收',
      status:'0',
      remark:'手贱',
      subsidyType:"12",
      status:'4',
      accountId:'1',
      accountName:'xxx',
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
    },{
      id: '4',
      orderNo: '1516363147990613',
      timeEnd: '2018-02-08 00:00:00',
      missionId: '1',
      missionName: '2018年春收',
      status:'0',
      remark:'手贱',
      subsidyType:"12",
      status:'2',
      accountId:'1',
      accountName:'xxx',
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
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/order/order/getSubsidyType`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = ['国家奖学金','国家助学金']
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/order/order/getOrderReconciliation`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      "payTypeStatistics": {
        "date": null,
        "paidFee": "1445400",
        "refund": "800",
        "paidFeeCount": "6",
        "refundCount": "4",
        "realFee": "1444600",
        "typeStatistics": [{
          "payType": "1",
          "paidFee": "0",
          "refund": "0",
          "paidFeeCount": "0",
          "refundCount": "0",
          "realFee": "0",
          "name": null,
          "subjectStatistics": null
        }, {
          "payType": "2",
          "paidFee": "13400",
          "refund": "0",
          "paidFeeCount": "2",
          "refundCount": "0",
          "realFee": "13400",
          "name": null,
          "subjectStatistics": null
        }, {
          "payType": "3",
          "paidFee": "1332000",
          "refund": "800",
          "paidFeeCount": "3",
          "refundCount": "4",
          "realFee": "1331200",
          "name": null,
          "subjectStatistics": null
        }, {
          "payType": "4",
          "paidFee": "100000",
          "refund": "0",
          "paidFeeCount": "1",
          "refundCount": "0",
          "realFee": "100000",
          "name": null,
          "subjectStatistics": null
        }]
      },
      "orderListEntity": {
        "count": "50",
        "data": [{
          "missionId": "1557",
          "missionName": "水费",
          "subjectId": null,
          "orderNo": "2019092414425814864065",
          "fee": "2896201",
          "returnFee": null,
          "payType": "3",
          "timeEnd": "2019-09-24 14:42:54",
          "receiptNo": null,
          "downUrl": null,
          "receiptPrintId": null,
          "userId": "14082",
          "templateCode": "4",
          "status": "2",
          "templateName": null,
          "accountName": "知校测试大学",
          "cancelAccountName": "知校测试大学",
          "reviewAccountName": "知校测试大学",
          "reviewDate": "2019-09-24 15:15:23",
          "createDate": null,
          "loanType": null,
          "subsidyType": null,
          "remark": "xxx",
          "printType": null,
          "orderRemark": null,
          "attrList": [{
            "relateName": "计算机学院",
            "attrId": "2",
            "relateId": "2"
          }, {
            "relateName": "陈羽甜",
            "attrId": "968",
            "relateId": "null"
          }, {
            "relateName": "阳光小学",
            "attrId": "1285",
            "relateId": "null"
          }, {
            "relateName": "在读",
            "attrId": "994",
            "relateId": "4053"
          }, {
            "relateName": "西校区",
            "attrId": "979",
            "relateId": "1078"
          }, {
            "relateName": "2018级",
            "attrId": "983",
            "relateId": "3993"
          }, {
            "relateName": "测试11",
            "attrId": "1287",
            "relateId": "5845"
          }, {
            "relateName": "班级1",
            "attrId": "984",
            "relateId": "1118"
          }, {
            "relateName": "财经学院",
            "attrId": "980",
            "relateId": "1107"
          }, {
            "relateName": "财务管理",
            "attrId": "981",
            "relateId": "1082"
          }, {
            "relateName": "汉族",
            "attrId": "972",
            "relateId": "5841"
          }, {
            "relateName": "本科",
            "attrId": "993",
            "relateId": "4050"
          }, {
            "relateName": "男",
            "attrId": "969",
            "relateId": "3873"
          }],
          "feeBillLists": [{
            "id": "273733",
            "subjectName": "水费",
            "missionName": null,
            "subType": "2",
            "paidFee": "22200",
            "subCode": "8",
            "totalFee": "22200",
            "isRequired": null,
            "isDefault": null,
            "allowModify": null,
            "userId": "14082",
            "orderNo": "2019092414425814864065",
            "subjectId": "1215",
            "receiptNo": null,
            "receiptPrintId": null,
            "downUrl": null
          }, {
            "id": "300041",
            "subjectName": "水费",
            "missionName": null,
            "subType": "2",
            "paidFee": "1232100",
            "subCode": "8",
            "totalFee": "1232100",
            "isRequired": null,
            "isDefault": null,
            "allowModify": null,
            "userId": "14082",
            "orderNo": "2019092414425814864065",
            "subjectId": "1215",
            "receiptNo": null,
            "receiptPrintId": null,
            "downUrl": null
          }],
        },]
      },
    }
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/order/orderPayType/getOrderPayType`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = [{
      id: '12',
      payType: '1',
      name: '微信',
      code:'wx',
      rate: '15',
      status: '2',
    },
    {
      id: '22',
      payType: '2',
      name: '支付宝',
      code:'al',
      rate: null,
      status: '2',
    },{
      id: '32',
      payType: '3',
      name: '现金',
      rate: null,
      status: '2',
    },{
      id: '42',
      payType: '4',
      name: 'pos机',
      rate: '20',
      status: '1',
    },{
      id: '52',
      payType: '5',
      name: '贷款',
      rate: '13',
      status: '',
    },]
    res.status(200).json(data)
  },
}
