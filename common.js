//Вытаскиваем форму
const searchForm = document.querySelector("#search-form");
//Вытаскиваем input
const searchFormInput = searchForm.querySelector("input"); // <=> document.querySelector("#search-form input");
//Вытаскиваем блок с информацией
const info = document.querySelector(".info");

// The speech recognition interface lives on the browser’s window object
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; // if none exists -> undefined

if(SpeechRecognition) {
  console.log("Your Browser supports speech Recognition");
  //Создаем новый объект
  const recognition = new SpeechRecognition();
  //Определяет, возвращаются ли непрерывные результаты для каждого распознавания или только один результат. По умолчанию один (ложь).
  recognition.continuous = true;
  // recognition.lang = "en-US";
  
  //В ставляем нашу кнопку button
  searchForm.insertAdjacentHTML("beforeend", '<button type="button"><i class="fas fa-microphone"></i></button>');
  //Прописываем padding для input
  searchFormInput.style.paddingRight = "50px";
  
  //В переменную попадает кнопка
  const micBtn = searchForm.querySelector("button");
  //В переменную попадает иконка i
  const micIcon = micBtn.firstElementChild;
  
  //Привязываем обработчик события клик к кнопке
  micBtn.addEventListener("click", micBtnClick);
  function micBtnClick() {
    //Если иконка имеет класс "fa-microphone", то запускаем speeach
    if(micIcon.classList.contains("fa-microphone")) { // Start Voice Recognition
      recognition.start(); // First time you have to allow access to mic!
    }
    //Иначе останавливаем
    else {
      recognition.stop();
    }
  }
  
  //Обработчки события при старте
  recognition.addEventListener("start", startSpeechRecognition); // <=> recognition.onstart = function() {...}
  function startSpeechRecognition() {
    //Удаляем микрофон иконку
    micIcon.classList.remove("fa-microphone");
    //Добавляем зачеркнутый микрофон иконка
    micIcon.classList.add("fa-microphone-slash");
    //Фокус на input
    searchFormInput.focus();
    //Сообщение голосовой ввод активирован в консоле
    console.log("Voice activated, SPEAK");
  }

  //Обработчки события при завершении
  recognition.addEventListener("end", endSpeechRecognition); // <=> recognition.onend = function() {...}
  function endSpeechRecognition() {
    micIcon.classList.remove("fa-microphone-slash");
    micIcon.classList.add("fa-microphone");
    searchFormInput.focus();
    console.log("Speech recognition service disconnected");
  }

  //Обработчки события результат
  recognition.addEventListener("result", resultOfSpeechRecognition); // <=> recognition.onresult = function(event) {...} - Fires when you stop talking
  function resultOfSpeechRecognition(event) {
    //Возвращает результат наименьшего значения индекса в "массиве" SpeechRecognitionResultList, который фактически изменился.
    const current = event.resultIndex;
    //results - Возвращает объект SpeechRecognitionResultList, представляющий все результаты распознавания речи для текущего сеанса
    const transcript = event.results[current][0].transcript;
    
    if(transcript.toLowerCase().trim()==="stop recording") {
      recognition.stop();
    }
    else if(!searchFormInput.value) {
      searchFormInput.value = transcript;
    }
    else {
      if(transcript.toLowerCase().trim()==="go") {
        searchForm.submit();
      }
      else if(transcript.toLowerCase().trim()==="reset input") {
        searchFormInput.value = "";
      }
      else {
        searchFormInput.value = transcript;
      }
    }
    // searchFormInput.value = transcript;
    // searchFormInput.focus();
    // setTimeout(() => {
    //   searchForm.submit();
    // }, 500);
  }
  
  info.textContent = 'Voice Commands: "stop recording", "reset input", "go"';
  
}
else {
  console.log("Your Browser does not support speech Recognition");
  info.textContent = "Your Browser does not support Speech Recognition";
}