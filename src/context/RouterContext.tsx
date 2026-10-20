import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RouterContextType {
  path: string;
  query: URLSearchParams;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUrl, setCurrentUrl] = useState<string>(() => window.location.pathname + window.location.search);

  useEffect(() => {
    const onPopState = () => {
      setCurrentUrl(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (to: string) => {
    if (to === currentUrl) return;
    window.history.pushState({}, '', to);
    setCurrentUrl(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [path, search] = currentUrl.split('?');
  const query = new URLSearchParams(search || '');

  return (
    <RouterContext.Provider value={{ path: path || '/', query, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}

export const Link: React.FC<{
  to: string;
  className?: string;
  children: ReactNode;
  id?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
}> = ({ to, className, children, id, target, rel, onClick }) => {
  const { navigate } = useRouter();

  if (to.startsWith('http') || target === '_blank') {
    return (
      <a href={to} className={className} id={id} target={target} rel={rel || 'noopener noreferrer'} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <a
      href={to}
      id={id}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
};
