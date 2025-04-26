// src/services/api.ts
import axios from 'axios';
import { OrderDetails } from '../types';

// Configuração principal do axios com interceptor
const api = axios.create({
  baseURL: 'http://localhost:8081',
  withCredentials: true, // Mantém cookies para sessões logadas
});

// Interceptor de resposta para tratar erros globais
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('Erro na resposta:', error.response.data);
    } else {
      console.error('Erro na requisição:', error.message);
    }
    return Promise.reject(error);
  }
);

/** WHATSAPP + IMPRESSÃO */
export const generateMessage = (order: OrderDetails): string => {
  const marmitas = order.marmitas.map((m, index) => `🍱 Marmita ${index + 1} - ${m.size.toUpperCase()}`).join('\n');
  const address = order.deliveryMethod === 'delivery'
    ? `${order.address?.street}, ${order.address?.number}, ${order.address?.neighborhood} - ${order.address?.city}`
    : 'Retirada no local';
  return `
✅ *Pedido Confirmado!*
👤 Cliente: ${order.customerName}
📞 Telefone: ${order.phone}
${marmitas}
📍 Entrega: ${address}
💰 Total: R$ ${order.totalPrice.toFixed(2)}
💳 Pagamento: ${order.paymentMethod.toUpperCase()}
📝 Observações: ${order.observation || 'Nenhuma'}
  `;
};

export const sendOrder = async (order: OrderDetails) => {
  const message = generateMessage(order);
  const response = await api.post('/message/sendText/instanceName', {
    number: order.phone,
    options: { delay: 1200, presence: 'composing' },
    textMessage: { text: message },
  });
  return response.data;
};

export const silentPrint = (order: OrderDetails) => {
  const message = generateMessage(order);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html><head><title>Pedido - Impressão</title></head>
      <body style="font-family: monospace; white-space: pre-wrap; font-size: 14px;">
        ${message.replace(/\n/g, '<br />')}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
};

/** CRUD COMPLETOS */
// Produtos
export const createProduct = (data: { nomeProduto: string; valorProduto: number; isAtivo: boolean; categoriaProduto_id: number; }) => api.post('/produto', data);
export const getProducts = () => api.get('/produtos/count');
export const getProductById = (id: number) => api.get(`/produto/${id}`);
export const updateProduct = (id: number, data: Partial<{ nomeProduto: string; valorProduto: number; isAtivo: boolean; categoriaProduto_id: number; }>) => api.put(`/produto/${id}`, data);
export const deleteProduct = (id: number) => api.delete(`/produto/${id}`);
export const toggleProduct = (id: number) => api.put(`/produto/${id}/toggle`);

// Usuários
export const login = (username: string, password: string) => api.post('/login', { username, password });
export const getDashboard = () => api.get('/dashboard');
export const logout = () => api.get('/logout');
export const createUser = (data: { nome: string; cargo: string; isAdmin: boolean; username: string; password: string; }) => api.post('/user', data);
export const getUsers = () => api.get('/user');
export const getUserById = (id: number) => api.get(`/user/${id}`);
export const updateUser = (id: number, data: Partial<{ nome: string; cargo: string; isAdmin: boolean; username: string; password: string; }>) => api.put(`/user/${id}`, data);
export const deleteUser = (id: number) => api.delete(`/user/${id}`);

// Pedidos
export const createPedido = (data: { produtosPedido: { id: number; quantidade: number; }[]; valorTotalPedido: number; formaPagamento_id: number; isRetiradaEstabelecimento: boolean; nomeCliente: string; enderecoCliente?: string; }) => api.post('/pedido', data);
export const getPedidos = () => api.get('/pedido');
export const getPedidosByPagamento = (formaPagamento_id: number) => api.get(`/pedido/formaPagamento/${formaPagamento_id}`);
export const updatePedido = (id: number, data: Partial<{ produtosPedido: { id: number; quantidade: number; }[]; valorTotalPedido: number; formaPagamento_id: number; isRetiradaEstabelecimento: boolean; nomeCliente: string; enderecoCliente: string; }>) => api.put(`/pedido/${id}`, data);

// Formas de Pagamento
export const createFormaPagamento = (data: { nomeFormaPagamento: string; }) => api.post('/formaPagamento', data);
export const getFormasPagamento = () => api.get('/formaPagamento');
export const updateFormaPagamento = (id: number, data: Partial<{ nomeFormaPagamento: string; }>) => api.put(`/formaPagamento/${id}`, data);
export const deleteFormaPagamento = (id: number) => api.delete(`/formaPagamento/${id}`);

// Categorias de Produtos
export const createCategoriaProduto = (data: { nomeCategoriaProduto: string; }) => api.post('/categoriaProduto', data);
export const getCategoriasProduto = () => api.get('/categoriaProduto');
export const getCategoriaProdutoById = (id: number) => api.get(`/categoriaProduto/${id}`);
export const updateCategoriaProduto = (id: number, data: Partial<{ nomeCategoriaProduto: string; }>) => api.put(`/categoriaProduto/${id}`, data);
export const deleteCategoriaProduto = (id: number) => api.delete(`/categoriaProduto/${id}`);

export default api;
