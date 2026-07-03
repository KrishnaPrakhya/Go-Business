import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="notfound-screen">
      <div className="notfound-code" aria-hidden="true">404</div>
      <h1 className="notfound-title">Page not found</h1>
      <p className="notfound-sub">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="back-link">
        ← Back to dashboard
      </Link>
    </main>
  )
}
