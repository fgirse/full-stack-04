
"use client";
// the :point_up: use client was necessary to make this module work
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { useTranslations } from "next-intl";

const Header = () => {

  const HEADER_NAMESPACE = "Header";
  const t = useTranslations(HEADER_NAMESPACE);
  return (
    <section className="bg-[#414F4F] lg:bg-[#F59E0B] padding-right: 0.5rem">
      
        <div className="padding-right: 0.5rem w-[100vw] flex flex-row items-center justify-between gap-x-16 ">
            {/*<div className="w-1/3 mb-3">
                <Image src="/LogoDms.png" alt="Logo" width={90} height={44} className=" ml-3 mt-3" />
            </div>*/}
        <div className="ml-5 w-1/3 rounded-lg ">
            <LocaleSwitcher/>
       </div>
       <div className="w-1/3"> 
        <SignedOut>
            <SignInButton>
              <button  className="rounded-lg py-1 px-1 bg-slate-100 text-center text-slate-700 hover:bg-orange-400 ">{t("signin")}</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          </div>
      </div>
        
          
        
       
        
      </section>
  );
};
export default Header;