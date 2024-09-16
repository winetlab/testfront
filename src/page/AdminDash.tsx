import { Typography } from "antd";
import logo from "../assets/logo_neg.svg";

export default function AdminDash() {
  return (
    <>
      <div className="flex gap-2 items-baseline">
        <img src={logo} width={95} />
        <Typography.Title>PIPA</Typography.Title>
      </div>
      <Typography.Paragraph>O PIPA (Plataforma Integrada de Políticas de Acesso) é uma plataforma de gerenciamento de serviços de autorização para ambientes computacionais de big data.</Typography.Paragraph>
    </>
  )
}
