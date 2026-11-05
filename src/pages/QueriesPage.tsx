import { useState } from 'react'
import { Icon } from '../components/ui/Icon'
import type { StudentQuery } from '../types/queries'

interface QueriesPageProps {
  queries: StudentQuery[]
  onSubmitQuery: (query: StudentQuery) => void
  onReplyQuery: (queryId: string, body: string, attachmentName?: string) => void
  showQueryForm: boolean
  onCloseQueryForm: () => void
}

const QUERY_CATEGORIES = ['Registration', 'Payment', 'ID Verification', 'Guest Pass', 'Seating', 'Convocation Pass', 'Other']

export function QueriesPage({ queries, onSubmitQuery, onReplyQuery, showQueryForm, onCloseQueryForm }: QueriesPageProps) {
  const [category, setCategory] = useState(QUERY_CATEGORIES[0])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [attachment, setAttachment] = useState<File | null>(null)
  const [attachmentInputKey, setAttachmentInputKey] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null)
  const [replyAttachment, setReplyAttachment] = useState<File | null>(null)
  const [replyAttachmentInputKey, setReplyAttachmentInputKey] = useState(0)

  const selectedQuery = queries.find((query) => query.id === selectedQueryId)

  const submitQuery = () => {
    if (!subject.trim() || !message.trim()) return
    const timestamp = 'Just now'
    onSubmitQuery({
      id: `QRY-2026-${String(Date.now()).slice(-4)}`,
      category,
      subject: subject.trim(),
      email: 'arun.menon@gmail.com',
      attachmentName: attachment?.name,
      status: 'Open',
      createdAt: timestamp,
      messages: [{
        id: `query-message-${Date.now()}`,
        sender: 'Student',
        body: message.trim(),
        attachmentName: attachment?.name,
        sentAt: timestamp,
        channel: 'Portal',
      }],
    })
    setSubject('')
    setMessage('')
    setAttachment(null)
    setAttachmentInputKey((key) => key + 1)
    setSelectedQueryId(null)
    onCloseQueryForm()
    setSubmitted(true)
    window.setTimeout(() => setSubmitted(false), 3000)
  }

  const submitReply = (queryId: string) => {
    const body = replyDrafts[queryId]?.trim() || ''
    if (!body && !replyAttachment) return
    onReplyQuery(queryId, body || 'Attachment shared.', replyAttachment?.name)
    setReplyDrafts((drafts) => ({ ...drafts, [queryId]: '' }))
    setReplyAttachment(null)
    setReplyAttachmentInputKey((key) => key + 1)
  }

  const clearReply = (queryId: string) => {
    setReplyDrafts((drafts) => ({ ...drafts, [queryId]: '' }))
    setReplyAttachment(null)
    setReplyAttachmentInputKey((key) => key + 1)
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
            <label>
              <span>Attach photo or file (optional)</span>
              <div className="query-attachment-input">
                <Icon name="file" size={16} />
                <input key={attachmentInputKey} type="file" accept="image/*,.pdf,.doc,.docx" onChange={(event) => setAttachment(event.target.files?.[0] || null)} />
              </div>
            </label>
            <label className="query-form-full"><span>Subject</span><input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Briefly describe your issue" /></label>
            <label className="query-form-full"><span>Query or issue</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Provide the details required for the administrator to assist you…" rows={6} /></label>
          </div>
          <div className="query-form-footer">
            <p><Icon name="mail" size={15} /> The administrator’s reply will be recorded here and communicated by email.</p>
            <button type="button" disabled={!subject.trim() || !message.trim()} onClick={submitQuery}>Submit query <Icon name="arrow" size={16} /></button>
          </div>
        </section>
      )}

      {submitted && <div className="query-submitted"><Icon name="check" size={17} /> Your query was submitted successfully.</div>}

      {!showQueryForm && selectedQuery && (
        <section className="query-ticket-page">
          <div className="query-ticket-page-heading">
            <button type="button" onClick={() => setSelectedQueryId(null)}><Icon name="chevron" size={16} /> Back to Support History</button>
            <span className={`query-ticket-status ${selectedQuery.status.toLowerCase()}`}>{selectedQuery.status}</span>
          </div>

          <article className="panel query-ticket-detail-panel">
            <header className="query-ticket-detail-header">
              <div>
                <div className="query-ticket-detail-meta"><span className="query-ticket-id">{selectedQuery.id}</span><span className="query-ticket-category">{selectedQuery.category}</span></div>
                <h2>{selectedQuery.subject}</h2>
                <p>Raised {selectedQuery.createdAt} · Responses sent to {selectedQuery.email}</p>
                {selectedQuery.attachmentName && <span className="query-attachment-name"><Icon name="file" size={13} /> Attached: {selectedQuery.attachmentName}</span>}
              </div>
              <span>{selectedQuery.messages.length} {selectedQuery.messages.length === 1 ? 'comment' : 'comments'}</span>
            </header>

            <div className="query-conversation">
              <div className="query-comment-count">Conversation · {selectedQuery.messages.length} {selectedQuery.messages.length === 1 ? 'comment' : 'comments'}</div>
              {selectedQuery.messages.map((item) => (
                <div className={`query-message ${item.sender === 'Administrator' ? 'admin' : 'student'}`} key={item.id}>
                  <span className="query-message-avatar"><Icon name={item.sender === 'Administrator' ? 'shield' : 'user'} size={15} /></span>
                  <div>
                    <div><strong>{item.sender}</strong><span>{item.channel === 'Email' && <Icon name="mail" size={12} />} {item.channel} · {item.sentAt}</span></div>
                    <p>{item.body}</p>
                    {item.attachmentName && <span className="query-message-attachment"><Icon name="file" size={13} /> {item.attachmentName}</span>}
                  </div>
                </div>
              ))}

              <div className="query-reply-composer active">
                <span className="query-reply-avatar">AM</span>
                <div>
                  <textarea rows={3} value={replyDrafts[selectedQuery.id] || ''} placeholder="Add a reply…" aria-label={`Reply to ${selectedQuery.subject}`} onChange={(event) => setReplyDrafts((drafts) => ({ ...drafts, [selectedQuery.id]: event.target.value }))} />
                  <div className="query-reply-toolbar">
                    <label className="query-reply-attachment-button">
                      <input key={replyAttachmentInputKey} type="file" accept="image/*,.pdf,.doc,.docx" onChange={(event) => setReplyAttachment(event.target.files?.[0] || null)} />
                      <Icon name="file" size={14} /> {replyAttachment ? replyAttachment.name : 'Attach photo or file'}
                    </label>
                    <div className="query-reply-actions">
                      <button type="button" className="query-reply-cancel" onClick={() => clearReply(selectedQuery.id)}>Cancel</button>
                      <button type="button" className="query-reply-submit" disabled={!replyDrafts[selectedQuery.id]?.trim() && !replyAttachment} onClick={() => submitReply(selectedQuery.id)}>Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>
      )}

      {!showQueryForm && !selectedQuery && (
        <section className="query-history-section standalone">
          <div className="query-history-heading"><div><p className="eyebrow">MY QUERIES</p><h2>Support History</h2></div><span>{queries.length} tickets</span></div>
          <div className="query-ticket-table-wrap panel">
            <table className="query-ticket-table">
              <thead><tr><th>Ticket ID</th><th>Subject</th><th>Category</th><th>Raised</th><th>Status</th><th>Replies</th><th>Action</th></tr></thead>
              <tbody>
                {queries.map((query) => (
                  <tr className="query-table-row" key={query.id}>
                    <td><span className="query-ticket-id">{query.id}</span></td>
                    <td><strong className="query-table-subject">{query.subject}</strong></td>
                    <td><span className="query-ticket-category">{query.category}</span></td>
                    <td><span className="query-table-date">{query.createdAt}</span></td>
                    <td><span className={`query-ticket-status ${query.status.toLowerCase()}`}>{query.status}</span></td>
                    <td><span className="query-table-replies">{query.messages.length}</span></td>
                    <td><button type="button" className="query-view-button" onClick={() => setSelectedQueryId(query.id)}>View <Icon name="arrow" size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
