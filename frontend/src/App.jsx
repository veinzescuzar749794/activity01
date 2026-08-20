import { useState } from 'react'
import { request } from './api'

const emptyForm = { username: '', password: '' }

function Alert({ message, type }) {
  return message ? <p className={`alert ${type}`} role="alert">{message}</p> : null
}

function AuthForm({ mode, onSuccess }) {
  const isRegister = mode === 'register'
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const validate = () => {
    const nextErrors = {}
    if (!form.username.trim()) nextErrors.username = 'Username is required.'
    if (!form.password) nextErrors.password = 'Password is required.'
    return nextErrors
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setNotice('')
    setError('')
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setBusy(true)
    try {
      await request(isRegister ? '/register' : '/login', form)
      if (isRegister) {
        setNotice('Registration successful. You can now sign in.')
        setForm(emptyForm)
      } else {
        onSuccess(form.username)
      }
    } catch (requestError) {
      setError(requestError.message || 'Unable to reach the server. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return <section className="card">
    <p className="eyebrow">{isRegister ? 'Create an account' : 'Welcome back'}</p>
    <h1>{isRegister ? 'Register' : 'Sign in'}</h1>
    <p className="description">{isRegister ? 'Use a username and password to create your account.' : 'Enter your details to access your dashboard.'}</p>
    <Alert type="success" message={notice} />
    <Alert type="error" message={error} />
    <form noValidate onSubmit={handleSubmit}>
      <label htmlFor="username">Username</label>
      <input id="username" name="username" type="text" autoComplete="username" value={form.username}
        aria-invalid={Boolean(errors.username)} aria-describedby={errors.username ? 'username-error' : undefined}
        onChange={(e) => setForm({ ...form, username: e.target.value })} />
      {errors.username && <small id="username-error" className="field-error">{errors.username}</small>}
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} value={form.password}
        aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : undefined}
        onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {errors.password && <small id="password-error" className="field-error">{errors.password}</small>}
      <button disabled={busy} type="submit">{busy ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}</button>
    </form>
  </section>
}

function Dashboard({ username, onLogout }) {
  return <section className="card dashboard">
    <p className="eyebrow">Signed in</p>
    <h1>Dashboard</h1>
    <p className="description">Welcome, <strong>{username}</strong>. You have successfully logged in.</p>
    <button className="secondary" onClick={onLogout}>Sign out</button>
  </section>
}

export default function App() {
  const [page, setPage] = useState('login')
  const [username, setUsername] = useState('')

  const signedIn = Boolean(username)
  function navigate(next) { setPage(next) }
  function logout() { setUsername(''); setPage('login') }

  return <main className="shell">
    <nav aria-label="Main navigation">
      <span className="brand">Account Portal</span>
      {!signedIn && <div className="nav-links">
        <button className={page === 'login' ? 'link active' : 'link'} onClick={() => navigate('login')}>Login</button>
        <button className={page === 'register' ? 'link active' : 'link'} onClick={() => navigate('register')}>Register</button>
      </div>}
    </nav>
    {signedIn ? <Dashboard username={username} onLogout={logout} /> : <AuthForm mode={page} onSuccess={setUsername} />}
  </main>
}
