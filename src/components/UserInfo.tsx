import { Avatar, Menu, MenuProps } from "antd";
import useAuth from "../hooks/useAuth";
import { InfoCircleFilled, LogoutOutlined } from "@ant-design/icons";
import { useState } from "react";
import About from "./About";

interface Props {
}

type MenuItem = Required<MenuProps>['items'][number];



export default function UserInfo({ }: Props) {
    const { firstLetters, userName, userEmail, logout } = useAuth()
    const [showAbout, setShowAbout] = useState<boolean>(false);

    const menuItems: MenuItem[] = [
        {
            key: 'about',
            icon: <InfoCircleFilled />,
            label: 'Sobre',
            onClick: () => setShowAbout(true)
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: "Sair",
            onClick: () => logout()
        }
    ]

    return (
        <>
            <Menu
                style={{ background: "transparent" }}
                theme="dark"
                mode="vertical"
                items={menuItems}
                selectable={false}
            />
            <About isOpen={showAbout} setIsOpen={setShowAbout} />
            <div className="m-4">
                <div className="text-white flex gap-2 items-center">
                    <div>
                        <Avatar size="large">{firstLetters()}</Avatar>
                    </div>
                    <div className="text-sm opacity-70 flex-1">
                        <div className="w-full truncate">{userName}</div>
                        <div className="w-full truncate">{userEmail}</div>
                    </div>
                </div>
                <div className="text-center text-sm text-sky-700 mt-4">
                    {import.meta.env.VITE_APP_NAME} v{import.meta.env.VITE_APP_VERSION}
                </div>
            </div>
        </>

    );
}
