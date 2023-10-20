import { template } from 'lodash-es';
import { StateCreator } from 'zustand/vanilla';

import { LOADING_FLAT } from '@/ProChat/const/message';
import { fetchChatModel } from '@/ProChat/services/chatModel';
import { SessionStore } from '@/ProChat/store';
import { fetchSSE } from '@/ProChat/utils/fetch';
import { isFunctionMessage } from '@/ProChat/utils/message';
import { setNamespace } from '@/ProChat/utils/storeDebug';
import { nanoid } from '@/ProChat/utils/uuid';
import { ChatMessage } from '@/types/chatMessage';

import { agentSelectors } from '../agentConfig/selectors';
import { sessionSelectors } from '../session/selectors';
import { MessageDispatch, messagesReducer } from './reducers/message';
import { chatSelectors } from './selectors';
import { getSlicedMessagesWithConfig } from './utils';

const t = setNamespace('chat/message');

/**
 * 聊天操作
 */
export interface ChatAction {
  /**
   * 清除消息
   */
  clearMessage: () => void;
  /**
   * 删除消息
   * @param id - 消息 ID
   */
  deleteMessage: (id: string) => void;
  /**
   * 分发消息
   * @param payload - 消息分发参数
   */
  dispatchMessage: (payload: MessageDispatch) => void;
  /**
   * 生成消息
   * @param messages - 聊天消息数组
   * @param options - 获取 SSE 选项
   */
  generateMessage: (
    messages: ChatMessage[],
    assistantMessageId: string,
  ) => Promise<{ isFunctionCall: boolean }>;
  /**
   * 实际获取 AI 响应
   *
   * @param messages - 聊天消息数组
   * @param parentId - 父消息 ID，可选
   */
  realFetchAIResponse: (messages: ChatMessage[], parentId: string) => Promise<void>;

  /**
   * 重新发送消息
   * @param id - 消息 ID
   */
  resendMessage: (id: string) => Promise<void>;
  /**
   * 发送消息
   * @param text - 消息文本
   */
  sendMessage: (text: string) => Promise<void>;
  stopGenerateMessage: () => void;

  toggleChatLoading: (
    loading: boolean,
    id?: string,
    action?: string,
  ) => AbortController | undefined;
}

export const createChatSlice: StateCreator<
  SessionStore,
  [['zustand/devtools', never]],
  [],
  ChatAction
