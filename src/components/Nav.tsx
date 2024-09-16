import { AuditOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import { useNavigate } from "react-router-dom";

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: 'users',
        icon: <UserOutlined />,
        label: 'Usuários',
        children: [
            {
                key: 'users/list',
                icon: <UserOutlined />,
                label: 'Listar Usuários',
            },
            {
                key: 'users/new',
                icon: <UserAddOutlined />,
                label: 'Cadastrar Usuário',
            }
        ]
    },
    {
        key: 'groups',
        icon: <AuditOutlined />,
        label: 'Grupo de Políticas',
        children: [
            {
                key: 'groups/list',
                icon: <AuditOutlined />,
                label: 'Listar Grupos de Políticas',
            },
            {
                key: 'groups/new',
                icon: <AuditOutlined />,
                label: 'Cadastrar Grupo de Políticas',
            }
        ]
    }
]

export default function Nav() {
    const navigate = useNavigate();

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click', e);
        navigate(`/admin/${e.key}`)
    };

    return (
        <Menu
            style={{ background: "transparent" }}
            theme="dark"
            onClick={onClick}
            mode="vertical"
            items={items}
        />
    );
}
