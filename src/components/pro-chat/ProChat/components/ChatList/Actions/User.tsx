import ActionIconGroup from '@/components/pro-chat/ActionIconGroup';
import { RenderAction } from '@/components/pro-chat/ChatList';
import { useChatListActionsBar } from '@/components/pro-chat/hooks/useChatListActionsBar';
import useCustomChatListAction from '@/components/pro-chat/hooks/useCustomChatListAction';
import { memo } from 'react';

export const UserActionsBar: RenderAction = memo(({ text, onActionClick, actionsProps }) => {
  const { regenerate, edit, copy, divider, del } = useChatListActionsBar(text);
  const { dropdownMenu, items } = useCustomChatListAction({
    dropdownMenu: [
      edit,
      copy,
      regenerate,
      // divider,
      // TODO: need a translate
      divider,
      del,
    ],
    items: [regenerate, edit],
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
