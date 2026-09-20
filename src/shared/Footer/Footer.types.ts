export interface FooterProps {
    className?: string
}

export interface FooterLinkGroup {
    title: string
    links: FooterLink[]
}

export interface FooterLink {
    label: string
    href: string
    badge?: string
    /** Use React Router for in-app navigation (e.g. /privacy, /terms) */
    internal?: boolean
}
