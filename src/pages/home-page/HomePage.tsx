import { BonoExperienceSection } from '@/components/sections/BonoExperienceSection/BonoExperienceSection'
import { FAQ } from '@/components/sections/FAQ/FAQ'
import { Footer } from '@/components/sections/Footer/Footer'
import { Industries } from '@/components/sections/Industries/Industries'
import { Navbar } from './components/Navbar'
import { Projects } from '@/components/sections/Projects/Projects'
import { Scheduling } from '@/components/sections/Scheduling/Scheduling'
import { SpeedSection } from '@/components/sections/SpeedSection/SpeedSection'
import { Testimonials } from '@/components/sections/Testimonials/Testimonials'
import Hero from './components/Hero/Hero'
import SprintMetricsSection from './components/SprintMetricsSection'
import ClientShowcaseSection from './components/client-showcase-section/ClientShowcaseSection'
import AboutImpactSection from './components/AboutImpactSection'
import BusinessScopesSection from './components/Business-scopes-section/BusinessScopesSection'
import DeliveryTimesSection from './components/DeliveryTimesSection'
import TechnologyStackSection from './components/TechnologyStackSection'

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
            <SpeedSection />
            <Projects />
            <Industries />
            <BonoExperienceSection />
            <Testimonials />
            <FAQ />
            <Scheduling />
            <Footer />
        </>
    )
}
