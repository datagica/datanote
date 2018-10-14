// const remote = window.node.require('electron').remote;
const remote = window.node.require('remote');
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;



export default class ContextMenu {
  constructor(){
    this.menu = new Menu();
    this.menu.append(new MenuItem({ label: 'MenuItem1', click: () => { console.log('item 1 clicked'); } }));
    this.menu.append(new MenuItem({ type: 'separator' }));
    this.menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }));

    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      // TODO popup at current mouse coordinates
      this.menu.popup(remote.getCurrentWindow());
    }, false);

  }
}