> = (set, get) => ({
  clearMessage: () => {
    const { dispatchMessage, activeTopicId } = get();

    dispatchMessage({ topicId: activeTopicId, type: 'resetMessages' });

    //   TODO: need a topic callback
  },

  deleteMessage: (id) => {
    get().dispatchMessage({ id, type: 'deleteMessage' });
  },

  dispatchMessage: (payload) => {
    const { activeId } = get();
    const session = sessionSelectors.currentSession(get());
    if (!activeId || !session) return;

    const chats = messagesReducer(session.chats, payload);

    get().dispatchSession({ chats, id: activeId, type: 'updateSessionChat' });
  },
  generateMessage: async (messages, assistantId) => {
    const { dispatchMessage, toggleChatLoading } = get();

    const abortController = toggleChatLoading(
      true,
      assistantId,
      t('generateMessage(start)', { assistantId, messages }) as string,
    );

    const config = agentSelectors.currentAgentConfig(get());

    const compiler = template(config.inputTemplate, { interpolate: /{{([\S\s]+?)}}/g });

    // ========================== //
    //   对 messages 做统一预处理    //
    // ========================== //

    // 1. 按参数设定截断长度
    const slicedMessages = getSlicedMessagesWithConfig(messages, config);

    // 2. 替换 inputMessage 模板
    const postMessages = !config.inputTemplate
      ? slicedMessages
      : slicedMessages.map((m) => {
          if (m.role === 'user') {
            try {
              return { ...m, content: compiler({ text: m.content }) };
            } catch (error) {
              console.error(error);

              return m;
            }
          }
          return m;
        });

    // 3. 添加 systemRole
    if (config.systemRole) {
      postMessages.unshift({ content: config.systemRole, role: 'system' } as ChatMessage);
    }

    const fetcher = () =>
      fetchChatModel(
        {
          messages: postMessages,
          model: config.model,
          ...config.params,
          plugins: config.plugins,
        },
        { signal: abortController?.signal },
      );

    let output = '';
    let isFunctionCall = false;

    await fetchSSE(fetcher, {
      onErrorHandle: (error) => {
        dispatchMessage({ id: assistantId, key: 'error', type: 'updateMessage', value: error });
      },
      onMessageHandle: (text) => {
        output += text;

        dispatchMessage({
          id: assistantId,
          key: 'content',
          type: 'updateMessage',
          value: output,
        });

        // TODO: need a function call judge callback
        // 如果是 function call
        if (isFunctionMessage(output)) {
          isFunctionCall = true;
        }
      },
    });

    toggleChatLoading(false, undefined, t('generateMessage(end)') as string);

    return { isFunctionCall };
  },

  realFetchAIResponse: async (messages, userMessageId) => {
    const { dispatchMessage, generateMessage, activeTopicId } = get();

    const { model } = agentSelectors.currentAgentConfig(get());

    // 添加一个空的信息用于放置 ai 响应，注意顺序不能反
    // 因为如果顺序反了，messages 中将包含新增的 ai message
    const mid = nanoid();

    dispatchMessage({
      id: mid,
      message: LOADING_FLAT,
      parentId: userMessageId,
      role: 'assistant',
      type: 'addMessage',
    });

    // 如果有 activeTopicId，则添加 topicId
    if (activeTopicId) {
      dispatchMessage({ id: mid, key: 'topicId', type: 'updateMessage', value: activeTopicId });
    }

    // 为模型添加 fromModel 的额外信息
    dispatchMessage({ id: mid, key: 'fromModel', type: 'updateMessageExtra', value: model });

    // 生成 ai message
    await generateMessage(messages, mid);

    // todo: need fc callback
  },

  resendMessage: async (messageId) => {
    const session = sessionSelectors.currentSession(get());

    if (!session) return;

    // 1. 构造所有相关的历史记录
    const chats = chatSelectors.currentChats(get());

    const currentIndex = chats.findIndex((c) => c.id === messageId);
    if (currentIndex < 0) return;

    const currentMessage = chats[currentIndex];

    let contextMessages: ChatMessage[] = [];

    switch (currentMessage.role) {
      case 'function':
      case 'user': {
        contextMessages = chats.slice(0, currentIndex + 1);
        break;
      }
      case 'assistant': {
        // 消息是 AI 发出的因此需要找到它的 user 消息
        const userId = currentMessage.parentId;
        const userIndex = chats.findIndex((c) => c.id === userId);
        // 如果消息没有 parentId，那么同 user/function 模式
        contextMessages = chats.slice(0, userIndex < 0 ? currentIndex + 1 : userIndex + 1);
        break;
      }
    }

    if (contextMessages.length <= 0) return;

    const { realFetchAIResponse } = get();

    const latestMsg = contextMessages.filter((s) => s.role === 'user').at(-1);

    if (!latestMsg) return;

    await realFetchAIResponse(contextMessages, latestMsg.id);
  },

  sendMessage: async (message) => {
    const { dispatchMessage, realFetchAIResponse, activeTopicId } = get();
    const session = sessionSelectors.currentSession(get());
    if (!session || !message) return;

    const userId = nanoid();
    dispatchMessage({ id: userId, message, role: 'user', type: 'addMessage' });

    // if there is activeTopicId，then add topicId to message
    if (activeTopicId) {
      dispatchMessage({ id: userId, key: 'topicId', type: 'updateMessage', value: activeTopicId });
    }

    // Get the current messages to generate AI response
    const messages = chatSelectors.currentChats(get());

    await realFetchAIResponse(messages, userId);

    //   TODO: need a topic callback
  },

  stopGenerateMessage: () => {
    const { abortController, toggleChatLoading } = get();
    if (!abortController) return;

    abortController.abort();

    toggleChatLoading(false);
  },
  toggleChatLoading: (loading, id, action) => {
    if (loading) {
      const abortController = new AbortController();
      set({ abortController, chatLoadingId: id }, false, action);
      return abortController;
    } else {
      set({ abortController: undefined, chatLoadingId: undefined }, false, action);
    }
  },
});