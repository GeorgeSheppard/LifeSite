import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import { useState } from "react";
import { useBoolean } from "../../../hooks/use_boolean";
import { ComponentsFormData } from "./component_form_data";
import { IngredientsInputTable } from "./ingredients/ingredients_table";
import { InstructionInputList } from "./instructions/instructions_list";
import { NameRow } from "./name_row";
import { ServingsTextField } from "./servings";
import { StoreableCheckbox } from "./storeable";

export interface IComponentFormProps {
  uuid: string;
  componentFormData: ComponentsFormData;
  forceUpdate: () => void;
}

export const ComponentForm = (props: IComponentFormProps) => {
  const { componentFormData, uuid, forceUpdate } = props;

  const component = componentFormData.components[uuid];
  const [name, setName] = useState(component.name);
  const [storeable, setters] = useBoolean(component.storeable ?? false);
  const [servings, setServings] = useState(
    !!component.servings ? component.servings : 1
  );

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <NameRow
          componentFormData={componentFormData}
          forceUpdate={forceUpdate}
          component={component}
          setName={setName}
          componentId={uuid}
          name={name}
        />
      </AccordionSummary>
      <AccordionDetails>
        <Divider textAlign="center">Ingredients</Divider>
        <IngredientsInputTable
          componentFormData={componentFormData}
          uuid={uuid}
        />
        <Divider textAlign="center" sx={{ pt: 5, pb: 1 }}>
          Instructions
        </Divider>
        <InstructionInputList
          componentFormData={componentFormData}
          componentId={uuid}
        />
        <Divider textAlign="center" sx={{ pt: 5, pb: 1 }}>
          Optional
        </Divider>
        <FormControl sx={{ pt: 1, flexDirection: "row", alignItems: "end" }}>
          <ServingsTextField
            setServings={setServings}
            servings={servings}
            component={component}
          />
          <StoreableCheckbox
            component={component}
            storeable={storeable}
            setState={setters.setState}
          />
        </FormControl>
      </AccordionDetails>
    </Accordion>
  );
};
