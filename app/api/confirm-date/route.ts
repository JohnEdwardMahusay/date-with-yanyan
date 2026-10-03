const dinnerChoices: Record<string, { name: string; detail: string }> = {
  '25th Lane': { name: '25th Lane', detail: 'Pasta' },
  'Simple Blends': { name: 'Simple Blends', detail: 'Drinks' },
  Seafoods: { name: 'Seafoods', detail: 'Shrimp' },
  'Chick n Bomb': { name: 'Chick n Bomb', detail: 'Chicken' },
  'Surprise Me': { name: 'Surprise Me', detail: 'Anything' },
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const selectedName = body && typeof body.food === 'string' ? body.food : ''
  const choice = dinnerChoices[selectedName]
  const date = body && typeof body.date === 'string' ? body.date : ''
  const time = body && typeof body.time === 'string' ? body.time : ''
  const meetupPreference = body && typeof body.meetupPreference === 'string' ? body.meetupPreference : ''
  const note = body && typeof body.note === 'string' ? body.note.trim() : ''
  const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T00:00:00.000Z`) : null

  if (!choice) {
    return Response.json({ error: 'Choose a valid dinner option.' }, { status: 400 })
  }

  if (!parsedDate || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date || date < '2026-10-01' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time) || !['pickup', 'meet-there'].includes(meetupPreference)) {
    return Response.json({ error: 'Choose a valid date, time, and meetup preference.' }, { status: 400 })
  }

  if (note.length > 1000) {
    return Response.json({ error: 'The note must be 1,000 characters or fewer.' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const recipient = process.env.DATE_INVITE_RECIPIENT

  if (!apiKey || !recipient) {
    return Response.json({ error: 'Email delivery is not configured.' }, { status: 503 })
  }

  let emailResponse: Response
  try {
    emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'Dinner Date <onboarding@resend.dev>',
        to: [recipient],
        subject: `Dinner date choice: ${choice.name}`,
        text: [
          'Yan accepted your dinner invitation!',
          '',
          `Restaurant choice: ${choice.name}`,
          `Her preference: ${choice.detail}`,
          `Date: ${date} at ${time}`,
          `Getting there: ${meetupPreference === 'pickup' ? 'She would like to be picked up' : 'She would like to meet there'}`,
          ...(note ? ['', 'Her note:', note] : []),
        ].join('\n'),
      }),
      cache: 'no-store',
    })
  } catch {
    return Response.json({ error: 'The email service could not be reached.' }, { status: 502 })
  }

  if (!emailResponse.ok) {
    console.error(`Resend request failed with status ${emailResponse.status}`)
    return Response.json({ error: 'The choice email could not be sent.' }, { status: 502 })
  }

  return Response.json({ sent: true })
}