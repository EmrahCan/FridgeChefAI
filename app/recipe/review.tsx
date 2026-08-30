import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Plus, Sparkles, ChefHat, Flame, Check, Info } from 'lucide-react-native';
import { IngredientTag } from '../../components/IngredientTag';
import { RecipeCard } from '../../components/RecipeCard';
import { CookingStyle, DetectedIngredient, Recipe } from '../../types';
import { GeminiService } from '../../services/geminiService';
import { StorageService } from '../../services/storageService';
import * as Haptics from 'expo-haptics';

const STYLES: { id: CookingStyle; label: string; icon: string }[] = [
  { id: 'hepsi', label: 'Tüm Fikirler ✨', icon: '✨' },
  { id: 'hizli', label: 'Pratik (<20 dk) ⚡', icon: '⚡' },
  { id: 'firinda', label: 'Fırın & Graten 🥧', icon: '🥧' },
  { id: 'corba', label: 'Şifalı Çorba 🍲', icon: '🍲' },
  { id: 'fit', label: 'Fit & Düşük Kalori 🥗', icon: '🥗' },
  { id: 'cocuk', label: 'Çocuk Dostu 🍕', icon: '🍕' },
];

export default function ReviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    ingredientsJson?: string;
    summaryText?: string;
  }>();

  const initialIngredients: DetectedIngredient[] = params.ingredientsJson
    ? JSON.parse(params.ingredientsJson)
    : [];

  const [ingredients, setIngredients] = useState<DetectedIngredient[]>(initialIngredients);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<CookingStyle>('hepsi');
  const [customNote, setCustomNote] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

  const handleAddIngredient = () => {
    if (!newIngredientName.trim()) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    const newItem: DetectedIngredient = {
      id: `custom-${Date.now()}`,
      name: newIngredientName.trim(),
      category: 'Kalan Yemek',
      confidence: 1.0,
      suggestedAction: 'Hemen Tüket',
    };

    setIngredients((prev) => [...prev, newItem]);
    setNewIngredientName('');
  };

  const handleRemoveIngredient = (id: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  const handleGenerateRecipes = async () => {
    if (ingredients.length === 0) {
      Alert.alert('Malzeme Yok', 'Lütfen tarif üretmek için en az 1 adet malzeme ekleyin.');
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    setIsGenerating(true);

    try {
      const ingredientNames = ingredients.map((i) => i.name);
      const recipes = await GeminiService.generateRecipes(
        ingredientNames,
        selectedStyle,
        customNote
      );

      const saved = await StorageService.getSavedRecipes();
      setSavedRecipes(saved);
      setGeneratedRecipes(recipes);
    } catch (err) {
      Alert.alert('Tarif Hatası', 'Tarifler üretilirken bir sorun oluştu.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleSave = async (recipe: Recipe) => {
    await StorageService.toggleSaveRecipe(recipe);
    const updated = await StorageService.getSavedRecipes();
    setSavedRecipes(updated);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Malzemeleri İncele</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* AI Detection Summary */}
        {params.summaryText && (
          <View style={styles.summaryBox}>
            <Sparkles size={18} color="#059669" />
            <Text style={styles.summaryText}>{params.summaryText}</Text>
          </View>
        )}

        {/* Section 1: Detected Ingredients */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dolaptaki Tespit Edilen Malzemeler</Text>
            <Text style={styles.sectionSubtitle}>
              İstemediğiniz malzemeyi (x) ile çıkarabilir, alttan yeni malzeme ekleyebilirsiniz.
            </Text>
          </View>

          <View style={styles.tagsWrapper}>
            {ingredients.map((item) => (
              <IngredientTag
                key={item.id}
                ingredient={item}
                onRemove={() => handleRemoveIngredient(item.id)}
              />
            ))}
          </View>

          {/* Add Custom Ingredient Input */}
          <View style={styles.addInputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Örn: 2 yumurta, yarım limon..."
              placeholderTextColor="#9CA3AF"
              value={newIngredientName}
              onChangeText={setNewIngredientName}
              onSubmitEditing={handleAddIngredient}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.addBtn}
              onPress={handleAddIngredient}
              disabled={!newIngredientName.trim()}
            >
              <Plus size={18} color="#FFFFFF" />
              <Text style={styles.addBtnText}>Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 2: Cooking Style Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍🍳 Hangi Tarzda Pişirelim?</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stylesScroll}
          >
            {STYLES.map((st) => {
              const isSelected = selectedStyle === st.id;
              return (
                <TouchableOpacity
                  key={st.id}
                  style={[styles.styleChip, isSelected && styles.styleChipSelected]}
                  onPress={() => {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } catch {}
                    setSelectedStyle(st.id);
                  }}
                >
                  <Text
                    style={[styles.styleChipText, isSelected && styles.styleChipTextSelected]}
                  >
                    {st.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Section 3: Custom Note */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Şefe Özel Not (İsteğe Bağlı)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Örn: Fırınım yok tavada olsun, acı olmasın..."
            placeholderTextColor="#9CA3AF"
            value={customNote}
            onChangeText={setCustomNote}
          />
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateBtn, isGenerating && styles.generateBtnDisabled]}
          onPress={handleGenerateRecipes}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={styles.generateBtnText}>Şef Tarifleri Hazırlıyor...</Text>
            </View>
          ) : (
            <View style={styles.btnRow}>
              <Sparkles size={20} color="#FFFFFF" />
              <Text style={styles.generateBtnText}>Sıfır İsraf Tariflerini Oluştur</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Section 4: Generated Recipes Results */}
        {generatedRecipes.length > 0 && (
          <View style={styles.resultsSection}>
            <View style={styles.resultsHeader}>
              <ChefHat size={22} color="#10B981" />
              <Text style={styles.resultsTitle}>
                Yapay Zekanın Sizin İçin Ürettiği Özel Tarifler
              </Text>
            </View>

            {generatedRecipes.map((recipe) => {
              const isSaved = savedRecipes.some((r) => r.id === recipe.id);
              return (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isSaved={isSaved}
                  onToggleSave={() => handleToggleSave(recipe)}
                  onPress={() => {
                    router.push({
                      pathname: '/recipe/[id]',
                      params: { id: recipe.id, recipeJson: JSON.stringify(recipe) },
                    });
                  }}
                />
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    padding: 6,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  summaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 20,
  },
  summaryText: {
    flex: 1,
    fontSize: 13,
    color: '#065F46',
    fontWeight: '600',
    lineHeight: 18,
  },
  section: {
    marginBottom: 22,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  addInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    borderRadius: 14,
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  stylesScroll: {
    paddingVertical: 8,
    gap: 8,
  },
  styleChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    marginRight: 6,
  },
  styleChipSelected: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  styleChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  styleChipTextSelected: {
    color: '#FFFFFF',
  },
  noteInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#111827',
  },
  generateBtn: {
    backgroundColor: '#10B981',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 24,
  },
  generateBtnDisabled: {
    backgroundColor: '#6EE7B7',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  resultsSection: {
    paddingTop: 10,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
  },
});
