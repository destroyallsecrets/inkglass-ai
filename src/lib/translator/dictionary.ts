export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ja' | 'ko' | 'zh' | 'ru' | 'ar';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  rtl?: boolean;
}

export const languages: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
];

const commonPhrases: Record<string, Record<Language, string>> = {
  'hello': { en: 'Hello', es: 'Hola', fr: 'Bonjour', de: 'Hallo', it: 'Ciao', pt: 'Olá', ja: 'こんにちは', ko: '안녕하세요', zh: '你好', ru: 'Привет', ar: 'مرحبا' },
  'goodbye': { en: 'Goodbye', es: 'Adiós', fr: 'Au revoir', de: 'Auf Wiedersehen', it: 'Arrivederci', pt: 'Adeus', ja: 'さようなら', ko: '안녕히 가세요', zh: '再见', ru: 'До свидания', ar: 'وداعا' },
  'thank you': { en: 'Thank you', es: 'Gracias', fr: 'Merci', de: 'Danke', it: 'Grazie', pt: 'Obrigado', ja: 'ありがとう', ko: '감사합니다', zh: '谢谢', ru: 'Спасибо', ar: 'شكرا' },
  'please': { en: 'Please', es: 'Por favor', fr: 'S\'il vous plaît', de: 'Bitte', it: 'Per favore', pt: 'Por favor', ja: 'お願いします', ko: '제발', zh: '请', ru: 'Пожалуйста', ar: 'من فضلك' },
  'yes': { en: 'Yes', es: 'Sí', fr: 'Oui', de: 'Ja', it: 'Sì', pt: 'Sim', ja: 'はい', ko: '네', zh: '是', ru: 'Да', ar: 'نعم' },
  'no': { en: 'No', es: 'No', fr: 'Non', de: 'Nein', it: 'No', pt: 'Não', ja: 'いいえ', ko: '아니요', zh: '不', ru: 'Нет', ar: 'لا' },
  'good morning': { en: 'Good morning', es: 'Buenos días', fr: 'Bonjour', de: 'Guten Morgen', it: 'Buongiorno', pt: 'Bom dia', ja: 'おはよう', ko: '좋은 아침', zh: '早上好', ru: 'Доброе утро', ar: 'صباح الخير' },
  'good night': { en: 'Good night', es: 'Buenas noches', fr: 'Bonne nuit', de: 'Gute Nacht', it: 'Buonanotte', pt: 'Boa noite', ja: 'おやすみ', ko: '좋은 밤', zh: '晚安', ru: 'Спокойной ночи', ar: 'تصبح على خير' },
  'how are you': { en: 'How are you?', es: '¿Cómo estás?', fr: 'Comment allez-vous?', de: 'Wie geht es Ihnen?', it: 'Come stai?', pt: 'Como vai você?', ja: 'お元気ですか?', ko: '어떻게 지내세요?', zh: '你好吗?', ru: 'Как дела?', ar: 'كيف حالك؟' },
  'i love you': { en: 'I love you', es: 'Te amo', fr: 'Je t\'aime', de: 'Ich liebe dich', it: 'Ti amo', pt: 'Eu te amo', ja: '愛してる', ko: '사랑해요', zh: '我爱你', ru: 'Я тебя люблю', ar: 'أحبك' },
  'welcome': { en: 'Welcome', es: 'Bienvenido', fr: 'Bienvenue', de: 'Willkommen', it: 'Benvenuto', pt: 'Bem-vindo', ja: 'ようこそ', ko: '환영합니다', zh: '欢迎', ru: 'Добро пожаловать', ar: 'أهلا وسهلا' },
  'excuse me': { en: 'Excuse me', es: 'Disculpe', fr: 'Excusez-moi', de: 'Entschuldigung', it: 'Scusi', pt: 'Com licença', ja: 'すみません', ko: '실례합니다', zh: '打扰一下', ru: 'Извините', ar: 'عفوا' },
  'sorry': { en: 'I\'m sorry', es: 'Lo siento', fr: 'Je suis désolé', de: 'Es tut mir leid', it: 'Mi dispiace', pt: 'Desculpe', ja: 'ごめんなさい', ko: '죄송합니다', zh: '对不起', ru: 'Извините', ar: 'أنا آسف' },
  'help': { en: 'Help', es: 'Ayuda', fr: 'Aide', de: 'Hilfe', it: 'Aiuto', pt: 'Ajuda', ja: 'ヘルプ', ko: '도움말', zh: '帮助', ru: 'Помощь', ar: 'مساعدة' },
  'yes please': { en: 'Yes, please', es: 'Sí, por favor', fr: 'Oui, s\'il vous plaît', de: 'Ja, bitte', it: 'Sì, grazie', pt: 'Sim, por favor', ja: 'はい、お願いします', ko: '네, 제발', zh: '好的，请', ru: 'Да, пожалуйста', ar: 'نعم من فضلك' },
  'i don\'t understand': { en: 'I don\'t understand', es: 'No entiendo', fr: 'Je ne comprends pas', de: 'Ich verstehe nicht', it: 'Non capisco', pt: 'Não entendo', ja: '分かりません', ko: '이해가 안 돼요', zh: '我不明白', ru: 'Я не понимаю', ar: 'أنا لا أفهم' },
  'do you speak english': { en: 'Do you speak English?', es: '¿Habla inglés?', fr: 'Parlez-vous anglais?', de: 'Sprechen Sie Englisch?', it: 'Parla inglese?', pt: 'Você fala inglês?', ja: '英語を話せますか?', ko: '영어 할 줄 아세요?', zh: '你会说英语吗?', ru: 'Вы говорите по-английски?', ar: 'هل تتكلم الإنجليزية؟' },
};

