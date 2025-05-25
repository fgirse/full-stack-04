
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

    <section className=" bg-transparent">
      
        <div className=" left-0 bg-blue-300/50 w-[24vw] flex flex-row items-center justify-start gap-x-3 ">
            <div className="w-1/3 mb-3">
                <Image src="/LogoDms.png" alt="Logo" width={90} height={44} className=" ml-3 mt-3" />
            </div>
        <div className="w-1/3 bg-zinc-....600 rounded-lg ">
            <LocaleSwitcher/>
       </div>
       <div className="w-1/3"> 
        <SignedOut>
            <SignInButton>
              <button  className="rounded-lg py-2 px-3 bg-slate-600 text-center text-white w-36 hover:bg-orange-400">{t("signin")}</button>
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