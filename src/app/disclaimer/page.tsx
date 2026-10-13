export const metadata = { title: "Disclaimer" };

export default function DisclaimerPage() {
  return (
    <main style={{ backgroundColor: "var(--paper)", minHeight: "100vh" }}>
      <section className="py-20 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-3xl mx-auto">
          <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--gold)" }}>Legal</p>
          <h1 className="font-serif font-semibold text-white" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>Disclaimer</h1>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-10" style={{ color: "rgba(26,26,26,0.8)", lineHeight: 1.8 }}>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>Independence</h2>
            <p>
              MRCPI-OBGYN Unlocked, including its courses, books, recall sheets, brain maps, podcast and YouTube channel, is an independent educational resource created by Dr. Einas Diab. It is not produced, endorsed, approved, or affiliated with the Royal College of Physicians of Ireland (RCPI). The term &quot;MRCPI&quot; is used solely to identify the examination this material is intended to help candidates prepare for. The RCPI name and logo belong to the College.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>Content</h2>
            <p>
              Our materials are based on published guidelines, the curriculum, and the author&apos;s clinical knowledge and experience. They do not reproduce actual examination questions or confidential examination material. &quot;Recall sheets&quot; are revision summaries of commonly examined topics, not recalled exam content. Candidates should always follow the College&apos;s own examination rules and confidentiality requirements.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>No Guarantee of Results</h2>
            <p>
              This material is a study aid. We do not guarantee examination success. Please refer to the official RCPI website for current exam formats, regulations, and requirements.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>Educational Use Only</h2>
            <p>
              Content is for exam preparation and general education. It is not a substitute for clinical judgement, local protocols, or current national and international guidelines, and it is not medical advice for individual patients.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>Accuracy</h2>
            <p>
              We work to keep content accurate and up to date, but medical guidance changes. Please verify against current guidelines.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>Contact</h2>
            <p>
              Questions or concerns about this site can be sent to{" "}
              <a href="mailto:info@mrcpi-obgynunlocked.com" style={{ color: "var(--teal)" }}>info@mrcpi-obgynunlocked.com</a>.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
