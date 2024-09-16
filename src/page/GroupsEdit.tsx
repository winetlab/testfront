import { Button, Card, Form, Popconfirm, Tag } from "antd";
import TitleButton from "../components/TitleButton";
import GroupForm from "../sections/GroupForm";
import ApiClient from "../services/api.service";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../App";
import { DeleteFilled } from "@ant-design/icons";
import PolicyMembers from "../components/PolicyMembers";


export default function GroupsEdit() {
    const [loading, setLoading] = useState(false);
    const [membersAddLoading, setMembersAddLoading] = useState(false);
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [currentGroup, setCurrentGroup] = useState<any>();
    const { openNotification, gitlabProjects, ipaGroups, jenkinsRoles, rangerPolicies } = useContext(Context)
    const navigate = useNavigate();
    const { id } = useParams()
    const [form] = Form.useForm();
    const apiClient = new ApiClient();

    const onFinish = async (values: any) => {
        const data = {
            policyid: id,
            policyname: values.policyname,
            projectsgitlab: gitlabProjects.filter(item => values.projectsgitlab.includes(item.value)),
            groupipa: ipaGroups.find(item => values.groupipa === item.id),
            rolesjenkins: jenkinsRoles.filter(item => values.rolesJenkins.includes(item.value)),
            policiesranger: rangerPolicies.filter(item => values.policiesranger.includes(item.value)),
        }

        setLoading(true);
        try {
            const response = await apiClient.updateGroup(data);
            openNotification("Grupo editado", response, "success")
            navigate('/admin/groups/list')
        } catch (e) {
            openNotification("Erro!", "Não foi possível editar o grupo. Verifique os dados e tente novamente", "error")
        }
        setLoading(false)
    };

    const getGroupData = async () => {
        if (id) {
            try {
                setLoading(true);
                const data = await apiClient.getGroup(id);
                const translatedData = {
                    policyname: data.name,
                    projectsgitlab: Object.values(data.projectsgitlab).map((obj: any) => obj.id),
                    groupipa: data.groupipa,
                    rolesJenkins: Object.values(data.rolesjenkins).map((obj: any) => obj.id),
                    policiesranger: Object.values(data.policiesranger).map((obj: any) => obj.id),
                }
                console.log(data, translatedData)
                setCurrentGroup(data);
                form.setFieldsValue(translatedData)
                setLoading(false);
            } catch (e) {
                openNotification("Erro!", "Não foi possível carregar os dados do grupo", "error")
            }
        }
    }

    const deleteGroup = async () => {
        if (id) {
            setLoading(true);
            try {
                const response = await apiClient.deleteGroup(id);
                openNotification("Sucesso!", response, "success")
                navigate('/admin/groups/list')
            } catch (e) {
                openNotification("Erro!", "Não foi possível excluir o usuário", "error")
            }
            setLoading(false)
        }
    }

    const addMembersTo = async (type: string) => {
        let request: Promise<string> | undefined = undefined;
        switch (type) {
            case "gitlab":
                request = apiClient.addUserToGitlab(currentGroup.members, currentGroup.projectsgitlab)
                break;
            case "jenkins":
                request = apiClient.addUserToJenkins(currentGroup.members, currentGroup.rolesjenkins)
                break;
            case "ranger":
                request = apiClient.addUserToRanger(currentGroup.members, currentGroup.policiesranger)
                break;
            case "freeipa":
                request = apiClient.addUserToFreeIpa(currentGroup.members, currentGroup.groupipa)
                break;
        }

        if (request) {
            try {
                setMembersAddLoading(true)
                const response = await request;
                console.log(response);
                openNotification("Sucesso!", response, "success")
            } catch (e) {
                console.error(e);
                openNotification("Erro!", "Não foi possível vincular usuário", "error")
            }
            setMembersAddLoading(false)
        }
    }

    useEffect(() => {
        getGroupData()
    }, [])

    return (
        <>
            <TitleButton
                title="Editar Grupo de Política"
            />

            <div className="flex gap-16">
                <Form
                    className="w-96"
                    layout="vertical"
                    onFinish={onFinish}
                    form={form}
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
                            Salvar
                        </Button>
                    </Form.Item>
                </Form>

                <div className="flex-1">
                    {currentGroup &&
                        <div className="flex flex-col gap-2">
                            <Card>
                                <PolicyMembers
                                    isOpen={showMembersModal}
                                    setIsOpen={setShowMembersModal}
                                    currentMembers={currentGroup.members || []}
                                    policyId={+(id || 0)}
                                    reloadData={getGroupData}
                                />
                                <div className="mb-1 font-bold">Membros</div>
                                <div className="my-4">
                                    {currentGroup.members?.map((item: string) => <Tag color="purple" className="my-1">{item}</Tag>)}
                                    {(!currentGroup.members || currentGroup.members.length == 0) ? "Este grupo ainda não possuí nenhum membro vinculado" : null}
                                </div>
                                <div>
                                    <Button onClick={() => setShowMembersModal(true)}>Gerenciar membros</Button>
                                </div>
                            </Card>

                            {(currentGroup.members && currentGroup.members.length > 0)
                                ? <Card>
                                    <div className="flex gap-4">
                                        <Button loading={membersAddLoading} onClick={() => addMembersTo('gitlab')}>Associar no GitLab</Button>
                                        <Button loading={membersAddLoading} onClick={() => addMembersTo('jenkins')}>Associar no Jenkins</Button>
                                        <Button loading={membersAddLoading} onClick={() => addMembersTo('ranger')}>Associar no Ranger</Button>
                                        <Button loading={membersAddLoading} onClick={() => addMembersTo('freeipa')}>Associar no FreeIPA</Button>
                                    </div>
                                </Card>
                                : null
                            }

                            <Card>
                                <Popconfirm
                                    title="Deletar grupo?"
                                    description="Tem certeza que você deseja excluir este grupo?"
                                    onConfirm={deleteGroup}
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

        </>
    )
}
