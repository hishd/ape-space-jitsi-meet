import React, { useCallback } from "react";
import { makeStyles } from "tss-react/mui";

import { isMobileBrowser } from "../../../environment/utils";
import { ISwitchProps } from "../types";

interface IProps extends ISwitchProps {
    className?: string;

    /**
     * Id of the toggle.
     */
    id?: string;
}

const BRAND_COLOR = "#FFA800";
const OFF_BG = "#D9D9D9";

const useStyles = makeStyles()((theme) => ({
    container: {
        position: "relative",
        width: "56px",
        height: "28px",
        borderRadius: "999px",
        backgroundColor: OFF_BG,
        cursor: "pointer",
        transition: "background-color 0.25s ease",
        display: "inline-flex",
        alignItems: "center",
        padding: "3px",

        "&.disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
        },

        "&.is-mobile": {
            width: "64px",
            height: "32px",
        },
    },

    containerOn: {
        backgroundColor: BRAND_COLOR,
    },

    toggle: {
        width: "22px",
        height: "22px",
        backgroundColor: "#FFFFFF",
        borderRadius: "50%",
        transition: "transform 0.25s ease",
        transform: "translateX(0)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.25)",

        "&.is-mobile": {
            width: "26px",
            height: "26px",
        },
    },

    toggleOn: {
        transform: "translateX(28px)",

        "&.is-mobile": {
            transform: "translateX(32px)",
        },
    },

    checkbox: {
        position: "absolute",
        inset: 0,
        opacity: 0,
        cursor: "pointer",
    },
}));

const Switch = ({ className, id, checked, disabled, onChange }: IProps) => {
    const { classes: styles, cx } = useStyles();
    const isMobile = isMobileBrowser();

    const change = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked);
    }, []);

    return (
        <span
            className={cx(
                styles.container,
                checked && styles.containerOn,
                isMobile && "is-mobile",
                disabled && "disabled",
                className
            )}
        >
            <input
                type="checkbox"
                {...(id ? { id } : {})}
                checked={checked}
                disabled={disabled}
                className={styles.checkbox}
                onChange={change}
            />
            <span className={cx(styles.toggle, checked && styles.toggleOn, isMobile && "is-mobile")} />
        </span>
    );
};

export default Switch;
