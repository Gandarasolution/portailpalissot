import { GetImageExtension } from "../../functions";
import Image from "react-bootstrap/Image";

const ImageExtension = ({ extension }) => {
  return (
    <Image
      src={GetImageExtension(extension)}
      height={42}
      alt={`Icone ${extension} Crédit Dimitriy Morilubov`}
    />
  );
};

export default ImageExtension;
