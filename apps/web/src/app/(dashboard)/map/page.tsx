import { Header } from "@/components/layout/Header";

export default function MapPage() {
  return (
    <div className="min-h-full bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="mb-4 text-3xl font-bold">Hazard Map</h1>
        <p className="text-muted-foreground">
          Interactive Mapbox map — coming in Phase 3.
        </p>
      </main>
    </div>
  );
}
