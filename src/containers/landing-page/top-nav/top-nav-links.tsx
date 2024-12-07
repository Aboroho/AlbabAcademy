import {
  Bell,
  GraduationCap,
  HomeIcon,
  PhoneOutgoing,
  Scale,
  Store,
} from "lucide-react";

export type Navlink = {
  label: string;
  path: string;
  activePrefix?: string;
  collapsible?: boolean;
  children?: Array<Navlink>;
  icon?: JSX.Element;
  description?: string;
  popoverTitle?: string;
  popOverIcon?: JSX.Element;
};

export const topNavLinks: Navlink[] = [
  {
    label: "Home",
    path: "/",
    activePrefix: "/",
    icon: <HomeIcon className="w-4 h-4" />,
  },
  {
    label: "About",
    path: "/about",
    activePrefix: "/about",
    icon: <Store className="w-4 h-4" />,
  },
  {
    label: "Academics",
    path: "/academics",
    activePrefix: "/academics",
    collapsible: true,
    icon: <GraduationCap className="w-4 " />,

    children: [
      {
        label: "List of Subjects",
        path: "/academics/list-of-subject",
      },
    ],
  },
  {
    label: "Contact",
    path: "/contact",
    activePrefix: "/contact",
    icon: <PhoneOutgoing className="w-4 h-4" />,
  },
  {
    label: "Regulations",
    path: "/regulations",
    activePrefix: "/regulations",
    collapsible: true,
    icon: <Scale className="w-4 h-4" />,
    children: [
      {
        label: "Instruction to the Students",
        path: "/regulations/instruction-to-the-students",
        activePrefix: "/regulations/instruction-to-the-students",
      },
    ],
  },
  {
    label: "Notice",
    path: "/notice",
    activePrefix: "/notice",
    collapsible: true,
    icon: <Bell className="w-4 h-4" />,
    popoverTitle: "Available Notices",
    popOverIcon: <Bell className="w-10 h-10" />,
    children: [
      {
        label: "Student Notices",
        path: "/notice/student",
        activePrefix: "/notice/student",
      },
      {
        label: "Teacher's Notices",
        path: "/notice/teacher",
        activePrefix: "/notice/teacher",
        collapsible: true,
        children: [
          {
            label: "Recruitment Notices",
            path: "/notice/recruitments",
            activePrefix: "/notice/recruitment",
          },
        ],
      },
      {
        label: "Recruitment Notices",
        path: "/notice/recruitment",
        activePrefix: "/notice/recruitment",
      },
    ],
  },
];
