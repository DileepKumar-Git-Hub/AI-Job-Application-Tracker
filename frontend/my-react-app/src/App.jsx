import './assets/css/style.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBarPublic from './components/NavBarPublic'
import PublicView from './components/PublicView'
import Footer from './components/Footer'
import Dashboard from './components/Dashboard'
import SignUp from './components/SignUp'
import LogIn from './components/LogIn'
import AuthProvider from './AuthProvider'
import UploadResume from './components/UploadResume'
import AiFeatures from './components/AiFeatures'
import JobsPage from './components/jobPage'
import ChatBot from './components/ChatBot'
import RouteGuard from './components/RouteGuard'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <NavBarPublic />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<PublicView />} />
              <Route
                path="/dashboard"
                element={
                  <RouteGuard requireAuth>
                    <Dashboard />
                  </RouteGuard>
                }
              />
              <Route
                path="/resume"
                element={
                  <RouteGuard requireAuth>
                    <UploadResume />
                  </RouteGuard>
                }
              />
              <Route
                path="/ai-features"
                element={
                  <RouteGuard requireAuth>
                    <AiFeatures />
                  </RouteGuard>
                }
              />
              <Route
                path="/jobs"
                element={
                  <RouteGuard requireAuth>
                    <JobsPage />
                  </RouteGuard>
                }
              />
              <Route
                path="/login"
                element={
                  <RouteGuard requireUnauth>
                    <LogIn />
                  </RouteGuard>
                }
              />
              <Route
                path="/signup"
                element={
                  <RouteGuard requireUnauth>
                    <SignUp />
                  </RouteGuard>
                }
              />
            </Routes>
          </main>
          <Footer />
          <ChatBot />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
