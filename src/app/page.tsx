import Selected from "@/components/selected";
import Tramits from "@/components/tramits";
import { TramitContextProvider } from "@/context/tramits";

export default function Home() {
  return (
    <main className="w-full h-screen flex justify-center items-center">
      <div className="w-[1000px] h-[70%] grid grid-cols-3 gap-5">
        <TramitContextProvider>
          <Tramits />
          <Selected />
        </TramitContextProvider>
      </div>
    </main>
  );
}
