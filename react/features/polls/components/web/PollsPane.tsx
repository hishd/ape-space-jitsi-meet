import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { IReduxState } from '../../../app/types';
import Icon from '../../../base/icons/components/Icon';
import { IconDownload } from '../../../base/icons/svg';
import { getParticipantDisplayName } from '../../../base/participants/functions';
import Button from '../../../base/ui/components/web/Button';
import AbstractPollsPane, { AbstractProps } from '../AbstractPollsPane';

import PollCreate from './PollCreate';
import PollsList from './PollsList';
/* eslint-enable lines-around-comment */

const useStyles = makeStyles()(theme => {
    return {
        container: {
            height: '100%',
            position: 'relative'
        },
        header: {
            height: '60px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
            boxSizing: 'border-box',
            color: theme.palette.text01,
            ...theme.typography.heading6,
            borderBottom: `1px solid ${theme.palette.ui03}`,

            '.jitsi-icon': {
                cursor: 'pointer'
            }
        },
        listContainer: {
            height: 'calc(100% - 88px)',
            overflowY: 'auto'
        },
        listContainerWithHeader: {
            height: 'calc(100% - 148px)',
            overflowY: 'auto'
        },
        footer: {
            position: 'absolute',
            bottom: 0,
            padding: '24px',
            width: '100%',
            boxSizing: 'border-box'
        }
    };
});

const PollsPane = ({ createMode, isCreatePollsDisabled, onCreate, setCreateMode, t }: AbstractProps) => {
    const { classes } = useStyles();
    const { polls } = useSelector((state: IReduxState) => state['features/polls']);
    const reduxState = useSelector((state: IReduxState) => state);

    const pollsList = Object.values(polls);
    const hasPolls = pollsList.length > 0;

    /**
     * Downloads all poll results as a text file.
     *
     * @returns {void}
     */
    const downloadPollResults = useCallback(() => {
        if (pollsList.length === 0) {
            return;
        }

        // Format header
        const timestamp = new Date().toLocaleString();
        let exportText = '============================================\n';
        exportText += 'POLL RESULTS EXPORT\n';
        exportText += `ApeSpace Conference\n`;
        exportText += `Date: ${timestamp}\n`;
        exportText += '============================================\n\n';

        // Format each poll
        pollsList.forEach((poll, index) => {
            const creatorName = getParticipantDisplayName(reduxState, poll.senderId ?? '');
            
            exportText += `POLL #${index + 1}\n`;
            exportText += `Question: ${poll.question}\n`;
            exportText += `Created by: ${creatorName}\n`;

            // Calculate total voters across all answers
            const allVoters = new Set();
            poll.answers.forEach(answer => {
                answer.voters?.forEach(voter => allVoters.add(voter.id));
            });
            exportText += `Total Voters: ${allVoters.size}\n\n`;

            // Format answers
            exportText += 'Answers:\n';
            poll.answers.forEach((answer, answerIndex) => {
                const voterCount = answer.voters?.length || 0;
                const percentage = allVoters.size > 0 
                    ? Math.round(voterCount / allVoters.size * 100) 
                    : 0;
                
                exportText += `${answerIndex + 1}. ${answer.name} - ${voterCount} vote${voterCount !== 1 ? 's' : ''} (${percentage}%)\n`;
                
                if (answer.voters && answer.voters.length > 0) {
                    const voterNames = answer.voters
                        .map(voter => {
                            const participantName = getParticipantDisplayName(reduxState, voter.id);
                            return participantName || voter.name;
                        })
                        .join(', ');
                    exportText += `   Voters: ${voterNames}\n`;
                }
                exportText += '\n';
            });

            exportText += '--------------------------------------------\n\n';
        });

        // Create blob and download
        const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const downloadTimestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        link.href = url;
        link.download = `apespace-poll-results-${downloadTimestamp}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [ pollsList, reduxState ]);

    const onDownloadKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            downloadPollResults();
        }
    }, [ downloadPollResults ]);

    return createMode
        ? <PollCreate setCreateMode = { setCreateMode } />
        : <div className = { classes.container }>
            {hasPolls && (
                <div className = { classes.header }>
                    <span>{ "Export Results" }</span>
                    <Icon
                        ariaLabel = { t('polls.results.download') }
                        onClick = { downloadPollResults }
                        onKeyPress = { onDownloadKeyPress }
                        role = 'button'
                        src = { IconDownload }
                        tabIndex = { 0 } />
                </div>
            )}
            <div className = { hasPolls ? classes.listContainerWithHeader : classes.listContainer } >
                <PollsList setCreateMode = { setCreateMode } />
            </div>
            { !isCreatePollsDisabled && <div className = { classes.footer }>
                <Button
                    accessibilityLabel = { t('polls.create.create') }
                    fullWidth = { true }
                    labelKey = { 'polls.create.create' }
                    onClick = { onCreate } />
            </div>}
        </div>;
};

/*
 * We apply AbstractPollsPane to fill in the AbstractProps common
 * to both the web and native implementations.
 */
// eslint-disable-next-line new-cap
export default AbstractPollsPane(PollsPane);
