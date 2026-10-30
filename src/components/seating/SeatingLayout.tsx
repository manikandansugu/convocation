import { useMemo, useState } from 'react'
import { Icon } from '../ui/Icon'

export interface SeatAllocation {
  id: string
  name: string
  registerNumber: string
  block: string
  row: string
  seat: number
  type?: 'student' | 'staff'
}

interface SeatingLayoutProps {
  allocations: SeatAllocation[]
  selectedId: string
  onSelect?: (id: string) => void
  showRoster?: boolean
}

const ROW_SEAT_COUNTS: Array<[string, number]> = [
  ['A', 54], ['B', 52], ['C', 55], ['D', 53], ['E', 54], ['F', 54], ['G', 54], ['H', 52], ['I', 54], ['J', 52], ['K', 51], ['L', 52], ['M', 51],
  ['N', 51], ['O', 53], ['P', 53], ['Q', 56], ['R', 54], ['S', 56], ['T', 56], ['U', 56], ['V', 56], ['W', 53], ['X', 53], ['Y', 57], ['Z', 57],
  ['AA', 54], ['BB', 54], ['CC', 55], ['DD', 53], ['EE', 54], ['FF', 57], ['GG', 56], ['HH', 57], ['II', 56], ['JJ', 57], ['KK', 56], ['LL', 53], ['MM', 57],
  ['NN', 54], ['OO', 57], ['PP', 58], ['QQ', 56], ['RR', 56], ['SS', 56], ['TT', 56], ['UU', 56], ['VV', 56], ['WW', 58], ['XX', 58], ['YY', 58], ['ZZ', 55],
]

const VISIBLE_ROWS_PER_SECTION = 5
const VISIBLE_SEATS_PER_ROW = 36
const AISLE_AFTER_SEAT = 18

const makeRows = (start: number, end: number) => ROW_SEAT_COUNTS.slice(start, end).map(([label, seatCount]) => ({
  label,
  seats: Array.from({ length: Math.min(seatCount, VISIBLE_SEATS_PER_ROW) }, (_, index) => index + 1),
}))

const AUDITORIUM_SECTIONS: Record<string, Array<{ label: string; seats: number[] }>> = {
  Front: makeRows(0, VISIBLE_ROWS_PER_SECTION),
  Middle: makeRows(13, 13 + VISIBLE_ROWS_PER_SECTION),
  Rear: makeRows(26, 26 + VISIBLE_ROWS_PER_SECTION),
  Back: makeRows(39, 39 + VISIBLE_ROWS_PER_SECTION),
}

