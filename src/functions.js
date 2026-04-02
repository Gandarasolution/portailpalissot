import { Buffer } from "buffer";

var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

function FiltrerParSearch(_lData, arrayFilters) {
  let _arFilters = Object.entries(groupBy(arrayFilters, "fieldname"));

  for (let index = 0; index < _arFilters.length; index++) {
    const arrayGroup = _arFilters[index];
    _lData = FiltrerUnSearch(arrayGroup[0], _lData, arrayFilters);
  }

  return _lData;
}

function FiltrerUnSearch(fieldname, _lData, arrayFilters) {
  let _arColonne = arrayFilters.filter(
    (filter) => filter.fieldname === fieldname
  );
  if (_arColonne.length > 0) {
    _lData = _lData.filter((data) => {
      return (
        _arColonne.filter((filter) => {
          return data[fieldname]
            ?.toString()
            ?.toLocaleUpperCase()
            ?.includes(filter.text.toString().toLocaleUpperCase());
        }).length > 0
      );
    });
  }
  return _lData;
}

function FiltrerParSeuilDate(_lData, arrayFilters) {
  let _arFilters = Object.entries(groupBy(arrayFilters, "fieldname"));

  for (let index = 0; index < _arFilters.length; index++) {
    const arrayGroup = _arFilters[index];
    _lData = FiltrerUnSeuilDate(arrayGroup[0], _lData, arrayFilters);
  }

  return _lData;
}

function FiltrerUnSeuilDate(fieldname, _lData, arrayFilters) {
  let _arColonne = arrayFilters.filter(
    (filter) => filter.fieldname === fieldname
  );
  if (_arColonne.length > 0) {
    _lData = _lData.filter((data) => {
      return (
        _arColonne.filter((filter) => {
          return (
            ParseDateFormat(data[fieldname]).getTime() <=
            new Date(filter.max).getTime() &&
            ParseDateFormat(data[fieldname]).getTime() >=
            new Date(filter.min).getTime()
          );
        }).length > 0
      );
    });
  }
  return _lData;
}

const ParseDateFormat = (text) => {
  try {
    var dateRegex = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/;
    let _match = text.match(dateRegex)[0];

    return new Date(
      _match.substring(6),
      _match.substring(3, 5) - 1,
      _match.substring(0, 2)
    );
  } catch {
    try {
      dateRegex = /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}/;
      let _match = text.match(dateRegex)[0];

      return new Date(
        _match.substring(0, 4),
        _match.substring(5, 7) - 1,
        _match.substring(10, 12)
      );
    } catch {
      return text;
    }
  }
};

function FiltrerParSeuil(_lData, arrayFilters) {
  let _arFilters = Object.entries(groupBy(arrayFilters, "fieldname"));

  for (let index = 0; index < _arFilters.length; index++) {
    const arrayGroup = _arFilters[index];
    _lData = FiltrerUnSeuil(arrayGroup[0], _lData, arrayFilters);
  }

  return _lData;
}

function FiltrerUnSeuil(fieldname, _lData, arrayFilters) {
  let _arColonne = arrayFilters.filter(
    (filter) => filter.fieldname === fieldname
  );
  if (_arColonne.length > 0) {
    _lData = _lData.filter((data) => {
      return (
        _arColonne.filter((filter) => {
          return (
            Number(data[fieldname]) <= Number(filter.max) &&
            Number(data[fieldname]) >= Number(filter.min)
          );
        }).length > 0
      );
    });
  }
  return _lData;
}

function FiltrerParCollones(_lData, arrayFilters) {
  let _arFilters = Object.entries(groupBy(arrayFilters, "fieldname"));
  for (let index = 0; index < _arFilters.length; index++) {
    const arrayGroup = _arFilters[index];
    _lData = FiltreUnecollone(arrayGroup[0], _lData, arrayFilters);
  }
  return _lData;
}

function FiltreUnecollone(fieldname, _lData, arrayFilters) {
  let _arColonne = arrayFilters.filter(
    (filter) => filter.fieldname === fieldname
  );
  if (_arColonne.length > 0) {
    _lData = _lData.filter((data) => {
      return (
        _arColonne.filter(filterColoneByTypeOfData(data, fieldname)).length > 0
      );
    });
  }
  return _lData;
}

const filterColoneByTypeOfData = (data, fieldname) => {
  switch (typeof data[fieldname]) {
    case typeof "":
      return (filter) => filter.item === data[fieldname];
    case typeof 0:
      return (filter) => Number(filter.item) === data[fieldname];
    case typeof new Date():
      return (filter) =>
        new Date(filter.item).getTime() === data[fieldname].getTime();
    case typeof true:
      return (filter) => /true/.test(filter.item) === data[fieldname];

    default:
      return (filter) => filter.item === data[fieldname];
  }
};

