'use server'

import prisma from './db'
import { auth } from '@clerk/nextjs/server'
import { JobType, CreateAndEditJobType, createAndEditJobSchema } from './types'
import { redirect } from 'next/navigation'
import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'

function authenticateAndRedirect(): string {
  const { userId } = auth()

  if (!userId) {
    redirect('/')
  }
  return userId
}

export async function createJobAction(
  values: CreateAndEditJobType
): Promise<JobType | null> {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  const userId = authenticateAndRedirect()
  try {
    createAndEditJobSchema.parse(values)
    const job: JobType = await prisma.job.create({
      data: {
        ...values,
        clerkId: userId,
      },
    })
    return job
  } catch (error) {
    console.error(error)
    return null
  }
}

//GetAllJobActionTypes
// This function fetches a paginated list of jobs for the currently signed-in user, along with the total count and number of pages.

// It first ensures you’re logged in by calling the authentication helper; if you aren’t, it redirects you to log in and then returns your user ID.

// Next, it prepares a base filter so that only jobs belonging to your user ID are considered.

// If you’ve supplied a search term, it expands that filter to include any job whose title or company name contains the search text.

// If you’ve chosen a specific status (and it’s not “all”), it further narrows the filter to only jobs with that status.
//limit is a number that indicates how many to skip
// It then calculates how many records to skip based on which page you’re on, so page 1 skips zero, page 2 skips the first limit jobs, and so on.

// Using that combined filter and skip count, it queries the database for the current page of jobs, ordering them from newest to oldest by creation date.

// Right after, it runs a separate count query with the same filter to find out how many total jobs match your criteria.

// It divides that total count by the page size (limit) and rounds up to determine how many pages of results there are in total.

// Finally, it returns an object containing the current page’s jobs, the total count, your requested page number, and the total number of pages.

// If anything goes wrong—like a database error—it logs the error and returns empty results with a default of one page.
type GetAllJobsActionTypes = {
  search?: string
  jobStatus?: string
  page?: number
  limit?: number
}

export async function getAllJobsAction({
  search,
  jobStatus,
  page = 1,
  limit = 10,
}: GetAllJobsActionTypes): Promise<{
  jobs: JobType[]
  count: number
  page: number
  totalPages: number
}> {
  const userId = authenticateAndRedirect()
  // await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    //in this block we are adding paramaters to where clause
    let whereClause: Prisma.JobWhereInput = { clerkId: userId }

    if (search) {
      //if search parameter is not empty

      whereClause = {
        ...whereClause,
        OR: [
          {
            position: {
              contains: search,
            },
          },
          {
            company: {
              contains: search,
            },
          },
        ],
      }
    }

    if (jobStatus && jobStatus !== 'all') {
      whereClause = {
        ...whereClause,
        status: jobStatus,
      }
    }

    const skip = (page - 1) * limit // Calculate how many records to skip based on the current page.
    //    E.g., page 1 → skip 0; page 2 → skip `limit` number of jobs.

    //core funciton for getting details
    const jobs: JobType[] = await prisma.job.findMany({
      where: whereClause,
      skip,
      take: limit, //only limit number of jobs are taken
      orderBy: {
        createdAt: 'desc',
      },
    })

    const count: number = await prisma.job.count({
      //get the total count
      where: whereClause,
    })

    const totalPages = Math.ceil(count / limit) //give total pages

    return { jobs, count, page, totalPages }
  } catch (error) {
    console.error(error)
    return { jobs: [], count: 0, page: 1, totalPages: 0 }
  }
}

export async function deleteJobAction(id: string): Promise<JobType | null> {
  const userId = authenticateAndRedirect()

  try {
    const job: JobType = await prisma.job.delete({
      where: {
        id,
        clerkId: userId,
      },
    })
    return job //if success it return the deleted data
  } catch (error) {
    return null //if there is an error it returns the null
  }
}

//get the details of single job
export async function getSingleJobAction(id: string): Promise<JobType | null> {
  let job: JobType | null = null
  const userId = authenticateAndRedirect()

  try {
    job = await prisma.job.findUnique({
      where: {
        id,
        clerkId: userId,
      },
    })
  } catch (error) {
    job = null
  }
  if (!job) {
    redirect('/jobs')
  }
  return job
}

