"use client";

import SortableCards from "@/components/editor/MenuLinksDraggable";
import CodeEditor from "@/components/editor/PrismCodeEditor";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useHandleAuthError from "@/hooks/useHandleAuthError";
import fetcher from "@/utils/fetcher";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import useLinkStore from "@/store/linkStore";
import { cn } from "@/lib/utils";
import { ILink } from "@/types/ILink";
import { Spinner } from "@/components/ui/spinner";
import LogoEditor from "@/components/editor/LogoEditor";

function ComponentsPage() {
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

const TabsEditor = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<TSection>({
    id,
    isCustom: false,
  });
  const { handleAuthError } = useHandleAuthError();
  const setLinks = useLinkStore((s) => s.setLinks);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetcher.get<{ data: ILink[] }>({
          endpointPath: `/links/many/section/${id}`,
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

  return (
    <div className={cn("pt-4 space-y-2 flex-3", !section.isCustom && "w-fit")}>
      <div className="flex justify-between items-center h-10">
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
      </div>
      <div>
        {section.isCustom ? (
          <CustomEditor />
        ) : (
          <div className="min-w-[40rem]">
            {
              loading ? (
                <div className="bg-zinc-100 w-full h-30 rounded-md shadow-md flex justify-center items-center" >
                  <Spinner />
                </div>
              ) : (
                <SortableCards sectionId={section.id} />
              )}
          </div>
        )}
      </div>
    </div>
  );
};

const codingLanguages: { value: "css" | "html"; label: string }[] = [
  {
    value: "html",
    label: "HTML",
  },
  {
    value: "css",
    label: "CSS",
  },
];

const CustomEditor = () => {
  const [code, setCode] = useState({
    html: "",
    css: "",
  });

  const setLangCode = (lang: "html" | "css", code: { html: string; css: string }) =>
    setCode({ ...code, [lang]: code });

  return (
    <Tabs defaultValue="html">
      <TabsList>
        {codingLanguages.map((lang) => <TabsTrigger key={lang.value} value={lang.value}>{lang.label}</TabsTrigger>)}
      </TabsList>
      {codingLanguages.map((lang) =>
        <TabsContent value={lang.value} key={lang.value}>
          <CodeEditor code={code[lang.value]} language={lang.value} setCode={() => setLangCode(lang.value, code)} />
        </TabsContent>
      )}
    </Tabs>
  )
}

const SectionForm = ({ id }: { id: string }) => {
  const [section, setSection] = useState<TSection>({
    id,
    isCustom: false,
  });

  return (
    <div className="flex flex-col xl:flex-row justify-center xl:gap-4 max-w-6xl mx-auto">
      <TabsEditor id={id} />
      <div className="xl:mt-16 pt-4 xl:pt-0.5 flex-1">
        <LogoEditor />
      </div>
    </div>
  )
}

const tabs = [
  {
    value: "header",
    label: "Header",
    content: <SectionForm id="dad30d28-a2b0-4052-a59b-45c56592f27b" />,
    defaultChecked: true,
  },
  {
    value: "footer",
    label: "Footer",
    content: <SectionForm id="5edb327f-a0bc-4764-9362-5a414e91a4b6" />,
  },
];

export default ComponentsPage;
