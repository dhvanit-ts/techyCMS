"use client";

import ComponentSettings from '@/components/forms/componentSettings';
import { Button } from '@/components/ui/button';
import useHandleAuthError from '@/hooks/useHandleAuthError';
import { IComponent } from '@/types/IComponent';
import fetcher from '@/utils/fetcher';
import { AxiosError } from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa6';

function ComponentsPage() {

   const [components, setComponents] = useState<IComponent[]>([]);
  const [loading, setLoading] = useState(true);

  const { handleAuthError } = useHandleAuthError();

  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const data = (await fetcher.get<{ data: IComponent[] }>({
        endpointPath: "/components",
        returnNullIfError: true,
        statusShouldBe: 200,
        fallbackErrorMessage: "Error fetching components",
      })) as { data: IComponent[] };

      setComponents(data?.data ?? []);
    } catch (error) {
      handleAuthError(error as AxiosError);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  return (
       <div className="px-4 pt-12">
      <h1 className="text-3xl font-semibold text-zinc-900 mb-4 flex justify-between">
        <span>Components</span>
        <span className="text-zinc-800">Total: {components.length}</span>
        <ComponentSettings setComponents={setComponents}>
          <Button>
            <FaPlus />
            Create
          </Button>
        </ComponentSettings>
      </h1>
      </div>
  )
}

export default ComponentsPage