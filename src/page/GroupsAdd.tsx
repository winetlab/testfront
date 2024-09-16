import { Button, Form, Typography } from "antd";
import TitleButton from "../components/TitleButton";
import GroupForm from "../sections/GroupForm";
import ApiClient from "../services/api.service";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";


export default function GroupsAdd() {
    const [loading, setLoading] = useState(false);
    const { openNotification, gitlabProjects, ipaGroups, jenkinsRoles, rangerPolicies } = useContext(Context)
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        console.log(values)

        const data = {
            policyname: values.policyname,
            projectsgitlab: gitlabProjects.filter(item => values.projectsgitlab.includes(item.value)),
            groupipa: ipaGroups.find(item => values.groupipa === item.id),
            rolesJenkins: jenkinsRoles.filter(item => values.rolesJenkins.includes(item.value)),
            policiesranger: rangerPolicies.filter(item => values.policiesranger.includes(item.value)),
        }

        setLoading(true);
        const apiClient = new ApiClient();
        try {
            const response = await apiClient.createGroup(data);
            openNotification("Grupo criado", response, "success")
            navigate('/admin/groups/list')
        } catch (e) {
            openNotification("Erro!", "Não foi possível cadastrar o grupo. Verifique os dados e tente novamente", "error")
        }
        setLoading(false)
    };

    return (
        <>
            <TitleButton
                title="Cadastrar Grupo de Política"
            />

            <div className="flex gap-8">
                <Form
                    className="w-96"
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <GroupForm />

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
                        Formulário para criação de novo grupo de usuários para acesso aos serviços do ambiente do GSI/MPMG
                    </Typography.Paragraph>
                </div>
            </div>

        </>
    )
}
