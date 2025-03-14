'use client';

import { useEffect, useState } from 'react';

export default function FetchList() {
  const [listData, setListData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('../api/fetchList', {
          method: 'GET',
        });

        if (!res.ok) {
          throw new Error(`HTTP status: ${res.status}`);
        }

        const data = await res.json();
        setListData(data);
      } catch (error) {
        console.error('Request error:', error);
      }
    };

    fetchData();
  }, []);

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