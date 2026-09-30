// Scores an inbound lead's enquiry text using Gemini, so leads.ai_score,
// leads.priority, and leads.ai_summary get filled in automatically instead
// of every lead defaulting to "medium" with no reasoning. Uses the same
// Gemini model VisaBot Aria already relies on. If GEMINI_API_KEY isn't set
// or the call fails for any reason, this returns null and the caller just
// skips scoring — a lead is never blocked or lost because of this.

const MODEL_NAME = 'gemini-3.1-flash-lite'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`
const TIMEOUT_MS = 15000

const SYSTEM_PROMPT = `You score inbound leads for a small business's AI receptionist chatbot. Given the visitor's enquiry, rate how likely they are to become a paying customer.

Score 0-100:
- 80-100: specific request, clear timeline or budget, ready to book
- 50-79: genuine interest, some specifics, needs follow-up
- 20-49: general question, early-stage browsing
- 0-19: spam, irrelevant, or no real intent

Set priority to "high" for scores 70+, "medium" for 35-69, "low" below 35.
Keep the summary to one short sentence explaining the score.`

export type LeadScore = { score: number; priority: 'high' | 'medium' | 'low'; summary: string }

export async function scoreLead(text: string): Promise<LeadScore | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || !text || !text.trim()) return null

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(`${API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text }] }],
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 200,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              score: { type: 'integer' },
              priority: { type: 'string', enum: ['high', 'medium', 'low'] },
              summary: { type: 'string' },
            },
            required: ['score', 'priority', 'summary'],
          },
        },
      }),
      signal: controller.signal,
    })

    if (!res.ok) {
      console.error('[score-lead] Gemini API error:', res.status, await res.text().catch(() => ''))
      return null
    }

    const data = await res.json()
    const raw =
      data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('') ?? ''
    if (!raw) return null

    const parsed = JSON.parse(raw)
    const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score))))
    const priority: LeadScore['priority'] = ['high', 'medium', 'low'].includes(parsed.priority)
      ? parsed.priority
      : 'medium'
    const summary = String(parsed.summary || '').slice(0, 300)

    return { score, priority, summary }
  } catch (err) {
    console.error('[score-lead] Scoring failed:', err)
    return null
  } finally {
    clearTimeout(timeout)
  }
}
