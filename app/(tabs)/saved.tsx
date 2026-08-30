import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, ChefHat, Sparkles, Trash2, ArrowRight } from 'lucide-react-native';
import { RecipeCard } from '../../components/RecipeCard';
import { StorageService } from '../../services/storageService';
import { Recipe } from '../../types';

export default function SavedScreen() {
  const router = useRouter();
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = async () => {
    try {
      const recipes = await StorageService.getSavedRecipes();
      setSavedRecipes(recipes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleToggleSave = async (recipe: Recipe) => {
    await StorageService.toggleSaveRecipe(recipe);
    await loadSaved();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>❤️ Kaydedilen Tarifler</Text>
        <Text style={styles.subtitle}>
          Daha önce oluşturduğunuz ve beğendiğiniz sıfır israf tarifleri.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {savedRecipes.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBox}>
              <Heart size={40} color="#F87171" />
            </View>
            <Text style={styles.emptyTitle}>Henüz Kayıtlı Tarifiniz Yok</Text>
            <Text style={styles.emptyDesc}>
              Buzdolabınızı tarayıp yapay zekanın ürettiği lezzetli tarifleri kalp ikonuna basarak buraya ekleyebilirsiniz.
            </Text>
            <TouchableOpacity
              style={styles.scanBtn}
              onPress={() => router.push('/(tabs)/scan')}
            >
              <ChefHat size={18} color="#FFFFFF" />
              <Text style={styles.scanBtnText}>Dolabı Tara & Tarif Yarat</Text>
            </TouchableOpacity>
          </View>
        ) : (
          savedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isSaved={true}
              onToggleSave={() => handleToggleSave(recipe)}
              onPress={() => {
                router.push({
                  pathname: '/recipe/[id]',
                  params: { id: recipe.id, recipeJson: JSON.stringify(recipe) },
                });
              }}
            />
          ))
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  scanBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
