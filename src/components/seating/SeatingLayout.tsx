import { useMemo, useState } from 'react'

export interface SeatAllocation {
  id: string
  name: string
  registerNumber: string
  block: string
  row: string
  seat: number
  type?: 'student' | 'faculty' | 'staff'
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

const ROWS = 'ABCDEFGHIJKL'.split('')
const BLOCKS = [
  { x0: 40, start: 1, count: 10 },
  { x0: 300, start: 11, count: 12 },
  { x0: 604, start: 23, count: 10 },
]
const AISLES = [270, 574]
const PITCH = 22
const CROSS_AISLE_Y = 458
const rowY = (index: number) => 120 + index * 28
const GATES: Record<GateId, { x: number; y: number; label: string }> = {
  '1': { x: 270, y: 488, label: 'Gate 1' },
  '2': { x: 574, y: 488, label: 'Gate 2' },
}
const OCCUPIED_SEATS = new Set(['A-3', 'B-9', 'C-14', 'D-5', 'F-10', 'F-13', 'G-12', 'H-20', 'E-22', 'J-2', 'K-15', 'L-7'])

interface SeatPosition {
  row: string
  number: number
  rowIndex: number
  blockIndex: number
  block: (typeof BLOCKS)[number]
  x: number
  y: number
}

const seatIdFor = (allocation?: SeatAllocation) => allocation ? `${allocation.row}-${allocation.seat}` : ''

function seatPosition(value: string): SeatPosition | null {
  const [row, numberText] = value.trim().toUpperCase().split('-')
  const number = Number(numberText)
  const rowIndex = ROWS.indexOf(row)
  const blockIndex = BLOCKS.findIndex((block) => number >= block.start && number < block.start + block.count)
  if (rowIndex < 0 || blockIndex < 0) return null
  const block = BLOCKS[blockIndex]
  return {
    row,
    number,
    rowIndex,
    blockIndex,
    block,
    x: block.x0 + (number - block.start) * PITCH + 9,
    y: rowY(rowIndex),
  }
}

function aisleFor(position: SeatPosition) {
  if (position.blockIndex === 0) return AISLES[0]
  if (position.blockIndex === 2) return AISLES[1]
  return Math.abs(position.x - AISLES[0]) <= Math.abs(position.x - AISLES[1]) ? AISLES[0] : AISLES[1]
}

export function SeatingLayout({ allocations, selectedId, onSelect, showRoster = false, isStaffView = false }: SeatingLayoutProps) {
  const [activeId, setActiveId] = useState(selectedId)
  const currentId = onSelect ? selectedId : activeId
  const selected = allocations.find((item) => item.id === currentId) || allocations[0]
  const displayedSeat = seatIdFor(selected)
  const [gateId, setGateId] = useState<GateId>('1')

  const position = useMemo(() => seatPosition(displayedSeat), [displayedSeat])
  const allocationBySeat = useMemo(
    () => new Map(allocations.map((allocation) => [seatIdFor(allocation), allocation])),
    [allocations],
  )

  const routePoints = useMemo(() => {
    if (!position) return ''
    const gate = GATES[gateId]
    const aisle = aisleFor(position)
    const points = [
      [gate.x, gate.y - 14],
      [gate.x, CROSS_AISLE_Y],
      [aisle, CROSS_AISLE_Y],
      [aisle, position.y],
      [position.x, position.y],
    ]
    return points
      .filter((point, index) => index === 0 || point[0] !== points[index - 1][0] || point[1] !== points[index - 1][1])
      .map((point) => point.join(','))
      .join(' ')
  }, [gateId, position])

  const directions = useMemo(() => {
    if (!position) return ['Seat not found. Enter a seat between A-1 and L-32.']
    const gate = GATES[gateId]
    const aisle = aisleFor(position)
    const aisleName = aisle === AISLES[0] ? 'left' : 'right'
    const side = position.x > aisle ? 'right' : 'left'
    const seatsIn = side === 'right'
      ? position.number - position.block.start + 1
      : position.block.start + position.block.count - position.number
    const steps = [`Enter through ${gate.label}.`]
    if (gate.x !== aisle) steps.push(`Walk along the cross aisle to the ${aisleName} aisle.`)
    steps.push(`Walk up the aisle towards the stage to Row ${position.row}.`)
    steps.push(`Turn ${side} and go ${seatsIn} seat${seatsIn === 1 ? '' : 's'} in. ${isStaffView ? 'Allocated seat is' : 'Your seat is'} ${position.row}${position.number}.`)
    return steps
  }, [gateId, isStaffView, position])

  const chooseAllocation = (allocation: SeatAllocation) => {
    setActiveId(allocation.id)
    onSelect?.(allocation.id)
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
              <button type="button" key={allocation.id} className={allocation.id === selected?.id ? 'active' : ''} onClick={() => chooseAllocation(allocation)}>
                <span className="seating-roster-avatar">{allocation.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
                <span><strong>{allocation.name}</strong><small>{allocation.registerNumber}{allocation.role ? ` · ${allocation.role}` : ''}</small></span>
                <b>{allocation.row}-{allocation.seat}</b>
              </button>
            ))}
          </div>
        </aside>
      )}

      <section className="panel seat-finder-card">
        <div className="seat-finder-heading">
          <div><p className="eyebrow">DR. T. P. GANESAN AUDITORIUM</p><h2>Convocation Seat Finder</h2></div>
          {selected && (
            <p>
              {isStaffView ? 'Attendee:' : 'Welcome,'} <strong>{selected.name}</strong>. {isStaffView ? 'Allocated seat is' : 'Your allocated seat is'} <strong>{displayedSeat}</strong>.
            </p>
          )}
        </div>

        <div className="seat-finder-map-wrap">
          <svg className="seat-finder-map" viewBox="0 0 860 580" role="img" aria-label="Auditorium seating, refreshment and car parking map">
            <rect className="seat-finder-stage" x="250" y="20" width="360" height="36" rx="8" />
            <text className="seat-finder-stage-label" x="430" y="43" textAnchor="middle">STAGE</text>

            {ROWS.map((row, rowIndex) => {
              const isStaffRow = isStaffView && (row === 'A' || row === 'B')
              return (
                <g key={row}>
                  <text className={`seat-finder-row-label ${isStaffRow ? 'staff-row-label' : ''}`} x="14" y={rowY(rowIndex) + 4}>{row}</text>
                  {BLOCKS.flatMap((block) => Array.from({ length: block.count }, (_, index) => {
                    const number = block.start + index
                    const seatId = `${row}-${number}`
                    const allocation = allocationBySeat.get(seatId)
                    const isMine = seatId === displayedSeat && Boolean(position)
                    const isTaken = OCCUPIED_SEATS.has(seatId) || Boolean(allocation)
                    const isFacultyOrStaff = allocation?.type === 'faculty' || allocation?.type === 'staff'
                    const isStaffStudent = Boolean(isStaffView && allocation?.type === 'student')
                    const className = `seat-finder-seat ${isMine ? 'mine' : isTaken ? 'taken' : ''} ${isFacultyOrStaff ? 'staff' : ''} ${isStaffStudent ? 'staff-student' : ''}`
                    return (
                      <rect
                        key={seatId}
                        className={className}
                        x={block.x0 + index * PITCH}
                        y={rowY(rowIndex) - 9}
                        width="18"
                        height="18"
                        rx="4"
                        role={allocation ? 'button' : undefined}
                        tabIndex={allocation ? 0 : undefined}
                        aria-label={allocation ? `${allocation.name}, seat ${seatId}` : `Seat ${seatId}`}
                        onClick={() => allocation && chooseAllocation(allocation)}
                        onKeyDown={(event) => allocation && (event.key === 'Enter' || event.key === ' ') && chooseAllocation(allocation)}
                      >
                        <title>{allocation ? `${seatId} · ${allocation.name}` : seatId}</title>
                      </rect>
                    )
                  }))}
                </g>
              )
            })}

            {(Object.entries(GATES) as Array<[GateId, (typeof GATES)[GateId]]>).map(([id, gate]) => (
              <g key={id} onClick={() => setGateId(id)} style={{ cursor: 'pointer' }} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setGateId(id)}>
                <rect className={`seat-finder-gate ${gateId === id ? 'active' : ''}`} x={gate.x - 34} y={gate.y - 14} width="68" height="28" rx="6" />
                <text className="seat-finder-gate-label" x={gate.x} y={gate.y + 4} textAnchor="middle">{gate.label}</text>
              </g>
            ))}

            {routePoints && <polyline className="seat-finder-route" points={routePoints} />}

            <g className="seat-finder-facility parking" aria-label="Car Parking Zone P1">
              <rect x="80" y="530" width="250" height="34" rx="8" />
              <text x="205" y="546" textAnchor="middle">CAR PARKING</text>
              <text className="seat-finder-facility-subtitle" x="205" y="558" textAnchor="middle">ZONE P1 · BESIDE GATE 1</text>
            </g>
            <g className="seat-finder-facility refreshment" aria-label="Refreshment Food Court 02">
              <rect x="530" y="530" width="250" height="34" rx="8" />
              <text x="655" y="546" textAnchor="middle">REFRESHMENT</text>
              <text className="seat-finder-facility-subtitle" x="655" y="558" textAnchor="middle">FOOD COURT 02</text>
            </g>
          </svg>
        </div>

        <div className="seat-finder-legend" aria-label="Seating legend">
          <span><i className="available" />Available</span>
          <span><i className="occupied" />Occupied</span>
          <span><i className="staff" />Faculty / Staff</span>
          {isStaffView && <span><i className="staff-student" />Assigned Graduates (Rows A–B)</span>}
          <span><i className="mine" />{isStaffView ? 'Selected attendee' : 'Your seat'}</span>
          <span><i className="route" />Route</span>
        </div>

        <ol className="seat-finder-directions">
          {directions.map((direction) => <li key={direction}>{direction}</li>)}
        </ol>

        {selected && (
          <section className={`seating-attendee-detail ${selected.type === 'faculty' || selected.type === 'staff' ? 'staff' : ''}`}>
            <div className="seating-attendee-heading">
              <span>{selected.name.split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2)}</span>
              <div>
                <p>{selected.type === 'faculty' ? 'FACULTY SEATING' : selected.type === 'staff' ? 'STAFF SEATING' : 'STUDENT SEATING'}</p>
                <h3>{selected.name}</h3>
                <small>{selected.registerNumber}</small>
              </div>
            </div>
            <dl>
              <div><dt>Role</dt><dd>{selected.role || 'Graduate attendee'}</dd></div>
              <div><dt>Department</dt><dd>{selected.department || 'Student'}</dd></div>
              <div><dt>Block</dt><dd>{selected.block}</dd></div>
              <div><dt>Row</dt><dd>{selected.row}</dd></div>
              <div><dt>Seat</dt><dd>{selected.seat}</dd></div>
              <div><dt>Assigned Students</dt><dd>{selected.assignedStudentCount !== undefined ? `${selected.assignedStudentCount} / ${selected.studentCapacity || 13}` : '—'}</dd></div>
              <div><dt>Email</dt><dd>{selected.email || '—'}</dd></div>
            </dl>
          </section>
        )}
      </section>
    </div>
  )
}
