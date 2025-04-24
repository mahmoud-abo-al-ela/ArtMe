function LoadingState() {
  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="h-64 w-full max-w-md bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default LoadingState;
