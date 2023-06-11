import React, { useEffect } from 'react';

import { Modal, Spin } from 'antd';

import * as api from '../../api';
import { WabaPhoneNumber } from '../../api/account';

const OnboardingStatus = ({ connectResponse }: { connectResponse: WabaPhoneNumber[] | string | null }) => {
  const [visible, setVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [modalText, setModalText] = React.useState('');
  const [statusInfo, setStatusInfo] = React.useState('');

  if (!connectResponse) {
    return null;
  }

  if (typeof connectResponse === 'string') {
    return (
      <>
        Your WABA is created/connected to Keyreply Whatsapp Service
        <br />
        But it cannot be connected to KR Portal, you may not see the WABA in the Portal.
        <br />
        Please send the WABA Id to admin for support.
        <br />
      </>
    );
  }

  if (connectResponse.length === 0) {
    return (
      <>No account or phone number was added. You might have already connected your account and phone number before.</>
    );
  }

  const { nameProvisionServer, account, newPhoneNumbers } = connectResponse[0];

  useEffect(() => {
    setIsLoading(true);
    nameProvisionServer && setVisible(true);
  }, []);

  const phoneNumber = newPhoneNumbers[0];
  // TODO: add partner info if partner key was used
  let confirmationText = `You have connected ${phoneNumber.value}(Phone Number) from ${account.wabaId}(WABA Id).`;
  if (account?.manager?.partner?.id) {
    confirmationText += ` ${account.manager.partner.user?.email} is the account manager`;
  }
  return (
    <>
      {confirmationText}
      <Modal
        title="Creating Provision Server"
        centered
        closable
        maskClosable={false}
        destroyOnClose={true}
        bodyStyle={{
          height: '200px',
          display: 'flex',
          justifyContent: 'center',
        }}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <div className="flex flex-dir-c flex-ai-c flex-jc-c">
          <div>
            <h3>{`Your Provison Server is ${nameProvisionServer}`}</h3>
          </div>
          <div>
            <p>
              We are creating your Provision Server. It will take a times, your provision server will update when it
              finished.
            </p>
          </div>

          <Spin spinning={isLoading} size="large" wrapperClassName="flex flex-ai-c flex-jc-c" />
        </div>
      </Modal>
    </>
  );
};

export default OnboardingStatus;
