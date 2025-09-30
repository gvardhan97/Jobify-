import CreateJobForm from '@/components/CreateJobForm'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'

function AddJobPage() {
  const queryClient = new QueryClient()
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CreateJobForm />
    </HydrationBoundary>
  )
}
export default AddJobPage

//This tag is used to "hydrate" the pre-fetched server data into the browser.
//HydrationBoundary gives that preloaded data to the client (browser) so React Query doesn't refetch it again
//improves performance & avoids duplicate requests
