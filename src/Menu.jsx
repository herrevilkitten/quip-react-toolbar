import PropTypes from 'prop-types';

import MenuSeparator from './MenuSeparator.jsx';

let assignedMenuId = 0;

export const KEYS = [
  'id',
  'label',
  'sublabel',
  'handler',
  'isHeader',
  'actionParams',
  'actionStarted',
];

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
  }

  render() {
    return null;
  }

  toQuipMenu() {
    const currentMenu = {};
    const menuConfig = {
      menuCommands: [],
      disabledCommandIds: [],
      highlightedCommandIds: [],
      toolbarCommandIds: [],
    };
    menuConfig.menuCommands.push(currentMenu);

    KEYS.forEach((key) => {
      if (this.props[key] !== undefined && this.props[key] !== null) {
        currentMenu[key] = this.props[key];
      }
    });

    if (currentMenu.id === undefined || currentMenu.id === null) {
      currentMenu.id = `generated-menu-${assignedMenuId}`;
      assignedMenuId++;
    }

    if (this.props.highlighted) {
      menuConfig.highlightedCommandIds.push(currentMenu.id);
    }

    if (this.props.disabled) {
      menuConfig.disabledCommandIds.push(currentMenu.id);
    }

    let children = this.props.children;
    if (children) {
      if (!Array.isArray(children)) {
        children = [children];
      }

      for (let i = 0; i < children.length; ++i) {
        const child = children[i];
        let childMenuConfig;
        switch (child.type) {
          case Menu:
            childMenuConfig = child.type.prototype.toQuipMenu.call(child);
            if (!currentMenu.subCommands) {
              currentMenu.subCommands = [];
            }
            currentMenu.subCommands.push(childMenuConfig.currentMenu.id);

            menuConfig.menuCommands.push(...childMenuConfig.menuCommands);
            menuConfig.disabledCommandIds.push(...childMenuConfig.disabledCommandIds);
            menuConfig.highlightedCommandIds.push(...childMenuConfig.highlightedCommandIds);
            break;
          case MenuSeparator:
            childMenuConfig = child.type.prototype.toQuipMenu.call(child);
            if (!currentMenu.subCommands) {
              currentMenu.subCommands = [];
            }
            currentMenu.subCommands.push(childMenuConfig.currentMenu.id);
            break;
        }
      }
    }

    if (!currentMenu.handler && (!currentMenu.subCommands || currentMenu.subCommands.length === 0)) {
      currentMenu.isHeader = true;
    }

    menuConfig.currentMenu = currentMenu;
    return menuConfig;
  }
}

Menu.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  sublabel: PropTypes.string,
  handler: PropTypes.func,
  isHeader: PropTypes.bool,
  actionId: PropTypes.string,
  actionParams: PropTypes.any,
  actionStarted: PropTypes.func,
};