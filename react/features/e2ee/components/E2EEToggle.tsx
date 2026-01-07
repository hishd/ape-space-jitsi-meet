import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import { createE2EEEvent } from "../../analytics/AnalyticsEvents";
import { sendAnalytics } from "../../analytics/functions";
import { IReduxState } from "../../app/types";
import Switch from "../../base/ui/components/web/Switch";
import { toggleE2EE } from "../actions";
import { MAX_MODE } from "../constants";

const BRAND = "#FFA800";

const useStyles = makeStyles()((theme) => ({
    container: {
        position: "absolute",
        top: 16,
        left: 16,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: 14,
        backgroundColor: "#9e9e9e93",
        padding: "8px 10px",
        borderRadius: "999px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
    },

    icon: {
        width: 44,
        height: 44,
        borderRadius: "50%",
        backgroundColor: "#1E1E1E",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    logo: {
        width: 26,
        height: 26,
        objectFit: "contain",
    },

    label: {
        fontSize: "13px",
        fontWeight: 700,
        lineHeight: "1.05",
        letterSpacing: "0.4px",
        textAlign: "left",
        whiteSpace: "pre-line",
        transition: "color 0.2s ease",
    },

    labelInactive: {
        color: "#FFFFFF",
    },

    labelActive: {
        color: BRAND,
    },

    waitMessage: {
        marginLeft: 8,
        fontSize: "11px",
        color: "#999",
        fontStyle: "italic",
    },
}));

/**
 * Compact E2EE toggle component for the conference page.
 *
 * @returns {JSX.Element | null}
 */
const E2EEToggle = () => {
    const { classes, cx } = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isProcessing, setIsProcessing] = useState(false);

    const e2eeEnabled = useSelector((state: IReduxState) => state["features/e2ee"].enabled);
    const maxMode = useSelector((state: IReduxState) => state["features/e2ee"].maxMode);
    const e2eeSupported = useSelector((state: IReduxState) => state["features/base/conference"].e2eeSupported);
    const isModerator = useSelector((state: IReduxState) => {
        const localParticipant = state["features/base/participants"].local;

        return localParticipant?.role === "moderator";
    });

    const enabled = maxMode === MAX_MODE.DISABLED || e2eeEnabled;

    // Only show if E2EE is supported and user is moderator
    if (!e2eeSupported || !isModerator) {
        return null;
    }

    return (
        <div className={classes.container}>
            <div className={classes.icon}>
                <img src="./images/ape_space_logo.png" alt="Ape Space" className={classes.logo} />
            </div>
            <span className={cx(classes.label, !e2eeEnabled ? classes.labelActive : classes.labelInactive)}>
                DEFAULT{"\n"}ENCRYPTION
            </span>
            <Switch
                checked={e2eeEnabled}
                disabled={!enabled || isProcessing}
                onChange={(checked) => {
                    if (isProcessing) {
                        return;
                    }

                    setIsProcessing(true);
                    sendAnalytics(createE2EEEvent(`enabled.${String(checked)}`));
                    dispatch(toggleE2EE(checked || false));

                    setTimeout(() => {
                        setIsProcessing(false);
                    }, 2000);
                }}
            />
            <span className={cx(classes.label, e2eeEnabled ? classes.labelActive : classes.labelInactive)}>
                END-TO-END{"\n"}ENCRYPTION
            </span>
            {/* {isProcessing && <span className={classes.waitMessage}>Please wait...</span>} */}
        </div>
    );
};

export default E2EEToggle;
