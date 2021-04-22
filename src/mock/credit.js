const { config } = require('./common')

const { apiPrefix } = config

module.exports = {
  [`GET ${apiPrefix}/credit/creditClass/getCreditClassList`] (req, res) {
    const data = {
      ret_code: 1,
      ret_content: [
        {
          id: "1",
		      code: "0001",
          name: "数学",
          type: "1",
          property: "1",
          credit: "5",
          createDate: null,
          token: "12",
          status: "1"
        },
        {
          id: "2",
		      code: "0002",
          name: "语文",
          type: "1",
          property: null,
          credit: "5",
          createDate: null,
          token: "12",
          status: "1"
        },
      ],
    }

    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/credit/creditRule/getCreditRuleList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 20 }
    data.ret_content.data = [{
      id: '111',
      name: '计算机专业',
      structId: 'c',
      pid: 'b',
      fee: null,
      editable: '1',
      structItemEntities: [{
        id: '11',
        name: '计算机学院',
        structId: 'b',
        pid: 'a',
      }, {
        id: '1',
        name: '清水河校区',
        structId: 'a',
        pid: null,
      },
      ],
      structItemAttrRelateEntities: [
        {
          id: 2,
          itemId: 1,
          attrId: 1,
          relateId: 1,
          relateName: '标签1',
        },
        {
          id: 3,
          itemId: 1,
          attrId: 2,
          relateId: 4,
          relateName: '标签4',
        },
      ],
      subjectList: [
        {
            id: '1',
            name: '学分学费',
            fee: null,
            editable: '1',
        },{
          id: '2',
          name: '军训费',
          fee: '1',
          editable: '1',
        }
      ]
    },
    {
      id: '112',
      name: '软件专业',
      structId: 'c',
      pid: 'b',
      fee: '444444',
      editable: '0',
      structItemEntities: [{
        id: '11',
        name: '计算机学院',
        structId: 'b',
        pid: 'a',
      }, {
        id: '1',
        name: '清水河校区',
        structId: 'a',
        pid: null,
      },
      ],
    }]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/credit/creditBatch/getCreditBatchList`] (req, res) {
    const data = {
      ret_code: 1,
      ret_content: [
        {
          id: '1',
          name: '2018-2019第一学期',
          year: '2018',
          createDate: '2018-10-20 00:00:00',
        },
        {
          id: '2',
          name: '2018-2019第二学期',
          year: '2019',
          createDate: "2019-2-10 00:00:00",
        },
      ],
    }

    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/credit/creditBatch/getCreditBatchDetail`] (req, res) {
    const data = {
      ret_code: 1,
      ret_content: {
        count: "3",
        data: [{
          userId: "1149",
          id: '1',
          className: "高数",
          batchId: null,
          year: null,
          userId: "1149",
          classId: null,
          ruleId: null,
          fee: null,
          status: null,
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
            relateName: '梁琦',
          },
          ],
        },{
          userId: "1149",
          id: '2',
          className: "高数",
          batchId: null,
          year: null,
          userId: "1149",
          classId: null,
          ruleId: null,
          fee: null,
          status: null,
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
            relateName: '梁琦',
          },
          ],
        }]
      },
    }

    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/credit/creditBatch/deleteCreditBatchDetail`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: "删除失败" })
  },

  [`GET ${apiPrefix}/credit/creditBatch/getCreditStatistics`] (req, res) {
    const data = {
      ret_code: 1,
      ret_content: {
        count: "3",
        data: [{
          userId: "1149",
          id: '1',
          className: "高数",
          batchId: null,
          year: null,
          userId: "1149",
          classId: null,
          ruleId: null,
          credit: 10,
          fee: 10000,
          status: null,
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
            relateName: '梁琦',
          },
          ],
        },{
          userId: "1150",
          id: '2',
          className: "高数",
          batchId: null,
          year: null,
          userId: "1149",
          classId: null,
          ruleId: null,
          credit: 10,
          fee: 10000,
          status: null,
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
            relateName: '梁琦',
          },
          ],
        }]
      },
    }

    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/credit/creditBatch/getCreditOperateList`] (req, res) {
    const data = {
      ret_code: 1,
      ret_content: {
        count: "3",
        data: [{
          userId: "1149",
          id: '1',
          className: "高数",
          batchId: null,
          year: null,
          userId: "1149",
          classId: null,
          ruleId: null,
          accountName:'得到的',
          createDate:'2018-09-20 12:09:00',
          srcCredit: 19,
          dstCredit: 29,
          status: null,
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
            relateName: '梁琦',
          },
          ],
        },{
          userId: "1149",
          id: '2',
          className: "高数",
          batchId: null,
          year: null,
          userId: "1149",
          classId: null,
          ruleId: null,
          accountName:'来昂起',
          createDate:'2018-09-20 12:09:00',
          srcCredit: 19,
          dstCredit: 29,
          status: null,
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
            relateName: '梁琦',
          },
          ],
        }]
      },
    }

    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/credit/creditBatch/getUserClassDetail`] (req, res) {
    const data = {
      ret_code: 1,
      ret_content: {
        count: "2",
        data: [{"id": "123",
				"code": "001",
				"name": "高数",
				"type": "1",
				"property": "1",
				"credit": "10",
				"fee":"20000"},{"id": "123",
				"code": "001",
				"name": "高数",
				"type": "1",
				"property": "1",
				"credit": "10",
				"fee":"20000"},{"id": "123",
				"code": "001",
				"name": "高数",
				"type": "1",
				"property": "1",
				"credit": "10",
				"fee":"20000"}]
      }
    }

    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/credit/creditBatch/importCreditBatch`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = ""
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/credit/creditClass/importCreditClass`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = ""
    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/credit/creditBatch/coverCreditBatch`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/credit/creditClass/coverCreditClass`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`GET ${apiPrefix}/credit/creditBatch/getImportPrs`] (req, res) {
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

  [`GET ${apiPrefix}/credit/creditClass/getImportPrs`] (req, res) {
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

  [`POST ${apiPrefix}/credit/creditClass/addCreditClass`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/credit/creditClass/updateCreditClass`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/credit/creditClass/deleteCreditClass`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/credit/creditBatch/addCreditBatch`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/credit/creditBatch/updateCreditBatch`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/credit/creditBatch/deleteCreditBatch`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/credit/creditRule/updateCreditRule`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },
}
