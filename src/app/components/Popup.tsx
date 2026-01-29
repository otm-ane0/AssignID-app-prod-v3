import { useState, useEffect } from "react";
import styles from "./popup.module.scss";
// import { Icons } from "@/assets/icons";

export const Popup = ({
  openSignal,
  closeSignal,
  pstyle,
  icon,
  showTitle,
  title,
  titleSize = "larg",
  onClose,
  noCloseBtn,
  style,
  strict,
  fixedSize,
  children,
  noHeader,
  zIndex,
}: {
  openSignal: boolean;
  closeSignal: boolean;
  pstyle?: "small" | "larg";
  icon?: React.ReactNode;
  showTitle?: boolean;
  title?: string;
  titleSize?: "small" | "larg";
  onClose: Function;
  noCloseBtn?: boolean;
  style?: object;
  strict?: boolean;
  fixedSize?: boolean;
  children: React.ReactNode;
  noHeader?: boolean;
  zIndex?: number;
}) => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (openSignal && !visible) {
      setVisible(true);
    }
  }, [openSignal]);
  useEffect(() => {
    if (closeSignal && visible) {
      closePopup();
    }
  }, [closeSignal]);

  function closePopup() {
    setVisible(false);
    onClose();
  }

  return (
    <>
      <div
        className={`${styles.popup_bg} ${visible ? "" : styles.hidden}`}
        tabIndex={-1}
        role={"button"}
        onClick={() => {
          if (!strict) closePopup();
        }}
        style={{ zIndex: zIndex }}
      ></div>
      <div
        className={`${styles.popup} ${pstyle === "small" ? styles.small : styles.larg} ${
          visible ? "" : styles.hidden
        } ${fixedSize ? styles.fixedSize : ""}`}
        style={style ? { ...style, zIndex: zIndex } : { zIndex: zIndex }}
      >
        {!noHeader && (
          <div
            className={styles.popup_header}
            style={{ background: `${title ? "" : "transparent"}` }}
          >
            {(title || icon) && (
              <h3 className={`${styles.popup_title} ${titleSize === "small" ? styles.popup_title_small : ""}`}>
                {icon && icon}
                {title}
              </h3>
            )}
            {!noCloseBtn && (
              <div
                className={styles.close_popup}
                onClick={() => {
                  closePopup();
                }}
              >
                {/* <Icons.CloseIcon /> */}
              </div>
            )}
          </div>
        )}
        <div className={`${styles.popup_content} ${noHeader ? styles.noHeader : ""}`}>{children && children}</div>
      </div>
    </>
  );
};
