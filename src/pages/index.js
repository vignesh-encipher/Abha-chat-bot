import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Component = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/home");
  });
  return <div></div>;
};

export default Component;
