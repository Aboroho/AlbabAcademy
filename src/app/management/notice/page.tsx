import React from "react";
import UserNotice from "./userNotice";

type Props = {};

function NoticePage({}: Props) {
  return (
    <div>
      <UserNotice category="GENERAL" target="ALL_USER" />
    </div>
  );
}

export default NoticePage;
