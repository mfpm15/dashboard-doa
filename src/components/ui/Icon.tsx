import React from 'react';
import {
  Search,
  Plus,
  Download,
  Upload,
  Edit3,
  Trash2,
  Star,
  Heart,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Mic,
  Settings,
  Moon,
  Sun,
  Monitor,
  X,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreHorizontal,
  Copy,
  BookOpen,
  Bookmark,
  Tag,
  Calendar,
  Clock,
  User,
  Users,
  Globe,
  Home,
  Archive,
  RefreshCw,
  Eye,
  EyeOff,
  Info,
  HelpCircle,
  ExternalLink,
  Maximize2,
  Minimize2,
  Zap,
  Sparkles,
  Command,
  Menu,
  Grid,
  List
} from 'lucide-react';

const icons = {
  // Actions
  search: Search,
  plus: Plus,
  download: Download,
  upload: Upload,
  edit: Edit3,
  trash: Trash2,
  star: Star,
  heart: Heart,
  copy: Copy,
  refresh: RefreshCw,
  archive: Archive,

  // Audio
  play: Play,
  pause: Pause,
  'skip-back': SkipBack,
  'skip-forward': SkipForward,
  volume: Volume2,
  'volume-off': VolumeX,
  mic: Mic,

  // UI
  x: X,
  check: Check,
  alert: AlertCircle,
  info: Info,
  help: HelpCircle,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'more-horizontal': MoreHorizontal,
  menu: Menu,
  command: Command,

  // Theme
  moon: Moon,
  sun: Sun,
  monitor: Monitor,

  // Content
  'book-open': BookOpen,
  bookmark: Bookmark,
  tag: Tag,
  calendar: Calendar,
  clock: Clock,
  user: User,
  users: Users,
  globe: Globe,
  home: Home,

  // Layout
  filter: Filter,
  settings: Settings,
  eye: Eye,
  'eye-off': EyeOff,
  'external-link': ExternalLink,
  maximize: Maximize2,
  minimize: Minimize2,
  grid: Grid,
  list: List,

  // AI
  zap: Zap,
  sparkles: Sparkles,
} as const;

export type IconName = keyof typeof icons;

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
}

export function Icon({ name, className = '', size = 16 }: IconProps) {
  const IconComponent = icons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return <div className={`w-4 h-4 ${className}`} />;
  }

  return <IconComponent size={size} className={className} />;
}

export default Icon;