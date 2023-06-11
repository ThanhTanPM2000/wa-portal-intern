import React, { useState, useEffect } from 'react';

import _ from 'lodash';
import { ColumnsType } from 'antd/lib/table';
import { Button, Form, Select, Table, Dropdown, Menu, notification } from 'antd';
import { UserOutlined, LoadingOutlined, DownOutlined } from '@ant-design/icons';

import * as api from '../../api';
import { Partner, ServiceProvider } from '../../types';
import { RemoveButton } from '../../components';
import { formatDatetime } from '../../utils/datetime';
import ServiceProviderSettingModal from './ServiceProviderSettingModal';
import { SettingOutlined } from '@ant-design/icons';

type ServiceProviderTableProps = {
  serviceProviders: ServiceProvider[];
  isAdmin: boolean | null;
  page: number;
  size: number;
  total: number;
  fetchData(): void;
  onPaginationChanged(page: number, pageSize?: number | undefined): void;
};

const ServiceProviders = ({
  serviceProviders,
  page,
  size,
  total,
  fetchData,
  onPaginationChanged,
}: ServiceProviderTableProps) => {
  const [partnersList, setPartnersList] = useState<Partner[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const partners = await api.partner.findAllPartner();
        partners && setPartnersList(partners);
      } catch (error) {}
    })();
  }, []);

  const columns: ColumnsType<ServiceProvider> = [
    {
      title: 'Create At',
      dataIndex: 'createdAt',
      key: 'createAt',
      align: 'center',
      render: function CreatedAt(createdAt) {
        return <>{formatDatetime(createdAt)}</>;
      },
    },
    {
      title: 'Service Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Endpoint',
      key: 'endpoint',
      align: 'center',
      render(record: ServiceProvider) {
        return record.options?.BASE_URL;
      },
    },
    // {
    //   title: 'Provision Server Count',
    //   dataIndex: 'provisionServers',
    //   key: 'provisionServers',
    //   align: 'center',
    //   render(provisionServers) {
    //     return provisionServers.length;
    //   },
    // },
    {
      title: 'Assigned Partner',
      key: 'partners',
      align: 'center',
      render: function PartnersAssigned(record: ServiceProvider) {
        const [values, setValues] = useState<string[]>(
          record.partners ? record.partners.map((value) => value.partnerId.toString()) : [],
        );
        const [isContructor, setIsContructor] = useState(true);
        const [originalValues, setOriginalValues] = useState<string[]>([]);

        const [isUpdating, setIsUpdating] = useState(false);
        const [isChange, setIsChange] = useState(false);
        const [isDropdown, setIsDropdown] = useState(false);

        if (isContructor) {
          setOriginalValues([...values]);
          setIsContructor(false);
        }

        useEffect(() => {
          _.isEqual(values.sort(), originalValues.sort()) ? setIsChange(false) : setIsChange(true);
        }, [values, originalValues]);

        const handleSelect = (value: any) => {
          if (value === 'all') {
            setValues([...partnersList.map((partner) => partner.id.toString()).sort()]);
          } else {
            !values.includes(value) && setValues([...values, value]);
          }
        };

        const handleDeSelect = (value: any) => {
          const newValues = [...values.filter((x) => x != value)];
          setValues(newValues);
        };

        const options = partnersList.map((partner) => {
          return {
            label: `${partner.id} - ${partner.user?.email}`,
            value: `${partner.id}`,
            disabled: values.includes('all'),
          };
        });

        const handleBlur = async () => {
          try {
            setIsUpdating(true);
            if (isChange) {
              const updatedValues = await api.serverProvider.update(record.id.toString(), values);
              if (updatedValues) {
                fetchData();
                const newValues = await Promise.all(updatedValues.partners.map((value) => value.partnerId.toString()));
                setValues(newValues);
              }
            }
          } catch (error) {
            notification.error({ message: 'Assign partner failed', placement: 'bottomLeft' });
          } finally {
            setIsDropdown(false);
            setIsUpdating(false);
          }
        };

        const menu = (
          <Menu>
            <Menu.Item key="1" icon={<UserOutlined />}>
              <Select
                autoFocus
                mode="multiple"
                showAction={['focus']}
                showArrow
                removeIcon
                style={{ minWidth: '200px' }}
                disabled={isUpdating}
                value={values}
                placeholder="Please select"
                optionLabelProp="value"
                loading={isUpdating}
                defaultValue={values}
                filterOption={(input, option) => {
                  if (option && option.label) {
                    return option.label?.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0;
                  }
                  return false;
                }}
                options={[{ label: 'All', value: 'all' }, ...options]}
                onSelect={handleSelect}
                onDeselect={handleDeSelect}
                onBlur={handleBlur}
              />
            </Menu.Item>
          </Menu>
        );

        return (
          <>
            <Dropdown.Button
              overlay={menu}
              disabled={isUpdating}
              onClick={() => setIsDropdown(true)}
              visible={isDropdown}
              trigger={['click']}
              placement="bottomCenter"
              icon={isUpdating ? <LoadingOutlined /> : <DownOutlined />}
            >
              Partner
              {/* <UpdateButton isVisible={isChange} handleUpdate={handleUpdate} uniqueValue={record?.name} /> */}
            </Dropdown.Button>
          </>
        );
      },
    },
    {
      title: '',
      align: 'center',
      key: 'tools',
      render(record: ServiceProvider) {
        const [visibleModal, setVisibleModal] = useState(false);
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [isHover, setIsHover] = useState(false);
        const [form] = Form.useForm();

        const handleSettings = async () => {
          form.validateFields().then(async (options: any) => {
            try {
              setIsLoading(true);
              const result = await api.serverProvider.setting(record.id.toString(), options);
              result && (await fetchData());
            } catch (error) {
              notification.error({
                message: ` Something Failed to settings`,
                placement: 'bottomLeft',
              });
            } finally {
              form.resetFields();
              setVisibleModal(false);
              setIsLoading(false);
            }
          });
        };

        return (
          <>
            <Button
              className="mr-10"
              type={isHover ? 'primary' : 'dashed'}
              onClick={() => setVisibleModal(true)}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
              icon={<SettingOutlined />}
              loading={isLoading}
            >
              Setting
            </Button>
            <ServiceProviderSettingModal
              serviceProvider={record}
              form={form}
              visible={visibleModal}
              onCancel={() => {
                setVisibleModal(false);
                form.resetFields();
              }}
              onSave={() => handleSettings()}
            />
          </>
        );
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={serviceProviders
          .map((serviceProvider) => {
            return { ...serviceProvider, key: serviceProvider.id };
          })
          ?.reverse()}
        bordered
        pagination={{
          defaultCurrent: 1,
          current: page,
          total: total,
          showSizeChanger: true,
          defaultPageSize: 10,
          pageSize: size,
          onChange: (page: number, pageSize?: number | undefined) => onPaginationChanged(page, pageSize),
        }}
      />
    </>
  );
};

export default ServiceProviders;
