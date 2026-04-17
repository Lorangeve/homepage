import { useGlobalContext } from "~/components/GlobalState";
import AvatarCard from "../components/AavatarCard";

export default function Demo() {
  const { setCount } = useGlobalContext();

  setCount((prev) => prev - 1);

  return (
    <div class="h-full">
      <AvatarCard />
    </div>
  );
}
