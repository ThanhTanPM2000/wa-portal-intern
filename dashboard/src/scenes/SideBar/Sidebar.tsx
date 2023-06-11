import React from 'react';
import { Menu } from 'antd';
import {
  UserOutlined,
  FacebookOutlined,
  TeamOutlined,
  PhoneOutlined,
  CloudServerOutlined,
  BarChartOutlined,
  CommentOutlined,
  KeyOutlined,
  AuditOutlined,
  AreaChartOutlined,
  ImportOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

type Props = {
  email: null | string;
  partnerId: null | number;
  isAdmin: null | boolean;
};

export default function Sidebar({ email, isAdmin, partnerId }: Props) {
  const location = useLocation();

  return (
    <>
      {/* <Sider className="site-layout-background"> */}
      {email && (
        <Menu theme="light" mode="inline" selectedKeys={[location.pathname]}>
          <Menu.Item key="/connect" icon={<FacebookOutlined />}>
            <Link to="/connect">Link WABA</Link>
          </Menu.Item>
          <Menu.Item key="/accounts" icon={<TeamOutlined />}>
            <Link to="/accounts">Accounts</Link>
          </Menu.Item>
          <Menu.Item key="/phoneNumbers" icon={<PhoneOutlined />}>
            <Link to="/phoneNumbers">Phone Numbers</Link>
          </Menu.Item>
          {partnerId && (
            <>
              <Menu.Item key="/keys" icon={<KeyOutlined />}>
                <Link to="/keys">Keys</Link>
              </Menu.Item>
              <Menu.Item key="/credentials" icon={<AuditOutlined />}>
                <Link to="/credentials">Credentials</Link>
              </Menu.Item>
              <Menu.Item key="/migrations" icon={<ImportOutlined />}>
                <Link to="/migrations">Migrations</Link>
              </Menu.Item>
            </>
          )}
          {isAdmin && (
            <>
              <Menu.Item key="/users" icon={<UserOutlined />}>
                <Link to="/users">Users</Link>
              </Menu.Item>
              <Menu.Item key="/migrations" icon={<ImportOutlined />}>
                <Link to="/migrations">Migrations</Link>
              </Menu.Item>
              <Menu.Item key="/audits" icon={<AuditOutlined />}>
                <Link to="/audits">Audits</Link>
              </Menu.Item>
              <Menu.Item key="/partner-api-usage" icon={<AreaChartOutlined />}>
                <Link to="/partner-api-usage">Partner API Usage</Link>
              </Menu.Item>
              <Menu.Item key="/service-provider" icon={<CloudServerOutlined />}>
                <Link to="/service-provider">Service Providers</Link>
              </Menu.Item>
            </>
          )}
          <Menu.Item key="/usage" icon={<BarChartOutlined />}>
            <Link to="/usage">Usage</Link>
          </Menu.Item>
          <Menu.Item key="/support" icon={<CommentOutlined />}>
            <a href="https://www.keyreply.com/whatsapp-business-api-support" rel="noreferrer" target="_blank">
              Support
            </a>
          </Menu.Item>
        </Menu>
      )}
      {/* </Sider> */}
    </>
  );
}
