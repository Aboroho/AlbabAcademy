import React, { Suspense } from "react";
import Login from "./Login";

type Props = {};

function LoginPage({}: Props) {
  return (
    <Suspense fallback={<></>}>
      <Login />
    </Suspense>
  );
}

export default LoginPage;
