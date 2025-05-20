
import HeroImageB from "@/components/Cloudinary/HeroImageB";
import Hero_mobile from "@/components/Cloudinary/HeroI_mobile";
import React from "react";
//import HeroImage02 from "@/components/CldImage/HeroImage02";
//import HeroImage03 from "@/components/CldImage/HeroImage03";
//import Gsap from "@/components/Gsap"
//import CollapseCardFeatures from "@/components/CollapsCardFeatures";
//import  Caroussel  from "@/components/HorizontalCaroussel";


export default function Home() {
  return (
    <>
    <main>
      <section className="min-h-screen flex flex-col items-center justify-center ">
 
        <div className="hidden md:block"> 
            <Hero_mobile/>
        </div>
        <div className=" block md:hidden ">
      <HeroImageB/> 
        </div>                                                
         <div className="flex flex-col items-center bg-gradient-to-b from-[#938d7d] lg:bg-gradient-to-b via-transparent  to-transparent lg:mt-[50vh]">
         
         </div> 
         
        </section>

         <section className="flex flex-col items-start justify-center px-4">
          <div className="">
            <h1 className="ml-12 text-6xl font-bold tracking-tighter md:text-8xl">
              PRODUCT
              <br />
              DESIGNER &
              <br />
              ART DIRECTOR
            </h1>
          </div>
        </section>
        <section className="flex flex-col items-start justify-center px-4">
          <div className="flex flex-col items-center">
        {/*}    <Caroussel/>*/}
          </div>
        </section>
        
    
      </main>
      
    
    </>
  )
}
