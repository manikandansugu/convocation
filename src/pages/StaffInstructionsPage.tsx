import { Icon } from '../components/ui/Icon'

const STAFF_STEPS = [
  {
    number: '08:00 AM',
    title: 'In-person check and graduation kit',
    owner: 'Graduation Kit Distribution Committee',
    detail: 'Scan the graduate’s face, verify attendance against the COE-approved presentee list, and issue the gown, robe, breakfast token, and lunch token.',
    icon: 'tag' as const,
  },
  {
    number: '09:00 AM',
    title: 'Breakfast token validation',
    owner: 'Breakfast Counter',
    detail: 'Validate and redeem the breakfast token before serving the graduate at designated breakfast areas.',
    icon: 'ticket' as const,
  },
  {
    number: '10:00 AM',
    title: 'Auditorium entry & biometric verification',
    owner: 'Auditorium Entrance Team',
    detail: 'Run the second face-recognition check and admit the graduate only after successful verification. Strictly enforce no late entry.',
    icon: 'shield' as const,
  },
  {
    number: '11:00 AM',
    title: 'Seat identification & hall ushering',
    owner: 'Seating Support Team',
    detail: 'Direct graduates and registered faculty to their allotted seats across 52 rows (2,852 seats). Faculty seated in rows A & B.',
    icon: 'grid' as const,
  },
  {
    number: '12:00 PM',
    title: 'In-seat degree certificate distribution',
    owner: 'Registered Faculty',
    detail: 'Identify assigned graduates by seat and handover degree certificates directly in-seat. Withhold original marksheet for fee defaulters.',
    icon: 'award' as const,
  },
  {
    number: '02:00 PM',
    title: 'Lunch token validation & dispersal',
    owner: 'Lunch Counter at Sannasi Hostel',
    detail: 'After photo session concludes, validate and redeem the lunch token before serving graduates at Sannasi Hostel.',
    icon: 'ticket' as const,
  },
]

