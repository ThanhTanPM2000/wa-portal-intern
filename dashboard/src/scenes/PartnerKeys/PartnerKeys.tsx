import React, { useState, useEffect } from 'react';

import _ from 'lodash';
import { Button, Card, Form } from 'antd';
import { compareDesc } from 'date-fns';

import * as api from '../../api';
import { PartnerKey } from '../../types';
import { PartnerKeysTable } from '.';
import PartnerKeysSelectModal from './PartnerKeysSelectModal';

function PartnerKeys() {
  const [partnerKeys, setPartnerKeys] = useState<PartnerKey[]>([]);
  const [sortedPartnerKeys, setSortedPartnerKeys] = useState<PartnerKey[]>([]);

  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.partnerKey.find();
      if (data) {
        setPartnerKeys(data);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!partnerKeys) {
      return;
    }
    const sortedTokens = partnerKeys.sort((token1, token2) => {
      return compareDesc(new Date(token1.createdAt), new Date(token2.createdAt));
    });
    setSortedPartnerKeys(sortedTokens);
  }, [partnerKeys]);

  // const serviceProviderOptions =
  const handleGenerateKey = async () => {
    form.validateFields().then(async (values: any) => {
      const data = await api.partnerKey.create(values['serviceProvider']);
      if (!data) return;

      const _partnerKeys = _.cloneDeep(partnerKeys);
      _partnerKeys.push({ ...data, usage: 0 });
      setPartnerKeys(_partnerKeys);

      form.resetFields();
      setVisibleModal(false);
    });
  };

  const revokePartnerKey = async (partnerKeyId: number) => {
    try {
      const revokedPartnerKey = await api.partnerKey.revoke(partnerKeyId);
      if (!partnerKeys || !revokedPartnerKey) {
        return;
      }
      const { revokedAt } = revokedPartnerKey;
      if (!revokedAt) return;
      const _partnerKeys = _.cloneDeep(partnerKeys);
      const partnerKeyIndex = _partnerKeys.findIndex((partnerKey) => partnerKey.id === partnerKeyId);
      _partnerKeys[partnerKeyIndex] = { ..._partnerKeys[partnerKeyIndex], revokedAt };
      setPartnerKeys(_partnerKeys);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Card className="text-center partner-tokens" title="Keys">
      <Button onClick={() => setVisibleModal(true)} type="primary">
        Generate Key
      </Button>
      <div className="partner-table">
        {Array.isArray(sortedPartnerKeys) && (
          <PartnerKeysTable revokePartnerKey={revokePartnerKey} tokens={sortedPartnerKeys} />
        )}
      </div>
      <PartnerKeysSelectModal
        form={form}
        visible={visibleModal}
        onGenerate={handleGenerateKey}
        onCancel={() => setVisibleModal(false)}
      />
    </Card>
  );
}

export default PartnerKeys;