const commonWords: Record<string, Record<Language, string>> = {
  'the': { en: 'the', es: 'el', fr: 'le', de: 'der', it: 'il', pt: 'o', ja: '', ko: '', zh: '', ru: '', ar: '' },
  'a': { en: 'a', es: 'un', fr: 'un', de: 'ein', it: 'un', pt: 'um', ja: '', ko: '', zh: '', ru: '', ar: '' },
  'an': { en: 'an', es: 'un', fr: 'un', de: 'ein', it: 'un', pt: 'um', ja: '', ko: '', zh: '', ru: '', ar: '' },
  'is': { en: 'is', es: 'es', fr: 'est', de: 'ist', it: 'è', pt: 'é', ja: 'です', ko: '입니다', zh: '是', ru: '', ar: '' },
  'are': { en: 'are', es: 'son', fr: 'sont', de: 'sind', it: 'sono', pt: 'são', ja: 'です', ko: '입니다', zh: '是', ru: '', ar: '' },
  'was': { en: 'was', es: 'era', fr: 'était', de: 'war', it: 'era', pt: 'era', ja: 'だった', ko: '이었다', zh: '是', ru: '', ar: '' },
  'were': { en: 'were', es: 'eran', fr: 'étaient', de: 'waren', it: 'erano', pt: 'eram', ja: 'だった', ko: '이었다', zh: '是', ru: '', ar: '' },
  'i': { en: 'I', es: 'yo', fr: 'je', de: 'ich', it: 'io', pt: 'eu', ja: '私は', ko: '나는', zh: '我', ru: '', ar: '' },
  'you': { en: 'you', es: 'tú', fr: 'vous', de: 'du', it: 'tu', pt: 'você', ja: 'あなた', ko: '당신', zh: '你', ru: '', ar: '' },
  'he': { en: 'he', es: 'él', fr: 'il', de: 'er', it: 'lui', pt: 'ele', ja: '彼', ko: '그', zh: '他', ru: '', ar: '' },
  'she': { en: 'she', es: 'ella', fr: 'elle', de: 'sie', it: 'lei', pt: 'ela', ja: '彼女', ko: '그녀', zh: '她', ru: '', ar: '' },
  'we': { en: 'we', es: 'nosotros', fr: 'nous', de: 'wir', it: 'noi', pt: 'nós', ja: '私たち', ko: '우리', zh: '我们', ru: '', ar: '' },
  'they': { en: 'they', es: 'ellos', fr: 'ils', de: 'sie', it: 'loro', pt: 'eles', ja: '彼ら', ko: '그들', zh: '他们', ru: '', ar: '' },
  'it': { en: 'it', es: 'lo', fr: 'il', de: 'es', it: 'esso', pt: 'isso', ja: 'それ', ko: '그것', zh: '它', ru: '', ar: '' },
  'this': { en: 'this', es: 'esto', fr: 'ceci', de: 'dies', it: 'questo', pt: 'isto', ja: 'これ', ko: '이것', zh: '这', ru: '', ar: '' },
  'that': { en: 'that', es: 'eso', fr: 'cela', de: 'das', it: 'quello', pt: 'aquilo', ja: 'あれ', ko: '그것', zh: '那', ru: '', ar: '' },
  'what': { en: 'what', es: 'qué', fr: 'quoi', de: 'was', it: 'cosa', pt: 'o quê', ja: '何', ko: '무엇', zh: '什么', ru: '', ar: '' },
  'where': { en: 'where', es: 'dónde', fr: 'où', de: 'wo', it: 'dove', pt: 'onde', ja: 'どこ', ko: '어디', zh: '哪里', ru: '', ar: '' },
  'when': { en: 'when', es: 'cuándo', fr: 'quand', de: 'wann', it: 'quando', pt: 'quando', ja: 'いつ', ko: '언제', zh: '什么时候', ru: '', ar: '' },
  'why': { en: 'why', es: 'por qué', fr: 'pourquoi', de: 'warum', it: 'perché', pt: 'por quê', ja: 'なぜ', ko: '왜', zh: '为什么', ru: '', ar: '' },
  'how': { en: 'how', es: 'cómo', fr: 'comment', de: 'wie', it: 'come', pt: 'como', ja: 'どのように', ko: '어떻게', zh: '怎样', ru: '', ar: '' },
  'who': { en: 'who', es: 'quién', fr: 'qui', de: 'wer', it: 'chi', pt: 'quem', ja: '誰', ko: '누가', zh: '谁', ru: '', ar: '' },
  'have': { en: 'have', es: 'tener', fr: 'avoir', de: 'haben', it: 'avere', pt: 'ter', ja: '持っている', ko: '가지다', zh: '有', ru: '', ar: '' },
  'has': { en: 'has', es: 'tiene', fr: 'a', de: 'hat', it: 'ha', pt: 'tem', ja: '持っている', ko: '가지다', zh: '有', ru: '', ar: '' },
  'do': { en: 'do', es: 'hacer', fr: 'faire', de: 'tun', it: 'fare', pt: 'fazer', ja: 'する', ko: '하다', zh: '做', ru: '', ar: '' },
  'does': { en: 'does', es: 'hace', fr: 'fait', de: 'tut', it: 'fa', pt: 'faz', ja: 'する', ko: '하다', zh: '做', ru: '', ar: '' },
  'can': { en: 'can', es: 'poder', fr: 'pouvoir', de: 'können', it: 'potere', pt: 'poder', ja: 'できる', ko: '할 수 있다', zh: '能', ru: '', ar: '' },
  'want': { en: 'want', es: 'querer', fr: 'vouloir', de: 'wollen', it: 'volere', pt: 'querer', ja: '欲しい', ko: '원하다', zh: '要', ru: '', ar: '' },
  'need': { en: 'need', es: 'necesitar', fr: 'avoir besoin', de: 'brauchen', it: 'avere bisogno', pt: 'precisar', ja: '必要', ko: '필요하다', zh: '需要', ru: '', ar: '' },
  'go': { en: 'go', es: 'ir', fr: 'aller', de: 'gehen', it: 'andare', pt: 'ir', ja: '行く', ko: '가다', zh: '去', ru: '', ar: '' },
  'come': { en: 'come', es: 'venir', fr: 'venir', de: 'kommen', it: 'venire', pt: 'vir', ja: '来る', ko: '오다', zh: '来', ru: '', ar: '' },
  'see': { en: 'see', es: 'ver', fr: 'voir', de: 'sehen', it: 'vedere', pt: 'ver', ja: '見る', ko: '보다', zh: '看', ru: '', ar: '' },
  'know': { en: 'know', es: 'saber', fr: 'savoir', de: 'wissen', it: 'sapere', pt: 'saber', ja: '知る', ko: '알다', zh: '知道', ru: '', ar: '' },
  'think': { en: 'think', es: 'pensar', fr: 'penser', de: 'denken', it: 'pensare', pt: 'pensar', ja: '思う', ko: '생각하다', zh: '想', ru: '', ar: '' },
  'say': { en: 'say', es: 'decir', fr: 'dire', de: 'sagen', it: 'dire', pt: 'dizer', ja: '言う', ko: '말하다', zh: '说', ru: '', ar: '' },
  'good': { en: 'good', es: 'bueno', fr: 'bon', de: 'gut', it: 'buono', pt: 'bom', ja: '良い', ko: '좋다', zh: '好', ru: '', ar: '' },
  'bad': { en: 'bad', es: 'malo', fr: 'mauvais', de: 'schlecht', it: 'cattivo', pt: 'mau', ja: '悪い', ko: '나쁘다', zh: '坏', ru: '', ar: '' },
  'big': { en: 'big', es: 'grande', fr: 'grand', de: 'groß', it: 'grande', pt: 'grande', ja: '大きい', ko: '크다', zh: '大', ru: '', ar: '' },
  'small': { en: 'small', es: 'pequeño', fr: 'petit', de: 'klein', it: 'piccolo', pt: 'pequeno', ja: '小さい', ko: '작다', zh: '小', ru: '', ar: '' },
  'new': { en: 'new', es: 'nuevo', fr: 'nouveau', de: 'neu', it: 'nuovo', pt: 'novo', ja: '新しい', ko: '새로운', zh: '新', ru: '', ar: '' },
  'old': { en: 'old', es: 'viejo', fr: 'vieux', de: 'alt', it: 'vecchio', pt: 'velho', ja: '古い', ko: '오래된', zh: '老', ru: '', ar: '' },
  'water': { en: 'water', es: 'agua', fr: 'eau', de: 'Wasser', it: 'acqua', pt: 'água', ja: '水', ko: '물', zh: '水', ru: '', ar: '' },
  'food': { en: 'food', es: 'comida', fr: 'nourriture', de: 'Essen', it: 'cibo', pt: 'comida', ja: '食べ物', ko: '음식', zh: '食物', ru: '', ar: '' },
  'house': { en: 'house', es: 'casa', fr: 'maison', de: 'Haus', it: 'casa', pt: 'casa', ja: '家', ko: '집', zh: '房子', ru: '', ar: '' },
  'car': { en: 'car', es: 'coche', fr: 'voiture', de: 'Auto', it: 'macchina', pt: 'carro', ja: '車', ko: '자동차', zh: '汽车', ru: '', ar: '' },
  'book': { en: 'book', es: 'libro', fr: 'livre', de: 'Buch', it: 'libro', pt: 'livro', ja: '本', ko: '책', zh: '书', ru: '', ar: '' },
  'time': { en: 'time', es: 'tiempo', fr: 'temps', de: 'Zeit', it: 'tempo', pt: 'tempo', ja: '時間', ko: '시간', zh: '时间', ru: '', ar: '' },
  'day': { en: 'day', es: 'día', fr: 'jour', de: 'Tag', it: 'giorno', pt: 'dia', ja: '日', ko: '날', zh: '天', ru: '', ar: '' },
  'year': { en: 'year', es: 'año', fr: 'an', de: 'Jahr', it: 'anno', pt: 'ano', ja: '年', ko: '해', zh: '年', ru: '', ar: '' },
  'person': { en: 'person', es: 'persona', fr: 'personne', de: 'Person', it: 'persona', pt: 'pessoa', ja: '人', ko: '사람', zh: '人', ru: '', ar: '' },
  'man': { en: 'man', es: 'hombre', fr: 'homme', de: 'Mann', it: 'uomo', pt: 'homem', ja: '男', ko: '남자', zh: '男人', ru: '', ar: '' },
  'woman': { en: 'woman', es: 'mujer', fr: 'femme', de: 'Frau', it: 'donna', pt: 'mulher', ja: '女', ko: '여자', zh: '女人', ru: '', ar: '' },
  'child': { en: 'child', es: 'niño', fr: 'enfant', de: 'Kind', it: 'bambino', pt: 'criança', ja: '子供', ko: '아이', zh: '孩子', ru: '', ar: '' },
  'friend': { en: 'friend', es: 'amigo', fr: 'ami', de: 'Freund', it: 'amico', pt: 'amigo', ja: '友達', ko: '친구', zh: '朋友', ru: '', ar: '' },
  'family': { en: 'family', es: 'familia', fr: 'famille', de: 'Familie', it: 'famiglia', pt: 'família', ja: '家族', ko: '가족', zh: '家庭', ru: '', ar: '' },
  'work': { en: 'work', es: 'trabajo', fr: 'travail', de: 'Arbeit', it: 'lavoro', pt: 'trabalho', ja: '仕事', ko: '일', zh: '工作', ru: '', ar: '' },
  'money': { en: 'money', es: 'dinero', fr: 'argent', de: 'Geld', it: 'soldi', pt: 'dinheiro', ja: 'お金', ko: '돈', zh: '钱', ru: '', ar: '' },
  'love': { en: 'love', es: 'amor', fr: 'amour', de: 'Liebe', it: 'amore', pt: 'amor', ja: '愛', ko: '사랑', zh: '爱', ru: '', ar: '' },
  'happy': { en: 'happy', es: 'feliz', fr: 'heureux', de: 'glücklich', it: 'felice', pt: 'feliz', ja: '幸せ', ko: '행복', zh: '快乐', ru: '', ar: '' },
  'sad': { en: 'sad', es: 'triste', fr: 'triste', de: 'traurig', it: 'triste', pt: 'triste', ja: '悲しい', ko: '슬프다', zh: '悲伤', ru: '', ar: '' },
  'beautiful': { en: 'beautiful', es: 'hermoso', fr: 'beau', de: 'schön', it: 'bello', pt: 'bonito', ja: '美しい', ko: '아름답다', zh: '美丽', ru: '', ar: '' },
  'hot': { en: 'hot', es: 'caliente', fr: 'chaud', de: 'heiß', it: 'caldo', pt: 'quente', ja: '暑い', ko: '뜨겁다', zh: '热', ru: '', ar: '' },
  'cold': { en: 'cold', es: 'frío', fr: 'froid', de: 'kalt', it: 'freddo', pt: 'frio', ja: '寒い', ko: '차가운', zh: '冷', ru: '', ar: '' },
  'easy': { en: 'easy', es: 'fácil', fr: 'facile', de: 'einfach', it: 'facile', pt: 'fácil', ja: '簡単', ko: '쉽다', zh: '容易', ru: '', ar: '' },
  'difficult': { en: 'difficult', es: 'difícil', fr: 'difficile', de: 'schwierig', it: 'difficile', pt: 'difícil', ja: '難しい', ko: '어렵다', zh: '难', ru: '', ar: '' },
};

