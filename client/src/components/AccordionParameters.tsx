import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type AccordionProps = {
  title: string;
  children: React.ReactNode;
};

const AccordionParameters: React.FC<AccordionProps> = ({ title, children }) => {
  return (
    <div style={{ boxShadow: "#e2dcdc 0px 0px 20px 0px", borderRadius: "5px" }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          {title}
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
};

export default AccordionParameters;
