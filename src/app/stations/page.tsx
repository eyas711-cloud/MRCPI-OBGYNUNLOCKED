import { Filter } from "lucide-react";
import StationCard from "@/components/StationCard";

const allStations = [
  // Antenatal
  {
    id: "an-01",
    number: "AN-01",
    domain: "Antenatal Care",
    category: "antenatal",
    title: "Booking Visit History",
    description: "Systematic booking history, risk factor identification, and initial investigation counselling for a new obstetric patient at 10 weeks gestation.",
    difficulty: "Foundation" as const,
    duration: 8,
  },
  {
    id: "an-02",
    number: "AN-02",
    domain: "Antenatal Care",
    category: "antenatal",
    title: "Antenatal Screening Counselling",
    description: "Combined first-trimester screening explanation — Down syndrome risk, nuchal translucency interpretation, and discussion of diagnostic options.",
    difficulty: "Intermediate" as const,
    duration: 8,
  },
  {
    id: "an-03",
    number: "AN-03",
    domain: "Antenatal Care",
    category: "antenatal",
    title: "Gestational Diabetes Counselling",
    description: "OGTT result interpretation, dietary modification, insulin initiation, and surveillance plan for a patient at 28 weeks with GDM.",
    difficulty: "Intermediate" as const,
    duration: 8,
  },
  {
    id: "an-04",
    number: "AN-04",
    domain: "Antenatal Care",
    category: "antenatal",
    title: "Small-for-Gestational-Age Fetus",
    description: "Assessment and management of an SGA fetus at 32 weeks — growth surveillance, Doppler interpretation, and delivery planning.",
    difficulty: "Advanced" as const,
    duration: 8,
  },
  // Intrapartum
  {
    id: "ip-01",
    number: "IP-01",
    domain: "Intrapartum Care",
    category: "intrapartum",
    title: "CTG Interpretation — Category II",
    description: "Systematic assessment of an intrapartum CTG with decelerations, identification of concerning features, and immediate management plan.",
    difficulty: "Advanced" as const,
    duration: 8,
  },
  {
    id: "ip-02",
    number: "IP-02",
    domain: "Intrapartum Care",
    category: "intrapartum",
    title: "Active Management of Third Stage",
    description: "Management of the third stage of labour, recognition of postpartum haemorrhage, and systematic Bimanual compression technique.",
    difficulty: "Intermediate" as const,
    duration: 8,
  },
  {
    id: "ip-03",
    number: "IP-03",
    domain: "Intrapartum Care",
    category: "intrapartum",
    title: "Consent for Emergency Caesarean",
    description: "Informed consent discussion for category-1 caesarean section under time pressure — risks, anaesthetic options, and documentation.",
    difficulty: "Advanced" as const,
    duration: 8,
  },
  // Gynaecology
  {
    id: "gyn-01",
    number: "GYN-01",
    domain: "Gynaecological History",
    category: "gynaecology",
    title: "Heavy Menstrual Bleeding",
    description: "Structured menstrual history, differential diagnosis formulation, and management discussion for a patient with HMB aged 38.",
    difficulty: "Foundation" as const,
    duration: 8,
  },
  {
    id: "gyn-02",
    number: "GYN-02",
    domain: "Gynaecological History",
    category: "gynaecology",
    title: "Chronic Pelvic Pain",
    description: "Comprehensive pelvic pain history, exploration of endometriosis and non-gynaecological differentials, and patient-centred management.",
    difficulty: "Intermediate" as const,
    duration: 8,
  },
  {
    id: "gyn-03",
    number: "GYN-03",
    domain: "Gynaecological History",
    category: "gynaecology",
    title: "Post-Menopausal Bleeding",
    description: "Systematic PMB history, risk stratification for endometrial malignancy, investigation planning, and referral decision.",
    difficulty: "Intermediate" as const,
    duration: 8,
  },
  {
    id: "gyn-04",
    number: "GYN-04",
    domain: "Gynaecological History",
    category: "gynaecology",
    title: "Subfertility Consultation",
    description: "Couple subfertility history, structured investigation planning for primary and secondary subfertility, and discussion of assisted conception pathways.",
    difficulty: "Advanced" as const,
    duration: 8,
  },
  // Emergency
  {
    id: "em-01",
    number: "EM-01",
    domain: "Emergency Obstetrics",
    category: "emergency",
    title: "Postpartum Haemorrhage Management",
    description: "Recognition and structured immediate management of PPH >1000mL — team communication, uterotonic cascade, and surgical escalation.",
    difficulty: "Advanced" as const,
    duration: 8,
  },
  {
    id: "em-02",
    number: "EM-02",
    domain: "Emergency Obstetrics",
    category: "emergency",
    title: "Severe Pre-Eclampsia",
    description: "Assessment of severe pre-eclampsia at 34 weeks, antihypertensive initiation, magnesium protocol, and delivery planning.",
    difficulty: "Advanced" as const,
    duration: 8,
  },
  {
    id: "em-03",
    number: "EM-03",
    domain: "Emergency Obstetrics",
    category: "emergency",
    title: "Shoulder Dystocia",
    description: "Recognition and systematic management of shoulder dystocia using HELPERR mnemonic — manoeuvres, team call, and documentation.",
    difficulty: "Advanced" as const,
    duration: 8,
  },
  // Communication
  {
    id: "com-01",
    number: "COM-01",
    domain: "Communication & Counselling",
    category: "communication",
    title: "Breaking Bad News — Fetal Anomaly",
    description: "Structured bad-news consultation for a major fetal anomaly identified at the anomaly scan — pacing, checking understanding, and next steps.",
    difficulty: "Intermediate" as const,
    duration: 8,
  },
  {
    id: "com-02",
    number: "COM-02",
    domain: "Communication & Counselling",
    category: "communication",
    title: "Termination of Pregnancy Counselling",
    description: "Non-directive counselling consultation for a patient presenting with an unplanned pregnancy at 9 weeks — options and referral pathways.",
    difficulty: "Intermediate" as const,
    duration: 8,
  },
  {
    id: "com-03",
    number: "COM-03",
    domain: "Communication & Counselling",
    category: "communication",
    title: "Shared Decision-Making: Induction vs Expectant",
    description: "Discussion of induction of labour at 41 weeks — benefits and risks, patient preferences, and documenting a shared decision.",
    difficulty: "Foundation" as const,
    duration: 8,
  },
  // Procedural
  {
    id: "pr-01",
    number: "PR-01",
    domain: "Procedural Skills",
    category: "procedural",
    title: "Speculum Examination & Cervical Smear",
    description: "Performing and explaining a speculum examination with sample collection — consent, positioning, technique, and patient communication.",
    difficulty: "Foundation" as const,
    duration: 8,
  },
  {
    id: "pr-02",
    number: "PR-02",
    domain: "Procedural Skills",
    category: "procedural",
    title: "Perineal Repair",
    description: "Assessment and repair of a second-degree perineal laceration — anatomy identification, suture technique, and post-repair check.",
    difficulty: "Intermediate" as const,
    duration: 8,
  },
];

