import { Helmet } from "react-helmet"
import Gateway from "../components/landing/Gateway"

export default function GatewayPage() {
  return (
    <>
      <Helmet>
        <title>Kucibok Bridge — Infrastructure de l'art africain</title>
        <meta name="description" content="Kucibok Bridge — Infrastructure SaaS de référence pour la certification, traçabilité et circulation sécurisée de l'art africain entre l'Afrique et le monde." />
        <meta property="og:title" content="Kucibok Bridge — Infrastructure de l'art africain" />
        <meta property="og:description" content="Kucibok Bridge — Infrastructure SaaS de référence pour la certification, traçabilité et circulation sécurisée de l'art africain." />
        <meta property="og:url" content="https://kucibok.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://kucibok.com/images/og-cover.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://kucibok.com/" />
      </Helmet>
      <Gateway />
    </>
  )
}
