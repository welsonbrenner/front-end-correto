import { Size, Ingredient, MarmitaItem } from '../types';
import { Package, Plus, UtensilsCrossed, DollarSign, AlertCircle, FileText, Trash2 } from 'lucide-react';
import { marmitaPrices, extraItems } from '../data/ingredients';

interface MarmitaBuilderProps {
  ingredients: Ingredient[];
  selectedSize: Size;
  selectedIngredients: string[];
  selectedExtras: string[];
  observation: string;
  marmitas: MarmitaItem[];
  onSizeChange: (size: Size) => void;
  onIngredientToggle: (id: string) => void;
  onExtraToggle: (id: string) => void;
  onObservationChange: (text: string) => void;
  onAddMarmita: () => void;
  onRemoveMarmita: (id: string) => void;
  onProceedToCheckout: () => void;
}

export function MarmitaBuilder({
  ingredients,
  selectedSize,
  selectedIngredients,
  selectedExtras,
  observation,
  marmitas,
  onSizeChange,
  onIngredientToggle,
  onExtraToggle,
  onObservationChange,
  onAddMarmita,
  onRemoveMarmita,
  onProceedToCheckout,
}: MarmitaBuilderProps) {
  const activeIngredients = ingredients.filter((ing) => ing.active);

  const selectedRice = selectedIngredients.filter(id => ingredients.find(i => i.id === id)?.category === 'rice');
  const selectedBeans = selectedIngredients.filter(id => ingredients.find(i => i.id === id)?.category === 'beans');
  const selectedMeats = selectedIngredients.filter(id => ingredients.find(i => i.id === id)?.category === 'meat');

  const hasRequiredIngredients = selectedRice.length === 1 && selectedMeats.length > 0;

  const calculateMarmitaPrice = () => {
    const basePrice = marmitaPrices[selectedSize];
    const extrasPrice = selectedExtras.reduce((total, extraId) => {
      const extra = extraItems.find(e => e.id === extraId);
      return total + (extra?.price || 0);
    }, 0);
    return basePrice + extrasPrice;
  };

  return (
    <div className="elegant-card p-4 md:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
          <UtensilsCrossed className="w-6 h-6 text-amber-500" />
          Monte sua Marmita
        </h2>
      </div>

      {/* Tamanhos */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center justify-between">
          <span>1. Escolha o Tamanho</span>
          <span className="text-amber-600 flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            {marmitaPrices[selectedSize].toFixed(2)}
          </span>
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {(['small', 'medium', 'large'] as Size[]).map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={`py-3 px-4 rounded-xl transition-all duration-200 text-sm ${
                selectedSize === size
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105'
                  : 'bg-white hover:bg-amber-50 text-gray-700 border border-amber-200'
              }`}
            >
              {size === 'small' ? 'Pequena' : size === 'medium' ? 'Média' : 'Grande'}
            </button>
          ))}
        </div>
      </div>

      {/* Ingredientes por Categoria */}
      {['rice', 'beans', 'meat', 'sides'].map((category, index) => {
        const categoryIngredients = activeIngredients.filter(ing => ing.category === category);
        if (categoryIngredients.length === 0) return null;

        return (
          <div key={category} className="mb-6">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-500" />
                {index + 2}. {category === 'rice' ? 'Arroz' : category === 'beans' ? 'Feijão' : category === 'meat' ? 'Carnes' : 'Acompanhamentos'}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                {category === 'rice' && 'Escolha 1 tipo de arroz'}
                {category === 'beans' && 'Escolha 1 tipo de feijão'}
                {category === 'meat' && 'Escolha até 2 carnes'}
                {category === 'sides' && 'Escolha quantos quiser'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {categoryIngredients.map(ingredient => (
                <button
                  key={ingredient.id}
                  onClick={() => onIngredientToggle(ingredient.id)}
                  disabled={
                    !selectedIngredients.includes(ingredient.id) &&
                    ((ingredient.category === 'rice' && selectedRice.length >= 1) ||
                    (ingredient.category === 'beans' && selectedBeans.length >= 1) ||
                    (ingredient.category === 'meat' && selectedMeats.length >= 2))
                  }
                  className={`p-3 rounded-xl text-left transition-all duration-200 ${
                    selectedIngredients.includes(ingredient.id)
                      ? 'bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-500 shadow-md'
                      : 'bg-white hover:bg-amber-50 border border-amber-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {ingredient.name}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {/* Extras */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <Package className="w-4 h-4 text-amber-500" /> 6. Adicionais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {extraItems.map(extra => (
            <button
              key={extra.id}
              onClick={() => onExtraToggle(extra.id)}
              className={`p-3 rounded-xl text-left transition-all duration-200 ${
                selectedExtras.includes(extra.id)
                  ? 'bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-500 shadow-md'
                  : 'bg-white hover:bg-amber-50 border border-amber-200'
              }`}
            >
              <div className="flex justify-between">
                <span>{extra.name}</span>
                <span className="text-amber-600 font-medium">R$ {extra.price.toFixed(2)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Observação */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-500" /> 7. Observações
        </h3>
        <textarea
          value={observation}
          onChange={(e) => onObservationChange(e.target.value)}
          className="elegant-input min-h-[100px] w-full"
          placeholder="Alguma observação especial? (opcional)"
        />
      </div>

      {/* Adicionar Marmita */}
      <div className="mt-8 border-t border-amber-200 pt-6">
        <div className="mb-4 text-right">
          <p className="text-base font-semibold text-gray-800">
            Total desta marmita: <span className="text-amber-600">R$ {calculateMarmitaPrice().toFixed(2)}</span>
          </p>
        </div>
        <button
          onClick={onAddMarmita}
          disabled={!hasRequiredIngredients}
          className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm ${
            hasRequiredIngredients ? 'elegant-button-primary' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Plus className="w-5 h-5" />
          {hasRequiredIngredients ? 'Adicionar Marmita ao Pedido' : 'Selecione arroz e carne'}
        </button>
      </div>

      {/* Marmitas adicionadas */}
      {marmitas.length > 0 && (
        <div className="mt-8 border-t border-amber-200 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Marmitas no Pedido:</h3>
          <div className="space-y-4">
            {marmitas.map(m => (
              <div key={m.id} className="flex items-center justify-between bg-white border border-amber-200 p-3 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800">
                    Marmita {m.size === 'small' ? 'Pequena' : m.size === 'medium' ? 'Média' : 'Grande'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {m.ingredients.map(id => ingredients.find(i => i.id === id)?.name).filter(Boolean).join(', ')}
                  </p>
                  {m.extras && m.extras.length > 0 && (
                    <p className="text-sm text-amber-600">Adicionais: {m.extras.map(id => extraItems.find(e => e.id === id)?.name).filter(Boolean).join(', ')}</p>
                  )}
                </div>
                <button onClick={() => onRemoveMarmita(m.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          <button onClick={onProceedToCheckout} className="w-full mt-6 elegant-button-primary">
            Prosseguir para Pagamento
          </button>
        </div>
      )}
    </div>
  );
}
