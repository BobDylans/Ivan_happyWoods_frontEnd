"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { cn } from "@/lib/utils";

interface UploadProgress {
  percent: number;
  status: "uploading" | "success" | "error";
  message: string;
}

interface UploadResult {
  success: boolean;
  message?: string;
  user_id?: string;
  collection_name?: string;
  results?: Array<{
    filename: string;
    chunks_count: number;
    success: boolean;
    error?: string;
  }>;
}

interface RagUploadProps {
  onClose: () => void;
  apiUrl?: string;
  apiKey?: string;
}

/**
 * 获取当前登录用户的 user_id (UUID)
 */
function getUserId(): string | null {
  try {
    const userInfoStr = localStorage.getItem("user_info");
    if (!userInfoStr) return null;
    const userInfo = JSON.parse(userInfoStr);
    return userInfo.user_id || null;
  } catch (error) {
    console.error("Failed to get user_id:", error);
    return null;
  }
}

/**
 * RAG 文档上传组件
 *
 * 特性：
 * - 支持拖拽上传
 * - 多文件上传
 * - 上传进度显示
 * - 支持 Markdown, PDF, DOCX 格式
 */
export const RagUpload: React.FC<RagUploadProps> = ({
  onClose,
  apiUrl = "http://127.0.0.1:8000/api/v1/rag/user/upload",
  apiKey = "",
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFormats = ".md,.markdown,.mdx,.txt,.pdf,.docx";
  const maxSizeMB = 20;

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    addFiles(selectedFiles);
  };

  // 添加文件
  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        alert(`文件 ${file.name} 超过 ${maxSizeMB}MB 限制`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  // 移除文件
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 拖拽处理
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  // 上传文件
  const handleUpload = async () => {
    if (files.length === 0) {
      alert("请至少选择一个文件");
      return;
    }

    // 获取用户 ID (必须)
    const userId = getUserId();
    if (!userId) {
      setProgress({
        percent: 0,
        status: "error",
        message: "未找到用户信息，请先登录",
      });
      return;
    }

    const formData = new FormData();
    // 必须先添加 user_id
    formData.append("user_id", userId);
    // 添加文件
    files.forEach(file => {
      formData.append("files", file, file.name);
    });

    setProgress({ percent: 0, status: "uploading", message: "上传中..." });
    setResult(null);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress({
            percent,
            status: "uploading",
            message: `上传进度：${percent}%`,
          });
        }
      };

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          setProgress({
            percent: 100,
            status: "success",
            message: "上传成功，文档已提交入库",
          });
          setResult(response);
          setFiles([]);
        } else {
          const errorData = JSON.parse(xhr.responseText);
          setProgress({
            percent: 0,
            status: "error",
            message: `上传失败：${errorData.detail || xhr.statusText}`,
          });
        }
      };

      xhr.onerror = () => {
        setProgress({
          percent: 0,
          status: "error",
          message: "网络错误或后端无法访问",
        });
      };

      xhr.open("POST", apiUrl, true);
      if (apiKey) {
        xhr.setRequestHeader("X-API-Key", apiKey);
      }
      xhr.send(formData);
    } catch (error) {
      setProgress({
        percent: 0,
        status: "error",
        message: `上传异常：${error instanceof Error ? error.message : String(error)}`,
      });
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-[var(--surface-base)] rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                上传文档到 RAG 知识库
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                支持 Markdown, PDF, DOCX 格式（最大 {maxSizeMB}MB）
              </p>
            </div>
          </div>
          <Button
            variant="text"
            size="icon"
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 上传区域 */}
          <div
            className={cn(
              "relative border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer group",
              isDragging
                ? "border-transparent bg-gradient-to-br from-purple-500/10 to-blue-500/10 shadow-lg"
                : "border-[var(--border-subtle)] hover:border-transparent hover:shadow-lg"
            )}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {/* 渐变边框效果 */}
            {!isDragging && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-sm" />
            )}
            
            <motion.div
              animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            <p className="text-[var(--text-primary)] font-semibold mb-2 text-lg">
              {isDragging ? "松开鼠标上传文件" : "点击或拖拽文件到这里"}
            </p>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              支持 {acceptedFormats.replace(/\./g, " ").toUpperCase()}
            </p>
            <p className="text-xs text-[var(--text-tertiary)]">
              单个文件最大 {maxSizeMB}MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedFormats}
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* 文件列表 */}
          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                已选择 {files.length} 个文件
              </h3>
              <AnimatePresence>
                {files.map((file, index) => (
                  <motion.div
                    key={`${file.name}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 p-3 bg-[var(--surface-elevated)] rounded-lg"
                  >
                    <FileText className="w-5 h-5 text-[var(--interactive-primary)] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Button
                      variant="text"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="text-[var(--text-secondary)] hover:text-rose-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* 上传进度 */}
          {progress && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {progress.status === "uploading" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">{progress.message}</span>
                    <span className="text-[var(--text-primary)] font-medium">
                      {progress.percent}%
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--surface-elevated)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[var(--interactive-primary)] to-blue-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.percent}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {progress.status === "success" && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-700 font-medium">{progress.message}</p>
                </div>
              )}

              {progress.status === "error" && (
                <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  <p className="text-sm text-rose-700 font-medium">{progress.message}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* 响应结果 */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">响应结果</h3>
              <pre className="bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-lg p-4 text-xs overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </motion.div>
          )}
        </div>

        {/* 底部操作栏 */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-[var(--border-subtle)] bg-gradient-to-r from-[var(--surface-base)] to-[var(--surface-elevated)]">
          <div className="text-xs text-[var(--text-secondary)]">
            {files.length > 0 ? (
              <span>已选择 <strong className="text-[var(--interactive-primary)]">{files.length}</strong> 个文件</span>
            ) : (
              <span>请选择要上传的文件</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="text" onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              取消
            </Button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="primary"
                onClick={handleUpload}
                disabled={files.length === 0 || progress?.status === "uploading"}
                className="min-w-[160px] bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center"
              >
                {progress?.status === "uploading" ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>上传中 {progress.percent}%</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    <span>上传到知识库</span>
                  </div>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
