import React from "react";
import type { ReactNode } from "react";
import { Card, Statistic } from "antd";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  valueColor: string;
  suffix?: ReactNode;
}

function StatCard({ title, value, icon, valueColor, suffix }: StatCardProps) {
  return (
    <Card variant="borderless" className="h-full shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md">
      <Statistic
        title={<span className="font-medium text-gray-500">{title}</span>}
        value={value}
        prefix={<span className={`mr-2 ${valueColor}`}>{icon}</span>}
        styles={{ content: { color: valueColor } }}
        // valueStyle={{
        //   fontWeight: "bold",
        //   color: valueColor.includes("text-") ? undefined : valueColor,
        // }}
        suffix={suffix}
      />
    </Card>
  );
}

export default StatCard;
