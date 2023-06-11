import React, { useState, useEffect } from 'react';

import { Select, Form, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form';

import { ServiceProvider } from '../../types';
import * as api from '../../api';

type Props = {
  form: FormInstance<any>;
  visible: boolean;
  onGenerate(): void;
  onCancel(): void;
};

const PartnerKeysSelect = ({ form, visible, onGenerate, onCancel }: Props) => {
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [isLoading, setLoading] = useState(false);

  const { Option } = Select;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const serviceProviders = await api.partner.getAvaiableServiceProviders();
      serviceProviders && setServiceProviders(serviceProviders);
      setLoading(false);
    })();
  }, []);

  const handleSelect = (value: string) => {
    form.setFieldsValue(value);
  };

  return (
    <Modal
      title="Create Server Provider"
      visible={visible}
      destroyOnClose
      centered
      onOk={onGenerate}
      onCancel={onCancel}
      okText="Generate"
    >
      <Form form={form}>
        <Form.Item name="serviceProvider" label="Service Provider" rules={[{ required: true }]}>
          <Select
            showSearch
            style={{ minWidth: '300px' }}
            placeholder="Select a Service Provider for this"
            loading={isLoading}
            onSelect={handleSelect}
            filterOption={(input, option) =>
              option?.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              option?.children[2].toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {serviceProviders.map((service) => (
              <Option value={service.id} key={service.id}>
                {service.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PartnerKeysSelect;
