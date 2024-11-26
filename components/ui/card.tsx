import { ReactNode } from 'react';

interface CardProps {
  className?: string;
  children: ReactNode;
}

export function Card({ className = '', children }: CardProps) {
  return (
    <div className={`bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] 
                    border border-purple/10 rounded-xl ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <div className="p-4 border-b border-purple/10">{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={`font-semibold ${className}`}>{children}</h3>;
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div className="p-6">{children}</div>;
}
