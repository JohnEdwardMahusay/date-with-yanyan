'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Heart, Mail, MapPin, Send, Sparkles, Utensils } from 'lucide-react'

const letterMessage = 'I know we have been through a lot, specially for what I did to you. I said that ill redeem myself thats why I maked this as a little surprise for you. I hope you will accept this invitation and we can have a good time together. This is just the start of it. 💕'

const foodOptions = [
  { emoji: '', name: '25th Lane', detail: 'Pasta' },
  { emoji: '', name: 'Simple Blends', detail: 'Drinks' },
  { emoji: '', name: 'Seafoods', detail: 'Shrimp' },
  { emoji: '', name: 'Chick n Bomb', detail: 'Chicken' },
  { emoji: '', name: 'Surprise Me', detail: 'Anything' },
]

const floatingBits = [
  { symbol: '✦', top: '12%', left: '8%', delay: 0, size: 'text-sm' },
  { symbol: '♡', top: '19%', left: '88%', delay: 1.2, size: 'text-2xl' },
  { symbol: '✧', top: '48%', left: '5%', delay: 2.2, size: 'text-lg' },
  { symbol: '♡', top: '64%', left: '93%', delay: 0.7, size: 'text-lg' },
  { symbol: '✦', top: '83%', left: '10%', delay: 1.7, size: 'text-xs' },
  { symbol: '✧', top: '78%', left: '87%', delay: 2.8, size: 'text-sm' },
]

function FloatingBits() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      {floatingBits.map((bit) => (
        <motion.span
          key={`${bit.top}-${bit.left}`}
          className={`absolute text-[#c99087]/45 ${bit.size}`}
          style={{ top: bit.top, left: bit.left }}
          animate={{ y: [0, -12, 0], rotate: [0, 8, -5, 0], opacity: [0.35, 0.8, 0.35] }}
          transition={{ duration: 5, delay: bit.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          {bit.symbol}
        </motion.span>
      ))}
    </div>
  )
}

function DateSummary({ date, time, meetupPreference }: { date: string; time: string; meetupPreference: string }) {
  const dateLabel = date
    ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(`${date}T00:00:00`))
    : 'Choose a date'
  const timeLabel = time
    ? new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(`2026-10-01T${time}`))
    : 'Choose a time'

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#ead8d1] pt-4 text-xs font-medium text-[#7d6a68]">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fbf2ec] px-3 py-1.5"><CalendarDays className="size-3.5 text-[#bb7b72]" /> {dateLabel}</span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fbf2ec] px-3 py-1.5"><Clock3 className="size-3.5 text-[#bb7b72]" /> {timeLabel}</span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fbf2ec] px-3 py-1.5"><MapPin className="size-3.5 text-[#bb7b72]" /> {meetupPreference === 'pickup' ? 'Pick me up' : meetupPreference === 'meet-there' ? 'Meet there' : 'Choose where to meet'}</span>
    </div>
  )
}

