
"use client";
// the :point_up: use client was necessary to make this module work
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { useTranslations } from "next-intl";

const Header = () => {

  const HEADER_NAMESPACE = "Header";
  const t = useTranslations(HEADER_NAMESPACE);
  const newLocal = " lg:........................................................................................................................................bg-transparent";
  return (

    <section className={newLocal}>
      
        <div className="bg-neutral-800/20 w-[100vw] flex flex-row items-center justify-between gap-x-16 ">
            {/*<div className="w-1/3 mb-3">
                <Image src="/LogoDms.png" alt="Logo" width={90} height={44} className=" ml-3 mt-3" />
            </div>*/}
        <div className="ml-5 w-1/3 rounded-lg ">
            <LocaleSwitcher/>
       </div>
       <div className="w-1/3"> 
        <SignedOut>
            <SignInButton>
              <button  className="rounded-lg py-1 px-1 bg-slate-600 text-center text-white hover:bg-orange-400">{t("signin")}</button>
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
export default Header;-------