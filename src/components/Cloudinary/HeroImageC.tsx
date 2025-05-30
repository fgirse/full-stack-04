import Image from "next/image";
import {Cloudinary, Transformation} from "@cloudinary/url-gen";

// Import required actions.

import {byAngle} from "@cloudinary/url-gen/actions/rotate"

// Import the required actions and qualifiers.
import {fill, scale} from "@cloudinary/url-gen/actions/resize";
import {source} from "@cloudinary/url-gen/actions/overlay";
import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";

// Import required values.
import {image, text} from "@cloudinary/url-gen/qualifiers/source";
import {Position} from "@cloudinary/url-gen/qualifiers/position";
import { useTranslations } from "next-intl";
import {TextStyle} from "@cloudinary/url-gen/qualifiers/textStyle";
import {autoGravity, compass} from "@cloudinary/url-gen/qualifiers/gravity";
import { TextAlignment } from "@cloudinary/url-gen/qualifiers";
import { hue } from "@cloudinary/url-gen/actions/adjust";
// Create and configure your Cloudinary instance.

export default function HeroImage() {
const cld = new Cloudinary({
  cloud: {
    cloudName: 'Carlo2024'
  }
}); 

const t = useTranslations('HeroMobil');

// Use the image with public ID, 'sample'.
const myImage = cld.image('hero-banner05-Photoroom_1_c0uw5q',);


// Transform the image.
myImage
  .resize(fill(2400,850))
  .roundCorners(byRadius(0)).overlay(   
    source(
      text(t("Headline"), new TextStyle('bowlby one sc',90))
      .textColor('#898989')       
    )
    // Removed invalid line
  
    .position(new Position().gravity(compass('north_west')).offsetY(50).offsetX(50)))

    .overlay(   
      source(
        text(t("Jahr"), new TextStyle('bowlby one sc',130))
        .textColor('orange')       
      )
      
      .position(new Position().gravity(compass('north_west')).offsetY(130).offsetX(50)))
  

  .overlay(   
    source(
      text(t("präTitle"), new TextStyle('bowlby one sc',44))
      .textColor('orange')       
    )
    
    .position(new Position().gravity(compass('north_west')).offsetY(710).offsetX(50)))

  
 
    .overlay(   
      source(
        text(t("postTitle"), new TextStyle('raleway', 28) .textAlignment('justify') .fontWeight('black') .lineSpacing (-50) ) // Apply 'bold' using .fontWeight()
          .textColor('#898989') 
             
      )
      .position(new Position().gravity(compass('north_west')).offsetY(760).offsetX(50)))
      
      .overlay(
        source(
          image('LogoDms_czdjvn')
            .transformation(new Transformation()
            .resize(scale().height(200))
            .adjust(hue(5))
            .rotate(byAngle(0))
            )
          )
          .position(new Position().gravity(compass('south')).offsetX(300).offsetY(-50)) 
      ) 
    
  .rotate(byAngle(0))
  .format('png');
  

  // Return the delivery URL
  const myUrl = myImage.toURL()
  return(
    
    
    <div className="flex flex-col items-center">
    
      <Image src={myUrl} width={1980} height={1000} alt="Transformed Image" className="text-white text-left" />
    </div>
    
    
  );
}
