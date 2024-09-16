import { Button, Skeleton, Table, TableProps } from "antd";
import TitleButton from "../components/TitleButton";
import ApiClient from "../services/api.service";
import { useEffect, useState } from "react";
import { Policy } from "../models/api.model";
import { EditFilled } from "@ant-design/icons";
import TagsGroup from "../components/TagsGroup";
import { Link } from "react-router-dom";
import FilterInput from "../components/FilterInput";

const apiClient = new ApiClient();

export default function GroupsList() {
  const [data, setData] = useState<Policy[]>();
  const [filter, setFilter] = useState<string>("");

  const objectToArray = (originalObject: any) => originalObject ? Object.entries(originalObject).map(([_key, _value]) => _key) : [];

  const columns: TableProps['columns'] = [
    {
      title: 'Grupo',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Membros',
      dataIndex: 'members',
      key: 'members',
      render: (_value, _record) => <TagsGroup color="purple" label={_value} />
    },
    {
      title: 'Projetos do GitLab',
      dataIndex: 'projectsgitlab',
      key: 'projectsgitlab',
      render: (_value) => <TagsGroup color="orange" label={objectToArray(_value)} />
    },
    {
      title: 'Politicas do Ranger',
      dataIndex: 'policiesranger',
      key: 'policiesranger',
      render: (_value) => <TagsGroup color="blue" label={objectToArray(_value)} />
    },
    {
      title: 'Role do Jenkins',
      dataIndex: 'rolesjenkins',
      key: 'rolesjenkins',
      render: (_value) => <TagsGroup color="red" label={objectToArray(_value)} />
    },
    {
      title: 'Grupo do FreeIPA',
      dataIndex: 'groupipa',
      key: 'groupipa',
      render: (_value) => _value ? <TagsGroup color="green" label={[_value]} /> : null
    },
    {
      title: 'Ações',
      dataIndex: 'username',
      key: 'actions',
      render: (_value, _record) => <Link to={`/admin/groups/edit/${_record.policyid}`}><Button icon={<EditFilled />} /></Link>
    },
  ];

  const getData = async () => {
    const response = await apiClient.getAllPolicies()
    setData(response)
  }

  const filteredData = () => {
    if (!filter) return data;

    return data?.filter(item => {
      console.log(item.members, item.members?.includes(filter))
      return item.name.toLowerCase().includes(filter.toLowerCase())
        || item.members?.some(member => member.includes(filter))
    })
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <TitleButton
        title="Grupos de Políticas"
        button={{
          label: "Novo Grupo de Políticas",
          to: "/admin/groups/new"
        }}
      />
      {
        data
          ? <>
            <FilterInput filter={filter} setFilter={setFilter} />
            <Table dataSource={filteredData()} columns={columns} pagination={{ pageSize: 25 }} />
          </>
          : <Skeleton />
      }
    </>
  )
}
