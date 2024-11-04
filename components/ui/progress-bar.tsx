interface ProgressBarProps {
  progress: number;
  isUploading: boolean;
  onCancel?: () => void;
}

export function ProgressBar({ progress, isUploading, onCancel }: ProgressBarProps) {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-text-dark/70">
        <span>{isUploading ? "Uploading file..." : "Upload complete"}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-light rounded-full h-2 overflow-hidden">
        <div
          className="bg-coral h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {isUploading && onCancel && (
        <button
          onClick={onCancel}
          className="text-sm text-red-600 hover:text-red-800 transition-colors"
        >
          Cancel Upload
        </button>
      )}
    </div>
  );
}
