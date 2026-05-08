'use client';

import { Button, Progress, Space, Table, Tag, Typography } from 'antd';
import { ArrowUpRight, Bot, Clock3, MessagesSquare, Workflow } from 'lucide-react';
import Link from 'next/link';

const metrics = [
  { icon: Bot, label: 'Active agents', tone: '#1677ff', value: '12' },
  { icon: MessagesSquare, label: 'Conversations', tone: '#12b76a', value: '3,284' },
  { icon: Workflow, label: 'Workflows', tone: '#7a5af8', value: '48' },
  { icon: Clock3, label: 'Avg. response', tone: '#f79009', value: '1.8s' },
];

const recentRuns = [
  { key: '1', name: 'Qwen support triage', owner: 'Ops', status: 'Healthy', updatedAt: '09:42' },
  { key: '2', name: 'Knowledge sync', owner: 'R&D', status: 'Running', updatedAt: '09:18' },
  { key: '3', name: 'Release assistant', owner: 'Product', status: 'Review', updatedAt: 'Yesterday' },
];

export default function HomePage() {
  return (
    <section className="enterprise-page">
      <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
        <div>
          <Typography.Text type="secondary">Overview</Typography.Text>
          <Typography.Title level={1}>Agent operations</Typography.Title>
        </div>
        <Link href="/chat">
          <Button icon={<ArrowUpRight size={16} />} type="primary">
            Open chat
          </Button>
        </Link>
      </Space>

      <div className="metric-grid">
        {metrics.map((metric) => (
          <div className="metric-card" key={metric.label}>
            <Space>
              <metric.icon color={metric.tone} size={18} />
              <Typography.Text type="secondary">{metric.label}</Typography.Text>
            </Space>
            <span className="metric-value">{metric.value}</span>
          </div>
        ))}
      </div>

      <div className="work-grid">
        <div className="work-card">
          <Typography.Title level={4}>Recent agent runs</Typography.Title>
          <Table
            dataSource={recentRuns}
            pagination={false}
            columns={[
              { dataIndex: 'name', title: 'Name' },
              { dataIndex: 'owner', title: 'Owner' },
              {
                dataIndex: 'status',
                title: 'Status',
                render: (value) => <Tag color={value === 'Healthy' ? 'green' : 'blue'}>{value}</Tag>,
              },
              { dataIndex: 'updatedAt', title: 'Updated' },
            ]}
          />
        </div>
        <div className="work-card">
          <Typography.Title level={4}>Capacity</Typography.Title>
          <Space direction="vertical" size={18} style={{ width: '100%' }}>
            <div>
              <Typography.Text>Token budget</Typography.Text>
              <Progress percent={64} strokeColor="#1677ff" />
            </div>
            <div>
              <Typography.Text>Automation queue</Typography.Text>
              <Progress percent={38} strokeColor="#12b76a" />
            </div>
            <div>
              <Typography.Text>Review workload</Typography.Text>
              <Progress percent={72} strokeColor="#f79009" />
            </div>
          </Space>
        </div>
      </div>
    </section>
  );
}
