import React, { useState } from 'react';
import { Ingredient } from '../types';
import { Settings2, Plus, X, Edit, Trash2, Save } from 'lucide-react';
import { Modal } from './Modal';

interface AdminPanelProps {
  ingredients: Ingredient[];
  onToggleIngredient: (id: string) => void;
  onUpdateIngredient: (ingredient: Ingredient) => void;
  onDeleteIngredient: (id: string) => void;
  onAddCategory: (name: string) => void;
}

export function AdminPanel({ 
  ingredients, 
  onToggleIngredient, 
  onUpdateIngredient,
  onDeleteIngredient,
  onAddCategory
}: AdminPanelProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    category: 'sides' as Ingredient['category']
  });

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `${newIngredient.category}-${Date.now()}`;
    const ingredient: Ingredient = {
      id,
      name: newIngredient.name,
      category: newIngredient.category,
      active: true
    };
    onToggleIngredient(id);
    setNewIngredient({ name: '', category: 'sides' });
    setShowAddForm(false);
  };

  const handleEditIngredient = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIngredient) {
      onUpdateIngredient(editingIngredient);
      setEditingIngredient(null);
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      onAddCategory(newCategory);
      setNewCategory('');
      setShowAddCategoryForm(false);
    }
  };

  return (
    <div className="elegant-card p-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Settings2 className="w-8 h-8 text-amber-500" />
          Painel do Administrador
        </h2>
        <p className="text-gray-600 mt-2">Gerencie os ingredientes disponíveis no cardápio</p>
      </div>

      <div className="mb-8 flex gap-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="elegant-button-primary flex-1 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Adicionar Ingrediente
        </button>
        <button
          onClick={() => setShowAddCategoryForm(true)}
          className="elegant-button-secondary flex-1 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Categoria
        </button>
      </div>

      <div className="space-y-8">
        {['rice', 'beans', 'meat', 'sides', 'salads'].map((category) => {
          const categoryIngredients = ingredients.filter((ing) => ing.category === category);
          if (categoryIngredients.length === 0) return null;

          return (
            <div key={category} className="border-b border-amber-200 pb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {category === 'rice' && 'Arroz'}
                {category === 'beans' && 'Feijão'}
                {category === 'meat' && 'Carnes'}
                {category === 'sides' && 'Acompanhamentos'}
                {category === 'salads' && 'Saladas'}
              </h3>
              <div className="space-y-3">
                {categoryIngredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="p-4 bg-white rounded-xl border border-amber-200 flex items-center justify-between"
                  >
                    <span className="text-gray-700 font-medium">{ingredient.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditIngredient(ingredient)}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDeleteIngredient(ingredient.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onToggleIngredient(ingredient.id)}
                        className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                          ingredient.active
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                      >
                        {ingredient.active ? 'Ativo' : 'Inativo'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Ingredient Modal */}
      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Adicionar Novo Ingrediente"
      >
        <form onSubmit={handleAddIngredient} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Ingrediente
            </label>
            <input
              type="text"
              required
              value={newIngredient.name}
              onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
              className="elegant-input"
              placeholder="Ex: Arroz Integral"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              required
              value={newIngredient.category}
              onChange={(e) => setNewIngredient({ ...newIngredient, category: e.target.value as Ingredient['category'] })}
              className="elegant-input"
            >
              <option value="rice">Arroz</option>
              <option value="beans">Feijão</option>
              <option value="meat">Carnes</option>
              <option value="sides">Acompanhamentos</option>
              <option value="salads">Saladas</option>
            </select>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="elegant-button-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="elegant-button-primary flex-1"
            >
              Adicionar
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Ingredient Modal */}
      <Modal
        isOpen={!!editingIngredient}
        onClose={() => setEditingIngredient(null)}
        title="Editar Ingrediente"
      >
        {editingIngredient && (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Ingrediente
              </label>
              <input
                type="text"
                required
                value={editingIngredient.name}
                onChange={(e) => setEditingIngredient({ ...editingIngredient, name: e.target.value })}
                className="elegant-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                required
                value={editingIngredient.category}
                onChange={(e) => setEditingIngredient({ ...editingIngredient, category: e.target.value as Ingredient['category'] })}
                className="elegant-input"
              >
                <option value="rice">Arroz</option>
                <option value="beans">Feijão</option>
                <option value="meat">Carnes</option>
                <option value="sides">Acompanhamentos</option>
                <option value="salads">Saladas</option>
              </select>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setEditingIngredient(null)}
                className="elegant-button-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="elegant-button-primary flex-1 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Salvar
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Add Category Modal */}
      <Modal
        isOpen={showAddCategoryForm}
        onClose={() => setShowAddCategoryForm(false)}
        title="Adicionar Nova Categoria"
      >
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Categoria
            </label>
            <input
              type="text"
              required
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="elegant-input"
              placeholder="Ex: Sobremesas"
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setShowAddCategoryForm(false)}
              className="elegant-button-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="elegant-button-primary flex-1"
            >
              Adicionar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}