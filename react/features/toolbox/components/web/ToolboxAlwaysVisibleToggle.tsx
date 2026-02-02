import { connect } from 'react-redux';

import { translate } from '../../../base/i18n/functions';
import { IconPin, IconPinned } from '../../../base/icons/svg';
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';

import { toggleToolboxAlwaysVisible } from '../../actions.web';

/**
 * The type of the React {@code Component} props of {@link ToolboxAlwaysVisibleToggle}.
 */
interface IProps extends AbstractButtonProps {

    /**
     * Whether the toolbox is set to always visible.
     */
    _alwaysVisible?: boolean;
}

/**
 * Implementation of a button for toggling the toolbox always visible mode (disabling auto-hide).
 */
class ToolboxAlwaysVisibleToggle extends AbstractButton<IProps> {
    override accessibilityLabel = 'toolbar.accessibilityLabel.alwaysVisible';
    override icon = IconPin;
    override label = 'toolbar.alwaysVisible';
    override toggledIcon = IconPinned;
    override tooltip = 'toolbar.alwaysVisible';

    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    override _isToggled() {
        return Boolean(this.props._alwaysVisible);
    }

    /**
     * Handles clicking the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    override _handleClick() {
        this.props.dispatch(toggleToolboxAlwaysVisible());
    }
}

/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
function _mapStateToProps(state: any): Partial<IProps> {
    const { toolbarConfig } = state['features/base/config'];

    return {
        _alwaysVisible: Boolean(toolbarConfig?.alwaysVisible)
    };
}

export default connect(_mapStateToProps)(translate(ToolboxAlwaysVisibleToggle));
