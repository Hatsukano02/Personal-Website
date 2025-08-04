'use client'

import { SectionWrapper } from '@/components/layouts/SectionWrapper'
import { Typography } from '@/components/ui/Typography'

interface MediaSectionProps {
  id: string
}

export default function MediaSection({ id }: MediaSectionProps) {
  return (
    <SectionWrapper id={id} backgroundVariant="transparent">
      <div className="text-center max-w-4xl mx-auto">
        <Typography variant="h2" className="mb-8 text-light-text-primary dark:text-dark-text-primary">
          Media
        </Typography>
        <Typography variant="body" className="text-light-text-secondary dark:text-dark-text-secondary">
          This is the Media section placeholder. It will be implemented in future phases.
        </Typography>
      </div>
    </SectionWrapper>
  )
}
