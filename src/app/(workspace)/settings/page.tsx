'use client';

import { Button, Divider, Form, Input, Select, Switch, Typography } from 'antd';

export default function SettingsPage() {
  return (
    <section className="enterprise-page">
      <div>
        <Typography.Text type="secondary">Administration</Typography.Text>
        <Typography.Title level={1}>Settings</Typography.Title>
      </div>

      <div className="settings-card">
        <Form layout="vertical">
          <Typography.Title level={4}>Workspace profile</Typography.Title>
          <Form.Item label="Workspace name">
            <Input defaultValue="XTest Agent Web" />
          </Form.Item>
          <Form.Item label="Default model">
            <Select
              defaultValue="qwen-turbo"
              options={[
                { label: 'Qwen Turbo', value: 'qwen-turbo' },
                { label: 'Qwen Plus', value: 'qwen-plus' },
                { label: 'Qwen Max', value: 'qwen-max' },
              ]}
            />
          </Form.Item>

          <Divider />

          <Typography.Title level={4}>Runtime controls</Typography.Title>
          <Form.Item label="Streaming responses">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item label="Audit logging">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item label="System prompt">
            <Input.TextArea
              autoSize={{ minRows: 4, maxRows: 8 }}
              defaultValue="You are an enterprise assistant for internal productivity workflows."
            />
          </Form.Item>

          <Button type="primary">Save settings</Button>
        </Form>
      </div>
    </section>
  );
}
