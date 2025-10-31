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
            <div>
              logo
            </div>
            <NavigationMenu>
              <NavigationMenuList>
                {renderNavLinks(header?.links || [])}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </>
      }
    </div>
  )
}

export default PublicHeader