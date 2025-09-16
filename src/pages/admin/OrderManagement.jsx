import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaClock,
  FaCheck,
  FaTruck,
  FaBox,
  FaTimes,
  FaPlus,
  FaFilter
} from 'react-icons/fa';
import { useOrders } from '../../context/OrdersContext';
import './OrderManagement.css';

function OrderManagement() {
  const { 
    orders, 
    updateOrderStatus, 
    addOrderNote, 
    deleteOrder,
    searchOrders,
    ORDER_STATUSES,
    STATUS_LABELS,
    STATUS_COLORS
  } = useOrders();
  
  

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [newNote, setNewNote] = useState('');

  // Фильтрация заказов
  const filteredOrders = useMemo(() => {
    let result = orders;

    // Поиск
    if (searchQuery.trim()) {
      result = searchOrders(searchQuery);
    }

    // Фильтр по статусу
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, searchQuery, statusFilter, searchOrders]);

  // Статистика
  const stats = useMemo(() => {
    const today = new Date();
    const todayOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.toDateString() === today.toDateString();
    });

    return {
      total: orders.length,
      today: todayOrders.length,
      new: orders.filter(order => order.status === ORDER_STATUSES.NEW).length,
      processing: orders.filter(order => order.status === ORDER_STATUSES.PROCESSING).length,
      completed: orders.filter(order => order.status === ORDER_STATUSES.DELIVERED).length
    };
  }, [orders, ORDER_STATUSES]);

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleAddNote = (orderId) => {
    if (newNote.trim()) {
      addOrderNote(orderId, newNote.trim());
      setNewNote('');
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case ORDER_STATUSES.NEW:
        return <FaClock />;
      case ORDER_STATUSES.CONFIRMED:
        return <FaCheck />;
      case ORDER_STATUSES.PROCESSING:
        return <FaBox />;
      case ORDER_STATUSES.SHIPPED:
        return <FaTruck />;
      case ORDER_STATUSES.DELIVERED:
        return <FaCheck />;
      case ORDER_STATUSES.CANCELLED:
        return <FaTimes />;
      default:
        return <FaClock />;
    }
  };

  return (
    <div className="order-management">
      <div className="management-header" />

      {/* Статистика */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Всего заказов</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <div className="stat-number">{stats.today}</div>
            <div className="stat-label">Сегодня</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🆕</div>
          <div className="stat-info">
            <div className="stat-number">{stats.new}</div>
            <div className="stat-label">Новые</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚙️</div>
          <div className="stat-info">
            <div className="stat-number">{stats.processing}</div>
            <div className="stat-label">В обработке</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-number">{stats.completed}</div>
            <div className="stat-label">Завершены</div>
          </div>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div className="orders-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Поиск по номеру заказа, имени или телефону..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-box">
          <FaFilter className="filter-icon" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Все статусы</option>
            {Object.entries(STATUS_LABELS).map(([status, label]) => (
              <option key={status} value={status}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Список заказов */}
      <div className="orders-table">
        <div className="table-header">
          <div>Номер заказа</div>
          <div>Клиент</div>
          <div>Сумма</div>
          <div>Скидки</div>
          <div>Статус</div>
          <div>Дата</div>
          <div>Действия</div>
        </div>
        
        <AnimatePresence>
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              className="table-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="order-number">#{order.orderNumber}</div>
              <div className="customer-info">
                <div className="customer-name">{order.customerInfo.name}</div>
                <div className="customer-phone">{order.customerInfo.phone}</div>
              </div>
              <div className="order-total">
                {order.pricing.total.toLocaleString()} ₽
              </div>
              <div className="order-discounts">
                {order.pricing.discountAmount > 0 && (
                  <div className="discount-badge promotion">
                    🎯 -{order.pricing.discountAmount.toLocaleString()} ₽
                  </div>
                )}
                {order.pricing.promocodeDiscount > 0 && (
                  <div className="discount-badge promocode">
                    🏷️ -{order.pricing.promocodeDiscount.toLocaleString()} ₽
                  </div>
                )}
                {order.pricing.discountAmount === 0 && order.pricing.promocodeDiscount === 0 && (
                  <span className="no-discount">Нет скидок</span>
                )}
              </div>
              <div className="order-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: STATUS_COLORS[order.status] }}
                >
                  {getStatusIcon(order.status)}
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
              <div className="order-date">
                {formatDate(order.createdAt)}
              </div>
              <div className="order-actions">
                <button
                  className="action-btn view-btn"
                  onClick={() => handleViewOrder(order)}
                  title="Просмотр заказа"
                >
                  <FaEye />
                </button>
                <select
                  className="status-select"
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  title="Изменить статус"
                >
                  {Object.entries(STATUS_LABELS).map(([status, label]) => (
                    <option key={status} value={status}>{label}</option>
                  ))}
                </select>
                {order.status === ORDER_STATUSES.CANCELLED && (
                  <button
                    className="action-btn delete-btn"
                    onClick={() => deleteOrder(order.id)}
                    title="Удалить заказ"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredOrders.length === 0 && (
          <div className="no-orders">
            <FaBox className="no-orders-icon" />
            <h3>Заказы не найдены</h3>
            <p>Попробуйте изменить параметры поиска или фильтры</p>
          </div>
        )}
      </div>

      {/* Модальное окно детализации заказа */}
      <AnimatePresence>
        {showOrderDetails && selectedOrder && (
          <motion.div
            className="order-details-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="order-details-content"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div className="modal-header">
                <h3>Заказ #{selectedOrder.orderNumber}</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowOrderDetails(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="order-details-body">
                <div className="details-section">
                  <h4>Информация о клиенте</h4>
                  <div className="customer-details">
                    <p><strong>Имя:</strong> {selectedOrder.customerInfo.name}</p>
                    <p><strong>Телефон:</strong> {selectedOrder.customerInfo.phone}</p>
                    {selectedOrder.customerInfo.email && (
                      <p><strong>Email:</strong> {selectedOrder.customerInfo.email}</p>
                    )}
                    <p><strong>Способ получения:</strong> {
                      selectedOrder.customerInfo.deliveryMethod === 'pickup' ? 'Самовывоз' : 'Доставка'
                    }</p>
                    {selectedOrder.customerInfo.address && (
                      <p><strong>Адрес:</strong> {selectedOrder.customerInfo.address}</p>
                    )}
                    <p><strong>Способ оплаты:</strong> {
                      selectedOrder.customerInfo.paymentMethod === 'cash' ? 'Наличными' :
                      selectedOrder.customerInfo.paymentMethod === 'card' ? 'Банковской картой' :
                      'Банковский перевод'
                    }</p>
                    {selectedOrder.customerInfo.comment && (
                      <p><strong>Комментарий:</strong> {selectedOrder.customerInfo.comment}</p>
                    )}
                  </div>
                </div>

                <div className="details-section">
                  <h4>Товары в заказе</h4>
                  <div className="order-items">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-info">
                          <div className="item-title">{item.title}</div>
                          {item.brand && item.brand.trim() && <div className="item-brand">{item.brand}</div>}
                        </div>
                        <div className="item-quantity">×{item.quantity}</div>
                        <div className="item-price">
                          {(item.price * item.quantity).toLocaleString()} ₽
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-total-details">
                    <div className="total-line">
                      <span>Подытог:</span>
                      <span>{selectedOrder.pricing.subtotal.toLocaleString()} ₽</span>
                    </div>
                    
                    {/* Скидка по акции */}
                    {selectedOrder.pricing.discountAmount > 0 && (
                      <div className="total-line discount">
                        <span>Скидка по акции:</span>
                        <span>-{selectedOrder.pricing.discountAmount.toLocaleString()} ₽</span>
                      </div>
                    )}
                    
                    {/* Скидка по промокоду */}
                    {selectedOrder.pricing.promocodeDiscount > 0 && (
                      <div className="total-line promocode-discount">
                        <span>Скидка по промокоду:</span>
                        <span>-{selectedOrder.pricing.promocodeDiscount.toLocaleString()} ₽</span>
                      </div>
                    )}
                    
                    <div className="total-line final">
                      <span>Итого:</span>
                      <span>{selectedOrder.pricing.total.toLocaleString()} ₽</span>
                    </div>
                  </div>
                </div>

                {/* Информация о примененных скидках и промокодах */}
                {(selectedOrder.pricing.discountAmount > 0 || selectedOrder.pricing.promocodeDiscount > 0) && (
                  <div className="details-section">
                    <h4>Примененные скидки</h4>
                    <div className="discounts-info">
                      {selectedOrder.pricing.appliedPromotion && (
                        <div className="discount-item">
                          <div className="discount-type">🎯 Акция</div>
                          <div className="discount-details">
                            <div className="discount-title">{selectedOrder.pricing.appliedPromotion.title}</div>
                            <div className="discount-amount">-{selectedOrder.pricing.discountAmount.toLocaleString()} ₽</div>
                          </div>
                        </div>
                      )}
                      
                      {selectedOrder.pricing.appliedPromocode && (
                        <div className="discount-item">
                          <div className="discount-type">🏷️ Промокод</div>
                          <div className="discount-details">
                            <div className="promocode-code">{selectedOrder.pricing.appliedPromocode.code}</div>
                            <div className="promocode-description">{selectedOrder.pricing.appliedPromocode.description}</div>
                            <div className="discount-amount">-{selectedOrder.pricing.promocodeDiscount.toLocaleString()} ₽</div>
                            <div className="stackable-info">
                              {selectedOrder.pricing.appliedPromocode.stackable 
                                ? '✅ Суммируется с акциями' 
                                : '⚠️ Не суммируется с акциями'
                              }
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="details-section">
                  <h4>Заметки</h4>
                  <div className="notes-list">
                    {selectedOrder.notes.map((note) => (
                      <div key={note.id} className="note-item">
                        <div className="note-text">{note.text}</div>
                        <div className="note-date">{formatDate(note.timestamp)}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="add-note">
                    <input
                      type="text"
                      placeholder="Добавить заметку..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddNote(selectedOrder.id)}
                    />
                    <button
                      className="add-note-btn"
                      onClick={() => handleAddNote(selectedOrder.id)}
                      disabled={!newNote.trim()}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default OrderManagement;
