import { useContext, } from "react";
import { ViewerContext } from "../../App";

const ViewerWordPage = () => {
const viewerCt = useContext(ViewerContext);


const url =  viewerCt.viewerURL;
// viewerCt.removeViewer();
return (
    <div>
      
      <iframe
      src={url}
      title="Viewer"
      >

      </iframe>

    </div>
  );
};


export default ViewerWordPage;
