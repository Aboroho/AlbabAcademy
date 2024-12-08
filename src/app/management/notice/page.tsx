"use client";
import { Button } from "@/components/button";
import InputField from "@/components/ui/input-field";
import { Modal } from "@/components/ui/modal/Modal";
import React, { useState } from "react";

type Props = {};

function Notice({}: Props) {
  const [x, setX] = useState("");
  return (
    <div>
      <div>Comming soon...</div>

      <Modal trigger={<Button>Open</Button>} title="dlfjk" description="kdjf">
        <div>
          <InputField
            label="ldf"
            value={x}
            onChange={(e) => setX(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}

export default Notice;
