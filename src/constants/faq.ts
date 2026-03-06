export interface FAQItem {
  question: string
  answer: string
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Why one person instead of a team?',
    answer: 'What we talk about is what shows up on your screen. No handoff gaps, no lazy compromises, no telephone game between staff. It also means faster turnaround and one point of contact for everything.'
  },
  {
    question: 'How fast can you start?',
    answer: 'Within a week of booking. Start projects ship in 1–2 weeks. Build projects run 2–4 weeks. Studio engagements are 6–8 weeks with ongoing support.'
  },
  {
    question: 'What does the process look like?',
    answer: 'Discovery → Design → Build → Ship. I start with a call to understand your brand and goals. Then I explore directions, lock in the visual system, build it out in code, and deploy. You see everything as it happens.'
  },
  {
    question: 'What if I just need one thing?',
    answer: 'I scope it on the call. Not every project needs the full stack. Sometimes it\'s a pitch deck, sometimes it\'s a landing page. I\'ll recommend the right tier based on what you actually need.'
  },
  {
    question: 'Do you work outside web3?',
    answer: 'Yes. Web3 is where most of my portfolio lives, but great design is great design. If you\'re building something interesting, I\'m down.'
  },
  {
    question: 'How do revisions work?',
    answer: 'Each tier includes revision rounds (2 for Start, 3 for Build, unlimited for Studio). Most clients rarely need more than one. The upfront discovery work means I\'m aligned with your vision before pixels get pushed.'
  },
  {
    question: 'How do payments work?',
    answer: 'SOL, USDC, or traditional payment methods. 50% upfront, 50% on delivery. No long-term contracts, no retainer lock-in.'
  }
]
