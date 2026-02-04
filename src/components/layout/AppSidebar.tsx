import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  FileText,
  PlusCircle,
  List,
  CheckSquare,
  Server,
  Shield,
  Users,
  ScrollText,
  ChevronDown,
  ChevronRight,
  Hexagon,
  User,
  LogOut,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface NavSection {
  title: string;
  items: {
    title: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

const navSections: NavSection[] = [
  {
    title: 'Requests',
    items: [
      { title: 'Create Request', href: '/requests/create', icon: PlusCircle },
      { title: 'My Requests', href: '/requests/my', icon: List },
      { title: 'Approvals', href: '/requests/approvals', icon: CheckSquare },
    ],
  },
  {
    title: 'Systems',
    items: [
      { title: 'Systems List', href: '/systems', icon: Server },
    ],
  },
  {
    title: 'Access Control',
    items: [
      { title: 'Role Bindings', href: '/access/bindings', icon: Users },
      { title: 'Audit Log', href: '/access/audit', icon: ScrollText },
    ],
  },
];

function NavSectionComponent({ section, isOpen, toggle }: { 
  section: NavSection; 
  isOpen: boolean; 
  toggle: () => void;
}) {
  const location = useLocation();
  const isActive = section.items.some(item => location.pathname.startsWith(item.href));

  return (
    <div className="mb-1">
      <button
        onClick={toggle}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider',
          'text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors',
        )}
      >
        <span>{section.title}</span>
        {isOpen ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
      </button>
      
      {isOpen && (
        <div className="mt-1 space-y-0.5">
          {section.items.map((item) => {
            const Icon = item.icon;
            const isItemActive = location.pathname === item.href || 
              (item.href !== '/systems' && location.pathname.startsWith(item.href));
            
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 mx-2 rounded-md text-sm transition-all',
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isItemActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-sidebar-foreground/80'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {item.badge}
                  </Badge>
                )}
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}

function UserSwitcher() {
  const { user, switchUser, availableUsers } = useAuth();

  if (!user) return null;

  const getRoleBadge = () => {
    const isPlatformAdmin = user.roles.some(r => r.role === 'platform-admin');
    if (isPlatformAdmin) return { label: 'Admin', className: 'role-badge-admin' };
    
    const isPM = user.roles.some(r => r.role === 'pm');
    if (isPM) return { label: 'PM', className: 'role-badge-pm' };
    
    const isDev = user.roles.some(r => r.role === 'developer');
    if (isDev) return { label: 'Dev', className: 'role-badge-developer' };
    
    return null;
  };

  const badge = getRoleBadge();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-sidebar-accent rounded-md transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
              {user.avatar || user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user.name}
            </p>
            {badge && (
              <span className={cn('role-badge', badge.className, 'mt-0.5')}>
                {badge.label}
              </span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Switch User (Demo)</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableUsers.slice(0, 6).map((u) => (
          <DropdownMenuItem 
            key={u.id} 
            onClick={() => switchUser(u.id)}
            className="cursor-pointer"
          >
            <User className="h-4 w-4 mr-2" />
            <span className={cn(u.id === user.id && 'font-medium')}>{u.name}</span>
            {u.id === user.id && (
              <span className="ml-auto text-xs text-muted-foreground">Current</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppSidebar() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Requests: true,
    Systems: true,
    'Access Control': true,
  });

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="w-64 bg-sidebar flex flex-col border-r border-sidebar-border min-h-screen">
      {/* Logo */}
      <div className="h-14 flex items-center gap-3 px-4 border-b border-sidebar-border">
        <div className="flex items-center justify-center h-8 w-8 rounded bg-sidebar-primary">
          <Hexagon className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-sidebar-foreground">
            Request Console
          </h1>
          <p className="text-xs text-sidebar-foreground/60">RBAC + CMDB</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navSections.map((section) => (
          <NavSectionComponent
            key={section.title}
            section={section}
            isOpen={openSections[section.title] ?? true}
            toggle={() => toggleSection(section.title)}
          />
        ))}
      </nav>

      {/* User Switcher */}
      <div className="border-t border-sidebar-border p-3">
        <UserSwitcher />
      </div>
    </aside>
  );
}
