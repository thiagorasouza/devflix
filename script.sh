ASSETSFOLDER=assets/timeline

for mediaFile in $(ls $ASSETSFOLDER | grep .mp4); do

  FILENAME=$(echo $mediaFile | sed 's/.mp4//' | sed 's/-1920x1080//')
  INPUT=$ASSETSFOLDER/$mediaFile
  FOLDER_PATH=$ASSETSFOLDER/$FILENAME
  mkdir -p $FOLDER_PATH

  OUTPUT=$ASSETSFOLDER/$FILENAME/$FILENAME
  DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $INPUT)
  
  OUTPUT144=$OUTPUT-$DURATION-144.mp4
  OUTPUT360=$OUTPUT-$DURATION-360.mp4
  OUTPUT720=$OUTPUT-$DURATION-720.mp4

  echo "Rendering in 144p"
  ffmpeg -y -i $INPUT \
        -c:a aac -ac 2 \
        -vcodec h264 -acodec aac \
        -ab 128k \
        -movflags frag_keyframe+empty_moov+default_base_moof \
        -b:v 300k \
        -maxrate 300k \
        -bufsize 300k \
        -vf "scale=256:144" \
        -v quiet \
        $OUTPUT144

  echo "Rendering in 360p"   
  ffmpeg -y -i $INPUT \
        -c:a aac -ac 2 \
        -vcodec h264 -acodec aac \
        -ab 128k \
        -movflags frag_keyframe+empty_moov+default_base_moof \
        -b:v 400k \
        -maxrate 400k \
        -bufsize 400k \
        -vf "scale=-1:360" \
        -v quiet \
        $OUTPUT360

    echo "Rendering in 720p"
    ffmpeg -y -i $INPUT \
        -c:a aac -ac 2 \
        -vcodec h264 -acodec aac \
        -ab 128k \
        -movflags frag_keyframe+empty_moov+default_base_moof \
        -b:v 1500k \
        -maxrate 1500k \
        -bufsize 1000k \
        -vf "scale=-1:720" \
        -v quiet \
        $OUTPUT720

done