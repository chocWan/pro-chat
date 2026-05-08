import ActionIconGroup from '@/components/pro-chat/ActionIconGroup';
import { RenderAction } from '@/components/pro-chat/ChatList';
import { useChatListActionsBar } from '@/components/pro-chat/hooks/useChatListActionsBar';
import useCustomChatListAction from '@/components/pro-chat/hooks/useCustomChatListAction';
import { memo } from 'react';

export const FunctionActionsBar: RenderAction = memo(({ text, onActionClick, actionsProps }) => {
  const { regenerate, divider, del } = useChatListActionsBar(text);
  const { dropdownMenu, items } = useCustomChatListAction({
    dropdownMenu: [regenerate, divider, del],
    items: [regenerate],
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
