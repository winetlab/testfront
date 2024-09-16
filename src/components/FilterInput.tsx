import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";

interface Props {
    filter: string,
    setFilter: (value: string) => void
}

export default function FilterInput({ filter, setFilter }: Props) {

    return (
        <div className="p-4 bg-gray-100 grid grid-cols-4">
            <div></div>
            <div></div>
            <div></div>
            <Input 
            addonBefore={<SearchOutlined />} 
            placeholder="Filtrar"
            value={filter} 
            onChange={(ev) => setFilter(ev.target.value)} 
            />
        </div>
    );
}