export function SeatingLayout({ allocations, selectedId, onSelect, showRoster = false }: SeatingLayoutProps) {
  const selected = allocations.find((item) => item.id === selectedId) || allocations[0]
  const [activeBlock, setActiveBlock] = useState(selected?.block || 'Front')
  const [detailAllocationId, setDetailAllocationId] = useState<string | null>(null)
  const detailAllocation = allocations.find((item) => item.id === detailAllocationId)

  const blockAllocations = useMemo(
    () => allocations.filter((item) => item.block === activeBlock),
    [activeBlock, allocations],
  )

  const selectedRoute = useMemo(() => {
    if (!selected || selected.block !== activeBlock) return null
    const rows = AUDITORIUM_SECTIONS[activeBlock] || []
    const rowIndex = rows.findIndex((row) => row.label === selected.row)
    const seatIndex = rowIndex >= 0 ? rows[rowIndex].seats.indexOf(selected.seat) : -1
    if (rowIndex < 0 || seatIndex < 0) return null

    const seatX = 58 + ((seatIndex + 0.5) / VISIBLE_SEATS_PER_ROW) * 884 + (seatIndex >= AISLE_AFTER_SEAT ? 16 : 0)
    const seatY = 25 + rowIndex * (450 / Math.max(rows.length - 1, 1))
    return {
      path: `M 165 500 L 532 500 L 532 ${seatY} L ${seatX} ${seatY}`,
      seatX,
      seatY,
    }
  }, [activeBlock, selected])

  const allocationFor = (row: string, seat: number) =>
    blockAllocations.find((item) => item.row === row && item.seat === seat)

  const selectAllocation = (id: string) => {
    const allocation = allocations.find((item) => item.id === id)
    if (allocation) setActiveBlock(allocation.block)
    onSelect?.(id)
  }

  const openAllocationDetails = (id: string) => {
    selectAllocation(id)
    setDetailAllocationId(id)
  }

  return (
    <div className={`seating-layout-shell ${showRoster ? 'with-roster' : ''}`}>
      {showRoster && (
        <aside className="panel seating-roster-panel">
          <div className="seating-roster-heading">
            <div><p className="eyebrow">SEAT LOCATOR</p><h3>Allocated attendees</h3></div>
            <span>{allocations.length}</span>
          </div>
          <div className="seating-roster-list">
            {allocations.map((allocation) => (
              <button type="button" key={allocation.id} className={allocation.id === selected?.id ? 'active' : ''} onClick={() => { selectAllocation(allocation.id); setDetailAllocationId(null) }}>
                <span className="seating-roster-avatar">{allocation.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
                <span><strong>{allocation.name}</strong><small>{allocation.registerNumber}</small></span>
                <b>{allocation.block}-{allocation.row}-{allocation.seat}</b>
              </button>
            ))}
          </div>
        </aside>
      )}

      <section className="panel seating-map-panel">
        <div className="seating-map-toolbar">
          <div>
            <p className="eyebrow">DR. T. P. GANESAN AUDITORIUM</p>
            <h2>Visual Seating Layout</h2>
          </div>
          <div className="seating-block-tabs" aria-label="Auditorium sections">
            {Object.keys(AUDITORIUM_SECTIONS).map((block) => (
              <button type="button" key={block} className={activeBlock === block ? 'active' : ''} onClick={() => { setActiveBlock(block); setDetailAllocationId(null) }}>{block}</button>
            ))}
          </div>
        </div>

        <div className="seating-stage"><span>STAGE</span><strong>Convocation Ceremony</strong></div>

        <div className="seating-map-scroll">
          <div className="seating-map" aria-label={`${activeBlock} section seating map`}>
            {selectedRoute && (
              <svg className="seating-route-map" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <marker id="seating-route-arrow" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L8,3 z" />
                  </marker>
                </defs>
                <circle className="seating-route-origin" cx="165" cy="492" r="9" />
                <path className="seating-route-path" d={selectedRoute.path} markerEnd="url(#seating-route-arrow)" />
              </svg>
            )}
            <div className="seating-aisle-label">CENTRE AISLE</div>
            {(AUDITORIUM_SECTIONS[activeBlock] || []).map((row) => (
              <div className={`seating-row ${row.label === selected?.row ? 'selected-row' : ''}`} key={row.label}>
                <strong>{row.label}</strong>
                <div className="seating-row-seats">
                  {row.seats.map((seatNumber, index) => {
                    const allocation = allocationFor(row.label, seatNumber)
                    const isSelected = allocation?.id === selected?.id
                    return (
                      <button
                        type="button"
                        key={`${row.label}-${seatNumber}`}
                        className={`${allocation ? 'allocated' : 'available'} ${allocation?.type === 'staff' ? 'staff-seat' : ''} ${isSelected ? 'selected' : ''} ${index >= AISLE_AFTER_SEAT ? 'after-aisle' : ''}`}
                        title={allocation ? `${allocation.name} · ${row.label} · Seat ${seatNumber}` : `${row.label} · Seat ${seatNumber}`}
                        aria-label={allocation ? `${allocation.name}, row ${row.label}, seat ${seatNumber}` : `Available seat ${seatNumber}, row ${row.label}`}
                        onClick={() => allocation && openAllocationDetails(allocation.id)}
                      >
                        <span>{seatNumber}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="seating-map-footer">
            <div className="seating-legend">
              <span><i className="seat-key selected" /> Your / selected seat</span>
              <span><i className="seat-key allocated" /> Student allocated</span>
              <span><i className="seat-key staff" /> Staff allocated</span>
              <span><i className="seat-key available" /> Available</span>
            </div>
            <div className="seating-exits"><span className={selectedRoute ? 'main-entry-route' : ''}>{selectedRoute && <Icon name="arrow" size={13} />} MAIN ENTRY</span><span>EXIT A</span><span>EXIT B</span></div>
          </div>
        </div>
      </section>

      {detailAllocation && (
        <div className="seating-detail-overlay">
          <button type="button" className="seating-detail-backdrop" onClick={() => setDetailAllocationId(null)} aria-label="Close student seat details" />
          <section className="seating-selected-card seating-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="seating-detail-title">
            <div className="seating-selected-icon"><Icon name="location" size={24} /></div>
            <div><p>SELECTED ALLOCATION</p><h3 id="seating-detail-title">{detailAllocation.name}</h3><span>{detailAllocation.registerNumber}</span></div>
            <dl>
              <div><dt>Section</dt><dd>{detailAllocation.block}</dd></div>
              <div><dt>Row</dt><dd>{detailAllocation.row}</dd></div>
              <div><dt>Seat</dt><dd>{detailAllocation.seat}</dd></div>
            </dl>
            <p className="seating-direction"><Icon name="arrow" size={15} /> Enter through Gate 02, use the centre aisle and follow the row signage.</p>
            <button type="button" className="seating-detail-close" onClick={() => setDetailAllocationId(null)} aria-label="Close student seat details"><Icon name="x" size={18} /></button>
          </section>
        </div>
      )}
    </div>
  )
}
