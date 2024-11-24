"use client";
import React from "react";
import Filters from "./filters";
import TramitList from "./tramit-list";
import { Card } from "./ui/card";
import { useTramitContext } from "@/context/tramits";

const Tramits = () => {
  const { selected } = useTramitContext();

  // Determine column span based on the length of the selected list
  const colSpanClass = selected.length === 0 ? "col-span-3" : "col-span-2";

  return (
    <Card className={`p-6 flex flex-col gap-2 overflow-hidden ${colSpanClass}`}>
      <Filters />
      <TramitList />
    </Card>
  );
};

export default Tramits;