const GetFileSizeFromB64String = (b64String) => {
  // x = (n * (3/4)) - y
  // Where:
  // 1. x is the size of a file in bytes
  // 2. n is the length of the Base64 String
  // 3. y will be 2 if Base64 ends with '==' and 1 if Base64 ends with '='.

  let _sizeByte = 0;
  let _strLen = b64String.length;
  let _b64EndMinus = b64String.slice(-2) === "==" ? 2 : 1;

  _sizeByte = _strLen * (3 / 4) - _b64EndMinus;

  return bytesToSize(_sizeByte);
};

function bytesToSize(bytes) {
  const sizes = ["Octets", "Ko", "Mo", "Go", "To"];
  if (bytes === 0) return "n/a";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) return `${bytes} ${sizes[i]})`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}

/**
 * retourne le nom du mois selon l'index
 * @param {Number} num L'index du mois
 * @param {bool} short Si le nom est abrégé ou pas
 * @returns String le nom du mois
 */
function GetNomMois(num, short = false) {
  if (num > 12) {
    num = num - 12;
  }
  switch (num) {
    case 1:
      return short ? "Jan." : "Janvier";
    case 2:
      return short ? "Fév." : "Février";
    case 3:
      return "Mars";
    case 4:
      return short ? "Avr." : "Avril";
    case 5:
      return "Mai";
    case 6:
      return "Juin";
    case 7:
      return short ? "Juil." : "Juillet";
    case 8:
      return "Août";
    case 9:
      return short ? "Sept." : "Septembre";
    case 10:
      return short ? "Oct." : "Octobre";
    case 11:
      return short ? "Nov." : "Novembre";
    case 12:
      return short ? "Déc." : "Décembre";
    default:
      return null;
  }
}








function addOneYear(date) {
  date.setFullYear(date.getFullYear() + 1);
  return date;
}

function subOneYear(date) {
  date.setFullYear(date.getFullYear() - 1);
  return date;
}

function DateSOAP(date) {
  // Get year, month, and day part from the date
  var year = date.toLocaleString("default", { year: "numeric" });
  var month = date.toLocaleString("default", { month: "2-digit" });
  // var month = "01"
  var day = date.toLocaleString("default", { day: "2-digit" });

  return year + "-" + month + "-" + day;
}


function GetDateFromStringDDMMYYY(dateStr) {
  const Day = dateStr.substring(0, 2);
  const Month = dateStr.substring(3, 5);
  const Year = dateStr.substring(6, 10);
  return  new Date(Year, Number(Month) - 1, Day);
}



function HTMLEncode(text) {
  return (
    text
      // .replace(/&/g, "&amp;")
      // .replace(/>/g, "&gt;")
      // .replace(/</g, "&lt;")
      // .replace(/"/g, "&quot;")
      .replace(/\//g, "")
  );
}

function URLReplace(text) {
  return text.replace(/&/g, ";amp;").replace(/\?/g, ";qmk;");
}

function ULRDeplace(text) {
  return text.replace(/;qmk;/g, "?").replace(/;amp;/g, "&");
}

function RegexTestAndReturnMatch(data, regex) {
  let _test = regex.test(data);
  if (_test) {
    let _match = data.match(regex)[0];
    return _match;
  }
  return data;
}

function ParseKVAsArray(kv) {
  let _array = [];

  if (Array.isArray(kv)) {
    _array = kv;
  } else {
    if (kv) {
      _array.push(kv);
    }
  }

  return _array;
}




const base64toBlob = (data,type) => {
  // Cut the prefix `data:application/pdf;base64` from the raw base 64
  // const base64WithoutPrefix = data.substr('data:application/pdf;base64,'.length);


  const bytes = Buffer.from(data, "base64");
  // return new Blob([bytes], { type: type?type:"application/pdf" });
  return new Blob([bytes], { type: type?type:"application/pdf" });
};


const GetURLLocationViewerFromExtension = (extension) => {

  switch (extension.toUpperCase()) {
    case "PDF":
      return "/viewerPDF";
    case "DOCX":
    case "DOC":
      return "/viewerDOC";
    case "PNG":
    case "JPG":
      return "/viewerIMG";
    default:
      return "/";

  }

}

//Fonction de hash : https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
const cyrb53 = (str, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};


const GenerateUid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}


