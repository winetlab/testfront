import { Button, Form, Typography } from "antd";
import TitleButton from "../components/TitleButton";
import UserForm from "../sections/UserForm";
import { useContext, useState } from "react";
import ApiClient from "../services/api.service";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";



export default function UsersAdd() {
  const [loading, setLoading] = useState(false);
  const { openNotification } = useContext(Context)
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    const apiClient = new ApiClient();
    try {
      const response = await apiClient.createUser(values);
      openNotification("Usuário criado", response, "success")
      navigate('/admin/users/list')
    } catch (e) {
      openNotification("Erro!", "Não foi possível cadastrar o usuário. Verifique os dados e tente novamente", "error")
    }
    setLoading(false)
  };


  return (
    <>
      <TitleButton
        title="Cadastrar Usuário"
      />

      <div className="flex gap-8">
        <Form
          className="w-96"
          layout="vertical"
          onFinish={onFinish}
        >
          <UserForm />

          <Form.Item>
            <Button
              loading={loading}
              htmlType="submit"
              block
              type="primary"
              size="large"
            >
              Cadastrar
            </Button>
          </Form.Item>
        </Form>
        <div className="max-w-60 pt-6">
          <Typography.Paragraph>
            Formulário para solicitação de cadastro de usuário para acesso ao ambiente computacional do GSI.
          </Typography.Paragraph>
        </div>
      </div>

    </>
  )
}
