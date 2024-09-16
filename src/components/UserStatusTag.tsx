import { Dropdown, MenuProps, Tag } from "antd";
import userStatus from "../constants/userStatus";
import { useContext, useState } from "react";
import ApiClient from "../services/api.service";
import { Context } from "../App";

interface Props {
    label: string
    username: string
}

export default function UserStatusTag({ label, username }: Props) {
    const [currentStatus, setCurrentStatus] = useState(label)
    const apiClient = new ApiClient()
    const { openNotification } = useContext(Context)

    const items: MenuProps['items'] = userStatus.map((item, index) => ({
        label: item,
        key: index,
        onClick: () => changeStatus(item)
    }))

    const changeStatus = async (newStatus: string) => {
        if (newStatus != currentStatus) {
            setCurrentStatus(newStatus);
            try {
                const response = await apiClient.updateUserStatus(username, newStatus)
                openNotification("Status atualizado", response, "success")
            } catch (e) {
                openNotification("Erro!", "Erro ao atualizar o status do usuário", "error")
            }
        }
    }

    const color = () => {
        switch (currentStatus) {
            case "novo":
                return "blue";
            case "validado":
                return "green";
            case "pendente":
                return "orange";
            default:
                return undefined;
        }
    }

    return (
        <Dropdown menu={{ items }} trigger={['click']}>
            <Tag className="cursor-pointer" color={color()}>{currentStatus}</Tag>
        </Dropdown>
    );
}
