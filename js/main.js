const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "MIINHTHANG";
const playlist = $(".playlist");
const player = $(".player");
const heading = $(".header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const volumeSlider = $("#volumeSlider");
const rangeValue = $("#rangeValue");
const app = {
  currentIndex: 0,
  isPlaying: false,
  isSeeking: false,
  isRandom: false,
  isRepeat: false,
  playedSongs: [],
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Gọi mưa",
      singer: "Huy Quấn idol x Huy Lê",
      path: "./asset/song/song1.mp3",
      img: "./asset/img/song1.jpg",
    },
    {
      name: "Perject",
      singer: "Jonah Baker",
      path: "./asset/song/song2.mp3",
      img: "./asset/img/song2.jpg",
    },
    {
      name: "Phù Quang",
      singer: "Linh Đoàn",
      path: "./asset/song/song3.mp3",
      img: "./asset/img/song3.jpg",
    },
    {
      name: "Normal no more",
      singer: "Bella",
      path: "./asset/song/song4.mp3",
      img: "./asset/img/song4.jpg",
    },
    {
      name: "Umbrella",
      singer: "ember island",
      path: "./asset/song/song5.mp3",
      img: "./asset/img/song5.jpg",
    },
    {
      name: "Cẩm Tú Cầu",
      singer: "Kiều Chi cover",
      path: "./asset/song/song6.mp3",
      img: "./asset/img/song6.jpg",
    },
    {
      name: "Buồn hay vui",
      singer: "VSTRA cover",
      path: "./asset/song/song7.mp3",
      img: "./asset/img/song7.jpg",
    },
    {
      name: "Phong",
      singer: "VSTRA",
      path: "./asset/song/song8.mp3",
      img: "./asset/img/song8.jpg",
    },
    {
      name: "Hà Nội",
      singer: "VSTRA x Obito",
      path: "./asset/song/song9.mp3",
      img: "./asset/img/song9.jpg",
    },
    {
      name: "Đánh đổi",
      singer: "Obito x MCK",
      path: "./asset/song/song10.mp3",
      img: "./asset/img/song10.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;

    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song-container ${
          index === this.currentIndex ? "active" : ""
        }">
          <div class="song">
            <div class="thumb" style="background-image: url('${
              song.img
            }')"></div>
          </div>
          <div class="body" style="cursor: pointer">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fa-solid fa-ellipsis"></i>
          </div>
        </div>  
      `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvent: function () {
    const cdWidth = cd.offsetWidth;
    const _this = this;

    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );

    // Xử lí phóng to / thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };
    // Xử lí khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    // Khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    // Khi song được pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };
    // KHi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration && !_this.isSeeking) {
        progress.value = Math.floor((audio.currentTime / audio.duration) * 100);
      }
    };

    // Xử lí tua bài háthát
    progress.onmousedown = function () {
      _this.isSeeking = true;
    };

    progress.onmouseup = function (e) {
      _this.isSeeking = false;
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      _this.scrollToActiveSong();
      _this.render();
      audio.play();
    };

    //Khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      _this.render();
      _this.scrollToActiveSong();
      audio.play();
    };

    //Xử lí khi tăng giảm âm lượng
    audio.volume = localStorage.getItem("volume")
      ? localStorage.getItem("volume") / 100
      : 1;
    volumeSlider.value = audio.volume * 100;
    volumeSlider.oninput = function (e) {
      const volume = e.target.value / 100;
      audio.volume = volume;
      localStorage.setItem("volume", e.target.value); // Lưu vào localStorage
    };

    //Xử lí khi bấm vào random
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    //Xử lí next  khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    //Xử lí repeat bài hát
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };
    // Lắng nghe hành vi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song-container:not(.active)");
      const isThumb = e.target.closest(".thumb");
      const isTitle = e.target.closest(".title");
      const isAuthor = e.target.closest(".author");
      const isOption = e.target.closest(".option");

      if (isThumb || isTitle || isAuthor) {
        if (songNode) {
          _this.currentIndex = [...$$(".song-container")].indexOf(songNode);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
      } else if (isOption) {
        console.log("Tùy chọn bài hát được nhấn");
        // Xử lý khi click vào option (nếu cần)
      }
    };
    volumeSlider.addEventListener("input", function () {
      rangeValue.textContent = volumeSlider.value;
    });

    // Khởi tạo giá trị ban đầu của thanh trượt
    rangeValue.textContent = volumeSlider.value;
    this.loadCurrentSong = function () {
      heading.textContent = this.currentSong.name;
      cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
      audio.src = this.currentSong.path;
      audio.volume = this.config.volume || 1;
    };
    volumeSlider.oninput = function (e) {
      const volume = e.target.value / 100;
      audio.volume = volume;
      localStorage.setItem("volume", e.target.value);
    };

    const savedVolume = localStorage.getItem("volume");
    if (savedVolume) {
      audio.volume = savedVolume / 100;
      volumeSlider.value = savedVolume;
    } else {
      audio.volume = 1;
      volumeSlider.value = 100; // Giá trị mặc định
    }
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
    audio.src = this.currentSong.path;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();

    if (this.isPlaying) {
      audio.play();
    }
  },

  playRandomSong: function () {
    let newIndex;

    if (this.playedSongs.length === this.songs.length) {
      this.playedSongs = [];
    }
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (this.playedSongs.includes(newIndex));

    this.currentIndex = newIndex;
    this.playedSongs.push(newIndex);
    this.loadCurrentSong();

    if (this.isPlaying) {
      audio.play();
    }
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      const activeSong = $(".song-container.active");
      const dashboardHeight = $(".dashboard").offsetHeight;

      if (activeSong) {
        const rect = activeSong.getBoundingClientRect();
        const isAbove = rect.top < dashboardHeight;
        const isBelow = rect.bottom > window.innerHeight;

        if (isAbove || isBelow) {
          window.scrollBy({
            top: rect.top - dashboardHeight - 10,
            behavior: "smooth",
          });
        }
      }
    }, 300);
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

  start: function () {
    this.loadConfig();
    this.defineProperties();
    this.handleEvent();
    this.loadCurrentSong();
    this.render();
    // Hiển thị trạng tháithái
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};
app.start();
