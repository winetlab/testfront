import { Form, Input } from "antd";

interface Props {
  lowercase?: boolean
  disableUsername?: boolean
}

export default function UserForm({ lowercase, disableUsername }: Props) {

  const fixName = (label: string) => lowercase ? label.toLowerCase() : label;

  return (<>
    <Form.Item name={fixName("firstName")} label="Primeiro Nome" rules={[{ required: true }]}>
      <Input />
    </Form.Item>

    <Form.Item name={fixName("lastName")} label="Sobrenome" rules={[{ required: true }]}>
      <Input />
    </Form.Item>

    <Form.Item name="email" label="E-mail" rules={[{ required: true }]}>
      <Input />
    </Form.Item>

    <Form.Item name="username" label="Username" rules={[{ required: true }]}>
      <Input disabled={disableUsername} />
    </Form.Item>
  </>
  )
}
