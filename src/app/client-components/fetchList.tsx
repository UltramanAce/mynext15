'use client'

import { useEffect, useState } from 'react';

export default function FetchList() {
  const [listData, setListData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/fetchList', {
          method: 'GET',
        });
        if (!res.ok) {
          throw new Error(`HTTP status: ${res.status}`);
        }

        const data = await res.json();
        setListData(data);
      } catch (error: unknown) {
        console.error('Request error:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('发生未知错误');
        }
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>List Data</h1>
      {listData.length > 0 ? (
        <pre>{JSON.stringify(listData, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}