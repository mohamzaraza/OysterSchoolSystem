export type JobPosting = {
  id: string
  created_at: string
  title: string
  campus: string
  employment_type: string
  description: string
  requirements: string[]
}

export function formatJobPostedDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}
