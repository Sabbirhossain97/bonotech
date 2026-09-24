import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { SplashScreen } from '@/components/SplashScreen/SplashScreen'
import { TermsOfService } from '@/pages/TermsOfService'
import { PrivacyPolicy } from '@/pages/PrivacyPolicy'
import { HomePage } from './pages/home-page/HomePage'
import { scrollToHashOnLoad } from '@/lib/scroll'

function ScrollToTop() {
    const { pathname, hash } = useLocation()
    useEffect(() => {
        if (hash) {
            scrollToHashOnLoad()
            return
        }
        window.scrollTo(0, 0)
    }, [pathname, hash])
    return null
}

export default function App() {
    const [showSplash, setShowSplash] = useState(true)
    const handleSplashComplete = useCallback(() => {
        setShowSplash(false)
        window.dispatchEvent(new Event('bonotech:splash-complete'))
        // Let Projects (sticky stack) remeasure after splash unmounts.
        requestAnimationFrame(() => {
            window.dispatchEvent(new Event('resize'))
            scrollToHashOnLoad()
        })
    }, [])

    return (
        <>
            {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
            <BrowserRouter>
                <ScrollToTop />
                <div className="min-h-screen w-full bg-[var(--ink)] text-[var(--white)]">
                    <Routes>
                        <Route path="/" element={<HomePage/>} />
                        <Route path="/terms" element={<TermsOfService />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </>
    )
}
