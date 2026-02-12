import React from 'react';
import { makeStyles } from 'tss-react/mui';

import Icon from '../../../base/icons/components/Icon';
import { IconRaiseHand } from '../../../base/icons/svg';

interface IProps {
    /**
     * The order/position of the participant in the raised hands queue.
     */
    order?: number;
}

/**
 * Formats a number with its ordinal suffix (1st, 2nd, 3rd, etc.).
 *
 * @param {number} num - The number to format.
 * @returns {string} - The formatted string with ordinal suffix.
 */
const getOrdinalSuffix = (num: number): string => {
    const j = num % 10;
    const k = num % 100;

    if (j === 1 && k !== 11) {
        return `${num}st`;
    }
    if (j === 2 && k !== 12) {
        return `${num}nd`;
    }
    if (j === 3 && k !== 13) {
        return `${num}rd`;
    }

    return `${num}th`;
};

const useStyles = makeStyles()(theme => {
    return {
        container: {
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        },
        indicator: {
            borderRadius: `${Number(theme.shape.borderRadius) / 2}px`,
            height: '24px',
            width: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            
            '& svg path': {
                fill: theme.palette.icon04
            }
        },
        orderBadge: {
            backgroundColor: theme.palette.warning02,
            borderRadius: `${Number(theme.shape.borderRadius) / 2}px`,
            padding: '2px 6px',
            fontSize: '11px',
            fontWeight: 600,
            color: theme.palette.icon04,
            minWidth: '28px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    };
});

export const RaisedHandIndicator = ({ order }: IProps) => {
    const { classes: styles } = useStyles();

    return (
        <div className = { styles.container }>
            <div className = { styles.indicator }>
                <Icon
                    size = { 16 }
                    src = { IconRaiseHand } />
            </div>
            {order && order > 0 && (
                <div className = { styles.orderBadge }>
                    {getOrdinalSuffix(order)}
                </div>
            )}
        </div>
    );
};
