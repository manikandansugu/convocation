import { useCallback, useMemo, useState } from 'react'
import {
  AUDITORIUM_ROWS,
  TOTAL_SEAT_COUNT,
  GROUND_SEAT_COUNT,
  BALCONY_SEAT_COUNT,
  AUDITORIUM_ROW_MAP,
  parseSeatId,
  getBlockName,
  type AuditoriumRowConfig,
} from '../../config/auditoriumSeats'

export interface SeatAllocation {
  id: string
  name: string
  registerNumber: string
  block: string
  row: string
  seat: number
  type?: 'student' | 'guest' | 'faculty' | 'staff'
  role?: string
  department?: string
  email?: string
  assignedStudentCount?: number
  studentCapacity?: number
}

interface SeatingLayoutProps {
  allocations: SeatAllocation[]
  selectedId: string
  onSelect?: (id: string) => void
  showRoster?: boolean
  isStaffView?: boolean
}

type GateId = '1' | '2'
type TierFilter = 'ground' | 'balcony' | 'all'

interface SeatPosition {
  row: string
  number: number
  tier: 'ground' | 'balcony'
  blockName: 'Left Block' | 'Center Block' | 'Right Block'
  x: number
  y: number
  aisleX: number
}

interface TooltipData {
  seatId: string
  row: string
  number: number
  tierName: string
  blockName: string
  status: string
  attendeeName?: string
  x: number
  y: number
}

// SVG Canvas Geometry
const CANVAS_WIDTH = 1420
const LEFT_BLOCK_START_X = 70
const LEFT_AISLE_X = 373
const CENTER_BLOCK_START_X = 406
const CENTER_BLOCK_WIDTH = 600
const RIGHT_AISLE_X = 1039
const RIGHT_BLOCK_START_X = 1072
const SEAT_PITCH = 20
const SEAT_SIZE = 14

const GROUND_ROW_START_Y = 100
const GROUND_ROW_PITCH_Y = 22

const BALCONY_ONLY_ROW_START_Y = 100
const ALL_BALCONY_ROW_START_Y = 820

const GATES: Record<GateId, { x: number; y: number; label: string; sub: string }> = {
  '1': { x: LEFT_AISLE_X, y: 720, label: 'Gate 1', sub: 'Beside Car Parking Zone P1' },
  '2': { x: RIGHT_AISLE_X, y: 720, label: 'Gate 2', sub: 'Beside Refreshment Food Court 02' },
}

const BALCONY_PORTALS: Record<GateId, { x: number; y: number; label: string; sub: string }> = {
  '1': { x: LEFT_AISLE_X, y: 720, label: 'Balcony Portal 1', sub: 'West Stairway & Lift' },
  '2': { x: RIGHT_AISLE_X, y: 720, label: 'Balcony Portal 2', sub: 'East Stairway & Foyer' },
}

// Deterministic occupied checker for unassigned seats
function isDeterministicallyOccupied(row: string, seatNumber: number): boolean {
  let hash = 0
  const str = `${row}-${seatNumber}`
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff
  }
  return Math.abs(hash) % 100 < 32
}

