'use client';

import { appNavigation } from '@/config/navigation';
import { Avatar, Button, Layout, Menu, Space, Typography } from 'antd';
import { ChevronRight, LogOut, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const { Content, Sider } = Layout;

export function EnterpriseShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <Layout className="enterprise-shell">
      <Sider className="enterprise-sider" width={248}>
        <Link className="enterprise-brand" href="/home">
          <span className="enterprise-brand-mark">
            <Sparkles size={18} />
          </span>
          <span>
            <Typography.Text strong>xtest-agent-web</Typography.Text>
            <Typography.Text type="secondary">Agent Console</Typography.Text>
          </span>
        </Link>

        <Menu
          className="enterprise-menu"
          mode="inline"
          selectedKeys={[pathname]}
          items={appNavigation.map((item) => ({
            key: item.href,
            icon: <item.icon size={17} />,
            label: <Link href={item.href}>{item.label}</Link>,
          }))}
        />

        <div className="enterprise-user">
          <Space>
            <Avatar style={{ background: '#111827' }}>XA</Avatar>
            <span>
              <Typography.Text strong>Admin</Typography.Text>
              <Typography.Text type="secondary">Workspace Owner</Typography.Text>
            </span>
          </Space>
          <Button icon={<LogOut size={16} />} type="text" />
        </div>
      </Sider>

      <Layout>
        <header className="enterprise-header">
          <div>
            <Typography.Text type="secondary">Workspace</Typography.Text>
            <Typography.Title level={4}>XTest Agent Web</Typography.Title>
          </div>
          <Button icon={<ChevronRight size={16} />} type="primary">
            New workflow
          </Button>
        </header>
        <Content className="enterprise-content">{children}</Content>
      </Layout>
    </Layout>
  );
}
