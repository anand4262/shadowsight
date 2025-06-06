import * as Icons from "../icons";

type NavItem = {
  title: string;
  icon: any; // or a specific type if you have one
  url: string;
  items: NavItem[];
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

export const NAV_DATA: NavSection[] = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/",
        items: [],
      },
      {
        title: "OverView",
        icon: Icons.User,
        url: "/overview",
        items: [],
      },
      {
        title: "File Upload",
        icon: Icons.Alphabet,
        url: "/upload",
        items: [],
      },
    ],
  },
];
