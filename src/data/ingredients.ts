import { Ingredient, ExtraItem, DeliveryZone } from '../types';

export const initialIngredients: Ingredient[] = [
  // Arroz
  { id: 'rice-1', name: 'Arroz Branco', category: 'rice', active: true },

  // Feijões
  { id: 'beans-1', name: 'Feijão Tropeiro', category: 'beans', active: true },
  { id: 'beans-2', name: 'Feijão de Caldo', category: 'beans', active: true },
  { id: 'beans-3', name: 'Feijoada', category: 'beans', active: true },

  // Carnes
  { id: 'meat-1', name: 'Vaca na Chapa', category: 'meat', active: true },
  { id: 'meat-2', name: 'Linguiça na Chapa', category: 'meat', active: true },
  { id: 'meat-3', name: 'Porco na Chapa', category: 'meat', active: true },
  { id: 'meat-4', name: 'Filé de Frango na Chapa', category: 'meat', active: true },
  { id: 'meat-5', name: 'Costela com Mandioca', category: 'meat', active: true },
  { id: 'meat-6', name: 'Carne Cozida com Mandioca', category: 'meat', active: true },
  { id: 'meat-7', name: 'Frango ao Molho', category: 'meat', active: true },
  { id: 'meat-8', name: 'Almôndegas ao Molho', category: 'meat', active: true },
  { id: 'meat-9', name: 'Strogonoff de Frango', category: 'meat', active: true },
  { id: 'meat-10', name: 'Filé de Frango Empanado', category: 'meat', active: true },
  { id: 'meat-11', name: 'Filé de Peixe Empanado', category: 'meat', active: true },
  { id: 'meat-12', name: 'Frango Frito', category: 'meat', active: true },
  { id: 'meat-13', name: 'Bife de Porco Acebolado', category: 'meat', active: true },
  { id: 'meat-14', name: 'Carne Picadinha ao Molho', category: 'meat', active: true },

  // Acompanhamentos
  { id: 'sides-1', name: 'Macarrão Vermelho', category: 'sides', active: true },
  { id: 'sides-2', name: 'Macarrão Alho e Óleo', category: 'sides', active: true },
  { id: 'sides-3', name: 'Batata Doce Cozida', category: 'sides', active: true },
  { id: 'sides-4', name: 'Batata Doce Frita', category: 'sides', active: true },
  { id: 'sides-5', name: 'Batata com Maionese e Bacon', category: 'sides', active: true },
  { id: 'sides-6', name: 'Maionese', category: 'sides', active: true },
  { id: 'sides-7', name: 'Cenoura', category: 'sides', active: true },
  { id: 'sides-8', name: 'Abobrinha', category: 'sides', active: true },
  { id: 'sides-9', name: 'Abobrinha com Milho', category: 'sides', active: true },
  { id: 'sides-10', name: 'Abóbora Kabotiá', category: 'sides', active: true },
  { id: 'sides-11', name: 'Chuchu', category: 'sides', active: true },
  { id: 'sides-12', name: 'Chuchu com Milho', category: 'sides', active: true },
  { id: 'sides-13', name: 'Beterraba', category: 'sides', active: true },
  { id: 'sides-14', name: 'Couve-flor', category: 'sides', active: true },
  { id: 'sides-15', name: 'Brócolis', category: 'sides', active: true },
  { id: 'sides-16', name: 'Farofa', category: 'sides', active: true },
  { id: 'sides-17', name: 'Farofa de Cenoura', category: 'sides', active: true },
  { id: 'sides-18', name: 'Farofa de Jiló', category: 'sides', active: true },
  { id: 'sides-19', name: 'Batata Palha', category: 'sides', active: true },
  { id: 'sides-20', name: 'Purê de Batata', category: 'sides', active: true },
  { id: 'sides-21', name: 'Batata na Manteiga', category: 'sides', active: true },
  { id: 'sides-22', name: 'Quiabo', category: 'sides', active: true },
  { id: 'sides-23', name: 'Jiló', category: 'sides', active: true },
  { id: 'sides-24', name: 'Couve', category: 'sides', active: true },
  { id: 'sides-25', name: 'Batata Assada', category: 'sides', active: true },
  { id: 'sides-26', name: 'Repolho com Bacon', category: 'sides', active: true },
  { id: 'sides-27', name: 'Mandioca Frita', category: 'sides', active: true },

  // Saladas
  { id: 'salad-1', name: 'Salada de Alface e Tomate', category: 'salads', active: true },
  { id: 'salad-2', name: 'Salada de Alface, Repolho e Tomate', category: 'salads', active: true },
];

export const extraItems: ExtraItem[] = [
  { id: 'extra-1', name: 'Ovo Frito', price: 2.00, active: true },
  { id: 'extra-2', name: 'Carne Extra', price: 3.00, active: true },
  { id: 'extra-3', name: 'Banana Frita', price: 3.00, active: true },
];

export const marmitaPrices = {
  small: 15.00,
  medium: 18.00,
  large: 22.00,
};

export const deliveryZones: DeliveryZone[] = [
  {
    id: 'zone-1',
    name: 'Zona 1',
    fee: 1.00,
    neighborhoods: [
      'Pq. Santa Cruz',
      'Pq. Flamboyant',
      'PUC',
      'Portaria de condomínios',
      'Salão de assembleia'
    ]
  },
  {
    id: 'zone-2',
    name: 'Zona 2',
    fee: 2.00,
    neighborhoods: [
      'Jd. Bela Vista',
      'Jd. Olímpico',
      'Pq. Trindade 1',
      'Pq. Trindade 2',
      'Jd. Da Luz',
      'Pq. Laranjeiras',
      'Jd. Vitória 1',
      'Jd. Vitória 2',
      'Vila Alto da Glória'
    ]
  },
  {
    id: 'zone-3',
    name: 'Zona 3',
    fee: 3.00,
    neighborhoods: [
      'Pq. Atheneu',
      'Pq. Trindade 3',
      'Pq. São Jorge',
      'Jd. Mariliza',
      'Condomínios Jardins'
    ]
  }
];

export const deliveryTimes = {
  delivery: {
    min: 60,
    max: 90
  },
  pickup: {
    min: 20,
    max: 20
  }
};