import React, { useState, useEffect, useRef, useCallback } from 'react';

import _ from 'lodash';
import { Card, Button } from 'antd';

import * as api from '../../api';
import { ServiceProvider } from '../../types';
import { ServiceProviderTable } from '.';
import { SearchBar } from '../../components';
type Props = {
  isAdmin: boolean | null;
  partnerId: number | null;
};

const ServiceProviders = ({ isAdmin, partnerId }: Props) => {
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const prevSearchText = useRef(searchText);
  const [isLoading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    if (searchText !== prevSearchText.current) {
      setLoading(true);
    }
    const { serviceProviders, total } = await api.serverProvider.find(searchText, page, size);
    setServiceProviders(serviceProviders);
    setTotal(total);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [searchText, page, size]);

  const handleSearch = (searchValue: string) => {
    setSearchText(searchValue);
    setPage(1);
  };

  const onPaginationChanged = (page: number, pageSize?: number | undefined) => {
    setPage(page);
    pageSize && setSize(pageSize);
  };

  return (
    <Card className="serviceProviders text-center" title="Service Providers">
      {/* <Card.Text>All my accounts here</Card.Text> */}
      {serviceProviders && (
        <>
          {(isAdmin || partnerId) && (
            <>
              <div className="features-box">
                <SearchBar
                  placeholder="You are looking for Service Provider name ..."
                  isLoading={isLoading}
                  onHandleSearch={handleSearch}
                />
              </div>
              <h4>Showing {total}</h4>
            </>
          )}
          <ServiceProviderTable
            serviceProviders={serviceProviders}
            isAdmin={isAdmin}
            page={page}
            size={size}
            total={total}
            fetchData={fetchData}
            onPaginationChanged={onPaginationChanged}
          />
        </>
      )}
    </Card>
  );
};

export default ServiceProviders;
