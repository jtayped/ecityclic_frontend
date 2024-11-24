import { useTramitContext } from "@/context/tramits";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import ToggleTramit from "./tramits/toggle";
import { ScrollArea } from "./ui/scroll-area";

const TramitList = () => {
  const { results } = useTramitContext();

  // Animation variants for list items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <ScrollArea className="h-full pr-3">
      <ol className="grid divide-y">
        <AnimatePresence>
          {results.map((r) => (
            <motion.li
              key={r.id}
              className="flex items-center justify-between py-2"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={itemVariants}
              transition={{ duration: 0.1 }}
            >
              <p className="text-sm whitespace-nowrap max-w-[420px] truncate ...">
                {r.title}
              </p>
              <div className="flex items-center gap-2">
                {r.current ? (
                  <Badge className="bg-green-500">Vigent</Badge>
                ) : (
                  <Badge className="bg-destructive">No vigent</Badge>
                )}
                <ToggleTramit tramit={r} />
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    </ScrollArea>
  );
};

export default TramitList;
