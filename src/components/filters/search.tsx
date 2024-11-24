import { useTramitContext } from "@/context/tramits";
import { BiSearch } from "react-icons/bi";

const Search = () => {
  const { query, setQuery } = useTramitContext();

  return (
    <div className="border rounded flex items-center gap-2 p-2 text-sm">
      <BiSearch />
      <input
        type="text"
        placeholder="Busca un tràmit"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="outline-none bg-transparent w-full"
      />
    </div>
  );
};

export default Search;
