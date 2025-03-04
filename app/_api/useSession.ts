import { deleteSession } from "@/libs/session";
import { useRouter } from "next/navigation";

export function useSession() {
  const router = useRouter();

  const handleUnauthorized = async () => {
    await deleteSession();
    router.push("/signin");
  };

  return { handleUnauthorized };
}
