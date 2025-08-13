"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Camera, Music, Film, PenTool, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useTheme } from "@/components/providers/ThemeProvider";
import TextFloatAnimation from "@/components/animations/TextFloatAnimation/TextFloatAnimation";
import { ChatbotProps } from "./Chatbot.types";
import styles from "./Chatbot.module.css";

// 扩展 HTMLElement 类型以包含鼠标移动清理函数
interface HTMLElementWithCleanup extends HTMLElement {
  mouseMoveCleanup?: () => void;
}

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
  maxTurns = 3,
  onTitleMove,
}) => {
  const { effectiveTheme } = useTheme();

  // 更简洁的状态管理
  const [currentResponse, setCurrentResponse] = useState<string>(""); // 当前响应内容
  const [fadingResponse, setFadingResponse] = useState<string>(""); // 渐隐期间显示的内容
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<
    "idle" | "fadeOut" | "loading" | "fadeIn"
  >("idle"); // 动画阶段
  const [responseKey, setResponseKey] = useState(0); // 用于强制重新渲染 TextFloatAnimation
  const [isFadingOut, setIsFadingOut] = useState(false); // 控制渐隐动画的实际触发

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // 处理渐隐动画时序
  useEffect(() => {
    if (animationPhase === "fadeOut") {
      // 小延迟确保DOM更新后再触发动画
      const timer = setTimeout(() => {
        setIsFadingOut(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsFadingOut(false);
    }
  }, [animationPhase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading || animationPhase !== "idle") return;

    setInput("");

    // 如果已有响应内容，先触发渐隐动画
    if (currentResponse) {
      // 规范化文本格式，避免多余的空行
      const normalizedResponse = currentResponse
        .replace(/\n{3,}/g, "\n\n") // 将3个或更多连续换行替换为2个
        .trim(); // 去除首尾空白

      setFadingResponse(normalizedResponse); // 保存规范化后的内容用于渐隐
      setCurrentResponse(""); // 立即清空当前内容
      setAnimationPhase("fadeOut");

      // 等待渐隐动画完成后开始加载
      setTimeout(() => {
        setFadingResponse(""); // 清空渐隐内容
        setAnimationPhase("loading");
        setIsLoading(true);

        // 模拟AI响应
        setTimeout(() => {
          const mockResponse = `这是基于你的问题生成的 RAG 响应内容。实际集成后，这里将显示基于个人知识库检索增强的回答。

内容会根据中英文自动调整格式：中文段落首行缩进两格，英文按照标准格式显示。整体内容居中展示，文字左右对齐，确保阅读体验的舒适性。

系统会根据用户的问题，从个人知识库中检索相关信息，然后生成准确、有用的回答。这种方式既保证了回答的个性化，又确保了信息的准确性。

This is how English content would be displayed with proper formatting and alignment. English paragraphs follow standard formatting conventions without indentation.

The system ensures optimal readability across different languages and content types.`;

          setCurrentResponse(mockResponse);
          setIsLoading(false);
          setAnimationPhase("fadeIn");
          setResponseKey((prev) => prev + 1); // 强制重新渲染

          // 动画完成后重置为空闲状态
          setTimeout(() => {
            setAnimationPhase("idle");
          }, 100);
        }, 1000);
      }, 500); // 等待渐隐动画完成
    } else {
      setAnimationPhase("loading");
      setIsLoading(true);

      // 模拟AI响应
      setTimeout(() => {
        const mockResponse = `这是基于你的问题生成的 RAG 响应内容。实际集成后，这里将显示基于个人知识库检索增强的回答。

内容会根据中英文自动调整格式：中文段落首行缩进两格，英文按照标准格式显示。整体内容居中展示，文字左右对齐，确保阅读体验的舒适性。

系统会根据用户的问题，从个人知识库中检索相关信息，然后生成准确、有用的回答。这种方式既保证了回答的个性化，又确保了信息的准确性。

This is how English content would be displayed with proper formatting and alignment. English paragraphs follow standard formatting conventions without indentation.

The system ensures optimal readability across different languages and content types.`;

        setCurrentResponse(mockResponse);
        setIsLoading(false);
        setAnimationPhase("fadeIn");
        setResponseKey((prev) => prev + 1);

        // 动画完成后重置为空闲状态
        setTimeout(() => {
          setAnimationPhase("idle");
        }, 100);
      }, 1000);
    }
  };

  // 状态管理
  const [isFocused, setIsFocused] = useState(false); // 输入框是否获得焦点
  const [turnCount, setTurnCount] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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
      }, 1000); // 恢复原来的动画时间
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

    if (input?.trim() && !isLoading && animationPhase === "idle") {
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
    setInput(question);

    // 处理卡片退出和标题移动
    if (!isFocused && cardsVisible) {
      setIsFocused(true);
      onTitleMove?.(true);
      setCardsExiting(true);
      setTimeout(() => {
        setCardsVisible(false);
      }, 1000);
    }

    inputRef.current?.focus();

    // 延迟提交
    setTimeout(() => {
      if (turnCount < maxTurns && animationPhase === "idle") {
        setTurnCount((prev) => prev + 1);

        // 创建一个合成的表单事件
        const submitEvent = new Event("submit", {
          bubbles: true,
          cancelable: true,
        });
        Object.defineProperty(submitEvent, "preventDefault", {
          value: () => {},
          writable: true,
        });

        handleSubmit(
          submitEvent as unknown as React.FormEvent<HTMLFormElement>
        );
      }
    }, 100);
  };

  // 处理卡片鼠标事件
  const handleCardMouseEnter = (index: number, e: React.MouseEvent) => {
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
    (cardElement as HTMLElementWithCleanup).mouseMoveCleanup = cleanup;
  };

  const handleCardMouseLeave = (index: number, e: React.MouseEvent) => {
    targetScaleRefs.current[index] = 1;

    // 清理鼠标移动监听器
    const cardElement = e.currentTarget as HTMLElementWithCleanup;
    if (cardElement.mouseMoveCleanup) {
      cardElement.mouseMoveCleanup();
      delete cardElement.mouseMoveCleanup;
    }

    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(updateCardScales);
    }
  };

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

  return (
    <div className="w-full max-w-6xl mx-auto relative flex flex-col h-[68vh]">
      {/* 上方：四个主题卡片区域 */}
      <div
        className={cn(
          "relative flex-shrink-0 transition-all duration-1000 ease-in-out",
          cardsVisible ? "mb-8 min-h-[300px]" : "mb-0 min-h-0 overflow-hidden"
        )}
      >
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

      {/* RAG响应内容区域 - 始终占据可用空间 */}
      <div
        ref={messagesContainerRef}
        className="flex-1 flex items-start justify-center mb-6 px-8"
      >
        {/* 渐隐阶段：显示正在淡出的旧内容 */}
        {animationPhase === "fadeOut" && fadingResponse && (
          <div
            className="max-w-4xl w-full"
            style={{
              transition: "opacity 500ms ease-in-out, filter 500ms ease-in-out",
              opacity: isFadingOut ? 0 : 1,
              filter: isFadingOut ? "blur(4px)" : "blur(0px)",
              width: "100%", // 保持宽度不变
              minHeight: "1em", // 保持最小高度防止布局跳跃
            }}
          >
            <div
              className={cn(
                "max-h-full overflow-y-scroll py-4",
                styles.scrollContainer,
                effectiveTheme === "dark" ? styles.scrollContainerDark : ""
              )}
              style={{
                contain: "layout style",
                willChange: "auto",
              }}
            >
              <div
                className={cn(
                  styles.ragContent,
                  effectiveTheme === "dark" ? "text-white" : "text-gray-800"
                )}
              >
                {/* 渐隐期间复制 TextFloatAnimation 的渲染结构 */}
                <div className={styles.textFloatAnimationMimic}>
                  {fadingResponse.split("").map((char, index) => (
                    <span
                      key={index}
                      className={char === " " ? styles.space : ""}
                      style={{
                        opacity: 1, // 渐隐时保持完全可见
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 正常显示：新内容或现有内容 */}
        {(animationPhase === "fadeIn" || animationPhase === "idle") &&
          currentResponse && (
            <div
              className={cn(
                "max-w-4xl w-full transition-all duration-500 ease-in-out",
                "opacity-100 translate-y-0"
              )}
            >
              <div
                className={cn(
                  "max-h-full overflow-y-scroll py-4",
                  styles.scrollContainer,
                  effectiveTheme === "dark" ? styles.scrollContainerDark : ""
                )}
                style={{
                  contain: "layout style",
                  willChange: "auto",
                }}
              >
                <div
                  className={cn(
                    styles.ragContent,
                    effectiveTheme === "dark" ? "text-white" : "text-gray-800"
                  )}
                >
                  <TextFloatAnimation
                    key={responseKey} // 强制重新渲染
                    text={currentResponse}
                    preset="typewriter"
                    autoStart={animationPhase === "fadeIn"}
                  />
                </div>
              </div>
            </div>
          )}

        {animationPhase === "loading" && isLoading && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-current rounded-full animate-bounce opacity-60"></div>
            <div
              className="w-3 h-3 bg-current rounded-full animate-bounce opacity-60"
              style={{ animationDelay: "0.15s" }}
            ></div>
            <div
              className="w-3 h-3 bg-current rounded-full animate-bounce opacity-60"
              style={{ animationDelay: "0.3s" }}
            ></div>
          </div>
        )}
      </div>

      {/* 输入框 - 固定在底部，添加底部边距 */}
      <div className="flex-shrink-0 pb-32">
        <form
          onSubmit={onSubmit}
          className="flex items-center justify-center gap-8"
        >
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
            disabled={
              isLoading || turnCount >= maxTurns || animationPhase !== "idle"
            }
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
              transform: `scale(${inputScale})`,
              transformOrigin: "center",
              boxShadow:
                effectiveTheme === "dark"
                  ? "inset 0 0 3px rgba(255, 255, 255, 0.15), 0 10px 15px -3px rgba(0, 0, 0, 0.25), 0 4px 6px -2px rgba(0, 0, 0, 0.15)"
                  : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          />

          {/* 圆形发送按钮 */}
          {showSendButton && (
            <button
              type="submit"
              disabled={
                !input?.trim() ||
                isLoading ||
                turnCount >= maxTurns ||
                animationPhase !== "idle"
              }
              data-chatbot-button="true"
              className={cn(
                "w-14 h-14 rounded-full",
                "backdrop-blur-md",
                "flex items-center justify-center",
                effectiveTheme === "dark" ? "text-gray-800" : "text-white"
              )}
              style={{
                backgroundColor:
                  effectiveTheme === "dark"
                    ? "rgba(255, 255, 255, 0.7)"
                    : "rgba(31, 41, 55, 0.9)",
                border: "none",
                opacity: 1,
                boxShadow: "none",
                transform: `scale(${buttonScale})`,
                transformOrigin: "center",
                transition: "transform 0.1s ease-out",
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
