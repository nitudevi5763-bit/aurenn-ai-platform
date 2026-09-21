import Drawer from '@/components/drawer'
import LeadDetailContent from '@/components/lead-detail-content'

export default async function LeadDrawerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <Drawer>
      <LeadDetailContent id={id} />
    </Drawer>
  )
}
