import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiImage, FiPlus, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function AddRecipe() {
  const [ingredients, setIngredients] = useState(['', '', '']);
  const [steps, setSteps] = useState(['', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddIngredient = () => setIngredients([...ingredients, '']);
  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const handleAddStep = () => setSteps([...steps, '']);
  const handleRemoveStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  const resetForm = () => {
    setImagePreview(null);
    setIngredients(['', '', '']);
    setSteps(['', '']);
    setIsSuccess(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Create New <span className="text-primary">Recipe</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Share your culinary masterpiece with the community.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="glass p-8 md:p-10 rounded-3xl"
          >
            <div className="space-y-10">
              
              {/* Image Upload UI */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Recipe Photo</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-surface/50 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors cursor-pointer group overflow-hidden"
                >
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FiImage size={28} />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">Click to upload image</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">JPG, PNG or WEBP (Max. 5MB)</p>
                    </>
                  )}
                </div>
              </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Recipe Title" placeholder="E.g. Classic Margherita Pizza" required className="md:col-span-2" />
            <Input label="Cooking Time" placeholder="E.g. 45 mins" required />
            <Input label="Servings" placeholder="E.g. 4 people" type="number" required />
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
              <textarea 
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none resize-none"
                rows={4}
                placeholder="Briefly describe your recipe..."
                required
              />
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <label className="block text-lg font-bold text-gray-900 dark:text-white">Ingredients</label>
              <Button type="button" variant="ghost" size="sm" onClick={handleAddIngredient} leftIcon={<FiPlus />}>Add Item</Button>
            </div>
            <div className="space-y-3">
              {ingredients.map((_, idx) => (
                <div key={`ing-${idx}`} className="flex items-center gap-3">
                  <Input placeholder={`Ingredient ${idx + 1}`} required className="flex-1" />
                  <button type="button" onClick={() => handleRemoveIngredient(idx)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                    <FiTrash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <label className="block text-lg font-bold text-gray-900 dark:text-white">Instructions</label>
              <Button type="button" variant="ghost" size="sm" onClick={handleAddStep} leftIcon={<FiPlus />}>Add Step</Button>
            </div>
            <div className="space-y-4">
              {steps.map((_, idx) => (
                <div key={`step-${idx}`} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-dark-surface/50 border border-gray-100 dark:border-gray-800">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <textarea 
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-800 dark:text-gray-200 resize-none outline-none"
                      rows={2}
                      placeholder={`Describe step ${idx + 1}...`}
                      required
                    />
                  </div>
                  <button type="button" onClick={() => handleRemoveStep(idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <FiTrash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-4">
            <Button type="button" variant="outline" size="lg">Cancel</Button>
            <Button type="submit" size="lg" className="px-10" isLoading={isLoading}>
              Publish Recipe
            </Button>
          </div>

          </div>
        </motion.form>
      ) : (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 rounded-3xl flex flex-col items-center justify-center text-center"
        >
          <div className="w-24 h-24 rounded-full bg-green-100 text-green-500 flex items-center justify-center mb-6">
            <FiCheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Recipe Published!</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md">
            Your amazing recipe has been shared with the YumCircle community.
          </p>
          <Button onClick={resetForm} size="lg">Add Another Recipe</Button>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
