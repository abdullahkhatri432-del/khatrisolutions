import { Suspense, lazy, useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import DemoChrome from '../demos/DemoChrome'
import { getDemo } from '../demos/demoSites'
import { useSeo } from '../hooks/useSeo'

const demoComponents = {
  'atelier-nine': lazy(() => import('../demos/AtelierNine')),
  'wellness-physiotherapy': lazy(() => import('../demos/WellnessPhysio')),
  'saffron-table': lazy(() => import('../demos/SaffronTable')),
  'northline-store': lazy(() => import('../demos/NorthlineStore')),
  'clinic-ops': lazy(() => import('../demos/ClinicOps')),
  'enquiry-triage': lazy(() => import('../demos/EnquiryTriage')),
}

export default function DemoSite() {
  const { slug } = useParams()
  const demo = getDemo(slug)
  const Demo = demoComponents[slug]

  useSeo({
    title: demo ? `${demo.name} — live demo` : 'Demo not found',
    description: demo
      ? `${demo.name} is a ${demo.kind.toLowerCase()} demo site built by Khatri Solutions to demonstrate ${demo.service.toLowerCase()}.`
      : undefined,
    path: `/demos/${slug}`,
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!demo || !Demo) return <Navigate to="/demos" replace />

  return (
    <DemoChrome demo={demo}>
      <Suspense
        fallback={
          <div className="demo-loading" role="status">
            Loading demo…
          </div>
        }
      >
        <Demo />
      </Suspense>
    </DemoChrome>
  )
}
