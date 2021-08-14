const framesArray = [];
const key = "d0fe24bef18346caaa9e38d77bde5dd0";
const endpointTags =
  "https://compvisionvideo.cognitiveservices.azure.com/vision/v3.2/analyze?visualFeatures=Tags";

//generating frames
function getVideoImage(path, secs, callback) {
  const me = this;
  const video = document.createElement("video");
  video.onloadedmetadata = function () {
    if ("function" === typeof secs) {
      secs = secs(this.duration);
    }
    this.currentTime = Math.min(
      Math.max(0, (secs < 0 ? this.duration : 0) + secs),
      this.duration
    );
  };
  video.onseeked = function (e) {
    var canvas = document.createElement("canvas");
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // var img = new Image();
    // img.src = canvas.toDataURL();
    framesArray.push(canvas.toDataURL());
    callback.call(me, img, this.currentTime, e);
  };
  video.onerror = function (e) {
    callback.call(me, undefined, undefined, e);
  };
  video.src = path;
}

function showImageAt(secs, cb) {
  let duration;
  getVideoImage(
    "./finalCut.mp4",
    function (totalTime) {
      duration = totalTime;
      return secs;
    },
    function (img, secs, event) {
      if (event.type == "seeked") {
        if (duration >= ++secs) {
          //console.log("=======", framesArray);
          showImageAt(secs, null);
        } else {
          console.log("========> end");

          cb(true);
        }
      }
    }
  );
}

async function dataURItoBlob(dataURI) {
  console.log("Begin to execute dataURItoBlob()");
  const res = await fetch(dataURI);

  return res.blob();
}

//using Computer vision to determine tags of the frame,
//and then check if any tag is inside dangerous flagTags
//if so -> break the loop, and send the warning message
//otherwise -> continue looping, when done send a positive message
async function analyzeIfDanger(frame) {
  console.log("Begin to execute analyzeIfDanger()");

  const flags = [
    "weapon",
    "firearm",
    "rifle",
    "ranged weapon",
    "gun",
    "shooting",
    "assault rifle",
    "gun barrel",
    "machine gun",
    "trigger",
    "explosive weapon",
    "air gun",
    "sniper rifle",
    "handgun",
    "gun",
    "pistol",
    "revolver",
    "military",
  ];

  const blob = await dataURItoBlob(frame);

  let response = await fetch(endpointTags, {
    method: "POST",
    body: blob,
    headers: {
      "Content-Type": "application/octet-stream",
      "Ocp-Apim-Subscription-Key": key,
    },
  });

  const { tags } = await response.json();
  const tagNames = tags.map((tag) => tag.name);
  const weapon = tagNames.find((tagName) => flags.includes(tagName));

  if (weapon) {
    return true;
  } else {
    return false;
  }
}

function dangerDetection() {
  showImageAt(0);

  //   setTimeout(() => {
  //     // all code here.
  //   }, 1000);

  //   framesArray.map((item, index) => {
  //     const img = new Image();
  //     img.src = item;
  //     img.id = "image " + index;
  //     img.style = "margin: '20px'";
  //     document.getElementById("listOfImages").appendChild(img);
  //   });

  let isDanger = false;

  for (let f = 0; f < framesArray.length; f++) {
    isDanger = analyzeIfDanger(framesArray[f]);
    if (isDanger == true) {
      break;
    }
  }

  if (isDanger) {
    document.getElementById("demo").innerHTML =
      "Result: Your video contain weapons.";
  } else {
    document.getElementById("demo").innerHTML =
      "Result: No wepons where detected in the video.";
  }

  //console.log("==> ", xs, framesArray);
}
