'use client'

import { useEffect, useState } from 'react';
import { ModuloFaturamento } from '@/components/modulo-faturamento';


export default function Page() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <ModuloFaturamento token={token} />
  );
}

