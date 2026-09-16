import { AiApproach } from '@/components/sections/AiApproach/AiApproach'
import { BonoExperienceSection } from '@/components/sections/BonoExperienceSection/BonoExperienceSection'
import { Clients } from '@/components/sections/Clients/Clients'
import { Comparison } from '@/components/sections/Comparison/Comparison'
import { FAQ } from '@/components/sections/FAQ/FAQ'
import { Footer } from '@/components/sections/Footer/Footer'
import { Industries } from '@/components/sections/Industries/Industries'
import { IntroductionSection } from '@/components/sections/IntroductionSection/IntroductionSection'
import { Navbar } from './components/Navbar'
import { Projects } from '@/components/sections/Projects/Projects'
import { Scheduling } from '@/components/sections/Scheduling/Scheduling'
import { SpeedSection } from '@/components/sections/SpeedSection/SpeedSection'
import { Testimonials } from '@/components/sections/Testimonials/Testimonials'
import { TimelineSection } from '@/components/sections/TimelineSection/TimelineSection'
import { WhatWeDo } from '@/components/sections/WhatWeDo/WhatWeDo'
import Hero from './components/Hero/Hero'

export function HomePage() {
    return (
        <>
            <Navbar />
            <Hero />
            <Clients />
            <IntroductionSection />
            <Comparison />
            <WhatWeDo />
            <AiApproach />
            <TimelineSection />
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