const GetRedirectionFromIdTypeDocument = (IdTypeDocument, IdEtat) => {
  let _page = '';
  switch (IdTypeDocument) {
    case 0://Devis
      _page = 'devis';
      break;
    case 25://DISAV
      _page = 'interventions';
      break;
    case 3://Factures
      return `factures?seuil=ResteDu&value=${IdEtat+0.01}`;
    default:
      return '#';
  }

  return `${_page}?filtre=${IdEtat}`;
}



const IsUserFromToken = (token) => {
  if(token)
  {
    if(token.length > 3)
    {
      return token.substring(0,2) === "**";
    }
  }
  return false;
}



  /**
   * Ensures the value is a valid GUID
   * @param value string value
   */
  function isValidGUID(value) {
    if (value.length > 0) {
      if (!(/^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/).test(value)) {
        return false;
      }
    }

    return true;
  }

const isValidEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
function getMimeTypeFromExtension(extension) {
    if (extension[0] === ".") {
        extension = extension.substr(1);
    }
    return {
        "aac": "audio/aac",
        "abw": "application/x-abiword",
        "arc": "application/x-freearc",
        "avi": "video/x-msvideo",
        "azw": "application/vnd.amazon.ebook",
        "bin": "application/octet-stream",
        "bmp": "image/bmp",
        "bz": "application/x-bzip",
        "bz2": "application/x-bzip2",
        "cda": "application/x-cdf",
        "csh": "application/x-csh",
        "css": "text/css",
        "csv": "text/csv",
        "doc": "application/msword",
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "eot": "application/vnd.ms-fontobject",
        "epub": "application/epub+zip",
        "gz": "application/gzip",
        "gif": "image/gif",
        "htm": "text/html",
        "html": "text/html",
        "ico": "image/vnd.microsoft.icon",
        "ics": "text/calendar",
        "jar": "application/java-archive",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "js": "text/javascript",
        "json": "application/json",
        "jsonld": "application/ld+json",
        "mid": "audio/midi audio/x-midi",
        "midi": "audio/midi audio/x-midi",
        "mjs": "text/javascript",
        "mp3": "audio/mpeg",
        "mp4": "video/mp4",
        "mpeg": "video/mpeg",
        "mpkg": "application/vnd.apple.installer+xml",
        "odp": "application/vnd.oasis.opendocument.presentation",
        "ods": "application/vnd.oasis.opendocument.spreadsheet",
        "odt": "application/vnd.oasis.opendocument.text",
        "oga": "audio/ogg",
        "ogv": "video/ogg",
        "ogx": "application/ogg",
        "opus": "audio/opus",
        "otf": "font/otf",
        "png": "image/png",
        "pdf": "application/pdf",
        "php": "application/x-httpd-php",
        "ppt": "application/vnd.ms-powerpoint",
        "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "rar": "application/vnd.rar",
        "rtf": "application/rtf",
        "sh": "application/x-sh",
        "svg": "image/svg+xml",
        "swf": "application/x-shockwave-flash",
        "tar": "application/x-tar",
        "tif": "image/tiff",
        "tiff": "image/tiff",
        "ts": "video/mp2t",
        "ttf": "font/ttf",
        "txt": "text/plain",
        "vsd": "application/vnd.visio",
        "wav": "audio/wav",
        "weba": "audio/webm",
        "webm": "video/webm",
        "webp": "image/webp",
        "woff": "font/woff",
        "woff2": "font/woff2",
        "xhtml": "application/xhtml+xml",
        "xls": "application/vnd.ms-excel",
        "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "xml": "application/xml",
        "xul": "application/vnd.mozilla.xul+xml",
        "zip": "application/zip",
        "3gp": "video/3gpp",
        "3g2": "video/3gpp2",
        "7z": "application/x-7z-compressed"
    }[extension] || "application/octet-stream";
}

export {
  FiltrerParSeuilDate,
  FiltrerParSearch,
  FiltrerParSeuil,
  FiltrerParCollones,
  groupBy,
  GetFileSizeFromB64String,
  GetNomMois,
  addOneYear,
  subOneYear,
  DateSOAP,
  HTMLEncode,
  URLReplace,
  ULRDeplace,
  RegexTestAndReturnMatch,
  ParseKVAsArray,
  GetDateFromStringDDMMYYY,
  base64toBlob,
  GetURLLocationViewerFromExtension,
  cyrb53,
  GenerateUid,
  GetRedirectionFromIdTypeDocument,
  IsUserFromToken,
  isValidGUID,
  isValidEmail,
  getMimeTypeFromExtension,
};
