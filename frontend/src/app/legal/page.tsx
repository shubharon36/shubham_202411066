// src/app/legal/page.tsx
import MainLayout from "@/app/components/ui/organisms/MainLayout"

export default function LegalPage() {
  return (
    <>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "var(--spacing-lg)" }}>
        <h1 style={{ marginBottom: "var(--spacing-md)" }}>Legal</h1>

        <section id="privacy" style={{ marginBottom: "var(--spacing-xl)" }}>
          <h2 style={{ marginBottom: 8 }}>Privacy Policy</h2>
          <p style={{ color: "var(--muted-foreground)" }}>
            We respect your privacy. We only collect data needed to process orders and improve the service.
            Your information is never sold. You can request deletion by contacting{" "}
            <a href="mailto:privacy@shophub.example">privacy@shophub.example</a>.
          </p>
        </section>

        <section id="terms">
          <h2 style={{ marginBottom: 8 }}>Terms of Service</h2>
          <p style={{ color: "var(--muted-foreground)" }}>
            By using ShopHub, you agree to our terms, including acceptable use and payment terms.
            Products, pricing, and availability may change without notice.
            For any questions, contact <a href="mailto:legal@shophub.example">legal@shophub.example</a>.
          </p>
        </section>
      </div>
    </>
  )
}
