import { Button, Modal } from 'antd';
import React from 'react';
import DccLogo from '../assets/DCC_logo.svg';

interface Props {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function About({ isOpen, setIsOpen }: Props) {

    const handleOk = () => {
        setIsOpen(false);
    }

    return (
        <Modal
            title="Desenvolvido por"
            open={isOpen}
            onCancel={handleOk}
            footer={[
                <Button key="back" onClick={handleOk}>
                    Fechar
                </Button>
            ]}
        >
            <img src={DccLogo} />
        </Modal>
    );
}

export default About;
