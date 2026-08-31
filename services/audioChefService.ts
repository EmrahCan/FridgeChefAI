import * as Speech from 'expo-speech';
import { SupportedLanguage } from '../constants/Translations';

export const AudioChefService = {
  /**
   * Reads a recipe step or text aloud with natural chef pacing
   */
  async speakStep(
    title: string,
    description: string,
    tip: string = '',
    lang: SupportedLanguage = 'en',
    onDone?: () => void
  ) {
    await this.stop();

    const locale = lang === 'tr' ? 'tr-TR' : 'en-US';
    const textToSpeak = tip
      ? `${title}. ${description}. ${lang === 'tr' ? 'Şefin ipucu: ' : "Chef's tip: "}${tip}`
      : `${title}. ${description}.`;

    Speech.speak(textToSpeak, {
      language: locale,
      pitch: 1.0,
      rate: 0.92, // Natural, easy to follow while cooking
      onDone: onDone,
      onError: (err) => console.warn('TTS error', err),
    });
  },

  async isSpeaking(): Promise<boolean> {
    return await Speech.isSpeakingAsync();
  },

  async stop() {
    try {
      await Speech.stop();
    } catch (e) {
      console.warn('Speech stop error', e);
    }
  }
};
