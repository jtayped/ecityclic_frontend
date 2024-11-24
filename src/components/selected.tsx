"use client";
import { Card } from "./ui/card";
import SelectedTramits from "./selected-tramits";
import Recommended from "./recommended";
import { useTramitContext } from "@/context/tramits";

const Selected = () => {
  const { selected } = useTramitContext();

  if (selected.length === 0) return;

  return (
    <Card className="p-6 divide-y flex flex-col justify-between">
      <SelectedTramits />
      <Recommended />
    </Card>
  );
};

export default Selected;
