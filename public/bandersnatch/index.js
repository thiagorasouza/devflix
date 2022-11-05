const MANIFEST_URL = "./manifest.json";

async function main() {
  const localhosts = ["127.0.0.1", "localhost"];
  const isLocal = localhosts.includes(window.location.hostname);

  const manifest = await (await fetch(MANIFEST_URL)).json();
  const host = isLocal ? manifest.localHost : manifest.productionHost;

  const videoComponent = new VideoComponent();
  const network = new Network({ host });
  const videoPlayer = new VideoPlayer({ manifest, network, videoComponent });

  videoPlayer.initializeCodec();
  videoComponent.initializePlayer();

  window.nextChunk = (data) => videoPlayer.nextChunk(data);
}

window.onload = main;
