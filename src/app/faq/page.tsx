import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";

const faqCategories = [
  {
    category: "About the MRCPI OBGYN OSCE",
    faqs: [
      { q: "What is the MRCPI OBGYN OSCE?", a: "The MRCPI Part 2 OSCE (Objective Structured Clinical Examination) is a practical clinical assessment for doctors pursuing specialty training in Obstetrics & Gynaecology under the Royal College of Physicians of Ireland (RCPI) pathway. The examination tests clinical knowledge, communication skills, examination technique, and professional competencies across a series of structured stations." },
      { q: "How many stations are in the MRCPI OBGYN OSCE?", a: "The MRCPI OBGYN OSCE typically comprises 12 stations, each lasting 8 minutes. Stations cover a range of domains including history taking, clinical examination, communication and counselling, data interpretation, and emergency management." },
      { q: "What domains does the examination assess?", a: "The MRCPI OBGYN OSCE assesses candidates across six core domains: Clinical Knowledge, Communication Skills, Clinical Examination, Professionalism, Time Management, and Patient Safety. Every station is scored against these criteria using a structured mark scheme." },
      { q: "How often is the MRCPI OBGYN OSCE held?", a: "The examination is held at regular intervals throughout the year. We recommend checking the RCPI website for the current examination timetable and application deadlines." },
    ],
  },
  {
    category: "Our Courses & Platform",
    faqs: [
      { q: "Who is this platform designed for?", a: "MRCPI-OBGYN Unlocked is designed for OBGYN trainees, international medical graduates (IMGs), and any doctor preparing for the MRCPI Part 2 OSCE examination. The platform is suitable for candidates at all stages of preparation — from those just beginning to those making final preparations before their examination date." },
      { q: "Who teaches on the platform?", a: "All courses and mock OSCE sessions are led by Dr. Einas Diab — an experienced OBGYN clinician and medical educator with a distinguished portfolio of postgraduate qualifications. Dr. Diab conducts all one-to-one mock OSCE sessions personally." },
      { q: "What is included in the Complete OSCE Preparation Course?", a: "The Complete Course includes 8–9 weeks of structured preparation, 50+ video lessons, access to 78 practice stations, 2 live one-to-one mock OSCE sessions, downloadable PDF study guides, a digital flashcard library, progress tracking, and a course completion certificate." },
      { q: "Can I access the platform on mobile devices?", a: "Yes. The platform is fully responsive and optimised for desktop, tablet, and mobile devices. Video lessons and study materials are accessible across all modern browsers and devices." },
      { q: "Is the content regularly updated?", a: "Yes. All course materials are reviewed and updated regularly to reflect the current MRCPI OBGYN OSCE blueprint, examination format changes, and developments in clinical practice guidelines." },
    ],
  },
  {
    category: "Mock OSCE Sessions",
    faqs: [
      { q: "How do the live mock OSCE sessions work?", a: "You book a one-to-one session via the platform. At your scheduled time, you join a secure video call with an experienced OBGYN examiner. The session comprises 3 timed OSCE stations (8 minutes each) conducted in real examination format. Each station is scored using the official MRCPI OSCE mark scheme. A detailed written feedback report is delivered within 24 hours." },
      { q: "How do I choose my OSCE station domains for the mock session?", a: "When booking, you can specify your preferred domains or areas of concern. The examiner will select appropriate stations based on your preferences and ensure a representative spread of content types." },
      { q: "Are mock OSCE sessions recorded?", a: "Session recording is available only if enabled by the administrator and agreed by both the candidate and examiner. Recordings are stored securely and accessible only to the enrolled student for the duration of their access period." },
      { q: "Can I book multiple mock sessions?", a: "Yes. You can book individual sessions or purchase a session bundle at a reduced rate. Many candidates choose to book multiple sessions at different stages of their preparation." },
      { q: "What if I need to reschedule my session?", a: "Sessions can be rescheduled up to 48 hours before the appointment time without charge. Cancellations or rescheduling requests made less than 48 hours in advance may be subject to a rescheduling fee." },
    ],
  },
  {
    category: "Access, Payment & Technical",
    faqs: [
      { q: "How do I enroll?", a: "Click 'Enroll Now' on any course page, create your student account, and complete payment via Stripe or PayPal. You will receive instant access confirmation and your login credentials by email." },
      { q: "What payment methods are accepted?", a: "We accept all major credit and debit cards via Stripe, as well as PayPal. All payments are processed securely. We do not store card details on our servers." },
      { q: "Is there a refund policy?", a: "Yes. If you are not satisfied with your course within 7 days of enrolment, contact us for a full refund. Refunds are not available after the 7-day period or once a mock OSCE session has been conducted." },
      { q: "How is my content protected?", a: "All course content is protected with secure streaming for videos and a protected PDF viewer. Downloads of source files are not permitted for student accounts. Dynamic watermarking is applied to videos and PDF viewers displaying your name and email address." },
      { q: "Is my data handled in compliance with GDPR?", a: "Yes. MRCPI-OBGYN Unlocked is fully GDPR-compliant. We collect only the data necessary to provide our services, do not sell data to third parties, and maintain clear data retention and deletion policies. Full details are available in our Privacy Policy." },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      {/* HERO */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-mono-data text-xs uppercase tracking-widest mb-4" style={{ color: "var(--teal-bright)" }}>FAQ</p>
          <h1 className="font-serif text-white font-semibold mb-4" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
            Frequently Asked Questions
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
            Everything you need to know about the MRCPI OBGYN OSCE, our courses, and the platform.
          </p>
        </div>
      </section>

      {/* FAQ CONTENT */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--paper)" }}>
        <div className="max-w-4xl mx-auto space-y-14">
          {faqCategories.map((cat) => (
            <div key={cat.category}>
              <p className="font-mono-data text-xs uppercase tracking-widest mb-6" style={{ color: "var(--teal)" }}>
                {cat.category}
              </p>
              <div className="space-y-3">
                {cat.faqs.map((f, i) => (
                  <details
                    key={i}
                    className="rounded-xl border group bg-white"
                    style={{ borderColor: "rgba(15,76,92,0.15)" }}
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-sm list-none" style={{ color: "var(--navy)" }}>
                      <span className="pr-4">{f.q}</span>
                      <span aria-hidden="true" className="flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-xs transition-transform group-open:rotate-45" style={{ borderColor: "rgba(15,76,92,0.25)", color: "var(--teal)" }}>
                        +
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-sm leading-relaxed" style={{ color: "rgba(26,26,26,0.7)" }}>
                      {f.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STILL HAVE QUESTIONS */}
      <section className="py-16 px-6" style={{ backgroundColor: "rgba(11,30,61,0.03)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <MessageSquare size={32} className="mx-auto mb-4" style={{ color: "var(--teal)" }} />
          <h2 className="font-serif font-semibold text-2xl mb-3" style={{ color: "var(--navy)" }}>
            Still have questions?
          </h2>
          <p className="text-base mb-8" style={{ color: "rgba(26,26,26,0.65)" }}>
            Contact us directly via WhatsApp or email and we will respond within 24 hours.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
          >
            Contact Us <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}
