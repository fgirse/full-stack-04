"use client";
// the :point_up: use client was necessary to make this module work
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { useTranslations } from "next-intl";
import { useLocale } from 'next-intl'

// Use the image path directly for next/ima
// Removed invalid import for Instagram

function Header() {
  const locale = useLocale();

  const HEADER_NAMESPACE = "Header";
  const t = useTranslations(HEADER_NAMESPACE);
  return (
    <section className="bg-[#6EAAA8] lg:bg-[#6EAAA8] padding-right: 0.5rem">

      <div className=" 0.5rem w-[100vw] flex flex-row items-center justify-around">
        {/*<div className="w-[10vw] mb-3 bg-black">
                <Image src="/LogoDms.png" alt="Logo" width={190} height={144} className=" ml-3 mt-3" />
            </div>*/}
        <div className=" w-[20vw] rounded-lg ">
          <LocaleSwitcher />
        </div>
        <div className="flex flex-row items-start justify-center">
          <h1 className="mt-5 font-feeling-passionate text-center text-pink-700 text-xs md:text-2xl ">folge mir auf Instagram</h1>
          <a href="https://www.instagram.com/sarahmariahuber/" target="_blank" rel="noopener noreferrer">
          <div className="font-feeling-passionate
           w-5 h-5  text-white rounded-lg md:w-20 md:h-20 ">           
            <Image src="/instagram_icon.png" alt="Instagram" width={40} height={40} className="mt-5 ml-2" />
          
          </div>
          </a>
        </div>
        <SignedOut>
          <SignInButton>
            <button className="rounded-lg py-1 px-1 bg-slate-100 text-center text-slate-700 hover:bg-orange-400 ">{t("signin")}</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className=" ">
            <UserButton />
          </div>
        </SignedIn>
      </div>




    </section>
  );
}
export default Header;