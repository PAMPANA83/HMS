// ./pages/Profile.tsx
import { Card, Avatar, Typography, Row, Col } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export function Profile() {
  // Read the user object from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser
    ? JSON.parse(storedUser)
    : { userId:1, name: "Dr. Admin", email: "admin@hsms.com", role: "Super Admin" };

  return (
    <Row justify="center">
      <Col xs={24} md={12}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <Avatar
              size={100}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1677ff" }}
            />
            <Title level={4} style={{ marginTop: 16 }}>
              {user.name}
            </Title>
            <Text type="secondary">{user.role}</Text>
            <div style={{ marginTop: 20 }}>
              <p>
                <MailOutlined /> <strong>Email:</strong> {user.email}
              </p>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
}