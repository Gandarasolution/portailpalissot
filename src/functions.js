var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };


function FiltrerParCollones(_lData, arrayFilters) {
    let _arFilters = Object.entries(groupBy(arrayFilters, "fieldname"));
    for (let index = 0; index < _arFilters.length; index++) {
      const arrayGroup = _arFilters[index];
      _lData = FiltreUnecollone(arrayGroup[0], _lData,arrayFilters);
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
          _arColonne.filter(filterColoneByTypeOfData(data, fieldname)).length >
          0
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
      default:
        return (filter) => filter.item === data[fieldname];
    }
  };




  const ImgJPG = require("./image/jpg.png");
  const ImgPDF = require("./image/pdf.png");
  const ImgPNG = require("./image/png.png");
  const ImgDOC = require("./image/doc.png");
  const ImgZIP = require("./image/zip.png")


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
      default:
        return ImgDOC; 
    }
  }







  export  {FiltrerParCollones, groupBy, GetImageExtension}
