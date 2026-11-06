import type { IconName } from '../components/ui/Icon'

export type MapCategory = 'all' | 'refreshment' | 'parking' | 'auditorium' | 'gates'

export interface VenuePoint {
  id: string
  mapCode: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'ENTRY'
  name: string
  shortLabel: string
  category: 'refreshment' | 'parking' | 'auditorium' | 'gates'
  tag: string
  timing?: string
  distance: string
  walkingTime: string
  tokenRequirement?: string
  capacity?: string
  hotspot: { xPercent: number; yPercent: number }
  color: string
  icon: IconName
  description: string
  instructions: string[]
}

export const VENUE_POINTS: VenuePoint[] = [
  // A - Car Parking Zone P1 (Graduates & Students)
  {
    id: 'parking-p1',
    mapCode: 'A',
    name: 'Zone A: Car Parking P1 (Graduates & Students)',
    shortLabel: 'Parking Zone P1 (Graduates)',
    category: 'parking',
    tag: 'Student Four-Wheeler & Two-Wheeler Lot',
    capacity: '450 Cars / 600 Two-Wheelers',
    distance: '200 meters from Main Gate',
    walkingTime: '3 min walk to Kit Counter',
    hotspot: { xPercent: 16.5, yPercent: 34.5 },
    color: '#be123c',
    icon: 'car',
    description: 'Designated parking area reserved for graduates and students. Direct pedestrian path connects to the graduation kit counter.',
    instructions: [
      'Enter via Campus Main Gate and follow the red route signs for Zone A.',
      'Display your Graduation Day Pass on the vehicle dashboard.',
      'Staff marshals are positioned to assist parking layout.',
    ],
  },

  // B - Car Parking Zone P2 (Guest & Family Vehicles)
  {
    id: 'parking-p2',
    mapCode: 'B',
    name: 'Zone B: Car Parking P2 (Guest & Family Vehicles)',
    shortLabel: 'Parking Zone P2 (Family & Guests)',
    category: 'parking',
    tag: 'Guest & Family Vehicle Grounds',
    capacity: '800 Vehicles',
    distance: '350 meters from Main Gate',
    walkingTime: '5 min walk (1 min by shuttle)',
    hotspot: { xPercent: 22.0, yPercent: 60.5 },
    color: '#be123c',
    icon: 'car',
    description: 'Spacious vehicle grounds dedicated to accompanying family members and guests attending the ceremony.',
    instructions: [
      'Enter through Gate 2 along the campus perimeter loop.',
      'Free battery-operated buggy shuttle available for senior citizens.',
      'Direct paved walkway leading to the Auditorium Guest Portico.',
    ],
  },

  // C - Kit Distribution & Walkway
  {
    id: 'kit-counter',
    mapCode: 'C',
    name: 'Zone C: Kit Distribution & Registration Walkway',
    shortLabel: 'Kit Distribution & Gown Counters',
    category: 'auditorium',
    tag: 'Gown, Robe, Breakfast & Lunch Tokens',
    timing: '08:00 AM – 09:45 AM',
    distance: '100 meters from Entry',
    walkingTime: '1.5 min walk',
    hotspot: { xPercent: 37.0, yPercent: 63.8 },
    color: '#1d4ed8',
    icon: 'tag',
    description: 'First event checkpoint where graduates verify face attendance and collect their academic gown, ceremonial robe, breakfast coupon, and lunch token.',
    instructions: [
      'Counters are organized by discipline (BBA, BCA, MBA, MCA, M.Com).',
      'Have your digital QR pass ready on your phone screen.',
      'Receive your ceremonial gown, stole, breakfast token, and lunch token.',
    ],
  },

  // D - Dr. T. P. Ganesan Auditorium
  {
    id: 'auditorium-main',
    mapCode: 'D',
    name: 'Zone D: Dr. T. P. Ganesan Auditorium (Main Venue)',
    shortLabel: 'Dr. T. P. Ganesan Auditorium',
    category: 'auditorium',
    tag: 'Main Convocation Venue & Stage',
    timing: 'Biometric Gate entry opens 09:30 AM · Ceremony begins 10:30 AM',
    distance: 'Central Complex',
    walkingTime: '2 min walk from Kit Counter',
    hotspot: { xPercent: 48.4, yPercent: 76.7 },
    color: '#1e3a8a',
    icon: 'award',
    description: 'Air-conditioned 3,000-seat central auditorium where the degree conferral, registered faculty distribution, and solemn convocation procession take place.',
    instructions: [
      'Facial recognition verification at Gate 1, Gate 2, and Gate 3.',
      'Students proceed to their pre-allotted seats in the main auditorium bowl.',
      'Guests are escorted to First Floor Gallery 01 and Gallery 02.',
    ],
  },

  // E - Food Court 01 (Breakfast)
  {
    id: 'food-court-1',
    mapCode: 'E',
    name: 'Zone E: Food Court 01 — Breakfast Counter',
    shortLabel: 'Food Court 01 (Breakfast)',
    category: 'refreshment',
    tag: 'Breakfast Dining & Token Validation',
    timing: '08:30 AM – 10:00 AM',
    distance: '120 meters from Kit Counter',
    walkingTime: '2 min walk',
    tokenRequirement: 'Breakfast Token (From Graduation Kit)',
    hotspot: { xPercent: 57.5, yPercent: 46.9 },
    color: '#15803d',
    icon: 'coffee',
    description: 'Morning dining pavilion for graduates and their registered guests. Present the breakfast token issued at the kit counter.',
    instructions: [
      'Breakfast token validated and redeemed before food service.',
      'Hot South Indian breakfast buffet (Idli, Vada, Pongal, Kesari, Coffee & Tea).',
      'Continuous service until 10:00 AM before moving into the auditorium.',
    ],
  },

  // F - Photo Session Arena
  {
    id: 'photo-booth',
    mapCode: 'F',
    name: 'Zone F: Photo Session Arena & Robing Suite',
    shortLabel: 'Photo Session & Backdrop',
    category: 'auditorium',
    tag: 'Official Graduate Portrait Booths',
    timing: '12:00 PM – 02:00 PM (Post Ceremony)',
    distance: 'Adjacent to Auditorium East Exit',
    walkingTime: '1 min walk',
    hotspot: { xPercent: 34.0, yPercent: 49.9 },
    color: '#1d4ed8',
    icon: 'camera',
    description: 'Professional graduation photo booths with official university backdrops for individual and family portraits post-degree receipt.',
    instructions: [
      'Graduates proceed here immediately after receiving degree certificates.',
      'Photo session completion milestone unlocks the lunch token validation.',
      'Digital photos can be accessed online via your registration ID.',
    ],
  },

  // G - Food Court 02 (Lunch Feast)
  {
    id: 'food-court-2',
    mapCode: 'G',
    name: 'Zone G: Food Court 02 — Grand Lunch Feast',
    shortLabel: 'Food Court 02 (Lunch Feast)',
    category: 'refreshment',
    tag: 'Lunch Dining & Token Validation',
    timing: '12:30 PM – 02:30 PM',
    distance: '180 meters from Photo Arena',
    walkingTime: '3 min walk',
    tokenRequirement: 'Lunch Token (From Graduation Kit)',
    hotspot: { xPercent: 52.3, yPercent: 30.9 },
    color: '#0284c7',
    icon: 'coffee',
    description: 'Post-ceremony grand lunch feast for all graduates and registered accompanying guests following the photo session milestone.',
    instructions: [
      'Present and redeem your Lunch Token at the dining entrance.',
      'Elaborate multi-cuisine festive buffet with vegetarian & non-vegetarian counters.',
      'Covered lawn dining pavilion with ample seating for families.',
    ],
  },

  // YOU ARE HERE - Campus Entry
  {
    id: 'campus-entry',
    mapCode: 'ENTRY',
    name: 'Main Campus Gateway (You Are Here)',
    shortLabel: 'Main Gateway Checkpoint',
    category: 'gates',
    tag: 'Campus Arrival & Registration Check',
    timing: 'Gates open 07:30 AM',
    distance: '0 meters (Starting Point)',
    walkingTime: 'Arrival Entrance',
    hotspot: { xPercent: 69.1, yPercent: 59.6 },
    color: '#65a30d',
    icon: 'location',
    description: 'Main arrival arch on GST Road opposite Potheri Railway Station. Proceed straight down the boulevard toward Kit Counters (Zone C) or Parking (Zones A & B).',
    instructions: [
      'Show your Graduation Day Pass on entry for gate admission.',
      'Pedestrians walk along the shaded central boulevard directly to Zone C.',
      'Vehicles follow marshals toward Zone A (Students) or Zone B (Guests).',
    ],
  },
]
