import { SITE_CONFIG } from "@/data/content"

export function getBirthdayStatus(): "today" | "future" | "past" {
  const today = new Date()
  const bday = new Date(SITE_CONFIG.birthdayDate)
  
  const currentMonth = today.getMonth()
  const currentDay = today.getDate()
  const bdayMonth = bday.getMonth()
  const bdayDay = bday.getDate()

  if (currentMonth === bdayMonth && currentDay === bdayDay) {
    return "today"
  }
  
  if (currentMonth < bdayMonth || (currentMonth === bdayMonth && currentDay < bdayDay)) {
    return "future"
  }
  
  return "past"
}

export function getDaysUntil(): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const bday = new Date(SITE_CONFIG.birthdayDate)
  const nextBday = new Date(today.getFullYear(), bday.getMonth(), bday.getDate())

  if (today.getTime() > nextBday.getTime()) {
    nextBday.setFullYear(today.getFullYear() + 1)
  }

  const diffTime = nextBday.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function getAge(): number {
  const today = new Date()
  const bday = new Date(SITE_CONFIG.birthdayDate)
  
  let age = today.getFullYear() - bday.getFullYear()
  const m = today.getMonth() - bday.getMonth()
  
  if (m < 0 || (m === 0 && today.getDate() < bday.getDate())) {
    age--
  }
  
  return age
}
