"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Camera, Music, Film, PenTool, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useTheme } from "@/components/providers/ThemeProvider";
import { ChatbotProps } from "./Chatbot.types";

// 四个主题卡片的内容
const THEME_CARDS = [
  {
    id: "photography",
    title: "摄影",
    icon: Camera,
    description: "光影的艺术，记录生活中的美好瞬间",
  },
  {
    id: "music",
    title: "音乐",
    icon: Music,
    description: "旋律与情感的交融，音乐是心灵的语言",
  },
  {
    id: "movies",
    title: "电影",
    icon: Film,
    description: "光影叙事，探索人性与情感的深度",
  },
  {
    id: "writing",
    title: "技术写作",
    icon: PenTool,
    description: "用文字记录技术思考，分享经验与见解",
  },
];

const Chatbot: React.FC<ChatbotProps> = ({
  showSendButton = true,
  ephemeralMode = true,
  maxTurns = 3,
  onTitleMove,
}) => {
  const { effectiveTheme } = useTheme();

  // 临时简化版本 - 不使用AI SDK的useChat
  const [messages, setMessages] = useState<
    Array<{ id: string; role: string; content: string }>
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // 模拟AI响应
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `感谢你的问题："${userMessage.content}"。这是一个模拟回复，实际的AI集成将在后续完成。`,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const reload = useCallback(() => {
    setMessages([]);
    setInput("");
    setTurnCount(0);
  }, []);

  // 状态管理
  const [isFocused, setIsFocused] = useState(false); // 输入框是否获得焦点
  const [turnCount, setTurnCount] = useState(0);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 鼠标响应动画 refs
  const animationFrameRef = useRef<number | null>(null);
  const currentScaleRefs = useRef<number[]>([1, 1, 1, 1]); // 四个卡片的当前缩放值
  const targetScaleRefs = useRef<number[]>([1, 1, 1, 1]); // 四个卡片的目标缩放值

  // 输入框和按钮的动画refs
  const inputScaleRef = useRef<number>(1);
  const buttonScaleRef = useRef<number>(1);
  const targetInputScaleRef = useRef<number>(1);
  const targetButtonScaleRef = useRef<number>(1);
  const inputAnimationFrameRef = useRef<number | null>(null);
  const buttonAnimationFrameRef = useRef<number | null>(null);
  const [inputScale, setInputScale] = useState(1);
  const [buttonScale, setButtonScale] = useState(1);

  // 卡片动画状态
  const [cardsExiting, setCardsExiting] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(true);

  // 处理输入框焦点
  const handleInputFocus = () => {
    if (!isFocused && cardsVisible) {
      setIsFocused(true);
      // 通知父组件移动标题
      onTitleMove?.(true);
      // 开始卡片退出动画
      setCardsExiting(true);
      // 动画完成后隐藏卡片
      setTimeout(() => {
        setCardsVisible(false);
      }, 1000); // 1秒后完全隐藏卡片
    }
  };

  const handleInputBlur = () => {
    // 移除失焦重置逻辑，保持状态
  };

  // 处理表单提交
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (turnCount >= maxTurns) {
      alert(`已达到最大对话轮数限制 (${maxTurns}轮)`);
      return;
    }

    if (input?.trim() && !isLoading) {
      setTurnCount((prev) => prev + 1);
      handleSubmit(e);
    }
  };

  // 添加强制更新状态
  const [, forceUpdate] = useState({});

  // 鼠标响应动画更新函数
  const updateCardScales = useCallback(() => {
    let hasChanges = false;

    for (let i = 0; i < 4; i++) {
      const diff = targetScaleRefs.current[i] - currentScaleRefs.current[i];
      if (Math.abs(diff) > 0.001) {
        currentScaleRefs.current[i] += diff * 0.2;
        hasChanges = true;
      } else {
        currentScaleRefs.current[i] = targetScaleRefs.current[i];
      }
    }

    if (hasChanges) {
      forceUpdate({}); // 强制重新渲染以应用新的缩放值
      animationFrameRef.current = requestAnimationFrame(updateCardScales);
    } else {
      animationFrameRef.current = null;
    }
  }, []);

  // 输入框动画更新函数
  const updateInputScale = useCallback(() => {
    const diff = targetInputScaleRef.current - inputScaleRef.current;
    if (Math.abs(diff) > 0.001) {
      inputScaleRef.current += diff * 0.2;
      setInputScale(inputScaleRef.current);
      inputAnimationFrameRef.current = requestAnimationFrame(updateInputScale);
    } else {
      inputScaleRef.current = targetInputScaleRef.current;
      setInputScale(targetInputScaleRef.current);
      inputAnimationFrameRef.current = null;
    }
  }, []);

  // 按钮动画更新函数
  const updateButtonScale = useCallback(() => {
    const diff = targetButtonScaleRef.current - buttonScaleRef.current;
    if (Math.abs(diff) > 0.001) {
      buttonScaleRef.current += diff * 0.2;
      setButtonScale(buttonScaleRef.current);
      buttonAnimationFrameRef.current =
        requestAnimationFrame(updateButtonScale);
    } else {
      buttonScaleRef.current = targetButtonScaleRef.current;
      setButtonScale(targetButtonScaleRef.current);
      buttonAnimationFrameRef.current = null;
    }
  }, []);

  // 处理卡片点击
  const handleCardClick = (card: (typeof THEME_CARDS)[0]) => {
    const question = `跟我聊聊你的${card.title}相关内容`;

    // 模拟用户输入
    const syntheticEvent = {
      target: { value: question },
    } as React.ChangeEvent<HTMLInputElement>;

    handleInputChange(syntheticEvent);

    // 聚焦输入框并显示对话区域
    setIsFocused(true);
    inputRef.current?.focus();

    // 延迟提交
    setTimeout(() => {
      if (turnCount < maxTurns) {
        setTurnCount((prev) => prev + 1);
        handleSubmit(
          new Event("submit") as unknown as React.FormEvent<HTMLFormElement>
        );
      }
    }, 100);
  };

  // 处理卡片鼠标事件
  const handleCardMouseEnter = (index: number, e: React.MouseEvent) => {
    setHoveredCardIndex(index);

    const cardElement = e.currentTarget as HTMLElement;
    const rect = cardElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 使用与FloatingNav相同的椭圆检测逻辑
    const maxDistanceX = 200;
    const maxDistanceY = 120;

    const handleMouseMove = (e: MouseEvent) => {
      const distanceX = Math.abs(e.clientX - centerX);
      const distanceY = Math.abs(e.clientY - centerY);

      const normalizedX = distanceX / maxDistanceX;
      const normalizedY = distanceY / maxDistanceY;
      const ellipseDistance =
        normalizedX * normalizedX + normalizedY * normalizedY;

      if (ellipseDistance < 1) {
        const normalizedDistance = Math.max(
          0,
          Math.min(1, 1 - ellipseDistance)
        );
        const easedDistance =
          normalizedDistance *
          normalizedDistance *
          (3 - 2 * normalizedDistance);
        targetScaleRefs.current[index] = 1 + easedDistance * 0.12;
      } else {
        targetScaleRefs.current[index] = 1.05; // hover基础缩放
      }

      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(updateCardScales);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    const cleanup = () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };

    // 存储清理函数到元素上，以便mouse leave时清理
    (cardElement as any).mouseMoveCleanup = cleanup;
  };

  const handleCardMouseLeave = (index: number, e: React.MouseEvent) => {
    setHoveredCardIndex(null);
    targetScaleRefs.current[index] = 1;

    // 清理鼠标移动监听器
    const cardElement = e.currentTarget as HTMLElement;
    if ((cardElement as any).mouseMoveCleanup) {
      (cardElement as any).mouseMoveCleanup();
      delete (cardElement as any).mouseMoveCleanup;
    }

    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(updateCardScales);
    }
  };

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 阅后即焚逻辑
  useEffect(() => {
    if (messages.length > 0 && ephemeralMode) {
      const timer = setTimeout(() => {
        reload();
        setTurnCount(0);
        setIsFocused(false);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [messages, ephemeralMode, reload]);

  // 全局鼠标移动监听 - 为输入框和按钮添加响应动画
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const deltaX = Math.abs(e.clientX - lastX);
      const deltaY = Math.abs(e.clientY - lastY);

      if (deltaX < 5 && deltaY < 5) return;

      lastX = e.clientX;
      lastY = e.clientY;

      // 计算输入框距离
      let inputDistance = Infinity;
      let inputInRange = false;
      if (inputRef.current) {
        const inputRect = inputRef.current.getBoundingClientRect();
        const inputCenterX = inputRect.left + inputRect.width / 2;
        const inputCenterY = inputRect.top + inputRect.height / 2;

        const inputDistanceX = Math.abs(e.clientX - inputCenterX);
        const inputDistanceY = Math.abs(e.clientY - inputCenterY);
        inputDistance = Math.sqrt(
          inputDistanceX * inputDistanceX + inputDistanceY * inputDistanceY
        );

        const inputMaxDistanceX = 350;
        const inputMaxDistanceY = 100;

        const inputNormalizedX = inputDistanceX / inputMaxDistanceX;
        const inputNormalizedY = inputDistanceY / inputMaxDistanceY;
        const inputEllipseDistance =
          inputNormalizedX * inputNormalizedX +
          inputNormalizedY * inputNormalizedY;

        inputInRange = inputEllipseDistance < 1;
      }

      // 计算按钮距离
      let buttonDistance = Infinity;
      let buttonInRange = false;
      let buttonElement: HTMLElement | null = null;
      if (showSendButton) {
        buttonElement = document.querySelector(
          '[data-chatbot-button="true"]'
        ) as HTMLElement;
        if (buttonElement) {
          const buttonRect = buttonElement.getBoundingClientRect();
          const buttonCenterX = buttonRect.left + buttonRect.width / 2;
          const buttonCenterY = buttonRect.top + buttonRect.height / 2;

          const buttonDistanceX = Math.abs(e.clientX - buttonCenterX);
          const buttonDistanceY = Math.abs(e.clientY - buttonCenterY);
          buttonDistance = Math.sqrt(
            buttonDistanceX * buttonDistanceX +
              buttonDistanceY * buttonDistanceY
          );

          const buttonMaxDistanceX = 100;
          const buttonMaxDistanceY = 100;

          const buttonNormalizedX = buttonDistanceX / buttonMaxDistanceX;
          const buttonNormalizedY = buttonDistanceY / buttonMaxDistanceY;
          const buttonEllipseDistance =
            buttonNormalizedX * buttonNormalizedX +
            buttonNormalizedY * buttonNormalizedY;

          buttonInRange = buttonEllipseDistance < 1;
        }
      }

      // 根据距离确定优先级 - 距离更近的元素优先响应
      const preferButton = buttonInRange && buttonDistance < inputDistance;

      // 处理输入框动画
      if (inputRef.current && inputInRange && !preferButton) {
        const inputRect = inputRef.current.getBoundingClientRect();
        const inputCenterX = inputRect.left + inputRect.width / 2;
        const inputCenterY = inputRect.top + inputRect.height / 2;

        const inputDistanceX = Math.abs(e.clientX - inputCenterX);
        const inputDistanceY = Math.abs(e.clientY - inputCenterY);

        const inputMaxDistanceX = 350;
        const inputMaxDistanceY = 100;

        const inputNormalizedX = inputDistanceX / inputMaxDistanceX;
        const inputNormalizedY = inputDistanceY / inputMaxDistanceY;
        const inputEllipseDistance =
          inputNormalizedX * inputNormalizedX +
          inputNormalizedY * inputNormalizedY;

        const inputNormalizedDistance = Math.max(
          0,
          Math.min(1, 1 - inputEllipseDistance)
        );
        const inputEasedDistance =
          inputNormalizedDistance *
          inputNormalizedDistance *
          (3 - 2 * inputNormalizedDistance);
        targetInputScaleRef.current = 1 + inputEasedDistance * 0.08;

        if (!inputAnimationFrameRef.current) {
          inputAnimationFrameRef.current =
            requestAnimationFrame(updateInputScale);
        }
      } else {
        targetInputScaleRef.current = 1;
        if (!inputAnimationFrameRef.current) {
          inputAnimationFrameRef.current =
            requestAnimationFrame(updateInputScale);
        }
      }

      // 处理按钮动画
      if (buttonElement && buttonInRange && (preferButton || !inputInRange)) {
        const buttonRect = buttonElement.getBoundingClientRect();
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;

        const buttonDistanceX = Math.abs(e.clientX - buttonCenterX);
        const buttonDistanceY = Math.abs(e.clientY - buttonCenterY);

        const buttonMaxDistanceX = 100;
        const buttonMaxDistanceY = 100;

        const buttonNormalizedX = buttonDistanceX / buttonMaxDistanceX;
        const buttonNormalizedY = buttonDistanceY / buttonMaxDistanceY;
        const buttonEllipseDistance =
          buttonNormalizedX * buttonNormalizedX +
          buttonNormalizedY * buttonNormalizedY;

        const buttonNormalizedDistance = Math.max(
          0,
          Math.min(1, 1 - buttonEllipseDistance)
        );
        const buttonEasedDistance =
          buttonNormalizedDistance *
          buttonNormalizedDistance *
          (3 - 2 * buttonNormalizedDistance);
        targetButtonScaleRef.current = 1 + buttonEasedDistance * 0.15;

        if (!buttonAnimationFrameRef.current) {
          buttonAnimationFrameRef.current =
            requestAnimationFrame(updateButtonScale);
        }
      } else {
        targetButtonScaleRef.current = 1;
        if (!buttonAnimationFrameRef.current) {
          buttonAnimationFrameRef.current =
            requestAnimationFrame(updateButtonScale);
        }
      }
    };

    const handleGlobalMouseLeave = () => {
      targetInputScaleRef.current = 1;
      targetButtonScaleRef.current = 1;

      if (!inputAnimationFrameRef.current) {
        inputAnimationFrameRef.current =
          requestAnimationFrame(updateInputScale);
      }
      if (!buttonAnimationFrameRef.current) {
        buttonAnimationFrameRef.current =
          requestAnimationFrame(updateButtonScale);
      }
    };

    document.addEventListener("mousemove", handleGlobalMouseMove, {
      passive: true,
    });
    document.addEventListener("mouseleave", handleGlobalMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseleave", handleGlobalMouseLeave);
    };
  }, [updateInputScale, updateButtonScale, showSendButton]);

  // 清理动画帧
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (inputAnimationFrameRef.current) {
        cancelAnimationFrame(inputAnimationFrameRef.current);
      }
      if (buttonAnimationFrameRef.current) {
        cancelAnimationFrame(buttonAnimationFrameRef.current);
      }
    };
  }, []);

  // 格式化时间
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* 上方：四个主题卡片区域 */}
      <div className="mb-12 relative min-h-[400px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 absolute inset-0">
          {cardsVisible &&
            THEME_CARDS.map((card, index) => {
              const Icon = card.icon;
              const currentScale = currentScaleRefs.current[index];

              // 计算每张卡片的延迟时间（依次向上）
              const delay = index * 50; // 每张卡片间隔50ms，更快的依次动画

              return (
                <div
                  key={card.id}
                  onMouseEnter={(e) => handleCardMouseEnter(index, e)}
                  onMouseLeave={(e) => handleCardMouseLeave(index, e)}
                  onClick={() => handleCardClick(card)}
                  className={cn(
                    "relative cursor-pointer rounded-2xl overflow-hidden p-6",
                    "backdrop-blur-md border aspect-[3/4]"
                  )}
                  style={{
                    background:
                      effectiveTheme === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(255, 255, 255, 0.8)",
                    borderColor:
                      effectiveTheme === "dark"
                        ? "rgba(255, 255, 255, 0.3)"
                        : "#1F2937",
                    borderWidth: "1px",
                    transform: cardsExiting
                      ? `scale(${currentScale}) translateY(-100px)`
                      : `scale(${currentScale})`,
                    opacity: cardsExiting ? 0 : 1,
                    transition: cardsExiting
                      ? `all 0.8s cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms`
                      : "none",
                    boxShadow:
                      effectiveTheme === "dark"
                        ? "inset 0 0 3px rgba(255, 255, 255, 0.15), 0 10px 15px -3px rgba(0, 0, 0, 0.25), 0 4px 6px -2px rgba(0, 0, 0, 0.15)"
                        : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  {/* 内容 */}
                  <div className="relative z-10">
                    <div className="flex items-center mb-3">
                      <Icon
                        size={24}
                        className={cn(
                          effectiveTheme === "dark"
                            ? "text-white"
                            : "text-light-text-primary"
                        )}
                      />
                    </div>
                    <h3
                      className={cn(
                        "font-semibold text-lg mb-2",
                        effectiveTheme === "dark"
                          ? "text-white"
                          : "text-light-text-primary"
                      )}
                    >
                      {card.title}
                    </h3>
                    <p
                      className={cn(
                        "text-sm leading-relaxed",
                        effectiveTheme === "dark"
                          ? "text-gray-300"
                          : "text-light-text-secondary"
                      )}
                    >
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* 对话消息区域 - 直接显示在页面上，无框 */}
      {(isFocused || messages.length > 0) && (
        <div className="mb-8 space-y-4 transition-all duration-700 ease-in-out">
          {messages.map((message) => (
            <div key={message.id} className="w-full">
              <div
                className={cn(
                  "text-base leading-relaxed",
                  effectiveTheme === "dark" ? "text-white" : "text-gray-800"
                )}
              >
                <span
                  className={cn(
                    "font-medium",
                    message.role === "user"
                      ? "text-blue-500"
                      : effectiveTheme === "dark"
                      ? "text-gray-300"
                      : "text-gray-600"
                  )}
                >
                  {message.role === "user" ? "你：" : "AI："}
                </span>
                <span className="ml-2">{message.content}</span>
              </div>
              <p
                className={cn(
                  "text-xs mt-1 opacity-50",
                  effectiveTheme === "dark" ? "text-gray-400" : "text-gray-500"
                )}
              >
                {formatTime(new Date())}
              </p>
            </div>
          ))}

          {isLoading && (
            <div className="w-full">
              <div
                className={cn(
                  "text-base leading-relaxed",
                  effectiveTheme === "dark" ? "text-white" : "text-gray-800"
                )}
              >
                <span
                  className={cn(
                    "font-medium",
                    effectiveTheme === "dark"
                      ? "text-gray-300"
                      : "text-gray-600"
                  )}
                >
                  AI：
                </span>
                <span className="ml-2 inline-flex items-center space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce opacity-60"></div>
                  <div
                    className="w-2 h-2 bg-current rounded-full animate-bounce opacity-60"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-current rounded-full animate-bounce opacity-60"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* 下方：输入区域 - 加宽和下移 */}
      <div className="flex items-center justify-center mt-12">
        <form onSubmit={onSubmit} className="flex items-center gap-4">
          {/* 长胶囊输入框 - 加宽 */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={
              turnCount >= maxTurns
                ? "已达到最大对话轮数"
                : `随便问问你想了解我的任何事`
            }
            disabled={isLoading || turnCount >= maxTurns}
            className={cn(
              "w-96 px-6 py-4 rounded-full backdrop-blur-md border",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:scale-105",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            style={{
              background:
                effectiveTheme === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(255, 255, 255, 0.8)",
              borderColor:
                effectiveTheme === "dark"
                  ? "rgba(255, 255, 255, 0.3)"
                  : "#1F2937",
              borderWidth: "1px",
              color: effectiveTheme === "dark" ? "white" : "#1F2937",
              transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              transform: `scale(${inputScale})`, // 应用动画缩放
              transformOrigin: "center",
              boxShadow:
                effectiveTheme === "dark"
                  ? "inset 0 0 3px rgba(255, 255, 255, 0.15), 0 10px 15px -3px rgba(0, 0, 0, 0.25), 0 4px 6px -2px rgba(0, 0, 0, 0.15)"
                  : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          />

          {/* 圆形发送按钮 - 修复颜色和图标 */}
          {showSendButton && (
            <button
              type="submit"
              disabled={!input?.trim() || isLoading || turnCount >= maxTurns}
              data-chatbot-button="true" // 用于动画检测的标识
              className={cn(
                "w-14 h-14 rounded-full",
                "backdrop-blur-md", // 添加高斯模糊
                "flex items-center justify-center",
                // 图标颜色：确保在对应背景上清晰可见
                effectiveTheme === "dark"
                  ? "text-gray-800" // 夜间：深色图标（在白色背景上）
                  : "text-white" // 日间：白色图标（在深色背景上）
              )}
              style={{
                // 使用与其他控件一致的颜色
                backgroundColor:
                  effectiveTheme === "dark"
                    ? "rgba(255, 255, 255, 0.7)" // 夜间：半透明白色
                    : "rgba(31, 41, 55, 0.9)", // 日间：降低透明度的深色（#1F2937 的 rgba 版本）
                border: "none",
                opacity: 1,
                boxShadow: "none",
                transform: `scale(${buttonScale})`, // 应用动画缩放
                transformOrigin: "center",
                transition: "transform 0.1s ease-out", // 平滑的变换过渡
              }}
            >
              <ArrowUp size={18} />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
