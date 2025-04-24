function ErrorState({ error, onBack }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl text-red-700 font-medium mb-3">Error</h2>
        <p className="text-red-600">{error}</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ErrorState;
