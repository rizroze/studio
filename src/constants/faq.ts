export interface FAQItem {
  question: string
  answer: string
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Why one person instead of a team?',
    answer: 'What we talk about is what shows up on your screen. No handoffs, no compromises. That\'s why the work feels different.'
  },
  {
    question: 'How fast can you start?',
    answer: 'Within a week. Start: 1–2 weeks. Build: 2–4 weeks. Studio: 6–8 weeks.'
  },
  {
    question: 'What does the process look like?',
    answer: '15-min call → interactive questionnaire tailored for you → custom proposal. Then: Discovery → Design → Build → Ship. You see everything as it happens.'
  },
  {
    question: 'What if I just need one thing?',
    answer: 'We scope it on the call. Not every project needs the full stack.'
  },
  {
    question: 'Do you work outside web3?',
    answer: 'Yes. The approach is the same — I just need to care about what you\'re building.'
  },
  {
    question: 'How do revisions work?',
    answer: '2 rounds for Start, 3 for Build, unlimited for Studio. Most clients rarely need more than one.'
  },
  {
    question: 'How do payments work?',
    answer: 'SOL, USDC, or traditional. 50% upfront, 50% on delivery. No contracts, no retainers.'
  }
]
