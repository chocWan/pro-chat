import { ChatListProps } from '@/components/pro-chat/ChatList';

import { AssistantMessageExtra } from './Assistant';
import { UserMessageExtra } from './User';

export const renderMessagesExtra: ChatListProps['renderMessagesExtra'] = {
  assistant: AssistantMessageExtra,
  user: UserMessageExtra,
};
