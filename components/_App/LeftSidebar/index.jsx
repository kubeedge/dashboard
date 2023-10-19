import Logo from "./Logo.jsx"
import { SidebarData } from "./SidebarData.js"
import SubMenu from "./SubMenu.jsx"
import { styled } from "@mui/material/styles"

const SidebarNav = styled("nav")(({ theme }) => ({
  background: '#fff',
  boxShadow: "0px 4px 20px rgba(47, 143, 232, 0.07)",
  width: '300px',
  padding: '30px 10px',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  position: 'fixed',
  top: 0,
  left: 0,
  transition: '350ms',
  zIndex: '10',
  overflowY: 'auto'
}))
const SidebarWrap = styled("div")(({ theme }) => ({
  width: '100%'
}))

const Sidebar = ({ toogleActive }) => {
  return (
    <>
      <SidebarNav className="LeftSidebarNav">
        <SidebarWrap>
          <Logo />
          {SidebarData.map((item, index) => (<SubMenu item={item} key={index} />))}
        </SidebarWrap>
      </SidebarNav>
    </>
  )
}

export default Sidebar