const minimumDate = '2026-10-01'

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function CalendarPicker({ value, onChange, isOpen, onOpenChange }: { value: string; onChange: (value: string) => void; isOpen: boolean; onOpenChange: (open: boolean) => void }) {
  const [viewMonth, setViewMonth] = useState(new Date(2026, 9, 1))
  const monthLabel = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(viewMonth)
  const firstWeekday = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay()
  const days = Array.from({ length: 42 }, (_, index) => new Date(viewMonth.getFullYear(), viewMonth.getMonth(), index - firstWeekday + 1))
  const previousMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1)
  const canGoBack = dateKey(previousMonth) >= '2026-10-01'

  return (
    <div className="relative">
      <p className="mb-1.5 text-xs font-medium text-[#7d6a68]">Date</p>
      <button type="button" aria-haspopup="dialog" aria-expanded={isOpen} onClick={() => onOpenChange(!isOpen)} className="flex h-11 w-full items-center justify-between rounded-xl border border-[#ead8d1] bg-[#fffdfb] px-3 text-sm text-[#513c3b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd716c]">
        <span className={value ? '' : 'text-[#a18c87]'}>{value ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(`${value}T00:00:00`)) : 'Pick a date'}</span>
        <CalendarDays aria-hidden="true" className="size-4 text-[#98716c]" />
      </button>
      {isOpen && (
        <div role="dialog" aria-label="Choose a date" className="absolute left-0 z-30 mt-1.5 w-[min(19rem,calc(100vw-3rem))] rounded-xl border border-[#ead8d1] bg-white p-3 text-[#3f3434] shadow-[0_12px_28px_rgba(55,38,34,0.18)]">
          <div className="flex h-10 items-center justify-between border-b border-[#eee8e5] px-1 pb-2">
            <button type="button" aria-label="Previous month" disabled={!canGoBack} onClick={() => setViewMonth(previousMonth)} className="flex size-8 items-center justify-center rounded-lg text-[#817875] hover:bg-[#f8f4f2] disabled:cursor-not-allowed disabled:opacity-30"><ChevronLeft className="size-4" /></button>
            <span className="text-sm font-semibold">{monthLabel}</span>
            <button type="button" aria-label="Next month" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))} className="flex size-8 items-center justify-center rounded-lg text-[#817875] hover:bg-[#f8f4f2]"><ChevronRight className="size-4" /></button>
          </div>
          <div className="grid grid-cols-7 pt-2 text-center text-[11px] font-semibold text-[#514b48]" aria-hidden="true">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => <span key={day} className="flex h-8 items-center justify-center">{day}</span>)}
          </div>
          <div className="grid grid-cols-7 text-center">
            {days.map((day) => {
              const key = dateKey(day)
              const isSelected = key === value
              const isOutsideMonth = day.getMonth() !== viewMonth.getMonth()
              const isDisabled = key < minimumDate
              return <button key={key} type="button" aria-label={new Intl.DateTimeFormat('en', { dateStyle: 'full' }).format(day)} aria-pressed={isSelected} disabled={isDisabled} onClick={() => { onChange(key); setViewMonth(new Date(day.getFullYear(), day.getMonth(), 1)); onOpenChange(false) }} className={`mx-auto flex size-9 items-center justify-center rounded-full text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd716c] ${isSelected ? 'bg-[#bd716c] font-semibold text-white' : isDisabled || isOutsideMonth ? 'text-[#aaa3a0]' : 'text-[#302c2a] hover:bg-[#f8e9e4]'} disabled:cursor-not-allowed`}>{day.getDate()}</button>
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function TimePicker({ value, onChange, isOpen, onOpenChange }: { value: string; onChange: (value: string) => void; isOpen: boolean; onOpenChange: (open: boolean) => void }) {
  const times = Array.from({ length: 48 }, (_, index) => `${String(Math.floor(index / 2)).padStart(2, '0')}:${index % 2 === 0 ? '00' : '30'}`)

  return (
    <div className="relative">
      <p className="mb-1.5 text-xs font-medium text-[#7d6a68]">Time</p>
      <button type="button" aria-haspopup="listbox" aria-expanded={isOpen} onClick={() => onOpenChange(!isOpen)} className="flex h-11 w-full items-center justify-between rounded-xl border border-[#ead8d1] bg-[#fffdfb] px-3 text-sm text-[#513c3b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd716c]">
        <span className={value ? '' : 'text-[#a18c87]'}>{value ? new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(`2026-10-01T${value}`)) : 'Pick a time'}</span>
        <Clock3 aria-hidden="true" className="size-4 text-[#98716c]" />
      </button>
      {isOpen && (
        <div role="listbox" aria-label="Choose a time" className="absolute right-0 z-30 mt-1.5 max-h-64 w-full min-w-40 overflow-y-auto rounded-xl border border-[#ead8d1] bg-white p-1.5 shadow-[0_12px_28px_rgba(55,38,34,0.18)]">
          {times.map((option) => {
            const isSelected = option === value
            return <button key={option} type="button" role="option" aria-selected={isSelected} onClick={() => { onChange(option); onOpenChange(false) }} className={`flex h-9 w-full items-center justify-between rounded-lg px-3 text-left text-sm ${isSelected ? 'bg-[#f8e9e4] font-semibold text-[#8e514c]' : 'text-[#514b48] hover:bg-[#f8f4f2]'}`}>
              {new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(`2026-10-01T${option}`))}
              {isSelected && <Check className="size-3.5" />}
            </button>
          })}
        </div>
      )}
    </div>
  )
}

function EnvelopeStage({ onDone }: { onDone: () => void }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.section key="letter" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }} className="relative z-10 w-full max-w-xl text-center">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ad7974]">A little something for you</p>
      <h1 className="font-serif text-4xl leading-tight text-[#513c3b] sm:text-5xl"> <span className="text-[#bd716c]"></span></h1>
      <p className="mt-3 text-base text-[#927e7a]">{isOpen ? 'Take your time. There is no rush.' : 'There is a little note waiting inside.'}</p>

      <div className="relative mx-auto mt-10 flex min-h-[290px] w-full max-w-md items-center justify-center sm:min-h-[330px]">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.button key="envelope" type="button" onClick={() => setIsOpen(true)} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -24, scale: 0.96 }} whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} aria-label="Open your letter" className="group relative h-56 w-full max-w-sm overflow-hidden rounded-2xl border border-[#e6c9bf] bg-[#f2dcd3] shadow-[0_22px_55px_rgba(130,85,72,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd716c] focus-visible:ring-offset-4 sm:h-64">
              <span aria-hidden="true" className="absolute inset-0 bg-[#f5e3dc]" />
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0 w-0 border-x-[190px] border-b-[150px] border-x-transparent border-b-[#edcfc5] sm:border-x-[210px] sm:border-b-[170px]" />
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0 w-0 border-x-[190px] border-t-[125px] border-x-transparent border-t-[#e9c7bd] transition-transform duration-500 group-hover:rotate-x-12 sm:border-x-[210px] sm:border-t-[140px]" />
              <span className="absolute left-1/2 top-1/2 z-10 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#d9aaa0] bg-[#fff8f4] text-[#bd716c] shadow-md"><Heart className="size-6 fill-current" /></span>
              <span className="absolute bottom-5 left-0 right-0 z-10 text-sm font-semibold text-[#805b56]">Open your letter</span>
            </motion.button>
          ) : (
            <motion.article key="note" initial={{ opacity: 0, y: 22, rotate: 1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ type: 'spring', damping: 20, stiffness: 180 }} className="w-full rounded-xl border border-[#eee1db] bg-[#fffdfb] px-7 py-9 text-center shadow-[0_20px_55px_rgba(130,85,72,0.13)] sm:px-10 sm:py-11">
              <div className="mb-6 flex items-center justify-center gap-2 text-[#bd716c]"><Mail className="size-4" /><span className="text-[10px] font-semibold uppercase tracking-[0.22em]">A note for you</span></div>
              <p className="whitespace-pre-line font-serif text-xl leading-8 text-[#5b4643] sm:text-2xl">{letterMessage}</p>
              <p className="mt-8 font-serif text-lg italic text-[#a97870]">-Edward</p>
              <button type="button" onClick={onDone} className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#bd716c] px-6 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(189,113,108,0.22)] transition-colors hover:bg-[#a9615d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd716c] focus-visible:ring-offset-2">Done reading <Heart className="size-4 fill-current" /></button>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-[#b4a09b]">Made with <Heart className="size-3 fill-[#c99087] text-[#c99087]" /> and a little courage</p>
    </motion.section>
  )
}

