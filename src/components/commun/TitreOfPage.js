import { Col, Placeholder } from "react-bootstrap";

const TitreOfPage = ({ titre, soustitre, isLoaded }) => {
  const PlaceholderST = () => {
    return (
      <Placeholder animation="glow">
        <Placeholder xs={1} />
      </Placeholder>
    );
  };

  return (
    <Col md={12} style={{ textAlign: "start" }}>
      <span className="title">{titre} </span>
      {soustitre && (
        <span className="subtitle">
          {isLoaded ? (
            ` | ${soustitre}`
          ) : (
            <span>
              {" "}
              | <PlaceholderST />
            </span>
          )}
        </span>
      )}
    </Col>
  );
};

export default TitreOfPage;
