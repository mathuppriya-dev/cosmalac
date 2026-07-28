import { SEO } from '../components/SEO';

export const TermsOfService = () => {
  return (
    <>
      <SEO title="Terms of Service" description="Cosmalac trade regulations and website terms of use." />
      <div class="max-w-3xl mx-auto px-4 py-12 text-left font-body leading-relaxed space-y-6">
        <h1 class="text-3xl font-bold font-heading text-text-primary border-b border-border-pink pb-4">Terms of Service</h1>
        <p class="text-xs text-text-secondary">Effective Date: July 2026</p>

        <section class="space-y-3">
          <h2 class="text-lg font-semibold text-text-primary">1. Showcase Limitations</h2>
          <p class="text-sm text-text-secondary">
            COSMALAC is a manufacturing trade showcase. The site does not support online B2C e-commerce purchasing. Product prices are wholesale trade rates provided upon request.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-semibold text-text-primary">2. Medical Disclaimer</h2>
          <p class="text-sm text-text-secondary">
             skincares formulations require professional patch verification. Information published in R&D booklets does not replace advice from a board-certified dermatologist.
          </p>
        </section>
      </div>
    </>
  );
};

export default TermsOfService;
