import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import {
  DashboardOutlined,
  EnvironmentOutlined,
  CompassOutlined,
  GlobalOutlined,
  DatabaseOutlined,
  ShopOutlined,
  BankOutlined,
  AppstoreOutlined,
  TeamOutlined,
  LogoutOutlined,
  UserOutlined,
  IdcardOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  roles: string;
  logmin: string;
  logomax: string;
}

type MenuItem = Required<MenuProps>["items"][number];
type RoleMenuItem = MenuItem & {
  roles?: string[];
  children?: RoleMenuItem[];
};

const menuItems: RoleMenuItem[] = [
  // Dashboard
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: <Link to="/dashboard">Dashboard</Link>,
  },

  // Master Data
  {
    key: "master-data",
    icon: <DatabaseOutlined />,
    label: "Master Data",
    roles: [
      "Super Administrator",
      "Administrator",
    ],
    children: [
      {
        key: "country",
        icon: <GlobalOutlined />,
        label: <Link to="/country">Country</Link>,
        roles: [
          "Super Administrator",
          "Administrator",
        ]
      },
      {
        key: "state",
        icon: <CompassOutlined />,
        label: <Link to="/state">State</Link>,
        roles: [
          "Super Administrator",
          "Administrator",
        ]
      },
      {
        key: "city",
        icon: <EnvironmentOutlined />,
        label: <Link to="/city">City</Link>,
        roles: [
          "Super Administrator",
          "Administrator",
        ]
      },
    ],
  },

  // General
  {
    key: "general-data",
    icon: <AppstoreOutlined />,
    label: "General",
    roles: [
      "Super Administrator",
      "Administrator",
    ],
    children: [
      {
        key: "company",
        icon: <ShopOutlined />,
        label: <Link to="/company">Company</Link>,
      },
      {
        key: "branch",
        icon: <BankOutlined />,
        label: <Link to="/branch">Branch</Link>,
      },
      {
        key: "department",
        icon: <TeamOutlined />,
        label: <Link to="/department">Department</Link>,
      },
    ],
  },

  // HR Admin
  {
    key: "hr-data",
    icon: <IdcardOutlined />,
    label: "Hr Admin",
    roles: [
      "Super Administrator",
      "Administrator",
      "Doctor / Physician",
      "Nurse",
      "Receptionist",
    ],
    children: [
      {
        key: "User",
        icon: <UserOutlined />,
        label: <Link to="/User">Employee Management</Link>,
        roles: [
          "Super Administrator",
          "Administrator",
        ]
      },
      {
        key: "Doctor",
        icon: <UserOutlined />,
        label: <Link to="/doctor">Doctor</Link>,
        roles: [
          "Super Administrator",
          "Administrator",
        ]
      },
      {
        key: "Patient",
        icon: <UserOutlined />,
        label: <Link to="/patient">Patient</Link>,
        roles: [
          "Super Administrator",
          "Administrator",
          "Doctor / Physician",
          "Nurse",
          "Receptionist",
        ],
      },
      {
        key: "Appointment",
        icon: <CalendarOutlined />,
        label: <Link to="/appointments">Appointment</Link>,
        roles: [
          "Super Administrator",
          "Administrator",
          "Doctor / Physician",
          "Nurse",
          "Receptionist",
        ],
      }
    ],
  },

  // Separator
  {
    type: "divider",
  },

  // Logout
  {
    key: "logout",
    icon: <LogoutOutlined />,
    label: <Link to="/logout">Logout</Link>,
  },
];

const filterMenuByRole = (
  items: RoleMenuItem[],
  currentRole: string
): RoleMenuItem[] => {
  return items
    .filter((item) => {
      if (item.type === "divider") {
        return true;
      }
      if (!item.roles) {
        return true;
      }
      return item.roles.includes(currentRole);
    })
    .map((item) => {
      if (item.children) {
        const filteredChildren = filterMenuByRole(
          item.children,
          currentRole
        );
        return {
          ...item,
          children: filteredChildren,
        };
      }
      return item;
    })
    .filter((item) => {
      if (item.children) {
        return item.children.length > 0;
      }
      return true;
    });
};

export function Sidebar({ collapsed, roles, logmin, logomax }: SidebarProps) {
  const filteredMenuItems = filterMenuByRole(menuItems, roles);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={250}
      collapsedWidth={80}
      style={{
        minHeight: "100vh",
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: 64,
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: collapsed ? 18 : 22,
          transition: "all 0.2s",
        }}
      >
        {collapsed ? (
          <img
            src={logmin}
            alt="HSMS"
            style={{
              width: 40,
              height: 40,
              objectFit: "contain",
            }}
          />
        ) : (
          <img
            src={logomax}
            alt="HSMS"
            style={{
              width: "190%",
              height: "50px",
            }}
          />
        )}
      </div>

      {/* Sidebar Menu */}
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        defaultOpenKeys={["master-data", "general-data", "hr-data"]}
        items={filteredMenuItems}
      />
    </Sider>
  );
}

export default Sidebar;