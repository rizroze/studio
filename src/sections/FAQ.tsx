import { useState } from 'react'
import { track } from '@vercel/analytics'
import { FAQ_ITEMS } from '../constants/faq'
import { VerifiedBadge } from '../components/VerifiedBadge'

import { WordReveal } from '../components/WordReveal'

export function FAQ() {
  return (
    <section id="contact" className="section faq-contact-section">
      <div className="faq-contact-grid">
        <div className="faq-col">
          <WordReveal text="Before you ask." className="section-title-xl" tag="h2" />
          <div className="faq-list" data-reveal-stagger>
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem key={i} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>

        <div className="cta-col">
          <div className="biz-card" data-reveal>
            {/* Top — identity */}
            <div className="biz-card-identity">
              <img src="/studio-rose.webp" alt="Riz Rose" className="biz-card-pfp" />
              <div>
                <h3 className="biz-card-name">Riz Rose <VerifiedBadge color="red" /></h3>
              </div>
            </div>

            <div className="biz-card-divider" />

            {/* Middle — pitch */}
            <p className="biz-card-pitch">Your project deserves someone who gives a damn.</p>

            {/* CTA */}
            <a
              href="https://cal.com/rizzytoday"
              target="_blank"
              rel="noopener noreferrer"
              className="biz-card-btn"
              onClick={() => track('cta_click', { location: 'contact' })}
            >
              <span className="status-dot" />
              Let's talk
            </a>
            <div className="biz-card-steps">
              <div className="biz-step">
                <span className="biz-step-num">1</span>
                <span className="biz-step-text">15-min intro call</span>
              </div>
              <div className="biz-step">
                <span className="biz-step-num">2</span>
                <span className="biz-step-text">Interactive questionnaire</span>
              </div>
              <div className="biz-step">
                <span className="biz-step-num">3</span>
                <span className="biz-step-text">Custom proposal</span>
              </div>
            </div>

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
