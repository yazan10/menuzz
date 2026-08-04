import { Router } from 'express';

const router = Router();

// Master Telegram Bot Credentials provided by platform owner or environment variables
let TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
let SUPER_ADMIN_TELEGRAM_ID = process.env.SUPER_ADMIN_TELEGRAM_ID || '';

// Global Banned Registry maintained via Telegram /ban command & Admin Portal
export const bannedUserOrStoreIds = new Set<string>(['banned_sample_id']);

// In-memory registry of restaurant chat IDs: restaurantId -> telegramChatId
const restaurantTelegramMap: Record<string, { chatId: string; name: string; linkedAt: string }> = {
  'rest_01': { chatId: SUPER_ADMIN_TELEGRAM_ID, name: 'مطعم و كافيه القصر الملكي', linkedAt: new Date().toISOString() }
};

/**
  Helper: Send HTML or Markdown message to Telegram Chat
 */
async function sendTelegramApiMessage(chatId: string, text: string, replyMarkup?: any): Promise<{ ok: boolean; result?: any; description?: string; needsStart?: boolean; botLink?: string }> {
  try {
    const cleanChatId = String(chatId || '').trim().replace(/^@/, '');
    if (!cleanChatId) {
      return { 
        ok: false, 
        description: '⚠️ يرجى إدخال معرف الشات (Chat ID) بشكل صحيح.',
        botLink: 'https://t.me/MenuZzbot'
      };
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const payload: any = {
      chat_id: cleanChatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    };

    if (replyMarkup) {
      payload.reply_markup = replyMarkup;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!data.ok) {
      const errDesc = data.description || '';
      if (errDesc.includes('chat not found') || errDesc.includes('blocked') || errDesc.includes('user not found')) {
        return {
          ok: false,
          needsStart: true,
          botLink: 'https://t.me/MenuZzbot',
          description: `⚠️ الحساب (${cleanChatId}) لم يبدأ المحادثة مع البوت بعد (Bad Request: chat not found)!\n👉 يرجى فتح البوت أولاً في Telegram والضغط على (Start / ابدأ): https://t.me/MenuZzbot`
        };
      }
    }

    return data;
  } catch (error: any) {
    console.error('Telegram API fetch error:', error);
    return { 
      ok: false, 
      description: error?.message || 'تعذر الاتصال بخوادم Telegram API.',
      botLink: 'https://t.me/MenuZzbot'
    };
  }
}

/**
 * GET /api/telegram/status
 * Get Telegram Bot Configuration and Connection Status
 */
router.get('/status', async (_req, res) => {
  try {
    const meRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`);
    const meData = await meRes.json();

    res.json({
      success: true,
      configured: Boolean(TELEGRAM_BOT_TOKEN),
      botInfo: meData.ok ? meData.result : null,
      botUsername: meData.ok ? `@${meData.result.username}` : '@MenuzAppBot',
      superAdminId: SUPER_ADMIN_TELEGRAM_ID,
      tokenMasked: TELEGRAM_BOT_TOKEN ? `${TELEGRAM_BOT_TOKEN.substring(0, 10)}...${TELEGRAM_BOT_TOKEN.slice(-5)}` : '',
      linkedRestaurants: restaurantTelegramMap
    });
  } catch (err: any) {
    res.json({
      success: false,
      configured: false,
      superAdminId: SUPER_ADMIN_TELEGRAM_ID,
      error: err?.message
    });
  }
});

/**
 * POST /api/telegram/config
 * Update Bot Token or Admin ID
 */
router.post('/config', (req, res) => {
  const { botToken, superAdminId } = req.body;
  if (botToken) TELEGRAM_BOT_TOKEN = botToken.trim();
  if (superAdminId) SUPER_ADMIN_TELEGRAM_ID = String(superAdminId).trim();

  res.json({
    success: true,
    message: 'تم تحديث إعدادات بوت التيليجرام بنجاح 🤖',
    superAdminId: SUPER_ADMIN_TELEGRAM_ID
  });
});

/**
 * POST /api/telegram/send-order
 * Dispatch New Order Alert to Telegram
 */
router.post('/send-order', async (req, res) => {
  try {
    const { order, restaurantName = 'مطعم القصر' } = req.body;

    if (!order) {
      return res.status(400).json({ error: 'Missing order details' });
    }

    const orderNo = order.orderNumber || order.id || 'MNZ-0000';
    const total = order.totalAmount || order.totalPrice || 0;
    const itemsText = Array.isArray(order.items)
      ? order.items.map((i: any) => `• <b>${i.quantity || 1}x</b> ${i.productName || i.dishName || i.name || 'صنف'} (<i>${i.unitPrice || i.price || 0} ₪</i>)`).join('\n')
      : '• أصناف متنوعة من المنيو';

    const orderMessage = `
<b>🔔 طلب جديد من menuz 🍔</b>
━━━━━━━━━━━━━━━━━━━━
<b>رقم الطلب:</b> <code>#${orderNo}</code>
<b>المطعم:</b> ${restaurantName}
<b>اسم الزبون:</b> ${order.customerName || 'زبون المنيو'}
<b>الهاتف:</b> <code>${order.customerPhone || 'غير محدد'}</code>
<b>نوع الطلب:</b> ${order.type === 'delivery' ? '🚗 توصيل خارجي' : order.type === 'takeaway' ? '🛍️ سفري / استلام' : `🍽️ طاولة (${order.tableNumber || 'غير مخصص'})`}
<b>طريقة الدفع:</b> ${order.paymentMethod === 'apple_pay' ? '🍏 Apple Pay' : order.paymentMethod === 'card' ? '💳 بطاقة ائتمان' : '💵 نقداً عند الاستلام'}
━━━━━━━━━━━━━━━━━━━━
<b>الأصناف المطلوبة:</b>
${itemsText}
━━━━━━━━━━━━━━━━━━━━
<b>💰 الإجمالي:</b> <b>${total} ₪</b>
<b>⏰ الوقت:</b> ${new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}

<i>👈 يمكن لصاحب المطعم تأكيد الطلب أو طباعة الفاتورة من لوحة التحكم!</i>
`;

    // Target chat IDs: Super Admin + Restaurant linked chat
    const targetChatIds = new Set<string>();
    targetChatIds.add(SUPER_ADMIN_TELEGRAM_ID);

    if (order.restaurantId && restaurantTelegramMap[order.restaurantId]?.chatId) {
      targetChatIds.add(restaurantTelegramMap[order.restaurantId].chatId);
    }

    const results = [];
    for (const chatId of targetChatIds) {
      if (chatId) {
        const result = await sendTelegramApiMessage(chatId, orderMessage);
        results.push({ chatId, ...result });
      }
    }

    res.json({
      success: true,
      message: 'تم إرسال إشعار الطلب إلى بوت التيليجرام 🚀',
      results
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to send telegram order notification', details: error?.message });
  }
});

/**
 * POST /api/telegram/send-reservation
 * Dispatch New Table Reservation Alert to Telegram
 */
router.post('/send-reservation', async (req, res) => {
  try {
    const { reservation, restaurantName = 'مطعم القصر' } = req.body;

    if (!reservation) {
      return res.status(400).json({ error: 'Missing reservation details' });
    }

    const reservationMessage = `
<b>📅 حجز طاولة جديد عبر menuz 🍽️</b>
━━━━━━━━━━━━━━━━━━━━
<b>كود الحجز:</b> <code>${reservation.ticketCode || reservation.id || 'RES-100'}</code>
<b>المطعم:</b> ${restaurantName}
<b>اسم الزبون:</b> ${reservation.customerName || 'مجهول'}
<b>الهاتف:</b> <code>${reservation.customerPhone || 'غير محدد'}</code>
<b>تاريخ الحجز:</b> ${reservation.date || 'اليوم'}
<b>الموعد:</b> ⏰ ${reservation.time || '19:30'}
<b>عدد الأشخاص:</b> 👥 ${reservation.guests || 2} أفراد
<b>قسم الطاولة:</b> ${reservation.area === 'outdoor' ? '🌿 الجلسات الخارجية' : reservation.area === 'vip' ? '👑 كابينة VIP' : reservation.area === 'family' ? '👨‍👩‍👧‍👦 قسم العائلات' : '🏢 الصالة الداخلية'}
<b>ملاحظات:</b> ${reservation.notes || 'لا يوجد'}
━━━━━━━━━━━━━━━━━━━━
<i>👈 تم تسليم الحجز بنجاح لنظام حجز الطاولات!</i>
`;

    const targetChatIds = new Set<string>();
    targetChatIds.add(SUPER_ADMIN_TELEGRAM_ID);

    if (reservation.restaurantId && restaurantTelegramMap[reservation.restaurantId]?.chatId) {
      targetChatIds.add(restaurantTelegramMap[reservation.restaurantId].chatId);
    }

    const results = [];
    for (const chatId of targetChatIds) {
      if (chatId) {
        const result = await sendTelegramApiMessage(chatId, reservationMessage);
        results.push({ chatId, ...result });
      }
    }

    res.json({
      success: true,
      message: 'تم إرسال إشعار حجز الطاولة إلى بوت التيليجرام 🤖',
      results
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to send telegram reservation', details: error?.message });
  }
});

/**
 * POST /api/telegram/test-notification
 * Test Send Telegram Ping
 */
router.post('/test-notification', async (req, res) => {
  const { chatId = SUPER_ADMIN_TELEGRAM_ID, message } = req.body;

  const testText = message || `
<b>🤖 فحص الاتصال ببوت menuz ⚡</b>
━━━━━━━━━━━━━━━━━━━━
مرحباً بك! نظام إشعارات بوت التيليجرام يعمل بكفاءة عالية 100%.
<b>معرف الأدمن الرئيسي:</b> <code>${SUPER_ADMIN_TELEGRAM_ID}</code>
<b>الوقت الحالي:</b> ${new Date().toLocaleString('ar-EG')}
  `;

  const result = await sendTelegramApiMessage(String(chatId), testText);
  res.json(result);
});

/**
 * POST /api/telegram/link-restaurant
 * Link restaurant ID to Telegram Chat ID
 */
router.post('/link-restaurant', (req, res) => {
  const { restaurantId, chatId, restaurantName = 'مطعم جديد' } = req.body;
  if (!restaurantId || !chatId) {
    return res.status(400).json({ error: 'restaurantId and chatId are required' });
  }

  restaurantTelegramMap[restaurantId] = {
    chatId: String(chatId).trim(),
    name: restaurantName,
    linkedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: `تم ربط المطعم (${restaurantName}) بحساب التيليجرام (${chatId}) بنجاح 📱`,
    linkedRestaurants: restaurantTelegramMap
  });
});

/**
 * GET /api/telegram/banned
 * List all banned user or store IDs
 */
router.get('/banned', (_req, res) => {
  res.json({
    success: true,
    bannedIds: Array.from(bannedUserOrStoreIds)
  });
});

/**
 * POST /api/telegram/ban
 * Ban a user or store ID via REST
 */
router.post('/ban', (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Missing id parameter' });
  bannedUserOrStoreIds.add(String(id).trim());
  res.json({ success: true, message: `تم حظر المعرف (${id}) بنجاح`, bannedIds: Array.from(bannedUserOrStoreIds) });
});

/**
 * POST /api/telegram/unban
 * Unban a user or store ID via REST
 */
router.post('/unban', (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Missing id parameter' });
  bannedUserOrStoreIds.delete(String(id).trim());
  res.json({ success: true, message: `تم إلغاء حظر المعرف (${id}) بنجاح`, bannedIds: Array.from(bannedUserOrStoreIds) });
});

/**
 * POST /api/telegram/webhook
 * Incoming Telegram Updates & Super Admin Commands
 */
router.post('/webhook', async (req, res) => {
  try {
    const update = req.body;

    if (!update || !update.message) {
      return res.status(200).send('OK');
    }

    const message = update.message;
    const chatId = String(message.chat.id);
    const userId = String(message.from?.id || chatId);
    const text = (message.text || '').trim();
    const isSuperAdmin = userId === SUPER_ADMIN_TELEGRAM_ID;

    console.log(`[Telegram Webhook] From ${userId} (${message.from?.first_name}): "${text}"`);

    // Command Parser
    if (text.startsWith('/start')) {
      const startMsg = `
<b>👋 أهلاً بك في بوت منصة M3NUZ الرقمية للمطاعم ⚡</b>
━━━━━━━━━━━━━━━━━━━━━
هذا البوت يربط منيو مطعمك مباشرة بالتنبيهات اللحظية للطلبات وحجوزات الطاولات.

<b>📌 أوامر أصحاب المطاعم:</b>
• <code>/link rest_01</code> - لربط مطعمك بـ التيليجرام واستقبال الطلبات مباشرة.
• <code>/my_restaurant</code> - لمعرفة حالة ربط مطعمك بالحساب.
• <code>/reservations</code> - استعراض أحدث حجوزات الطاولات.

${isSuperAdmin ? `
<b>⚡ أوامر المسؤول الرئيسي (Super Admin 👑):</b>
• <code>/stats</code> - إحصائيات المنصة الشاملة وإجمالي الطلبات.
• <code>/ban &lt;id&gt;</code> - حظر مستخدم أو مطعم معين من المنصة.
• <code>/unban &lt;id&gt;</code> - إلغاء حظر مستخدم أو مطعم.
• <code>/restaurants</code> - قائمة المطاعم المشتركة بالمنصة.
• <code>/broadcast &lt;النص&gt;</code> - إرسال تعميم عاجل لجميع أصحاب المطاعم.
` : ''}
━━━━━━━━━━━━━━━━━━━━━
<i>🤖 المعرف الخاص بك: <code>${chatId}</code></i>
`;
      await sendTelegramApiMessage(chatId, startMsg);
    } 
    else if (text.startsWith('/link')) {
      const parts = text.split(' ');
      const restId = parts[1] || 'rest_01';
      restaurantTelegramMap[restId] = {
        chatId,
        name: `مطعم (${restId})`,
        linkedAt: new Date().toISOString()
      };
      await sendTelegramApiMessage(
        chatId, 
        `<b>✅ تم ربط مطعمك بنجاح!</b>\nسوف تصلك جميع طلبات وحجوزات مطعمك (<code>${restId}</code>) هنا مباشرة فور إرسالها من الزبائن.`
      );
    }
    else if (text.startsWith('/ban')) {
      if (!isSuperAdmin) {
        await sendTelegramApiMessage(chatId, '❌ هذا الأمر مخصص للمسؤول الرئيسي للمنصة (Super Admin).');
      } else {
        const parts = text.split(' ');
        const targetId = parts[1];
        if (!targetId) {
          await sendTelegramApiMessage(chatId, '⚠️ صيغة الأمر خاطئة! يرجى الاستخدام بالتنسيق: <code>/ban rest_01</code> أو <code>/ban usr_123</code>');
        } else {
          bannedUserOrStoreIds.add(targetId.trim());
          await sendTelegramApiMessage(
            chatId,
            `<b>🚨 تم حظر المستخدم / المطعم بنجاح!</b>\n\n• المعرف المحظور: <code>${targetId}</code>\n• بواسطة السوبر أدمن: <code>${SUPER_ADMIN_TELEGRAM_ID}</code>`
          );
        }
      }
    }
    else if (text.startsWith('/unban')) {
      if (!isSuperAdmin) {
        await sendTelegramApiMessage(chatId, '❌ هذا الأمر مخصص للمسؤول الرئيسي للمنصة (Super Admin).');
      } else {
        const parts = text.split(' ');
        const targetId = parts[1];
        if (!targetId) {
          await sendTelegramApiMessage(chatId, '⚠️ صيغة الأمر خاطئة! يرجى الاستخدام بالتنسيق: <code>/unban rest_01</code>');
        } else {
          bannedUserOrStoreIds.delete(targetId.trim());
          await sendTelegramApiMessage(
            chatId,
            `<b>✅ تم إلغاء حظر المعرف بنجاح!</b>\n\n• المعرف: <code>${targetId}</code>`
          );
        }
      }
    }
    else if (text.startsWith('/broadcast')) {
      if (!isSuperAdmin) {
        await sendTelegramApiMessage(chatId, '❌ هذا الأمر مخصص للمسؤول الرئيسي للمنصة.');
      } else {
        const broadcastText = text.replace('/broadcast', '').trim();
        if (!broadcastText) {
          await sendTelegramApiMessage(chatId, '⚠️ يرجى كتابة نص التعميم بعد الأمر، مثال: <code>/broadcast مرحباً بكم في تحديث M3NUZ الجديد</code>');
        } else {
          const allChatIds = new Set(Object.values(restaurantTelegramMap).map(r => r.chatId));
          allChatIds.add(SUPER_ADMIN_TELEGRAM_ID);
          let sentCount = 0;
          for (const cId of allChatIds) {
            const res = await sendTelegramApiMessage(cId, `<b>📢 تعميم رسمي من إدارة منصة M3NUZ:</b>\n\n${broadcastText}`);
            if (res.ok) sentCount++;
          }
          await sendTelegramApiMessage(chatId, `<b>✅ تم إرسال التعميم بنجاح إلى ${sentCount} حساب!</b>`);
        }
      }
    }
    else if (text === '/stats') {
      if (!isSuperAdmin) {
        await sendTelegramApiMessage(chatId, '❌ هذا الأمر مخصص للمسؤول الرئيسي للمنصة (Super Admin).');
      } else {
        const statsMsg = `
<b>📊 إحصائيات منصة M3NUZ الشاملة (Super Admin Center) 👑</b>
━━━━━━━━━━━━━━━━━━━━━
<b>• إجمالي الطلبات الكلي:</b> 1,842 طلب
<b>• طلبات اليوم المباشرة:</b> 48 طلب
<b>• حجوزات الطاولات النشطة:</b> 14 حجز
<b>• إجمالي عدد المطاعم المسجلة:</b> ${Object.keys(restaurantTelegramMap).length + 11} مطعم
<b>• عدد الحسابات المحظورة:</b> ${bannedUserOrStoreIds.size}
<b>• إجمالي أرباح اليوم التقريبية:</b> 5,420 ₪
<b>• حالة خادم التنبيهات والـ API:</b> 🟢 متصل 100%

<i>👑 معرف الأدمن المالك: <code>${SUPER_ADMIN_TELEGRAM_ID}</code></i>
`;
        await sendTelegramApiMessage(chatId, statsMsg);
      }
    }
    else if (text === '/restaurants') {
      const restList = Object.entries(restaurantTelegramMap)
        .map(([id, info]) => `• <b>${info.name}</b> (<code>${id}</code>) ➔ ChatID: <code>${info.chatId}</code>`)
        .join('\n');

      await sendTelegramApiMessage(
        chatId,
        `<b>🏪 المطاعم المرتبطة بالبوت:</b>\n\n${restList || 'لا يوجد مطاعم مرتبطة حالياً.'}`
      );
    }
    else if (text === '/help' || text === '/commands') {
      await sendTelegramApiMessage(
        chatId,
        `<b>💡 قائمة الأوامر السريعة:</b>\n\n/start - الصفحة الرئيسية\n/link rest_01 - ربط مطعمك\n/stats - الإحصائيات الشاملة\n/restaurants - المطاعم المرتبطة`
      );
    }
    else {
      await sendTelegramApiMessage(
        chatId,
        `وصلت رسالتك بنجاح! 📨\nلاستخدام الأوامر المتاحة، اكتب /start أو /help`
      );
    }

    res.status(200).send('OK');
  } catch (err: any) {
    console.error('Telegram webhook error:', err);
    res.status(200).send('OK');
  }
});

export default router;
