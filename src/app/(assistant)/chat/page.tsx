'use client';

import { ProChat } from '@/components/pro-chat';
import { Avatar, Button, Input, Select, Space, Typography } from 'antd';
import { Archive, Edit3, Menu, PanelLeft, Search, Settings, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const threads = [
  'Agent handoff policy',
  'Qwen API response mapping',
  'Weekly support summary',
  'Release checklist assistant',
  'Settings schema review',
];

const prompts = [
  ['Draft a workflow', 'Build an approval flow for support escalations'],
  ['Analyze a release', 'Summarize risk areas from deployment notes'],
  ['Write a prompt', 'Create a reusable system prompt for QA triage'],
  ['Plan automation', 'Design a nightly report for agent performance'],
];

function HelloMessage() {
  return (
    <div className="chat-hello">
      <Typography.Title level={1}>How can I help today?</Typography.Title>
      <div className="prompt-grid">
        {prompts.map(([title, description]) => (
          <div className="prompt-card" key={title}>
            <strong>{title}</strong>
            <Typography.Text type="secondary">{description}</Typography.Text>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <main className="chat-workspace">
      <aside className="chat-sidebar">
        <div className="chat-sidebar-header">
          <Button icon={<PanelLeft size={17} />} type="text" />
          <Button icon={<Edit3 size={17} />} type="text">
            New chat
          </Button>
        </div>

        <div className="chat-search">
          <Input prefix={<Search size={16} />} placeholder="Search chats" />
        </div>

        <div className="chat-thread-list">
          <div className="chat-thread-group">
            <span className="chat-thread-group-title">Today</span>
            {threads.slice(0, 3).map((thread, index) => (
              <a
                className={index === 0 ? 'chat-thread chat-thread-active' : 'chat-thread'}
                href="#"
                key={thread}
              >
                {thread}
              </a>
            ))}
          </div>
          <div className="chat-thread-group">
            <span className="chat-thread-group-title">Previous 7 days</span>
            {threads.slice(3).map((thread) => (
              <a className="chat-thread" href="#" key={thread}>
                {thread}
              </a>
            ))}
          </div>
        </div>

        <div className="chat-sidebar-footer">
          <Avatar style={{ background: '#111827' }}>XA</Avatar>
          <div style={{ minWidth: 0, flex: 1 }}>
            <Typography.Text strong>xtest-agent-web</Typography.Text>
            <br />
            <Typography.Text type="secondary">Enterprise plan</Typography.Text>
          </div>
          <Link href="/settings">
            <Button icon={<Settings size={16} />} type="text" />
          </Link>
        </div>
      </aside>

      <section className="chat-main">
        <header className="chat-topbar">
          <Space>
            <Button className="chat-mobile-menu" icon={<Menu size={17} />} type="text" />
            <Select
              bordered={false}
              defaultValue="xtest-agent"
              options={[
                { label: 'XTest Agent', value: 'xtest-agent' },
                { label: 'Qwen Turbo', value: 'qwen-turbo' },
                { label: 'Qwen Plus', value: 'qwen-plus' },
              ]}
              popupMatchSelectWidth={false}
            />
          </Space>
          <Space>
            <Link href="/home">
              <Button icon={<Archive size={16} />} type="text">
                Home
              </Button>
            </Link>
            <Button icon={<Sparkles size={16} />} type="primary">
              Share
            </Button>
          </Space>
        </header>

        <div className="chat-stage">
          {mounted && (
            <ProChat
              className="chat-prochat"
              helloMessage={<HelloMessage />}
              showTitle={false}
              style={{
                height: '100%',
                width: '100%',
              }}
              request={async (messages) => {
                const response = await fetch('/api/qwen', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ messages }),
                });
                const data = await response.json();
                return new Response(data.output?.text ?? data.message ?? '');
              }}
            />
          )}
        </div>
      </section>
    </main>
  );
}
