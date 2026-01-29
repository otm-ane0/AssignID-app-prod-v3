import { useEffect, useRef, useState } from "react";
import styles from "./ctx-menu-container.module.scss";

export const CtxMenuContainer = ({
  openSignal,
  closeSignal,
  ctxMenuPosition,
  children,
  zIndex,
  useMobileStyle,
  onCloseCallback,
  onPositionUpdate = (newPosition: { x: number; y: number }) => {},
  unid,
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
  onPositionUpdate?: Function;
  unid: string;
}) => {
  let ctxMenu = useRef<HTMLDivElement>(null);

  const [ctxPos, setCtxPos] = useState<{ x: number; y: number }>({
    x: ctxMenuPosition.x,
    y: ctxMenuPosition.y,
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  /*useEffect(() => {
        setX(ctxMenuPosition.x)
        setY(ctxMenuPosition.y)
    }, [[], ctxMenuPosition])*/

  useEffect(() => {
    if (!ctxMenu.current) {
      setCtxPos({ x: ctxMenuPosition.x, y: ctxMenuPosition.y });
      return;
    }
    let x = ctxMenuPosition.x;
    let y = ctxMenuPosition.y;
    let xSign = Math.sign(x);
    x *= xSign;
    let ySign = Math.sign(y);
    y *= ySign;
    if (ctxMenuPosition.x + ctxMenu.current.offsetWidth >= window.innerWidth) {
      x = window.innerWidth - ctxMenu.current.offsetWidth - 12;
    }
    if (ctxMenuPosition.y + ctxMenu.current.offsetHeight > window.innerHeight) {
      y = window.innerHeight - ctxMenu.current.offsetHeight;
    }
    x *= xSign;
    y *= ySign;
    if (x !== ctxMenuPosition.x || y !== ctxMenuPosition.y) {
      onPositionUpdate({ x: x, y: y });
    }
    setCtxPos({ x: x, y: y });
  }, [isOpen, ctxMenuPosition]);

  useEffect(() => {
    if (openSignal && !isOpen) {
      setIsOpen(true);
    }
  }, [openSignal]);
  useEffect(() => {
    if (closeSignal && isOpen) {
      setIsOpen(false);
      onCloseCallback();
    }
  }, [closeSignal]);

  function hideCtxMenu() {
    setIsOpen(false);
    onCloseCallback();
  }
  return (
    <>
      {isOpen && (
        <>
          <div
            className={styles.ctx_menu_bg}
            style={{ zIndex: zIndex }}
            tabIndex={-1}
            role={"button"}
            onClick={(e) => {
              hideCtxMenu();
            }}
          ></div>
          <div
            ref={ctxMenu}
            style={{
              left: `${ctxPos.x >= 0 ? ctxPos.x + "px" : "unset"}`,
              top: `${ctxPos.y >= 0 ? ctxPos.y + "px" : "unset"}`,
              right: `${ctxPos.x < 0 ? -ctxPos.x + "px" : "unset"}`,
              bottom: `${ctxPos.y < 0 ? -ctxPos.y + "px" : "unset"}`,
              zIndex: zIndex,
            }}
            onClick={(e) => {
              if ((e.target as any).classList.contains("ctx-menu-container")) {
                hideCtxMenu();
              }
            }}
            className={`${styles.ctx_menu_container} ${useMobileStyle ? styles.mobileStyle : ""} ctx-menu-container`}
          >
            {children && children}
          </div>
        </>
      )}
    </>
  );
};
