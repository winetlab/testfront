import { Button, Tag } from "antd";
import { useState } from "react";

interface Props {
    label: string[]
    limit?: number
    color?: string
}

export default function TagsGroup({ label, limit = 5, color }: Props) {
    const [showAll, setShowAll] = useState<boolean>(false);

    const toggleShowAll = () => setShowAll(!showAll);

    return (
        <>
            {label?.slice(0, showAll ? 9999 : limit).map((item: string) => <div><Tag color={color} key={item}>{item}</Tag></div>)}
            {
                label?.length > limit
                    ? <Button
                        className="mt-2"
                        onClick={() => toggleShowAll()}
                        size="small"
                        type="link"
                    >
                        {showAll ? "Mostrar menos" : "Mostrar mais"}
                    </Button>
                    : null
            }
        </>
    );
}
