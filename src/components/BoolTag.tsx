import { Tag } from "antd";

interface Props {
    tagValue: boolean
}

export default function BoolTag({ tagValue }: Props) {
    return (
        <>
            {
                tagValue
                    ? <Tag color='green'>Sim</Tag>
                    : <Tag color='red'>Não</Tag>
            }
        </>
    );
}
