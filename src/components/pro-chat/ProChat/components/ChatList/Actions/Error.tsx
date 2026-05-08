import ActionIconGroup from '@/components/pro-chat/ActionIconGroup';
import { ActionsBarProps } from '@/components/pro-chat/ChatList/ActionsBar';
import { useChatListActionsBar } from '@/components/pro-chat/hooks/useChatListActionsBar';
import useCustomChatListAction from '@/components/pro-chat/hooks/useCustomChatListAction';
import { memo } from 'react';

export const ErrorActionsBar = memo<ActionsBarProps>(({ text, onActionClick, actionsProps }) => {
  const { regenerate, del } = useChatListActionsBar(text);
  const { items } = useCustomChatListAction({
    dropdownMenu: [],
    items: [regenerate, del],
    actionsProps,
  });

  return <ActionIconGroup items={items} onActionClick={onActionClick} type="ghost" />;
});
