import { VerifiedBadge } from '../components/VerifiedBadge'
import { WordReveal } from '../components/WordReveal'

export function About() {

  return (
    <section id="about" className="section about-section">
      <div className="about-layout">
        <div className="about-left-col">
          <div className="about-profile" data-reveal>
            <img
              src="/Rizzytoday Profile Picture.webp"
              alt="Zen"
              className="about-pfp-large"
            />
            <div className="about-identity">
              <h2 className="about-name-large">
                Riz Roze
                <VerifiedBadge color="red" />
              </h2>
              <p className="about-role">Creative Direction & Code</p>
              <p className="about-location-text">10+ years in creative environments</p>
            </div>
          </div>

          <div className="about-story">
            <WordReveal text="One person. \n The whole thing." className="section-title-lg" tag="h3" />
            <div className="about-paragraphs" data-reveal-stagger>
              <p>
                I direct, design, and build. Your project gets treated like it's mine, because for the time we're building together, it is.
              </p>
              <p>
                Brand, website, motion, app, presentation, content. Everything your project needs to fly. 4+ years in Solana, from hackathon launches to full protocol projects.
              </p>
              <p>
                Fast replies. Real progress. You'll never wonder what's happening.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
