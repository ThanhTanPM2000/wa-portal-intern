import React, { useState } from 'react';

import { ColumnsType } from 'antd/lib/table';
import { Button, Table, Modal, notification } from 'antd';

import * as api from '../../api';
import { PhoneNumber } from '../../types';
import { formatDatetime } from '../../utils/datetime';

type PhoneNumbersTableProps = {
  phoneNumbers: PhoneNumber[];
  isAdmin: boolean | null;
  partnerId: number | null;
  page: number;
  size: number;
  total: number;
  fetchData(): void;
  onPaginationChanged(page: number, pageSize?: number | undefined): void;
};

const { confirm } = Modal;

const PhoneNumbersTable = ({ phoneNumbers, page, size, total, onPaginationChanged }: PhoneNumbersTableProps) => {
  const handleQualityRating = (qualityRating: string | null): JSX.Element => {
    let result: string | null = qualityRating;
    let color = 'white';
    if (!qualityRating) return <p>NULL</p>;
    qualityRating = qualityRating.toLocaleLowerCase();
    if (qualityRating == 'green') {
      result = 'High';
      color = 'green';
    } else if (qualityRating == 'yellow') {
      result = 'Medium';
      color = 'yellow';
    } else if (qualityRating == 'red') {
      result = 'Low';
      color = 'red';
    } else {
      return <p>{result}</p>;
    }
    return (
      <div>
        <span className={`dot dot-${color}`} />
        <a
          className="ml-10"
          target="_blank"
          rel="noreferrer"
          href="https://www.facebook.com/business/help/896873687365001"
        >
          {` ${result}`}
        </a>
      </div>
    );
  };

  const columns: ColumnsType<PhoneNumber> = [
    {
      title: 'WABA ID',
      key: 'wabaId',
      rowSpan: 1,
      align: 'center',
      render(value, row: any) {
        return {
          children: row.account.wabaId,
          props: {
            rowSpan: row.rowSpan,
          },
        };
      },
    },
    {
      title: 'WABA Name',
      key: 'waba name',
      align: 'center',
      render(value, row: any) {
        return {
          children: row.account.name,
          props: {
            rowSpan: row.rowSpan,
          },
        };
      },
    },
    {
      title: 'Phone Number',
      dataIndex: 'value',
      key: 'value',
      align: 'center',
    },
    {
      title: 'Name',
      dataIndex: 'verifiedName',
      key: 'verifiedName',
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
    },
    {
      title: 'Name Status',
      dataIndex: 'nameStatus',
      key: 'nameStatus',
      align: 'center',
    },
    {
      title: 'Limit',
      dataIndex: 'limit',
      key: 'limit',
      align: 'center',
    },
    {
      title: 'Quality rating',
      dataIndex: 'qualityRating',
      key: 'qualityRating',
      align: 'center',
      render: function qualityRating(qualityRating) {
        return <>{handleQualityRating(qualityRating)}</>;
      },
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      render(createdAt) {
        return <>{formatDatetime(createdAt)}</>;
      },
    },
    {
      title: 'Phone Cert',
      key: 'phoneCert',
      align: 'center',
      render: function phoneCert(value: PhoneNumber) {
        const [cert, setCert] = useState<string>();
        const [isLoading, setIsLoading] = useState<boolean>();

        const handleGetCert = async () => {
          let myCert = cert;
          if (!cert) {
            try {
              setIsLoading(true);
              const data = await api.phoneNumber.getPhoneCert(value.phoneNumberId);
              if (data?.cert) {
                setCert(data.cert);
                myCert = data.cert;
              }
            } catch (error) {
              notification.error({
                message: `Get Cert Failed`,
                placement: 'bottomLeft',
              });
            } finally {
              setIsLoading(false);
            }
          }
          confirm({
            title: `Your cert of ${value.verifiedName} is`,
            content: myCert,
            centered: true,
            cancelText: '',
          });
        };

        return (
          value.certAvailableAt && (
            <Button type="primary" shape="round" size="small" loading={isLoading} onClick={handleGetCert}>
              Cert
            </Button>
          )
        );
      },
    },
    {
      title: 'Provision Server',
      key: 'provisionServer',
      align: 'center',
      render(value: PhoneNumber) {
        const [isHover, setIsHover] = useState(false);
        const [modalVisible, setModalVisible] = useState(false);

        if (!value?.provisionServer) return;

        // const options = [];
        // for (const option in value.provisionServer?.options) {
        //   options.push(
        //     <h3>
        //       <strong>{`${option}: "${value.provisionServer?.options[option].toString()}",`}</strong>
        //     </h3>,
        //   );
        // }

        return (
          <>
            <Button
              disabled={!value?.provisionServer}
              type={isHover ? 'primary' : 'dashed'}
              onMouseLeave={() => setIsHover(false)}
              onMouseEnter={() => setIsHover(true)}
              onClick={() => {
                setModalVisible(true);
              }}
            >
              More Infor
            </Button>
            <Modal
              title="Provision Server Infor"
              centered
              closable
              visible={modalVisible}
              onCancel={() => setModalVisible(false)}
              footer={null}
            >
              <div
                style={{
                  padding: '12px',
                  fontSize: '12px',
                  borderRadius: '5px',
                  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                }}
              >
                {JSON.stringify(value.provisionServer.options)}
              </div>
            </Modal>
          </>
        );
      },
    },
    // {
    //   title: 'Provision Server',
    //   key: 'Provision Server',
    //   align: 'center',
    //   render(value: PhoneNumber) {
    //     // const [visible, setVisible] = useState(false);
    //     const [modal] = Modal.useModal();

    //     const config = {
    //       title: 'Use Hook!',
    //       content: <div>Hello world</div>,
    //     };

    //     return (
    //       <>
    //         {/* {record?.provisionServer && <Button>More Infor</Button>} */}
    //         {modal.info(config)}
    //       </>
    //     );
    //   },
    // },
  ];
  return (
    <>
      <Table
        columns={columns}
        dataSource={phoneNumbers.map((phoneNumber) => {
          return { ...phoneNumber, key: phoneNumber.id };
        })}
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

export default PhoneNumbersTable;
