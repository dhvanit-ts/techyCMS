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
import { ILink, ISection } from "@/types/ILink";
import { Spinner } from "@/components/ui/spinner";
import LogoEditor from "@/components/editor/LogoEditor";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

interface ISettings {
  id: string;
  isCustom: boolean;
  isProfile: boolean;
  logo: string;
  tabsPlacement: "left" | "center" | "right";
}

const TabsEditor = ({ id, section, setSection }: { id: string, section: ISettings, setSection: React.Dispatch<React.SetStateAction<ISettings>> }) => {
  const [loading, setLoading] = useState(true);
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
    <div className="pt-4 space-y-2">
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

  const setLangCode = (lang: "html" | "css", newCode: string) =>
    setCode((prev) => ({ ...prev, [lang]: newCode }));

  return (
    <Tabs defaultValue="html">
      <TabsList>
        {codingLanguages.map((lang) => (
          <TabsTrigger key={lang.value} value={lang.value}>
            {lang.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {codingLanguages.map((lang) => (
        <TabsContent value={lang.value} key={lang.value}>
          <CodeEditor
            code={code[lang.value]}
            language={lang.value}
            setCode={(newCode) => setLangCode(lang.value, newCode)}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

const Header = ({ header, tabs, profile, logo }: { header: ISection | null, tabs: "left" | "center" | "right", profile: boolean, logo: string }) => {
  const renderNavLinks = (links: ILink[]) => {
    return links.map((link) => {
      const hasChildren = link.children && link.children.length > 0;

      if (hasChildren) {
        return (
          <NavigationMenuItem key={link.id}>
            <NavigationMenuTrigger>{link.label}</NavigationMenuTrigger>
            <NavigationMenuContent>
              {link.children && renderNavLinks(link.children)} {/* recursion here */}
            </NavigationMenuContent>
          </NavigationMenuItem>
        );
      }

      return (
        <NavigationMenuLink href={link.href} key={link.id}>
          {link.label}
        </NavigationMenuLink>
      );
    });
  };

  return (
    <div>
      {header?.mode === "CUSTOM"
        ? <>
          {header && header.customHtml && (
            <div dangerouslySetInnerHTML={{ __html: header.customHtml }} />
          )}
          {header && header.customCss &&
            <style dangerouslySetInnerHTML={{ __html: header.customCss }} />
          }
        </>
        : <>
          <div className='flex justify-between items-center py-3 px-12 bg-zinc-100 border-b border-zinc-200'>
            {tabs === "left" && <div className="flex justify-center items-center gap-4">
              <div>
                {logo ? <Image src={logo} height={12} width={12} alt="logo" className="w-12 h-12" /> : "logo"}
              </div>
              <NavigationMenu>
                <NavigationMenuList>
                  {renderNavLinks(header?.links || [])}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            }
            {tabs !== "left" && <>
              <div>
                {logo ? <Image src={logo} height={12} width={12} alt="logo" className="w-12 h-12" /> : "logo"}
              </div>
              {tabs === "right" && <input className="bg-zinc-200 rounded-md text-xs px-3 py-1.5" placeholder="Search something..." type="text" />}
              <div className="flex gap-4">
                <NavigationMenu>
                  <NavigationMenuList>
                    {renderNavLinks(header?.links || [])}
                  </NavigationMenuList>
                </NavigationMenu>
                {profile && tabs === "right" &&
                  <Avatar>
                    <AvatarImage src="https://github.com/dhvanitmonpara.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                }
              </div>
            </>
            }
            {tabs !== "right" && <div className="flex gap-4">
              <input className="bg-zinc-200 rounded-md text-xs px-3 py-1.5" placeholder="Search something..." type="text" />
              {profile && <Avatar>
                <AvatarImage src="https://github.com/dhvanitmonpara.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>}
            </div>
            }
          </div>
        </>
      }
    </div>
  )
}

const SectionForm = ({ id }: { id: string }) => {
  const [serverSettings, setServerSettings] = useState<ISettings>({
    id,
    isCustom: false,
    isProfile: false,
    logo: "",
    tabsPlacement: "left",
  });
  const [section, setSection] = useState<ISection | null>(null);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<ISettings>({
    id,
    isCustom: false,
    isProfile: false,
    logo: "",
    tabsPlacement: "left",
  });

  const { handleAuthError } = useHandleAuthError()

  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetcher.get<{ data: ISection }>({
          endpointPath: `/sections/${id}`,
          fallbackErrorMessage: "Error fetching section",
        });
        setSection(data);
      } catch (error) {
        handleAuthError(error as AxiosError);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSave = async () => {
    try {
      setLoading(true)
      const { data } = await fetcher.patch<{ data: ISection }>({
        endpointPath: `/sections/${id}`,
        data: settings,
        fallbackErrorMessage: "Error updating section",
        onSuccess: () => {
          toast.success("Section updated successfully");
        }
      });
      setSection(data);
    } catch (error) {
      handleAuthError(error as AxiosError);
    } finally {
      setLoading(false)
    }
  }

  const hasChanged = JSON.stringify(serverSettings) !== JSON.stringify(settings);

  return (
    <div className="flex flex-col xl:flex-row justify-center xl:gap-4 max-w-6xl mb-24 mx-auto">
      <div className="flex-3 flex flex-col gap-4">
        <TabsEditor section={settings} setSection={setSettings} id={id} />
        <div>
          <Tabs defaultValue="left" onValueChange={tab => setSettings({ ...settings, tabsPlacement: tab as "left" | "center" | "right" })}>
            <div className="flex gap-4 items-center">
              <div className="bg-zinc-100 rounded-full px-2 py-1 flex justify-center items-center gap-2">
                <label htmlFor="profile-enable" className="text-sm">Profile</label>
                <Switch
                  defaultChecked={settings.isProfile}
                  id="profile-enable"
                  onCheckedChange={(checked) => setSettings({ ...settings, isProfile: checked })}
                />
              </div>
              <TabsList>
                <TabsTrigger value="left">Left</TabsTrigger>
                <TabsTrigger value="center">Center</TabsTrigger>
                <TabsTrigger value="right">Right</TabsTrigger>
              </TabsList>
            </div>
            <Header header={section} tabs={settings.tabsPlacement} logo={settings.logo} profile={settings.isProfile} />
          </Tabs>
        </div>
        {hasChanged && <div className="flex">
          <Button onClick={handleSave}>
            {loading ? <><Spinner /> Saving...</> : "Save"}
          </Button>
        </div>}
      </div>
      <div className="xl:mt-16 pt-4 xl:pt-0 flex-1">
        <LogoEditor setLogo={(logo) => setSettings({ ...settings, logo })} />
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