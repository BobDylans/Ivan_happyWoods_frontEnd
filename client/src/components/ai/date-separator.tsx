"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface DateSeparatorProps {
  date: Date;
  sessionTitle?: string;
}

/**
 * 日期分隔符组件
 * 
 * 在对话开头显示日期和会话信息
 */
export const DateSeparator: React.FC<DateSeparatorProps> = ({ 
  date, 
  sessionTitle = "HappyWoods AI" 
}) => {
  // 格式化日期：10月20日星期一
  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[date.getDay()];
    
    return `${month}月${day}日${weekday}`;
  };

  return (
    <motion.div
      className="flex items-center justify-center gap-3 my-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <span>{formatDate(date)}</span>
        <span>·</span>
        <span>{sessionTitle}</span>
      </div>
    </motion.div>
  );
};
