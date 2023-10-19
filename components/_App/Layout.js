import { useRouter } from "next/router"
import { useState } from "react"
import TopNavbar from "./TopNavBar/index.jsx"
import LeftSidebar from './LeftSidebar/index.jsx'

const Layout = ({ children }) => {
  const router = useRouter()
  const [active, setActive] = useState(false)
  const toogleActive = () => {setActive(!active)}

  return (
    <>
      <div className={`main-wrapper-content ${active && "active"}`}>
        {
          !(router.pathname === '/authentication/sign-in') &&
          (
            <>
              <TopNavbar toogleActive={toogleActive} />
              <LeftSidebar toogleActive={toogleActive} />
            </>
          )
        }
        <div className="main-content">
          {children}
        </div>
      </div>
    </>
  )
}

export default Layout