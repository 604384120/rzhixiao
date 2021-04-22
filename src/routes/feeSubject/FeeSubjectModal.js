import React from 'react'
import {  Button, Modal, Form, Input, Radio } from 'antd'
import styles from './index.less'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;


const FeeSubjectModal = ({
  record,visible,onhandleClose,onSubmit,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
    getFieldValue,
  },
}) => {
    const handleClose = (visible) => {
      onhandleClose (visible)
    }
    const formItemLayout = {
        labelCol: {
          span: 6,
        },
        wrapperCol: {
          span: 14,
        },
    }
    const submitAccount = () => {
      validateFields((errors) => {
            if (errors) {
              return
            }
            const datas = {
              id : record.id,
              status : record.status,
              info: getFieldsValue()
            }
            onSubmit(false,datas)
          }
        )
    }

    const renderItem = () => {
      const info = JSON.parse(record.info)
      const itemArr = []
      for(let index in info){
        let value = info[index]
        if(index == "代开标志"){
          itemArr.push(<FormItem label='代开标志' key='a' {...formItemLayout}>
          {getFieldDecorator('代开标志', {
            initialValue: value,
          })(<RadioGroup>
            <Radio value={'自开'}>自开</Radio>
            <Radio value={'代开'}>代开</Radio>
          </RadioGroup>)}
        </FormItem>)
        }else{
          itemArr.push(
            <FormItem label={index} key={index} {...formItemLayout}>
              {getFieldDecorator(index, {
                initialValue: value,
              })(<Input placeholder={"请填写"+index}/>)}
            </FormItem>
          )
        }
      }
      return itemArr
    }


    return (
        <div>
          <Modal
          title={record.typeName}
          visible={visible}
          onCancel={()=>{handleClose(visible)}}
          footer={<Button type="primary" onClick={() => { submitAccount() }}>保存</Button>}
        >
            <Form layout="horizontal" className={styles['inp-border']}>
              {renderItem()}
            </Form>
        </Modal>
        </div>
        
    )
}
export default Form.create()(FeeSubjectModal)