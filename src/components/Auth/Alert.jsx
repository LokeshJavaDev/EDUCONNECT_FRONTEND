import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const Alert = ({ variant = 'error', children }) => {
    const styles = {
        error: {
            container: 'bg-red-50 border-red-200 text-red-800',
            icon: <AlertCircle className="w-5 h-5 text-red-600" />
        },
        success: {
            container: 'bg-green-50 border-green-200 text-green-800',
            icon: <CheckCircle className="w-5 h-5 text-green-600" />
        },
    };

    return (
        <div className={`p-4 rounded-lg border flex items-start gap-3 ${styles[variant].container}`}>
            {styles[variant].icon}
            <div className="flex-1">{children}</div>
        </div>
    );
};
