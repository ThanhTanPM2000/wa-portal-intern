import React, { useState } from 'react';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import { Modal, Button, notification } from 'antd';

type Props = {
  uniqueValue: string;
  isVisible: boolean;
  handleUpdate(): void;
};

const UpdateButton = ({ isVisible, uniqueValue, handleUpdate: handleUpdate }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHover, setIsHover] = useState(false);

  const updateData = async () => {
    try {
      setIsLoading(true);
      await handleUpdate();
      notification.success({
        message: `Update Successfully ${uniqueValue}`,
        placement: 'bottomLeft',
      });
    } catch (error) {
      notification.error({
        message: `Removed Failed ${uniqueValue}`,
        description: `${error}`,
        placement: 'bottomLeft',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type={isHover ? 'primary' : 'dashed'}
      disabled={!isVisible}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      icon={<DeleteOutlined />}
      loading={isLoading}
      onClick={updateData}
    >
      Update
    </Button>
  );
};

export default UpdateButton;
