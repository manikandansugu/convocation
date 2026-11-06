import { useState } from 'react'
import { Icon } from '../components/ui/Icon'
import { VENUE_POINTS, type MapCategory, type VenuePoint } from '../config/map'
import wayfindingMapImg from '../assets/campus-wayfinding-map.jpg'

export function MapPage() {
  const [activeCategory, setActiveCategory] = useState<MapCategory>('all')
  const [selectedPointId, setSelectedPointId] = useState<string>('food-court-1')

  const filteredPoints = activeCategory === 'all'
    ? VENUE_POINTS
    : VENUE_POINTS.filter((p) => p.category === activeCategory)

  const selectedPoint: VenuePoint =
    VENUE_POINTS.find((p) => p.id === selectedPointId) || VENUE_POINTS[0]

  const refreshmentPoints = VENUE_POINTS.filter((p) => p.category === 'refreshment')
  const parkingPoints = VENUE_POINTS.filter((p) => p.category === 'parking')
  const wayfindingDirectory = VENUE_POINTS.filter((p) => p.mapCode !== 'ENTRY')

  return (
    <div className="page campus-map-page">
      {/* Top Toolbar */}
      <section className="panel map-toolbar-panel">
        <div className="map-toolbar-header">
          <div>
            <span className="eyebrow">SRM INSTITUTE OF SCIENCE AND TECHNOLOGY · KATTANKULATHUR</span>
            <h2>Campus & Event Venue Wayfinding Map</h2>
            <p>
              Navigate the campus layout for <strong>Dr. T. P. Ganesan Auditorium</strong>, morning and afternoon <strong>Refreshment zones (Breakfast & Lunch)</strong>, and designated <strong>Car Parking areas</strong>.
            </p>
          </div>
          <div className="map-external-actions">
            <a
              href="https://maps.google.com/?q=Dr.+T.+P.+Ganesan+Auditorium,+SRM+University,+Kattankulathur"
              target="_blank"
              rel="noreferrer"
              className="btn-google-maps"
              title="Open Auditorium in Google Maps"
            >
              <Icon name="location" size={16} /> Open in Google Maps
            </a>
          </div>
        </div>

        <div className="map-category-tabs" role="tablist" aria-label="Venue map filters">
          <button
            type="button"
            className={activeCategory === 'all' ? 'active' : ''}
            onClick={() => setActiveCategory('all')}
          >
            All Wayfinding Zones ({VENUE_POINTS.length})
          </button>
          <button
            type="button"
            className={activeCategory === 'refreshment' ? 'active highlight-green' : ''}
            onClick={() => { setActiveCategory('refreshment'); setSelectedPointId('food-court-1') }}
          >
            <Icon name="coffee" size={14} /> Refreshment & Dining ({refreshmentPoints.length})
          </button>
          <button
            type="button"
            className={activeCategory === 'parking' ? 'active highlight-amber' : ''}
            onClick={() => { setActiveCategory('parking'); setSelectedPointId('parking-p1') }}
          >
            <Icon name="car" size={14} /> Car Parking ({parkingPoints.length})
          </button>
          <button
            type="button"
            className={activeCategory === 'auditorium' ? 'active' : ''}
            onClick={() => { setActiveCategory('auditorium'); setSelectedPointId('auditorium-main') }}
          >
            <Icon name="award" size={14} /> Auditorium & Stage
          </button>
          <button
            type="button"
            className={activeCategory === 'gates' ? 'active' : ''}
            onClick={() => { setActiveCategory('gates'); setSelectedPointId('campus-entry') }}
          >
            <Icon name="location" size={14} /> Campus Entry
          </button>
        </div>
      </section>

      {/* Main Wayfinding Map & Directory Grid */}
      <section className="panel map-visual-shell">
        <header className="map-schematic-header">
          <div className="map-schematic-title">
            <Icon name="map" size={20} />
            <div>
              <h3>Official Convocation Wayfinding Map</h3>
              <span>Interactive layout: click any zone (A to G or You Are Here) on the map or in the directory</span>
            </div>
          </div>
          <div className="map-legend-pills">
            <span className="legend-pill refreshment"><i /> Refreshment (E, G)</span>
            <span className="legend-pill parking"><i /> Car Parking (A, B)</span>
            <span className="legend-pill auditorium"><i /> Auditorium & Stage (D)</span>
            <span className="legend-pill gates"><i /> You Are Here (Entry)</span>
          </div>
        </header>

        <div className="wayfinding-layout-grid">
          {/* Visual Map with Interactive Hotspots */}
          <div className="wayfinding-map-stage">
            <div className="wayfinding-map-wrapper">
              <img
                src={wayfindingMapImg}
                alt="Convocation Wayfinding Map"
                className="wayfinding-map-image"
              />

              {/* Interactive Hotspot Buttons Overlaid on Map Letters */}
              {filteredPoints.map((point) => {
                const isSelected = selectedPoint.id === point.id
                return (
                  <button
                    key={point.id}
                    type="button"
                    className={`map-hotspot-pin ${point.mapCode === 'ENTRY' ? 'entry-hotspot' : ''} ${isSelected ? 'selected' : ''}`}
                    style={{
                      left: `${point.hotspot.xPercent}%`,
                      top: `${point.hotspot.yPercent}%`,
                    }}
                    onClick={() => setSelectedPointId(point.id)}
                    title={`${point.name} — Click to view details`}
                    aria-label={`Zone ${point.mapCode}: ${point.name}`}
                  >
                    <span className="hotspot-badge" style={{ backgroundColor: point.color }}>
                      {point.mapCode === 'ENTRY' ? (
                        <Icon name="location" size={13} />
                      ) : (
                        point.mapCode
                      )}
                    </span>
                    <span className="hotspot-tooltip">
                      <strong>Zone {point.mapCode}</strong>
                      <small>{point.shortLabel}</small>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quick Wayfinding Directory (A to G) */}
          <div className="wayfinding-directory-sidebar">
            <div className="directory-header">
              <Icon name="grid" size={16} />
              <h4>Wayfinding Directory</h4>
              <span>Zones A – G</span>
            </div>

            <div className="directory-list">
              {wayfindingDirectory.map((point) => {
                const isSelected = selectedPoint.id === point.id
                return (
                  <button
                    key={point.id}
                    type="button"
                    className={`directory-item-btn ${isSelected ? 'active' : ''} ${point.category}`}
                    onClick={() => setSelectedPointId(point.id)}
                  >
                    <span className="directory-code-pill" style={{ backgroundColor: point.color }}>
                      {point.mapCode}
                    </span>
                    <div className="directory-item-info">
                      <strong>{point.shortLabel}</strong>
                      <span>{point.walkingTime}</span>
                    </div>
                    <div className="directory-item-icon">
                      <Icon name={point.icon} size={15} />
                    </div>
                  </button>
                )
              })}

              {/* You Are Here Entry Row */}
              <button
                type="button"
                className={`directory-item-btn entry-row ${selectedPoint.id === 'campus-entry' ? 'active' : ''}`}
                onClick={() => setSelectedPointId('campus-entry')}
              >
                <span className="directory-code-pill entry-pill">
                  <Icon name="location" size={12} />
                </span>
                <div className="directory-item-info">
                  <strong>You Are Here (Main Entry)</strong>
                  <span>Arrival Checkpoint</span>
                </div>
                <div className="directory-item-icon">
                  <span className="pulse-dot" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Selected Location Detailed Information Card */}
        <div className="map-selected-poi-card">
          <div className="poi-icon-box" style={{ background: `${selectedPoint.color}15`, color: selectedPoint.color }}>
            <Icon name={selectedPoint.icon} size={24} />
          </div>
          <div className="poi-info">
            <div className="poi-header-row">
              <span className={`poi-category-badge ${selectedPoint.category}`}>
                {selectedPoint.mapCode !== 'ENTRY' && `Zone ${selectedPoint.mapCode} · `}
                {selectedPoint.tag}
              </span>
              <span className="poi-distance-pill">
                <Icon name="clock" size={12} /> {selectedPoint.walkingTime} ({selectedPoint.distance})
              </span>
            </div>
            <h4>{selectedPoint.name}</h4>
            <p>{selectedPoint.description}</p>

            <div className="poi-meta-chips">
              {selectedPoint.timing && (
                <div className="meta-chip">
                  <strong>Hours:</strong> <span>{selectedPoint.timing}</span>
                </div>
              )}
              {selectedPoint.tokenRequirement && (
                <div className="meta-chip token-chip">
                  <Icon name="ticket" size={13} />
                  <strong>Pass Token:</strong> <span>{selectedPoint.tokenRequirement}</span>
                </div>
              )}
              {selectedPoint.capacity && (
                <div className="meta-chip">
                  <strong>Capacity:</strong> <span>{selectedPoint.capacity}</span>
                </div>
              )}
            </div>

            <ul className="poi-instruction-list">
              {selectedPoint.instructions.map((inst, idx) => (
                <li key={idx}>
                  <Icon name="check" size={13} />
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* DEDICATED SECTION 1: REFRESHMENT & DINING (BREAKFAST & LUNCH) */}
      <section className="panel map-feature-section" id="refreshment-section">
        <header className="map-section-heading">
          <div className="section-icon-badge refreshment">
            <Icon name="coffee" size={22} />
          </div>
          <div>
            <span className="eyebrow">CONVOCATION MEAL SERVICES</span>
            <h3>Refreshment & Dining Locations (Zones E & G)</h3>
            <p>
              Both <strong>Breakfast (Zone E)</strong> and <strong>Lunch (Zone G)</strong> require token redemption from your physical Graduation Kit.
            </p>
          </div>
        </header>

        <div className="map-cards-grid">
          {refreshmentPoints.map((point) => (
            <article
              key={point.id}
              className={`map-feature-card ${selectedPointId === point.id ? 'active-card' : ''}`}
            >
              <div className="feature-card-top">
                <span className="feature-card-badge refreshment">
                  <Icon name="coffee" size={14} /> Zone {point.mapCode} · {point.timing}
                </span>
                <span className="feature-card-distance">{point.walkingTime}</span>
              </div>

              <h4>{point.name}</h4>
              <p>{point.description}</p>

              <div className="feature-token-box">
                <div className="token-icon"><Icon name="ticket" size={16} /></div>
                <div>
                  <small>TOKEN REQUIREMENT</small>
                  <strong>{point.tokenRequirement}</strong>
                </div>
              </div>

              <div className="feature-card-rules">
                <strong>Key Details:</strong>
                <ul>
                  {point.instructions.map((ins, i) => (
                    <li key={i}>{ins}</li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className="btn-focus-map"
                onClick={() => {
                  setSelectedPointId(point.id)
                  window.scrollTo({ top: 320, behavior: 'smooth' })
                }}
              >
                <Icon name="location" size={14} /> View Zone {point.mapCode} on Map
              </button>
            </article>
          ))}

          {/* Complimentary Beverage Desk */}
          <article className="map-feature-card info-card">
            <div className="feature-card-top">
              <span className="feature-card-badge info">
                <Icon name="coffee" size={14} /> Continuous Service
              </span>
              <span className="feature-card-distance">All Gates</span>
            </div>

            <h4>Complimentary Water & Hot Beverage Kiosks</h4>
            <p>
              Drinking water dispensers, filter coffee, and tea stations are stationed throughout the venue foyers and kit collection waiting corridors.
            </p>

            <div className="feature-card-rules">
              <strong>Station Locations:</strong>
              <ul>
                <li>Auditorium Gate 1, Gate 2 & Gate 3 Outer Lobbies</li>
                <li>Kit Distribution Waiting Area (Zone C)</li>
                <li>Garden Lawn Entrance (Near Photo Session Arena Zone F)</li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      {/* DEDICATED SECTION 2: CAR PARKING & VEHICLE TRANSIT */}
      <section className="panel map-feature-section" id="parking-section">
        <header className="map-section-heading">
          <div className="section-icon-badge parking">
            <Icon name="car" size={22} />
          </div>
          <div>
            <span className="eyebrow">PARKING & TRANSPORT LOGISTICS</span>
            <h3>Designated Car Parking Zones (Zones A & B)</h3>
            <p>
              Follow campus lane dividers and display your digital or physical pass on the vehicle dashboard.
            </p>
          </div>
        </header>

        <div className="map-cards-grid">
          {parkingPoints.map((point) => (
            <article
              key={point.id}
              className={`map-feature-card ${selectedPointId === point.id ? 'active-card' : ''}`}
            >
              <div className="feature-card-top">
                <span className="feature-card-badge parking">
                  <Icon name="car" size={14} /> Zone {point.mapCode} · {point.capacity}
                </span>
                <span className="feature-card-distance">{point.walkingTime}</span>
              </div>

              <h4>{point.name}</h4>
              <p>{point.description}</p>

              <div className="feature-token-box parking-box">
                <div className="token-icon parking"><Icon name="location" size={16} /></div>
                <div>
                  <small>CAPACITY & ENTRY</small>
                  <strong>{point.capacity}</strong>
                </div>
              </div>

              <div className="feature-card-rules">
                <strong>Access Guidelines:</strong>
                <ul>
                  {point.instructions.map((ins, i) => (
                    <li key={i}>{ins}</li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className="btn-focus-map"
                onClick={() => {
                  setSelectedPointId(point.id)
                  window.scrollTo({ top: 320, behavior: 'smooth' })
                }}
              >
                <Icon name="location" size={14} /> View Zone {point.mapCode} on Map
              </button>
            </article>
          ))}
        </div>

        {/* Traffic Advisory Footer */}
        <div className="parking-advisory-banner">
          <Icon name="shield" size={20} />
          <div>
            <strong>Campus Traffic & Security Advisory:</strong>
            <p>
              Speed limit inside the campus is strictly <strong>20 km/h</strong>. Senior citizens and persons with disability (PwD) may be dropped off directly at the Auditorium Portico before parking in Zone B. Free golf-cart buggies will shuttle between Zone B and the Main Auditorium entrance.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
