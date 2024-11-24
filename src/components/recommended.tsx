import { useTramitContext } from "@/context/tramits";
import { Badge } from "./ui/badge";
import ToggleTramit from "./tramits/toggle";

const Recommended = () => {
  const { recommended } = useTramitContext();

  if (!recommended) return;

  return (
    <div className="pt-4 flex flex-col">
      <div className="flex items-center gap-3">
        <p className="font-semibold">Recomanat</p>
        <Badge className="bg-green-500">Vigent</Badge>
      </div>

      <p className="text-sm mt-2 mb-4 line-clamp-3">{recommended.title}</p>
      <ToggleTramit tramit={recommended} />
    </div>
  );
};

export default Recommended;
