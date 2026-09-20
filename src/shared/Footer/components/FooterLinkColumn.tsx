import { Link } from 'react-router-dom'
import type { FooterLinkGroup } from '../Footer.types'

interface FooterLinkColumnProps {
    group: FooterLinkGroup
}

export function FooterLinkColumn({ group }: FooterLinkColumnProps) {
    return (
        <div className="flex flex-col gap-5">
            {/* Column header — uppercase, tracked, subtle */}
            <span className="font-body text-[11px] leading-[1.4] font-semibold tracking-[0.1em] uppercase text-white opacity-35">
                {group.title}
            </span>

            {/* Links */}
            <nav
                aria-label={`${group.title} links`}
                className="flex flex-col gap-3.5"
            >
                {group.links.map((link) => {
                    const className =
                        'group font-body text-sm leading-[1.5] font-normal text-white no-underline opacity-65 inline-flex items-center gap-2 transition-(--transition-base) hover:opacity-100'
                    const inner = (
                        <>
                            <span className="relative">
                                {link.label}
                                <span
                                    className="absolute bottom-0 left-0 h-px bg-white/40 w-0 group-hover:w-full transition-all duration-300 ease-out"
                                    aria-hidden="true"
                                />
                            </span>
                            {link.badge && (
                                <span className="font-body inline-flex items-center justify-center text-[9px] font-bold leading-none tracking-[0.06em] uppercase text-white bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.06))] border border-[rgba(255,255,255,0.18)] rounded-full px-2 py-[3px] backdrop-blur-sm">
                                    {link.badge}
                                </span>
                            )}
                        </>
                    )
                    return link.internal ? (
                        <Link key={link.label} to={link.href} className={className}>
                            {inner}
                        </Link>
                    ) : (
                        <a key={link.label} href={link.href} className={className}>
                            {inner}
                        </a>
                    )
                })}
            </nav>
        </div>
    )
}
