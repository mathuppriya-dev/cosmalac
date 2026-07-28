import { SEO } from '../components/SEO';

export const PrivacyPolicy = () => {
  return (
    <>
      <SEO title="Privacy Policy" description="Cosmalac privacy policies and data protection compliance information." />
      <div class="max-w-3xl mx-auto px-4 py-12 text-left font-body leading-relaxed space-y-6">
        <h1 class="text-3xl font-bold font-heading text-text-primary border-b border-border-pink pb-4">Privacy Policy</h1>
        <p class="text-xs text-text-secondary">Effective Date: July 2026</p>
        
        <section class="space-y-3">
          <h2 class="text-lg font-semibold text-text-primary">1. Information Collection</h2>
          <p class="text-sm text-text-secondary">
            COSMALAC collects personal details (name, email, phone, company credentials) provided explicitly via our contact and trade distributor forms to evaluate commercial clinical contracts.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-semibold text-text-primary">2. Security Compliance</h2>
          <p class="text-sm text-text-secondary">
            All details submitted are stored securely. We implement encryption standards and prevent data leaking or sharing with unauthorized third parties.
          </p>
        </section>
      </div>
    </>
  );
};

export default PrivacyPolicy;
