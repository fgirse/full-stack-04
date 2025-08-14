"use client"
import AdminBoard from "@/components/Adminboard/AdminBoard"
import { useState } from "react"
import Link from "next/link"
import { ChevronDown, LogOut, Menu, X } from "lucide-react"
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
        { title: t("whoweare"), href: "/werwirsind", description: t("descriptionA") },
        { title: t("whatwedo"), href: "/waswirtun", description: t("descriptionB")},
        { title: t("cv"), href: "/curriculum", description: t("descriptionC") },
        { title: "frei", href: "#", description: t("descriptionD") },
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
    { title: "Für Unternehmen", href: "/kurse" },
    { title: "enterprices", href: "/Enterprices" },
    { title: "contact", href: "/contact" },

  ]

  return (
    <header className="w-full lg:w-[100vw] bg-[#6EAAA8]  shadow-sm ">
      <nav className="mx-auto   flex lg:max-w-8xl items-center justify-between lg:px-5" aria-label="Global">
        <div className="flex overflow-hidden lg: flex-col">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only"></span>
            <div className="mt-2 w-12 font-bold text-xl mb-3">
              <Image src="/LogoDms.png" alt="Logo" width={80} height={50} className="bg-neutral-700/60 rounded-lg shadow-xl" />
            </div>
          </Link>
          <div className="flex flex-row items-start">
          <h1 className="text-neutral-100 text-[.6rem] font-bold ml-4 hidden lg:block"> ☎: +49 761 606060</h1> 
          <h1 className="text-neutral-100 text-[.6rem] font-bold ml-4 hidden lg:block"> 📩: Sarah Maria Huber</h1> 
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-stone-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <X className="mr-3 h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="mr-3 h-6 " aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <div key={item.title} className="relative rounded-lg px-2 py-1 hover:translate-x-2 hover:-translate-y-2 hover:scale-110"     
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
                              className="-m-3 flex items-start rounded-lg p-3 hover:bg-amber-200/50"
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
<div className="flex flex-col items-center gap-1">
<Link href="/admin" className=" px-3 py-1 "><AdminBoard/></Link>
<h1 className="text-center text-neutral-100 text-[.75rem] font-bold ml-4 hidden lg:block"> ↗️ Administration</h1>
</div>

</div>
      </nav>

      {/* Mobile menu */}
      <div className={cn("bg-white lg:hidden", mobileMenuOpen ? "block" : "hidden")}>
        <div className="space-y-2 px-4 py-3 ">
          {navigation.map((item) => (
            <div key={item.title} className=" border py-2 hover:bg-amber-200/50">
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
                        "border border-neutral-400 shadow-xlh-4 w-4 transition-transform duration-200",
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
                          className="block py-2  hover:bg-amber-300/60"
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
        <div className="mt-3 mb-3 border-t-2">
          <div className="flex items-center gap-1">
        <Link href="/admin" className="py-2">
        
        <AdminBoard/>
        </Link>
        <h1  className="mt-12 mb-5 text-center text-neutral-700 text-[.75rem] font-bold ml-4  lg:hidden"> ⬅️ Administration</h1>
        </div>

        </div>
      </div>
    </header>
  )
}




