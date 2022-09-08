let ele = document.getElementsByName("color");
let drawing = document.getElementById("drawing");
let maincontainer = document.getElementById("maincontainer");
let color_value = document.getElementsByClassName("color_value");
let answer_value = document.getElementsByClassName("answer_value");
let color_target = document.getElementsByClassName("color-target");
let question_equation = document.querySelector(".question_equation");
let color = "transparent";
let unlockedColors = [];
let qnaset = {};

for (let i = 0; i < color_value.length; i++) {
  color_value[i].addEventListener("click", function () {
    maincontainer.classList.remove(...maincontainer.classList);

    for (let j = 0; j < color_value.length; j++) {
      color_value[j].classList.remove("selected");
    }
    if (!color_value[i].classList.contains("not_allowed")) {
      color_value[i].classList.add("selected");
    }
    color = color_value[i].dataset.colorvalue;
    maincontainer.classList.add(
      `class${color_value[i].dataset.colorvalue.substring(1)}`
    );
  });
}

drawing.addEventListener("click", (event) => {
  event.target.style.fill = color;
  if (color == "transparent") {
    event.target.style.strokeWidth = 1;
  } else {
    event.target.style.strokeWidth = 0;
  }

  let count = 0;
  for (let k = 0; k < color_target.length; k++) {
    if (
      color_target[k].style.fill &&
      color_target[k].style.fill != "transparent"
    ) {
      count++;
    }
  }
  if (count > color_target.length / 2) {
    document.querySelector(".download_button").style.opacity = 1;
    document.querySelector(".download_button").style.zIndex = 10;
  }
});

document.addEventListener("contextmenu", (ev) => {
  ev.preventDefault();
  for (let j = 0; j < color_value.length; j++) {
    color_value[j].classList.remove("selected");
  }
  color = "transparent";
  maincontainer.classList.remove(...maincontainer.classList);
});

const generateqna = () => {
  let ans = -1;
  let qn = "";
  let options = [];
  do {
    qn = `${Math.floor(Math.random() * 10 + 1)} ${
      Math.floor(Math.random() * 2 + 1) % 2 ? "-" : "+"
    } ${Math.floor(Math.random() * 10 + 1)} ${
      Math.floor(Math.random() * 2 + 1) % 2 ? "-" : "+"
    } ${Math.floor(Math.random() * 10 + 1)} ${
      Math.floor(Math.random() * 2 + 1) % 2 ? "-" : "+"
    } ${Math.floor(Math.random() * 10 + 1)}`;
    ans = eval(qn);
  } while (ans < 0);
  options = Array.from({ length: 20 }, () => Math.floor(Math.random() * ans));
  let uniqueChars = [...new Set(options)];
  uniqueChars.splice(Math.floor(Math.random() * 4), 0, ans);
  console.log(ans);

  return {
    question: qn,
    answer: ans,
    options: uniqueChars,
  };
};

const setQNA = () => {
  qnaset = generateqna();
  question_equation.innerText = qnaset.question;
  for (let i = 0; i < answer_value.length; i++) {
    answer_value[i].style.backgroundColor =
      color_value[i * Math.floor(Math.random() * 4)].dataset.colorvalue;
    if (qnaset.options[i] != undefined) {
      answer_value[i].innerText = qnaset.options[i];
    } else {
      answer_value[i].innerText = 12 + i;
    }
  }
};
const checkAnswer = (ev) => {
  if (parseInt(ev.innerText) == qnaset.answer) {
    let indextounlock = 0;
    if (unlockedColors.length < 16) {
      do {
        indextounlock = Math.floor(Math.random() * 16);
      } while (unlockedColors.includes(indextounlock));
      unlockedColors.push(indextounlock);
      color_value[indextounlock].classList.remove("not_allowed");
    }
    setQNA();
  } else {
    alert("Wrong Answer");
    const wrong_attempts = localStorage.getItem("wrong_attempts");
    localStorage.setItem("wrong_attempts", [wrong_attempts, qnaset.question]);
  }
};

function setUpDownloadPageAsImage() {
  html2canvas(document.getElementById("drawing")).then(function (canvas) {
    // console.log(canvas);
    simulateDownloadImageClick(canvas.toDataURL(), "file-name.png");
  });
}

function simulateDownloadImageClick(uri, filename) {
  var link = document.createElement("a");
  if (typeof link.download !== "string") {
    window.open(uri);
  } else {
    link.href = uri;
    link.download = filename;
    accountForFirefox(clickLink, link);
  }
}

function clickLink(link) {
  link.click();
}

function accountForFirefox(click) {
  let link = arguments[1];
  document.body.appendChild(link);
  click(link);
  document.body.removeChild(link);
}

setQNA();
