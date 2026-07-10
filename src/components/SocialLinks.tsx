import { profile } from '../data/content'
import { GitHubIcon, LinkedInIcon, MailIcon } from './Icons'

interface Props {
  className?: string
  size?: number
}

/** GitHub / LinkedIn / Email — used in every view. */
export default function SocialLinks({ className = '', size = 18 }: Props) {
  const links = [
    { href: profile.github, label: 'GitHub', Icon: GitHubIcon },
    { href: profile.linkedin, label: 'LinkedIn', Icon: LinkedInIcon },
    { href: `mailto:${profile.email}`, label: 'Email', Icon: MailIcon },
  ]
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith('mailto') ? undefined : '_blank'}
          rel="noreferrer"
          aria-label={label}
          className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-gold/50 hover:text-gold focus-visible:border-gold/50 focus-visible:text-gold"
        >
          <Icon width={size} height={size} />
        </a>
      ))}
    </div>
  )
}
