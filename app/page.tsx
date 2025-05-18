import { ResourceList } from "./components/ResourceList";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">📚 Shared Resources</h1>
      <ResourceList />
    </main>
  );
}