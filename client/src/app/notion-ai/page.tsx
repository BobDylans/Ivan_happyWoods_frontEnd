import { Navigation } from "@/components/layout/navigation";
import { NotionAIInterface } from "@/components/ai/notion-ai-interface";

export const metadata = {
  title: "HappyWoods AI - 智能对话助手",
  description: "基于 HappyWoods 设计系统的温暖智能对话体验",
};

/**
 * HappyWoods AI 智能助手页面
 *
 * 特性：
 * - 从引导页平滑过渡到聊天页的动态界面
 * - 基于 HappyWoods 设计系统的温暖自然风格
 * - 完整的状态管理和动画效果
 */
export default function NotionAIPage() {
  return (
    <div className="w-full h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 overflow-hidden">
        <NotionAIInterface />
      </div>
    </div>
  );
}
