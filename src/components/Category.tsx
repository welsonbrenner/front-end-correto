import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { 
  createCategoriaProduto, 
  getCategoriasProduto, 
  updateCategoriaProduto, 
  deleteCategoriaProduto 
} from '../services/api';

interface CategoriaProduto {
  id: number;
  nomeCategoriaProduto: string;
}

interface CategoryPanelProps {
  onBack: () => void;
}

export function CategoryPanel({ onBack }: CategoryPanelProps) {
  const [categorias, setCategorias] = useState<CategoriaProduto[]>([]);
  const [newCategoria, setNewCategoria] = useState('');
  const [editingCategoria, setEditingCategoria] = useState<CategoriaProduto | null>(null);

  const fetchCategorias = async () => {
    try {
      const response = await getCategoriasProduto();
      setCategorias(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleAddCategoria = async () => {
    if (!newCategoria.trim()) return;
    try {
      await createCategoriaProduto({ nomeCategoriaProduto: newCategoria });
      setNewCategoria('');
      fetchCategorias();
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
    }
  };

  const handleUpdateCategoria = async () => {
    if (editingCategoria) {
      try {
        await updateCategoriaProduto(editingCategoria.id, { nomeCategoriaProduto: editingCategoria.nomeCategoriaProduto });
        setEditingCategoria(null);
        fetchCategorias();
      } catch (error) {
        console.error('Erro ao atualizar categoria:', error);
      }
    }
  };

  const handleDeleteCategoria = async (id: number) => {
    try {
      await deleteCategoriaProduto(id);
      fetchCategorias();
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
    }
  };

  return (
    <div className="elegant-card p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gerenciar Categorias</h2>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={newCategoria}
          onChange={(e) => setNewCategoria(e.target.value)}
          placeholder="Nova categoria"
          className="elegant-input flex-1"
        />
        <button
          onClick={handleAddCategoria}
          className="elegant-button-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Adicionar
        </button>
      </div>

      <div className="space-y-4">
        {categorias.map((categoria) => (
          <div key={categoria.id} className="flex items-center justify-between bg-white border border-amber-200 p-3 rounded-xl">
            {editingCategoria?.id === categoria.id ? (
              <input
                type="text"
                value={editingCategoria.nomeCategoriaProduto}
                onChange={(e) => setEditingCategoria({ ...editingCategoria, nomeCategoriaProduto: e.target.value })}
                className="elegant-input flex-1"
              />
            ) : (
              <span className="text-gray-800 font-medium">{categoria.nomeCategoriaProduto}</span>
            )}
            <div className="flex items-center gap-2">
              {editingCategoria?.id === categoria.id ? (
                <>
                  <button
                    onClick={handleUpdateCategoria}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditingCategoria(null)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditingCategoria(categoria)}
                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategoria(categoria.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onBack}
        className="elegant-button-secondary mt-8"
      >
        Voltar
      </button>
    </div>
  );
}
