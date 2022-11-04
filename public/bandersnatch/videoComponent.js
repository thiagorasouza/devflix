class VideoComponent {
  static initializePlayer() {
    const player = videojs("vid");
    const ModalDialog = videojs.getComponent("ModalDialog");
    const modal = new ModalDialog(player, {
      temporary: false,
      closeable: true,
    });

    player.addChild(modal);
  }
}
