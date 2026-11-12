function PageLoader() {
  return (
    <div className="min-h-screen bg-violet-50 dark:bg-gray-900 flex items-center justify-center">
      <svg
        className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default PageLoader;