"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, Menu, X } from "lucide-react"
import Image from "next/image"
import { cn } from "../../../../lib/lib/utils"
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation"
import clsx from "clsx"


export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const toggleDropdown = (title: string) => {
    setActiveDropdown(activeDropdown === title ? null : title)
  }

  const t = useTranslations("Navbar")  
  const pathname = usePathname()
  // Navigation data
const navigation = [

  { title: t("home"), href: "/" },
    {
      title: t("about"),
      href: "#",
      children: [
        { title: t("whoweare"), href: "/werwirsind", description: "Track and visualize your data" },
        { title: t("whatwedo"), href: "/waswirtun", description: "Einblicke in unser kreatives Schaffen" },
        { title: t("cv"), href: "/curriculum", description: "Curriculum Fernanda Perreira" },
        { title: "frei", href: "#", description: "zur freien Verfügung  " },
      ],
    },
    {
      title: t("rechtliches"),
      href: "rechtliches",    
      children: [
        { title: t("impressum"), href: "/impressum", description: "Infos die laut Gesetzgeber zur Verfügung gstellt werden müssen" },
        { title: t("datenschutz"), href: "datenschutz", description: "Alles zum Datenschutz " },
        { title: t("cookies"), href: "/cookies", description: "Sell products online" },
        { title: t("agb"), href: "/agb", description: "zur freien Verfügung  " },
      ],
    },
    { title: "kurse", href: "/kurse" },
    { title: "info", href: "/info" },
    { title: "contact", href: "/contact" },

  ]

  return (
    <header className="bg:slate-800 lg:bg-amber-500 shadow-sm ">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-5" aria-label="Global">
        <div className="flex lg: flex-col flex">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only"></span>
            <div className="mt-2 w-auto font-bold text-xl mb-3">
              <Image src="/LogoDms.png" alt="Logo" width={80} height={50} className="bg-neutral-300 rounded-full" />
            </div>
          </Link>
          <h1 className="text-[898989] text-[.4rem] font-bold ml-4 hidden lg:block"> {t("telephone")}: +49 761 606060</h1> 
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-stone-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 " aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <div key={item.title} className={clsx("relative bg-orange-600/20 hover:bg-amber-700/30 rounded-lg px-1 py-1 hover:transform hover:translatex-1 hover:transform hover:-translate-y-1",
              {"bg-amber-900": pathname === item.href}
            )}      
              >
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(item.title)}
                    className="flex items-center gap-x-1 text-lg uppercase font-semibold leading-6 text-gray-100"
                    aria-expanded={activeDropdown === item.title}
                  >
                    {item.title}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        activeDropdown === item.title ? "rotate-180" : "",
                      )}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Desktop dropdown menu */}
                  {activeDropdown === item.title && (
                    <div className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-2">
                      <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="relative grid gap-6 bg-white p-6 sm:gap-8">
                          {item.children.map((child) => (
                            <Link
                              key={child.title}
                              href={child.href}
                              className="-m-3 flex items-start rounded-lg p-3 hover:bg-stone-200"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <div className={cn(
                                ` ${pathname === child.href ? "active-class" : ""}`
                              )}>
                                <p className="uppercase text-sm font-medium text-gray-900">{child.title}</p>
                                <p className="mt-1 text-sm text-gray-500">{child.description}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href={item.href} className="lg:text-xl font-bold leading-6 text-stone-100 hover:border-b-2 border-stone-100 uppercase">
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        <Link href="/admin" className={clsx("px-2 py-1 rounded-xl text-[10px] text-white text-center",
                { "bg-gray-300": pathname === "/admin" })}>

                </Link>

        </div>
      </nav>

      {/* Mobile menu */}
      <div className={cn("lg:hidden", mobileMenuOpen ? "block" : "hidden")}>
        <div className="space-y-2 px-4 py-3">
          {navigation.map((item) => (
            <div key={item.title} className="  py-2">
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(item.title)}
                    className="flex w-full items-center justify-between text-base font-semibold leading-7 text-gray-900 uppercase"
                    aria-expanded={activeDropdown === item.title}
                  >
                    {item.title}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        activeDropdown === item.title ? "rotate-180" : "",
                      )}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Mobile dropdown menu */}
                  {activeDropdown === item.title && (
                    <div className="mt-2 space-y-2 pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.title}
                          href={child.href}
                          className="block py-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className={clsx('text-sm', 
                            { 'bg-amber-400': pathname === child.href }
                          )}>
                          <div className="uppercase text-sm font-medium text-gray-900">{child.title}</div>
                          <div className="text-sm text-gray-500">{child.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="py-3 px-3 rounded-xl block text-base font-semibold leading-5 text-gray-900 uppercase"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.title}
        
                    </Link>
              )}</div>
          ))}
        </div>
        <div className="border-t border-gray-700 px-4 py-6">
        <Link href="/admin" className={clsx(
          "text-sm md:text-xl text-white bg-slate-400 rounded-lg px-3 py-1 hover:bg-red-700",
          { "bg-blue-400": pathname === "/admin" }
        )}


        
        
        >{t("Admin")}</Link>


        </div>
      </div>
    </header>
  )
}





