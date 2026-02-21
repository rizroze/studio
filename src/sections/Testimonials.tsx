import { TESTIMONIALS } from '../constants/testimonials'
import { VerifiedBadge } from '../components/VerifiedBadge'

export function Testimonials() {
  return (
    <section id="testimonials" className="testimonials-full">
      <div className="testimonials-inner" data-reveal>
        <h2 className="section-title-xl" style={{ marginBottom: 40 }}>
          Real words from<br />real clients.
        </h2>

        <div className="testimonials-grid">
          {TESTIMONIALS.map(t => (
            <div key={t.id} className="testimonial-card">
              <div className="testimonial-card-top">
                <span className="testimonial-stars-row">★★★★★</span>
                <svg className="testimonial-quote-icon" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
                </svg>
              </div>

              <div className="testimonial-card-quote">
                <p>{t.quote}</p>
              </div>

              <div className="testimonial-card-attribution">
                <img src={t.pfp} alt={t.name} className="testimonial-pfp" />
                <div className="testimonial-info">
                  <div className="testimonial-name">
                    {t.name}
                    <VerifiedBadge color="red" />
                  </div>
                  <div className="testimonial-title">{t.title}</div>
                </div>
              </div>

              {t.job && (
                <div className={`job-done-tag ${t.job.type}`}>
                  <img src={t.job.logo} alt="" className="job-brand-logo" />
                  <span className="job-text">{t.job.text}</span>
                  {t.job.duration && <span className="job-duration">{t.job.duration}</span>}
                  {t.job.ongoing && <span className="ongoing-dot" />}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
