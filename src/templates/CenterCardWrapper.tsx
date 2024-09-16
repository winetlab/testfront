import { Card } from "antd"
import logo from "../assets/logo.svg"

type WrapperProps = {
  children: any
}
export default function CenterCardWrapper({ children }: WrapperProps) {
  return <div className="w-full h-100vh flex justify-center items-center">
    <div className="w-96">
      <div className="w-full flex justify-center mb-4">
        <img src={logo} width={150} />
      </div>
      <Card>
        {children}
      </Card>
      <div className="text-center text-sm text-sky-700 mt-4">
        {import.meta.env.VITE_APP_NAME} v{import.meta.env.VITE_APP_VERSION}
      </div>
    </div>
  </div>
}
