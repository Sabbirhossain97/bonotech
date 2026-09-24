import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import bonotechLogo from '@/assets/bonotech-logo-white.svg'
import type { SplashScreenProps } from './SplashScreen.types'

type SplashPhase = 'enter' | 'hold' | 'exit'

const ENTER_MS = 1400
const HOLD_MS = 700
const EXIT_MS = 650
const PREVIEW_HOLD_MS = 100_000

/** Full lockup display width (px) at desktop; mark is ~16% of the artboard. */
const LOGO_WIDTH_DESKTOP = 340
const LOGO_WIDTH_MOBILE = 260
const MARK_RATIO = 330 / 2019

const ease = [0.22, 1, 0.36, 1] as const

function useLogoSizes() {
    return useMemo(() => {
        const isMobile =
            typeof window !== 'undefined' && window.innerWidth < 640
        const full = isMobile ? LOGO_WIDTH_MOBILE : LOGO_WIDTH_DESKTOP
        return {
            full,
            mark: Math.round(full * MARK_RATIO),
            height: isMobile ? 36 : 44,
        }
    }, [])
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
    const [phase, setPhase] = useState<SplashPhase>('enter')
    const sizes = useLogoSizes()
    const preview =
        typeof window !== 'undefined' &&
        new URLSearchParams(window.location.search).has('splashPreview')

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = ''
        }
    }, [])

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches

        if (prefersReducedMotion && !preview) {
            onComplete()
            return
        }

        const holdMs = preview ? PREVIEW_HOLD_MS : HOLD_MS
        const holdTimer = window.setTimeout(() => setPhase('hold'), ENTER_MS)
        const exitTimer = window.setTimeout(
            () => {
                if (preview) return
                setPhase('exit')
            },
            ENTER_MS + holdMs,
        )
        const completeTimer = window.setTimeout(
            () => {
                if (preview) return
                onComplete()
            },
            ENTER_MS + holdMs + EXIT_MS,
        )

        return () => {
            window.clearTimeout(holdTimer)
            window.clearTimeout(exitTimer)
            window.clearTimeout(completeTimer)
        }
    }, [onComplete, preview])

    return (
        <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#020914]"
            initial={{ y: 0 }}
            animate={{ y: phase === 'exit' ? '-100%' : 0 }}
            transition={{ duration: EXIT_MS / 1000, ease }}
            aria-hidden="true"
        >
            <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, y: 36, filter: 'blur(10px)' }}
                animate={{
                    opacity: phase === 'exit' ? 0.9 : 1,
                    y: phase === 'exit' ? -10 : 0,
                    filter: 'blur(0px)',
                }}
                transition={{ duration: ENTER_MS / 1000, ease }}
            >
                {/*
                  One continuous reveal: clip starts at the mark width (icon
                  centered), then opens to the full lockup so the wordmark
                  emerges smoothly without remounting or a second slide.
                */}
                <motion.div
                    className="overflow-hidden"
                    initial={{ width: sizes.mark }}
                    animate={{ width: sizes.full }}
                    transition={{
                        duration: ENTER_MS / 1000,
                        ease,
                        delay: 0.12,
                    }}
                    style={{ height: sizes.height }}
                >
                    <img
                        src={bonotechLogo}
                        alt=""
                        draggable={false}
                        className="block max-w-none object-contain object-left"
                        style={{
                            width: sizes.full,
                            height: sizes.height,
                        }}
                    />
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
