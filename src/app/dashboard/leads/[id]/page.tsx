import Link from 'next/link'
import LeadDetailContent from '@/components/lead-detail-content'

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/leads"
        className="mb-6 inline-block text-sm text-fg-subtle transition-colors duration-fast hover:text-fg"
      >
        &larr; Back to leads
      </Link>
      <LeadDetailContent id={id} />
    </div>
  )
}
