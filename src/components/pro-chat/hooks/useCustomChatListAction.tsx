import { ActionIconGroupItems } from '@/components/pro-chat/ActionIconGroup';
import { ActionsProps } from '@/components/pro-chat/ChatList/ActionsBar';

interface CustomChatListActionProps {
  dropdownMenu: Array<ActionIconGroupItems>;
  items: Array<ActionIconGroupItems>;
  actionsProps?: ActionsProps;
}

const useCustomChatListAction = ({
  dropdownMenu,
  items,
  actionsProps,
}: CustomChatListActionProps) => {
  if (!actionsProps) {
    // 没有自定义内容的时候使用默认
    return {
      dropdownMenu,
      items,
    };
  }

  return {
    dropdownMenu:
      actionsProps?.moreActions
        ?.map((item) => dropdownMenu.find((i) => i.key === item))
        .filter((v) => !!v) || [],
    items:
      actionsProps?.actions
        ?.map((item) => items.find((i) => i.key === item))
        .filter((v) => !!v && v.key !== 'divider') || [],
  };
};

export default useCustomChatListAction;
