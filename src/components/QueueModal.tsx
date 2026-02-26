import type { WaitingQueueResponse } from "../types/response/waitingQueueResponse";

interface QueueModalProps {
    isOpen: boolean;
    queueInfo: WaitingQueueResponse | null;
}

export default function QueueModal({ isOpen, queueInfo }: QueueModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999]">
            <div className="bg-white p-8 rounded-2xl text-center shadow-2xl max-w-sm w-full mx-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">접속 대기 중입니다</h2>
                
                {queueInfo ? (
                    <div className="text-gray-600 space-y-3">
                        <p className="text-sm bg-gray-50 py-2 rounded-lg">{queueInfo.message}</p>
                        <p className="text-lg">내 대기 순위: <strong className="text-blue-600 text-3xl mx-1">{queueInfo.rank}</strong> 번째</p>
                        <p className="text-sm text-red-500 font-medium mt-4">새로고침 하시면 순서가 맨 뒤로 밀려납니다.</p>
                    </div>
                ) : (
                    <p className="text-gray-500">대기열 정보를 불러오는 중입니다...</p>
                )}
            </div>
        </div>
    );
}