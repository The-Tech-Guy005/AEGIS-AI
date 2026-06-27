import Link from "next/link";
import { HealthBadge } from "@/components/shared/HealthBadge";
import { FeatureGrid } from "@/components/layout/FeatureGrid";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col gradient-hero grid-pattern">
      <Header />

      <main className="flex flex-1 flex-col items-center px-6 pb-24 pt-16">
        <div className="mb-8">
          <HealthBadge />
        </div>

        <section className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            Adaptive Emergency Geospatial Intelligence System
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Protect communities with{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI-powered
            </span>{" "}
            hazard response
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            AEGIS AI combines real-time geospatial mapping, infrastructure impact
            modeling, and Gemini intelligence to help responders detect hazards,
            assess risk, and coordinate resources faster.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Open Dashboard
            </Link>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-card/60 px-8 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-muted"
            >
              API Documentation
            </a>
          </div>
        </section>

        <FeatureGrid />

        <section className="mx-auto mt-24 max-w-3xl rounded-2xl border border-border bg-card/40 p-8 text-center backdrop-blur">
          <h2 className="mb-3 text-2xl font-semibold">Built for production</h2>
          <p className="text-muted-foreground">
            FastAPI backend · PostgreSQL + PostGIS · Neo4j graph · Redis · Gemini AI ·
            Mapbox · Docker-ready infrastructure
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
