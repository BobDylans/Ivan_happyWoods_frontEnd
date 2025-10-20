import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================================
// Types
// ============================================================================

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AIState {
  // 当前对话
  currentConversationId: string | null;
  conversations: Record<string, Conversation>;
  
  // UI 状态
  isGenerating: boolean;
  isSidebarOpen: boolean;
  
  // Actions - 对话管理
  createConversation: () => string;
  deleteConversation: (id: string) => void;
  selectConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
  
  // Actions - 消息管理
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (messageId: string) => void;
  clearCurrentConversation: () => void;
  
  // Actions - UI
  setIsGenerating: (isGenerating: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Getters
  getCurrentConversation: () => Conversation | null;
  getConversationList: () => Conversation[];
}

// ============================================================================
// Store
// ============================================================================

/**
 * AI 对话状态管理
 * 
 * 使用 Zustand + LocalStorage 持久化
 * 
 * 特性：
 * - 多对话管理
 * - 消息 CRUD
 * - 自动持久化
 * - UI 状态管理
 * 
 * @example
 * ```tsx
 * const { addMessage, getCurrentConversation } = useAIStore();
 * 
 * addMessage({
 *   role: 'user',
 *   content: 'Hello!',
 * });
 * ```
 */
export const useAIStore = create<AIState>()(
  persist(
    (set, get) => ({
      // ========================================================================
      // Initial State
      // ========================================================================
      
      currentConversationId: null,
      conversations: {},
      isGenerating: false,
      isSidebarOpen: true,
      
      // ========================================================================
      // Conversation Actions
      // ========================================================================
      
      createConversation: () => {
        const id = generateId();
        const now = new Date();
        
        const conversation: Conversation = {
          id,
          title: '新对话',
          messages: [],
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => ({
          conversations: {
            ...state.conversations,
            [id]: conversation,
          },
          currentConversationId: id,
        }));
        
        return id;
      },
      
      deleteConversation: (id: string) => {
        set((state) => {
          const { [id]: deleted, ...rest } = state.conversations;
          const conversationList = Object.values(rest);
          
          return {
            conversations: rest,
            currentConversationId:
              state.currentConversationId === id
                ? conversationList[0]?.id || null
                : state.currentConversationId,
          };
        });
      },
      
      selectConversation: (id: string) => {
        set({ currentConversationId: id });
      },
      
      updateConversationTitle: (id: string, title: string) => {
        set((state) => ({
          conversations: {
            ...state.conversations,
            [id]: {
              ...state.conversations[id],
              title,
              updatedAt: new Date(),
            },
          },
        }));
      },
      
      // ========================================================================
      // Message Actions
      // ========================================================================
      
      addMessage: (message) => {
        const { currentConversationId, conversations } = get();
        
        // 如果没有当前对话，创建一个
        let conversationId = currentConversationId;
        if (!conversationId) {
          conversationId = get().createConversation();
        }
        
        const conversation = conversations[conversationId];
        if (!conversation) return;
        
        const newMessage: Message = {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        };
        
        const updatedMessages = [...conversation.messages, newMessage];
        
        // 自动生成标题（使用第一条用户消息）
        let title = conversation.title;
        if (
          title === '新对话' &&
          message.role === 'user' &&
          updatedMessages.length === 1
        ) {
          title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
        }
        
        set((state) => ({
          conversations: {
            ...state.conversations,
            [conversationId!]: {
              ...conversation,
              title,
              messages: updatedMessages,
              updatedAt: new Date(),
            },
          },
        }));
      },
      
      updateMessage: (messageId: string, updates: Partial<Message>) => {
        const { currentConversationId, conversations } = get();
        if (!currentConversationId) return;
        
        const conversation = conversations[currentConversationId];
        if (!conversation) return;
        
        const updatedMessages = conversation.messages.map((msg) =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        );
        
        set((state) => ({
          conversations: {
            ...state.conversations,
            [currentConversationId]: {
              ...conversation,
              messages: updatedMessages,
              updatedAt: new Date(),
            },
          },
        }));
      },
      
      deleteMessage: (messageId: string) => {
        const { currentConversationId, conversations } = get();
        if (!currentConversationId) return;
        
        const conversation = conversations[currentConversationId];
        if (!conversation) return;
        
        const updatedMessages = conversation.messages.filter(
          (msg) => msg.id !== messageId
        );
        
        set((state) => ({
          conversations: {
            ...state.conversations,
            [currentConversationId]: {
              ...conversation,
              messages: updatedMessages,
              updatedAt: new Date(),
            },
          },
        }));
      },
      
      clearCurrentConversation: () => {
        const { currentConversationId, conversations } = get();
        if (!currentConversationId) return;
        
        const conversation = conversations[currentConversationId];
        if (!conversation) return;
        
        set((state) => ({
          conversations: {
            ...state.conversations,
            [currentConversationId]: {
              ...conversation,
              messages: [],
              updatedAt: new Date(),
            },
          },
        }));
      },
      
      // ========================================================================
      // UI Actions
      // ========================================================================
      
      setIsGenerating: (isGenerating: boolean) => {
        set({ isGenerating });
      },
      
      toggleSidebar: () => {
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
      },
      
      setSidebarOpen: (open: boolean) => {
        set({ isSidebarOpen: open });
      },
      
      // ========================================================================
      // Getters
      // ========================================================================
      
      getCurrentConversation: () => {
        const { currentConversationId, conversations } = get();
        if (!currentConversationId) return null;
        return conversations[currentConversationId] || null;
      },
      
      getConversationList: () => {
        const { conversations } = get();
        return Object.values(conversations).sort(
          (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
        );
      },
    }),
    {
      name: 'ai-chat-storage',
      // 自定义序列化（处理 Date 对象）
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
        isSidebarOpen: state.isSidebarOpen,
      }),
    }
  )
);

// ============================================================================
// Utilities
// ============================================================================

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 模拟 AI 回复（占位符）
 * 实际项目中替换为真实的 API 调用
 */
export async function simulateAIResponse(
  userMessage: string
): Promise<string> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // 示例回复
  const responses = [
    `关于"${userMessage.slice(0, 20)}"，我来为您解答...`,
    `这是一个很好的问题！让我详细说明一下...`,
    `根据您的问题"${userMessage.slice(0, 20)}"，我的理解是...`,
    `让我思考一下这个问题...`,
  ];
  
  return responses[Math.floor(Math.random() * responses.length)] + 
    '\n\n这是一个示例回复。在实际应用中，这里会调用真实的 AI API。\n\n' +
    '- 支持 **Markdown** 格式\n' +
    '- 支持`代码高亮`\n' +
    '- 支持列表和其他富文本';
}

