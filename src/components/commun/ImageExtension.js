import Image from "react-bootstrap/Image";

const ImageExtension = ({ extension }) => {
  const ImgJPG = require("../../image/jpg.png");
  const ImgPDF = require("../../image/pdf.png");
  const ImgPNG = require("../../image/png.png");
  const ImgDOC = require("../../image/doc.png");
  const ImgZIP = require("../../image/zip.png");

  const ImgXML = require("../../image/xml.png");
  const ImgXLS = require("../../image/xls.png");
  const ImgTXT = require("../../image/txt.png");
  const ImgGIF = require("../../image/gif.png");
  const ImgMP3 = require("../../image/mp3.png");
  const ImgSVG = require("../../image/svg.png");
  const ImgBMP = require("../../image/bmp.png");

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
      case "XLSX":
        return ImgXLS;
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
      default:
        return ImgDOC;
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
