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
  List,
  FileText,
  Table,
  Type,
  UploadCloud,
  CheckCircle,
  Square,
  Send,
  Save,
  Layers,
  TrendingUp,
  Award,
  Target,
  MessageCircle,
  Quote,
  Repeat,
  Bell,
  BellOff,
  MicOff,
  HelpCircle as Help,
  Share,
  Smartphone,
  XCircle,
  ArrowUp,
  ArrowDown,
  Book,
  Hash
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
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,

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
  book: Book,
  bookmark: Bookmark,
  tag: Tag,
  hash: Hash,
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

  // Additional Icons
  'file-text': FileText,
  table: Table,
  type: Type,
  'upload-cloud': UploadCloud,
  'check-circle': CheckCircle,
  'alert-circle': AlertCircle,
  square: Square,
  send: Send,
  save: Save,
  layers: Layers,

  // New Phase 4 Icons
  'trending-up': TrendingUp,
  award: Award,
  target: Target,
  'message-circle': MessageCircle,
  quote: Quote,
  repeat: Repeat,
  bell: Bell,
  'bell-off': BellOff,
  'mic-off': MicOff,
  'help-circle': Help,
  share: Share,
  smartphone: Smartphone,
  'volume-2': Volume2,
  'x-circle': XCircle,
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