export interface TranslationResult {
  translated: string;
  matchType: 'phrase' | 'word' | 'passthrough';
  confidence: number;
}

export function translate(text: string, fromLang: Language, toLang: Language): TranslationResult {
  if (fromLang === toLang) {
    return { translated: text, matchType: 'passthrough', confidence: 100 };
  }

  const normalizedText = text.toLowerCase().trim();

  const phraseKey = Object.keys(commonPhrases).find(
    phrase => normalizedText === phrase.toLowerCase() || normalizedText === phrase.toLowerCase() + '?'
  );
  
  if (phraseKey && commonPhrases[phraseKey][toLang]) {
    return {
      translated: commonPhrases[phraseKey][toLang],
      matchType: 'phrase',
      confidence: 100,
    };
  }

  const words = normalizedText.split(/\s+/);
  const translatedWords: string[] = [];
  let wordMatchCount = 0;

  for (const word of words) {
    const cleanWord = word.replace(/[.,!?;:'"()]/g, '');
    const punctuation = word.slice(cleanWord.length);
    
    if (commonWords[cleanWord]?.[toLang]) {
      translatedWords.push(commonWords[cleanWord][toLang] + punctuation);
      wordMatchCount++;
    } else {
      translatedWords.push(word);
    }
  }

  const confidence = words.length > 0 ? (wordMatchCount / words.length) * 100 : 0;

  return {
    translated: translatedWords.join(' '),
    matchType: wordMatchCount > 0 ? 'word' : 'passthrough',
    confidence: Math.round(confidence),
  };
}

export function detectLanguage(text: string): Language {
  const normalizedText = text.toLowerCase().trim();
  
  for (const [phrase, translations] of Object.entries(commonPhrases)) {
    if (normalizedText.includes(phrase.toLowerCase())) {
      const entry = Object.entries(translations).find(([lang]) => lang !== 'en');
      if (entry) {
        const lang = entry[0] as Language;
        if (normalizedText.includes(translations[lang].toLowerCase())) {
          return lang;
        }
      }
    }
  }
  
  return 'en';
}

export function getLanguageName(code: Language): string {
  return languages.find(l => l.code === code)?.name || code;
}

export function getLanguageNativeName(code: Language): string {
  return languages.find(l => l.code === code)?.nativeName || code;
}
