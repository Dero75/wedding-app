interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`max-w-lg mx-auto px-5 py-10 ${className}`}>
      {children}
    </div>
  );
}
