import { Form, Input, Select } from "antd";
import { useContext } from "react";
import { Context } from "../App";

interface Props {
}

export default function GroupForm({ }: Props) {
  const { gitlabProjects, ipaGroups, jenkinsRoles, rangerPolicies } = useContext(Context);

  const translateIpaGroups = () => ipaGroups?.map(item => ({ label: item.name, value: item.id }))

  return (<>

    <Form.Item name="policyname" label="Nome do Grupo" rules={[{ required: true }]}>
      <Input />
    </Form.Item>

    <Form.Item name="projectsgitlab" label="Projetos do Gitlab" >
      <Select
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="Selecione os projetos"
        options={gitlabProjects}
      />
    </Form.Item>

    <Form.Item name="groupipa" label="Grupo do FreeIPA" >
      <Select
        allowClear
        style={{ width: '100%' }}
        placeholder="Selecione os grupos"
        options={translateIpaGroups()}
      />
    </Form.Item>

    <Form.Item name="rolesJenkins" label="Roles do Jenkins" >
      <Select
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="Selecione as roles"
        options={jenkinsRoles}
      />
    </Form.Item>

    <Form.Item name="policiesranger" label="Políticas do Ranger" >
      <Select
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="Selecione as políticas"
        options={rangerPolicies}
      />
    </Form.Item>

  </>
  )
}
