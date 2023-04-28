import { Button } from "@mui/material";
import { useRouter } from "next/router";

export default function Home(props: any) {
  const router = useRouter();
  return <Button onClick={() => router.push("/food")}>Go to food</Button>;
}
