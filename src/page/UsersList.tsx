import { Button, Skeleton, Table, TableProps } from "antd";
import TitleButton from "../components/TitleButton";
import { useEffect, useState } from "react";
import { User } from "../models/api.model";
import ApiClient from "../services/api.service";
import UserStatusTag from "../components/UserStatusTag";
import { EditFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import FilterInput from "../components/FilterInput";

const apiClient = new ApiClient();

export default function UsersList() {
  const [data, setData] = useState<User[]>();
  const [filter, setFilter] = useState<string>("");

  const columns: TableProps['columns'] = [
    {
      title: 'Nome',
      dataIndex: 'fullname',
      key: 'fullname',
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Status',
      dataIndex: 'validation',
      key: 'validation',
      render: (_value, _record) => <UserStatusTag label={_value} username={_record.username} />
    },
    {
      title: 'Ações',
      dataIndex: 'username',
      key: 'actions',
      render: (_value, _record) => <Link to={`/admin/users/edit/${_record.username}`} ><Button icon={<EditFilled />} /></Link>
    },
  ];

  const getData = async () => {
    const response = await apiClient.getAllUsers()
    setData(response)
  }

  const filteredData = () => {
    if (!filter) return data;

    return data?.filter(item => {
      return item.fullname.toLowerCase().includes(filter.toLowerCase())
        || item.username.toLowerCase().includes(filter.toLowerCase())
        || item.email.toLowerCase().includes(filter.toLowerCase())
        || item.validation.toLowerCase().includes(filter.toLowerCase())
    })
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <TitleButton
        title="Usuários"
        button={{
          label: "Novo usuário",
          to: "/admin/users/new"
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
