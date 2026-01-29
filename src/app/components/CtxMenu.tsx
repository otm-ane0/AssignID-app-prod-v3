"use client";
import { useEffect, useRef } from "react";
import ctxstyles from "./ctx-menu.module.scss";
import { CtxMenuContainer } from "./CtxMenuContainer";

export const CtxMenu = ({
  openSignal,
  closeSignal,
  ctxMenuPosition,
  zIndex,
  useMobileStyle,
  onCloseCallback,
  onPositionUpdate,
  unid,
  children,
}: {
  openSignal: boolean;
  closeSignal: boolean;
  ctxMenuPosition: {
    x: number;
    y: number;
  };
  children?: React.ReactNode;
  zIndex?: number;
  useMobileStyle?: boolean;
  onCloseCallback: Function;
  onPositionUpdate?: (newPos: { x: number; y: number }) => void;
  unid: string;
}) => {
  const ctxMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (!ctxMenuRef.current) {
        return;
      }
      ctxMenuRef.current.focus();
    }, 200);
  }, []);

  return (
    <>
      <CtxMenuContainer
        closeSignal={closeSignal}
        openSignal={openSignal}
        ctxMenuPosition={ctxMenuPosition}
        onCloseCallback={onCloseCallback}
        onPositionUpdate={onPositionUpdate}
        unid={unid}
        useMobileStyle={useMobileStyle}
        zIndex={zIndex}
      >
        <div
          ref={ctxMenuRef}
          tabIndex={0}
          className={ctxstyles.ctx_menu}
          autoFocus
        >
          {children}
        </div>
      </CtxMenuContainer>
    </>
  );
};
