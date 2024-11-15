import React, { useEffect, useRef, useState } from "react";

import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;

  routePrefix?: string;
  trigger: JSX.Element;
};
const Collapsible = ({ trigger, children, routePrefix }: Props) => {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState(
    !routePrefix ? false : pathName.startsWith(routePrefix)
  );

  const contentRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!contentRef.current) return;

    function getContainer(element: HTMLElement) {
      let node: HTMLElement | null = element.parentElement;

      while (node) {
        if (node.dataset["collapsibleRole"] === "container") {
          return node;
        } else {
          node = node.parentElement;
        }
      }
      return node;
    }

    if (isOpen) {
      contentRef.current.style.height = contentRef.current.scrollHeight + "px";
      const parent: HTMLElement | null = getContainer(contentRef.current);

      if (parent)
        parent.style.height =
          parent.scrollHeight + contentRef.current.scrollHeight + "px";
      contentRef.current.dataset["collapsibleRole"] = "container";
    } else {
      contentRef.current.style.height = "0px";
      const parent: HTMLElement | null = getContainer(contentRef.current);
      if (parent)
        parent.style.height =
          parent.scrollHeight - contentRef.current.scrollHeight + "px";
    }
  }, [isOpen]);

  return (
    <div className="">
      <div onClick={toggleMenu}>{trigger}</div>

      <div
        className="h-0 overflow-hidden transition-all duration-200"
        ref={contentRef}
      >
        {children}
      </div>
    </div>
  );
};

export default Collapsible;
