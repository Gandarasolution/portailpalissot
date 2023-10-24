import { useContext} from "react";
import { ViewerContext } from "../../App";
import { Image } from "react-bootstrap";

const ViewerImagePage = () => {
const viewerCt = useContext(ViewerContext);


const url =  viewerCt.viewerURL;

viewerCt.removeViewer();
return (
    <div>
      <Image src={url}/>
    </div>
  );
};


export default ViewerImagePage;
