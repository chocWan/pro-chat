import ActionIconGroup from '@/components/pro-chat/ActionIconGroup';
import { RenderAction } from '@/components/pro-chat/ChatList';
import { useChatListActionsBar } from '@/components/pro-chat/hooks/useChatListActionsBar';
import useCustomChatListAction from '@/components/pro-chat/hooks/useCustomChatListAction';
import { memo } from 'react';

export const DefaultActionsBar: RenderAction = memo(({ text, onActionClick, actionsProps }) => {
  const { del } = useChatListActionsBar(text);
  const { dropdownMenu, items } = useCustomChatListAction({
    dropdownMenu: [del],
    items: [],
    actionsProps,
  });
  return (
    <ActionIconGroup
      dropdownMenu={dropdownMenu}
      items={items}
      onActionClick={onActionClick}
      type="ghost"
    />
  );
});
