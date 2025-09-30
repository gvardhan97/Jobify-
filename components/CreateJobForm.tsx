'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  JobStatus,
  JobMode,
  createAndEditJobSchema,
  CreateAndEditJobType,
} from '@/utils/types'

import { Form } from '@/components/ui/form'
import { Button } from './ui/button'

import { CustomFormField, CustomFormSelect } from './FormComponents'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createJobAction } from '@/utils/actions'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

function CreateJobForm() {
  // 1. Define your form.

  const form = useForm<CreateAndEditJobType>({
    resolver: zodResolver(createAndEditJobSchema), //use zod for schema checking
    defaultValues: {
      position: '',
      company: '',
      location: '',
      status: JobStatus.Pending,
      mode: JobMode.FullTime,
    }, //when the form is created in the beginning this values are filled to the respective fields,i.e all fields are empty
  })

  const queryClient = useQueryClient()

  const { toast } = useToast()
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateAndEditJobType) => createJobAction(values), //creatingjobaction is called from here with the values it passed

    onSuccess: (data) => {
      if (!data) {
        toast({
          description: 'there was an error',
        })
        return
      }

      toast({ description: 'job created' })

      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      queryClient.invalidateQueries({ queryKey: ['charts'] })

      router.push('/jobs')
      // form.reset();
    },
  })

  function onSubmit(values: CreateAndEditJobType) {
    mutate(values)
  }

  return (
    <Form {...form}>
      <form
        className="bg-muted p-8 rounded"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h2 className="capitalize font-semibold text-4xl mb-6">add job</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
          {/* position */}
          <CustomFormField name="position" control={form.control} />
          {/* company */}
          <CustomFormField name="company" control={form.control} />
          {/* location */}
          <CustomFormField name="location" control={form.control} />
          {/* job status */}
          <CustomFormSelect
            name="status"
            control={form.control}
            labelText="job status"
            items={Object.values(JobStatus)}
          />
          {/* job  type */}
          <CustomFormSelect
            name="mode"
            control={form.control}
            labelText="job mode"
            items={Object.values(JobMode)}
          />
          <Button
            type="submit"
            className="self-end capitalize"
            disabled={isPending}
          >
            {isPending ? 'loading...' : 'create job'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
export default CreateJobForm

// ### ✅ Corrected & Complete Flow of `CreateJobForm`

// 1. **Form is created using `useForm()`**
//    - It uses Zod schema to validate inputs
//    - It has default values

// 2. **Form includes `CustomFormField` and `CustomFormSelect` components**
//    - Each field is **connected to the form** using `control={form.control}`
//    - These fields stay in sync with form values automatically

// 3. **When user types in input**
//    - That value is stored in form's internal state (react-hook-form manages this)
//    - Validation happens if schema rules are broken

// 4. **When "Create Job" button is clicked**
//    - `onSubmit()` is triggered by `form.handleSubmit()`
//    - This `onSubmit(values)` passes the current form values

// 5. **Inside `onSubmit()`**
//    - The `mutate()` function from `react-query` is called
//    - This sends data to `createJobAction(values)` which talks to the database

// 6. **`createJobAction` runs on the server**
//    - It adds a new job in the DB
//    - Returns status or null (error)

// 7. **Based on response from server:**
//    - If job creation is successful, `toast` shows "job created"
//    - If it fails, it shows "there was an error"

// 8. **Data Refetching (important!)**
//    - `queryClient.invalidateQueries(...)` is used to **refresh data**
//      - Refresh `/jobs` list
//      - Refresh stats and charts
//    - This is needed because **Next.js doesn’t reload the page** after routing

// 9. **Navigation**
//    - `router.push('/jobs')` takes the user to the Jobs page
//    - The page is shown without reload (client-side routing)

// ---

// ### 🔁 Why `invalidateQueries`?

// Yes! You were right:
// - Because the page is not reloaded with `router.push`
// - We **manually tell React Query to fetch fresh data**
// - So that `/jobs`, charts, and stats are up to date

// ---

// ### ✅ Final Summary (Cleaned Version)

// > The form has custom fields connected to `react-hook-form`. When the user fills the form and submits, `onSubmit()` sends the data to the server using `mutate`. Based on the result, a toast is shown. Then we call `invalidateQueries` to refresh the job list, stats, and charts. Finally, we route to the `/jobs` page using `router.push`, which doesn't reload the page, so that's why we need to refresh data manually.
