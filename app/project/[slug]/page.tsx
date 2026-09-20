import Link from "next/link";
import { notFound } from "next/navigation";

interface ProjectData {
  title: string;
  number: string;
  category: string;
  tag: string;
  description: string;
}

const PROJECTS: Record<string, ProjectData> = {
  "ai-student-coach": {
    number: "01",
    title: "AI STUDENT COACH",
    category: "AI / MOBILE / PRODUCTIVITY",
    tag: "ADAPTIVE INTELLIGENCE",
    description:
      "[INTELLIGENT ADAPTIVE MENTORSHIP SYSTEM PAIRED WITH REAL-TIME COGNITIVE FEEDBACK & PERSONALIZED RETENTION CURVES]",
  },
  drishti: {
    number: "02",
    title: "DRISHTI",
    category: "AI / ML / SIH",
    tag: "COMPUTER VISION & ACCESSIBILITY",
    description:
      "[INTELLIGENT VISUAL ASSISTANCE SYSTEM RECOGNIZED NATIONALLY AT SMART INDIA HACKATHON FOR EMPOWERING THE VISUALLY IMPAIRED]",
  },
  "ai-photobooth": {
    number: "03",
    title: "AI PHOTOBOOTH",
    category: "COMPUTER VISION / PYTHON",
    tag: "GENERATIVE SYNTHESIS",
    description:
      "[HIGH-THROUGHPUT COMPUTER VISION PIPELINE INTEGRATING REAL-TIME SEGMENTATION WITH NEURAL LATENT RESTYLING]",
  },
  "whatsapp-automation": {
    number: "04",
    title: "WHATSAPP AUTOMATION",
    category: "PYTHON / AUTOMATION",
    tag: "MULTI-AGENT ORCHESTRATION",
    description:
      "[EVENT-DRIVEN ARCHITECTURE ROUTING PARALLEL COMMUNICATIONS AND MULTI-STEP AGENT DISPATCH WITH RESILIENT STATE LOGS]",
  },
};

export function generateStaticParams() {
  return [
    { slug: "ai-student-coach" },
    { slug: "drishti" },
    { slug: "ai-photobooth" },
    { slug: "whatsapp-automation" },
  ];
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS[slug];

  if (!project) {
    notFound();
  }

  return (
    <main className="relative min-h-screen w-full bg-[#020306] text-[#f2f4f8] flex flex-col justify-between px-6 sm:px-12 md:px-20 py-16 select-none overflow-hidden">
      {/* Background Subtle Cosmic Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[1px] bg-gradient-to-b from-cyan-400/40 via-cyan-400/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,16,36,0.4)_0%,#020306_75%)]" />
      </div>

      {/* Header / Navigation Back */}
      <header className="relative z-10 w-full flex items-center justify-between border-b border-white/10 pb-6">
        <Link
          href="/#project-universe"
          className="group flex items-center gap-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-white/50 hover:text-cyan-300 transition-colors"
        >
          <span className="inline-block transition-transform group-hover:-translate-x-1">&larr;</span>
          <span>Return to Universe</span>
        </Link>

        <div className="font-mono text-[10px] tracking-[0.25em] text-white/30 uppercase">
          World {project.number} / 04
        </div>
      </header>

      {/* Center Project Detail Placeholder */}
      <section className="relative z-10 max-w-4xl mx-auto my-auto py-20 text-center flex flex-col items-center">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300/80">
            {project.category}
          </span>
        </div>

        <h1
          style={{ fontWeight: 100 }}
          className="font-display uppercase text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.92] tracking-[0.12em] text-white/95 mb-8"
        >
          {project.title}
        </h1>

        <p className="text-sm sm:text-base text-white/55 font-light tracking-wide max-w-2xl leading-relaxed mb-12">
          {project.description}
        </p>

        <div className="p-6 rounded-xs border border-white/10 bg-white/[0.02] backdrop-blur-sm max-w-md w-full text-center">
          <span className="font-mono text-[9px] tracking-[0.28em] text-white/40 uppercase block mb-2">
            [DEDICATED WORLD PAGE PENDING]
          </span>
          <p className="text-xs text-white/40 font-light leading-relaxed">
            Detailed case study, architecture breakdown, visual assets, and metrics for this project will be populated in subsequent phases.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full flex items-center justify-between border-t border-white/10 pt-6 text-[10px] font-mono text-white/30 uppercase tracking-[0.25em]">
        <span>Megha Portfolio / 2026</span>
        <span>Project Universe Architecture</span>
      </footer>
    </main>
  );
}