export function StaffInstructionsPage() {
  return (
    <div className="page instructions-page staff-instructions-content">
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
          <small>STAFF REPORTING</small>
          <strong>07:30 AM (Counters open 08:00 AM)</strong>
        </div>
      </section>

      {/* Operations Directive Summary */}
      <section className="staff-process-summary panel">
        <div>
          <p className="eyebrow">GRADUATION DAY 2026 · OPERATIONS DIRECTIVE</p>
          <h2>Staff Process &amp; Counter Responsibilities</h2>
          <p>
            No registration committee is required on the event day because student registration is completed online. 
            All staff and faculty members are entrusted with enforcing verification, auditorium decorum, and in-seat certificate distribution.
          </p>
        </div>
        <div className="staff-shift-note">
          <Icon name="clock" size={20} />
          <div>
            <strong>09:00 AM staff movement</strong>
            <span>All members remain at kit counters until 09:00 AM; afterwards, 80% move to the auditorium for seating support.</span>
          </div>
        </div>
      </section>

      {/* Operational Timeline Grid */}
      <div className="staff-process-grid">
        {STAFF_STEPS.map((step) => (
          <article className="panel staff-process-step" key={step.number}>
            <span className="staff-process-number">{step.number}</span>
            <span className="staff-process-icon"><Icon name={step.icon} size={20} /></span>
            <div>
              <h3>{step.title}</h3>
              <strong>{step.owner}</strong>
              <p>{step.detail}</p>
            </div>
          </article>
        ))}
      </div>

      {/* 01 | Student Verification & Dress Code Enforcement */}
      <section className="instructions-section-card panel">
        <div className="instructions-card-header">
          <span><Icon name="check" size={22} /></span>
          <div>
            <span className="section-tag">01 | Check-In &amp; Kit Desk Protocol</span>
            <h2>Student Verification &amp; Dress Code Enforcement</h2>
          </div>
        </div>
        <p className="instructions-section-desc">
          Enforce the following verification requirements strictly at the arrival and kit distribution counters.
        </p>

        <ul className="instructions-items-list">
          <li className="instructions-item-row">
            <span className="instructions-item-badge">1</span>
            <div className="instructions-item-content">
              <strong>COE-Approved Presentee Verification:</strong> Only graduates present on the official COE-approved presentee list may be processed. Scan the student's face or check their Graduation Pass QR code before issuing any materials.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">2</span>
            <div className="instructions-item-content">
              <strong>Dress Code Compliance:</strong> All graduands must wear formal attire.
              <div className="instructions-dress-code-alert">
                <Icon name="shield" size={16} />
                <span>BLACK COLOUR DRESSES ARE STRICTLY NOT PERMITTED. Graduands wearing black must be stopped and directed to adhere to the code.</span>
              </div>
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">3</span>
            <div className="instructions-item-content">
              <strong>Graduation Kit Issuance:</strong> Issue the official gown, hood/robe, breakfast token, and lunch token only after biometric attendance verification is confirmed.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">4</span>
            <div className="instructions-item-content">
              <strong>Fee Clearance &amp; Marksheet Policy:</strong> Students who have not paid their applicable tuition fees and/or examination fees are eligible to receive only a photocopy of their marksheet. The original marksheet must not be issued to such students under any circumstance.
            </div>
          </li>
        </ul>
      </section>

      {/* 02 | Venue Procedure & Critical Locations */}
      <section className="instructions-section-card panel">
        <div className="instructions-card-header">
          <span><Icon name="location" size={22} /></span>
          <div>
            <span className="section-tag">02 | Campus Movement &amp; Locations</span>
            <h2>Venue Procedure &amp; Key Locations</h2>
          </div>
        </div>
        <p className="instructions-section-desc">
          Guide students and campus traffic to designated zones according to the following official arrangements.
        </p>

        <ul className="instructions-items-list">
          <li className="instructions-item-row">
            <span className="instructions-item-badge">1</span>
            <div className="instructions-item-content">
              <strong>Strict Punctuality:</strong> Auditorium entry gates will close promptly. Late comers will not be permitted inside the auditorium under any circumstances.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">2</span>
            <div className="instructions-item-content">
              <strong>Seat Allocation Compliance:</strong> Ensure each graduand occupies only their designated seat as indicated on their pass and the digital auditorium layout (52 Rows · 2,852 Seats).
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">3</span>
            <div className="instructions-item-content">
              <strong>Faculty Seating:</strong> Registered faculty members distributing degree certificates are seated in Rows A and B with convenient aisle access.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">4</span>
            <div className="instructions-item-content">
              <strong>In-Seat Certificate Distribution:</strong> Degrees will be distributed directly by assigned faculty members in each student's designated seat.
            </div>
          </li>
        </ul>

        {/* Venue Maps & Parking Cards */}
        <div className="instructions-venue-locations">
          <div className="instructions-venue-box">
            <span className="venue-type">OFFICIAL LUNCH VENUE</span>
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
            <span className="venue-type">DESIGNATED CAR PARKING</span>
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

      {/* 03 | Auditorium Protocol & Decorum Enforcement */}
      <section className="instructions-section-card panel">
        <div className="instructions-card-header">
          <span><Icon name="cap" size={22} /></span>
          <div>
            <span className="section-tag">03 | Discipline &amp; Decorum Enforcement</span>
            <h2>Auditorium Protocol &amp; Hall Supervision</h2>
          </div>
        </div>
        <p className="instructions-section-desc">
          Faculty and staff marshals must maintain strict discipline and dignity throughout the academic proceedings.
        </p>

        <ul className="instructions-items-list">
          <li className="instructions-item-row">
            <span className="instructions-item-badge">1</span>
            <div className="instructions-item-content">
              <strong>Invocation &amp; National Anthem:</strong> All attendees and staff must rise for the Invocation and National Anthem and remain standing until completed.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">2</span>
            <div className="instructions-item-content">
              <strong>Maintain Absolute Silence:</strong> Ensure students do not talk or murmur. Enforce <strong>ABSOLUTE SILENCE</strong> inside the auditorium.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">3</span>
            <div className="instructions-item-content">
              <strong>No Whistling or Cheering:</strong> Whistling and disruptive cheering are strictly prohibited inside the auditorium.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">4</span>
            <div className="instructions-item-content">
              <strong>Mobile Phones Silent:</strong> All mobile devices must be on silent mode during the ceremony.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">5</span>
            <div className="instructions-item-content">
              <strong>First Rank Holders Protocol:</strong> Marshals must escort first rank holders to the dais in the prescribed order to receive degrees respectfully from the Chief Guest and Vice-Chancellor, then promptly return them to their seats.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">6</span>
            <div className="instructions-item-content">
              <strong>Emergency &amp; Crowd Management:</strong> In the event of an instruction to vacate or re-seat, guide graduands calmly, patiently, and in an orderly sequence.
            </div>
          </li>
        </ul>
      </section>

      {/* 04 | Post-Graduation Photo Session Venues */}
      <section className="instructions-section-card panel">
        <div className="instructions-card-header">
          <span><Icon name="camera" size={22} /></span>
          <div>
            <span className="section-tag">04 | Photography Coordination</span>
            <h2>Post-Graduation Photo Session Venues</h2>
          </div>
        </div>
        <p className="instructions-section-desc">
          Following the conclusion of the ceremony, direct graduands programme-wise to their designated photography halls.
        </p>

        <div className="instructions-table-wrap">
          <table className="instructions-table">
            <thead>
              <tr>
                <th>Programme</th>
                <th>Designated Photo Session Venue</th>
                <th>Staff Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>MBA (Online)</strong></td>
                <td>Main Auditorium</td>
                <td>Retain students in main hall seats for stage photo sequence</td>
              </tr>
              <tr>
                <td><strong>MCA (Online), MBA (Distance) &amp; MCA (Distance)</strong></td>
                <td>Mini Hall 1 (Inside the Main Auditorium)</td>
                <td>Escort students via East corridor entrance to Mini Hall 1</td>
              </tr>
              <tr>
                <td><strong>BBA (Online) &amp; BCA (Online)</strong></td>
                <td>Mini Hall 2 (Inside the Main Auditorium)</td>
                <td>Escort students via West corridor entrance to Mini Hall 2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 05 | Crucial Operational Restrictions */}
      <section className="instructions-section-card panel">
        <div className="instructions-card-header">
          <span><Icon name="shield" size={22} /></span>
          <div>
            <span className="section-tag">05 | Crucial Policies</span>
            <h2>Important Restrictions &amp; Policy Enforcement</h2>
          </div>
        </div>

        <ul className="instructions-items-list">
          <li className="instructions-item-row">
            <span className="instructions-item-badge">1</span>
            <div className="instructions-item-content">
              <strong>Guest Entry Restriction:</strong> Guests and accompanying family members are <strong>STRICTLY NOT PERMITTED</strong> inside the auditorium. Staff at entry security must direct family members to outside waiting areas.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">2</span>
            <div className="instructions-item-content">
              <strong>Guest Expenses:</strong> Any expenses incurred for accompanying guests must be borne by the students themselves. The Directorate of Online Education (DODE) will not provide or reimburse guest-related expenses.
            </div>
          </li>
          <li className="instructions-item-row">
            <span className="instructions-item-badge">3</span>
            <div className="instructions-item-content">
              <strong>Withholding Original Marksheets:</strong> Graduands with pending tuition or examination fee dues must NOT be handed original marksheets. Only a marksheet photocopy is provided, and they must be directed to accounts clearance.
            </div>
          </li>
        </ul>
      </section>

      {/* Operational Standards Summary */}
      <section className="panel staff-process-rules">
        <h3><Icon name="check" size={17} /> Operational Golden Rules</h3>
        <ul>
          <li>Only graduates on the COE-approved presentee list may be processed.</li>
          <li>Biometric face recognition is mandatory at kit collection and again at auditorium entry.</li>
          <li>Faculty distributing degree certificates must verify each student's assigned row and seat before handover.</li>
          <li>Confirm lunch token redemption at Sannasi Hostel after photo sessions conclude.</li>
        </ul>
      </section>

      {/* Authority Banner */}
      <section className="instructions-cooperation-banner">
        <h3>DISCIPLINE &amp; EXCELLENCE IN EXECUTION</h3>
        <p>
          Please ensure smooth coordination, polite assistance to graduands, and strict adherence to the university convocation protocol.
        </p>
        <div className="instructions-cooperation-signoff">
          <strong>DIRECTORATE OF ONLINE EDUCATION</strong>
          <span>SRM INSTITUTE OF SCIENCE AND TECHNOLOGY</span>
        </div>
      </section>
    </div>
  )
}
