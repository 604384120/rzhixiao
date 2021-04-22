import { Select, Spin, Input } from 'antd'
import Sortable, { SortableContainer } from 'react-anything-sortable'

const Option = Select.Option
const { TextArea, Search } = Input;

const SortSelect = ({
  dataLoading,
  styles,
  userSortMap,
  userAttrMap,
  attr,
  onGetSelectList,
  onChangeSort,
}) => {
  const handleSearchSort = (attr, value) => {
    onGetSelectList({
      attrId: attr.id,
      key:value,
      userSortMap,
    })
  }

  const handleClickSort = (attr) => {
    if (!attr._selectList || attr._selectList.length <= 0) {
      onGetSelectList({
        attrId: attr.id,
        userSortMap,
      })
    }
  }

  const handleChangeSort = (value, attr) => {
    onGetSelectList({
      attrId: attr.id,
      userSortMap,
      value: value,
    })
    onChangeSort(value, attr)
  }

  const handleClickSelect = (attr, type) => {
    onGetSelectList({
      attrId: attr.id,
      userSortMap,
    })
  }

  const handleChangeSelect = (value, attr) => {
    userSortMap[attr.id]._idSelected = value
    onChangeSort(value, attr)
  }

  const createMissionOption = (attr) => {
    const options = []
    if (attr._selectList) {
      for (let select of attr._selectList) {
        options.push(<Option key={select.id} value={select.id} title={select.name}>{select.name}</Option>)
      }
      return options
    }
    return null
  }

  const createPayTypeOption = (attr) => {
    const options = [];
    if(attr._selectList){
      for(let payType of attr._selectList){
        options.push(<Option key={payType.payType} value={payType.payType} title={payType.name}>{payType.name}</Option>)
      }
    }
		return options;
  }

  const createAccountOption = (attr) => {
		const options = [];
		if(attr._selectList){
		  for(let select of attr._selectList){
				options.push(<Option key={select.id} value={select.id} title={select.loginName+'('+select.name+')'}>{select.loginName+'('+select.name+')'}</Option>)
		  }
		  return options;
		}
		return null;
  }
  
  const createLoanTypeOption = (attr) => {
    const options = [];
		if(attr._selectList){
		  for(let select of attr._selectList){
				options.push(<Option key={select.id} value={select.id} title={select.name}>{select.name}</Option>)
		  }
		  return options;
		}
		return null;
  }

  const createSubsidyTypeOption = () => {
    const options = [];
		if(attr._selectList){
		  for(let select of attr._selectList){
				options.push(<Option key={select} value={select} title={select}>{select}</Option>)
		  }
		  return options;
		}
		return null;
  }

  const createStructSortOption = (attr) => {
    const options = []
    if (attr._selectList) {
      for (let select of attr._selectList) {
        options.push(<Option key={select.id} value={select.id} title={select.name}>{select.name}</Option>)
      }
      return options
    }
    return null
  }
  
  const createUserSortOption = (attr) => {
    const options = []
    if (attr._selectList) {
      for (let select of attr._selectList) {
        options.push(<Option key={select.relateId} value={select.relateName} title={select.relateName}>{select.relateName}</Option>)
      }
      return options
    }
    return null
  }

  const creatAttr = () => {
    if(attr.id == 'missionId') {
      return <div>
        <div className={styles.sortText}>{attr.name}:</div>
        <Select mode="multiple"
        disabled={dataLoading}
        allowClear
        value={userSortMap[attr.id]._idSelected}
        className={styles.sortSelectMuti}
        placeholder={`选择${attr.name}`}
        onFocus={()=>handleClickSelect(attr)}
        showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        onChange={value => handleChangeSelect(value, attr)}
        notFoundContent={!attr._selectList ? <Spin size="small" /> : null}
      >
        {createMissionOption(attr)}
      </Select>
      </div>
    }else if(attr.id == 'subjectId'){
      return <div>
          <div className={styles.sortText}>{attr.name}:</div>
          <Select mode="multiple"
          disabled={dataLoading}
          allowClear
          value={userSortMap[attr.id]._idSelected}
          className={styles.sortSelectMuti}
          placeholder={`选择${attr.name}`}
          onFocus={()=>handleClickSelect(attr)}
          showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          onChange={value => handleChangeSelect(value, attr)}
          notFoundContent={!attr._selectList ? <Spin size="small" /> : null}
        >
          {createMissionOption(attr)}
        </Select>
      </div>
    }else if(attr.id == 'payType') {
      return <div>
        <div className={styles.sortText}>{attr.name}:</div>
        <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={userSortMap[attr.id]._idSelected} className={styles.sortSelect} placeholder={"选择"+attr.name} onFocus={()=>handleClickSelect(attr)} onChange={(value) => handleChangeSelect(value,attr)}>
          {createPayTypeOption(attr)}
        </Select>
      </div>
    }else if(attr.id == 'accountId'){
      return <div>
        <div className={styles.sortText}>{attr.name}:</div>
        <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={userSortMap[attr.id]._idSelected} className={styles.sortSelectMuti} placeholder={"选择"+attr.name} onFocus={()=>handleClickSelect(attr)} onChange={(value) => handleChangeSelect(value,attr)} notFoundContent={!userSortMap[attr.id]._selectList?<Spin size="small" />:null}>
      {createAccountOption(attr)}
      </Select>
      </div>
    }else if(attr.id == 'loanType'){
      return <div>
                <div className={styles.sortText}>{attr.name}:</div>
                <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={userSortMap[attr.id]._idSelected} className={styles.sortSelectMuti} placeholder={"选择"+attr.name}
                onFocus={()=>handleClickSelect(attr)} onChange={(value) => handleChangeSelect(value,attr)} notFoundContent={!userSortMap[attr.id]._selectList?<Spin size="small" />:null}>
                {createLoanTypeOption(attr)}
                </Select>
              </div>
    }else if(attr.id == 'subsidyType'){
      return <div className={styles.sortCol}>
                  <div className={styles.sortText}>{attr.name}:</div>
                  <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={userSortMap[attr.id]._idSelected} className={styles.sortSelectMuti} placeholder={"选择"+attr.name}
                onFocus={()=>handleClickSelect(attr)} onChange={(value) => handleChangeSelect(value,attr)} notFoundContent={!userSortMap[attr.id]._selectList?<Spin size="small" />:null}>
                {createSubsidyTypeOption(attr)}
                </Select>
              </div>
    }else if(userAttrMap[attr.id] && userAttrMap[attr.id].valueType == '3') {
      return <div>
        <div className={styles.sortText}>{attr.name}:</div>
        <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={userSortMap[attr.id]._idSelected} className={styles.sortSelectMuti} placeholder={"选择"+attr.name}
        onSearch={(value) => handleSearchSort(attr, value)}
        onFocus={()=>handleClickSelect(attr)} onChange={(value)=>handleChangeSort(value,attr)} notFoundContent={!attr._selectList?<Spin size="small" />:null}>
          {createStructSortOption(attr)}
        </Select>
      </div>
    }else{
      return <div>
              <div className={styles.sortText}>{attr.name}:</div>
              <Select disabled={dataLoading} mode="multiple" optionFilterProp="children" allowClear={true} value={userSortMap[attr.id]._idSelected} className={styles.sortSelectMuti} placeholder={"选择"+attr.name}
            onSearch={(value) => handleSearchSort(attr, value)}
            onFocus={()=>handleClickSort(attr)} onChange={(value)=>handleChangeSelect(value,attr)} notFoundContent={!attr._selectList?<Spin size="small" />:null}>
              {createUserSortOption(attr)}
              </Select>
            </div>
    }
  }

  return (<div className={styles.sortCol}>
    {creatAttr()}
  </div>
  )
}

export default SortSelect