export function SeatingLayout({
  allocations,
  selectedId,
  onSelect,
  showRoster = false,
  isStaffView = false,
}: SeatingLayoutProps) {
  const [activeId, setActiveId] = useState(selectedId)
  const currentId = onSelect ? selectedId : activeId
  const selected = allocations.find((item) => item.id === currentId) || allocations[0]

  // Formatted seat id: "A-6"
  const displayedSeatId = selected ? `${selected.row}-${selected.seat}` : 'A-6'
  const parsedSelected = parseSeatId(displayedSeatId)
  const selectedRowConfig = parsedSelected ? AUDITORIUM_ROW_MAP.get(parsedSelected.row) : null
  const initialTier: TierFilter = selectedRowConfig?.tier === 'balcony' ? 'balcony' : 'ground'

  const [tierFilter, setTierFilter] = useState<TierFilter>(initialTier)
  const [gateId, setGateId] = useState<GateId>('1')
  const [searchQuery, setSearchQuery] = useState('')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [hoveredTooltip, setHoveredTooltip] = useState<TooltipData | null>(null)

  // Map of seatId -> allocation (e.g. "A-6" -> SeatAllocation)
  const allocationBySeat = useMemo(() => {
    const map = new Map<string, SeatAllocation>()
    allocations.forEach((alloc) => {
      map.set(`${alloc.row}-${alloc.seat}`, alloc)
      map.set(`${alloc.row}${alloc.seat}`, alloc)
    })
    return map
  }, [allocations])

  // Filter rows based on tier
  const visibleRows = useMemo(() => {
    if (tierFilter === 'ground') {
      return AUDITORIUM_ROWS.filter((r) => r.tier === 'ground')
    }
    if (tierFilter === 'balcony') {
      return AUDITORIUM_ROWS.filter((r) => r.tier === 'balcony')
    }
    return AUDITORIUM_ROWS
  }, [tierFilter])

  // Calculate seat position in SVG coordinates
  const getSeatPosition = useCallback((rowConfig: AuditoriumRowConfig, seatNumber: number): SeatPosition => {
    const isBalcony = rowConfig.tier === 'balcony'
    let y: number
    if (tierFilter === 'all') {
      if (isBalcony) {
        const balconyIndex = AUDITORIUM_ROWS.filter((r) => r.tier === 'balcony').findIndex((r) => r.row === rowConfig.row)
        y = ALL_BALCONY_ROW_START_Y + balconyIndex * GROUND_ROW_PITCH_Y
      } else {
        const groundIndex = AUDITORIUM_ROWS.filter((r) => r.tier === 'ground').findIndex((r) => r.row === rowConfig.row)
        y = GROUND_ROW_START_Y + groundIndex * GROUND_ROW_PITCH_Y
      }
    } else if (tierFilter === 'balcony') {
      const balconyIndex = AUDITORIUM_ROWS.filter((r) => r.tier === 'balcony').findIndex((r) => r.row === rowConfig.row)
      y = BALCONY_ONLY_ROW_START_Y + balconyIndex * GROUND_ROW_PITCH_Y
    } else {
      const groundIndex = AUDITORIUM_ROWS.filter((r) => r.tier === 'ground').findIndex((r) => r.row === rowConfig.row)
      y = GROUND_ROW_START_Y + groundIndex * GROUND_ROW_PITCH_Y
    }

    const { left, center } = rowConfig.blocks
    let x: number
    let blockName: 'Left Block' | 'Center Block' | 'Right Block'
    let aisleX: number

    if (seatNumber <= left.count) {
      blockName = 'Left Block'
      x = LEFT_BLOCK_START_X + (seatNumber - 1) * SEAT_PITCH + SEAT_SIZE / 2
      aisleX = LEFT_AISLE_X
    } else if (seatNumber <= left.count + center.count) {
      blockName = 'Center Block'
      const centerIndex = seatNumber - (left.count + 1)
      const centerSpan = center.count * SEAT_PITCH
      const centerOffsetX = CENTER_BLOCK_START_X + (CENTER_BLOCK_WIDTH - centerSpan) / 2
      x = centerOffsetX + centerIndex * SEAT_PITCH + SEAT_SIZE / 2
      aisleX = Math.abs(x - LEFT_AISLE_X) <= Math.abs(x - RIGHT_AISLE_X) ? LEFT_AISLE_X : RIGHT_AISLE_X
    } else {
      blockName = 'Right Block'
      const rightIndex = seatNumber - (left.count + center.count + 1)
      x = RIGHT_BLOCK_START_X + rightIndex * SEAT_PITCH + SEAT_SIZE / 2
      aisleX = RIGHT_AISLE_X
    }

    return {
      row: rowConfig.row,
      number: seatNumber,
      tier: rowConfig.tier,
      blockName,
      x,
      y,
      aisleX,
    }
  }, [tierFilter])

  // Selected seat position
  const selectedPosition = useMemo(() => {
    if (!parsedSelected) return null
    const rowConfig = AUDITORIUM_ROW_MAP.get(parsedSelected.row)
    if (!rowConfig) return null
    if (parsedSelected.number < 1 || parsedSelected.number > rowConfig.seatCount) return null
    return getSeatPosition(rowConfig, parsedSelected.number)
  }, [parsedSelected, getSeatPosition])

  // Canvas height depending on tier view
  const canvasHeight = useMemo(() => {
    if (tierFilter === 'all') return 1620
    return 860
  }, [tierFilter])

  // Walking route points
  const routePoints = useMemo(() => {
    if (!selectedPosition) return ''
    if (tierFilter !== 'all' && selectedPosition.tier !== tierFilter) return ''

    const isBalcony = selectedPosition.tier === 'balcony' && tierFilter !== 'all'
    const gate = isBalcony ? BALCONY_PORTALS[gateId] : GATES[gateId]
    const aisle = selectedPosition.aisleX
    const crossAisleY = tierFilter === 'all'
      ? selectedPosition.tier === 'balcony' ? 1460 : 690
      : 690

    const gateY = tierFilter === 'all'
      ? selectedPosition.tier === 'balcony' ? 1500 : 720
      : gate.y

    const points = [
      [gate.x, gateY],
      [gate.x, crossAisleY],
      [aisle, crossAisleY],
      [aisle, selectedPosition.y + SEAT_SIZE / 2],
      [selectedPosition.x, selectedPosition.y + SEAT_SIZE / 2],
    ]

    return points
      .filter((point, index) => index === 0 || point[0] !== points[index - 1][0] || point[1] !== points[index - 1][1])
      .map((point) => point.join(','))
      .join(' ')
  }, [selectedPosition, tierFilter, gateId])

  // Turn-by-turn directions
  const directions = useMemo(() => {
    if (!selectedPosition || !parsedSelected) {
      return ['Seat allocation not found. Please select an attendee or enter a valid seat (Rows A–Z, AA–ZZ).']
    }

    const isBalcony = selectedPosition.tier === 'balcony'
    const gate = isBalcony && tierFilter !== 'all' ? BALCONY_PORTALS[gateId] : GATES[gateId]
    const aisle = selectedPosition.aisleX
    const aisleName = aisle === LEFT_AISLE_X ? 'Left Aisle' : 'Right Aisle'
    const side = selectedPosition.x > aisle ? 'right' : 'left'
    const tierName = isBalcony ? 'Balcony Level (Upper Tier)' : 'Ground Floor (Lower Tier)'

    const steps = [
      `Enter through ${gate.label} (${gate.sub}).`,
      isBalcony
        ? `Proceed up to ${tierName} using the designated stairway or elevator.`
        : `Walk along the main cross-aisle towards the ${aisleName}.`,
      `Walk up the ${aisleName} towards the stage to Row ${selectedPosition.row}.`,
      `Turn ${side} into ${selectedPosition.blockName}. Your seat is ${selectedPosition.row}${selectedPosition.number}.`,
    ]
    return steps
  }, [selectedPosition, parsedSelected, tierFilter, gateId])

  const chooseAllocation = (allocation: SeatAllocation) => {
    setActiveId(allocation.id)
    onSelect?.(allocation.id)

    // Switch tier if necessary
    const rowConfig = AUDITORIUM_ROW_MAP.get(allocation.row)
    if (rowConfig && tierFilter !== 'all' && rowConfig.tier !== tierFilter) {
      setTierFilter(rowConfig.tier)
    }
  }

  // Handle seat search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    const parsed = parseSeatId(searchQuery)
    if (parsed) {
      const match = allocations.find((a) => a.row.toUpperCase() === parsed.row && a.seat === parsed.number)
      if (match) {
        chooseAllocation(match)
        return
      }
      // If unallocated seat searched, auto switch tier
      const rowCfg = AUDITORIUM_ROW_MAP.get(parsed.row)
      if (rowCfg && tierFilter !== 'all' && rowCfg.tier !== tierFilter) {
        setTierFilter(rowCfg.tier)
      }
    } else {
      // Search by attendee name
      const found = allocations.find((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
      if (found) {
        chooseAllocation(found)
      }
    }
  }

  return (
    <div className={`seating-layout-shell ${showRoster ? 'with-roster' : ''}`}>
      {showRoster && (
        <aside className="panel seating-roster-panel">
          <div className="seating-roster-heading">
            <div>
              <p className="eyebrow">SEAT LOCATOR</p>
              <h3>Allocated attendees</h3>
            </div>
            <span title="Total attendees">{allocations.length}</span>
          </div>

          <div className="seating-roster-search">
            <input
              type="text"
              placeholder="Filter attendees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Filter allocated attendees"
            />
          </div>

          <div className="seating-roster-list">
            {allocations
              .filter(
                (a) =>
                  !searchQuery ||
                  a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  `${a.row}-${a.seat}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  a.registerNumber.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((allocation) => {
                const initials = allocation.name
                  .split(' ')
                  .filter(Boolean)
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)
                const isActive = allocation.id === selected?.id
                const isGuest = allocation.type === 'guest'
                const isFaculty = allocation.type === 'faculty' || allocation.type === 'staff'

                return (
                  <button
                    type="button"
                    key={allocation.id}
                    className={`${isActive ? 'active' : ''} ${isGuest ? 'guest' : ''} ${isFaculty ? 'staff' : ''}`}
                    onClick={() => chooseAllocation(allocation)}
                  >
                    <span className="seating-roster-avatar">{initials}</span>
                    <span>
                      <strong>{allocation.name}</strong>
                      <small>
                        {allocation.registerNumber}
                        {allocation.role ? ` · ${allocation.role}` : ''}
                      </small>
                    </span>
                    <b>
                      {allocation.row}-{allocation.seat}
                    </b>
                  </button>
                )
              })}
          </div>

          <div className="seating-roster-stats">
            <div>
              <small>Ground Floor</small>
              <strong>{GROUND_SEAT_COUNT.toLocaleString()} seats</strong>
            </div>
            <div>
              <small>Balcony Tier</small>
              <strong>{BALCONY_SEAT_COUNT.toLocaleString()} seats</strong>
            </div>
            <div>
              <small>Total Capacity</small>
              <strong>{TOTAL_SEAT_COUNT.toLocaleString()} seats</strong>
            </div>
          </div>
        </aside>
      )}

      <section className="panel seat-finder-card">
        <div className="seat-finder-heading">
          <div>
            <p className="eyebrow">DR. T. P. GANESAN AUDITORIUM</p>
            <h2>Auditorium Seating Layout</h2>
          </div>
          {selected && (
            <p>
              {selected.type === 'guest' ? 'Guest allocation:' : isStaffView ? 'Attendee:' : 'Welcome,'}{' '}
              <strong>{selected.name}</strong>. Allocated seat:{' '}
              <strong className="seat-badge-highlight">{displayedSeatId}</strong>{' '}
              <span className="tier-pill">
                {selectedRowConfig?.tier === 'balcony' ? 'Balcony Level' : 'Ground Floor'}
              </span>
            </p>
          )}
        </div>

        {/* Toolbar: Tiers, Zoom, Search */}
        <div className="seating-toolbar">
          <div className="seating-tier-tabs" role="tablist" aria-label="Auditorium Tier Selection">
            <button
              type="button"
              role="tab"
              aria-selected={tierFilter === 'ground'}
              className={tierFilter === 'ground' ? 'active' : ''}
              onClick={() => setTierFilter('ground')}
            >
              Ground Floor (Rows A–Z · 1,399 Seats)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tierFilter === 'balcony'}
              className={tierFilter === 'balcony' ? 'active' : ''}
              onClick={() => setTierFilter('balcony')}
            >
              Balcony Tier (Rows AA–ZZ · 1,453 Seats)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tierFilter === 'all'}
              className={tierFilter === 'all' ? 'active' : ''}
              onClick={() => setTierFilter('all')}
            >
              Entire Auditorium (52 Rows · 2,852 Seats)
            </button>
          </div>

          <div className="seating-toolbar-actions">
            <form onSubmit={handleSearchSubmit} className="seating-seat-search">
              <input
                type="text"
                placeholder="Find seat (e.g. A6, K1, AA14)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">
                Find
              </button>
            </form>

            <div className="seating-zoom-controls" aria-label="Zoom controls">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.75, +(z - 0.15).toFixed(2)))}
                title="Zoom Out"
              >
                −
              </button>
              <span>{Math.round(zoomLevel * 100)}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(1.8, +(z + 0.15).toFixed(2)))}
                title="Zoom In"
              >
                +
              </button>
              <button type="button" onClick={() => setZoomLevel(1)} title="Reset Zoom">
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Interactive SVG Seating Map */}
        <div className="seat-finder-map-wrap" style={{ position: 'relative' }}>
          <div
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease',
            }}
          >
            <svg
              className="seat-finder-map"
              viewBox={`0 0 ${CANVAS_WIDTH} ${canvasHeight}`}
              role="img"
              aria-label="Dr. T. P. Ganesan Auditorium Seating Layout"
            >
              <defs>
                <filter id="seatGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* STAGE AREA (Ground or All) */}
              {(tierFilter === 'ground' || tierFilter === 'all') && (
                <g className="seat-finder-stage-group">
                  <rect
                    className="seat-finder-stage"
                    x="350"
                    y="18"
                    width="720"
                    height="42"
                    rx="8"
                  />
                  <text
                    className="seat-finder-stage-label"
                    x="710"
                    y="44"
                    textAnchor="middle"
                  >
                    STAGE — DR. T. P. GANESAN AUDITORIUM
                  </text>
                  <text
                    x="710"
                    y="55"
                    textAnchor="middle"
                    fill="#93c5fd"
                    fontSize="9"
                    fontWeight="600"
                    letterSpacing="1px"
                  >
                    DAIS · VIP PODIUM · FACULTY SEATING FRONT
                  </text>
                </g>
              )}

              {/* BALCONY STAGE VIEW BANNER (Balcony only) */}
              {tierFilter === 'balcony' && (
                <g className="seat-finder-stage-group">
                  <rect
                    className="seat-finder-stage balcony"
                    x="350"
                    y="18"
                    width="720"
                    height="42"
                    rx="8"
                    fill="#1e293b"
                  />
                  <text
                    className="seat-finder-stage-label"
                    x="710"
                    y="44"
                    textAnchor="middle"
                  >
                    STAGE VIEW — BALCONY LEVEL (UPPER TIER)
                  </text>
                  <text
                    x="710"
                    y="55"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="9"
                    fontWeight="600"
                    letterSpacing="1px"
                  >
                    ELEVATED BALCONY VIEW OVERLOOKING AUDITORIUM GROUND FLOOR
                  </text>
                </g>
              )}

              {/* BALCONY PROMENADE DIVIDER (When All is selected) */}
              {tierFilter === 'all' && (
                <g className="seat-finder-balcony-divider" transform="translate(0, 750)">
                  <rect
                    x="60"
                    y="0"
                    width="1300"
                    height="42"
                    rx="8"
                    fill="#0f172a"
                    stroke="#334155"
                    strokeWidth="1.5"
                  />
                  <text
                    x="710"
                    y="24"
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="13"
                    fontWeight="800"
                    letterSpacing="1.5px"
                  >
                    ▲ BALCONY LEVEL (UPPER TIER) — ROWS AA TO ZZ (1,453 SEATS) ▲
                  </text>
                  <text
                    x="710"
                    y="36"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="8.5"
                    fontWeight="600"
                    letterSpacing="1px"
                  >
                    ACCESSIBLE VIA MEZZANINE FOYER · STAIRS &amp; LIFTS AT BOTH WINGS
                  </text>
                </g>
              )}

              {/* SEAT ROWS */}
              {visibleRows.map((rowConfig) => {
                const isBalcony = rowConfig.tier === 'balcony'
                const isStaffHighlightedRow = isStaffView && (rowConfig.row === 'A' || rowConfig.row === 'B')

                // Calculate base row Y coordinate
                let rowBaseY: number
                if (tierFilter === 'all') {
                  if (isBalcony) {
                    const bIndex = AUDITORIUM_ROWS.filter((r) => r.tier === 'balcony').findIndex((r) => r.row === rowConfig.row)
                    rowBaseY = ALL_BALCONY_ROW_START_Y + bIndex * GROUND_ROW_PITCH_Y
                  } else {
                    const gIndex = AUDITORIUM_ROWS.filter((r) => r.tier === 'ground').findIndex((r) => r.row === rowConfig.row)
                    rowBaseY = GROUND_ROW_START_Y + gIndex * GROUND_ROW_PITCH_Y
                  }
                } else if (tierFilter === 'balcony') {
                  const bIndex = AUDITORIUM_ROWS.filter((r) => r.tier === 'balcony').findIndex((r) => r.row === rowConfig.row)
                  rowBaseY = BALCONY_ONLY_ROW_START_Y + bIndex * GROUND_ROW_PITCH_Y
                } else {
                  const gIndex = AUDITORIUM_ROWS.filter((r) => r.tier === 'ground').findIndex((r) => r.row === rowConfig.row)
                  rowBaseY = GROUND_ROW_START_Y + gIndex * GROUND_ROW_PITCH_Y
                }

                // Render consecutive seats for Left, Center, Right blocks
                const seatsList: Array<{
                  seatNumber: number
                  seatId: string
                  x: number
                  y: number
                }> = []

                const { left, center, right } = rowConfig.blocks

                // Left block
                for (let i = 1; i <= left.count; i++) {
                  seatsList.push({
                    seatNumber: i,
                    seatId: `${rowConfig.row}-${i}`,
                    x: LEFT_BLOCK_START_X + (i - 1) * SEAT_PITCH,
                    y: rowBaseY,
                  })
                }

                // Center block
                const centerSpan = center.count * SEAT_PITCH
                const centerOffsetX = CENTER_BLOCK_START_X + (CENTER_BLOCK_WIDTH - centerSpan) / 2
                for (let i = 1; i <= center.count; i++) {
                  const num = left.count + i
                  seatsList.push({
                    seatNumber: num,
                    seatId: `${rowConfig.row}-${num}`,
                    x: centerOffsetX + (i - 1) * SEAT_PITCH,
                    y: rowBaseY,
                  })
                }

                // Right block
                for (let i = 1; i <= right.count; i++) {
                  const num = left.count + center.count + i
                  seatsList.push({
                    seatNumber: num,
                    seatId: `${rowConfig.row}-${num}`,
                    x: RIGHT_BLOCK_START_X + (i - 1) * SEAT_PITCH,
                    y: rowBaseY,
                  })
                }

                return (
                  <g key={rowConfig.row} className={`auditorium-row-group ${isStaffHighlightedRow ? 'staff-row' : ''}`}>
                    {/* Staff Row Highlight dashed border for rows A & B in staff view */}
                    {isStaffHighlightedRow && (
                      <rect
                        className="seat-finder-row-highlight"
                        x="50"
                        y={rowBaseY - 4}
                        width="1320"
                        height={SEAT_SIZE + 8}
                        rx="6"
                      />
                    )}

                    {/* Left row label */}
                    <text
                      className={`seat-finder-row-label ${isStaffHighlightedRow ? 'staff-row-label' : ''}`}
                      x="32"
                      y={rowBaseY + 11}
                      textAnchor="middle"
                    >
                      {rowConfig.row}
                    </text>

                    {/* Seat rects */}
                    {seatsList.map(({ seatNumber, seatId, x, y }) => {
                      const allocation = allocationBySeat.get(seatId)
                      const isMine = displayedSeatId === seatId
                      const isTaken = allocation ? true : isDeterministicallyOccupied(rowConfig.row, seatNumber)
                      const isFacultyOrStaff = allocation?.type === 'faculty' || allocation?.type === 'staff'
                      const isStaffStudent = isStaffView && allocation?.type === 'student'
                      const isGuest = allocation?.type === 'guest'

                      let className = 'seat-finder-seat'
                      if (isMine) className += ' mine'
                      else if (isStaffStudent) className += ' staff-student'
                      else if (isFacultyOrStaff) className += ' staff'
                      else if (isGuest) className += ' guest'
                      else if (isTaken) className += ' taken'

                      return (
                        <rect
                          key={seatId}
                          className={className}
                          x={x}
                          y={y}
                          width={SEAT_SIZE}
                          height={SEAT_SIZE}
                          rx="3"
                          role="button"
                          tabIndex={allocation ? 0 : -1}
                          aria-label={allocation ? `${allocation.name}, Seat ${seatId}` : `Seat ${seatId}`}
                          onClick={() => {
                            if (allocation) {
                              chooseAllocation(allocation)
                            }
                          }}
                          onMouseEnter={() => {
                            const bName = getBlockName(rowConfig.row, seatNumber) || 'Auditorium'
                            let statusText = 'Available'
                            if (isMine) statusText = `Allocated to ${selected.name}`
                            else if (allocation) statusText = `${allocation.name} (${allocation.role || allocation.type})`
                            else if (isTaken) statusText = 'Occupied'

                            setHoveredTooltip({
                              seatId,
                              row: rowConfig.row,
                              number: seatNumber,
                              tierName: isBalcony ? 'Balcony Level' : 'Ground Floor',
                              blockName: bName,
                              status: statusText,
                              attendeeName: allocation?.name,
                              x: x + SEAT_SIZE / 2,
                              y: y - 8,
                            })
                          }}
                          onMouseLeave={() => setHoveredTooltip(null)}
                        >
                          <title>
                            {seatId} · {allocation ? allocation.name : isTaken ? 'Occupied' : 'Available'} (
                            {isBalcony ? 'Balcony' : 'Ground Floor'})
                          </title>
                        </rect>
                      )
                    })}

                    {/* Right row label */}
                    <text
                      className={`seat-finder-row-label ${isStaffHighlightedRow ? 'staff-row-label' : ''}`}
                      x="1388"
                      y={rowBaseY + 11}
                      textAnchor="middle"
                    >
                      {rowConfig.row}
                    </text>
                  </g>
                )
              })}

              {/* WALKING ROUTE POLYLINE */}
              {routePoints && <polyline className="seat-finder-route" points={routePoints} />}

              {/* GATES & ENTRANCES (Ground or All) */}
              {(tierFilter === 'ground' || tierFilter === 'all') && (
                <g className="seat-finder-gates-group">
                  {(Object.entries(GATES) as Array<[GateId, (typeof GATES)[GateId]]>).map(([id, gate]) => (
                    <g
                      key={id}
                      onClick={() => setGateId(id)}
                      style={{ cursor: 'pointer' }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setGateId(id)}
                    >
                      <rect
                        className={`seat-finder-gate ${gateId === id ? 'active' : ''}`}
                        x={gate.x - 48}
                        y={gate.y - 14}
                        width="96"
                        height="30"
                        rx="6"
                      />
                      <text
                        className="seat-finder-gate-label"
                        x={gate.x}
                        y={gate.y + 5}
                        textAnchor="middle"
                      >
                        {gate.label}
                      </text>
                    </g>
                  ))}

                  {/* CAR PARKING & REFRESHMENT FACILITIES */}
                  <g className="seat-finder-facility parking" aria-label="Car Parking Zone P1">
                    <rect x="120" y="780" width="380" height="42" rx="8" />
                    <text x="310" y="798" textAnchor="middle">
                      CAR PARKING — ZONE P1
                    </text>
                    <text className="seat-finder-facility-subtitle" x="310" y="812" textAnchor="middle">
                      LOCATED BESIDE MAIN GATE 1 · DEDICATED STUDENT &amp; GUEST PARKING
                    </text>
                  </g>

                  <g className="seat-finder-facility refreshment" aria-label="Refreshment Food Court 02">
                    <rect x="920" y="780" width="380" height="42" rx="8" />
                    <text x="1110" y="798" textAnchor="middle">
                      REFRESHMENT — FOOD COURT 02
                    </text>
                    <text className="seat-finder-facility-subtitle" x="1110" y="812" textAnchor="middle">
                      BREAKFAST &amp; LUNCH COUNTERS BESIDE GATE 2
                    </text>
                  </g>
                </g>
              )}

              {/* BALCONY PORTALS & AMENITIES (Balcony Only) */}
              {tierFilter === 'balcony' && (
                <g className="seat-finder-gates-group">
                  {(Object.entries(BALCONY_PORTALS) as Array<[GateId, (typeof BALCONY_PORTALS)[GateId]]>).map(
                    ([id, portal]) => (
                      <g
                        key={id}
                        onClick={() => setGateId(id)}
                        style={{ cursor: 'pointer' }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setGateId(id)}
                      >
                        <rect
                          className={`seat-finder-gate ${gateId === id ? 'active' : ''}`}
                          x={portal.x - 65}
                          y={portal.y - 14}
                          width="130"
                          height="30"
                          rx="6"
                        />
                        <text
                          className="seat-finder-gate-label"
                          x={portal.x}
                          y={portal.y + 5}
                          textAnchor="middle"
                        >
                          {portal.label}
                        </text>
                      </g>
                    )
                  )}

                  <g className="seat-finder-facility parking">
                    <rect x="120" y="780" width="380" height="42" rx="8" />
                    <text x="310" y="798" textAnchor="middle">
                      WEST BALCONY FOYER &amp; RESTROOMS
                    </text>
                    <text className="seat-finder-facility-subtitle" x="310" y="812" textAnchor="middle">
                      ACCESSIBLE VIA WEST STAIRWAY · BESIDE BALCONY PORTAL 1
                    </text>
                  </g>

                  <g className="seat-finder-facility refreshment">
                    <rect x="920" y="780" width="380" height="42" rx="8" />
                    <text x="1110" y="798" textAnchor="middle">
                      EAST BALCONY REFRESHMENT KIOSK
                    </text>
                    <text className="seat-finder-facility-subtitle" x="1110" y="812" textAnchor="middle">
                      SNACKS &amp; WATER COUNTER BESIDE BALCONY PORTAL 2
                    </text>
                  </g>
                </g>
              )}
            </svg>
          </div>

          {/* Floating Hover Tooltip */}
          {hoveredTooltip && (
            <div
              className="seating-hover-tooltip"
              style={{
                left: `${(hoveredTooltip.x / CANVAS_WIDTH) * 100}%`,
                top: `${hoveredTooltip.y}px`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <strong>{hoveredTooltip.seatId}</strong>
              <span>
                {hoveredTooltip.tierName} · {hoveredTooltip.blockName}
              </span>
              <small>{hoveredTooltip.status}</small>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="seat-finder-legend" aria-label="Seating legend">
          <span>
            <i className="available" />
            Available Seat
          </span>
          <span>
            <i className="occupied" />
            Occupied
          </span>
          <span>
            <i className="guest" />
            Registered Guest (Row K)
          </span>
          <span>
            <i className="staff" />
            Faculty / Staff Coordinator
          </span>
          {isStaffView && (
            <span>
              <i className="staff-student" />
              Assigned Graduates (Rows A–B)
            </span>
          )}
          <span>
            <i className="mine" />
            {isStaffView ? 'Selected Attendee' : 'Your Seat (A-6)'}
          </span>
          <span>
            <i className="route" />
            Walking Route
          </span>
        </div>

        {/* Step-by-step Turn-by-Turn Directions */}
        <div className="seat-finder-directions-card">
          <div className="seat-finder-directions-header">
            <h4>
              Entrance &amp; Wayfinding Directions ({selected?.name ? selected.name : 'Your Route'})
            </h4>
            <span className="gate-selector-pill">
              Gate Entrance: <strong>Gate {gateId}</strong> (Click Gate in map to switch)
            </span>
          </div>
          <ol className="seat-finder-directions">
            {directions.map((direction, idx) => (
              <li key={idx}>{direction}</li>
            ))}
          </ol>
        </div>

        {/* Selected Attendee / Seat Detail Card */}
        {selected && (
          <section
            className={`seating-attendee-detail ${
              selected.type === 'faculty' || selected.type === 'staff'
                ? 'staff'
                : selected.type === 'guest'
                ? 'guest'
                : ''
            }`}
          >
            <div className="seating-attendee-heading">
              <span>
                {selected.name
                  .split(' ')
                  .filter(Boolean)
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)}
              </span>
              <div>
                <p>
                  {selected.type === 'faculty'
                    ? 'FACULTY SEATING'
                    : selected.type === 'staff'
                    ? 'STAFF SEATING'
                    : selected.type === 'guest'
                    ? 'GUEST SEATING'
                    : 'STUDENT SEATING'}
                </p>
                <h3>{selected.name}</h3>
                <small>{selected.registerNumber}</small>
              </div>
            </div>
            <dl>
              <div>
                <dt>Role</dt>
                <dd>{selected.role || (selected.type === 'guest' ? 'Registered Guest' : 'Graduate Attendee')}</dd>
              </div>
              <div>
                <dt>{selected.type === 'guest' ? 'Linked Student' : 'Department'}</dt>
                <dd>{selected.department || (selected.type === 'guest' ? '—' : 'Student')}</dd>
              </div>
              <div>
                <dt>Tier</dt>
                <dd>{selectedRowConfig?.tier === 'balcony' ? 'Balcony Level (Upper Tier)' : 'Ground Floor (Lower Tier)'}</dd>
              </div>
              <div>
                <dt>Block</dt>
                <dd>
                  {getBlockName(selected.row, selected.seat) || selected.block}
                </dd>
              </div>
              <div>
                <dt>Row</dt>
                <dd>Row {selected.row}</dd>
              </div>
              <div>
                <dt>Seat</dt>
                <dd>{selected.seat}</dd>
              </div>
              <div>
                <dt>Assigned Students</dt>
                <dd>
                  {selected.assignedStudentCount !== undefined
                    ? `${selected.assignedStudentCount} / ${selected.studentCapacity || 13}`
                    : '—'}
                </dd>
              </div>
              <div>
                <dt>Recommended Gate</dt>
                <dd>Gate {gateId} (Left Aisle Access)</dd>
              </div>
            </dl>
          </section>
        )}
      </section>
    </div>
  )
}
