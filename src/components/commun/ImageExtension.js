import Image from "react-bootstrap/Image";

const ImageExtension = ({ extension }) => {
  const ImgJPG = require("../../image/imageDocuments/jpg.png");
  const ImgPDF = require("../../image/imageDocuments/pdf.png");
  const ImgPNG = require("../../image/imageDocuments/png.png");
  const ImgDOC = require("../../image/imageDocuments/doc.png");
  const ImgZIP = require("../../image/imageDocuments/zip.png");
  const ImgXML = require("../../image/imageDocuments/xml.png");
  const ImgXLS = require("../../image/imageDocuments/xls.png");
  const ImgTXT = require("../../image/imageDocuments/txt.png");
  const ImgGIF = require("../../image/imageDocuments/gif.png");
  const ImgMP3 = require("../../image/imageDocuments/mp3.png");
  const ImgSVG = require("../../image/imageDocuments/svg.png");
  const ImgBMP = require("../../image/imageDocuments/bmp.png");

  const ImgDOCX = require("../../image/imageDocuments/docx.png");
  const ImgDWG = require("../../image/imageDocuments/dwg.png");
  const ImgNEUTRE = require("../../image/imageDocuments/neutre.png");
  const ImgPPTX = require("../../image/imageDocuments/pptx.png");
  const ImgRAR = require("../../image/imageDocuments/rar.png");
  const ImgXLSX = require("../../image/imageDocuments/xlsx.png");
  
  const ImgAVI = require("../../image/imageDocuments/avi.png");
  const ImgMPG = require("../../image/imageDocuments/mpg.png");
  const ImgPPT = require("../../image/imageDocuments/ppt.png");
  const ImgMOV = require("../../image/imageDocuments/mov.png");




  const GetImageExtension = (extension) => {
    switch (extension.toString().toUpperCase()) {
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

  return (
    <Image
      src={GetImageExtension(extension)}
      height={42}
      alt={`Icone ${extension} Crédit Dimitriy Morilubov`}
    />
  );
};

export default ImageExtension;
