import styles from "./ctx-menu-item.module.scss";

export const CtxMenuItem = ({
  icon,
  title,
  rightIcon,
  action,
  autoFocus = false,
  confirm = -1,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  rightIcon?: React.ReactNode;
  action: Function;
  autoFocus?: boolean;
  confirm?: number;
}) => {
  return (
    <button
      className={`${styles.ctxMenuItem} ${confirm === 1 && styles.confirm} ${styles.ctx_confirm_delete}`}
      onClick={() => {
        action();
      }}
      autoFocus={autoFocus}
    >
      {icon && <span className={styles.icon}>{icon && icon}</span>}
      <span className={styles.title}>{title}</span>
      {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
    </button>
  );
};

export const CtxMenuEmptyItem = ({ children }: { children?: React.ReactNode }) => {
  return <div className={styles.emptyCtxMenuItem}>{children && children}</div>;
};
