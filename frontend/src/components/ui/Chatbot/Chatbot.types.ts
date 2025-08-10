/**
 * Chatbot组件类型定义
 */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  language: "zh" | "en";
  isActive: boolean;
}

export interface ChatbotProps {
  /** 是否自动展开聊天窗口 */
  autoExpand?: boolean;
  /** 默认语言 */
  defaultLanguage?: "zh" | "en";
  /** 主题色调 */
  theme?: "light" | "dark";
  /** 是否显示发送按钮 */
  showSendButton?: boolean;
  /** 最大消息历史数量 */
  maxMessageHistory?: number;
  /** 是否启用阅后即焚模式 */
  ephemeralMode?: boolean;
  /** 最大对话轮数 */
  maxTurns?: number;
  /** 标题移动回调 */
  onTitleMove?: (shouldMove: boolean) => void;
}

export interface ChatbotUIState {
  isExpanded: boolean;
  isLoading: boolean;
  currentMessage: string;
  session: ChatSession | null;
}

export interface ChatRequest {
  message: string;
  session_id?: string;
  language?: "zh" | "en";
}

export interface ChatResponse {
  response: string;
  session_id: string;
  language: string;
  token_usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  timestamp: string;
}

export interface ApiError {
  error: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}
