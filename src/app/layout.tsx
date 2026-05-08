import { AntdRegistry } from '@ant-design/nextjs-registry';
import 'antd/dist/reset.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'xtest-agent-web',
  description: 'Enterprise agent workspace built with Next.js, TypeScript, antd and Emotion.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
