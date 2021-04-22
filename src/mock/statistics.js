const { config } = require('./common')

const { apiPrefix } = config

module.exports = {
  [`GET ${apiPrefix}/statistics/statisticsOrder/getOverallStatistics`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      sumStatistics:{
        date:null,
        paidFee:'1000000000',
        refund:'1000000',
        paidFeeCount:'300000',
        refundCount:'100',
        realFee:'999000000',
        typeStatistics:[
          {
            payType:'1',
            date:null,
            paidFee:'1000000000',
            refund:'1000000',
            paidFeeCount:'300000',
            refundCount:'100',
            realFee:'999000000',
          }, {
            payType:'2',
            date:null,
            paidFee:'1000000000',
            refund:'1000000',
            paidFeeCount:'300000',
            refundCount:'100',
            realFee:'999000000',
          }, {
            payType:'3',
            date:null,
            paidFee:'1000000000',
            refund:'1000000',
            paidFeeCount:'300000',
            refundCount:'100',
            realFee:'999000000',
          }, {
            payType:'4',
            date:null,
            paidFee:'1000000000',
            refund:'1000000',
            paidFeeCount:'300000',
            refundCount:'100',
            realFee:'999000000',
          }
        ]
      },
      dayStatistics:[{
        date:"2018-05-07",
        paidFee:"1",
        refund:"0",
        paidFeeCount:"1",
        refundCount:"0",
        realFee:"1",
        typeStatistics:[
            {
                payType:"2",
                paidFee:"1",
                refund:"0",
                paidFeeCount:"1",
                refundCount:"0",
                realFee:"1"
            }
        ]
    },
    {
        date:"2018-05-11",
        paidFee:"9407",
        refund:"0",
        paidFeeCount:"1",
        refundCount:"0",
        realFee:"9407",
        typeStatistics:[
            {
                payType:"1",
                paidFee:"9407",
                refund:"0",
                paidFeeCount:"1",
                refundCount:"0",
                realFee:"9407"
            }
        ]
    },
    {
        date:"2018-07-09",
        paidFee:" 30000",
        refund:"0",
        paidFeeCount:"2",
        refundCount:"0",
        realFee:"30000",
        typeStatistics:[
            {
              payType:"1",
              paidFee:"30000",
              refund:"0",
              paidFeeCount:"2",
              refundCount:"0",
              realFee:"30000"
            },{
              payType: "3",
              paidFee: "684000",
              refund: "0",
              paidFeeCount: "11",
              refundCount: "0",
              realFee: "684000"
            }
        ]
    },]
    }
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/statistics/statisticsOrder/getOverallStatisticsSubject`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {"sumStatistics":{"date":null,"paidFee":"43316000","refund":"0","paidFeeCount":"72","refundCount":"0","realFee":"43316000","typeStatistics":[{"payType":"1","paidFee":"27206000","refund":"0","paidFeeCount":"44","refundCount":"0","realFee":"27206000","name":null,"subjectStatistics":null},{"payType":"2","paidFee":"16110000","refund":"0","paidFeeCount":"28","refundCount":"0","realFee":"16110000","name":null,"subjectStatistics":null},{"payType":"3","paidFee":"0","refund":"0","paidFeeCount":"0","refundCount":"0","realFee":"0","name":null,"subjectStatistics":null},{"payType":"4","paidFee":"0","refund":"0","paidFeeCount":"0","refundCount":"0","realFee":"0","name":null,"subjectStatistics":null}]},"dayStatistics":[{"date":"2019-09-16","paidFee":"43316000","refund":"0","paidFeeCount":"72","refundCount":"0","realFee":"43316000","typeStatistics":[{"payType":"1","paidFee":"27206000","refund":"0","paidFeeCount":"44","refundCount":"0","realFee":"27206000","name":null,"subjectStatistics":[{"payType":"1","paidFee":"25430000","refund":"0","paidFeeCount":"44","refundCount":"0","realFee":"25430000","name":"学费(石家庄)","subjectStatistics":null},{"payType":"1","paidFee":"1110000","refund":"0","paidFeeCount":"18","refundCount":"0","realFee":"1110000","name":"住宿费(石家庄)","subjectStatistics":null},{"payType":"1","paidFee":"360000","refund":"0","paidFeeCount":"3","refundCount":"0","realFee":"360000","name":"教材费(石家庄)","subjectStatistics":null},{"payType":"1","paidFee":"18000","refund":"0","paidFeeCount":"3","refundCount":"0","realFee":"18000","name":"体检费(石家庄)","subjectStatistics":null},{"payType":"1","paidFee":"288000","refund":"0","paidFeeCount":"3","refundCount":"0","realFee":"288000","name":"医保费(石家庄)","subjectStatistics":null}]},{"payType":"2","paidFee":"16110000","refund":"0","paidFeeCount":"28","refundCount":"0","realFee":"16110000","name":null,"subjectStatistics":[{"payType":"2","paidFee":"15600000","refund":"0","paidFeeCount":"26","refundCount":"0","realFee":"15600000","name":"学费(石家庄)","subjectStatistics":null},{"payType":"2","paidFee":"510000","refund":"0","paidFeeCount":"9","refundCount":"0","realFee":"510000","name":"住宿费(石家庄)","subjectStatistics":null}]},{"payType":"3","paidFee":"0","refund":"0","paidFeeCount":"0","refundCount":"0","realFee":"0","name":null,"subjectStatistics":null},{"payType":"4","paidFee":"0","refund":"0","paidFeeCount":"0","refundCount":"0","realFee":"0","name":null,"subjectStatistics":null}]}]}
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/statistics/statisticsQuery/getArchitectureStatisticsList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      paidFeeCount: "2",
      paidFeeSum: '124859688',
      refundCount: "16",
      refundSum: '2568203',
      arrearsCount: "8",
      arrearsSum: '48904711642',
      totalFeeCount: "67",
      totalFeeSum: '49032595520',
      exceedFeeSum: '24353463546',
      discountCount: "28",
      discountSum: '2331224',
      exceedFeeSum: '56456',
      convertFeeSum: '22222',
      convertFeeCount: '1231',
      structItemEntity: {
        count: "33",
        data: [{
          id: "236",
          token: null,
          name: "电气工程学院",
          structId: "b",
          pid: "234",
          status: "1",
          structItemAttrRelateEntities: [],
          structItemEntities: [{
            id: "234",
            token: null,
            name: "狮子山校区",
            structId: "a",
            pid: "0",
            status: null,
            structItemAttrRelateEntities: null,
            structItemEntities: null,
            pidItems: null,
            ruleId: null,
            fee: null,
            structName: null,
            editable: null,
            labelIds: null,
            labelId: null,
            statisticsData: null,
          }],
          ruleId: null,
          fee: null,
          structName: null,
          editable: null,
          labelIds: null,
          labelId: null,
          statisticsData: {
            paidFee: '0',
            paidFeeCount: "34",
            refund: '0',
            refundCount: "675",
            arrears: '17',
            arrearsCount: "897",
            totalFee: '180',
            totalFeeCount: "211",
            discount: '1',
            discountCount: "30",
            relateId: "236"
          },
          gradeList:[
            {
              paidFee: '0',
              paidFeeCount: "34",
              refund: '0',
              refundCount: "675",
              arrears: '17',
              arrearsCount: "897",
              totalFee: '18',
              totalFeeCount: "21",
              discount: '1',
              discountCount: "30",
              name: "2017级"
            }
          ]
        }, {
          id: "237",
          token: null,
          name: "土木学院",
          structId: "b",
          pid: "234",
          status: "1",
          structItemAttrRelateEntities: [],
          structItemEntities: null,
          pidItems: [{
            id: "234",
            token: null,
            name: "狮子山校区",
            structId: "a",
            pid: "0",
            status: null,
            structItemAttrRelateEntities: null,
            structItemEntities: null,
            pidItems: null,
            ruleId: null,
            fee: null,
            structName: null,
            editable: null,
            labelIds: null,
            labelId: null,
            statisticsData: null
          }],
          ruleId: null,
          fee: null,
          structName: null,
          editable: null,
          labelIds: null,
          labelId: null,
          statisticsData: {
            paidFee: '0',
            paidFeeCount: "34",
            refund: '0',
            refundCount: "675",
            arrears: '17',
            arrearsCount: "897",
            totalFee: '18',
            totalFeeCount: "21",
            discount: '1',
            discountCount: "30",
            relateId: "236"
          }
        },{
          id: "245",
          token: null,
          name: "文学院",
          structId: "b",
          pid: "235",
          status: "1",
          structItemAttrRelateEntities: [],
          structItemEntities: null,
          pidItems: [{
            id: "235",
            token: null,
            name: "翠苑校区",
            structId: "a",
            pid: "0",
            status: null,
            structItemAttrRelateEntities: null,
            structItemEntities: null,
            pidItems: null,
            ruleId: null,
            fee: null,
            structName: null,
            editable: null,
            labelIds: null,
            labelId: null,
            statisticsData: null
          }],
          ruleId: null,
          fee: null,
          structName: null,
          editable: null,
          labelIds: null,
          labelId: null,
          statisticsData: {
            paidFee: '0',
            paidFeeCount: "34",
            refund: '0',
            refundCount: "675",
            arrears: '17',
            arrearsCount: "897",
            totalFee: '18',
            totalFeeCount: "21",
            discount: '1',
            discountCount: "30",
            relateId: "236"
          }
        }]
      },
    }
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/statistics/statisticsQuery/getArchitectureStatisticsDetail`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      statisticsDataLists: [{
        paidFeeSum: 1922200,
        paidFeeCount: '12',
        refundSum: 411100,
        refundCount: '45',
        arrearsSum: 2998301,
        arrearsCount: '56',
        totalFeeSum: 4920601,
        totalFeeCount: '78',
        discountSum: 100,
        discountCount: '123',
        year: "2016",
        structItemEntity: null,
        feeBillEntities: null,
        statisticsDataList: [{
          paidFee: 50000,
          paidFeeCount: '543',
          refund: 50000,
          refundCount: '23',
          arrears: 150000,
          arrearsCount: '867',
          totalFee: 200000,
          totalFeeCount: '43',
          discount: 0,
          discountCount: '34',
          subjectName: "11111",
          year: ""
        }]
      }, {
        paidFeeSum: 0,
        paidFeeCount: '12',
        refundSum: 0,
        refundCount: '45',
        arrearsSum: 5,
        arrearsCount: '56',
        totalFeeSum: 5,
        totalFeeCount: '78',
        discountSum: 0,
        discountCount: '123',
        year: "2017",
        structItemEntity: null,
        feeBillEntities: null,
        statisticsDataList: [{
          paidFee: 0,
          paidFeeCount: '543',
          refund: 0,
          refundCount: '23',
          arrears: 3,
          arrearsCount: '867',
          totalFee: 3,
          totalFeeCount: '43',
          discount: 0,
          discountCount: '34',
          subjectName: "学费可选",
          year: "2017"
        }]
      }, {
        paidFeeSum: 80000,
        paidFeeCount: '12',
        refundSum: 0,
        refundCount: '45',
        arrearsSum: 170000,
        arrearsCount: '56',
        totalFeeSum: 250000,
        totalFeeCount: '78',
        discountSum: 0,
        discountCount: '123',
        year: "2018",
        structItemEntity: null,
        feeBillEntities: null,
        statisticsDataList: [{
          paidFee: 10000,
          paidFeeCount: '543',
          refund: 0,
          refundCount: '23',
          arrears: 20000,
          arrearsCount: '867',
          totalFee: 30000,
          totalFeeCount: '43',
          discount: 0,
          discountCount: '34',
          subjectName: "11111",
          year: "2018"
        }]
      }, {
        paidFeeSum: 10000,
        paidFeeCount: '12',
        refundSum: 0,
        refundCount: '45',
        arrearsSum: 20000,
        arrearsCount: '56',
        totalFeeSum: 30000,
        totalFeeCount: '78',
        discountSum: 0,
        discountCount: '123',
        year: "2019",
        structItemEntity: null,
        feeBillEntities: null,
        statisticsDataList: [{
          paidFee: 0,
          paidFeeCount: '543',
          refund: 0,
          refundCount: '23',
          arrears: 20000,
          arrearsCount: '867',
          totalFee: 20000,
          totalFeeCount: '43',
          discount: 0,
          discountCount: '34',
          subjectName: "水电费",
          year: "2019"
        }]
      }],
      statisticsDataSum: {
        paidFee: 2012200,
        paidFeeCount: '543',
        refund: 411100,
        refundCount: '23',
        arrears: 3188306,
        arrearsCount: '867',
        totalFee: 5200606,
        totalFeeCount: '43',
        discount: 100,
        discountCount: '34',
        relateId: null,
        year: null
      }
    }
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/statistics/statisticsQuery/getArchitectureStatSubject`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      statisticsDataList: [{
        paidFee: 50000,
        paidFeeCount: '543',
        refund: 50000,
        refundCount: '23',
        arrears: 150000,
        arrearsCount: '867',
        totalFee: 200000,
        totalFeeCount: '43',
        discount: 0,
        discountCount: '34',
        subjectName: "11111",
        year: "",
        gradeList:[
          {
            paidFee: '0',
            paidFeeCount: "34",
            refund: '0',
            refundCount: "675",
            arrears: '17',
            arrearsCount: "897",
            totalFee: '18',
            totalFeeCount: "21",
            discount: '1',
            discountCount: "30",
            name: "2017级"
          }
        ]
      }],
      statisticsDataSum: {
        paidFee: 2012200,
        paidFeeCount: '543',
        refund: 411100,
        refundCount: '23',
        arrears: 3188306,
        arrearsCount: '867',
        totalFee: 5200606,
        totalFeeCount: '43',
        discount: 100,
        discountCount: '34',
        relateId: null,
        year: null
      }
    }
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/statistics/statisticsQuery/getMissionStatisticsDetail`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      paidFeeSum: 1922200,
      paidFeeCount: '213',
      refundSum: 411100,
      refundCount: '123',
      arrearsSum: 2998301,
      arrearsCount: '32',
      totalFeeSum: 4920601,
      totalFeeCount: '45',
      discountSum: 100,
      discountCount: '435',
      year: "2016",
      structItemEntity: null,
      feeBillEntities: null,
      statisticsDataList: [{
        paidFee: 50000,
        paidFeeCount: '76',
        refund: 50000,
        refundCount: '56',
        arrears: 150000,
        arrearsCount: '45',
        totalFee: 200000,
        totalFeeCount: '45',
        discount: 0,
        discountCount: 0,
        subjectName: "11111",
        year: ""
      },{
        paidFee: 50000,
        paidFeeCount: '87',
        refund: 50000,
        refundCount: '87',
        arrears: 150000,
        arrearsCount: '09',
        totalFee: 200000,
        totalFeeCount: '34',
        discount: 0,
        discountCount: '53',
        subjectName: "11111",
        year: ""
      }]
    }
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/statistics/statisticsQuery/getMissionStatistics`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      paidFeeSum: 128003687,
      paidFeeCount: '09',
		  refundSum: 3880303,
		  refundCount: '876',
		  arrearsSum: 3002596875,
		  arrearsCount: '765',
		  totalFeeSum: 3133387043,
		  totalFeeCount: '20',
      discountSum: 2182515,
      discountCount: '11',
      exceedFeeSum: '13423424',
      year: null,
      structItemEntity: null,
      feeBillEntities: null,
      statisticsDataList: null,
      statisticsDataListPage: {
        count: "54",
        data: [{
          paidFee: 0,
          paidFeeCount: 0,
          refund: 10000,
          refundCount: 10000,
          arrears: 90000,
          arrearsCount: 90000,
          totalFee: 120000,
          totalFeeCount: 120000,
          discount: 0,
          discountCount: 0,
          missionId: '1',
          missionName: '2018年春收',
          year: null
        },{
          paidFee: 0,
          paidFeeCount: 0,
          refund: 20000,
          refundCount: 20000,
          arrearsCount: 120000,
          totalFee: 120000,
          totalFeeCount: 120000,
          discount: 0,
          discountCount: 0,
          missionId: '2',
          missionName: '2017年秋收',
          year: null
        }]
      }
    }
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/statistics/statisticsQuery/getSubjectStatistics`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      paidFeeSum: "128758469",
      paidFeeCount: "76",
      refundSum: "3880303",
      refundCount: "4",
      arrearsSum: "51550627333",
      arrearsCount: "8",
      totalFeeSum: "51882526321",
      totalFeeCount: "45",
      discountSum: "202536553",
      discountCount: "98",
      exceedFeeSum: '3445756',
      year: null,
      structItemEntity: null,
      feeBillEntities: null,
      statisticsDataList: null,
      statisticsDataListPage: {
        count: "9",
        data: [{
          paidFee: "15645208",
          paidFeeCount: "2",
          refund: "80000",
          refundCount: "4",
          arrears: "422459856",
          arrearsCount: "23",
          totalFee: "438269070",
          totalFeeCount: "32",
          discount: "157246",
          discountCount: "22",
          subjectName: "学费",
          subjectId: "1",
          year: null
        }, {
          paidFee: "18516218",
          paidFeeCount: "33",
          refund: "495500",
          refundCount: "34",
          arrears: "450809642",
          arrearsCount: "12",
          totalFee: "0",
          totalFeeCount: "0",
          discount: "200184242",
          discountCount: "324",
          subjectName: "11111",
          subjectId: "2",
          year: null
        }]
      }
    }
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/statistics/statisticsQuery/getSubjectStatisticsDetail`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      paidFeeSum: 11806869,
      paidFeeCount: 11806869,
      refundSum: 1783600,
      refundCount: 1783600,
      arrearsSum: 411695418,
      arrearsCount: 411695418,
      totalFeeSum: 425341953,
      totalFeeCount: 425341953,
      discountSum: 1812129,
      discountCount: 1812129,
      year: null,
      structItemEntity: null,
      feeBillEntities: {
        count: "4163",
        data: [{
          userId: "1149",
          feeBillListEntities: null,
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
          statisticsData: {
            paidFee: "2564806",
            refund: "1372500",
            arrears: "22408587",
            totalFee: "25094895",
            discount: "121502",
            relateId: "1149",
            year: null
          }
        }]
      },
      statisticsDataList: null,
      statisticsDataListPage: null
    }
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/statistics/statisticsQuery/getTimeStatistics`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      "receivedFeeSum": "23556",
      "receivedFeeCount": "15",
      "refundSum": "468",
      "refundCount": "4",
      "orderStatisticsDayTypeEntityList": {
        "count": "3",
        "data": [{
          "id": null,
          "token": null,
          "totalFee": "17988",
          "totalOrder": "5",
          "refundFee": "0",
          "refundOrder": "0",
          "missionName": null,
          "subjectName": null,
          "pyteName": null,
          "createDate": "2018-06"
        }]
		},
		  "orderStatisticsDayTypeEntity": null
    }
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/statistics/statisticsQuery/getTimeSubjectStatistics`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      "totalFeeSum": "6266142",
      "totalOrderCount": "95",
      "refundFeeSum": "59000",
      "refundOrderCount": "6",
      "orderStatisticsDayTypeEntityList": null,
      "orderStatisticsDayTypeEntity": [{
        "id": null,
        "token": null,
        "totalFee": "620940",
        "totalOrder": "10",
        "refundFee": "0",
        "refundOrder": "0",
        "missionName": null,
        "subjectName": "11111",
        "pyteName": null,
        "createDate": null
      }, {
        "id": null,
        "token": null,
        "totalFee": "120000",
        "totalOrder": "6",
        "refundFee": "0",
        "refundOrder": "0",
        "missionName": null,
        "subjectName": "住宿费",
        "pyteName": null,
        "createDate": null
      }],
    }
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/statistics/statisticsQuery/getTimeMissionStatistics`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      "totalFeeSum": "6266142",
      "totalOrderCount": "95",
      "refundFeeSum": "59000",
      "refundOrderCount": "6",
      "orderStatisticsDayTypeEntityList": null,
      "orderStatisticsDayTypeEntity": [{
        "id": null,
        "token": null,
        "totalFee": "620940",
        "totalOrder": "10",
        "refundFee": "0",
        "refundOrder": "0",
        "missionName": "2018春收",
        "subjectName": "11111",
        "pyteName": null,
        "createDate": null
      }, {
        "id": null,
        "token": null,
        "totalFee": "120000",
        "totalOrder": "6",
        "refundFee": "0",
        "refundOrder": "0",
        "missionName": "2017秋收",
        "subjectName": "住宿费",
        "pyteName": null,
        "createDate": null
      }],
    }
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/statistics/statisticsQuery/getTimePayTypeStatistics`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      "totalFeeSum": "6266142",
      "totalOrderCount": "95",
      "refundFeeSum": "59000",
      "refundOrderCount": "6",
      "orderStatisticsDayTypeEntityList": null,
      "orderStatisticsDayTypeEntity": [{
        "id": null,
        "token": null,
        "totalFee": "620940",
        "totalOrder": "10",
        "refundFee": "0",
        "refundOrder": "0",
        "missionName": "2018春收",
        "subjectName": "11111",
        "payTypeName": "支付宝",
        "createDate": null
      }, {
        "id": null,
        "token": null,
        "totalFee": "120000",
        "totalOrder": "6",
        "refundFee": "0",
        "refundOrder": "0",
        "missionName": "2017秋收",
        "subjectName": "住宿费",
        "payTypeName": "微信",
        "createDate": null
      }],
    }
    res.status(200).json(data)
  },

  [`GET ${apiPrefix}/statistics/statisticsQuery/getStudentStatisticsList`] (req, res) {
    let data = {}
    data.ret_code = 1
    data.ret_content = {
      "paidFeeSum": "85874407",
      "refundSum": "440000",
      "arrearsSum": "830137083",
      "totalFeeSum": "918160000",
      "discountSum": "1766660",
      'exceedFeeSum': '100000100',
      "structItemEntity": null,
		  "feeBillEntities": {
        "count": "4163",
        "data": [
        {
          "userId": "1149",
          "feeBillListEntities": null,
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
          "statisticsData": {
            "paidFee": "0",
            "refund": "0",
            "arrears": "20040000",
            "totalFee": "20140000",
            "discount": "100000",
            "relateId": "1149",
            'exceedFee': '0',
            "year": null
          }
			  }, {
          "userId": "1150",
          "feeBillListEntities": null,
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
          "statisticsData": {
            "paidFee": "0",
            "refund": "0",
            "arrears": "160000",
            "totalFee": "160000",
            "discount": "0",
            "relateId": "1150",
            "year": null
          }
        }]
      }
    }
    res.status(200).json(data)
  },
}
