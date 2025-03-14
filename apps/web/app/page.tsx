
'use client';

import { useState, useEffect } from 'react';

interface ApiData {
  message: string;
  timestamp: string;
}

export default function Home() {

  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/hello');
        
        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status}`);
        }
        
        const data = await response.json();
        setApiData(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao chamar a API:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Astra DB Service</h1>
        
        {loading && <p>Carregando dados da API...</p>}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Erro: {error}</p>
            <p className="text-sm mt-2">Verifique se a API está rodando em http://localhost:3001</p>
          </div>
        )}
        
        {apiData && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p><strong>Mensagem:</strong> {apiData.message}</p>
            <p><strong>Timestamp:</strong> {apiData.timestamp}</p>
          </div>
        )}
      </div>
    </main>
  );
}