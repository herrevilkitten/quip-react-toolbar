import Menu from './Menu.jsx';
import MainMenu from './MainMenu.jsx';
import MenuSeparator from './MenuSeparator.jsx';

export default class MenuBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
  }

  render() {
    return null;
  }

  componentDidMount() {
    this.updateMenu();
  }

  componentDidUpdate() {
    this.updateMenu();
  }

  updateMenu() {
    const menuConfig = this.toQuipMenu();
    quip.apps.updateToolbar(menuConfig);
  }

  toQuipMenu() {
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

    const mainMenuIds = [];
    for (let i = 0; i < children.length; ++i) {
      const child = children[i];
      let childMenuConfig;
      switch (child.type) {
        case MainMenu:
          childMenuConfig = child.type.prototype.toQuipMenu.call(child);

          mainMenuIds.push(...childMenuConfig.currentMenu.subCommands);
          menuConfig.menuCommands.push(...childMenuConfig.menuCommands);
          menuConfig.disabledCommandIds.push(...childMenuConfig.disabledCommandIds);
          menuConfig.highlightedCommandIds.push(...childMenuConfig.highlightedCommandIds);
          break;
        case Menu:
        case MenuSeparator:
          childMenuConfig = child.type.prototype.toQuipMenu.call(child);

          menuConfig.toolbarCommandIds.push(childMenuConfig.currentMenu.id);
          menuConfig.menuCommands.push(...childMenuConfig.menuCommands);
          menuConfig.disabledCommandIds.push(...childMenuConfig.disabledCommandIds);
          menuConfig.highlightedCommandIds.push(...childMenuConfig.highlightedCommandIds);
          break;
      }
    }

    if (mainMenuIds.length > 0) {
      menuConfig.toolbarCommandIds.push(quip.apps.DocumentMenuCommands.MENU_MAIN);
      menuConfig.menuCommands.push({
        id: quip.apps.DocumentMenuCommands.MENU_MAIN,
        subCommands: mainMenuIds,
      });
    }

    return menuConfig;
  }
}
