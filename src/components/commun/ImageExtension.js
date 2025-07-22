import Image from "react-bootstrap/Image";

import ImgError from "../../image/error.png";
import ImgNEUTRE from "../../image/imageDocuments/neutre.png";
import ImgJPG from "../../image/imageDocuments/jpg.svg";
import ImgPDF from "../../image/imageDocuments/pdf.svg";
import ImgPNG from "../../image/imageDocuments/png.svg";
import ImgDOC from "../../image/imageDocuments/doc.svg";
import ImgZIP from "../../image/imageDocuments/zip.svg";
import ImgXML from "../../image/imageDocuments/xml.svg";
import ImgXLS from "../../image/imageDocuments/xls.png";
import ImgTXT from "../../image/imageDocuments/txt.svg";
import ImgGIF from "../../image/imageDocuments/gif.svg";
import ImgMP3 from "../../image/imageDocuments/mp3.svg";
import ImgSVG from "../../image/imageDocuments/svg.svg";
import ImgBMP from "../../image/imageDocuments/bmp.svg";

import ImgDOCX from "../../image/imageDocuments/docx.png";
import ImgDWG from "../../image/imageDocuments/dwg.png";
import ImgPPTX from "../../image/imageDocuments/pptx.png";
import ImgRAR from "../../image/imageDocuments/rar.png";
import ImgXLSX from "../../image/imageDocuments/xlsx.png";

import ImgAVI from "../../image/imageDocuments/avi.svg";
import ImgMPG from "../../image/imageDocuments/mpg.svg";
import ImgPPT from "../../image/imageDocuments/ppt.svg";
import ImgMOV from "../../image/imageDocuments/mov.svg";

const GetImageExtension = (extension) => {
  switch (extension.toString().toUpperCase()) {
    case "ERROR":
      return ImgError;
    case "JPG":
      return ImgJPG;
    case "PDF":
      return ImgPDF;
    case "PNG":
      return ImgPNG;
    case "ZIP":
      return ImgZIP;
    case "XML":
      return ImgXML;
    case "XLS":
      return ImgXLS;
    case "XLSX":
      return ImgXLSX;
    case "TXT":
      return ImgTXT;
    case "GIF":
      return ImgGIF;
    case "MP3":
      return ImgMP3;
    case "SVG":
      return ImgSVG;
    case "BMP":
      return ImgBMP;
    case "DOC":
      return ImgDOC;
    case "DOCX":
      return ImgDOCX;
    case "DWG":
      return ImgDWG;
    case "PPTX":
      return ImgPPTX;
    case "RAR":
      return ImgRAR;
    case "MOV":
      return ImgMOV;
    case "PPT":
      return ImgPPT;
    case "MPG":
      return ImgMPG;
    case "AVI":
      return ImgAVI;
    default:
      return ImgNEUTRE;
  }
};

const ImageExtension = ({ extension }) => {
  return (
    <Image
      src={GetImageExtension(extension)}
      height={42}
      alt={`Icone ${extension}`}
    />
  );
};

export default ImageExtension;

export const IsExtensionVisible = (extension) => {
  switch (extension.toString().toUpperCase()) {
    case "JPG":
    case "PDF":
    case "PNG":
    case "TXT":
    case "MP3":
      return true;
    default:
      return false;
  }
};
