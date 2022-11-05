class VideoPlayer {
  constructor({ manifest, network, videoComponent }) {
    this.manifest = manifest;
    this.videoElement = {};
    this.sourceBuffer = {};
    this.mediaSource = {};
    this.selected = manifest.intro;
    this.network = network;
    this.videoDuration = 0;
    this.videoComponent = videoComponent;
    this.activeItem = {};
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
      // console.log("Ready State", mediaSource.readyState); // open
      this.sourceBuffer = mediaSource.addSourceBuffer(this.manifest.codec);

      mediaSource.duration = this.videoDuration;
      await this.fileDownload(this.selected.url);
      setInterval(this.waitForQuestions.bind(this), 200);
    };
  }

  currentFileResolution() {
    const url = this.network.parseFileURL({
      url: this.manifest.finalizar.url,
      hostTag: this.manifest.hostTag,
      fileResolutionTag: this.manifest.fileResolutionTag,
      fileResolution: 144,
    });

    return this.network.calculateResolution(url);
  }

  async fileDownload(url) {
    const fileResolution = await this.currentFileResolution();

    const finalURL = this.network.parseFileURL({
      url,
      hostTag: this.manifest.hostTag,
      fileResolutionTag: this.manifest.fileResolutionTag,
      fileResolution,
    });
    this.setVideoPlayerDuration(finalURL);

    const data = await this.network.fetchFile(finalURL);
    return this.processBufferSegments(data);
  }

  waitForQuestions() {
    const currentTime = parseInt(this.videoElement.currentTime);
    // console.log("🚀 ~ currentTime", currentTime);
    const timeToShowOptions = currentTime === this.selected.at;
    // console.log("🚀 ~ timeToShowOptions", timeToShowOptions);
    const isModalVisible = this.activeItem.url === this.selected.url;
    // console.log("🚀 ~ isModalVisible", isModalVisible);
    if (!timeToShowOptions || isModalVisible) return;
    // console.log("🚀 ~ showOptions", showOptions);
    // console.log(this.selected.options);
    // if ()
    this.videoComponent.configureModal(this.selected);
    this.activeItem = this.selected;
  }

  async nextChunk(data) {
    const key = data.toLowerCase();
    const option = this.manifest[key];
    // console.log("🚀 ~ option", option);
    // console.dir(this.videoElement);
    // console.log("new at", this.videoElement.duration + option.at);
    this.selected = {
      ...option,
      at: parseInt(this.videoElement.duration + option.at),
    };

    this.videoElement.play();
    await this.fileDownload(option.url);
  }

  setVideoPlayerDuration(finalURL) {
    const [name, duration] = finalURL.split("/").pop().split("-");
    this.videoDuration += parseFloat(duration);
    // console.log(name, duration);
    // console.log("🚀 ~ videoDuration", this.videoDuration);
  }

  async processBufferSegments(allSegments) {
    const sourceBuffer = this.sourceBuffer;
    sourceBuffer.addEventListener("updateend", () => {
      sourceBuffer.timestampOffset = this.videoDuration;
    });
    sourceBuffer.appendBuffer(allSegments);
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
