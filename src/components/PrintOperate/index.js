import { Button, Popover, Checkbox, Popconfirm, Message, Input } from 'antd'
import { Link } from 'dva/router'
import queryString from 'query-string'
import { getFormat } from 'utils'
import qs from 'qs'

const PrintOperate = ({
  printData,
  printType,
  subjectMap,
  isBatch,
  style,
  userAttrList,
  onUpdatePrint,
  onGetPrint,
  onPrintSuccess,
  onPrintDelete,
}) => {
  let printList
  if(isBatch){
    printList = printData._list?printData._list:[]
  }else{
    printList = [printData._order]
  }

  const handlePrintVisibleChange = (visible) => {
    if(visible == true){
      let tempMap = {}
      let tempList = []
      for(let record of printList){
        if(record.feeBillLists){
          for(let order of record.feeBillLists){
            if(!tempMap[order.subjectId]){
              tempMap[order.subjectId] = {
                _checked: printList.length > 1?true:(order.receiptNo?false:true),
                subjectId: order.subjectId,
                name: subjectMap[order.subjectId].name,
                _disabled: printList.length > 1?false:(order.receiptNo?true:false)
              }
              tempList.push(tempMap[order.subjectId])
            }
          }
        }
      }
      printData._subjectList = tempList
      printData._subjectMap = tempMap
    }
    printData._list = printList
    printData._printVisible = visible
    onUpdatePrint({printData})
  }

  const handleItemCheckChange = (e, subject) => {
		subject._checked = e.target.checked
		onUpdatePrint({printData})
	}

  const handlePrint = () => {
		let hasChecked = false;
		for(let subject of printData._subjectList){
			if(subject._checked){
				hasChecked = true;
				break;
			}
		}
		if(!hasChecked){
			Message.error("请选择需要打印的项目");
			return;
    }
    printData._printVisible = false
    onUpdatePrint({printData})
    if(!printType){
      //获取需要打印的数据
      onGetPrint()
    }else if(printType=='bs'){
      printData._dataLoading = false
      printData._isPrinting = printList.length
      onUpdatePrint({printData})
      for(let data of printList){
        data._dataLoading = true
        //获取姓名
        let tempMap = {};
        for(let node of userAttrList){
          tempMap[node.name] = node.id;
        }
        let subList = data.feeBillLists;
        let txt = "<&票据><&票据头>缴款人="+(data[tempMap["姓名"]]?data[tempMap["姓名"]]:'')+" "+(data[tempMap["学号"]]?data[tempMap["学号"]]:'')+" "
          +(data[tempMap["院系"]]?data[tempMap["院系"]]:'')+" "+(data[tempMap["班级"]]?data[tempMap["班级"]]:'')+"</&票据头><&收费项目>";
        let billStr = "";
        let billList = []
        for(let billNode of subList){
          if(printData._subjectMap[billNode.subjectId]._checked && !billNode.receiptNo){
            txt+="收费项目="+billNode.subCode+"\t计费数量=1\t收费标准="+getFormat(billNode.totalFee)+"\t金额="+getFormat(billNode.paidFee)+"\n";
            billStr+= billNode.id+',';
            billList.push(billNode)
          }
        }
        if(!billStr){
          printData._isPrinting--
          data._dataLoading = false
          //没有可打印的票据
          continue
        }
        txt += "</&收费项目></&票据>";
        let params = {
          ZrTxt:txt,
          IsPrn:1,
          PjLx:data.templateCode
        };
        // //博思打印
        const url = "http://127.0.0.1:7699/PZrPj?"+qs.stringify(params);
        fetch(url, {
            method: "GET",
        }).then((res) => res.text())
        .then(retdata => {
          //处理成功
          if(retdata.indexOf('成功:') == 0){
            let arr = retdata.split(',');
            //获取票据号
            onPrintSuccess({
              missionId: data.missionId,
              orderNo: data.orderNo,
              receiptNo: arr[1],
              billId: billStr,
              notips: true,
              billList
            })
          }
          else{
            Message.error(retdata);
          }
          printData._dataLoading = false
          onUpdatePrint({printData})
        })
        .catch(err => {
          printData._isPrinting--
          data._dataLoading = false
          onUpdatePrint({printData})
          Message.error("无法调用博思打印接口，请检查相应服务是否开启")}
        );
      }
      onUpdatePrint({printData})
    }else{
      printData._dataLoading = false
      printData._isPrinting = printList.length
      onUpdatePrint({printData})
      const list = []
      for(let data of printList){
        data._dataLoading = true
        let subList = data.feeBillLists;
        let billStr = "";
        let billList = []
        for(let billNode of subList){
          if(printData._subjectMap[billNode.subjectId]._checked && !billNode.receiptNo){
            billStr+= billNode.id+',';
            billList.push(billNode)
          }
        }
        if(!billStr){
          data._dataLoading = false
          printData._isPrinting--
          //没有可打印的票据
          continue
        }
        list.push({
          missionId: data.missionId,
          orderNo: data.orderNo,
          billId: billStr,
          notips: true,
          billList
        })
      }
       //获取票据号
      onPrintSuccess({list})
      onUpdatePrint({printData})
    }
	}

	const handlePrintDelete = () => {
    if(printType=='bs'){
      //调用博四作废接口
      let params = {
        flag:"票据号="+printData.receiptNo+"|票据类型="+printData.templateCode,
      };
      // //博思打印
      const url = "http://127.0.0.1:7699/PDelPj?"+qs.stringify(params);
      fetch(url, {
          method: "GET",
      }).then((res) => res.text())
      .then(retdata => {
        //处理成功
        if(retdata.indexOf('成功:') == 0){
          onPrintDelete({
            printData
          })
        }else{
          Message.error(retdata);
        }
      })
      .catch(err => Message.error("无法调用博思打印接口，请检查相应服务是否开启"));
    }else{
      onPrintDelete({
        printData
      })
    }
  }

  const handleChangeRemark = (e) => {
    printData._remark = e.target.value;
    onUpdatePrint({printData})
  }

  const renderPrintItem = () => {
		if(!printData._subjectList){
		  return;
		}
		const itemR = [];
    const itemNotR = [];

    for(let record of printData._subjectList){
      if(record.type=='1'){
        itemR.push(<div style={{marginTop:'5px'}}><Checkbox checked={record._checked} disabled={record._disabled} onChange={e => handleItemCheckChange(e, record)} key={record.subjectId}>{record.name}</Checkbox></div>)
      }else{
        itemNotR.push(<div style={{marginTop:'5px'}}><Checkbox checked={record._checked} disabled={record._disabled} onChange={e => handleItemCheckChange(e, record)} key={record.subjectId}>{record.name}</Checkbox></div>)
      }
    }
		//行政性事业收费分类显示
		return (
			<div style={{ width: '150px' }}>
			  <div style={{ maxHeight: '200px', overflow: 'scroll' }}>
				  {
					itemR.length>0&&<div>
					<div style={{color:'#b1b1b1'}}>
						行政事业性收费
					</div>
					<div>
					{itemR}
					</div>
					</div>
				  }
				  {
					itemNotR.length>0&&<div>
					<div style={{color:'#b1b1b1', marginTop:'5px'}}>
					非行政事业性收费
					</div>
					<div>
					{itemNotR}
					</div>
					</div>
				  }
			  </div>
        {
          //  printType == 'Xnhkxy' 票据类型如果是'Xnhkxy'（西安航空大学缩写）就可以输入备注
          printType=='Xnhkxy'&&<Input size="small" style={{ marginTop: '5px'}} placeholder="请输入备注" onChange={handleChangeRemark}/>
        }
			  <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button size="small" style={{ marginRight: '10px' }} onClick={()=>handlePrintVisibleChange(false)}>取消</Button>
				<Button type="primary" size="small" onClick={()=>handlePrint()}>确定</Button>
			  </div>
			</div>
		)
	}

  if(isBatch){
    if(printList.length==0 || printData._isPrinting>0){
      return ( <Button disabled={true} style={{...style}}>批量打印</Button>)
    }
    let tempData = printList[0]
    return (
      <Popover title={<div>选择项目{printType!='bs'&&<Link style={{marginLeft: '40px', fontSize: '12px'}} 
      to={{pathname:"/printSet", search:queryString.stringify({missionId:tempData.missionId})}}>打印设置</Link>}</div>}
      content={renderPrintItem()}
      trigger="click"
      placement="top"
      visible={printData._printVisible?printData._printVisible:false}
      onVisibleChange={handlePrintVisibleChange}
      >
      <Button style={{...style}}>批量打印</Button>
      </Popover>
    )
  }else{
    return (
      printData.receiptNo?<Popconfirm title="作废不可恢复，确认作废该票据？" onConfirm={()=>handlePrintDelete()} okText="确定" cancelText="取消"><a style={{color: 'red'}}>作废</a></Popconfirm>:
        <Popover title={<div>选择项目{(printType==""||printType==undefined)&&<Link style={{marginLeft: '40px', fontSize: '12px'}} 
        to={{pathname:"/printSet", search:queryString.stringify({missionId:printData._order.missionId})}}>打印设置</Link>}</div>}
        content={renderPrintItem()}
        trigger="click"
        placement="top"
        visible={printData._printVisible?printData._printVisible:false}
        onVisibleChange={handlePrintVisibleChange}
        >
        <a disabled={printData._order.status!='2' && printData._order.status!='6' || !printData._order.templateCode || printData._isPrinting>0 || printList[0]._dataLoading} style={{...style}}>打印</a></Popover>
    )
  }
  
}

export default PrintOperate

