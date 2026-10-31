import { useState } from 'react'
import { Icon } from '../components/ui/Icon'
import type { StudentQuery } from '../types/queries'

interface QueriesPageProps {
  queries: StudentQuery[]
  onSubmitQuery: (query: StudentQuery) => void
  onReplyQuery: (queryId: string, body: string) => void
  showQueryForm: boolean
  onCloseQueryForm: () => void
}

const QUERY_CATEGORIES = ['Registration', 'Payment', 'ID Verification', 'Guest Pass', 'Seating', 'Convocation Pass', 'Other']

export function QueriesPage({ queries, onSubmitQuery, onReplyQuery, showQueryForm, onCloseQueryForm }: QueriesPageProps) {
  const [category, setCategory] = useState(QUERY_CATEGORIES[0])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('arun.menon@gmail.com')
  const [submitted, setSubmitted] = useState(false)
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null)

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
    onCloseQueryForm()
    setSubmitted(true)
    window.setTimeout(() => setSubmitted(false), 3000)
  }

  const submitReply = (queryId: string) => {
    const body = replyDrafts[queryId]?.trim()
    if (!body) return
    onReplyQuery(queryId, body)
    setReplyDrafts((drafts) => ({ ...drafts, [queryId]: '' }))
    setActiveReplyId(null)
  }

  return (
    <div className="page queries-page prototype-page">
      {showQueryForm && (
        <section className="panel query-form-panel">
          <div className="panel-header">
            <div><p className="eyebrow">NEW QUERY</p><h2>Queries & Support</h2></div>
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
        </section>
      )}

      {submitted && <div className="query-submitted"><Icon name="check" size={17} /> Your query was submitted successfully.</div>}

      <section className={`query-history-section ${showQueryForm ? '' : 'standalone'}`}>
        <div className="query-history-heading"><div><p className="eyebrow">MY QUERIES</p><h2>Support History</h2></div><span>{queries.length} tickets</span></div>
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
                <div className="query-comment-count">{query.messages.length} {query.messages.length === 1 ? 'comment' : 'comments'}</div>
                {query.messages.map((item) => (
                  <div className={`query-message ${item.sender === 'Administrator' ? 'admin' : 'student'}`} key={item.id}>
                    <span className="query-message-avatar"><Icon name={item.sender === 'Administrator' ? 'shield' : 'user'} size={15} /></span>
                    <div><div><strong>{item.sender}</strong><span>{item.channel === 'Email' && <Icon name="mail" size={12} />} {item.channel} · {item.sentAt}</span></div><p>{item.body}</p></div>
                  </div>
                ))}
                <div className={`query-reply-composer ${activeReplyId === query.id ? 'active' : ''}`}>
                  <span className="query-reply-avatar">AM</span>
                  <div>
                    <textarea
                      rows={1}
                      value={replyDrafts[query.id] || ''}
                      placeholder="Add a reply…"
                      aria-label={`Reply to ${query.subject}`}
                      onFocus={() => setActiveReplyId(query.id)}
                      onChange={(event) => setReplyDrafts((drafts) => ({ ...drafts, [query.id]: event.target.value }))}
                    />
                    {activeReplyId === query.id && (
                      <div className="query-reply-actions">
                        <button type="button" className="query-reply-cancel" onClick={() => {
                          setReplyDrafts((drafts) => ({ ...drafts, [query.id]: '' }))
                          setActiveReplyId(null)
                        }}>Cancel</button>
                        <button type="button" className="query-reply-submit" disabled={!replyDrafts[query.id]?.trim()} onClick={() => submitReply(query.id)}>Reply</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
