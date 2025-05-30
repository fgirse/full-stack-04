import Image from "next/image";
import {Cloudinary, Transformation} from "@cloudinary/url-gen";

// Import required actions.

import {byAngle} from "@cloudinary/url-gen/actions/rotate"



  // Import the required actions and qualifiers.
  import {fill, scale} from "@cloudinary/url-gen/actions/resize";
  import {source} from "@cloudinary/url-gen/actions/overlay";
  import {byRadius, max} from "@cloudinary/url-gen/actions/roundCorners";

  // Import required values.
  import {image, text} from "@cloudinary/url-gen/qualifiers/source";
  import {Position} from "@cloudinary/url-gen/qualifiers/position";
  import { useTranslations } from "next-intl";
  import {TextStyle} from "@cloudinary/url-gen/qualifiers/textStyle";
  import {autoGravity, compass} from "@cloudinary/url-gen/qualifiers/gravity";
  import { TextAlignment } from "@cloudinary/url-gen/qualifiers";
  import { cartoonify, outline } from "@cloudinary/url-gen/actions/effect";
  import { outer } from "@cloudinary/url-gen/qualifiers/outlineMode";
import { effect } from "zod";
import { LayerAction } from "@cloudinary/transformation-builder-sdk/actions/layer/LayerAction";
import { format } from "@cloudinary/url-gen/actions/delivery";
import { videoMp4 } from "@cloudinary/url-gen/qualifiers/format";
import { hue } from "@cloudinary/transformation-builder-sdk/actions/adjust";

// Create and configure your Cloudinary instance.

export default function HeroImage() {
const cld = new Cloudinary({
  cloud: {
    cloudName: 'Carlo2024'
  }
}); 

const t = useTranslations('HeroMobil');

// Use the image with public ID, 'sample'.
const myImage = cld.image(
  'Bild_30.05.25_um_10.18_ztc4t8', // Replace with your image public ID  
   // Pass an empty object if no additional options are needed
);


// Transform the image.
myImage
  .resize(fill(3500, 5200))
  .roundCorners(byRadius(0))

  .overlay(
    source(
      text(t("Headline"), new TextStyle('bowlby one sc',240))
        .textColor('#ffffff')
    )
    .position(new Position().gravity(compass('north_west')).offsetY(80).offsetX(180))
  )
  .overlay(
    source(
      text(t("Jahr"), new TextStyle('bowlby one sc', 400))
        .textColor('orange')
    )
    .position(new Position().gravity(compass('north_west')).offsetY(280).offsetX(180))
  )
  .overlay(   
    source(
      text(t("Slogan"), new TextStyle('bowlby one sc',200))
      .textColor('orange')       
    )    
    .position(new Position().gravity(compass('west')).offsetY(1490).offsetX(180)))


    .overlay(   
      source(
          text(t("Title"),
            new TextStyle("bowlby one sc", 250)
              .fontWeight("bold")
              .lineSpacing(-150)
          )
          .textColor('#ffffff')       
        )
        .position(new Position().gravity(compass('west')).offsetY(1838).offsetX(180))
      )

      .overlay(
        source(
          image('LogoDms_czdjvn')
            .transformation(new Transformation()
            .resize(scale().height(950))
            .adjust(hue(5))
            .rotate(byAngle(0))
            )
          )
          .position(new Position().gravity(compass('north')).offsetX(950).offsetY(350)) 
      )
  
  // Return the delivery URL
  const myUrl = myImage.toURL()
  return(
    
    
    <div className="w-[100vw] flex flex-col justify-between items-center ">
    
      <Image src={myUrl} width={880} height={1500} alt="Transformed Image" className="text-white text-left" />
    </div>
    
    
  );
}

function overlay(arg0: LayerAction) {
  throw new Error("Function not implemented.");
}
