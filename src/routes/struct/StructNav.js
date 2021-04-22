import { Menu } from 'antd'

const StructNav = ({
  data, structSelected, onChangeNav,isNavbar,
}) => {
  const handleChangeNav = (e) => {
    onChangeNav(e.key)
  }

  const renderNav = (data) => {
    if (data) {
      return data.map((item) => {
        if (item.status == '1') {
          return <Menu.Item style={{ width: `${isNavbar?22:10}%`, textAlign: 'center' }} key={item.id}>{item.label}</Menu.Item>
        }
      })
    }
  }

  return (
    <Menu onClick={handleChangeNav} mode="horizontal" selectedKeys={structSelected ? [structSelected.id] : null} style={{ padding: '20px 20px 0px 20px' }}>
      {renderNav(data)}
    </Menu>
  )
}

export default StructNav
