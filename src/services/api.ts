import axios from 'axios';
import { OrderDetails } from '../types';

declare const window: any;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// ✅ Adiciona token no header Authorization
api.interceptors.request.use(config => {
  const token = import.meta.env.VITE_EVOLUTION_TOKEN;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

const INSTANCE = import.meta.env.VITE_EVOLUTION_INSTANCE;

// ✅ Interceptor para logar erros da API
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

/** WHATSAPP */
export const generateMessage = (order: OrderDetails): string => {
  const marmitas = order.marmitas
    .map((m, index) => `🍱 Marmita ${index + 1} - ${m.size.toUpperCase()}`)
    .join('\n');

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

// ✅ Endpoint correto para sua versão da Evolution API
export const sendOrder = async (order: OrderDetails) => {
  const message = generateMessage(order);

  const response = await api.post(`/message/sendText/${INSTANCE}`, {
    number: order.phone,
    options: { delay: 1200, presence: 'composing' },
    textMessage: { text: message },
  });

  return response.data;
};

/** IMPRESSÃO LOCAL ESTILO COMANDA */
export const silentPrint = (order: OrderDetails) => {
  const lines: string[] = [];
  lines.push('============================');
  lines.push('       COMANDA DE PEDIDO');
  lines.push('============================');
  lines.push(`Cliente: ${order.customerName}`);
  lines.push(`Telefone: ${order.phone}`);
  lines.push('----------------------------');
  lines.push(order.deliveryMethod === 'delivery'
    ? `Entrega: ${order.address?.street}, ${order.address?.number}, ${order.address?.neighborhood} - ${order.address?.city}`
    : 'Retirada no Local');
  lines.push('----------------------------');
  order.marmitas.forEach((m, i) => {
    lines.push(`MARMITA ${i + 1} - ${m.size.toUpperCase()}`);
    lines.push('Ingredientes:');
    m.ingredients.forEach(ing => lines.push(`- ${ing}`));
    if (m.extras?.length) {
      lines.push('Extras:');
      m.extras.forEach(ext => lines.push(`+ ${ext}`));
    }
    lines.push('----------------------------');
  });
  lines.push(`TOTAL: R$ ${order.totalPrice.toFixed(2)}`);
  lines.push(`Pagamento: ${order.paymentMethod.toUpperCase()}`);
  if (order.observation) {
    lines.push('OBSERVAÇÕES:');
    lines.push(order.observation);
  }
  lines.push('============================');

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head><title>Imprimir Pedido</title></head>
        <body style="font-family: monospace; font-size: 14px; white-space: pre;">
          ${lines.join('\n')}
        </body>
      </html>
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
