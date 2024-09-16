import { Button, Form, Typography } from "antd";
import CenterCardWrapper from "../templates/CenterCardWrapper";
import { Link } from "react-router-dom";
import UserForm from "../sections/UserForm";

export default function Register() {
  return (
    <CenterCardWrapper>
      <div className="flex flex-col gap-4">
        <Typography.Title level={3}>Cadastro de Usuário</Typography.Title>
        <Typography.Paragraph>Formulário para solicitação de cadastro de usuário para acesso ao ambiente computacional do GSI.</Typography.Paragraph>

        <Form
          layout="vertical"
        >
          <UserForm />
        </Form>

        <Button block type="primary" size="large">Cadastrar</Button>
        <Link to='/'><Button type="text" block size="large">Voltar</Button></Link>
      </div>
    </CenterCardWrapper>
  )
}
