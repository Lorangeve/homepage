import { useGlobalContext } from "~/components/GlobalState";
import AvatarCard from "../components/AavatarCard";

export default function Demo() {
  // const { setCount } = useGlobalContext();

  return (
    <div class="h-full">
      <AvatarCard />
    </div>
  );
}
