//#region Imports

//#region Bootstrap

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Pagination from "react-bootstrap/Pagination";
import Placeholder from "react-bootstrap/Placeholder";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Card from "react-bootstrap/Card";
import Tooltip from "react-bootstrap/Tooltip";

//#endregion

//#region fontAwsome
import {
  faClose,
  faDownload,
  faEye,
  faFilter,
  faFilterCircleXmark,
  faList,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//#endregion

//#region Composants
import {
  FiltrerParCollones,
  FiltrerParSearch,
  FiltrerParSeuil,
  FiltrerParSeuilDate,
  RegexTestAndReturnMatch,
  groupBy,
} from "../../functions";
import RowDocument from "./RowDocument";

import {
  GeTListeFactureIntervention,
  GetDocumentFISAV,
  GetDocumentPrestation,
  GetDocumentPrestationCERFA,
  GetDocumentPrestationExtranet,
  GetDocumentPrestationRapport,
  GetDocumentPrestationTicket,
  GetListeFIIntervention,
  GetPrestationReleveTache,
  TelechargerFactureDocument,
  TelechargerZIP,
  VoirFactureDocument,
} from "../../axios/WSGandara";

//#region Contexts
import { TokenContext } from "../../App";
import { PrestaContext } from "../../Views/Maintenance/Contrat/Components/ContratPrestations";

//#endregion

//#endregion

import { useContext, useEffect, useState } from "react";

import { Breakpoint, BreakpointProvider } from "react-socks";

const TAGSELECTION = "_xSelection";
//#endregion

/**
 * @param {*} {Data : [], Headers: [], Cells: [], CardModel:{},  IsLoaded: bool,  Pagination: bool, ?ButtonFilters: [], ?FilterDefaultValue: {}, ?TopPannelRightToSearch: <></>, ?TopPannelLeftToSearch: <></>  ,?placeholdeNbLine; int,  }
 * @returns Une table
 */
const TableData = ({ ...props }) => {
  const tokenCt = useContext(TokenContext);

  const Data = () => {
    let _lData = [];
    if (props.Data === "500") {
      _lData = [];
    } else {
      _lData = JSON.parse(JSON.stringify(props.Data));
    }

    //Récursion pour colonne unbound et _xSelection
    for (let index = 0; index < _lData.length; index++) {
      const element = _lData[index];
      let _unboundColonne = JSON.parse(JSON.stringify(element));
      element.unboundColonne = _unboundColonne;
      element[TAGSELECTION] = arraySelector.includes(index);
    }

    //filtre par la barre de recherche
    if (String(search).length > 0) {
      _lData = _lData.filter((item) => FiltrerParSearchGlobal(item));
    }

    //Filtre par les boutons
    if (props.ButtonFilters && btFilterActif) {
      let _filteractif = JSON.parse(JSON.stringify(btFilterActif));

      _lData = _lData.filter((data) => {
        if (Array.isArray(_filteractif.value)) {
          let _value = false;

          for (let index = 0; index < _filteractif.value.length; index++) {
            const element = _filteractif.value[index];
            _value = data[_filteractif.fieldname] === element ? true : _value;
          }

          return _value;
        } else {
          return data[_filteractif.fieldname] === _filteractif.value;
        }
      });
    }

    //Filtres par la recherche par colonne
    if (arraySearch.length > 0) {
      _lData = FiltrerParSearch(_lData, arraySearch);
    }

    //Filtres par valeur min & max
    if (arrayFilterSeuis.length > 0) {
      _lData = FiltrerParSeuil(_lData, arrayFilterSeuis);
    }
    //Filtres par valeur date du & au
    if (arrayFilterRangeDate.length > 0) {
      _lData = FiltrerParSeuilDate(_lData, arrayFilterRangeDate);
    }

    //Filtres par check
    _lData = FiltrerParCollones(_lData, arrayFilter);

    return _lData;
  };

  //#region States
  const [search, setSearch] = useState("");

  const [arrayFilter, setArrayFilter] = useState([]);
  const [arrayFilterSeuis, setArrayFilterSeuils] = useState([]);
  const [arrayFilterRangeDate, setArrayFilterRangeDate] = useState([]);
  const [arraySearch, setArraySearch] = useState([]);

  const [btFilterActif, setBtFilterActif] = useState(
    props.FilterDefaultValue ? props.FilterDefaultValue : null
  );

  const [nbParPages, setNbParPages] = useState(10);
  const [pageActuelle, setPageActuelle] = useState(1);

  const [rowIndexSelected, setRowIndexSelected] = useState(null);

  const [arraySelector, setArraySelector] = useState([]);

  //#endregion

  //#region Fonctions

  const reactStringReplace = require("react-string-replace");
  function HighlightTextIfSearch(text) {
    if (
      String(search).length > 0 &&
      String(text).toUpperCase().includes(String(search).toUpperCase())
    ) {
      return (
        <span>
          {reactStringReplace(String(text), String(search), (match, i) => (
            <mark key={i}>{match}</mark>
          ))}
        </span>
      );
    } else {
      return text;
    }
  }

  function FiltrerParSearchGlobal(_litem) {
    // eslint-disable-next-line
    let _arrIs = Object.keys(_litem).map((key) => {
      let _cellToApply = props.Cells.find((c) => c.fieldname === key);

      if (_cellToApply && _cellToApply.isSearchable) {
        return String(_litem[key])
          .toString()
          .toLocaleUpperCase()
          .includes(String(search).toLocaleUpperCase());
      }
    });

    for (let index = 0; index < _arrIs.length; index++) {
      const element = _arrIs[index];
      if (element && element === true) return true;
    }
    return false;
  }

  function IsFiltercheckboxShouldBeCheck(fieldname, item) {
    if (
      arrayFilter.findIndex(
        (filter) => filter.fieldname === fieldname && filter.item === item
      ) > -1
    )
      return true;
    return false;
  }

  function IsButtonShouldBeCheck(fieldname) {
    if (
      arrayFilter.findIndex((filter) => filter.fieldname === fieldname) > -1
    ) {
      return true;
    }

    if (
      arrayFilterSeuis.findIndex((filter) => filter.fieldname === fieldname) >
      -1
    ) {
      return true;
    }

    if (
      arraySearch.findIndex((filter) => filter.fieldname === fieldname) > -1
    ) {
      return true;
    }

    if (
      arrayFilterRangeDate.findIndex(
        (filter) => filter.fieldname === fieldname
      ) > -1
    ) {
      return true;
    }

    return false;
  }

  const isFilterActive = (filter) => {
    if (!btFilterActif) return false;
    return (
      btFilterActif.fieldname === filter.fieldname &&
      btFilterActif.value === filter.value
    );
  };

  function ResetAffichage(pageActuelle) {
    setGridColMDValue(12);
    setDocuments([]);
    setPageActuelle(pageActuelle);
  }

  //#endregion

  //#region LARGE

  //#region Events

  const handleSearch = (e) => {
    e.preventDefault();
    ResetAffichage(1);
    setSearch(e.target.value);
  };

  const HandleCheckfilterChange = (checked, key, value) => {
    let _arrTemp = JSON.parse(JSON.stringify(arrayFilter));

    if (checked) {
      _arrTemp.push({ fieldname: key, item: value });
      setArrayFilter(_arrTemp);
    } else {
      const index = _arrTemp.findIndex(
        (filter) => filter.fieldname === key && filter.item === value
      );
      if (index > -1) {
        _arrTemp.splice(index, 1);
        setArrayFilter(_arrTemp);
      }
    }
  };

  const handleTousFilter = () => {
    setBtFilterActif(null);
    ResetAffichage(1);
  };

  const handleFilterClick = (filter) => {
    setBtFilterActif(filter);
    ResetAffichage(1);
  };

  //#region Pagination
  const handlePagePrev = () => {
    if (pageActuelle > 1) {
      ResetAffichage(pageActuelle - 1);
      props.methodPagination && props.methodPagination();
    }
  };

  const handlePageChange = (number) => {
    ResetAffichage(number);
    props.methodPagination && props.methodPagination();
  };

  const handlePageNext = (number) => {
    if (pageActuelle < number) {
      ResetAffichage(pageActuelle + 1);
      props.methodPagination && props.methodPagination();
    }
  };
  //#endregion

  //#endregion

  //#region Component

  //#region Headers

  /**
   *
   * @returns Les en-têtes de la table
   */
  const TableHeaders = () => {
    return (
      <thead className="m-2 row-height">
        <tr>
          {props.Headers.map((header, i) => {
            return <TableHeader key={i} header={header} />;
          })}
        </tr>
      </thead>
    );
  };

  /**
   *
   * @param {*} header
   * @returns Une en-tête
   */
  const TableHeader = ({ header }) => {
    return header.filter.isFilter ? (
      <TableHeaderCellFilter header={header} />
    ) : header.fieldname === TAGSELECTION ? (
      <TableHeaderCellSelection header={header} />
    ) : (
      <TableHeaderCell header={header} />
    );
  };

  //#region HeaderCells

  function GetHeaderColSpan(fieldname) {
    return props.Cells.filter((c) => {
      return c.fieldname === fieldname;
    }).length;
  }

  const TableHeaderCell = ({ header }) => {
    return (
      <th key={header.fieldname} colSpan={GetHeaderColSpan(header.fieldname)}>
        <div className="row-height">
          {header.caption ? header.caption : header.fieldname}
        </div>
      </th>
    );
  };

  const TableHeaderCellSelection = ({ header }) => {
    const HandleClick = () => {
      setArraySelector([]);
    };

    return (
      <th key={header.fieldname} colSpan={GetHeaderColSpan(header.fieldname)}>
        <div className="row-height">
          {header.caption ? header.caption : header.fieldname}
          <FontAwesomeIcon
            onClick={HandleClick}
            // onDoubleClick={HandleDoubleClick}
            icon={faClose}
            className={"icon-bt"}
          />
        </div>
      </th>
    );
  };

  const TableHeaderCellFilter = ({ header }) => {
    return (
      <th key={header.fieldname}>
        <div className="row-height">
          {header.caption ? header.caption : header.fieldname}
          <OverlayTrigger
            trigger="click"
            rootClose
            overlay={PopoverFilter(header.fieldname)}
            placement="bottom"
          >
            <FontAwesomeIcon
              icon={faFilter}
              className={`icon-bt ${
                IsButtonShouldBeCheck(header.fieldname) && "filter-actif"
              } `}
            />
          </OverlayTrigger>
        </div>
      </th>
    );
  };

  const PopoverFilter = (fieldname) => {
    let _arFilters = [];

    _arFilters = Object.entries(groupBy(props.Data, fieldname));
    const _arrayVal = _arFilters.map((x) => x[0]);

    const _headerToApply = props.Headers.find((h) => h.fieldname === fieldname);

    //#region RangeDate

    let _arrayDate = _arrayVal.map((date) => {
      if (!date) return date;
      try {
        var dateRegex = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/;

        let _match = RegexTestAndReturnMatch(date, dateRegex);

        if (_match === date) {
          dateRegex = /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}/;
          let _match2 = RegexTestAndReturnMatch(date, dateRegex);

          let _retu = new Date(
            _match2.substring(0, 4),
            _match2.substring(5, 7) - 1,
            _match2.substring(8, 10)
          );

          return _retu;
        }

        let _retu = new Date(
          _match.substring(6),
          _match.substring(3, 5) - 1,
          _match.substring(0, 2)
        );

        return _retu;
      } catch (error) {
        return date;
      }
    });

    const minDate = new Date(Math.min.apply(null, _arrayDate));
    const maxDate = new Date(Math.max.apply(null, _arrayDate));

    const ParseDateFormat = (text) => {
      function parseAvecSlash() {
        var dateRegex = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/;
        let _match = text.match(dateRegex)[0];

        return `${_match.substring(6)}-${_match.substring(
          3,
          5
        )}-${_match.substring(0, 2)}`;
      }

      function parseAvecTiret() {
        var dateRegex = /^[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}/;
        let _match = text.match(dateRegex)[0];

        return `${_match.substring(6)}-${_match.substring(
          3,
          5
        )}-${_match.substring(0, 2)}`;
      }

      try {
        let _match = parseAvecSlash();
        if (_match === text) {
          _match = parseAvecTiret();
        }

        return _match;
      } catch {
        return text;
      }
    };

    const GetTimeFromTextDateParsed = (text) => {
      try {
        var dateRegex = /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}/g;

        let _match = text.match(dateRegex)[0];

        let _retu = new Date(
          _match.substring(0, 4),
          _match.substring(5, 7) - 1,
          _match.substring(8)
        );
        return _retu.getTime();
      } catch {
        return text;
      }
    };

    const [minDateValue, setMinDateValue] = useState(
      arrayFilterRangeDate.find((f) => f.fieldname === fieldname)
        ? arrayFilterRangeDate.find((f) => f.fieldname === fieldname).min
        : ParseDateFormat(minDate.toLocaleDateString("fr-FR"))
    );

    const [maxDateValue, setMaxDateValue] = useState(
      arrayFilterRangeDate.find((f) => f.fieldname === fieldname)
        ? arrayFilterRangeDate.find((f) => f.fieldname === fieldname).max
        : ParseDateFormat(maxDate.toLocaleDateString("fr-FR"))
    );

    const HandleMinDateValueChanged = (e) => {
      e.preventDefault();
      setMinDateValue(e.target.value);
    };

    const HandleMinDateRangeValueChanged = (e) => {
      e.preventDefault();
      setMinDateValue(
        ParseDateFormat(
          new Date(Number(e.target.value)).toLocaleDateString("us-US")
        )
      );
    };

    const HandleMaxDateValueChanged = (e) => {
      e.preventDefault();
      setMaxDateValue(e.target.value);
    };

    const HandleMaxDateRangeValueChanged = (e) => {
      e.preventDefault();
      setMaxDateValue(
        ParseDateFormat(
          new Date(Number(e.target.value)).toLocaleDateString("us-US")
        )
      );
    };

    const HandleFilterDateClick = () => {
      let _obj = { fieldname: fieldname, min: minDateValue, max: maxDateValue };
      let _arrayFilterDate = JSON.parse(JSON.stringify(arrayFilterRangeDate));
      let _index = _arrayFilterDate.findIndex((f) => f.fieldname === fieldname);
      if (_index > -1) {
        _arrayFilterDate[_index] = _obj;
      } else {
        if (
          new Date(minDateValue).getTime() !== minDate.getTime() ||
          new Date(maxDateValue).getTime() !== maxDate.getTime()
        ) {
          _arrayFilterDate.push(_obj);
        }
      }
      setArrayFilterRangeDate(_arrayFilterDate);
    };

    //#endregion

    //#region Range
    const minVal = _arrayVal.some(isNaN) ? undefined : Math.min(..._arrayVal);
    const maxVal = _arrayVal.some(isNaN) ? undefined : Math.max(..._arrayVal);
    const [minValue, setMinvalue] = useState(
      arrayFilterSeuis.find((f) => f.fieldname === fieldname)
        ? arrayFilterSeuis.find((f) => f.fieldname === fieldname).min
        : minVal
    );
    const [maxValue, setMaxValue] = useState(
      arrayFilterSeuis.find((f) => f.fieldname === fieldname)
        ? arrayFilterSeuis.find((f) => f.fieldname === fieldname).max
        : maxVal
    );

    const HandleMinValueChanged = (e) => {
      e.preventDefault();
      setMinvalue(e.target.value);
    };

    const HandleMaxValueChanged = (e) => {
      setMaxValue(e.target.value);
    };

    const HandleFilterSeuilClick = () => {
      let _obj = { fieldname: fieldname, min: minValue, max: maxValue };
      let _arrayFilterSeuis = JSON.parse(JSON.stringify(arrayFilterSeuis));
      let _index = _arrayFilterSeuis.findIndex(
        (f) => f.fieldname === fieldname
      );

      if (_index > -1) {
        _arrayFilterSeuis[_index] = _obj;
      } else {
        if (minValue !== minVal || maxValue !== maxVal) {
          _arrayFilterSeuis.push(_obj);
        }
      }
      setArrayFilterSeuils(_arrayFilterSeuis);
    };

    //#endregion

    //#region Search
    const _arrSearch = JSON.parse(JSON.stringify(arraySearch));
    const [searchCol, setSearchCol] = useState(
      _arrSearch.find((s) => s.fieldname === fieldname)
        ? _arrSearch.find((s) => s.fieldname === fieldname).text
        : ""
    );

    const handleSearchOnChange = (e) => {
      setSearchCol(e.target.value);
    };

    const HandleSearchOnClick = () => {
      let _index = _arrSearch.findIndex((f) => f.fieldname === fieldname);
      let _obj = { fieldname: fieldname, text: searchCol };

      if (searchCol.length === 0) {
        if (_index > -1) {
          _arrSearch.pop(_index);
        }
      } else {
        if (_index > -1) {
          _arrSearch[_index] = _obj;
        } else {
          _arrSearch.push(_obj);
        }
      }
      setArraySearch(_arrSearch);
      ResetAffichage(1);
    };

    //#endregion

    const SupprimerFiltreColonne = () => {
      function removeValue(array, setArray) {
        let _array = JSON.parse(JSON.stringify(array));
        _array = _array.filter((f) => f.fieldname !== fieldname);
        setArray(_array);
      }
      removeValue(arrayFilter, setArrayFilter);
      removeValue(arrayFilterRangeDate, setArrayFilterRangeDate);
      removeValue(arrayFilterSeuis, setArrayFilterSeuils);
      removeValue(arraySearch, setArraySearch);
    };

    if (_headerToApply.filter.isCheckbox && _arFilters.length > 10) {
      _headerToApply.filter.isCheckbox = false;
    }
    return (
      <Popover className="popover-filters">
        <Tabs
          fill
          defaultActiveKey={
            Object.entries(_headerToApply.filter).find(
              (value) => value[0] !== "isFilter" && value[1]
            )[0]
          }
        >
          {/* Checkbox */}
          {_headerToApply.filter.isCheckbox && (
            <Tab title="Valeur" eventKey={"isCheckbox"}>
              <div id="ppvr-check">
                {_arFilters.map((item, index) => {
                  if (item[0] === "undefined") return null;
                  return (
                    <Form.Check
                      key={index}
                      type="checkbox"
                      checked={IsFiltercheckboxShouldBeCheck(
                        fieldname,
                        item[0]
                      )}
                      label={
                        _headerToApply.editor
                          ? _headerToApply.editor(item[0])
                          : item[0]
                      }
                      onChange={(e) =>
                        HandleCheckfilterChange(
                          e.target.checked,
                          fieldname,
                          item[0]
                        )
                      }
                    />
                  );
                })}
              </div>
            </Tab>
          )}
          {/* Date du au */}
          {_headerToApply.filter.isRangeDate && (
            <Tab title="Date" eventKey={"isRangeDate"}>
              <div id="ppvr-rangeDate">
                <Col>
                  <Form.Label>Du</Form.Label>
                  <Form.Control
                    type="date"
                    value={minDateValue}
                    onChange={HandleMinDateValueChanged}
                  />

                  <Form.Range
                    min={minDate && minDate.getTime()}
                    max={maxDate && maxDate.getTime()}
                    value={GetTimeFromTextDateParsed(minDateValue)}
                    onChange={HandleMinDateRangeValueChanged}
                  />
                </Col>
                <Col>
                  <Form.Label>Au</Form.Label>
                  <Form.Control
                    type="date"
                    value={maxDateValue}
                    onChange={HandleMaxDateValueChanged}
                  />
                  <Form.Range
                    min={minDate && minDate.getTime()}
                    max={maxDate && maxDate.getTime()}
                    value={GetTimeFromTextDateParsed(maxDateValue)}
                    onChange={HandleMaxDateRangeValueChanged}
                  />
                </Col>

                <Button onClick={HandleFilterDateClick}>Appliquer</Button>
              </div>
            </Tab>
          )}
          {/* Num max min */}
          {!_arrayVal.some(isNaN) && _headerToApply.filter.isRange && (
            <Tab title="Seuils" eventKey={"isRange"}>
              <div id="ppvr-range">
                <Col>
                  <Form.Label>Minimum</Form.Label>
                  <Form.Control
                    type="number"
                    value={minValue}
                    onChange={HandleMinValueChanged}
                  />
                  <Form.Range
                    min={minVal}
                    max={maxVal}
                    value={minValue}
                    onChange={(e) => setMinvalue(e.target.value)}
                  />
                </Col>
                <Col>
                  <Form.Label>Maximum</Form.Label>
                  <Form.Control
                    type="number"
                    value={maxValue}
                    onChange={HandleMaxValueChanged}
                  />
                  <Form.Range
                    min={minVal}
                    max={maxVal}
                    value={maxValue}
                    onChange={(e) => setMaxValue(e.target.value)}
                  />
                </Col>

                <Button onClick={HandleFilterSeuilClick}>Appliquer</Button>
              </div>
            </Tab>
          )}
          {/* Recherche sur cette colonne */}
          {_headerToApply.filter.isSearchCol && (
            <Tab title="Recherche" eventKey={"isSearchCol"}>
              <div id="ppvr-search">
                <InputGroup className="mb-3">
                  <Form.Control
                    type="search"
                    placeholder="Recherchez..."
                    value={searchCol}
                    onChange={handleSearchOnChange}
                  />

                  <Button
                    onClick={HandleSearchOnClick}
                    variant="outline-secondary"
                    id="button-addon2"
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </Button>
                </InputGroup>
              </div>
            </Tab>
          )}

          <Tab
            title={
              <span>
                {" "}
                <OverlayTrigger
                  overlay={<Popover>Supprimer les filtres</Popover>}
                >
                  <FontAwesomeIcon
                    onClick={SupprimerFiltreColonne}
                    icon={faFilterCircleXmark}
                  />
                </OverlayTrigger>
              </span>
            }
          />
        </Tabs>
      </Popover>
    );
  };

  //#endregion

  //#endregion

  //#region Body

  /**
   *
   * @returns Le corps de la table
   */
  const TableBody = () => {
    if (!Data().length || Data().length === 0)
      return (
        <tbody>
          <tr>
            <td colSpan={props.Headers.length}>Aucune données.</td>
          </tr>
        </tbody>
      );

    let nombreAffiche = nbParPages * -1 * (pageActuelle - 1);

    return (
      <tbody>
        {Data().map((item, i) => {
          if (nombreAffiche >= nbParPages || nombreAffiche < 0) {
            nombreAffiche += 1;
            return null;
          }
          nombreAffiche += 1;

          return <TableBodyRow key={i} index={i} item={item} />;
        })}
      </tbody>
    );
  };

  /**
   *
   * @param {*} item
   * @returns Une ligne de la table
   */
  const TableBodyRow = ({ item, index }) => {
    return (
      <tr
        className={
          index === rowIndexSelected || arraySelector.includes(index)
            ? "table-presta-row-selected"
            : ""
        }
      >
        {props.Headers.map((header, i) => {
          return (
            <TableBodyCell
              key={i}
              fieldname={header.fieldname}
              value={item[header.fieldname]}
              index={index}
            />
          );
        })}
      </tr>
    );
  };

  const handleTdClick = (index, _cellToApply, item) => {
    if (_cellToApply.isSelectable) {
      setRowIndexSelected(index);
      SwitchTagMethod(_cellToApply.tagMethod, item, index);
    }
  };

  /**
   *
   * @param {*} {fieldname, value }
   * @returns Une cellule de la table
   */
  const TableBodyCell = ({ fieldname, value, index }) => {
    // Je recherche la cell a appliquer avec le même fieldname, qui contient les informations nécessaire à la création de la cellule

    const _cellToApplys = props.Cells.filter((c) => {
      return c.fieldname === fieldname;
    });

    if (_cellToApplys.length <= 0) {
      return <td></td>;
    }
    return _cellToApplys.map((_cellToApply, i) => {
      return (
        <TableBodyCellBody
          key={i}
          _cellToApply={_cellToApply}
          value={value}
          index={index}
        />
      );
    });
  };

  const TableBodyCellBody = ({ _cellToApply, value, index }) => {
    let _textFinal = value;

    //Marquage par l'editor
    _textFinal = _cellToApply.editor
      ? _cellToApply.editor(_textFinal)
      : _textFinal;

    //Marquage en <mark></mark>
    _textFinal = _cellToApply.isSearchable
      ? HighlightTextIfSearch(_textFinal)
      : _textFinal;

    // Marquage en h1
    _textFinal = _cellToApply.isH1 ? <h1> {_textFinal} </h1> : _textFinal;

    return (
      <td
        style={_cellToApply.fixedWidth && { width: _cellToApply.fixedWidth }}
        onClick={() => handleTdClick(index, _cellToApply, value)}
      >
        {_textFinal}
      </td>
    );
  };

  //#endregion

  //#region Placeholder

  const PlaceHolderTableLine = ({ numberOfLines }) => {
    let _arrayLoading = [];
    for (let index = 0; index < numberOfLines; index++) {
      _arrayLoading.push(index + 1);
    }
    return _arrayLoading.map((i) => {
      return (
        <tbody key={i}>
          <tr>
            <td colSpan={props.Headers.length}>
              <Placeholder as="p" animation="glow">
                <Placeholder xs={12} />
              </Placeholder>
            </td>
          </tr>
        </tbody>
      );
    });
  };

  //#endregion

  //#region Pagination

  const TablePagination = () => {
    let _items = [];

    let _lData = Data();
    let _limiter = _lData.length;
    let _isEllipsisNedded = _limiter / nbParPages + 1 > 10;

    _items.push(
      <Pagination.Prev
        key={0}
        onClick={() => handlePagePrev()}
        className="m-1"
      />
    );

    const maxLoop = Math.ceil(_limiter / nbParPages);
    // for (let number = 1; number <= _limiter / nbParPages + 1; number++) {
    for (let number = 1; number <= maxLoop; number++) {
      if (_isEllipsisNedded) {
        if (number === 1) {
          // 1
          _items.push(
            <Pagination.Item
              key={number}
              active={number === pageActuelle}
              onClick={() => handlePageChange(number)}
              className="m-1"
            >
              {number}
            </Pagination.Item>
          );

          if (pageActuelle === 1) {
            //x + 1
            if (number + 1 < _limiter / nbParPages + 1) {
              _items.push(
                <Pagination.Item
                  key={number + 1}
                  active={number + 1 === pageActuelle}
                  onClick={() => handlePageChange(number + 1)}
                  className="m-1"
                >
                  {number + 1}
                </Pagination.Item>
              );
            }

            //x + 2
            if (number + 2 < _limiter / nbParPages + 1) {
              _items.push(
                <Pagination.Item
                  key={number + 2}
                  active={number + 2 === pageActuelle}
                  onClick={() => handlePageChange(number + 2)}
                  className="m-1"
                >
                  {number + 2}
                </Pagination.Item>
              );
            }

            //Elispsis
            if (number + 3 < _limiter / nbParPages + 1) {
              _items.push(
                <Pagination.Ellipsis className="m-1" key={number + 3} />
              );
            }
            continue;
          }
        }

        if (number + 1 > _limiter / nbParPages + 1) {
          if (pageActuelle === number) {
            //Elipsis
            if (number - 3 > 1) {
              _items.push(
                <Pagination.Ellipsis className="m-1" key={number - 3} />
              );
            }

            //x - 2
            if (number - 2 > 1) {
              _items.push(
                <Pagination.Item
                  key={number - 2}
                  active={number - 2 === pageActuelle}
                  onClick={() => handlePageChange(number - 2)}
                  className="m-1"
                >
                  {number - 2}
                </Pagination.Item>
              );
            }

            // x - 1
            if (number - 1 > 1) {
              _items.push(
                <Pagination.Item
                  key={number - 1}
                  active={number - 1 === pageActuelle}
                  onClick={() => handlePageChange(number - 1)}
                  className="m-1"
                >
                  {number - 1}
                </Pagination.Item>
              );
            }
          }

          _items.push(
            <Pagination.Item
              key={number}
              active={number === pageActuelle}
              onClick={() => handlePageChange(number)}
              className="m-1"
            >
              {number}
            </Pagination.Item>
          );
          continue;
        }

        if (number === pageActuelle) {
          //Elipsis
          if (number - 3 > 1) {
            _items.push(
              <Pagination.Ellipsis className="m-1" key={number - 3} />
            );
          }

          //x - 2
          if (number - 2 > 1) {
            _items.push(
              <Pagination.Item
                key={number - 2}
                active={number - 2 === pageActuelle}
                onClick={() => handlePageChange(number - 2)}
                className="m-1"
              >
                {number - 2}
              </Pagination.Item>
            );
          }

          // x - 1
          if (number - 1 > 1) {
            _items.push(
              <Pagination.Item
                key={number - 1}
                active={number - 1 === pageActuelle}
                onClick={() => handlePageChange(number - 1)}
                className="m-1"
              >
                {number - 1}
              </Pagination.Item>
            );
          }

          //x
          _items.push(
            <Pagination.Item
              key={number}
              active={number === pageActuelle}
              onClick={() => handlePageChange(number)}
              className="m-1"
            >
              {number}
            </Pagination.Item>
          );

          //x + 1
          if (number + 1 < _limiter / nbParPages) {
            _items.push(
              <Pagination.Item
                key={number + 1}
                active={number + 1 === pageActuelle}
                onClick={() => handlePageChange(number + 1)}
                className="m-1"
              >
                {number + 1}
              </Pagination.Item>
            );
          }

          //x + 2
          if (number + 2 < _limiter / nbParPages) {
            _items.push(
              <Pagination.Item
                key={number + 2}
                active={number + 2 === pageActuelle}
                onClick={() => handlePageChange(number + 2)}
                className="m-1"
              >
                {number + 2}
              </Pagination.Item>
            );
          }

          //Elispsis
          if (number + 3 < _limiter / nbParPages) {
            _items.push(
              <Pagination.Ellipsis className="m-1" key={number + 3} />
            );
          }

          continue;
        }
      } else {
        _items.push(
          <Pagination.Item
            key={number}
            active={number === pageActuelle}
            onClick={() => handlePageChange(number)}
            className="m-1"
          >
            {number}
          </Pagination.Item>
        );
      }
    }

    _items.push(
      <Pagination.Next
        key={-1}
        onClick={() => handlePageNext(_limiter / nbParPages)}
        className="m-1"
      />
    );

    return (
      <Stack direction="horizontal">
        <Pagination className="m-2">{_items}</Pagination>
        <DrodpdownNbPages />
      </Stack>
    );
  };

  const DrodpdownNbPages = () => {
    return (
      <DropdownButton
        variant=""
        className="border button-periode"
        drop="down-centered"
        style={{ borderRadius: "10px" }}
        title={`${nbParPages} / page`}
      >
        <Dropdown.Item
          onClick={() => {
            setNbParPages(10);
            setPageActuelle(1);
          }}
        >
          10 / page
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setNbParPages(20);
            setPageActuelle(1);
          }}
        >
          20 / page
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setNbParPages(50);
            setPageActuelle(1);
          }}
        >
          50 / page
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setNbParPages(100);
            setPageActuelle(1);
          }}
        >
          100 / page
        </Dropdown.Item>
      </DropdownButton>
    );
  };

  //#endregion

  //#region Selection

  const SelectionInfo = () => {
    const SwitchTagSelection = async (tagMethod) => {
      switch (tagMethod) {
        case "selection_factures":
          await HandleSelectorFacture();

          break;

        default:
          break;
      }
    };

    const HandleTelechargerSelection = async () => {
      let _tagMethod = props.Cells.find(
        (c) => c.fieldname === TAGSELECTION
      ).tagMethod;
      await SwitchTagSelection(_tagMethod);
    };

    if (arraySelector.length > 0) {
      return (
        <Container>
          <Button
            onClick={HandleTelechargerSelection}
            variant="warning"
            className="border"
          >
            Télecharger {arraySelector.length} document
            {arraySelector.length > 1 && "s"}
          </Button>
        </Container>
      );
    }
    return "";
  };

  //#endregion

  //#region TopPannel

  const TopPannel = () => {
    return (
      <Row className="mb-2">
        {props.TopPannelLeftToSearch && props.TopPannelLeftToSearch}

        {props.ButtonFilters && (
          <Col className="m-1" md={"auto"}>
            <div className="project-sort-nav">
              <nav>
                <ul>
                  <ButtonFilter />
                  {props.ButtonFilters.map((filter, index) => {
                    return <ButtonFilter key={index} filter={filter} />;
                  })}
                </ul>
              </nav>
            </div>
          </Col>
        )}
        <Col className="m-1">
          <Form.Control
            type="search"
            placeholder="Rechercher"
            aria-label="Search"
            onChange={(e) => {
              handleSearch(e);
            }}
            className="noBorder"
            value={search}
          />
        </Col>
        {props.TopPannelRightToSearch && props.TopPannelRightToSearch}
        {props.Headers.findIndex((h) => h.fieldname.includes(TAGSELECTION)) >
          -1 && (
          <Col md={"auto"} className="m-1">
            <SelectionInfo />
          </Col>
        )}
      </Row>
    );
  };

  //#region Bouton filtres

  const ButtonFilter = ({ filter }) => {
    if (!filter) {
      return (
        <li
          className={btFilterActif ? "li-inactif" : "li-actif"}
          onClick={() => handleTousFilter()}
        >
          Tous
        </li>
      );
    }

    return (
      <li
        className={isFilterActive(filter) ? "li-actif" : "li-inactif"}
        onClick={() => handleFilterClick(filter)}
      >
        {filter.editor ? filter.editor(filter.value) : filter.value}
      </li>
    );
  };

  //#endregion

  //#endregion

  //#endregion

  //#endregion

  //#region SMALL

  const PlaceholderCardPrestation = (numberOfCards) => {
    let _arrayLoading = [];
    for (let index = 0; index < numberOfCards; index++) {
      _arrayLoading.push(index + 1);
    }

    return _arrayLoading.map((p) => {
      return (
        <Card className="m-2" key={p}>
          <Card.Title>
            <Col>
              <Placeholder as="p" animation="glow">
                <Placeholder xs={6} />
              </Placeholder>
            </Col>
          </Card.Title>
          <Card.Subtitle>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={4} />
            </Placeholder>
          </Card.Subtitle>

          <Card.Body>
            <h6>
              <Placeholder as="p" animation="glow">
                <Placeholder xs={6} />
              </Placeholder>
            </h6>
            <h6>
              <Placeholder as="p" animation="glow">
                <Placeholder xs={6} />
              </Placeholder>
            </h6>
            <h6>
              <Placeholder as="p" animation="glow">
                <Placeholder xs={6} />
              </Placeholder>
            </h6>
          </Card.Body>
        </Card>
      );
    });
  };

  const GridCards = () => {
    if (!props.IsLoaded)
      return PlaceholderCardPrestation(
        props.placeholdeNbLine ? props.placeholdeNbLine : 5
      );

    let nombreAffiche = nbParPages * -1 * (pageActuelle - 1);
    return (
      <div>
        {Data().map((item, index) => {
          if (nombreAffiche >= nbParPages || nombreAffiche < 0) {
            nombreAffiche += 1;
            return null;
          }
          nombreAffiche += 1;
          return (
            <div key={index}>
              <GridCard item={item.unboundColonne} />
            </div>
          );
        })}
      </div>
    );
  };

  const GridCard = ({ item }) => {
    return (
      <Card className="m-2">
        <GridCardHeader item={item} />
        <GridCardBody item={item} />
      </Card>
    );
  };

  const GridCardHeader = ({ item }) => {
    return (
      <>
        <Card.Title>{props.CardModel.header.title.editor(item)}</Card.Title>
        <Card.Subtitle>
          {props.CardModel.header.subtitle.editor &&
            props.CardModel.header.subtitle.editor(item)}
        </Card.Subtitle>
      </>
    );
  };

  const GridCardBody = ({ item }) => {
    return <Card.Body>{props.CardModel.body.editor(item)}</Card.Body>;
  };

  //#endregion

  //#region Specifique

  const ModalList = () => {
    return (
      <span>
        {PrestaCtx && (
          <span>
            <ModalListeTaches />
            <ModalDocuments />
          </span>
        )}
      </span>
    );
  };

  const SwitchTagMethod = (tagMethod, item, index) => {
    switch (tagMethod) {
      case "tagListeTaches":
        HandleShowModalListeTaches(item);
        break;
      case "tagListeDocuments":
        HandleAfficherDocuments(item);
        break;
      case "tagInterventionDocuments":
        HandleAfficherFacture(Data()[index]);
        break;
      default:
        if (tagMethod.includes("selection_")) {
          let _arrSelector = JSON.parse(JSON.stringify(arraySelector));

          if (_arrSelector.includes(index)) {
            _arrSelector = _arrSelector.filter((s) => s !== index);
          } else {
            _arrSelector.push(index);
          }
          if (!_arrSelector) {
            _arrSelector = [];
          }
          setArraySelector(_arrSelector);
        }
        break;
    }
  };

  //#region Prestation contrat

  const PrestaCtx = useContext(PrestaContext);

  //#region Liste des taches
  const [showModalListeTaches, setShowModalListeTaches] = useState(false);
  const [isLoadingTaches, setIsLoadingTaches] = useState(false);
  const [listeTaches, setListeTaches] = useState([]);

  const HandleShowModalListeTaches = async (presta) => {
    //Récupère les données
    if (isLoadingTaches) return;
    setIsLoadingTaches(true);
    setShowModalListeTaches(true);

    await GetPrestationReleveTache(
      tokenCt,
      presta.IdPrestationContrat,
      FetchSetListeTache
    );
  };

  const FetchSetListeTache = (data) => {
    const groups = data.reduce((groups, item) => {
      const k = groups[item.k] || [];
      k.push(item);
      groups[item.k] = k;
      return groups;
    }, {});

    const arr = [];
    Object.keys(groups).forEach((key) =>
      arr.push({ name: key, value: groups[key] })
    );

    setListeTaches(arr);
    setShowModalListeTaches(true);
    setIsLoadingTaches(false);
  };

  const ModalListeTaches = () => {
    const CardListeTachesBodyL = () => {
      if (isLoadingTaches)
        return (
          <Placeholder animation="glow">
            <Placeholder xs={12} />
          </Placeholder>
        );
      if (listeTaches.length === 0) return <div>Aucune tâche enregistrée</div>;

      let _body = (
        <div>
          {listeTaches.map((Relevetache, index) => {
            return (
              <span key={index} className="mb-2">
                <Row>
                  <Col>
                    <FontAwesomeIcon icon={faList} /> {Relevetache.name}
                  </Col>
                </Row>

                {true &&
                  Relevetache.value.map((tache, indexT) => {
                    return (
                      <Row key={indexT}>
                        <Col md={{ offset: 1 }}>
                          <Form.Check
                            readOnly
                            checked={false}
                            label={tache.v}
                          />
                        </Col>
                      </Row>
                    );
                  })}
              </span>
            );
          })}
        </div>
      );

      return _body;
    };

    return (
      <Modal
        dialogClassName="modal-90w"
        show={showModalListeTaches || PrestaCtx.showModalTaches}
        onHide={() => {
          setShowModalListeTaches(false);
          PrestaCtx.setShowModalTache(false);
        }}
        backdrop="static"
        keyboard={false}
        animation={false}
      >
        <Modal.Header>
          <Modal.Title> Liste des relevés de tâches </Modal.Title>
          <Button
            variant="danger"
            onClick={() => setShowModalListeTaches(false)}
          >
            {" "}
            X{" "}
          </Button>
        </Modal.Header>
        <Modal.Body>
          <CardListeTachesBodyL />
        </Modal.Body>
      </Modal>
    );
  };

  //#endregion

  useEffect(() => {
    if (PrestaCtx) {
      if (PrestaCtx.showModalTaches) {
        HandleShowModalListeTaches(PrestaCtx.prestaSelected);
      }
    }
    // eslint-disable-next-line
  }, [PrestaCtx && PrestaCtx.showModalTaches]);

  useEffect(() => {
    if (PrestaCtx) {
      if (PrestaCtx.showModalDoc) {
        HandleAfficherDocuments(PrestaCtx.prestaSelected);
      }
    }
    // eslint-disable-next-line
  }, [PrestaCtx && PrestaCtx.showModalDoc]);

  //#region Documents

  const [documents, setDocuments] = useState([]);
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
  const [gridColMDValue, setGridColMDValue] = useState(12);

  const CardDocs = () => {
    // const _arrayDocs = JSON.parse(JSON.stringify(documents));
    const _arrayDocs = documents;

    return (
      <Card className="mb-2">
        <Card.Header className="card-document">
          <Row>
            <Col md={"auto"}>
              Documents{" "}
              {isDocumentLoaded ? (
                `(${
                  _arrayDocs.length > 1
                    ? _arrayDocs.length - 1
                    : _arrayDocs.length
                })`
              ) : (
                <Placeholder animation="glow">
                  <Placeholder xs={1} />
                </Placeholder>
              )}
            </Col>

            <Col style={{ textAlign: "end" }}>
              <CloseButton
                onClick={() => {
                  setGridColMDValue(12);
                }}
                // className="ms-4"
              />
            </Col>
          </Row>
        </Card.Header>
        {isDocumentLoaded ? (
          <Card.Body>
            <div id="collapse-listeDocuments">
              {_arrayDocs.length > 0
                ? _arrayDocs.map((doc, index) => {
                    return (
                      <RowDocument key={index} props={doc} index={index} />
                    );
                  })
                : "Aucun document."}
            </div>
          </Card.Body>
        ) : (
          <Card.Body>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={5} />
            </Placeholder>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={5} />
            </Placeholder>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={5} />
            </Placeholder>
          </Card.Body>
        )}
      </Card>
    );
  };

  const CreatePropsDocPresta = (element) => {
    const _obj = {};

    _obj.title = element.k;
    _obj.extension = element.k.split(".").pop();

    _obj.VoirDocumentSup = () => GetMethodFetchDataDocumentPresta(element.v);

    _obj.TelechargerDocumentSup = () =>
      GetMethodFetchDataDocumentPresta(element.v, true);

    _obj.data = element;

    return _obj;
  };

  const GetMethodFetchDataDocumentPresta = async (
    v,
    telecharger,
    returnData
  ) => {
    const splitPop = v.split("|").pop();
    const splitShift = v.split("|").shift();
    switch (splitPop) {
      case "CERFA":
        return await GetDocumentPrestationCERFA(
          tokenCt,
          splitShift,
          telecharger,
          returnData
        );
      case "RAPPORT":
        return await GetDocumentPrestationRapport(
          tokenCt,
          splitShift,
          telecharger,
          returnData
        );
      case "TICKET":
        return await GetDocumentPrestationTicket(
          tokenCt,
          splitShift,
          telecharger,
          returnData
        );
      case "EXTRANET":
        return await GetDocumentPrestationExtranet(
          tokenCt,
          splitShift,
          telecharger,
          returnData
        );
      default:
        break;
    }
  };

  const CreatePropsDocPrestaZIP = async (_arrDocT, presta) => {
    const _obj = {};
    _obj.title = "Tous les documents";
    _obj.extension = "zip";

    const TelechargerZIPSup = async (presta) => {
      let _arrDocs = [];
      let _targetWindow = window.open("/waiting");

      for (let index = 0; index < _arrDocT.length; index++) {
        const element = _arrDocT[index];

        let _kv = await GetMethodFetchDataDocumentPresta(
          element.data.v,
          false,
          true
        );
        if (_kv) {
          _arrDocs.push([_kv.v, _kv.k]);
        }
      }

      await TelechargerZIP(
        _arrDocs,
        `Documents PC${presta.IdPrestationContrat}_${presta.DateInterventionPrestationTrimed}`
      );
      _targetWindow.close();
    };

    _obj.TelechargerDocumentSup = () => TelechargerZIPSup(presta);

    return _obj;
  };

  const FetchSetDocuments = async (data, presta) => {
    let _arrDocs = [];

    const arrData = JSON.parse(data);

    if (arrData.length) {
      for (let index = 0; index < arrData.length; index++) {
        const element = arrData[index];
        _arrDocs.push(CreatePropsDocPresta(element));
      }
    } else {
      _arrDocs.push(CreatePropsDocPresta(arrData));
    }

    if (_arrDocs.length > 1) {
      let tempDocs = [];
      tempDocs.push(await CreatePropsDocPrestaZIP(_arrDocs, presta));
      _arrDocs = [...tempDocs, ..._arrDocs];
    }

    setDocuments(_arrDocs);
    setIsDocumentLoaded(true);
    setGridColMDValue(10);
  };

  const HandleAfficherDocuments = async (presta) => {
    if (presta.IdDossierIntervention > 0 && presta.IdEtat === 96) {
      setGridColMDValue(10);
      setIsDocumentLoaded(false);

      await GetDocumentPrestation(
        tokenCt,
        presta.IdDossierIntervention,
        FetchSetDocuments,
        presta
      );
    } else {
      setGridColMDValue(12);
    }
  };

  const ModalDocuments = () => {
    let _DocZIP = {
      title: "Tous les documents",
      extension: "zip",
      size: " ",
    };

    const _arrayDocs = JSON.parse(JSON.stringify(documents));

    return (
      <Modal
        dialogClassName="modal-90w"
        show={PrestaCtx.showModalDoc}
        onHide={() => {
          PrestaCtx.setShowModalDoc(false);
        }}
        backdrop="static"
        keyboard={false}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Documents
            {isDocumentLoaded ? (
              `(${_arrayDocs.length})`
            ) : (
              <Placeholder animation="glow">
                <Placeholder xs={1} />
              </Placeholder>
            )}
          </Modal.Title>
        </Modal.Header>
        {isDocumentLoaded ? (
          <Modal.Body>
            <div id="collapse-listeDocuments">
              {_arrayDocs.length > 0 ? (
                <RowDocument props={_DocZIP} />
              ) : (
                "Aucun document"
              )}

              {_arrayDocs.map((doc, index) => {
                return <RowDocument key={index} props={doc} index={index} />;
              })}
            </div>
          </Modal.Body>
        ) : (
          <Modal.Body>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={5} />
            </Placeholder>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={5} />
            </Placeholder>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={5} />
            </Placeholder>
          </Modal.Body>
        )}
      </Modal>
    );
  };

  //#endregion

  //#endregion

  //#region Factures
  const HandleSelectorFacture = async () => {
    let _arrayOfFactures = [];

    for (let index = 0; index < arraySelector.length; index++) {
      const element = arraySelector[index];
      _arrayOfFactures.push(Data()[element]);
    }

    //Création du fichier ZIP
    let _targetWindow = window.open("/waiting");

    const CreateArrayZIP = async () => {
      let _arrDocs = [];

      for (let index = 0; index < _arrayOfFactures.length; index++) {
        const facture = _arrayOfFactures[index];
        let _kv = await VoirFactureDocument(
          tokenCt,
          facture.IdFacture,
          facture.Type,
          facture.Avoir,
          true
        );
        if (_kv) {
          _arrDocs.push([_kv.v, _kv.k]);
        }
      }

      return _arrDocs;
    };

    let _arrDocs = await CreateArrayZIP();
    const _date = new Date();
    await TelechargerZIP(
      _arrDocs,
      `${_date.toLocaleDateString("fr-FR").replace(/\//g, "-")}_${
        _arrDocs.length
      }_factures`
    );
    _targetWindow.close();
  };

  //#endregion

  //#region Intervention

  const CreatePropsDocumentInterventionFI = (element) => {
    const _obj = {};
    _obj.title = `${element.k}`;
    _obj.extension = "pdf";

    _obj.VoirDocumentSup = () => {
      GetDocumentFISAV(tokenCt, element.v);
    };
    _obj.TelechargerDocumentSup = () => {
      GetDocumentFISAV(tokenCt, element.v, true);
    };
    _obj.data = element;
    return _obj;
  };

  const CreatePropsDocumentInterventionFacture = (element) => {
    const _obj = {};

    _obj.title = `${element.k}`;
    _obj.extension = "pdf";

    _obj.VoirDocumentSup = () => {
      VoirFactureDocument(tokenCt, element.v, "Facture SAV", false);
    };

    _obj.TelechargerDocumentSup = () => {
      TelechargerFactureDocument(tokenCt, element.v, "Facture SAV", false);
    };
    _obj.data = element;
    return _obj;
  };

  const CreatePropsDocumentInterventionZIP = (_arrDocsFI, _arrDocsFA) => {
    const _obj = {};
    _obj.title = "Tous les documents";
    _obj.extension = "zip";

    const TelechargerZIPSup = async (IdDossierInterventionSAV) => {
      let _arrDocs = [];
      let _targetWindow = window.open("/waiting");

      for (let index = 0; index < _arrDocsFI.length; index++) {
        const element = _arrDocsFI[index];
        const _kv = await GetDocumentFISAV(
          tokenCt,
          element.data.v,
          false,
          true
        );
        const _arrDocFI = [_kv.v, _kv.k];
        _arrDocs.push(_arrDocFI);
      }

      for (let index = 0; index < _arrDocsFA.length; index++) {
        const element = _arrDocsFA[index];
        const _kv = await VoirFactureDocument(
          tokenCt,
          element.data.v,
          "Facture SAV",
          false,
          true
        );
        const _arrDocFA = [_kv.v, _kv.k];

        _arrDocs.push(_arrDocFA);
      }
      await TelechargerZIP(
        _arrDocs,
        `Intervention N° ${IdDossierInterventionSAV}`
      );
      _targetWindow.close();
    };

    _obj.TelechargerDocumentSup = TelechargerZIPSup;

    return _obj;
  };

  const GetListeDocIntervention = async (IdDossierInterventionSAV) => {
    setIsDocumentLoaded(false);

    let _arrDocs = [];

    let _arrFI = [];
    let _arrFA = [];
    // 2 - Set les FI
    const FetchSetDataFIPart = (data) => {
      if (data.length) {
        //Il y a plusieurs FI
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          const _obj = CreatePropsDocumentInterventionFI(element);
          _arrFI.push(_obj);
        }
      } else if (data.k) {
        const _obj = CreatePropsDocumentInterventionFI(data);

        _arrFI.push(_obj);
      }
    };

    //4 - Set les factures
    const FetchSetDataFacturePart = (data) => {
      if (data.length) {
        //Il y a plusieurs factures
        for (let index = 0; index < data.length; index++) {
          const element = data[index];

          const _obj = CreatePropsDocumentInterventionFacture(element);

          _arrFA.push(_obj);
        }
      } else if (data.k) {
        const _obj = CreatePropsDocumentInterventionFacture(JSON.parse(data));

        _arrFA.push(_obj);
      }

      if (_arrFA.length + _arrFI.length > 1) {
        _arrDocs.push(
          CreatePropsDocumentInterventionZIP(
            _arrFI,
            _arrFA,
            IdDossierInterventionSAV
          )
        );
      }

      _arrDocs = [..._arrDocs, ..._arrFI, ..._arrFA];

      setDocuments(_arrDocs);
      setIsDocumentLoaded(true);
    };

    //1 - Demande les FI
    GetListeFIIntervention(
      tokenCt,
      IdDossierInterventionSAV,
      FetchSetDataFIPart
    );

    //3 - Demande les factures
    GeTListeFactureIntervention(
      tokenCt,
      IdDossierInterventionSAV,
      FetchSetDataFacturePart
    );
  };

  const HandleAfficherFacture = (inter) => {
    if (inter) {
      setDocuments([]);
      setGridColMDValue(10);
      //LoadFacture,AffichageFacture comme documeuent
      GetListeDocIntervention(inter.IdDossierInterventionSAV);
    } else {
      setGridColMDValue(12);
    }
  };

  //#endregion

  //#endregion

  return (
    <BreakpointProvider>
      {TopPannel()}
      <Container fluid className="container-table p-4 ">
        <ModalList />
        <Breakpoint large up>
          <Row>
            <Col>
              <Table className="table-presta">
                <TableHeaders />
                {props.IsLoaded ? (
                  <TableBody />
                ) : (
                  <PlaceHolderTableLine
                    numberOfLines={
                      props.placeholdeNbLine ? props.placeholdeNbLine : 5
                    }
                  />
                )}
              </Table>
            </Col>

            {gridColMDValue !== 12 && <Col md={"auto"}>{CardDocs()}</Col>}
          </Row>
        </Breakpoint>

        <Breakpoint medium down>
          <GridCards />
        </Breakpoint>
        <Row>{props.Pagination && <Col>{TablePagination()}</Col>}</Row>
      </Container>
    </BreakpointProvider>
  );
};

