/**
 * @license
 * Copyright CERN and copyright holders of ALICE O2. This software is
 * distributed under the terms of the GNU General Public License v3 (GPL
 * Version 3), copied verbatim in the file "COPYING".
 *
 * See http://alice-o2.web.cern.ch/license for full licensing information.
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

import { h } from '/js/src/index.js';

import { formatTimestamp } from '../../utilities/formatting/formatTimestamp.js';
import { detailsFrontLinks } from '../common/navigation/frontLinks.js';

import { logDetails } from './logDetails.js';
import { logLinkButton } from './logLinkButton.js';
import { logReplyButton } from './logReplyButton.js';
import { logText } from './logText.js';
import { primaryButton } from '../common/primaryButton.js';
import { logDetailsButton } from './logDetailsButton.js';
import { attachmentPreviewComponent } from '../../views/Logs/FilePreview/attachmentPreviewComponent.js';
import { tagBadge } from '../tag/tagBadge.js';

/**
 * Provides formatting for each log field to display that field on the webpage
 * @return {Object} an object determining how each log field wil lbe displayed on the page
 */
const logFields = () => ({
    author: {
        name: 'Source',
        format: (author) => author.name,
    },
    createdAt: {
        name: 'Created',
        format: (timestamp) => formatTimestamp(timestamp),
    },
    tags: {
        name: 'Tags',
        format: (tags) => h('div.flex-row.flex-wrap.g1', tags.map(tagBadge)),
    },
    runs: {
        name: 'Runs',
        format: (runs) => detailsFrontLinks(runs, ({ runNumber }) => ({
            content: runNumber,
            page: 'run-detail',
            parameters: { runNumber },
        })),
    },
    environments: {
        name: 'Environments',
        format: (environments) => detailsFrontLinks(environments, ({ id }) => ({
            content: id,
            page: 'env-details',
            parameters: { environmentId: id },
        })),
    },
    lhcFills: {
        name: 'LHC Fills',
        format: (lhcFills) => detailsFrontLinks(lhcFills, ({ fillNumber }) => ({
            content: fillNumber,
            page: 'lhc-fill-details',
            parameters: { fillNumber },
        })),
    },
    attachments: {
        name: 'Attachments',
        visible: true,
        format: (attachments) => h('span.flex-row.flex-wrap.gc1', attachments.flatMap((attachment) => [
            attachmentPreviewComponent(attachment),
            h('span.mr2', ','),
        ]).slice(0, -1)),
    },
});

const expandedLogFields = ['runs', 'environments', 'lhcFills', 'attachments'];

/**
 * Returns a card for the given log
 *
 * @param {Log} log all data related to the log
 * @param {boolean} highlight indicator if this log should be highlighted
 * @param {boolean} showLogTitle indicator if the title of this log should be visible
 * @param {boolean} isCollapsed indicator if the title of this log is collapsed
 * @param {function} onCollapse function called when the log should be collapsed
 * @param {function} onExpand function called when the log should be expanded
 * @param {Object} options other options
 * @param {boolean} [options.replyButton] if true, reply button will be displayed
 * @param {boolean} [options.goToDetailsButton] if true, button to go to details will be displayed
 * @param {Object} [options.logMarkdownDisplayOpts] markdown display opts @see logText opts argument
 * @param {Partial<MarkdownBoxSize>} [options.logMarkdownDisplayOpts.boxSize] size of markdown display
 * @return {Component} the log's display component
 */
export const logComponent = (
    log,
    highlight,
    showLogTitle,
    isCollapsed,
    onCollapse,
    onExpand,
    options = {},
) => {
    const { title = '', id = '' } = log;
    const fieldFormatting = logFields();
    const logTitle = showLogTitle ? h(`h4#log-${id}-title`, title) : '';
    const displayedLogFields = isCollapsed ? [] : expandedLogFields;
    const logViewButton = isCollapsed
        ? primaryButton('Show', onExpand, `show-collapse-${id}`)
        : primaryButton('Collapse', onCollapse, `collapse-${id}`);

    return h(
        `#log-${id}.br2.m1.p3.shadow-level1.flex-column.g1${highlight ? '.b1.b-primary' : ''}`,
        h('div.flex-row.justify-between.', [
            h(`div.flex-column.g1.log-details-${isCollapsed ? 'collapsed' : 'expanded'}`, [
                logTitle,
                h(
                    '.flex-row.flex-wrap.g1',
                    h('em', `${fieldFormatting.author.format(log.author)} (${fieldFormatting.createdAt.format(log.createdAt)})`),
                ),
                fieldFormatting.tags.format(log.tags),
            ]),
            h('div.flex-row.flex-shrink-0.flex-wrap.items-start.g1', [
                logLinkButton(log),
                options.replyButton && logReplyButton(log),
                options.goToDetailsButton && logDetailsButton(log),
                logViewButton,
            ]),
        ]),
        logDetails(log, displayedLogFields, fieldFormatting),
        h('.bt1.b-gray-light.pv2/'),
        logText(log, isCollapsed, options?.logMarkdownDisplayOpts),
    );
};
