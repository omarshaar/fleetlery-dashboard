import { Icon } from "@/assets/icons";
import { Input } from "@/eano/design-system/shadcn/input"
import { Logo } from "@/components";

export default function Drawer() {
  return (
    <div className="w-60 h-screen border-e border-border dark:bg-black bg-white flex flex-col">
      <SideBarHeader />
      <SidebarBody />
    </div>
  )
}

function SideBarHeader() {
  return (
    <div className="p-5">
      
      {/* buttons */}
      <div className="mb-5 flex items-center cursor-pointer">
        <div className="w-3 h-3 rounded-2xl bg-red-500 me-2"></div>
        <div className="w-3 h-3 rounded-2xl bg-orange-400 me-2"></div>
        <div className="w-3 h-3 rounded-2xl bg-green-400 me-2"></div>
      </div>

      {/* Logo */}
      <Logo />


      {/* search input */}
      <div>
        <Input
          className="mt-4 bg-transparent text-white placeholder:text-muted-foreground"
          placeholder="Search..."
          type="text"
        />
      </div>

    </div>
  )
}

function SidebarBody() {
  return (
    <div className="flex-1 overflow-y-auto p-4 pt-2 hide-scrollbar">
      <div className="px-2 mb-2"> <span className="text-muted-foreground text-xs">Main</span> </div>
      <NavItem name="Dashboard" icon="home" href="/" active={true} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
      <NavItem name="Dashboard" icon="home" href="/" active={false} />
    </div>
  )
}

type NavItemProps = {
  name: string;
  icon: string;
  href: string;
  active: boolean;
};

function NavItem({ name, icon, href, active }: NavItemProps) {
  return (
    <div 
      className={`
        dark:text-white text-black 
        flex items-center 
        p-2 px-3 mb-2
        cursor-pointer rounded-lg
        hover:bg-(--gray) hover:text-white
        duration-400 transition-colors
        ${active ? "bg-primary text-white" : ""}
      `}
      onClick={() => window.location.href = href}
    >
      <Icon name={icon} size={20} strokeWidth={ active ? 2 : 1.5} />
      <span className={`ms-4 text-sm ${ active ? "font-bold" : ""}`}>{name}</span>
    </div>
  );
}