export default TableData;

//#region Editor commun

export const EditorMontant = (data) => {
  try {
    return `${new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(data)}`;
  } catch (error) {
    return `${data} €`;
  }
};

export const EditorDateFromDateTime = (data) => {
  let dateRegex = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/;
  let _match = RegexTestAndReturnMatch(data, dateRegex);
  if (_match !== data) {
    return _match;
  }
  dateRegex = /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}/;
  _match = RegexTestAndReturnMatch(data, dateRegex);
  if (_match !== data) {
    return _match;
  }

  return data;
};

export const EditorActionVoir = (e) => {
  return (
    <Button variant="">
      <OverlayTrigger placement="bottom" overlay={<Tooltip>Voir</Tooltip>}>
        <FontAwesomeIcon icon={faEye} />
      </OverlayTrigger>
    </Button>
  );
};

export const EditorActionTelecharger = (e) => {
  return (
    <Button variant="">
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip>Télécharger</Tooltip>}
      >
        <FontAwesomeIcon icon={faDownload} />
      </OverlayTrigger>
    </Button>
  );
};

const CreateEditorDocument = (
  methodTitle,
  extension,
  methodTelecharger,
  methodVoir
) => {
  const EditorDocument = (e) => {
    const _obj = {};
    _obj.title = methodTitle(e);
    _obj.extension = extension;
    methodVoir && (_obj.VoirDocumentSup = () => methodVoir(e));
    methodTelecharger &&
      (_obj.TelechargerDocumentSup = () => methodTelecharger(e));

    return <RowDocument props={_obj} />;
  };
  return EditorDocument;
};

