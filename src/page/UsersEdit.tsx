import { Button, Card, Form, Popconfirm } from "antd";
import TitleButton from "../components/TitleButton";
import UserForm from "../sections/UserForm";
import { useContext, useEffect, useState } from "react";
import ApiClient from "../services/api.service";
import { Context } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../models/api.model";
import BoolTag from "../components/BoolTag";
import UserStatusTag from "../components/UserStatusTag";
import { DeleteFilled } from "@ant-design/icons";



export default function UsersEdit() {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>();
  const { openNotification } = useContext(Context)
  const { username } = useParams()
  const navigate = useNavigate();
  const apiClient = new ApiClient();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    if (username) {
      setLoading(true);
      try {
        const response = await apiClient.updateUser(username, values);
        openNotification("Usuário editado", response, "success")
        navigate('/admin/users/list')
      } catch (e) {
        openNotification("Erro!", "Não foi possível editar o usuário. Verifique os dados e tente novamente", "error")
      }
      setLoading(false)
    }
  };

  const registerServices = async () => {
    if (username) {
      setLoading(true);
      try {
        const response = await apiClient.createUserServices(username);
        openNotification("Sucesso!", response, "success")
        getUserData()
      } catch (e) {
        openNotification("Erro!", "Não foi possível criar os servicços. Verifique os dados e tente novamente", "error")
      }
      setLoading(false)
    }
  }

  const getUserData = async () => {
    if (username) {
      try {
        const data = await apiClient.getUser(username);
        setCurrentUser(data);
        form.setFieldsValue(data)
      } catch (e) {
        openNotification("Erro!", "Não foi possível carregar os dados do usuário", "error")
      }
    }
  }

  const deleteUser = async () => {
    if (username) {
      setLoading(true);
      try {
        const response = await apiClient.deleteUser(username);
        openNotification("Sucesso!", response, "success")
        navigate('/admin/users/list')
      } catch (e) {
        openNotification("Erro!", "Não foi possível excluir o usuário", "error")
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserData()
  }, [])


  return (
    <>
      <TitleButton
        title={`Editar Usuário ${currentUser?.fullname}`}
      />

      <div className="flex gap-16">
        <Form
          className="w-96"
          layout="vertical"
          onFinish={onFinish}
          form={form}
        >
          <UserForm lowercase disableUsername />

          <Form.Item>
            <Button
              loading={loading}
              htmlType="submit"
              block
              type="primary"
              size="large"
            >
              Salvar
            </Button>
          </Form.Item>
        </Form>

        <div className="flex-1">
          {currentUser &&
            <div className="flex flex-col gap-2">
              <Card>
                <div>
                  <div className="mb-1 font-bold">Status</div>
                  <UserStatusTag label={currentUser.validation} username={currentUser.username} />
                </div>
              </Card>

              <Card>
                <div className="flex flex-col gap-2">
                  <div>
                    <div className="mb-1 font-bold">Já cadastrado no FreeIPA?</div>
                    <BoolTag tagValue={Boolean(currentUser.iscreatedipa)} />
                  </div>
                  <div>
                    <div className="mb-1 font-bold">Já cadastrado no GitLab?</div>
                    <BoolTag tagValue={Boolean(currentUser.iscreatedgitlab)} />
                  </div>

                  {!(currentUser.iscreatedipa && currentUser.iscreatedgitlab) &&
                    <div>
                      <Button
                        onClick={() => registerServices()}
                        type="primary"
                        loading={loading}
                      >
                        Cadastrar usuário nos serviços
                      </Button>
                    </div>
                  }
                </div>
              </Card>

              <Card>
                <Popconfirm
                  title="Deletar usuário?"
                  description="Tem certeza que você deseja excluir este usuário?"
                  onConfirm={deleteUser}
                  okText="Sim"
                  cancelText="Não"
                >
                  <Button
                    danger
                    icon={<DeleteFilled />}
                  >
                    Excluir
                  </Button>
                </Popconfirm>
              </Card>
            </div>
          }
        </div>
      </div>

    </ >
  )
}
