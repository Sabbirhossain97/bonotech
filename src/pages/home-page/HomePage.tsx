import { Navbar } from './components/Navbar'
import Hero from './components/Hero/Hero'
import SprintMetricsSection from './components/SprintMetricsSection'
import ClientShowcaseSection from './components/client-showcase-section/ClientShowcaseSection'
import AboutImpactSection from './components/AboutImpactSection'
import BusinessScopesSection from './components/Business-scopes-section/BusinessScopesSection'
import DeliveryTimesSection from './components/DeliveryTimesSection'
import TechnologyStackSection from './components/TechnologyStackSection'
import TestimonialsSection from './components/TestimonialsSection'
import Footer from '@/components/sections/Footer/Footer'
import DiscoveryCallSection from './components/DiscoveryCallSection'

export function HomePage() {
    return (
        <>
            <Navbar />
            <Hero />
            <SprintMetricsSection />
            <ClientShowcaseSection />
            <AboutImpactSection />
            <BusinessScopesSection />
            <DeliveryTimesSection />
            <TechnologyStackSection />
            <TestimonialsSection />
            <DiscoveryCallSection />
            <Footer />
        </>
    )
}
