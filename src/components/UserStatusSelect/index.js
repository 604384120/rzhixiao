import { Select } from 'antd'

const UserStatusSelect = ({
  disabled,
  value,
  className,
  placeholder,
  onChange
}) => {
  return (
    <Select disabled={disabled} mode="multiple" allowClear={true} optionFilterProp="children" value={value} className={className} placeholder={placeholder} onChange={onChange}>
      <Option key={'01'} value={'在读'} title={'在读'}>在读</Option>
      <Option key={'02'} value={'休学'} title={'休学'}>休学</Option>
      <Option key={'03'} value={'退学'} title={'退学'}>退学</Option>
      <Option key={'04'} value={'停学'} title={'停学'}>停学</Option>
      <Option key={'05'} value={'复学'} title={'复学'}>复学</Option>
      <Option key={'06'} value={'流失'} title={'流失'}>流失</Option>
      <Option key={'07'} value={'毕业'} title={'毕业'}>毕业</Option>
      <Option key={'08'} value={'结业'} title={'结业'}>结业</Option>
      <Option key={'09'} value={'肄业'} title={'肄业'}>肄业</Option>
      <Option key={'10'} value={'转学(转出)'} title={'转学(转出)'}>转学(转出)</Option>
      <Option key={'11'} value={'死亡'} title={'死亡'}>死亡</Option>
      <Option key={'12'} value={'保留入学资格'} title={'保留入学资格'}>保留入学资格</Option>
      <Option key={'13'} value={'公派出国'} title={'公派出国'}>公派出国</Option>
      <Option key={'14'} value={'开除'} title={'开除'}>开除</Option>
      <Option key={'15'} value={'下落不明'} title={'下落不明'}>下落不明</Option>
      <Option key={'99'} value={'其他'} title={'其他'}>其他</Option>
    </Select>
	)
}

export default UserStatusSelect

