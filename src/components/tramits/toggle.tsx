import { BiMinus, BiPlus } from "react-icons/bi";
import { Button } from "../ui/button";
import { useTramitContext } from "@/context/tramits";
import { Tramit } from "@/types/tramit";

const ToggleTramit = ({ tramit }: { tramit: Tramit }) => {
  const { selected, toggleTramit } = useTramitContext();

  // Check if the tramit is already in the selected array by id
  const isSelected = selected.some((item) => item.id === tramit.id);

  if (isSelected)
    return (
      <Button size={"sm"} onClick={() => toggleTramit(tramit)}>
        <BiMinus /> Eliminar
      </Button>
    );

  return (
    <Button size={"sm"} onClick={() => toggleTramit(tramit)}>
      <BiPlus /> Afegir
    </Button>
  );
};

export default ToggleTramit;
