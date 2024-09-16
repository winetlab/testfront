import { Button, Typography } from "antd";
import CenterCardWrapper from "../templates/CenterCardWrapper";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <CenterCardWrapper>
      <div className="flex flex-col gap-4">
        <Typography.Paragraph>O PIPA (Plataforma Integrada de Políticas de Acesso) é uma plataforma de gerenciamento de serviços de autorização para ambientes computacionais de big data.</Typography.Paragraph>
        <Link to='/admin'><Button block type="primary" size="large">Entrar</Button></Link>
        <div className="text-center">- OU -</div>
        <Link to='/register'><Button block size="large">Solicitar cadastramento</Button></Link>
      </div>
    </CenterCardWrapper>
  )
}
