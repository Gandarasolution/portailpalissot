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
            .toString()
            .toLocaleUpperCase()
            .includes(filter.text.toString().toLocaleUpperCase());
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


function GetDateFromStringDDMMYYY(dateStr){
  const Day = dateStr.substring(0,2);
      const Month = dateStr.substring(3,5);
      const Year = dateStr.substring(6,10);
  return new Date(Year, Number(Month) - 1, Day);
 
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
};
