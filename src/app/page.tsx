import WallCalendar from "@/components/WallCalendar/WallCalendar";

export default function Home() {
  return (
    <main
      className="flex min-h-screen items-start justify-center px-4 py-8 transition-colors duration-300 md:items-center md:py-12"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <WallCalendar />
    </main>
  );
}
