import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data available", 
  description = "There's nothing here yet.", 
  icon = "Inbox",
  action,
  actionLabel = "Get started"
}) => {
  return (
    <div className="text-center py-12 px-6">
      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={32} className="text-gray-400" />
      </div>
      
      <div className="space-y-2 mb-6">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 max-w-sm mx-auto">{description}</p>
      </div>

      {action && (
        <Button
          variant="primary"
          onClick={action}
          icon="Plus"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;