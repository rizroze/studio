import { VerifiedBadge } from '../components/VerifiedBadge'

const TOOLS: { name: string; icon: string }[] = [
  { name: 'Figma', icon: '<path d="M12 2H8.5A3.5 3.5 0 005 5.5v0A3.5 3.5 0 008.5 9H12V2z"/><path d="M12 9H8.5A3.5 3.5 0 005 12.5v0A3.5 3.5 0 008.5 16H12V9z"/><path d="M12 16H8.5a3.5 3.5 0 100 7H8.5A3.5 3.5 0 0012 19.5V16z"/><path d="M12 2h3.5A3.5 3.5 0 0119 5.5v0A3.5 3.5 0 0115.5 9H12V2z"/><circle cx="15.5" cy="12.5" r="3.5"/>' },
  { name: 'React', icon: '<circle cx="12" cy="12" r="2.5"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>' },
  { name: 'TypeScript', icon: '<rect x="2" y="2" width="20" height="20" rx="3"/><text x="12" y="16" text-anchor="middle" font-size="12" font-weight="700" fill="black" font-family="sans-serif">TS</text>' },
  { name: 'Next.js', icon: '<circle cx="12" cy="12" r="10"/><path d="M9 8v8m0-8l7 8m0-8v2" stroke="black" stroke-width="1.5" stroke-linecap="round"/>' },
  { name: 'Vite', icon: '<path d="M22 3L12 21.5 2 3l10 2.5L22 3z"/><path d="M15 1l-3 8.5L2 3" stroke-width="0" />' },
  { name: 'Tailwind', icon: '<path d="M7 8c1-3 3-4 5-4 3 0 4 2 5 3s2 3 5 3c2 0 3-1 4-3M3 16c1-3 3-4 5-4 3 0 4 2 5 3s2 3 5 3c2 0 3-1 4-3"/>' },
  { name: 'GSAP', icon: '<circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 010 20" fill="rgba(255,255,255,0.3)"/><text x="12" y="15" text-anchor="middle" font-size="8" font-weight="700" fill="black" font-family="sans-serif">GS</text>' },
  { name: 'Remotion', icon: '<polygon points="5,3 19,12 5,21"/>' },
  { name: 'After Effects', icon: '<rect x="2" y="2" width="20" height="20" rx="3"/><text x="12" y="16" text-anchor="middle" font-size="11" font-weight="700" fill="black" font-family="sans-serif">Ae</text>' },
  { name: 'Solana', icon: '<path d="M4 17h14l2-2H6L4 17zm0-5h14l2-2H6L4 12zm2-5h14l2-2H6L4 7z"/>' },
  { name: 'Firebase', icon: '<path d="M6 20l2-14 3 6-5 8zm0 0l10 0-4-7L6 20zm6-16l-2 7 6 9 4-2L12 4z"/>' },
  { name: 'Three.js', icon: '<path d="M3 3h18L12 21z"/><path d="M12 3v18M3 3l9 18M21 3l-9 18" stroke="black" stroke-width="0.5"/>' },
  { name: 'Node.js', icon: '<path d="M12 2l9 5v10l-9 5-9-5V7l9-5z"/><text x="12" y="15" text-anchor="middle" font-size="8" font-weight="700" fill="black" font-family="sans-serif">N</text>' },
  { name: 'Midjourney', icon: '<circle cx="12" cy="12" r="10"/><path d="M7 15c1-4 3-7 5-9m0 0c2 2 4 5 5 9" stroke="black" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle cx="12" cy="8" r="2" fill="black"/>' },
]

export function About() {
  return (
    <section id="about" className="section about-section">
      <div className="about-profile" data-reveal>
        <img src="/rizzy-avatar.png" alt="Zen" className="about-pfp-large" />
        <div className="about-identity">
          <h2 className="about-name-large">
            Riz Rose
            <VerifiedBadge color="red" />
          </h2>
          <p className="about-role">Full-stack Creative</p>
          <p className="about-location-text">3+ years in the Solana ecosystem</p>
        </div>
      </div>

      <div className="about-two-col">
        <div className="about-story" data-reveal>
          <h3 className="section-title-lg">The designer who codes.</h3>
          <p>
            Most studios hand you a Figma file and call it done. I design it, code it, animate it, and deploy it — all under one roof. When the same person who designs your brand also writes the code, nothing falls through the cracks.
          </p>
          <p>
            I've been in the Solana ecosystem for 3+ years — building brands, shipping products, and creating design systems for NFT projects, DeFi protocols, and prediction markets. You don't have to explain what a mint page is or how a wallet connect flow works. I already know.
          </p>
          <p>
            When you work with me, you get my full attention. Fast responses, real-time progress, and no disappearing acts. I treat your project like it's mine — because for the time we're working together, it is.
          </p>
        </div>

        <div className="about-tools-col" data-reveal>
          <h4 className="about-tools-heading">Tools & Stack</h4>
          <div className="tools-grid-icons">
            {TOOLS.map(tool => (
              <div key={tool.name} className="tool-icon-item">
                <svg className="tool-icon-svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" dangerouslySetInnerHTML={{ __html: tool.icon }} />
                <span className="tool-icon-label">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
