/**
 * 工作流执行状态类型定义
 *
 * 用于实时展示 AI 思考和执行过程
 */

// ============================================================
// 基础类型
// ============================================================

/** 事件级别 */
export type EventLevel = "graph" | "node";

/** 节点状态 */
export type NodeStatus = "pending" | "running" | "completed" | "error";

/** 工具状态 */
export type ToolStatus = "pending" | "executing" | "success" | "failed";

// ============================================================
// Graph 层事件（调度级别）
// ============================================================

/** 工作流开始事件 */
export interface WorkflowStartedEvent {
  type: "workflow_started";
  level: "graph";
  timestamp: number;
  data: {
    workflow_name: string;
  };
}

/** 节点开始事件 */
export interface NodeStartedEvent {
  type: "node_started";
  level: "graph";
  timestamp: number;
  data: {
    node: string;
    display_name: string;
  };
}

/** 节点完成事件 */
export interface NodeFinishedEvent {
  type: "node_finished";
  level: "graph";
  timestamp: number;
  data: {
    node: string;
    display_name: string;
    duration_ms: number;
  };
}

/** 路由决策事件 */
export interface RouteDecisionEvent {
  type: "route_decision";
  level: "graph";
  timestamp: number;
  data: {
    from: string;
    to: string;
    reason: string;
  };
}

/** 工作流完成事件 */
export interface WorkflowCompleteEvent {
  type: "workflow_complete";
  level: "graph";
  timestamp: number;
  data: {
    total_duration_ms: number;
    status: "success" | "error";
  };
}

// ============================================================
// Node 层事件（执行级别）
// ============================================================

/** 思考阶段事件 */
export interface ThinkingPhaseEvent {
  type: "thinking_phase";
  level: "node";
  timestamp: number;
  data: {
    phase: string;
    details?: string;
  };
}

/** 工具调用排队事件 */
export interface ToolCallPendingEvent {
  type: "tool_call_pending";
  level: "node";
  timestamp: number;
  data: {
    tool: string;
    args: Record<string, any>;
  };
}

/** 工具执行中事件 */
export interface ToolExecutingEvent {
  type: "tool_executing";
  level: "node";
  timestamp: number;
  data: {
    tool: string;
  };
}

/** 工具结果事件 */
export interface ToolResultEvent {
  type: "tool_result";
  level: "node";
  timestamp: number;
  data: {
    tool: string;
    success: boolean;
    summary: string;
    duration_ms?: number;
  };
}

/** LLM 流式输出事件 */
export interface LLMStreamingEvent {
  type: "llm_streaming";
  level: "node";
  timestamp: number;
  data: {
    phase: string;
    details?: string;
  };
}

// ============================================================
// 消息事件
// ============================================================

/** 内容增量事件 */
export interface DeltaEvent {
  type: "delta";
  content: string;
  timestamp?: number;
}

/** 工具调用事件 */
export interface ToolCallsEvent {
  type: "tool_calls";
  tool_calls: Array<{
    id: string;
    type: string;
    function?: {
      name: string;
      arguments: string;
    };
  }>;
  timestamp?: number;
}

/** 错误事件 */
export interface ErrorEvent {
  type: "error";
  error: string;
  timestamp?: number;
}

// ============================================================
// 联合类型
// ============================================================

/** Graph 层事件 */
export type GraphEvent =
  | WorkflowStartedEvent
  | NodeStartedEvent
  | NodeFinishedEvent
  | RouteDecisionEvent
  | WorkflowCompleteEvent;

/** Node 层事件 */
export type NodeEvent =
  | ThinkingPhaseEvent
  | ToolCallPendingEvent
  | ToolExecutingEvent
  | ToolResultEvent
  | LLMStreamingEvent;

/** 所有工作流事件 */
export type WorkflowEvent = GraphEvent | NodeEvent;

/** 所有 SSE 事件 */
export type SSEEvent = WorkflowEvent | DeltaEvent | ToolCallsEvent | ErrorEvent;

// ============================================================
// 状态模型
// ============================================================

/** 节点状态信息 */
export interface NodeState {
  name: string;
  displayName: string;
  status: NodeStatus;
  startTime?: number;
  endTime?: number;
  durationMs?: number;
}

/** 工具执行状态 */
export interface ToolState {
  name: string;
  status: ToolStatus;
  args?: Record<string, any>;
  result?: {
    success: boolean;
    summary: string;
  };
  startTime?: number;
  endTime?: number;
  durationMs?: number;
}

/** 思考阶段信息 */
export interface ThinkingPhase {
  phase: string;
  details?: string;
  timestamp: number;
}

/** 路由决策信息 */
export interface RouteDecision {
  from: string;
  to: string;
  reason: string;
  timestamp: number;
}

/** 工作流状态 */
export interface WorkflowState {
  /** 是否正在执行 */
  isRunning: boolean;
  /** 开始时间 */
  startTime?: number;
  /** 结束时间 */
  endTime?: number;
  /** 总耗时（毫秒） */
  totalDurationMs?: number;
  /** 节点列表 */
  nodes: NodeState[];
  /** 工具列表 */
  tools: ToolState[];
  /** 思考阶段列表 */
  thinkingPhases: ThinkingPhase[];
  /** 路由决策列表 */
  routeDecisions: RouteDecision[];
  /** 是否完成 */
  isComplete: boolean;
  /** 执行状态 */
  status?: "success" | "error";
}

// ============================================================
// 辅助函数类型
// ============================================================

/** SSE 事件处理器 */
export type SSEEventHandler = (event: SSEEvent) => void;

/** 工作流状态更新函数 */
export type WorkflowStateUpdater = (event: WorkflowEvent) => WorkflowState;
