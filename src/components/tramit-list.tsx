import { useTramitContext } from "@/context/tramits";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useCallback } from "react";
import ToggleTramit from "./tramits/toggle";
import { ScrollArea } from "./ui/scroll-area";

const TramitList = () => {
  const { results, isLoading, hasMoreResults, loadNextPage } =
    useTramitContext();
  const observerTarget = useRef<HTMLDivElement>(null);

  // Animation variants for list items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20 },
  };

  // Callback for intersection observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMoreResults && !isLoading) {
        loadNextPage();
      }
    },
    [hasMoreResults, isLoading, loadNextPage]
  );

  // Set up intersection observer
  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleObserver]);

  return (
    <ScrollArea className="h-full pr-3">
      <ol className="grid divide-y pb-2">
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

        {/* Observer target */}
        <div ref={observerTarget} className="h-4 w-full" aria-hidden="true" />

        {/* Loading indicator */}
        {isLoading && (
          <div className="py-4 text-center text-sm text-muted-foreground">
            Loading more results...
          </div>
        )}

        {/* End of results indicator */}
        {!hasMoreResults && results.length > 0 && (
          <div className="py-4 text-center text-sm text-muted-foreground">
            No more results
          </div>
        )}
      </ol>
    </ScrollArea>
  );
};

export default TramitList;
