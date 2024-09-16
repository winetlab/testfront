import { Card } from "antd"
import logo from "../assets/logo.svg"
import Nav from "../components/Nav"
import { Link } from "react-router-dom"
import UserInfo from "../components/UserInfo"

type WrapperProps = {
  children?: any
}

export default function ContentWrapper({ children }: WrapperProps) {
  return <div className="w-full h-100vh flex">
    <div className="w-lateral h-100vh flex flex-col">
      <div className="flex-1 my-4">
        <div className="w-full flex justify-center">
          <Link to="/admin" ><img src={logo} width={75} /></Link>
        </div>
        <Nav />
      </div>
      <UserInfo />
    </div>
    <div className="h-100vh flex-1 p-4">
      <Card className="h-full overflow-y-auto">
        {children}
      </Card>
    </div>
  </div>
}
