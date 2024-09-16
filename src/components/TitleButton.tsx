import { Button, Typography } from "antd";
import { Link } from "react-router-dom";

interface Props {
    title: string,
    button?: { label: string, to: string }
}

export default function TitleButton({ title, button }: Props) {

    return (
        <div className="flex justify-around">
            <div className="flex-1">
                <Typography.Title level={2}>{title}</Typography.Title>
            </div>
            {button && <div className="flex-1 text-right">
                <Link to={button.to}><Button size="large" type="primary">{button.label}</Button></Link>
            </div>}
        </div>
    );
}
