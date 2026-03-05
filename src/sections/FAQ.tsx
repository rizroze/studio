import { useState } from 'react'
import { track } from '@vercel/analytics'
import { FAQ_ITEMS } from '../constants/faq'

export function FAQ() {
  return (
    <section id="contact" className="section faq-contact-section">
      <div className="faq-contact-grid">
        <div className="faq-col">
          <h2 className="section-title-xl" data-reveal>Before you ask.</h2>
          <div className="faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem key={i} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>

        <div className="cta-col">
          <div className="cta-card">
            <img src="/rizzy-avatar.webp" alt="Riz Rose" className="cta-card-pfp" />
            <h3 className="cta-card-headline">Let's build something.</h3>
            <p className="cta-card-sub">15 min call. No pitch deck needed. Let's chat about what you're thinking on.</p>
            <a
              href="https://cal.com/rizzytoday"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-card-btn"
              onClick={() => track('cta_click', { location: 'contact' })}
            >
              <span className="status-dot" />
              Schedule a call
            </a>
            <div className="cta-card-socials">
              <a href="https://x.com/rizzytoday" target="_blank" rel="noopener noreferrer">X</a>
              <span className="contact-divider-dot" />
              <a href="https://discord.com/users/rizzytoday" target="_blank" rel="noopener noreferrer">Discord</a>
              <span className="contact-divider-dot" />
              <a href="https://github.com/rizzytoday" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
            <p className="cta-card-payment">Accepts SOL, USDC, and traditional payments.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(!open)}>
        <span>{question}</span>
        <svg
          className="faq-chevron"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="faq-answer">
        <div className="faq-answer-inner">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  )
}