const EditorSelection = (e) => {
  return <Form.Check defaultChecked={e} />;
};

//#endregion

//#region Helpers

export const CreateNewHeader = (fieldname, filter, caption, editor) => {
  let _header = {
    fieldname: fieldname,
    filter: filter,
    caption: caption,
    editor: editor,
  };
  return _header;
};

export const CreateFilter = (
  isFilter,
  isCheckbox,
  isRange,
  isSearchCol,
  isRangeDate
) => {
  return {
    isFilter: isFilter,
    isCheckbox: isCheckbox,
    isRange: isRange,
    isSearchCol: isSearchCol,
    isRangeDate: isRangeDate,
  };
};

export const CreateNewCell = (
  fieldname,
  isH1,
  isSearchable,
  isSelectable,
  editor,
  tagMethod
) => {
  let _cell = {
    fieldname: fieldname,
    isH1: isH1,
    isSearchable: isSearchable,
    isSelectable: isSelectable,
    editor: editor,
    tagMethod: tagMethod,
  };
  return _cell;
};

export const CreateNewUnboundHeader = (filter, caption, tagMethod) => {
  let _header = {
    fieldname: "unboundColonne",
    filter: filter,
    caption: caption,
    tagMethod: tagMethod,
  };
  return _header;
};

export const CreateNewUnboundCell = (
  isH1,
  isSearchable,
  isSelectable,
  editor,
  tagMethod
) => {
  let _cell = {
    fieldname: "unboundColonne",
    isH1: isH1,
    isSearchable: isSearchable,
    isSelectable: isSelectable,
    editor: editor,
    tagMethod: tagMethod,
  };
  return _cell;
};

