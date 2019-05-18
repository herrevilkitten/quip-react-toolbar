export default class MenuSeparator extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
  }
  render() {
    return null;
  }

  toQuipMenu() {
    return {
      menuCommands: [{
        id: quip.apps.DocumentMenuCommands.SEPARATOR,
      }],
      currentMenu: {
        id: quip.apps.DocumentMenuCommands.SEPARATOR,
      }
    };
  }
}