export async function updateJobAction(
  id: string,
  values: CreateAndEditJobType //this contains the updated values
): Promise<JobType | null> {
  const userId = authenticateAndRedirect()

  try {
    const job: JobType = await prisma.job.update({
      where: {
        id,
        clerkId: userId,
      },
      data: {
        ...values,
      },
    })
    return job
  } catch (error) {
    return null
  }
}

//this below funciton for showing no of pendings,interviews,declined and their corresponidng in charts page top

// * This function retrieves how many jobs you have in each status: pending, interview, and declined.
// * First, it checks that you’re logged in; if you’re not, it sends you to log in and gives back your user ID.
// * (Optionally, you could pause briefly here to show a loading placeholder in the UI.)
// * Inside a try-catch, it asks the database for all your jobs, grouping them by their status and counting each group.
// * It tells the database: “Group my jobs by the ‘status’ field, count how many fall into each status, and only include jobs belonging to my user ID.”
// * When the results come back (for example, `{ pending: 5, interview: 2 }`), it converts that into a simple JavaScript object mapping each status name to its count.
// * It then prepares a default object with zeros for all three statuses, so you’ll always see counts for pending, interview, and declined.
// * Next, it merges the real counts into those defaults—overwriting zeros with the actual numbers you have.
// * Finally, it returns that stats object.
// * If anything goes wrong during this process (like a database error), it catches the error and sends you back to the main jobs page.

export async function getStatsAction(): Promise<{
  pending: number
  interview: number
  declined: number
}> {
  const userId = authenticateAndRedirect()
  // just to show Skeleton
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  try {
    const stats = await prisma.job.groupBy({
      by: ['status'], //status -- has either pending or interview or declined
      _count: {
        status: true,
      },
      where: {
        clerkId: userId, // replace userId with the actual clerkId
      },
    })

    // Convert the array of { status, _count: { status: number } }
    // into a flat object like { pending: x, interview: y, declined: z }
    const statsObject = stats.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status
      return acc
    }, {} as Record<string, number>)

    //if any of pending, declined, intterview are not present bydefault it keeps the zero value
    const defaultStats = {
      pending: 0,
      declined: 0,
      interview: 0,
      ...statsObject,
    }

    return defaultStats
  } catch (error) {
    redirect('/jobs')
  }
}

//first fetch all the jobs that fall in 6 months from now
//then for each job extract month and increase it's count

export async function getChartsDataAction(): Promise<
  Array<{ date: string; count: number }>
> {
  const userId = authenticateAndRedirect()
  const sixMonthsAgo = dayjs().subtract(6, 'month').toDate() // 6months days

  try {
    const jobs = await prisma.job.findMany({
      where: {
        clerkId: userId,
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    let applicationsPerMonth = jobs.reduce((acc, job) => {
      const date = dayjs(job.createdAt).format('MMM YY') //convert it's month and date

      const existingEntry = acc.find((entry) => entry.date === date)

      if (existingEntry) {
        existingEntry.count += 1
      } else {
        acc.push({ date, count: 1 })
      }

      return acc
    }, [] as Array<{ date: string; count: number }>)

    return applicationsPerMonth
  } catch (error) {
    redirect('/jobs')
  }
}

// /Ensure user is authenticated; if not, redirect to login. Returns the user’s ID.

// Compute a JS Date representing “six months ago” from right now.

// Fetch all jobs for this user created on or after sixMonthsAgo, sorted oldest first.

// Initialize an empty array to accumulate per-month counts.

// For each job:

// Format its createdAt into "MMM YY" (e.g. "Apr 25").

// If an entry for that month already exists, increment its count.

// Otherwise, push a new { date, count: 1 } entry.

// Return the array of { date: string; count: number } pairs.

// On any error (e.g. DB failure), redirect the user back to /jobs.

// Both functions follow the same pattern:

// Authenticate the user.

// Query the database via Prisma.

// Transform the raw data into a shape your front-end can easily consume.

// Handle errors by redirecting back to a safe page.
