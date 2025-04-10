import { Viewer } from "@react-pdf-viewer/core";
import { Worker } from "@react-pdf-viewer/core";
import { useContext } from "react";
import { ViewerContext } from "../../App";

const ViewerPDFPage = () => {
const viewerCt = useContext(ViewerContext);


const url =  viewerCt.viewerURL;

// viewerCt.removeViewer();
return (
    <div>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer fileUrl={url} />
      </Worker>
    </div>
  );
};


export default ViewerPDFPage;
