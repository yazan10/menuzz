// Client helper to trigger Telegram alerts for new orders & table reservations

export async function sendOrderTelegramAlert(order: any, restaurantName: string = 'مطعم القصر') {
  try {
    const res = await fetch('/api/telegram/send-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order, restaurantName })
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to dispatch order alert to Telegram API:', err);
    return { success: false, error: err };
  }
}

export async function sendReservationTelegramAlert(reservation: any, restaurantName: string = 'مطعم القصر') {
  try {
    const res = await fetch('/api/telegram/send-reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservation, restaurantName })
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to dispatch reservation alert to Telegram API:', err);
    return { success: false, error: err };
  }
}

export async function testTelegramBotPing(chatId?: string) {
  try {
    const res = await fetch('/api/telegram/test-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId })
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err };
  }
}

export async function getTelegramBotStatus() {
  try {
    const res = await fetch('/api/telegram/status');
    return await res.json();
  } catch (err) {
    return { success: false, error: err };
  }
}

export async function linkRestaurantTelegram(restaurantId: string, chatId: string, restaurantName: string) {
  try {
    const res = await fetch('/api/telegram/link-restaurant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurantId, chatId, restaurantName })
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err };
  }
}
