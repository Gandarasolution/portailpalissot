import { Button, Form } from "react-bootstrap";
import { VoirDocument } from "../../axios/WSGandara";

const PageTest = () => {


  const handleClick = async () => {

const b64 = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADdcAAA3XAUIom3gAAAGMSURBVFhHrZa/MgRBEMa7d7kTCCSIRJ5B4O/xAiIll4gU5UkUJZLIlcgLcHVVKJ5BJCMRCDh2W+9dJ+b2Zntm+le1Nd+30Te9O98uQiR0BTnNt3osy6zTXxveDSeTNRiaa20j4DJfq3IriugAgHAsKomoAOXdxBLvfF1sEpETyE12XxEcoOxOLfCyM3TpREyADhBhUkwyQQHoFqZ52R86G8IC5O09Lo4ZsSaoA1TFAyUdiTVDH6AqHsRFsWboH4FR8biovgWD4sH8SWwQBPTA34oVsSMoJ5BQPASzomppDJBcPBmeiapFMYH44iGADyy+L8XW4g1gUDwXuAWfomvxB0goHiL44Xf8XOxY/I+gpENRMVxnna9X0WPxB0B4FxVBcSLCS/Q/YQV12/yejcJnv8dnf0OsF8UpiIBAtfsK8wBE9IJv/RuxjdhPIMNT3IVCXCOmATTF42I9gcbicTELoC0eF8sJqIrHxTCArnhcTAIMimfz91lsEDYTCCgel6QAXDr3vPvHkOL5D8AfLmZpPx4yoPQAAAAASUVORK5CYII=";

    const name = "2023-7-5ProjetLots_1.png";
    VoirDocument(b64, name);

  };

  return (
    <div>
      <Button onClick={handleClick}>Click</Button>*

      <Form.Control
                  type="date"
                  value={"2007-01-06"}
                  // onChange={HandleMinDateValueChanged}
                />

    </div>
  );
};

export default PageTest;
