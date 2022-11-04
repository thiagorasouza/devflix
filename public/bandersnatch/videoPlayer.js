class VideoPlayer {
  constructor({ manifest, network }) {
    this.manifest = manifest;
    this.videoElement = {};
    this.sourceBuffer = {};
    this.mediaSource = {};
    this.selected = manifest.intro;
    this.network = network;
    this.videoDuration = 0;
  }

  initializeCodec() {
    const mediaSourceSupported = !!window.MediaSource;
    if (!mediaSourceSupported) {
      return alert("Your browser does not support the media player API.");
    }

    const codecSupported = MediaSource.isTypeSupported(this.manifest.codec);
    if (!codecSupported) {
      return alert("Your browser does not support the video codec");
    }

    this.mediaSource = new MediaSource();

    this.videoElement = document.getElementById("vid");
    this.videoElement.src = URL.createObjectURL(this.mediaSource);

    this.mediaSource.addEventListener(
      "sourceopen",
      this.sourceOpen(this.mediaSource)
    );
  }

  sourceOpen(mediaSource) {
    return async () => {
      console.log("Ready State", mediaSource.readyState); // open
      this.sourceBuffer = mediaSource.addSourceBuffer(this.manifest.codec);
      mediaSource.duration = this.videoDuration;
      await this.fileDownload(this.selected.url);
    };
  }

  async fileDownload(url) {
    const finalURL = this.network.parseFileURL({
      url,
      hostTag: this.manifest.hostTag,
      fileResolutionTag: this.manifest.fileResolutionTag,
      fileResolution: 720,
    });
    this.setVideoPlayerDuration(finalURL);

    const data = await this.network.fetchFile(finalURL);
    return this.processBufferSegments(data);
  }

  setVideoPlayerDuration(finalURL) {
    const [name, duration] = finalURL.split("/").pop().split("-");
    this.videoDuration += duration;
    // console.log(name, duration);
    // console.log("🚀 ~ videoDuration", this.videoDuration);
  }

  async processBufferSegments(allSegments) {
    // const sourceBuffer = this.sourceBuffer;
    // sourceBuffer.addEventListener("updateend", () => {
    //   this.mediaSource.endOfStream();
    // });
    this.sourceBuffer.appendBuffer(allSegments);
    // this.sourceBuffer.addEventListener("updateend", () => {
    //   this.sourceBuffer.timestampOffset = 45;
    // });

    // sourceBuffer.appendBuffer(allSegments);

    // return new Promise((resolve, reject) => {
    //   const updateEnd = () => {
    //     sourceBuffer.removeEventListener("updateend", updateEnd);
    //     sourceBuffer.timestampOffset = this.videoDuration;

    //     return resolve();
    //   };

    //   sourceBuffer.addEventListener("updateend", updateEnd);
    //   sourceBuffer.addEventListener("error", reject);
    // });
  }
}
