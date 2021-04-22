const { config } = require('./common')

const { apiPrefix } = config

module.exports = {
  [`POST ${apiPrefix}/struct/structGroup/addGroup`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/struct/structGroup/updateGroup`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/struct/structGroup/deleteGroup`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/struct/structLabel/addLabel`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/struct/structLabel/updateLabel`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/struct/structLabel/deleteLabel`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/struct/structItem/addItem`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: Math.random()*100 })
  },

  [`POST ${apiPrefix}/struct/structItem/updateItem`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/struct/structItem/deleteItemList`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`GET ${apiPrefix}/struct/structGroup/getGroup`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = [
      {
        id: '2',
        name: '计算机学院',
        structId: '1',
        labelList: [
          {
            labelId: '1',
            labelName: '标签1',
            count: '2',
          },
          {
            labelId: '2',
            labelName: '标签2',
            count: '0',
          },
          {
            labelId: '3',
            labelName: '标签3',
            count: '0',
          },
        ],
      },
      {
        id: '4',
        name: '商学院',
        structId: '1',
        labelList: [{
          labelId: '4',
          labelName: '标签4',
          count: '2',
        },
        {
          labelId: '5',
          labelName: '标签5',
          count: '0',
        },
        {
          labelId: '6',
          labelName: '标签6',
          count: '0',
        }, {
          labelId: '7',
          labelName: '标签7',
          count: '2',
        },
        {
          labelId: '8',
          labelName: '标签8',
          count: '0',
        },
        {
          labelId: '9',
          labelName: '标签9',
          count: '0',
        }],
      }, {
        id: '3',
        name: '飞行器',
        structId: '1',
        labelList: [
          {
            labelId: '10',
            labelName: '标签10',
            count: '2',
          },
          {
            labelId: '11',
            labelName: '标签11',
            count: '0',
          },
          {
            labelId: '12',
            labelName: '标签12',
            count: '0',
          },
        ],
      },
    ]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/struct/struct/getStructAttr`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = [
      {
        id: '11',
        attrId: '1',
        attrName: '类别1',
        userAttrValueEntities: [
          {
            id: '1',
            value: '标签1',
            code: '2',
          },
          {
            id: '2',
            value: '标签2',
            code: '0',
          },
          {
            id: '3',
            value: '标签3',
            code: '0',
          },
        ],
      },
      {
        id: '22',
        attrId: '2',
        attrName: '类别2',
        userAttrValueEntities: [{
          id: '4',
          value: '标签4',
          code: '2',
        },
        {
          id: '5',
          value: '标签5',
          code: '0',
        },
        {
          id: '6',
          value: '标签6',
          code: '0',
        }, {
          id: '7',
          value: '标签7',
          code: '2',
        },
        {
          id: '8',
          value: '标签8',
          code: '0',
        },
        {
          id: '9',
          value: '标签9',
          code: '0',
        }],
      }, {
        id: '33',
        attrId: '3',
        attrName: '类别3',
        userAttrValueEntities: [
          {
            id: '10',
            value: '2018年春收',
            code: '2',
          },
          {
            id: '11',
            value: '标签11',
            code: '0',
          },
          {
            id: '12',
            value: '标签12',
            code: '0',
          },
        ],
      },
    ]
    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/struct/struct/addStructAttr`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/struct/struct/deleteStructAttr`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`GET ${apiPrefix}/struct/structItem/getAllItemList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = [{
      id: '1',
      name: '测试1',
      pid: 0,
      structId: 'a',
    }, {
      id: '2',
      name: '测试2',
      pid: 0,
      structId: 'a',
    }, {
      id: '3',
      name: '测试3',
      pid: 0,
      structId: 'c',
    }, {
      id: '4',
      name: '测试4',
      pid: 0,
      structId: 'c',
    }]

    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/struct/structItem/getItemList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = { count: 22 }
    data.ret_content.data = [
      {
        id: 'd2',
        token: '111',
        name: '测试数据条件',
        structId: 'd',
        pid: '0',
        status: '1',
        structItemAttrRelateEntities: [
          {
            id: 2,
            itemId: 1,
            attrId: '10',
            relateId: '2',
            relateName: 'name2',
          },
          // {
          //   id: 3,
          //   itemId: 1,
          //   attrId: 2,
          //   relateId: 4,
          //   relateName: '标签4',
          // },

        ],
        pidItems: [
          {
            id: 'a1',
            name: '清水河校区',
            structId: 'a',
            pid: '1',
            structName: '校区',
          }, {
            id: 'c1',
            name: '计算机专业',
            structId: 'c',
            pid: '2',
            structName: '专业',
          }, {
            id: 'd1',
            name: '一班',
            structId: 'd',
            pid: '3',
            structName: '班级',
          },

        ],
      }, {
        id: 'd12',
        token: '112',
        name: '修改测试1',
        structId: '2',
        pid: '0',
        status: '1',
        structItemAttrRelateEntities: [


        ],
        pidItems: [
          {
            id: 'a1',
            name: '清水河校区',
            structId: 'a',
            pid: '0',
            structName: '校区',
          }, {
            id: 'c1',
            name: '计算机专业',
            structId: 'c',
            pid: '0',
            structName: '专业',
          }, {
            id: 'd1',
            name: '一班',
            structId: 'd',
            pid: '0',
            structName: '班级',
          },

        ],
      }, {
        id: 'd22',
        token: '113',
        name: '修改测试2',
        structId: '2',
        pid: '0',
        status: '1',
        structLabelRelates: [


        ],
        pidItems: [
          {
            id: 'a1',
            name: '清水河校区',
            structId: 'a',
            pid: '0',
            structName: '校区',
          }, {
            id: 'c1',
            name: '计算机专业',
            structId: 'c',
            pid: '0',
            structName: '专业',
          }, {
            id: 'd1',
            name: '一班',
            structId: 'd',
            pid: '0',
            structName: '班级',
          },

        ],
      }, {
        id: 'd122',
        token: '114',
        name: '修改测试3',
        structId: '2',
        pid: '0',
        status: '1',
        structLabelRelates: [


        ],
        pidItems: [
          {
            id: 'a1',
            name: '清水河校区',
            structId: 'a',
            pid: '0',
            structName: '校区',
          }, {
            id: 'c1',
            name: '计算机专业',
            structId: 'c',
            pid: '0',
            structName: '专业',
          }, {
            id: 'd1',
            name: '一班',
            structId: 'd',
            pid: '0',
            structName: '班级',
          },

        ],
      }, {
        id: 'd2222',
        token: '115',
        name: '修改测试12',
        structId: '2',
        pid: '0',
        status: '1',
        structLabelRelates: [


        ],
        pidItems: [
          {
            id: 'a1',
            name: '清水河校区',
            structId: 'a',
            pid: '0',
            structName: '校区',
          }, {
            id: 'c1',
            name: '计算机专业',
            structId: 'c',
            pid: '0',
            structName: '专业',
          }, {
            id: 'd1',
            name: '一班',
            structId: 'd',
            pid: '0',
            structName: '班级',
          },

        ],
      }, {
        id: 'd262',
        token: '116',
        name: '修改测试13',
        structId: '2',
        pid: '0',
        status: '1',
        structLabelRelates: [


        ],
        pidItems: [
          {
            id: 'a1',
            name: '清水河校区',
            structId: 'a',
            pid: '0',
            structName: '校区',
          }, {
            id: 'c1',
            name: '计算机专业',
            structId: 'c',
            pid: '0',
            structName: '专业',
          }, {
            id: 'd1',
            name: '一班',
            structId: 'd',
            pid: '0',
            structName: '班级',
          },

        ],
      }, {
        id: 'd282',
        token: '117',
        name: '修改测试5',
        structId: '2',
        pid: '0',
        status: '1',
        structLabelRelates: [


        ],
        pidItems: [
          {
            id: 'a1',
            name: '清水河校区',
            structId: 'a',
            pid: '0',
            structName: '校区',
          }, {
            id: 'c1',
            name: '计算机专业',
            structId: 'c',
            pid: '0',
            structName: '专业',
          }, {
            id: 'd1',
            name: '一班',
            structId: 'd',
            pid: '0',
            structName: '班级',
          },

        ],
      }, {
        id: 'd922',
        token: '118',
        name: '修改测试6',
        structId: '2',
        pid: '0',
        status: '1',
        structLabelRelates: [


        ],
        pidItems: [
          {
            id: 'a1',
            name: '清水河校区',
            structId: 'a',
            pid: '0',
            structName: '校区',
          }, {
            id: 'c1',
            name: '计算机专业',
            structId: 'c',
            pid: '0',
            structName: '专业',
          }, {
            id: 'd1',
            name: '一班',
            structId: 'd',
            pid: '0',
            structName: '班级',
          },

        ],
      }, {
        id: 'd252',
        token: '1110',
        name: '修改测试7',
        structId: '2',
        pid: '0',
        status: '1',
        structLabelRelates: [


        ],
        pidItems: [
          {
            id: 'a1',
            name: '清水河校区',
            structId: 'a',
            pid: '0',
            structName: '校区',
          }, {
            id: 'c1',
            name: '计算机专业',
            structId: 'c',
            pid: '0',
            structName: '专业',
          }, {
            id: 'd1',
            name: '一班',
            structId: 'd',
            pid: '0',
            structName: '班级',
          },

        ],
      }, {
        id: 'd322',
        token: '11111',
        name: '修改测试8',
        structId: '2',
        pid: '0',
        status: '1',
        structLabelRelates: [


        ],
        pidItems: [
          {
            id: 'a1',
            name: '清水河校区',
            structId: 'a',
            pid: '0',
            structName: '校区',
          }, {
            id: 'c1',
            name: '计算机专业',
            structId: 'c',
            pid: '0',
            structName: '专业',
          }, {
            id: 'd1',
            name: '一班',
            structId: 'd',
            pid: '0',
            structName: '班级',
          },

        ],
      }, {
        id: 'd242',
        token: '11114',
        name: '修改测试9',
        structId: '2',
        pid: '0',
        status: '1',
        structLabelRelates: [


        ],
        pidItems: [
          {
            id: 'a1',
            name: '清水河校区',
            structId: 'a',
            pid: '0',
            structName: '校区',
          }, {
            id: 'c1',
            name: '计算机专业',
            structId: 'c',
            pid: '0',
            structName: '专业',
          }, {
            id: 'd1',
            name: '一班',
            structId: 'd',
            pid: '0',
            structName: '班级',
          },

        ],
      },
      {
        id: 'd4',
        token: '11113',
        name: '修改测试10',
        structId: '2',
        pid: '0',
        status: '1',
        structLabelRelates: [


        ],
        pidItems: [
          {
            id: 'a1',
            name: '清水河校区',
            structId: 'a',
            pid: '0',
            structName: '校区',
          }, {
            id: 'c1',
            name: '计算机专业',
            structId: 'c',
            pid: '0',
            structName: '专业',
          }, {
            id: 'd1',
            name: '一班',
            structId: 'd',
            pid: '0',
            structName: '班级',
          },

        ],
      }, {
        id: 'd5',
        token: '1112',
        name: '修改测试11',
        structId: '2',
        pid: '0',
        status: '1',
        structLabelRelates: [
          {
            itemId: '2',
            labelId: '3',
          },
          {
            itemId: '2',
            labelId: '4',
          },

        ],
        pidItems: [
          {
            id: 'a2',
            name: '沙河校区',
            structId: 'a',
            pid: '0',
            structName: '校区',
          }, {
            id: 'c2',
            name: '软件专业',
            structId: 'c',
            pid: '0',
            structName: '专业',
          }, {
            id: 'd2',
            name: '二班',
            structId: 'd',
            pid: '0',
            structName: '班级',
          },

        ],
      }]
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/struct/structItem/getStructItemTree`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = [{
      id: '1',
      attrId:'1',
      label: '北京校区',
      pid: '0',
      structId:'a',
      // structItemAttrRelateMap: {
      //   '1':{
      //     id: 2,
      //     itemId: 1,
      //     attrId: '1',
      //     relateId: '1',
      //     relateName: '标签1',
      //   },
      //   '2':{
      //     id: 3,
      //     itemId: 1,
      //     attrId: '2',
      //     relateId: '4',
      //     relateName: '标签4',
      //   },

      // },
      children: [
        {
          id: '11',
          attrId:'2',
          label: '经济学院',
          pid: '1',
          structId:'b',
          structItemAttrRelateMap: {
            9: {
              id: "131",
              attrId: "9",
              relateName: "name2",
              relateId: "2",
            },
          },
          children: [{
            id: '111',
            attrId:'3',
            label: '外语专业',
            pid: '11',
            structId:'c',
          }, {
            id: '112',
            attrId:'3',
            label: '医学专业',
            pid: '11',
            structId:'c',
          }],
        },
        {
          id: '258',
          attrId:'2',
          label: '计算机学院',
          pid: '250',
          structId:'b',
          children: [{
            id: '2581',
            attrId:'3',
            label: '软件专业',
            pid: '233-11',
            structId:'c',
            // children: [{
            //   id: '25811',
            //   attrId:'4',
            //   label: '软件1班',
            //   pid: '2342-11',
            //   structId:'d',
            // }, {
            //   id: '25812',
            //   attrId:'4',
            //   label: '软件2班',
            //   pid: '2342-12',
            //   structId:'d',
            // }],
        },{
            id: '233',
            attrId:'3',
            label: '计算机专业',
            pid: '233-2',
            structId:'c',
            // children: [{
            //   id: '2331',
            //   attrId:'4',
            //   label: '计算机1班',
            //   pid: '2342-1',
            //   structId:'d',
            // }, {
            //   id: '2332',
            //   attrId:'4',
            //   label: '计算机2班',
            //   pid: '2342-2',
            //   structId:'d',
            // }],
        }],
      }],
    },{
      id: '2',
      attrId:'1',
      label: '南京校区',
      pid: '0',
      structId:'a',
      children: [
        {
          id: '21',
          attrId:'2',
          label: '管理学院',
          pid: '1',
          structId:'b',
          structItemAttrRelateMap: {
            9: {
              id: "131",
              attrId: "9",
              relateName: "name2",
              relateId: "2",
            },
          },
          children: [{
            id: '211',
            attrId:'3',
            label: '旅游管理专业',
            pid: '11',
            structId:'c',
          }, {
            id: '212',
            attrId:'3',
            label: '酒店管理专业',
            pid: '11',
            structId:'c',
          }],
        },
        {
          id: '22',
          attrId:'2',
          label: '外语学院',
          pid: '250',
          structId:'b',
          children: [{
            id: '221',
            attrId:'3',
            label: '日语专业',
            pid: '233-11',
            structId:'c',
            // children: [{
            //   id: '25811',
            //   attrId:'4',
            //   label: '软件1班',
            //   pid: '2342-11',
            //   structId:'d',
            // }, {
            //   id: '25812',
            //   attrId:'4',
            //   label: '软件2班',
            //   pid: '2342-12',
            //   structId:'d',
            // }],
        },{
            id: '222',
            attrId:'3',
            label: '俄语专业',
            pid: '233-2',
            structId:'c',
            // children: [{
            //   id: '2331',
            //   attrId:'4',
            //   label: '计算机1班',
            //   pid: '2342-1',
            //   structId:'d',
            // }, {
            //   id: '2332',
            //   attrId:'4',
            //   label: '计算机2班',
            //   pid: '2342-2',
            //   structId:'d',
            // }],
        }],
      }],
    }]
    res.status(200).json(data)
  },
  
  [`GET ${apiPrefix}/struct/struct/getStructList`] (req, res) {
    let data = {
      ret_code: 1,
      ret_content: [{
        id: 'a',
        label: '校区',
        position: '1',
        status: '1',
        attrId:'1'
      }, {
        id: 'b',
        label: '院系',
        position: '2',
        status: '1',
        attrId:'2'
      }, {
        id: 'c',
        label: '专业',
        position: '3',
        status: '1',
        attrId:'3'
      }, {
        id: 'd',
        label: '班级',
        position: '4',
        status: '1',
        attrId:'4',
      },
      // ,{
      //   "id":"d1",
      //   "label":"班级",
      //   "position":"4",
      //   "status":"1",
      // },{
      //   "id":"d2",
      //   "label":"班级",
      //   "position":"4",
      //   "status":"1",
      // },{
      //   "id":"d3",
      //   "label":"班级",
      //   "position":"4",
      //   "status":"1",
      // },{
      //   "id":"d4",
      //   "label":"班级",
      //   "position":"4",
      //   "status":"1",
      // },{
      //   "id":"d5",
      //   "label":"班级",
      //   "position":"4",
      //   "status":"1",
      // },{
      //   "id":"d6",
      //   "label":"班级",
      //   "position":"4",
      //   "status":"1",
      // },{
      //   "id":"d7",
      //   "label":"班级",
      //   "position":"4",
      //   "status":"1",
      // },{
      //   "id":"d8",
      //   "label":"班级",
      //   "position":"4",
      //   "status":"1",
      // },{
      //   "id":"d9",
      //   "label":"班级",
      //   "position":"4",
      //   "status":"1",
      // },{
      //   "id":"d10",
      //   "label":"班级",
      //   "position":"4",
      //   "status":"1",
      // },{
      //   "id":"d11",
      //   "label":"班级",
      //   "position":"4",
      //   "status":"1",
      // }
      ],
    }

    res.status(200).json(data)
  },

  [`POST ${apiPrefix}/struct/structItem/updateItemLabel`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },

  [`POST ${apiPrefix}/struct/struct/updateStruct`] (req, res) {
    res.status(200).json({ ret_code: 1, ret_content: 1 })
  },
}
