"use client";

import SortableCards from "@/components/editor/MenuLinksDraggable";
import CodeEditor from "@/components/editor/PrismCodeEditor";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useHandleAuthError from "@/hooks/useHandleAuthError";
import { IComponent } from "@/types/IComponent";
import fetcher from "@/utils/fetcher";
import { AxiosError } from "axios";
import { v4 as uuid } from "uuid";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import LinkForm from "@/components/forms/LinkForm";
import useLinkStore from "@/store/linkStore";
import { cn } from "@/lib/utils";
import { ILink } from "@/types/ILink";
import { Spinner } from "@/components/ui/spinner";

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
        <span>Section</span>
      </h1>
      <Tabs defaultValue="header">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              defaultChecked={tab.defaultChecked}
              key={tab.value}
              value={tab.value}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

interface TSection {
  id: string;
  isCustom: boolean;
}

const HeaderComponent = () => {
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<TSection>({
    id: uuid(),
    isCustom: false,
  });
  const { handleAuthError } = useHandleAuthError();
  const setLinks = useLinkStore((s) => s.setLinks);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetcher.get<{ data: ILink[] }>({
          endpointPath: `/links/many/section/dad30d28-a2b0-4052-a59b-45c56592f27b`,
          fallbackErrorMessage: "Error fetching components",
        });

        setLinks(data?.data ?? []);
      } catch (error) {
        handleAuthError(error as AxiosError);
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateMenu = async (components: IComponent[]) => {
    try {
      setLoading(true);
      await fetcher.patch({
        endpointPath: "/components",
        data: { components },
        fallbackErrorMessage: "Error updating components",
        statusShouldBe: 200,
      });
    } catch (error) {
      console.log(error);
      handleAuthError(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("pt-4 space-y-2", !section.isCustom && "w-fit")}>
      <div className="flex justify-between items-center">
        <Field
          orientation="horizontal"
          className="w-fit bg-zinc-100 px-2 py-1 rounded-full"
        >
          <FieldContent>
            <FieldLabel htmlFor="is-customizable">Custom</FieldLabel>
          </FieldContent>
          <Switch
            id="is-customizable"
            onCheckedChange={(c) => setSection({ ...section, isCustom: c })}
            checked={section.isCustom}
          />
        </Field>
        <LinkForm setLinks={setLinks}>
          <Button variant="outline">Add</Button>
        </LinkForm>
      </div>
      <div>
        {section.isCustom ? (
          <div>
            <CodeEditor code="" className="bg-zinc-100" />
          </div>
        ) : (
          <div>
            {loading ? <div className="bg-zinc-100 w-[25rem] h-30 rounded-md shadow-md flex justify-center items-center"><Spinner/></div> : <SortableCards sectionId={section.id} />}
          </div>
        )}
      </div>
    </div>
  );
};
const FooterComponent = () => <div>Footer</div>;

const tabs = [
  {
    value: "header",
    label: "Header",
    content: <HeaderComponent />,
    defaultChecked: true,
  },
  {
    value: "footer",
    label: "Footer",
    content: <FooterComponent />,
  },
];

export default ComponentsPage;
