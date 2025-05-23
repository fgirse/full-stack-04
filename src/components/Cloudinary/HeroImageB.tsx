import Image from "next/image";
import {Cloudinary} from "@cloudinary/url-gen";

// Import required actions.

import {byAngle} from "@cloudinary/url-gen/actions/rotate"

// Import the required actions and qualifiers.
import {fill} from "@cloudinary/url-gen/actions/resize";
import {source} from "@cloudinary/url-gen/actions/overlay";
import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";

// Import required values.
import {text} from "@cloudinary/url-gen/qualifiers/source";
import {Position} from "@cloudinary/url-gen/qualifiers/position";
import { useTranslations } from "next-intl";
import {TextStyle} from "@cloudinary/url-gen/qualifiers/textStyle";
import {autoGravity, compass} from "@cloudinary/url-gen/qualifiers/gravity";
import { TextAlignment } from "@cloudinary/url-gen/qualifiers";
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
  .resize(fill(2100,750))
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
    
    .position(new Position().gravity(compass('north_west')).offsetY(610).offsetX(50)))

  
  .overlay(   
    source(
      text(t("Title"), new TextStyle('bowlby one sc',200))
      .textColor('white')       
    )
    
    .position(new Position().gravity(compass('north_west')).offsetY(1638).offsetX(110)))

    .overlay(   
      source(
        text(t("postTitle"), new TextStyle('raleway', 28) .textAlignment('justify') .fontWeight('black') .lineSpacing (-50) ) // Apply 'bold' using .fontWeight()
          .textColor('#898989') 
             
      )
      .position(new Position().gravity(compass('north_west')).offsetY(660).offsetX(50)))
  

    
  .rotate(byAngle(0))
  .format('png');
  

  // Return the delivery URL
  const myUrl = myImage.toURL()
  return(
    
    
    <div className="flex flex-col items-center">
    
      <Image src={myUrl} width={1980} height={900} alt="Transformed Image" className="text-white text-left" />
    </div>
    
    
  );
}
