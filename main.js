document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle Logic ---
  const themeToggle = document.querySelector('#checkbox');
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
      themeToggle.checked = true;
    }
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.checked = true;
    }
  }

  themeToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, false);

  // --- Text-to-Speech (TTS) Pronunciation ---
  function speakJapanese(text) {
    if ('speechSynthesis' in window) {
      // Cancel ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.85; // Slightly slower for clear learning
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('TTS is not supported in this browser.');
    }
  }

  // Daily Expression Audio Button
  const dailyAudioBtn = document.getElementById('daily-audio-btn');
  const dailyJpText = document.getElementById('daily-jp').textContent;
  dailyAudioBtn.addEventListener('click', () => {
    speakJapanese(dailyJpText);
  });

  // --- Interactive Flashcards Data ---
  const hiraganaData = [
    { jp: 'あ', reading: 'a (아)', kr: '아' },
    { jp: 'い', reading: 'i (이)', kr: '이' },
    { jp: 'う', reading: 'u (우)', kr: '우' },
    { jp: 'え', reading: 'e (에)', kr: '에' },
    { jp: 'お', reading: 'o (오)', kr: '오' },
    { jp: 'か', reading: 'ka (카)', kr: '카' },
    { jp: 'き', reading: 'ki (키)', kr: '키' },
    { jp: 'く', reading: 'ku (쿠)', kr: '쿠' },
    { jp: 'け', reading: 'ke (케)', kr: '케' },
    { jp: 'こ', reading: 'ko (코)', kr: '코' }
  ];

  const katakanaData = [
    { jp: 'ア', reading: 'a (아)', kr: '아' },
    { jp: 'イ', reading: 'i (이)', kr: '이' },
    { jp: 'ウ', reading: 'u (우)', kr: '우' },
    { jp: 'エ', reading: 'e (에)', kr: '에' },
    { jp: 'オ', reading: 'o (오)', kr: '오' },
    { jp: 'カ', reading: 'ka (카)', kr: '카' },
    { jp: 'キ', reading: 'ki (키)', kr: '키' },
    { jp: 'ク', reading: 'ku (쿠)', kr: '쿠' },
    { jp: 'ケ', reading: 'ke (케)', kr: '케' },
    { jp: 'コ', reading: 'ko (코)', kr: '코' }
  ];

  const phrasesData = [
    { jp: 'こんにちは', reading: 'kon-nichiwa', kr: '안녕하세요' },
    { jp: 'ありがとう', reading: 'arigatou', kr: '고맙습니다' },
    { jp: 'すみません', reading: 'sumimasen', kr: '죄송합니다 / 실례합니다' },
    { jp: 'はじめまして', reading: 'hajimemashite', kr: '처음 뵙겠습니다' },
    { jp: 'おいしいです', reading: 'oishii desu', kr: '맛있습니다' },
    { jp: 'さようなら', reading: 'sayounara', kr: '잘 가세요 (작별 인사)' }
  ];

  let currentMode = 'hiragana';
  const cardsGrid = document.getElementById('cards-grid');
  const btnHiragana = document.getElementById('btn-hiragana');
  const btnKatakana = document.getElementById('btn-katakana');
  const btnPhrases = document.getElementById('btn-phrases');

  function getActiveData() {
    if (currentMode === 'hiragana') return hiraganaData;
    if (currentMode === 'katakana') return katakanaData;
    return phrasesData;
  }

  function renderCards() {
    cardsGrid.innerHTML = '';
    const data = getActiveData();

    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'flip-card';
      
      // Determine font size adjustments for long phrases
      const isPhrase = currentMode === 'phrases';
      const frontFontSize = isPhrase ? 'font-size: 1.25rem; padding: 0.5rem;' : '';
      const backFontSize = isPhrase ? 'font-size: 1.1rem;' : '';

      card.innerHTML = `
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <span class="card-jp" style="${frontFontSize}">${item.jp}</span>
            <span class="card-reading">${isPhrase ? '' : item.reading}</span>
            <span class="card-hint">💡 클릭하여 보기</span>
          </div>
          <div class="flip-card-back">
            <span class="card-kr" style="${backFontSize}">${item.kr}</span>
            <span class="card-reading">${item.reading}</span>
            <span class="card-hint">🔊 발음 듣기</span>
          </div>
        </div>
      `;

      // Click event for 3D flipping & speaking pronunciation
      card.addEventListener('click', () => {
        const isFlipped = card.classList.contains('flipped');
        
        // Toggle flip
        card.classList.toggle('flipped');

        // Pronounce Japanese word if flipping to the back
        if (!isFlipped) {
          speakJapanese(item.jp);
        }
      });

      cardsGrid.appendChild(card);
    });
  }

  // Mode Selection Listeners
  function setMode(mode, activeBtn, otherBtns) {
    currentMode = mode;
    activeBtn.classList.add('active');
    otherBtns.forEach(btn => btn.classList.remove('active'));
    renderCards();
  }

  btnHiragana.addEventListener('click', () => setMode('hiragana', btnHiragana, [btnKatakana, btnPhrases]));
  btnKatakana.addEventListener('click', () => setMode('katakana', btnKatakana, [btnHiragana, btnPhrases]));
  btnPhrases.addEventListener('click', () => setMode('phrases', btnPhrases, [btnHiragana, btnKatakana]));

  // --- Vocabulary Notebook App Logic ---
  const inputJp = document.getElementById('word-jp');
  const inputKr = document.getElementById('word-kr');
  const btnAddWord = document.getElementById('btn-add-word');
  const wordList = document.getElementById('word-list');

  // Load from LocalStorage or set defaults
  let customWords = JSON.parse(localStorage.getItem('nihongo-words')) || [
    { id: 1, jp: '日本語', kr: '일본어' },
    { id: 2, jp: '友達', kr: '친구' },
    { id: 3, jp: '桜', kr: '벚꽃' },
    { id: 4, jp: '美味しい', kr: '맛있다' }
  ];

  function saveWords() {
    localStorage.setItem('nihongo-words', JSON.stringify(customWords));
  }

  function renderWords() {
    wordList.innerHTML = '';
    customWords.forEach(word => {
      const li = document.createElement('li');
      li.className = 'word-item';
      li.dataset.id = word.id;

      li.innerHTML = `
        <div class="word-content">
          <span class="word-jp-text">${escapeHTML(word.jp)}</span>
          <span class="word-kr-text">${escapeHTML(word.kr)}</span>
        </div>
        <button class="btn-word-delete" title="삭제">×</button>
      `;

      // Speak Japanese word on clicking it
      li.querySelector('.word-content').addEventListener('click', () => {
        speakJapanese(word.jp);
      });

      // Delete action
      li.querySelector('.btn-word-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        customWords = customWords.filter(w => w.id !== word.id);
        saveWords();
        renderWords();
      });

      wordList.appendChild(li);
    });
  }

  function addNewWord() {
    const jpText = inputJp.value.trim();
    const krText = inputKr.value.trim();

    if (jpText === '' || krText === '') return;

    const newWord = {
      id: Date.now(),
      jp: jpText,
      kr: krText
    };

    customWords.unshift(newWord); // Add to the top of the list
    saveWords();
    renderWords();
    
    // Clear inputs
    inputJp.value = '';
    inputKr.value = '';
    inputJp.focus();
  }

  // Event Listeners for Adding Words
  btnAddWord.addEventListener('click', addNewWord);
  
  // Handle keypress inside inputs
  [inputJp, inputKr].forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addNewWord();
      }
    });
  });

  // Helper to prevent XSS
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // Initial Render
  renderCards();
  renderWords();
});