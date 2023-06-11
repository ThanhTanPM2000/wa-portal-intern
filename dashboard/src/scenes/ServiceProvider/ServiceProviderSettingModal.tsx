import React from 'react';

import { Modal, Form, Input, Space } from 'antd';
import { FormInstance } from 'antd/lib/form';

import { ServiceProvider } from '../../types';

type Props = {
  serviceProvider: ServiceProvider;
  form: FormInstance<any>;
  visible: boolean;
  onCancel(): void;
  onSave(): void;
};

const ServiceProviderSettingModal = ({ serviceProvider, visible, onCancel, onSave, form }: Props) => {
  const listForm = [] as any[];
  const options = serviceProvider.options;

  for (const option in options) {
    listForm.push(
      <Form.Item label={option}>
        <Space>
          <Form.Item
            name={option}
            key={option}
            noStyle
            initialValue={options[option]}
            rules={
              option !== 'BASE_URL'
                ? [
                    // {
                    //   type: 'string',
                    //   message: `${option} not containt special characters`,
                    //   pattern: /^[a-zA-Z0-9 ]*$/,
                    // },
                  ]
                : [{ type: 'url', message: 'Endpoint must be url' }]
            }
          >
            <Input style={{ width: 'auto' }} placeholder="Please input" />
          </Form.Item>
        </Space>
      </Form.Item>,
    );
  }

  return (
    <Modal
      title={`Setting "${serviceProvider.name}"`}
      centered
      visible={visible}
      onOk={onSave}
      onCancel={onCancel}
      okText="Save"
    >
      <Form form={form} id="createServiceProvision" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        {listForm.map((x) => x)}
      </Form>
    </Modal>
  );
};

export default ServiceProviderSettingModal;
