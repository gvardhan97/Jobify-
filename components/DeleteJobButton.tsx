import { Button } from './ui/button'
import { Badge } from './ui/badge'
import JobInfo from './JobInfo'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteJobAction } from '@/utils/actions'
import { useToast } from '@/components/ui/use-toast'

function DeleteJobBtn({ id }: { id: string }) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteJobAction(id),
    onSuccess: (data) => {
      if (!data) {
        toast({ description: 'there was an error' })
        return
      }
      //here we are manually refetching as deleting won't change the parameters of search and status useparameters ,so it's important
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      queryClient.invalidateQueries({ queryKey: ['charts'] })
      //from this component no page navigations as search params are kept constant
      toast({ description: 'job removed' })
    },
  })

  return (
    // i'm just using the button not form so avoiding the onsubmit funtion
    <Button
      size="sm"
      disabled={isPending}
      onClick={() => {
        mutate(id)
      }}
    >
      {isPending ? 'deleting...' : 'delete'}
    </Button>
  )
}
export default DeleteJobBtn
