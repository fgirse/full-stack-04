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
  'hero-mobile_j7qbne', // Replace with your image public ID  
   // Pass an empty object if no additional options are needed
);


// Transform the image.
myImage
  .resize(fill(2700, 5500))
  .roundCorners(byRadius(0))

  .overlay(
    source(
      text(t("Headline"), new TextStyle('bowlby one sc',150))
        .textColor('#898989')
    )
    .position(new Position().gravity(compass('north_west')).offsetY(0).offsetX(50))
  )
  .overlay(
    source(
      text(t("Jahr"), new TextStyle('bowlby one sc', 300))
        .textColor('orange')
    )
    .position(new Position().gravity(compass('north_west')).offsetY(150).offsetX(50))
  )
  .overlay(   
    source(
      text(t("Slogan"), new TextStyle('bowlby one sc',260))
      .textColor('orange')       
    )    
    .position(new Position().gravity(compass('west')).offsetY(1760).offsetX(110)))


    .overlay(   
      source(
          text(t("Title"),
            new TextStyle("bowlby one sc", 250)
              .fontWeight("bold")
              .lineSpacing(-150)
          )
          .textColor('#898989')       
        )
        .position(new Position().gravity(compass('west')).offsetY(2338).offsetX(110))
      )

      .overlay(
        source(
          image('LogoDms_czdjvn')
            .transformation(new Transformation()
            .resize(scale().height(750))
            .adjust(hue(5))
            .rotate(byAngle(0))
            )
          )
          .position(new Position().gravity(compass('north')).offsetX(330).offsetY(220)) 
      )
  
  // Return the delivery URL
  const myUrl = myImage.toURL()
  return(
    
    
    <div className="flex flex-col justify-start items-center ">
    
      <Image src={myUrl} width={480} height={900} alt="Transformed Image" className="text-white text-left" />
    </div>
    
    
  );
}

function overlay(arg0: LayerAction) {
  throw new Error("Function not implemented.");
}
