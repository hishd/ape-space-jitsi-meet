import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { createE2EEEvent } from '../../analytics/AnalyticsEvents';
import { sendAnalytics } from '../../analytics/functions';
import { IReduxState } from '../../app/types';
import { IconE2EE } from '../../base/icons/svg';
import Switch from '../../base/ui/components/web/Switch';
import { toggleE2EE } from '../actions';
import { MAX_MODE } from '../constants';

const useStyles = makeStyles()(theme => {
    return {
        container: {
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: theme.palette.ui02,
            padding: '8px 16px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        },
        icon: {
            display: 'flex',
            alignItems: 'center'
        },
        label: {
            fontSize: '0.875rem',
            fontWeight: 600,
            color: theme.palette.text01,
            marginRight: '8px'
        },
        waitMessage: {
            fontSize: '0.75rem',
            color: theme.palette.text02,
            fontStyle: 'italic',
            marginLeft: '8px'
        }
    };
});

/**
 * Compact E2EE toggle component for the conference page.
 *
 * @returns {JSX.Element | null}
 */
const E2EEToggle = () => {
    const { classes } = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isProcessing, setIsProcessing] = useState(false);

    const e2eeEnabled = useSelector((state: IReduxState) => state['features/e2ee'].enabled);
    const maxMode = useSelector((state: IReduxState) => state['features/e2ee'].maxMode);
    const e2eeSupported = useSelector((state: IReduxState) => state['features/base/conference'].e2eeSupported);
    const isModerator = useSelector((state: IReduxState) => {
        const localParticipant = state['features/base/participants'].local;

        return localParticipant?.role === 'moderator';
    });

    const enabled = maxMode === MAX_MODE.DISABLED || e2eeEnabled;

    // Only show if E2EE is supported and user is moderator
    if (!e2eeSupported || !isModerator) {
        return null;
    }

    return (
        <div className={classes.container}>
            <div className={classes.icon}>
                <IconE2EE />
            </div>
            <span className={classes.label}>
                {t('dialog.e2eeLabel')}
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
            {isProcessing && (
                <span className={classes.waitMessage}>
                    Please wait...
                </span>
            )}
        </div>
    );
};

export default E2EEToggle;
