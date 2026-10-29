import { useState } from 'react'
import { Icon } from '../components/ui/Icon'
import type { StudentQuery } from '../types/queries'

interface QueriesPageProps {
  queries: StudentQuery[]
  onSubmitQuery: (query: StudentQuery) => void
}

const QUERY_CATEGORIES = ['Registration', 'Payment', 'ID Verification', 'Guest Pass', 'Seating', 'Convocation Pass', 'Other']

export function QueriesPage({ queries, onSubmitQuery }: QueriesPageProps) {
  const [category, setCategory] = useState(QUERY_CATEGORIES[0])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('arun.menon@gmail.com')
  const [submitted, setSubmitted] = useState(false)

  const submitQuery = () => {
    if (!subject.trim() || !message.trim() || !email.trim()) return
    const timestamp = 'Just now'
    onSubmitQuery({
      id: `QRY-2026-${String(Date.now()).slice(-4)}`,
      category,
      subject: subject.trim(),
      email: email.trim(),
      status: 'Open',
      createdAt: timestamp,
      messages: [{
        id: `query-message-${Date.now()}`,
        sender: 'Student',
        body: message.trim(),
        sentAt: timestamp,
        channel: 'Portal',
      }],
    })
    setSubject('')
    setMessage('')
    setSubmitted(true)
    window.setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="page queries-page prototype-page">
      <div className="prototype-heading queries-heading">
        <div className="college-title">
          <div className="college-logo"><Icon name="help" size={27} /></div>
          <div>
            <p className="eyebrow">CONVOCATION 2026</p>
            <h1>Queries & Support</h1>
            <p className="page-subtitle">Raise an issue and receive the administrator’s response at your registered email address.</p>
          </div>
        </div>
        <span className="query-support-status"><span /> Admin desk online</span>
      </div>

      <div className="queries-layout">
        <section className="panel query-form-panel">
          <div className="panel-header">
            <div><p className="eyebrow">RAISE A QUERY</p><h2>How can we help?</h2></div>
            <span className="query-response-time"><Icon name="clock" size={14} /> Response within 1 working day</span>
          </div>
          <div className="query-form-grid">
            <label><span>Query category</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{QUERY_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Email for response</span><div className="query-email-input"><Icon name="mail" size={16} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></div></label>
            <label className="query-form-full"><span>Subject</span><input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Briefly describe your issue" /></label>
            <label className="query-form-full"><span>Query or issue</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Provide the details required for the administrator to assist you…" rows={6} /></label>
          </div>
          <div className="query-form-footer">
            <p><Icon name="mail" size={15} /> The administrator’s reply will be recorded here and communicated by email.</p>
            <button type="button" disabled={!subject.trim() || !message.trim() || !email.trim()} onClick={submitQuery}>Submit query <Icon name="arrow" size={16} /></button>
          </div>
          {submitted && <div className="query-submitted"><Icon name="check" size={17} /> Your query was submitted successfully.</div>}
        </section>

        <aside className="panel query-help-card">
          <span><Icon name="help" size={23} /></span>
          <p className="eyebrow">SUPPORT INFORMATION</p>
          <h2>Convocation Help Desk</h2>
          <p>For urgent ceremony-day assistance, contact the administration counter at the auditorium.</p>
          <dl><div><dt>Support hours</dt><dd>09:00 AM – 05:00 PM</dd></div><div><dt>Email channel</dt><dd>convocation@srm.edu.in</dd></div></dl>
        </aside>
      </div>

      <section className="query-history-section">
        <div className="query-history-heading"><div><p className="eyebrow">MY QUERIES</p><h2>Support history</h2></div><span>{queries.length} tickets</span></div>
        <div className="query-ticket-list">
          {queries.map((query) => (
            <article className="panel query-ticket" key={query.id}>
              <div className="query-ticket-heading">
                <div><span className="query-ticket-id">{query.id}</span><span className="query-ticket-category">{query.category}</span></div>
                <span className={`query-ticket-status ${query.status.toLowerCase()}`}>{query.status}</span>
              </div>
              <h3>{query.subject}</h3>
              <small>Raised {query.createdAt} · Responses sent to {query.email}</small>
              <div className="query-conversation">
                {query.messages.map((item) => (
                  <div className={`query-message ${item.sender === 'Administrator' ? 'admin' : 'student'}`} key={item.id}>
                    <span className="query-message-avatar"><Icon name={item.sender === 'Administrator' ? 'shield' : 'user'} size={15} /></span>
                    <div><div><strong>{item.sender}</strong><span>{item.channel === 'Email' && <Icon name="mail" size={12} />} {item.channel} · {item.sentAt}</span></div><p>{item.body}</p></div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
