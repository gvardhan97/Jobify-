import EditJobForm from '@/components/EditJobForm'
import { getSingleJobAction } from '@/utils/actions'

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'

async function JobDetailPage({ params }: { params: { id: string } }) {
  //server component so params not searchparams

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['job', params.id],
    queryFn: () => getSingleJobAction(params.id), //fetch that singlejob details
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditJobForm jobId={params.id} />
    </HydrationBoundary>
  )
}
export default JobDetailPage
