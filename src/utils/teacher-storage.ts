export interface ScheduleItem {
  week_day: string
  from: string
  to: string
}

export interface StoredTeacherProfile {
  firstName: string
  lastName: string
  email: string
  avatarUrl: string
  whatsapp: string
  biography: string
  subject: string
  cost: number
  schedule: ScheduleItem[]
}

const STORAGE_KEY = "@proffy:teacher-profile-2026"

const DEFAULT_TEACHER: StoredTeacherProfile = {
  firstName: "Rafael",
  lastName: "Rocha",
  email: "rafael.rocha@proffy.com.br",
  avatarUrl: "https://avatars.githubusercontent.com/u/15871684?v=4",
  whatsapp: "",
  biography: "",
  subject: "",
  cost: 0,
  schedule: [{ week_day: "", from: "", to: "" }],
}

export function saveTeacherProfile(
  data: Partial<StoredTeacherProfile>
): StoredTeacherProfile {
  const current = getTeacherProfile()
  const updated: StoredTeacherProfile = {
    ...current,
    ...data,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export function getTeacherProfile(): StoredTeacherProfile {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return DEFAULT_TEACHER

  try {
    return { ...DEFAULT_TEACHER, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_TEACHER
  }
}

export function formatWhatsappMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11)

  if (digits.length === 0) return ""
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}

export const SUBJECT_OPTIONS = [
  { value: "Artes", label: "Artes" },
  { value: "Biologia", label: "Biologia" },
  { value: "Ciências", label: "Ciências" },
  { value: "Educação física", label: "Educação física" },
  { value: "Física", label: "Física" },
  { value: "Geografia", label: "Geografia" },
  { value: "História", label: "História" },
  { value: "Matemática", label: "Matemática" },
  { value: "Português", label: "Português" },
  { value: "Química", label: "Química" },
]

export const WEEK_DAY_OPTIONS = [
  { value: "0", label: "Domingo" },
  { value: "1", label: "Segunda-feira" },
  { value: "2", label: "Terça-feira" },
  { value: "3", label: "Quarta-feira" },
  { value: "4", label: "Quinta-feira" },
  { value: "5", label: "Sexta-feira" },
  { value: "6", label: "Sábado" },
]
