import { useTramitContext } from "@/context/tramits";
import React from "react";
import { Button } from "./ui/button";
import { BiGridVertical, BiMinus } from "react-icons/bi";
import { Reorder } from "framer-motion";
import { ScrollArea } from "./ui/scroll-area";

const SelectedTramits = () => {
  const { selected, toggleTramit, setSelected } = useTramitContext();

  return (
    <div>
      <p className="text-lg font-semibold">Tràmits seleccionats</p>
      <ScrollArea className="h-[200px] pr-3">
        <Reorder.Group
          axis="y"
          values={selected}
          onReorder={(newOrder) => setSelected(newOrder)}
          className="grid gap-2 mt-2"
        >
          {selected.map((s) => (
            <Reorder.Item
              key={s.id}
              value={s}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-1">
                <BiGridVertical className="hover:cursor-grab focus:cursor-grabbing" />
                <p className="whitespace-nowrap max-w-48 truncate">{s.title}</p>
              </div>
              <Button onClick={() => toggleTramit(s)} size={"icon"}>
                <BiMinus />
              </Button>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </ScrollArea>
    </div>
  );
};

export default SelectedTramits;
