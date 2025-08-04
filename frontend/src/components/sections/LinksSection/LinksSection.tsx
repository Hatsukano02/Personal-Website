'use client'

import { SectionWrapper } from '@/components/layouts/SectionWrapper'
import { Typography } from '@/components/ui/Typography'

interface LinksSectionProps {
  id: string
}

export default function LinksSection({ id }: LinksSectionProps) {
  return (
    <SectionWrapper id={id} backgroundVariant="transparent">
      <div className="text-center max-w-4xl mx-auto">
        <Typography variant="h2" className="mb-8 text-light-text-primary dark:text-dark-text-primary">
          Links
        </Typography>
        <Typography variant="body" className="text-light-text-secondary dark:text-dark-text-secondary">
          This is the Links section placeholder. It will be implemented in future phases.
        </Typography>
      </div>
    </SectionWrapper>
  )
}
