export const metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <main style={{ backgroundColor: "var(--paper)", minHeight: "100vh" }}>
      <section className="py-20 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-3xl mx-auto">
          <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--gold)" }}>Legal</p>
          <h1 className="font-serif font-semibold text-white" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>Privacy Policy</h1>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-10" style={{ color: "rgba(26,26,26,0.8)", lineHeight: 1.8 }}>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>1. Who We Are</h2>
            <p>
              MRCPI-OBGYN Unlocked is an online medical education platform operated by Dr. Einas Diab, providing structured OSCE preparation for doctors sitting the MRCPI Part 2 Obstetrics &amp; Gynaecology examination. Our website is located at <strong>mrcpiobgynunlocked.com</strong> and can be contacted at{" "}
              <a href="mailto:info@mrcpi-obgynunlocked.com" style={{ color: "var(--teal)" }}>info@mrcpi-obgynunlocked.com</a>.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>2. What Information We Collect</h2>
            <p className="mb-3">We collect the following personal information when you use our platform:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account information</strong> — your full name and email address when you register</li>
              <li><strong>Payment information</strong> — payment amounts, dates, and status records (we do not store card details)</li>
              <li><strong>Usage data</strong> — pages visited, content accessed, and session activity on our platform</li>
              <li><strong>Communications</strong> — messages you send us via the contact form or email</li>
              <li><strong>Booking information</strong> — dates and times of mock OSCE sessions you book</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>3. How We Use Your Information</h2>
            <p className="mb-3">We use your personal information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create and manage your student account</li>
              <li>Deliver course content, session bookings, and feedback</li>
              <li>Send you payment receipts and course-related notifications</li>
              <li>Respond to your enquiries and support requests</li>
              <li>Monitor and improve the quality of the platform</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>4. Cookies and Tracking</h2>
            <p className="mb-3">
              We use cookies and similar tracking technologies to operate the platform and measure the performance of our marketing campaigns.
            </p>
            <p className="mb-3">
              <strong>Meta Pixel:</strong> Our website uses the Meta Pixel, a tracking tool provided by Meta Platforms, Inc. (Facebook/Instagram). This tool collects data about your visit — such as pages viewed — and shares it with Meta to help us understand how visitors arrive at our site through our advertising campaigns. Meta may use this data in accordance with its own{" "}
              <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--teal)" }}>Privacy Policy</a>.
            </p>
            <p>
              You can opt out of Meta&apos;s use of your data for advertising purposes at any time through your{" "}
              <a href="https://www.facebook.com/settings/?tab=ads" target="_blank" rel="noopener noreferrer" style={{ color: "var(--teal)" }}>Facebook Ad Settings</a>.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>5. How We Store Your Data</h2>
            <p>
              Your data is stored securely using Supabase, a cloud database provider with servers located in the European Union. We apply appropriate technical and organisational measures to protect your personal information against unauthorised access, loss, or misuse.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>6. Sharing Your Information</h2>
            <p className="mb-3">We do not sell your personal data. We only share it with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Supabase</strong> — our secure database and authentication provider</li>
              <li><strong>Meta Platforms</strong> — solely for the purpose of measuring ad campaign performance via the Meta Pixel</li>
              <li><strong>Legal authorities</strong> — if required by applicable law</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>7. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Withdraw consent for marketing communications at any time</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:info@mrcpi-obgynunlocked.com" style={{ color: "var(--teal)" }}>info@mrcpi-obgynunlocked.com</a>.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date at the top. Continued use of the platform after changes are posted constitutes your acceptance of the updated policy.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>9. Contact</h2>
            <p>
              For any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:info@mrcpi-obgynunlocked.com" style={{ color: "var(--teal)" }}>info@mrcpi-obgynunlocked.com</a>.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
