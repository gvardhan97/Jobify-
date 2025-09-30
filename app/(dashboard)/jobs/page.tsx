import JobsList from '@/components/JobsList'
import SearchForm from '@/components/SearchForm'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { getAllJobsAction } from '@/utils/actions'

async function AllJobsPage() {
  const queryClient = new QueryClient()

  //preload/prefetch the data on the server side

  await queryClient.prefetchQuery({
    queryKey: ['jobs', '', 'all', 1],
    queryFn: () => getAllJobsAction({}),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* Hydration” here means: making server-fetched data usable on the client without needing to refetch again. */}
      <SearchForm />
      <JobsList />
    </HydrationBoundary>
  )
}

export default AllJobsPage

//components are client side
