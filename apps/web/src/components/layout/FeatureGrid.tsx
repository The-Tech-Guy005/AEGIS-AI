const features = [
  {
    title: "Real-Time Incident Map",
    description:
      "Visualize active hazards on an interactive Mapbox map with clustering, zones, and evacuation routes.",
    icon: "🗺️",
  },
  {
    title: "Infrastructure Impact Graph",
    description:
      "Neo4j models power grids, hospitals, and roads to predict cascading failures from any incident.",
    icon: "🔗",
  },
  {
    title: "Gemini Risk Analysis",
    description:
      "AI evaluates severity, generates response plans, and answers natural language queries about any incident.",
    icon: "🤖",
  },
  {
    title: "Resource Coordination",
    description:
      "Track personnel, equipment, and shelters. Deploy resources to incidents with full audit trails.",
    icon: "🚁",
  },
  {
    title: "Geo-Targeted Alerts",
    description:
      "Broadcast warnings to affected areas via in-app, email, and SMS channels with acknowledgment tracking.",
    icon: "📡",
  },
  {
    title: "External Feed Ingestion",
    description:
      "Automatically ingest events from FEMA, USGS, and NOAA to stay ahead of emerging hazards.",
    icon: "📥",
  },
];

export function FeatureGrid() {
  return (
    <section className="mx-auto mt-24 grid max-w-6xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="rounded-xl border border-border bg-card/40 p-6 backdrop-blur transition hover:border-primary/40"
        >
          <div className="mb-4 text-2xl">{feature.icon}</div>
          <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {feature.description}
          </p>
        </div>
      ))}
    </section>
  );
}
