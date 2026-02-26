'use client';

import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ContinueWatchingNotification {
    contentId: string;
    contentTitle: string;
    currentTime: number;
    duration: number;
}

interface ContinueWatchingProps {
    notification: ContinueWatchingNotification | null;
    onDismiss: () => void;
    onResume: () => void;
}

export const ContinueWatching = ({
    notification,
    onDismiss,
    onResume
}: ContinueWatchingProps) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (notification) {
            setVisible(true);
        }
    }, [notification]);

    if (!notification || !visible) {
        return null;
    }

    const progress = (notification.currentTime / notification.duration) * 100;
    const minutes = Math.floor(notification.currentTime / 60);

    const handleDismiss = () => {
        setVisible(false);
        onDismiss();
    };

    return (
        <div className="fixed bottom-4 right-4 bg-[#2a2a2a] border border-gray-700 rounded-lg overflow-hidden shadow-lg max-w-sm z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-white mb-1">
                            Continua a guardare
                        </h3>
                        <p className="text-xs text-gray-400">
                            {notification.contentTitle}
                        </p>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="text-gray-500 hover:text-white transition ml-2"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-gray-700 rounded-full mb-3 overflow-hidden">
                    <div
                        className="h-full bg-red-600 transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <span>Ripresa da {minutes}min</span>
                    <span className="text-gray-500">
                        {Math.round(progress)}% completato
                    </span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            handleDismiss();
                        }}
                        className="flex-1 px-3 py-2 bg-gray-700 text-white text-xs font-semibold rounded hover:bg-gray-600 transition"
                    >
                        Guarda dall'inizio
                    </button>
                    <button
                        onClick={() => {
                            onResume();
                            handleDismiss();
                        }}
                        className="flex-1 px-3 py-2 bg-white text-black text-xs font-semibold rounded hover:bg-gray-200 transition"
                    >
                        Riprendi
                    </button>
                </div>
            </div>
        </div>
    );
};
