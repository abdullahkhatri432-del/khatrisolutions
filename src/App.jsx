import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Location from './pages/Location'
import Portfolio from './pages/Portfolio'
import CaseStudy from './pages/CaseStudy'
import DemoSite from './pages/DemoSite'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Reviews from './pages/Reviews'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import BlogList from './pages/BlogList'
import BlogPost from './pages/BlogPost'
import NotFound from './pages/NotFound'

function ServiceDetailRoute() {
  const { slug } = useParams()
  return <ServiceDetail slug={slug} />
}

function LegacyCaseStudyRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/portfolio/${slug}`} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Demos render as standalone sites, without the agency navigation. */}
        <Route path="demos/:slug" element={<DemoSite />} />

        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetailRoute />} />
          <Route path="locations" element={<Navigate to="/locations/india" replace />} />
          <Route path="locations/india" element={<Location />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="portfolio/:slug" element={<CaseStudy />} />
          <Route path="work" element={<Navigate to="/portfolio" replace />} />
          <Route path="work/:slug" element={<LegacyCaseStudyRedirect />} />
          <Route path="demos" element={<Navigate to="/portfolio#demos" replace />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="about" element={<About />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
