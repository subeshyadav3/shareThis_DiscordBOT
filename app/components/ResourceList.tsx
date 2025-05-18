'use client';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function ResourceList() {
  const { data, error } = useSWR('/api/resource', fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      {data.map((res: any) => (
        <div key={res.id} className="border p-4 rounded shadow">
          <h3 className="font-semibold">{res.subject}</h3>
          <a href={res.link} className="text-blue-500 underline" target="_blank">{res.link}</a>
          <p className="text-sm text-gray-500">by {res.uploader} at {new Date(res.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}