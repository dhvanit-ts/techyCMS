"use client"

import { ILink, ISection } from '@/types/ILink'
import fetcher from '@/utils/fetcher'
import React, { useEffect } from 'react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Image from 'next/image'

function PublicHeader() {

  const [header, setHeader] = React.useState<ISection | null>(null)

  const getHeader = async () => {
    try {
      const res = await fetcher.get<{ data: ISection }>({
        endpointPath: '/sections/dad30d28-a2b0-4052-a59b-45c56592f27b',
        returnNullIfError: true
      })

      setHeader(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getHeader()
  }, [])

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
            {header?.tabsPlacement === "left" && <div className="flex justify-center items-center gap-4">
              <div>
                {header?.logo ? <Image src={header?.logo} height={12} width={12} alt="logo" className="w-12 h-12" /> : "logo"}
              </div>
              <NavigationMenu>
                <NavigationMenuList>
                  {renderNavLinks(header?.links || [])}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            }
            {header?.tabsPlacement !== "left" && <>
              <div>
                {header?.logo ? <Image src={header?.logo} height={12} width={12} alt="logo" className="w-12 h-12" /> : "logo"}
              </div>
              {header?.tabsPlacement === "right" && <input className="bg-zinc-200 rounded-md text-xs px-3 py-1.5" placeholder="Search something..." type="text" />}
              <div className="flex gap-4">
                <NavigationMenu>
                  <NavigationMenuList>
                    {renderNavLinks(header?.links || [])}
                  </NavigationMenuList>
                </NavigationMenu>
                {header?.profile && header.tabsPlacement === "right" &&
                  <Avatar>
                    <AvatarImage src="https://github.com/dhvanitmonpara.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                }
              </div>
            </>
            }
            {header?.tabsPlacement !== "right" && <div className="flex gap-4">
              <input className="bg-zinc-200 rounded-md text-xs px-3 py-1.5" placeholder="Search something..." type="text" />
              {header?.profile && <Avatar>
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

export default PublicHeader