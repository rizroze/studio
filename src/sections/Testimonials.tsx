import { TESTIMONIALS } from '../constants/testimonials'
import { VerifiedBadge } from '../components/VerifiedBadge'
import { XLogo } from '../components/XLogo'

export function Testimonials() {
  const devour = TESTIMONIALS.find(t => t.id === 'devour')!

  return (
    <section id="testimonials" className="testimonials-full">
      <div className="testimonial-open" data-reveal>
        <p className="testimonial-quote-text">
          "{devour.quote.replace(/^"|"$/g, '')}"
        </p>
        <div className="testimonial-attribution">
          <img src={devour.pfp} alt={devour.name} className="testimonial-pfp" />
          <div className="testimonial-info">
            <div className="testimonial-name">
              {devour.link ? (
                <a href={devour.link} target="_blank" rel="noopener noreferrer" className="testimonial-name-link">{devour.name}</a>
              ) : devour.name}
              <VerifiedBadge color="red" />
              <a href={devour.link || ''} target="_blank" rel="noopener noreferrer" className="testimonial-x-link"><XLogo size={11} /></a>
            </div>
            <div className="testimonial-title">{devour.title}</div>
          </div>
        </div>
        {devour.job && (
          <div className={`job-done-tag ${devour.job.type}`}>
            <img src={devour.job.logo} alt="" className="job-brand-logo" />
            <span className="job-text">{devour.job.text}</span>
            {devour.job.duration && <span className="job-duration">{devour.job.duration}</span>}
          </div>
        )}
      </div>
    </section>
  )
}

export function TestimonialBanner() {
  const jerk = TESTIMONIALS.find(t => t.id === 'jerk-terror')!

  return (
    <div className="testimonial-banner" data-reveal>
      <div className="testimonial-open">
        <p className="testimonial-quote-text">
          "{jerk.quote.replace(/^"|"$/g, '')}"
        </p>
        <div className="testimonial-attribution">
          <img src={jerk.pfp} alt={jerk.name} className="testimonial-pfp" />
          <div className="testimonial-info">
            <div className="testimonial-name">
              {jerk.link ? (
                <a href={jerk.link} target="_blank" rel="noopener noreferrer" className="testimonial-name-link">{jerk.name}</a>
              ) : jerk.name}
              <VerifiedBadge color="red" />
              <a href={jerk.link || ''} target="_blank" rel="noopener noreferrer" className="testimonial-x-link"><XLogo size={11} /></a>
            </div>
            <div className="testimonial-title">{jerk.title}</div>
          </div>
        </div>
        {jerk.job && (
          <div className={`job-done-tag ${jerk.job.type}`}>
            <img src={jerk.job.logo} alt="" className="job-brand-logo" />
            <span className="job-text">{jerk.job.text}</span>
          </div>
        )}
      </div>
    </div>
  )
}
