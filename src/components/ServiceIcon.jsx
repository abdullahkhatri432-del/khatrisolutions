import {
  Globe,
  UtensilsCrossed,
  Stethoscope,
  ShoppingBag,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react'

const ICONS = {
  Globe,
  UtensilsCrossed,
  Stethoscope,
  ShoppingBag,
  LayoutDashboard,
  Sparkles,
}

export default function ServiceIcon({ name, size = 22, ...rest }) {
  const Icon = ICONS[name] || LayoutDashboard
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" {...rest} />
}
