import Menu from './Menu.jsx';
import MenuSeparator from './MenuSeparator.jsx';

export default class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
  }
  render() {
    return null;
  }

  toQuipMenu() {
    const currentMenu = {
      id: quip.apps.DocumentMenuCommands.MENU_MAIN,
      subCommands: []
    };
    const menuConfig = {
      menuCommands: [],
      disabledCommandIds: [],
      highlightedCommandIds: [],
      toolbarCommandIds: [],
    };

    let children = this.props.children;
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

    menuConfig.currentMenu = currentMenu;
    return menuConfig;
  }
}
