import { Icon } from '../components/ui/Icon'

interface InstructionsPageProps {
  onStartRegistration?: () => void
}

export function InstructionsPage({ onStartRegistration }: InstructionsPageProps) {
  return (
    <div className="page instructions-page prototype-page">
      {/* 00 | Hero Event Banner */}
      <section className="instructions-event-banner" aria-label="Ceremony overview">
        <div className="instructions-event-lead">
          <span><Icon name="calendar" size={22} /></span>
          <div>
            <small>CEREMONY DATE</small>
            <strong>29 November 2026</strong>
          </div>
        </div>
        <div>
          <small>TIME</small>
          <strong>11:00 AM – 01:00 PM (Expected)</strong>
        </div>
        <div>
          <small>VENUE</small>
          <strong>Dr. T. P. Ganesan Auditorium</strong>
        </div>
        <div>
          <small>REPORTING</small>
          <strong>Arrive well in advance for registration</strong>
        </div>
      </section>

      {/* 01 | Before You Arrive */}
      <section className="instructions-section-card panel">
        <div className="instructions-card-header">
          <span><Icon name="check" size={22} /></span>
          <div>
            <span className="section-tag">01 | Preparation</span>
            <h2>Before You Arrive</h2>
          </div>
        </div>
        <p className="instructions-section-desc">
          Complete the following requirements before arriving at the venue.
        </p>

        <ul className="instructions-items-list instructions-crucial-list">
          <li className="instructions-item-row">
            <span className="instructions-item-badge">1</span>
            <div className="instructions-item-content">
              <strong>Check App Notifications:</strong> Regularly check the student app for important updates and announcements.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">2</span>
            <div className="instructions-item-content">
              <strong>Fee Payment:</strong> Ensure that all applicable tuition fees and examination fees are paid before attending the ceremony.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">3</span>
            <div className="instructions-item-content">
              <strong>Graduation Pass:</strong> Keep your Graduation Pass ready and check the programme and venue details mentioned on it.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">4</span>
            <div className="instructions-item-content">
              <strong>Dress Code:</strong> All graduands must wear formal attire.
              <div className="instructions-dress-code-alert">
                <Icon name="shield" size={16} />
                <span>BLACK COLOUR DRESSES ARE STRICTLY NOT PERMITTED.</span>
              </div>
            </div>
          </li>
        </ul>
      </section>

      {/* 02 | Venue Procedure & Locations */}
      <section className="instructions-section-card panel">
        <div className="instructions-card-header">
          <span><Icon name="location" size={22} /></span>
          <div>
            <span className="section-tag">02 | On-Campus Sequence</span>
            <h2>Venue Procedure &amp; Locations</h2>
          </div>
        </div>
        <p className="instructions-section-desc">
          Follow the designated arrangements and instructions on the day of the ceremony.
        </p>

        <ul className="instructions-items-list">
          <li className="instructions-item-row">
            <span className="instructions-item-badge">1</span>
            <div className="instructions-item-content">
              <strong>Graduation Pass Verification &amp; Kit Collection:</strong> Students must present their Graduation Pass upon arrival at the campus. After verification, they will receive their Graduation Kit, and their attendance will be marked as present.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">2</span>
            <div className="instructions-item-content">
              <strong>Breakfast:</strong> Proceed to the designated breakfast area.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">3</span>
            <div className="instructions-item-content">
              <strong>Auditorium Entry:</strong> Arrive on time. Late comers will not be permitted at any circumstances.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">4</span>
            <div className="instructions-item-content">
              <strong>Auditorium:</strong> Enter the auditorium and occupy your respective seat as instructed by your pass.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">5</span>
            <div className="instructions-item-content">
              <strong>Certificate Distribution:</strong> Degree certificates will be distributed by the faculties in your respective seat.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">6</span>
            <div className="instructions-item-content">
              <strong>Photo Session:</strong> After the ceremony is over you can take the photos with the dignitaries as per the programme wise which will be instructed to you at the time (which is mentioned in the post graduate photo session section).
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">7</span>
            <div className="instructions-item-content">
              <strong>Lunch:</strong> Proceed to the designated lunch venue after the ceremony.
            </div>
          </li>
        </ul>

        {/* Venue Maps & Parking Cards */}
        <div className="instructions-venue-locations">
          <div className="instructions-venue-box">
            <span className="venue-type">LUNCH VENUE</span>
            <h4>Sannasi Hostel</h4>
            <a
              href="https://maps.google.com/?q=Sannasi+Hostel+SRM+University+Kattankulathur"
              target="_blank"
              rel="noopener noreferrer"
              className="map-link"
            >
              <Icon name="map" size={14} /> View Location on Google Maps
            </a>
          </div>

          <div className="instructions-venue-box">
            <span className="venue-type">CAR PARKING</span>
            <h4>Playground (In front of Dr. T. P. Ganesan Auditorium)</h4>
            <a
              href="https://maps.google.com/?q=Dr.+T.P.+Ganesan+Auditorium+SRM+University"
              target="_blank"
              rel="noopener noreferrer"
              className="map-link"
            >
              <Icon name="map" size={14} /> View Parking Location on Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* 03 | Auditorium Conduct */}
      <section className="instructions-section-card panel">
        <div className="instructions-card-header">
          <span><Icon name="cap" size={22} /></span>
          <div>
            <span className="section-tag">03 | Discipline &amp; Decorum</span>
            <h2>Auditorium Conduct</h2>
          </div>
        </div>
        <p className="instructions-section-desc">
          Maintain the dignity and decorum of the academic ceremony by following these instructions.
        </p>

        <ul className="instructions-items-list">
          <li className="instructions-item-row">
            <span className="instructions-item-badge">1</span>
            <div className="instructions-item-content">
              <strong>Invocation &amp; National Anthem:</strong> Please rise for the Invocation and National Anthem and remain standing until they are completed.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">2</span>
            <div className="instructions-item-content">
              <strong>Maintain Silence:</strong> Do not talk or murmur. Maintain <strong>ABSOLUTE SILENCE</strong> inside the auditorium.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">3</span>
            <div className="instructions-item-content">
              <strong>No Whistling:</strong> Whistling is strictly prohibited inside the auditorium.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">4</span>
            <div className="instructions-item-content">
              <strong>Mobile Phones:</strong> Keep mobile phones on silent mode during the ceremony.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">5</span>
            <div className="instructions-item-content">
              <strong>Student Discipline:</strong> Follow all instructions given by faculty members, volunteers and event coordinators.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">6</span>
            <div className="instructions-item-content">
              <strong>Emergency Instructions:</strong> If instructed to vacate the auditorium or move outside, cooperate immediately and follow the instructions patiently.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">7</span>
            <div className="instructions-item-content">
              <strong>First Rank Holders:</strong> When called, proceed to the dais in the prescribed order, bow respectfully to the Chief Guest and the Vice-Chancellor, receive the degree certificate and return to your seat promptly.
            </div>
          </li>
        </ul>
      </section>

      {/* 04 | Post-Graduation Photo Session */}
      <section className="instructions-section-card panel">
        <div className="instructions-card-header">
          <span><Icon name="camera" size={22} /></span>
          <div>
            <span className="section-tag">04 | Photography Schedule</span>
            <h2>Post-Graduation Photo Session</h2>
          </div>
        </div>
        <p className="instructions-section-desc">
          The photo session will commence after the completion of the Graduation Day ceremony. Students must report to their respective programme-wise photo session venues.
        </p>

        <div className="instructions-table-wrap">
          <table className="instructions-table">
            <thead>
              <tr>
                <th>Programme</th>
                <th>Photo Session Venue</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>MBA (Online)</strong></td>
                <td>Main Auditorium</td>
              </tr>
              <tr>
                <td><strong>MCA (Online), MBA (Distance) &amp; MCA (Distance)</strong></td>
                <td>Mini Hall 1 (Inside the Main Auditorium)</td>
              </tr>
              <tr>
                <td><strong>BBA (Online) &amp; BCA (Online)</strong></td>
                <td>Mini Hall 2 (Inside the Main Auditorium)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 05 | Important Restrictions & Instructions */}
      <section className="instructions-section-card panel">
        <div className="instructions-card-header">
          <span><Icon name="shield" size={22} /></span>
          <div>
            <span className="section-tag">05 | Crucial Guidelines</span>
            <h2>Important Restrictions &amp; Instructions</h2>
          </div>
        </div>

        <ul className="instructions-items-list">
          <li className="instructions-item-row">
            <span className="instructions-item-badge">1</span>
            <div className="instructions-item-content">
              <strong>Guest Entry:</strong> Guests and family members are not permitted inside the auditorium.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">2</span>
            <div className="instructions-item-content">
              <strong>Guest Expenses:</strong> Students must bear all guest-related expenses. DODE will not reimburse them.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">3</span>
            <div className="instructions-item-content">
              <strong>Original Marksheet:</strong> Students with unpaid tuition or examination fees will receive only a photocopy.
            </div>
          </li>
        </ul>
      </section>

      {/* Action Required Callout */}
      <section className="instructions-important">
        <div className="instructions-important-icon"><Icon name="award" size={23} /></div>
        <div>
          <p className="eyebrow">IMPORTANT – ACTION REQUIRED</p>
          <h2>All graduands are requested to:</h2>
          <ul>
            <li>Read all the guidelines carefully before attending the ceremony.</li>
            <li>Check app notifications regularly for the latest updates.</li>
            <li>Keep their Graduation Pass ready.</li>
            <li>Arrive at the venue on time.</li>
            <li>Follow the instructions of faculty members and event coordinators throughout the event.</li>
          </ul>
        </div>
      </section>

      {/* Cooperation is Essential Banner */}
      <section className="instructions-cooperation-banner">
        <h3>YOUR COOPERATION IS ESSENTIAL!</h3>
        <p>
          Maintain discipline, patience and decorum throughout the ceremony. Your cooperation will help ensure a smooth and memorable Graduation Day celebration.
        </p>
        <p>
          We look forward to celebrating this important academic milestone with you!
        </p>
        <div className="instructions-cooperation-signoff">
          <strong>DIRECTORATE OF ONLINE EDUCATION</strong>
          <span>SRM INSTITUTE OF SCIENCE AND TECHNOLOGY</span>
        </div>
      </section>

      {/* Footer Navigation Action */}
      <div className="instructions-actions">
        <p><Icon name="help" size={17} /> Need assistance? Contact the DODE student support desk before the ceremony date.</p>
        {onStartRegistration && (
          <button type="button" className="flow-primary" onClick={onStartRegistration}>
            View Registration Details <Icon name="arrow" size={18} />
          </button>
        )}
      </div>
    </div>
  )
}
