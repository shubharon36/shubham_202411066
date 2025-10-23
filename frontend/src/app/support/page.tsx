// src/app/support/page.tsx
import MainLayout from "@/app/components/ui/organisms/MainLayout"

export default function SupportPage() {
  return (
    <>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "var(--spacing-lg)" }}>
        <h1 style={{ marginBottom: "var(--spacing-md)" }}>Support</h1>

        <section id="contact" style={{ marginBottom: "var(--spacing-xl)" }}>
          <h2 style={{ marginBottom: 8 }}>Contact Us</h2>
          <p style={{ color: "var(--muted-foreground)" }}>
            Need help? Reach us at{" "}
            <a href="mailto:support@shophub.example">support@shophub.example</a>
            {" "}or call +1 (000) 000-0000 (Mon–Fri, 9am–6pm).
          </p>
        </section>

        <section id="faq" style={{ marginBottom: "var(--spacing-xl)" }}>
          <h2 style={{ marginBottom: 8 }}>FAQ</h2>
          <details style={{ marginBottom: 8 }}>
            <summary>Where is my order?</summary>
            <p style={{ paddingTop: 8 }}>Most orders ship within 1–2 business days. You’ll get a tracking email once shipped.</p>
          </details>
          <details style={{ marginBottom: 8 }}>
            <summary>What is your return policy?</summary>
            <p style={{ paddingTop: 8 }}>30-day returns on unused items in original packaging. Start a return from your account page.</p>
          </details>
          <details>
            <summary>Do you offer international shipping?</summary>
            <p style={{ paddingTop: 8 }}>Yes, to select countries. Shipping fees are calculated at checkout.</p>
          </details>
        </section>

        <section id="shipping">
          <h2 style={{ marginBottom: 8 }}>Shipping</h2>
          <ul style={{ color: "var(--muted-foreground)", paddingLeft: "1.2rem" }}>
            <li>Standard: 3–7 business days (free over ₹2,000 equivalent).</li>
            <li>Express: 1–3 business days (calculated at checkout).</li>
            <li>Tracking provided via email once your order ships.</li>
          </ul>
        </section>
      </div>
    </>
  )
}
