import { useEffect } from 'react';
import { OrderDetails } from '../types';
import { CheckCircle, ArrowRight, Clock, MapPin, FileText } from 'lucide-react';
import { extraItems, initialIngredients } from '../data/ingredients';
import { sendOrder, silentPrint } from '../services/api';

interface OrderConfirmationProps {
  orderDetails: OrderDetails;
  onNewOrder: () => void;
}

export function OrderConfirmation({ orderDetails, onNewOrder }: OrderConfirmationProps) {
  useEffect(() => {
    const processOrder = async () => {
      try {
        await sendOrder(orderDetails); // Envia via Evolution API
        silentPrint(orderDetails);     // Imprime localmente (silenciosamente)
      } catch (error) {
        console.error('Erro ao processar o pedido:', error);
        alert('Houve um problema ao finalizar seu pedido. Tente novamente.');
      }
    };

    processOrder();
  }, [orderDetails]);

  const getIngredientsByCategory = (ingredientIds: string[], category: string) => {
    return ingredientIds
      .map(id => initialIngredients.find(ing => ing.id === id))
      .filter(ing => ing && ing.category === category)
      .map(ing => ing!.name);
  };

  return (
    <div className="elegant-card p-8 max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4 mt-4">
          Pedido Confirmado!
        </h2>
        <p className="text-gray-600 text-lg">
          Obrigado pelo seu pedido, {orderDetails.customerName}!
        </p>
        <p className="text-gray-600">
          Telefone: {orderDetails.phone}
        </p>
      </div>
      
      {/* Tempo Estimado */}
      {orderDetails.estimatedTime && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl flex items-center gap-3 mb-6">
          <Clock className="w-5 h-5 text-amber-600" />
          <div>
            <p className="font-medium text-gray-800">Tempo Estimado:</p>
            <p className="text-amber-700">
              {orderDetails.estimatedTime.min === orderDetails.estimatedTime.max 
                ? `${orderDetails.estimatedTime.min} minutos`
                : `${orderDetails.estimatedTime.min}-${orderDetails.estimatedTime.max} minutos`}
            </p>
          </div>
        </div>
      )}

      {/* Detalhes do Pedido */}
      <div className="space-y-6">
        {orderDetails.marmitas.map((marmita, index) => (
          <div key={marmita.id} className="bg-white p-4 rounded-xl border border-amber-200">
            <h4 className="font-medium text-lg text-gray-800 mb-3">
              Marmita {index + 1} - {marmita.size.toUpperCase()}
            </h4>
            <div className="space-y-3 pl-4 border-l-2 border-amber-200">
              {['rice', 'beans', 'meat', 'sides', 'salads'].map((category) => {
                const items = getIngredientsByCategory(marmita.ingredients, category);
                return items.length > 0 ? (
                  <div key={category}>
                    <p className="font-medium text-amber-700 capitalize">{category}:</p>
                    <p className="text-gray-700">{items.join(', ')}</p>
                  </div>
                ) : null;
              })}
              {marmita.extras && marmita.extras.length > 0 && (
                <div>
                  <p className="font-medium text-amber-700">Adicionais:</p>
                  <p className="text-gray-700">
                    {marmita.extras
                      .map(id => extraItems.find(e => e.id === id)?.name)
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Observações */}
        {orderDetails.observation && (
          <div className="bg-white p-4 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-amber-600" />
              <h4 className="font-medium text-gray-800">Observações:</h4>
            </div>
            <p className="text-gray-700 pl-7">{orderDetails.observation}</p>
          </div>
        )}

        {/* Entrega */}
        {orderDetails.deliveryMethod === 'delivery' && orderDetails.address && (
          <div className="bg-white p-4 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-amber-600" />
              <h4 className="font-medium text-gray-800">Endereço de Entrega:</h4>
            </div>
            <p className="text-gray-700 pl-7">
              {orderDetails.address.street}, {orderDetails.address.number}
              {orderDetails.address.complement && `, ${orderDetails.address.complement}`}<br />
              {orderDetails.address.neighborhood} - {orderDetails.address.city}
            </p>
          </div>
        )}

        {/* Pagamento */}
        <div className="pt-4 border-t border-amber-200">
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Subtotal:</span>
            <span>R$ {(orderDetails.totalPrice - (orderDetails.deliveryFee || 0)).toFixed(2)}</span>
          </div>
          {orderDetails.deliveryFee && (
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Taxa de Entrega:</span>
              <span>R$ {orderDetails.deliveryFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-semibold text-gray-800">
            <span>Total:</span>
            <span className="text-amber-600">R$ {orderDetails.totalPrice.toFixed(2)}</span>
          </div>
          <p className="text-gray-600 text-sm mt-2">
            Forma de Pagamento: {orderDetails.paymentMethod.toUpperCase()}
          </p>
        </div>

        {/* Botão Novo Pedido */}
        <button
          onClick={onNewOrder}
          className="elegant-button-primary py-4 px-8 flex items-center gap-2 mx-auto mt-8"
        >
          Fazer Novo Pedido
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
