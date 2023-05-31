//#region Imports

//#region Bootstrap

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
//#endregion

//#region fontAwsome
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Placeholder } from "react-bootstrap";
//#endregion

//#endregion

const TableData = (props) => {
  //#region Fonctions

  var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

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
              <th key={index}>{HeaderCellWithFilter(header)} </th>
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
          trigger={"click"}
          overlay={
            <Popover className="popover-filters">
              {_arFilters.map((item, index) => {
                if (item[0] === "undefined") return null
                return (
                  <Form.Check
                    type="checkbox"
                    checked={props.isFiltercheckboxShouldBeCheck(
                      header.filter.fieldname,
                      item[0]
                    )}
                    label={`${
                      header.filter.method !== undefined
                        ? header.filter.method(item[0])
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
          <FontAwesomeIcon icon={faFilter} className="icon-bt" />
        </OverlayTrigger>
      </div>
    );
  };

  //#endregion

  //#region Body
  const TableBody = () => {
    let nombreAffiche = props.nbParPages * -1 * (props.pageActuelle - 1);
    return props.lData.map((arr, index) => {
      if (nombreAffiche >= props.nbParPages || nombreAffiche < 0) {
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
      <span>{props.HighlightTextIfSearch(item.text)}</span>
    ) : (
      <span>{item.text}</span>
    );

    let _cellText = item.isH1 ? <h1>{_spanText}</h1> : _spanText;

    if (item.method) {
      return (
        <td key={index} onClick={() => item.method(data)}>
          {_cellText}
        </td>
      );
    }

    return <td key={index}>{_cellText}</td>;
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
      {props.Pagination && props.Pagination}
    </span>
  );
};

export default TableData;
