import { Icon } from '../components/ui/Icon'
import groupPortrait from '../assets/convocation-group-portrait.jpg'
import campusCelebration from '../assets/convocation-campus-celebration.jpg'
import facultyGroup from '../assets/convocation-faculty-group.jpg'

const CONVOCATION_PHOTOS = [
  {
    src: groupPortrait,
    filename: 'convocation-2026-graduate-group.jpg',
    title: 'Graduating Class Group Portrait',
    description: 'Official group photograph of the graduating class on the convocation stage.',
  },
  {
    src: campusCelebration,
    filename: 'convocation-2026-campus-celebration.jpg',
    title: 'Campus Celebration',
    description: 'Graduates celebrating together after completing the ceremony.',
  },
  {
    src: facultyGroup,
    filename: 'convocation-2026-faculty-and-graduates.jpg',
    title: 'Graduates with Faculty',
    description: 'Official photograph of graduates with faculty and ceremony representatives.',
  },
]

export function PhotoGalleryPage() {
  return (
    <div className="page prototype-page photo-gallery-page">
      <section className="panel photo-gallery-panel">
        <div className="photo-gallery-heading">
          <div>
            <p className="eyebrow">CONVOCATION 2026 MEMORIES</p>
            <h2>Convocation Group Photos</h2>
            <p>View and download official photographs from the Graduation Day ceremony.</p>
          </div>
          <span><Icon name="camera" size={16} /> {CONVOCATION_PHOTOS.length} photos</span>
        </div>

        <div className="convocation-photo-grid">
          {CONVOCATION_PHOTOS.map((photo) => (
            <article className="convocation-photo-card" key={photo.filename}>
              <div className="convocation-photo-preview">
                <img src={photo.src} alt={photo.title} />
                <span>Official Photo</span>
              </div>
              <div className="convocation-photo-details">
                <div>
                  <h3>{photo.title}</h3>
                  <p>{photo.description}</p>
                </div>
                <a href={photo.src} download={photo.filename} aria-label={`Download ${photo.title}`}>
                  <Icon name="download" size={17} /> Download
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
