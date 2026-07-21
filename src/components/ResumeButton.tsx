import { resumes } from '../data/content'
import { DownloadIcon } from './Icons'

/** One-click download of the single one-page resume. */
export default function ResumeButton() {
  const resume = resumes[0]
  return (
    <a
      href={resume.file}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft"
    >
      <DownloadIcon width={16} height={16} />
      Resume
    </a>
  )
}
