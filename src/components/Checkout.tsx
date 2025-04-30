import React, { useState } from 'react';
import { OrderDetails, PaymentMethod, DeliveryMethod, MarmitaItem, Address } from '../types';
import { MapPin, CreditCard, Wallet, QrCode, Building2, ArrowLeft, ShoppingBag, Phone, User } from 'lucide-react';
import { deliveryZones } from '../data/ingredients';
import { sendOrder } from '../services/api'; // ✅ Correto: usa o método da Evolution API

interface CheckoutProps {
  marmitas: MarmitaItem[];
  totalPrice: number;
  onBack: () => void;
  onComplete: (orderDetails: OrderDetails) => void;
}

export function Checkout({
  marmitas,
  totalPrice,
  onBack,
  onComplete,
}: CheckoutProps) {
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [changeFor, setChangeFor] = useState<string>('');
  const [address, setAddress] = useState<Address>({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
  });
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');

  const allNeighborhoods = deliveryZones.flatMap(zone => 
    zone.neighborhoods.map(neighborhood => ({ name: neighborhood, fee: zone.fee }))
  );

  const getDeliveryFee = (neighborhood: string) => {
    const zone = deliveryZones.find(zone => zone.neighborhoods.includes(neighborhood));
    return zone?.fee || 0;
  };

  const currentDeliveryFee = address.neighborhood ? getDeliveryFee(address.neighborhood) : 0;
  const finalTotal = totalPrice + currentDeliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedPhone = phone.replace(/\D/g, '');

    const orderDetails: OrderDetails = {
      deliveryMethod,
      paymentMethod,
      customerName,
      phone: cleanedPhone,
      marmitas,
      totalPrice: finalTotal,
      ...(deliveryMethod === 'delivery' && { address }),
      ...(paymentMethod === 'cash' && changeFor && { changeFor: parseFloat(changeFor) }),
    };

    try {
      await sendOrder(orderDetails); // ✅ Usa o envio via Evolution API corretamente
      onComplete(orderDetails); // ✅ Envia os dados completos
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      alert('Houve um problema ao finalizar seu pedido. Tente novamente.');
    }
  };

  return (
    <div className="elegant-card p-8">
      {/* Cabeçalho */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          Finalizar Pedido
        </h2>
        <p className="text-gray-600 mt-2">Complete seus dados para confirmar o pedido</p>
      </div>

      {/* Resumo do Pedido */}
      <div className="mb-8 p-4 bg-amber-50 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Resumo do Pedido ({marmitas.length} {marmitas.length === 1 ? 'marmita' : 'marmitas'})
          </h3>
        </div>
        <div className="space-y-2">
          {marmitas.map((marmita, index) => (
            <div key={marmita.id} className="bg-white p-3 rounded-lg border border-amber-200">
              <p className="font-medium text-gray-800">
                Marmita {index + 1} - {marmita.size === 'small' ? 'Pequena' : marmita.size === 'medium' ? 'Média' : 'Grande'}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-amber-200">
          <p className="text-lg font-semibold text-gray-800 flex justify-between">
            <span>Subtotal:</span>
            <span className="text-amber-600">R$ {totalPrice.toFixed(2)}</span>
          </p>
          {deliveryMethod === 'delivery' && address.neighborhood && (
            <p className="text-lg font-semibold text-gray-800 flex justify-between mt-2">
              <span>Taxa de Entrega:</span>
              <span className="text-amber-600">R$ {currentDeliveryFee.toFixed(2)}</span>
            </p>
          )}
          <p className="text-lg font-semibold text-gray-800 flex justify-between mt-2 pt-2 border-t border-amber-200">
            <span>Total:</span>
            <span className="text-amber-600">R$ {finalTotal.toFixed(2)}</span>
          </p>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Dados Pessoais */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <User className="w-5 h-5 text-amber-600" /> 1. Dados Pessoais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="elegant-input" placeholder="Seu nome completo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                <Phone className="w-4 h-4 text-amber-600" /> Telefone
              </label>
              <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="elegant-input" placeholder="(00) 00000-0000" />
            </div>
          </div>
        </div>

        {/* Método de Entrega */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">2. Método de Entrega</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button type="button" onClick={() => setDeliveryMethod('delivery')} className={`p-4 rounded-xl flex items-center transition-all duration-200 ${deliveryMethod === 'delivery' ? 'bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-500' : 'bg-white hover:bg-amber-50 border border-amber-200'}`}>
              <MapPin className="w-5 h-5 mr-2 text-amber-600" /> <span>Entrega</span>
            </button>
            <button type="button" onClick={() => setDeliveryMethod('pickup')} className={`p-4 rounded-xl flex items-center transition-all duration-200 ${deliveryMethod === 'pickup' ? 'bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-500' : 'bg-white hover:bg-amber-50 border border-amber-200'}`}>
              <Building2 className="w-5 h-5 mr-2 text-amber-600" /> <span>Retirar no Local</span>
            </button>
          </div>
        </div>

        {/* Endereço */}
        {deliveryMethod === 'delivery' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">3. Endereço de Entrega</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Rua</label>
                <input type="text" required value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="elegant-input" placeholder="Nome da rua" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Número</label>
                <input type="text" required value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} className="elegant-input" placeholder="Número" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Complemento</label>
                <input type="text" value={address.complement || ''} onChange={(e) => setAddress({ ...address, complement: e.target.value })} className="elegant-input" placeholder="Apto, Bloco, etc. (opcional)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bairro</label>
                <select required value={address.neighborhood} onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })} className="elegant-input">
                  <option value="">Selecione o bairro</option>
                  {allNeighborhoods.map(({ name, fee }) => (
                    <option key={name} value={name}>
                      {name} - Taxa de entrega: R$ {fee.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cidade</label>
                <input type="text" required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="elegant-input" placeholder="Sua cidade" />
              </div>
            </div>
          </div>
        )}

        {/* Forma de Pagamento */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">4. Forma de Pagamento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['pix', 'credit', 'debit', 'cash'].map(method => (
              <button key={method} type="button" onClick={() => setPaymentMethod(method as PaymentMethod)} className={`p-4 rounded-xl flex items-center transition-all duration-200 ${paymentMethod === method ? 'bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-500' : 'bg-white hover:bg-amber-50 border border-amber-200'}`}>
                {method === 'pix' && <QrCode className="w-5 h-5 mr-2 text-amber-600" />}
                {method === 'credit' && <CreditCard className="w-5 h-5 mr-2 text-amber-600" />}
                {method === 'debit' && <CreditCard className="w-5 h-5 mr-2 text-amber-600" />}
                {method === 'cash' && <Wallet className="w-5 h-5 mr-2 text-amber-600" />}
                <span>{method === 'pix' ? 'PIX' : method === 'cash' ? `Pagar na ${deliveryMethod === 'delivery' ? 'Entrega' : 'Retirada'}` : `Cartão de ${method === 'credit' ? 'Crédito' : 'Débito'}`}</span>
              </button>
            ))}
          </div>

          {paymentMethod === 'cash' && (
            <div className="mt-4 p-4 bg-amber-50 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-2">Precisa de troco? Para quanto?</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-700">R$</span>
                <input type="number" value={changeFor} onChange={(e) => setChangeFor(e.target.value)} className="elegant-input" placeholder="Digite o valor para troco (opcional)" min={finalTotal} step="0.01" />
              </div>
              {parseFloat(changeFor) > 0 && parseFloat(changeFor) < finalTotal && (
                <p className="text-red-600 text-sm mt-2">O valor deve ser maior que o total do pedido (R$ {finalTotal.toFixed(2)})</p>
              )}
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="flex gap-4 pt-6">
          <button type="button" onClick={onBack} className="flex-1 py-4 px-6 elegant-button-secondary flex items-center justify-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Voltar
          </button>
          <button type="submit" className="flex-1 py-4 px-6 elegant-button-primary">
            Finalizar Pedido
          </button>
        </div>
      </form>
    </div>
  );
}
