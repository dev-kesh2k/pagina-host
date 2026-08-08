export type ServiceColor =
  | 'cyan'
  | 'violet'
  | 'amber'
  | 'sky'
  | 'emerald'
  | 'rose'
  | 'indigo'
  | 'fuchsia'

export interface Service {
  id: string
  title: string
  url: string
  description: string
  icon: string
  badge: string
  color: ServiceColor
  footer?: string
}