const categories = [
  { id: "all", label: "All Stations" },
  { id: "antenatal", label: "Antenatal Care" },
  { id: "intrapartum", label: "Intrapartum" },
  { id: "gynaecology", label: "Gynaecology" },
  { id: "emergency", label: "Emergency Obstetrics" },
  { id: "communication", label: "Communication" },
  { id: "procedural", label: "Procedural Skills" },
];

export default function StationsPage() {
  return (
    <>
      {/* Header */}
      <section className="py-16 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-6xl mx-auto">
          <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--teal-bright)" }}>
            Station Library
          </p>
          <h1 className="font-serif text-white font-semibold mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Full station library
          </h1>
          <p className="text-base max-w-xl" style={{ color: "rgba(255,255,255,0.55)" }}>
            78 OSCE stations across six competency domains, each structured to the MRCPI O&amp;G OSCE format — candidate brief, examiner mark scheme, and timed delivery.
          </p>
        </div>
      </section>

      {/* Filter bar (static) */}
      <section className="border-b sticky top-16 z-40" style={{ backgroundColor: "var(--paper)", borderColor: "rgba(15,76,92,0.15)" }}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3 overflow-x-auto">
          <Filter size={14} style={{ color: "var(--teal)", flexShrink: 0 }} />
          {categories.map((c) => (
            <button
              key={c.id}
              className="font-mono-data text-xs tracking-wide px-3 py-1.5 rounded border whitespace-nowrap transition-all"
              style={
                c.id === "all"
                  ? { backgroundColor: "var(--teal)", color: "white", borderColor: "var(--teal)" }
                  : { backgroundColor: "transparent", color: "var(--teal)", borderColor: "rgba(15,76,92,0.25)" }
              }
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Station grid */}
      <section className="py-16 px-6" style={{ backgroundColor: "var(--paper)" }}>
        <div className="max-w-6xl mx-auto">
          {/* Antenatal */}
          <div id="antenatal" className="mb-16">
            <div className="flex items-baseline gap-4 mb-6 pb-3 border-b" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
              <h2 className="font-serif font-semibold text-xl" style={{ color: "var(--navy)" }}>Antenatal Care</h2>
              <span className="font-mono-data text-xs" style={{ color: "var(--teal)" }}>14 stations</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allStations.filter(s => s.category === "antenatal").map(s => (
                <StationCard key={s.id} number={s.number} domain={s.domain} title={s.title} description={s.description} difficulty={s.difficulty} href="#" variant="grid" />
              ))}
            </div>
          </div>

          {/* Intrapartum */}
          <div id="intrapartum" className="mb-16">
            <div className="flex items-baseline gap-4 mb-6 pb-3 border-b" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
              <h2 className="font-serif font-semibold text-xl" style={{ color: "var(--navy)" }}>Intrapartum Care</h2>
              <span className="font-mono-data text-xs" style={{ color: "var(--teal)" }}>12 stations</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allStations.filter(s => s.category === "intrapartum").map(s => (
                <StationCard key={s.id} number={s.number} domain={s.domain} title={s.title} description={s.description} difficulty={s.difficulty} href="#" variant="grid" />
              ))}
            </div>
          </div>

          {/* Gynaecology */}
          <div id="gynaecology" className="mb-16">
            <div className="flex items-baseline gap-4 mb-6 pb-3 border-b" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
              <h2 className="font-serif font-semibold text-xl" style={{ color: "var(--navy)" }}>Gynaecological History</h2>
              <span className="font-mono-data text-xs" style={{ color: "var(--teal)" }}>16 stations</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allStations.filter(s => s.category === "gynaecology").map(s => (
                <StationCard key={s.id} number={s.number} domain={s.domain} title={s.title} description={s.description} difficulty={s.difficulty} href="#" variant="grid" />
              ))}
            </div>
          </div>

          {/* Emergency */}
          <div id="emergency" className="mb-16">
            <div className="flex items-baseline gap-4 mb-6 pb-3 border-b" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
              <h2 className="font-serif font-semibold text-xl" style={{ color: "var(--navy)" }}>Emergency Obstetrics</h2>
              <span className="font-mono-data text-xs" style={{ color: "var(--teal)" }}>10 stations</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allStations.filter(s => s.category === "emergency").map(s => (
                <StationCard key={s.id} number={s.number} domain={s.domain} title={s.title} description={s.description} difficulty={s.difficulty} href="#" variant="grid" />
              ))}
            </div>
          </div>

          {/* Communication */}
          <div id="communication" className="mb-16">
            <div className="flex items-baseline gap-4 mb-6 pb-3 border-b" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
              <h2 className="font-serif font-semibold text-xl" style={{ color: "var(--navy)" }}>Communication &amp; Counselling</h2>
              <span className="font-mono-data text-xs" style={{ color: "var(--teal)" }}>18 stations</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allStations.filter(s => s.category === "communication").map(s => (
                <StationCard key={s.id} number={s.number} domain={s.domain} title={s.title} description={s.description} difficulty={s.difficulty} href="#" variant="grid" />
              ))}
            </div>
          </div>

          {/* Procedural */}
          <div id="procedural">
            <div className="flex items-baseline gap-4 mb-6 pb-3 border-b" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
              <h2 className="font-serif font-semibold text-xl" style={{ color: "var(--navy)" }}>Procedural &amp; Practical Skills</h2>
              <span className="font-mono-data text-xs" style={{ color: "var(--teal)" }}>8 stations</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allStations.filter(s => s.category === "procedural").map(s => (
                <StationCard key={s.id} number={s.number} domain={s.domain} title={s.title} description={s.description} difficulty={s.difficulty} href="#" variant="grid" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
