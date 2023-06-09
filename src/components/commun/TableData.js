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
import Stack from "react-bootstrap/Stack";

//#endregion
import { groupBy } from "../../functions";
//#region fontAwsome
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
//#endregion

//#endregion

const TableData = (props) => {
  //#region States

  const [nbParPages, setNbParPages] = useState(10);
  const [pageActuelle, setPageActuelle] = useState(1);


  //#endregion

  //#region Fonctions

  const reactStringReplace = require("react-string-replace");
  function HighlightTextIfSearch(text) {
    if (
      String(props.search).length > 0 &&
      String(text).toUpperCase().includes(String(props.search).toUpperCase())
    ) {
      return (
        <span>
          {reactStringReplace(text, props.search, (match, i) => (
            <mark key={i}>{match}</mark>
          ))}
        </span>
      );
    } else {
      return text;
    }
  }

  //#endregion

  //#region Events

  //#region Pagination
  const handlePagePrev = () => {
    if (pageActuelle > 1) {
      setPageActuelle(pageActuelle - 1);
      props.methodPagination && props.methodPagination();
    }
  };

  const handlePageChange = (number) => {
    setPageActuelle(number);
    props.methodPagination && props.methodPagination();
  };

  const handlePageNext = (number) => {
    if (pageActuelle < number) {
      setPageActuelle(pageActuelle + 1);
      props.methodPagination && props.methodPagination();
    }
  };
  //#endregion

  //#endregion

  //#region Component

  //#region Header

  /**
   * Map les props.header pour créer l'entête de la table
   * @returns Les headers de la table
   */
  const TableHead = () => {
    return (
      <thead className="m-2">
        <tr>
          {props.headers.map((header, index) => {
            return header.filter && props.IsLoaded ? (
              <th key={index}  >{HeaderCellWithFilter(header)} </th>
            ) : (
              HeaderCell(index, header)
            );
          })}
        </tr>
      </thead>
    );
  };

  /**
   *
   * @param {int} index L'index pour la clée
   * @param {Object} header La donnée du header
   * @returns Une cellule d'entête simple
   */
  const HeaderCell = (index, header) => {
    return (
      <th key={index}>
        <div>{header.title}</div>
      </th>
    );
  };

  /**
   *
   * @param {Object} header La donnée du header
   * @returns Une cellule d'entête avec un filtre.
   */
  const HeaderCellWithFilter = (header) => {
    let _arFilters = [];
    let _lData = props.rawData;

    _arFilters = Object.entries(groupBy(_lData, header.filter.fieldname));

    return (
      <div>
        {header.title}
        <OverlayTrigger
          trigger="click"
          rootClose
          overlay={
            <Popover className="popover-filters"  >
              {_arFilters.map((item, index) => {
                if (item[0] === "undefined") return null;
                return (
                  <Form.Check
                    type="checkbox"
                    checked={props.isFiltercheckboxShouldBeCheck(
                      header.filter.fieldname,
                      item[0]
                    )}
                    label={`${
                      header.filter.affichageMethod !== undefined
                        ? header.filter.affichageMethod(item[0])
                        : item[0]
                    }`}
                    key={index}
                    onChange={(e) =>
                      props.handleCheckfilterChange(
                        e.target.checked,
                        header.filter.fieldname,
                        item[0]
                      )
                    }
                  />
                );
              })}
            </Popover>
          }
          placement="bottom"
        >
          <FontAwesomeIcon
            icon={faFilter}
            className={`icon-bt ${
              (props.isButtonShouldBeCheck && props.isButtonShouldBeCheck(header.filter.fieldname)) &&
              "filter-actif"
            } `}
          />
        </OverlayTrigger>
      </div>
    );
  };

  //#endregion

  //#region Body
  const TableBody = () => {
    let nombreAffiche = nbParPages * -1 * (pageActuelle - 1);
    return props.lData.map((arr, index) => {
      if (nombreAffiche >= nbParPages || nombreAffiche < 0) {
        nombreAffiche += 1;
        return null;
      }
      nombreAffiche += 1;
      return (
        <tr
          key={index}
          className={
            props.isRowActive(arr.data) ? "table-presta-row-selected" : ""
          }
        >
          {arr.cells.map((item, indexCell) => {
            return BodyCell(item, indexCell, arr.data);
          })}
        </tr>
      );
    });
  };

  const BodyCell = (item, index, data) => {
    let _spanText = item.isSearchable ? (
      <span>{HighlightTextIfSearch(item.text)}</span>
    ) : (
      <span>{item.text}</span>
    );

    let _cellText = item.isH1 ? <h1>{_spanText}</h1> : _spanText;

    if (item.onClickMethod) {
      return (
        <td key={index} onClick={() => item.onClickMethod(data)} style={item.fixedWidth && {width: item.fixedWidth}}  >
          {_cellText}
        </td>
      );
    }

    return <td key={index} style={item.fixedWidth && {width: item.fixedWidth}} >{_cellText}</td>;
  };

  //#endregion

  //#region Placeholder

  const PlaceHolderTableLine = (numberOfLines) => {
    let _arrayLoading = [];
    for (let index = 0; index < numberOfLines; index++) {
      _arrayLoading.push(index + 1);
    }
    return _arrayLoading.map((i) => {
      return (
        <tbody key={i}>
          <tr>
            <td colSpan={props.headers.length}>
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

  const PaginationTable = () => {
    let _items = [];

    let _lPrestation = props.lData;
    let _limiter = _lPrestation.length;

    _items.push(
      <Pagination.Prev
        key={0}
        onClick={() => handlePagePrev()}
        className="m-1"
      />
    );
    for (let number = 1; number <= _limiter / nbParPages + 1; number++) {
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
    _items.push(
      <Pagination.Next
        key={_items.length + 1}
        onClick={() => handlePageNext(_limiter / nbParPages)}
        className="m-1"
      />
    );

    return (
      <Stack direction="horizontal">
        <Pagination className="m-2">{_items}</Pagination>
        {DrodpdownNbPages()}
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

  //#endregion
  return (
    <span>
      <Table className="table-presta ">
        {TableHead()}
        {props.IsLoaded ? (
          <tbody>{TableBody()}</tbody>
        ) : (
          PlaceHolderTableLine(
            props.placeholdeNbLine ? props.placeholdeNbLine : 5
          )
        )}
      </Table>
      {props.Pagination && PaginationTable()}
    </span>
  );
};

export default TableData;
