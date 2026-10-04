export const metadata = { title: "Terms of Use" };

export default function TermsOfUsePage() {
  return (
    <main style={{ backgroundColor: "var(--paper)", minHeight: "100vh" }}>
      <section className="py-20 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-3xl mx-auto">
          <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--gold)" }}>Legal</p>
          <h1 className="font-serif font-semibold text-white" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>Terms of Use</h1>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-10" style={{ color: "rgba(26,26,26,0.8)", lineHeight: 1.8 }}>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>1. About This Platform</h2>
            <p>
              MRCPI-OBGYN Unlocked is an online medical education platform operated by Dr. Einas Diab. We provide structured OSCE preparation resources — including recorded sessions, study materials, mock examinations, and personalised feedback — for doctors preparing for the MRCPI Part 2 Obstetrics &amp; Gynaecology examination.
            </p>
            <p className="mt-3">
              By accessing or using this platform, you agree to be bound by these Terms of Use. If you do not agree, please do not use the platform.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>2. Eligibility</h2>
            <p>
              This platform is intended for medical professionals and doctors preparing for postgraduate examinations. By registering, you confirm that you are a qualified medical professional or a medical student enrolled in a recognised programme.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>3. Your Account</h2>
            <p className="mb-3">When you create an account, you are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing accurate and complete registration information</li>
              <li>Keeping your login credentials confidential</li>
              <li>All activity that occurs under your account</li>
            </ul>
            <p className="mt-3">
              You must notify us immediately at{" "}
              <a href="mailto:info@mrcpi-obgynunlocked.com" style={{ color: "var(--teal)" }}>info@mrcpi-obgynunlocked.com</a>{" "}
              if you become aware of any unauthorised use of your account.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>4. Course Access and Enrolment</h2>
            <p className="mb-3">
              Access to course content is granted upon successful enrolment and confirmation of payment. Course access is personal to the enrolled student and is non-transferable.
            </p>
            <p>
              We reserve the right to modify, update, or remove course content at any time in order to maintain accuracy and alignment with the current MRCPI OSCE blueprint.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>5. Payments</h2>
            <p className="mb-3">
              All fees are communicated directly prior to enrolment. Payment confirms your acceptance of the course fee as stated. We reserve the right to adjust our fees for future enrolments.
            </p>
            <p>
              All sales are final. We do not offer refunds once access to course content has been granted.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>6. Mock OSCE Sessions</h2>
            <p className="mb-3">
              Live mock OSCE sessions are conducted via secure video call at a mutually agreed time. Please note the following:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sessions must be booked in advance through the platform</li>
              <li>Cancellations or rescheduling requests must be made with reasonable advance notice</li>
              <li>Repeated late cancellations or no-shows may result in forfeiture of the session</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>7. Intellectual Property</h2>
            <p className="mb-3">
              All content on this platform — including but not limited to video sessions, PDF materials, flashcards, brain maps, feedback notes, and written materials — is the exclusive intellectual property of MRCPI-OBGYN Unlocked and Dr. Einas Diab.
            </p>
            <p className="mb-3">You may not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Copy, reproduce, or distribute any course content</li>
              <li>Share your login credentials to give others access to the platform</li>
              <li>Record, screenshot, or re-upload any video or live session</li>
              <li>Use any course material for commercial purposes</li>
            </ul>
            <p className="mt-3">
              Violation of these terms may result in immediate account suspension without notice.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>8. Disclaimer</h2>
            <p className="mb-3">
              The content provided on this platform is intended solely for examination preparation purposes. It does not constitute medical advice, clinical guidelines, or a substitute for professional clinical judgement.
            </p>
            <p>
              MRCPI-OBGYN Unlocked makes no guarantee of examination success. Results depend on individual effort, preparation, and performance on the day of examination.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>9. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, MRCPI-OBGYN Unlocked and Dr. Einas Diab shall not be liable for any indirect, incidental, or consequential damages arising from your use of this platform, including but not limited to examination results, loss of data, or technical interruptions.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>10. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at our discretion if you are found to be in breach of these Terms of Use, without obligation to provide a refund or compensation.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>11. Changes to These Terms</h2>
            <p>
              We may update these Terms of Use from time to time. Changes will be posted on this page with an updated date. Continued use of the platform after changes are posted constitutes your acceptance of the revised terms.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>12. Contact</h2>
            <p>
              For any questions regarding these Terms of Use, please contact us at{" "}
              <a href="mailto:info@mrcpi-obgynunlocked.com" style={{ color: "var(--teal)" }}>info@mrcpi-obgynunlocked.com</a>.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