export const CreateNewDocumentCell = (
  methodTitle,
  extension,
  methodTelecharger,
  methodVoir
) => {
  let _cell = CreateNewUnboundCell(
    false,
    false,
    false,
    CreateEditorDocument(methodTitle, extension, methodTelecharger, methodVoir)
  );

  return _cell;
};

export const CreateNewHeaderSelector = (tagMethod) => {
  return CreateNewHeader(TAGSELECTION, false, "Selection", EditorSelection);
};

export const CreateNewCellSelector = (tagMethod) => {
  return CreateNewCell(
    TAGSELECTION,
    false,
    false,
    true,
    EditorSelection,
    `selection_${tagMethod}`
  );
};

export const CreateNewButtonFilter = (fieldname, value, editor) => {
  let _btFilter = { fieldname: fieldname, value: value, editor: editor };
  return _btFilter;
};

export const CreateNewCardModel = (CardBody, CardTitle, CardSubtitle) => {
  let _obj = {
    header: {
      title: {
        fieldname: "unboundColonne",
        editor: CardTitle,
      },
      subtitle: {
        fieldname: "unboundColonne",
        editor: CardSubtitle,
      },
    },
    body: {
      fieldname: "unboundColonne",
      editor: CardBody,
    },
  };
  return _obj;
};

//#endregion