export default function Page() {
  const [accepted, setAccepted] = useState(false)
  const [hasReadLetter, setHasReadLetter] = useState(false)
  const [food, setFood] = useState('25th Lane')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [note, setNote] = useState('')
  const [openPicker, setOpenPicker] = useState<'date' | 'time' | null>(null)
  const [meetupPreference, setMeetupPreference] = useState('')
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 })
  const [isSendingChoice, setIsSendingChoice] = useState(false)
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sent' | 'error' | 'setup' | 'incomplete'>('idle')

  const moveNo = () => {
    setNoPosition({
      x: Math.round((Math.random() - 0.5) * 170),
      y: Math.round((Math.random() - 0.5) * 110),
    })
  }

  const sayYes = () => {
    setAccepted(true)
    confetti({ particleCount: 120, spread: 75, origin: { y: 0.64 }, colors: ['#c97772', '#e6b27d', '#f3d7ce', '#fff8f3'] })
  }

  const sendChoice = async () => {
    if (isSendingChoice) return
    if (!date || !time || !meetupPreference) {
      setEmailStatus('incomplete')
      return
    }

    setIsSendingChoice(true)
    setEmailStatus('idle')

    try {
      const response = await fetch('/api/confirm-date', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ food, date, time, meetupPreference, note }),
      })

      if (response.status === 503) {
        setEmailStatus('setup')
      } else if (!response.ok) {
        setEmailStatus('error')
      } else {
        setEmailStatus('sent')
      }
    } catch {
      setEmailStatus('error')
    } finally {
      setIsSendingChoice(false)
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#fbf5ef] px-5 py-10 text-[#3f3434] selection:bg-[#edc9c0] sm:px-8 sm:py-14">
      <FloatingBits />
      <motion.div aria-hidden="true" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: [0, -7, 0] }} transition={{ opacity: { duration: 0.8 }, y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' } }} className="pointer-events-none absolute bottom-2 right-2 z-0 hidden w-24 lg:right-5 lg:block lg:w-64 xl:right-8 xl:w-72">
        <Image src="/chibifinal.png" alt="" width={896} height={1195} priority className="h-auto w-full object-contain drop-shadow-[0_14px_16px_rgba(80,55,50,0.14)]" />
      </motion.div>
      <AnimatePresence mode="wait">
      {!hasReadLetter ? (
        <EnvelopeStage key="envelope-stage" onDone={() => setHasReadLetter(true)} />
      ) : (
      <motion.div key="invitation-stage" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }} className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center">
        <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-9 text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ad7974]">A tiny invitation</p>
          <h1 className="font-serif text-4xl leading-tight tracking-[-0.03em] text-[#513c3b] sm:text-5xl">Hi yan, <span className="inline-block text-[#bd716c]">♥</span></h1>
          <p className="mt-3 text-base text-[#927e7a] sm:text-lg">I have a special question for you...</p>
        </motion.header>

        <AnimatePresence mode="wait">
          {!accepted ? (
            <motion.section key="question" initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: -16 }} transition={{ duration: 0.45 }} className="w-full rounded-[2rem] border border-[#ebd8d1] bg-[#fffdfb]/90 p-6 text-center shadow-[0_24px_70px_rgba(130,85,72,0.12)] backdrop-blur sm:p-10">
              <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-[#f8e5df] text-4xl shadow-inner shadow-[#e9c4bc]">🥂</div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#ba817a]">One important thing</p>
              <h2 className="font-serif text-4xl leading-[1.08] tracking-[-0.035em] text-[#493938] sm:text-6xl">Will you go on a<br className="hidden sm:block" /> dinner date with me?</h2>
              <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-[#927e7a]">Good food, our favorite kind of conversation, and a night made just for us.</p>
              <div className="relative mt-9 flex min-h-14 items-center justify-center gap-3">
                <motion.button type="button" onClick={sayYes} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} className="inline-flex h-14 items-center gap-2 rounded-full bg-[#bd716c] px-9 text-base font-semibold text-white shadow-[0_12px_24px_rgba(189,113,108,0.25)] transition-colors hover:bg-[#a9615d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd716c] focus-visible:ring-offset-2">Yes, absolutely! <Heart className="size-4 fill-current" /></motion.button>
                <motion.button type="button" onMouseEnter={moveNo} onFocus={moveNo} onClick={moveNo} animate={{ x: noPosition.x, y: noPosition.y }} transition={{ type: 'spring', stiffness: 320, damping: 18 }} className="h-11 rounded-full border border-[#dec8c0] bg-[#fffdfb] px-5 text-sm font-medium text-[#9a8580] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd716c]">Maybe not</motion.button>
              </div>
              <p className="mt-8 text-[11px] text-[#b4a09b]">P.S. the second button is feeling a little shy</p>
            </motion.section>
          ) : (
            <motion.section key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
              <div className="rounded-[2rem] border border-[#ebd8d1] bg-[#fffdfb]/90 p-6 text-center shadow-[0_24px_70px_rgba(130,85,72,0.12)] backdrop-blur sm:p-10">
                <motion.div initial={{ scale: 0.6, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', bounce: 0.5 }} className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-[#f8e5df] text-3xl">✨</motion.div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ba817a]">It&apos;s a date!</p>
                <h2 className="mt-2 font-serif text-5xl tracking-[-0.04em] text-[#493938] sm:text-6xl">Yay! I can&apos;t wait.</h2>
                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#927e7a]">Now let&apos;s make it perfectly us. Pick what you&apos;re craving and I&apos;ll take care of the rest.</p>
                <DateSummary date={date} time={time} meetupPreference={meetupPreference} />
              </div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-5 rounded-[1.5rem] border border-[#ebd8d1] bg-[#fffdfb]/85 p-5 shadow-[0_14px_40px_rgba(130,85,72,0.07)] sm:p-6">
                <div className="mb-4 flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-full bg-[#f8e5df]"><CalendarDays className="size-4 text-[#b96f69]" /></div><div><h3 className="font-serif text-xl text-[#513c3b]">When works for you?</h3><p className="text-xs text-[#a18c87]">Pick a date and time, starting October 2026</p></div></div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <CalendarPicker value={date} isOpen={openPicker === 'date'} onOpenChange={(open) => setOpenPicker(open ? 'date' : null)} onChange={(value) => { setDate(value); setEmailStatus('idle') }} />
                  <TimePicker value={time} isOpen={openPicker === 'time'} onOpenChange={(open) => setOpenPicker(open ? 'time' : null)} onChange={(value) => { setTime(value); setEmailStatus('idle') }} />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-5 rounded-[1.5rem] border border-[#ebd8d1] bg-[#fffdfb]/85 p-5 shadow-[0_14px_40px_rgba(130,85,72,0.07)] sm:p-6">
                <div className="mb-4 flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-full bg-[#f8e5df]"><Utensils className="size-4 text-[#b96f69]" /></div><div><h3 className="font-serif text-xl text-[#513c3b]">What are you craving?</h3><p className="text-xs text-[#a18c87]">Choose your perfect mood</p></div></div>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                  {foodOptions.map((option) => {
                    const isSelected = option.name === food
                    return <button key={option.name} type="button" aria-pressed={isSelected} onClick={() => { setFood(option.name); setEmailStatus('idle') }} className={`relative flex min-h-24 flex-col items-center justify-center rounded-2xl border p-2 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd716c] ${isSelected ? 'border-[#c98279] bg-[#fae9e3] shadow-sm' : 'border-[#eee1db] bg-[#fffdfb] hover:border-[#dfb8af] hover:bg-[#fdf6f2]'}`}><span className="text-2xl">{option.emoji}</span><span className="mt-1 text-xs font-semibold text-[#624b48]">{option.name}</span><span className="text-[10px] text-[#a18c87]">{option.detail}</span>{isSelected && <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-[#bd716c] text-white"><Check className="size-2.5" /></span>}</button>
                  })}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-5 rounded-[1.5rem] border border-[#ebd8d1] bg-[#f8eee8] px-5 py-4">
                <div className="mb-3"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b58179]">Getting there</p><p className="mt-1 font-serif text-xl text-[#513c3b]">Would you like me to pick you up or meet you there?</p></div>
                <div className="grid grid-cols-2 gap-2">
                  {[{ value: 'pickup', label: 'Pick me up' }, { value: 'meet-there', label: 'Meet there' }].map((option) => {
                    const isSelected = meetupPreference === option.value
                    return <button key={option.value} type="button" aria-pressed={isSelected} onClick={() => { setMeetupPreference(option.value); setEmailStatus('idle') }} className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd716c] ${isSelected ? 'border-[#c98279] bg-[#fae9e3] text-[#624b48]' : 'border-[#dfc1b5] bg-[#fffaf7] text-[#98716c] hover:bg-white'}`}>{option.label}</button>
                  })}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-5 rounded-[1.5rem] border border-[#ebd8d1] bg-[#fffdfb]/85 p-5 shadow-[0_14px_40px_rgba(130,85,72,0.07)] sm:p-6">
                <label htmlFor="date-note" className="mb-3 block"><span className="block font-serif text-xl text-[#513c3b]">Want to leave me a note?</span><span className="mt-1 block text-xs text-[#a18c87]">Anything you&apos;d like me to know</span></label>
                <textarea id="date-note" value={note} maxLength={1000} onChange={(event) => { setNote(event.target.value); setEmailStatus('idle') }} placeholder="Write a little message..." rows={4} className="w-full resize-y rounded-xl border border-[#ead8d1] bg-[#fffdfb] px-3 py-2.5 text-sm leading-6 text-[#513c3b] placeholder:text-[#b4a09b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd716c]" />
                <p className="mt-1 text-right text-[11px] text-[#a18c87]">{note.length}/1000</p>
              </motion.div>

              <motion.button type="button" onClick={sendChoice} disabled={isSendingChoice} whileHover={{ scale: isSendingChoice ? 1 : 1.02 }} whileTap={{ scale: isSendingChoice ? 1 : 0.98 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#bd716c] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(189,113,108,0.22)] transition-colors hover:bg-[#a9615d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd716c] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70">{isSendingChoice ? 'Sending your choice...' : 'Confirm date & send choice'} <Send className="size-4" /></motion.button>
              <p role="status" aria-live="polite" className="mt-3 min-h-4 text-center text-[11px] text-[#b4a09b]">{emailStatus === 'sent' ? 'Your choice was emailed!' : emailStatus === 'error' ? 'Could not send the email. Please try again.' : emailStatus === 'setup' ? 'Email setup needed: add your Resend API key to .env.local.' : emailStatus === 'incomplete' ? 'Please choose a date, time, and how you would like to meet.' : 'Your selected date, time, restaurant, and meetup preference will be emailed privately.'}</p>
            </motion.section>
          )}
        </AnimatePresence>
        <p className="mt-10 flex items-center gap-1.5 text-xs text-[#b4a09b]">Made with <Heart className="size-3 fill-[#c99087] text-[#c99087]" /> and a little courage</p>
      </motion.div>
      )}
      </AnimatePresence>
    </main>
  )
}
