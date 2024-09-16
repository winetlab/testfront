import { Modal, Transfer, TransferProps } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { User } from '../models/api.model';
import ApiClient from '../services/api.service';
import { Context } from '../App';

interface Props {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    reloadData: () => void
    currentMembers: string[]
    policyId: number
}

function PolicyMembers({ isOpen, setIsOpen, currentMembers, policyId, reloadData }: Props) {
    const [loading, setLoading] = useState(false);
    const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>(currentMembers);
    const [selectedKeys, setSelectedKeys] = useState<TransferProps['targetKeys']>([]);
    const [users, setUsers] = useState<User[]>([])
    const { openNotification } = useContext(Context)
    const apiClient = new ApiClient();

    const handleCancel = () => {
        setIsOpen(false);
    }

    const handleOk = async () => {
        setLoading(true)
        const response = await apiClient.updateGroupMembers(policyId, targetKeys?.map(item => item.toString()) || [])
        openNotification("Membros editados com sucesso", response, "success")
        reloadData()
        setLoading(false)
        setIsOpen(false);
    }

    const getUsers = async () => {
        const data = await apiClient.getAllUsers()
        setUsers(data);
    }

    const translatedUsers = () => {
        return users?.map(item => ({ key: item.username, title: item.username }))
    }

    const onSelectChange: TransferProps['onSelectChange'] = (
        sourceSelectedKeys,
        targetSelectedKeys,
    ) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    const onChange: TransferProps['onChange'] = (nextTargetKeys) => {
        setTargetKeys(nextTargetKeys);
    };

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <Modal
            title="Gerenciar membros"
            open={isOpen}
            onCancel={handleCancel}
            onOk={handleOk}
            confirmLoading={loading}
        >
            <Transfer
                listStyle={{
                    width: "100%",
                    height: 350,
                }}
                dataSource={translatedUsers()}
                titles={['Disponíveis', 'Selecionados']}
                targetKeys={targetKeys}
                selectedKeys={selectedKeys}
                onSelectChange={onSelectChange}
                onChange={onChange}
                render={(item) => item.title}

            />
        </Modal>
    );
}

export default PolicyMembers;
