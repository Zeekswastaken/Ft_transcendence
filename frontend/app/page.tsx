"use client"

import DiscriptionCard from "@/components/home/DiscriptionCard";
import GameCards from "@/components/home/GameCards";
import MatchHistory from "@/components/home/MatchHistory";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default  function Home() {

  const token = getCookie("accessToken");
  // const [isUserValid, setIsUserValid] = useState<boolean>(false);
  const router = useRouter();
  const url = `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}`;
  axios.post(url, {
    token: token
  }).then(res => {
    if (res.data.status === "unauthorized")
      router.push("/login");
    else
      router.push("/home")
  }).catch(res => (console.log(res)))
}
