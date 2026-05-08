'use client';

import { routes } from '@/lib/routes';
import { Button, Checkbox, Form, Input, Space, Typography } from 'antd';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-copy">
        <Space direction="vertical" size={28}>
          <Space>
            <Sparkles size={22} />
            <Typography.Text style={{ color: '#fff' }} strong>
              xtest-agent-web
            </Typography.Text>
          </Space>
          <div>
            <Typography.Title style={{ color: '#fff' }} level={1}>
              Enterprise agent workspace
            </Typography.Title>
            <Typography.Paragraph style={{ color: 'rgba(255,255,255,0.78)', maxWidth: 560 }}>
              Manage AI conversations, operational workflows and model settings from one internal
              console.
            </Typography.Paragraph>
          </div>
        </Space>
        <Space>
          <ShieldCheck size={18} />
          <Typography.Text style={{ color: 'rgba(255,255,255,0.78)' }}>
            SSO-ready access layer
          </Typography.Text>
        </Space>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <Typography.Title level={2}>Sign in</Typography.Title>
          <Typography.Paragraph type="secondary">
            Use your workspace account to continue.
          </Typography.Paragraph>

          <Form layout="vertical" size="large">
            <Form.Item label="Email">
              <Input placeholder="name@company.com" />
            </Form.Item>
            <Form.Item label="Password">
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Checkbox defaultChecked>Keep me signed in</Checkbox>
            </Form.Item>
            <Link href={routes.chat}>
              <Button block icon={<ArrowRight size={16} />} type="primary">
                Continue
              </Button>
            </Link>
          </Form>
        </div>
      </section>
    </main>
  );
}
