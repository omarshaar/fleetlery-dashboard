import { Button, Avatar, AvatarFallback, AvatarImage, DropdownMenu } from "@/components";
import { ChevronDown } from "lucide-react";

const UserMenu = () => {
  return (
    <DropdownMenu
      align="end"
      widthClass="w-56"
      label="My Account"
      triggerClassName="px-2!"
      trigger={
        <Button variant="ghost" className="flex items-center gap-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="User"
            />
            <AvatarFallback>GN</AvatarFallback>
          </Avatar>
          <span className="hidden md:block text-sm font-medium">
            Geneva
          </span>
          <ChevronDown className="h-4 w-4 hidden md:block" />
        </Button>
      }
      items={[
        { label: "Profile" },
        { label: "Settings" },
        { label: "Billing" },
        { separatorBefore: true, label: "Logout" },
      ]}
    />
  );
};

export default UserMenu;
