import { Layout, Dropdown, Avatar, Space,Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined,LogoutOutlined, UserOutlined, DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Header: AntHeader } = Layout;

export interface HeaderProps {
  collapsed: boolean;
  toggle: () => void;
  onProfileClick: () => void; // MUST exist
  onLogout: () => void;       // MUST exist
   username: string;
}

export function Header({ collapsed, toggle, onProfileClick, onLogout,username  }: HeaderProps) {
  const items: MenuProps["items"] = [
    { key: "profile", label: "Profile", onClick: onProfileClick },
    { key: "logout", icon: <LogoutOutlined />, label: "Logout", onClick: onLogout },
  ];

  return (
    <AntHeader style={{ padding: "0 16px", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    
 <div style={{ display: "flex", alignItems: "center" }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggle}
          style={{ fontSize: "18px" }}
        />
        <div style={{ marginLeft: 16, fontWeight: 600 }}>
          HSMS Dashboard
        </div>
      </div>
      <Dropdown menu={{ items }} placement="bottomRight">
        <Space style={{ cursor: "pointer" }}>
          <Avatar icon={<UserOutlined />} />
          <span>{username}</span>
          <DownOutlined />
        </Space>
      </Dropdown>
    </AntHeader>
  );
}