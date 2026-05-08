import { EnterpriseShell } from '@/layouts/enterprise-shell';
import type { ReactNode } from 'react';

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <EnterpriseShell>{children}</EnterpriseShell>;
}
