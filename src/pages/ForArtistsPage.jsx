import { Helmet } from 'react-helmet'
import { memo } from 'react'
import PortalLayout from '../components/landing/PortalLayout'
import PortalHero from '../components/landing/PortalHero'
import GeoLine from '../components/landing/GeoLine'
import HeroKuzi from '../components/landing/africa/HeroKuzi'
import AfricaStatsStrip from '../components/landing/africa/AfricaStatsStrip'
import AfricaFeatureSection from '../components/landing/africa/AfricaFeatureSection'
import AfricaCertSection from '../components/landing/africa/AfricaCertSection'
import AfricaTimelineSection from '../components/landing/africa/AfricaTimelineSection'
import AfricaTestimonialsSection from '../components/landing/africa/AfricaTestimonialsSection'
import AfricaCtaSection from '../components/landing/africa/AfricaCtaSection'
import { useLang } from '../store/LangContext'
import { africaT } from '../i18n/africa'

/**
 * ForArtistsPage — Artist Marketplace Landing
 *
 * Audience: Emerging African Artists
 * Message: Free marketplace to get your work seen globally
 *
 * Architecture: Reuses Africa components + messaging but with artist-first positioning
 */

function ForArtistsContent() {
  const { lang } = useLang()
  const t = africaT[lang]

  return (
    <>
      {/* ─── HERO (Artist Marketplace Focus) ──────────────────────────── */}
      <PortalHero
        label={lang === 'en' ? 'Free Artist Marketplace' : 'Marketplace Artistes Gratuit'}
        title={
          <>
            {lang === 'en' ? 'Get Your Work' : 'Faites Découvrir'}
            <br />
            {lang === 'en' ? 'Seen Globally' : 'Votre Art Mondialement'}
            <em className="italic text-[var(--accent)] ml-2">
              {lang === 'en' ? 'for Free' : 'gratuitement'}
            </em>
          </>
        }
        subtitle={
          lang === 'en'
            ? 'Free tools to upload, certify, and sell your art to international collectors. No fees. Pure commission-only growth.'
            : 'Outils gratuits pour charger, certifier et vendre votre art à des collectionneurs internationaux. Zéro frais. Croissance par commission uniquement.'
        }
        actions={[
          { text: lang === 'en' ? 'Upload Your Art Free' : 'Charger votre Art Gratuitement', to: '/sign-up?role=artist', primary: true },
          {
            text: lang === 'en' ? 'See Live Demo' : 'Voir la Démo',
            onClick: () =>
              document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' }),
          },
        ]}
      >
        <HeroKuzi />
      </PortalHero>

      {/* ─── STATS STRIP ───────────────────────────────────────────────── */}
      <AfricaStatsStrip />

      {/* ─── HOW IT WORKS (Timeline) ────────────────────────────────────── */}
      <div id="dashboard">
        <AfricaTimelineSection />
      </div>
      <GeoLine />

      {/* ─── PROFESSIONAL TOOLS ──────────────────────────────────────────── */}
      <AfricaFeatureSection />
      <GeoLine />

      {/* ─── CERTIFICATION (Trust) ─────────────────────────────────────── */}
      <AfricaCertSection />
      <GeoLine />

      {/* ─── TESTIMONIALS (Social Proof) ────────────────────────────────── */}
      <AfricaTestimonialsSection />

      {/* ─── FINAL CTA ──────────────────────────────────────────────────── */}
      <AfricaCtaSection />
    </>
  )
}

/**
 * For Artists landing page.
 * Standalone route at /for-artists — uses Africa portal layout with artist-focused messaging
 */
export default memo(function ForArtistsPage() {
  return (
    <>
      <Helmet>
        <title>Kucibok for Artists — Free Marketplace to Sell African Art Globally</title>
        <meta
          name="description"
          content="Free marketplace for African artists. Upload, certify, and sell your art to international collectors. No fees. Pure commission-only growth."
        />
        <meta
          property="og:title"
          content="Kucibok for Artists — Free Marketplace for African Art"
        />
        <meta
          property="og:description"
          content="Get your African art seen by international collectors. Free certification, global marketplace, secure transactions."
        />
        <meta property="og:url" content="https://kucibok.com/for-artists" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://kucibok.com/for-artists" />
      </Helmet>
      <PortalLayout portal="africa">
        <ForArtistsContent />
      </PortalLayout>
    </>
  )
})
